import { eq } from "drizzle-orm";
import { Plus, Shield } from "lucide-react";
import { CalendarGrid } from "@/components/calendar/calendar-grid";
import { CalendarLegend } from "@/components/calendar/calendar-legend";
import { CalendarStats } from "@/components/calendar/calendar-stats";
import { TodaySidebar } from "@/components/calendar/today-sidebar";
import type { CalendarTask, TaskType } from "@/components/calendar/types";
import { Upcomingquests } from "@/components/calendar/upcoming-quests";
import { getOrCreateDbUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
	const dbUser = await getOrCreateDbUser();

	if (!dbUser) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-[#15100C] p-4 text-center font-serif text-[#D7B05C]">
				<div className="w-full max-w-md rounded-xs border-2 border-[#8F6236] bg-[#2D1B10] p-6 shadow-2xl sm:p-8">
					<Shield className="mx-auto mb-3 text-[#D7B05C]" size={32} />
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

	// Fetch real projects & tasks with due dates + assignees from database
	const userProjects = await db.query.projects.findMany({
		where: eq(projects.userId, dbUser.id),
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

	// Transform DB tasks into CalendarTask models
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
							(task.user?.email
								? task.user.email.split("@")[0]
								: "Unassigned Realm"),
					};
				});
		}),
	);

	const totalTasksCount = realTasks.length;
	const completedTasksCount = realTasks.filter((t) => t.isCompleted).length;
	const deadlinesThisWeekCount = realTasks.filter((t) => !t.isCompleted).length;
	const milestoneCount = userProjects.length;

	return (
		<div className="relative min-h-screen w-full min-w-0 bg-[#15100C] font-serif text-[#F8EEDB] antialiased p-3 sm:p-6 lg:p-8">
			{/* Torch Glow Ambient Vignette */}
			<div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_10%,rgba(215,176,92,0.12),transparent_55%)]" />
			<div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_50%,transparent_15%,rgba(0,0,0,0.88)_100%)]" />

			<main className="relative z-10 mx-auto w-full max-w-7xl min-w-0 space-y-6">
				{/* Page Header */}
				<header className="border-b border-[#4A2C1D] pb-4 sm:pb-6">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
						<div className="min-w-0">
							<div className="flex items-center gap-2 font-sans text-[9px] font-extrabold uppercase tracking-[0.24em] text-[#D7B05C] sm:text-xs">
								<span>⚔</span>
								<span>Quest Ledger</span>
								<span>⚔</span>
							</div>
							<h1 className="bg-gradient-to-b from-[#FFF5D6] via-[#D7B05C] to-[#B78B3E] bg-clip-text text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-[0.08em] text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] truncate">
								Calendar
							</h1>
							<p className="mt-1 font-sans text-xs sm:text-sm text-[#D7B05C]/80 italic max-w-2xl">
								Manage project deadlines, strategic milestones, and kingdom
								schedules.
							</p>
						</div>

						<button
							type="button"
							className="hidden sm:inline-flex shrink-0 items-center justify-center gap-2 border-2 border-[#D7B05C] bg-gradient-to-b from-[#5B3922] via-[#3B2415] to-[#1A120C] px-5 py-3 font-sans text-xs font-black uppercase tracking-[0.16em] text-[#F8EEDB] shadow-md transition-all hover:border-[#FFF5D6] hover:text-white active:translate-y-0.5 cursor-pointer"
						>
							<Plus size={16} className="text-[#D7B05C]" />
							Add Calendar Event
						</button>
					</div>
				</header>

				{/* DESKTOP HIERARCHY: Legend + Stats */}
				<div className="hidden lg:block space-y-5">
					<CalendarLegend />
					<CalendarStats
						totalTasks={totalTasksCount}
						deadlinesCount={deadlinesThisWeekCount}
						completedCount={completedTasksCount}
						milestonesCount={milestoneCount}
					/>
				</div>

				{/* Decorative Divider */}
				<div className="flex items-center justify-center gap-2 sm:gap-4 text-[#B78B3E] text-[10px] sm:text-xs py-1">
					<div className="h-px w-16 sm:w-32 bg-gradient-to-r from-transparent to-[#4A2C1D]" />
					<span>⚔ ──── ⚜ ──── ⚔</span>
					<div className="h-px w-16 sm:w-32 bg-gradient-to-l from-transparent to-[#4A2C1D]" />
				</div>

				{/* Main Calendar Section */}
				<section className="w-full min-w-0">
					<CalendarGrid tasks={realTasks} />
				</section>

				{/* Lower Information: Today's Decrees + Upcoming Quests */}
				<section className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
					<div className="lg:col-span-1 min-w-0">
						<TodaySidebar />
					</div>
					<div className="lg:col-span-2 min-w-0">
						<Upcomingquests tasks={realTasks.slice(0, 5)} />
					</div>
				</section>

				{/* MOBILE HIERARCHY: Legend + Stats moved to bottom */}
				<section className="space-y-4 border-t border-[#8F6236]/30 pt-5 lg:hidden">
					<CalendarLegend />
					<CalendarStats
						totalTasks={totalTasksCount}
						deadlinesCount={deadlinesThisWeekCount}
						completedCount={completedTasksCount}
						milestonesCount={milestoneCount}
					/>
				</section>
			</main>
		</div>
	);
}
