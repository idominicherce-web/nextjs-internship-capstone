import { eq, inArray, or } from "drizzle-orm";
import { CalendarGrid } from "@/components/calendar/calendar-grid";
import { CalendarLegend } from "@/components/calendar/calendar-legend";
import { CalendarStats } from "@/components/calendar/calendar-stats";
import type { CalendarTask, TaskType } from "@/components/calendar/types";
import { Upcomingquests } from "@/components/calendar/upcoming-quests";
import { getOrCreateDbUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { projectMembers, projects, users } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
	const dbUser = await getOrCreateDbUser();

	if (!dbUser) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-[#15100C] p-4 text-center font-serif text-[#D7B05C]">
				<div className="w-full max-w-md rounded-xs border-2 border-[#8F6236] bg-[#2D1B10] p-6 shadow-2xl sm:p-8">
					<h2 className="text-lg font-black uppercase tracking-widest text-[#F8EEDB] sm:text-xl">
						Access Denied
					</h2>
					<p className="mt-2 font-sans text-xs text-[#D7B05C]/70">
						Unauthorized traveler. Please enter through the gatekeeper.
					</p>
				</div>
			</div>
		);
	}

	// 1. Fetch project IDs where user is an assigned member
	const memberRecords = await db
		.select({ projectId: projectMembers.projectId })
		.from(projectMembers)
		.where(eq(projectMembers.userId, dbUser.id));

	const assignedProjectIds = memberRecords.map((m) => m.projectId);

	// 2. Fetch projects owned OR assigned via projectMembers
	const projectCondition =
		assignedProjectIds.length > 0
			? or(
					eq(projects.userId, dbUser.id),
					inArray(projects.id, assignedProjectIds),
				)
			: eq(projects.userId, dbUser.id);

	const userProjects = await db.query.projects.findMany({
		where: projectCondition,
		with: {
			lists: {
				with: {
					tasks: {
						with: {
							user: true,
						},
					},
				},
			},
		},
	});

	// 3. Fetch workspace users for assignee selection
	const workspaceUsers = await db.select().from(users);

	// 4. Format project options for CreateTaskModal
	const formattedProjects = userProjects.map((p) => ({
		id: p.id,
		name: p.name,
		lists: p.lists.map((l) => ({ id: l.id, name: l.name })),
	}));

	// 5. Transform DB tasks into CalendarTask view models
	const realTasks: CalendarTask[] = userProjects.flatMap((project) =>
		project.lists.flatMap((list) => {
			const isDone =
				list.name.toLowerCase().includes("done") ||
				list.name.toLowerCase().includes("complete");

			return list.tasks
				.filter((task) => task.dueDate)
				.map((task) => {
					let taskType: TaskType = "deadline";
					if (isDone) taskType = "completed";
					else if (
						task.title.toLowerCase().includes("review") ||
						task.title.toLowerCase().includes("sync")
					) {
						taskType = "meeting";
					} else if (
						task.title.toLowerCase().includes("launch") ||
						task.title.toLowerCase().includes("v1")
					) {
						taskType = "milestone";
					}

					return {
						id: task.id,
						title: task.title,
						projectName: project.name,
						dueDate: new Date(task.dueDate!),
						type: taskType,
						isCompleted: isDone,
						priority: (task.priority || "Medium") as
							| "Low"
							| "Medium"
							| "High"
							| "Urgent",
						assignedTo:
							task.user?.name ||
							(task.user?.email ? task.user.email.split("@")[0] : "Unassigned"),
					};
				});
		}),
	);

	const totalTasksCount = realTasks.length;
	const completedTasksCount = realTasks.filter((t) => t.isCompleted).length;
	const deadlinesThisWeekCount = realTasks.filter((t) => !t.isCompleted).length;

	return (
		<div className="relative min-h-screen w-full min-w-0 bg-[#15100C] font-serif text-[#F8EEDB] antialiased p-3 sm:p-6 lg:p-8">
			{/* Vignette */}
			<div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_10%,rgba(215,176,92,0.12),transparent_55%)]" />
			<div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_50%,transparent_15%,rgba(0,0,0,0.88)_100%)]" />

			<main className="relative z-10 mx-auto w-full max-w-7xl min-w-0 space-y-5">
				{/* 1. PAGE HEADER */}
				<header className="border-b border-[#4A2C1D] pb-3 sm:pb-4">
					<div className="min-w-0">
						<div className="flex items-center gap-2 font-sans text-[9px] font-extrabold uppercase tracking-[0.24em] text-[#D7B05C] sm:text-xs">
							<span>⚔</span>
							<span>Quest Ledger</span>
							<span>⚔</span>
						</div>
						<h1 className="bg-gradient-to-b from-[#FFF5D6] via-[#D7B05C] to-[#B78B3E] bg-clip-text text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-[0.08em] text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] truncate">
							Calendar
						</h1>
						<p className="mt-1 font-sans text-xs sm:text-sm text-[#D7B05C]/80 italic max-w-2xl">
							Manage project deadlines, milestones, and task schedules.
						</p>
					</div>
				</header>

				{/* 2. CALENDAR & TASKS FOR SELECTED DATE */}
				<section className="w-full min-w-0">
					<CalendarGrid
						tasks={realTasks}
						projects={formattedProjects}
						users={workspaceUsers.map((u) => ({
							id: u.id,
							name: u.name,
							email: u.email,
						}))}
					/>
				</section>

				{/* 3. UPCOMING TASKS & PRIORITIES */}
				<section className="w-full min-w-0">
					<Upcomingquests tasks={realTasks.slice(0, 5)} />
				</section>

				{/* 4. LEGEND & 5. CALENDAR STATISTICS */}
				<section className="space-y-4 pt-2 border-t border-[#8F6236]/30">
					<CalendarLegend />
					<CalendarStats
						totalTasks={totalTasksCount}
						deadlinesCount={deadlinesThisWeekCount}
						completedCount={completedTasksCount}
					/>
				</section>
			</main>
		</div>
	);
}
