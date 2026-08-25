import { desc, eq, inArray, or } from "drizzle-orm";
import { Shield } from "lucide-react";
import { ActivityArchive } from "@/components/analytics/activity-archive";
import { CommandAlerts } from "@/components/dashboard/command-alerts";
import { KingdomHealthWidget } from "@/components/dashboard/kingdom-health-widget";
import { KingdomOverviewStats } from "@/components/dashboard/kingdom-overview-stats";
import { MyWork } from "@/components/dashboard/my-work";
import { OnboardingDashboard } from "@/components/dashboard/onboarding-dashboard";
import { QuickActionsPanel } from "@/components/dashboard/quick-actions-panel";
import {
	type AttentionTask,
	TasksRequiringAttention,
} from "@/components/dashboard/tasks-requiring-attention";
import { DashboardLayoutContainer } from "@/components/layout/dashboard-layout-container";
import { CreateProjectButton } from "@/components/projects/create-project-button";
import { RecentProjects } from "@/components/projects/recent-projects";
import { getOrCreateDbUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { activityLogs, projectMembers, projects, users } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

const PRIORITY_ORDER: Record<string, number> = {
	Urgent: 1,
	High: 2,
	Medium: 3,
	Low: 4,
};

export default async function DashboardPage() {
	const dbUser = await getOrCreateDbUser();

	if (!dbUser) {
		return (
			<main className="min-h-screen bg-[#15100C] flex items-center justify-center p-6 text-center text-[#D7B05C] font-serif">
				<div className="p-8 border-2 border-[#8F6236] bg-[#2D1B10] rounded-xs shadow-2xl">
					<Shield className="mx-auto mb-3 text-[#D7B05C]" size={32} />
					<h1 className="text-xl font-black uppercase tracking-widest text-[#F8EEDB]">
						Access Denied
					</h1>
					<p className="text-xs font-sans text-[#E3C279] mt-2">
						Unauthorized traveler. Please sign in to enter the High Command
						Chamber.
					</p>
				</div>
			</main>
		);
	}

	// 1. Fetch project IDs where user is an assigned member
	const memberRecords = await db
		.select({ projectId: projectMembers.projectId })
		.from(projectMembers)
		.where(eq(projectMembers.userId, dbUser.id));

	const assignedProjectIds = memberRecords.map((m) => m.projectId);

	// 2. Query projects owned OR assigned via projectMembers
	const projectCondition =
		assignedProjectIds.length > 0
			? or(
					eq(projects.userId, dbUser.id),
					inArray(projects.id, assignedProjectIds),
				)
			: eq(projects.userId, dbUser.id);

	const userProjects = await db.query.projects.findMany({
		where: projectCondition,
		orderBy: [desc(projects.updatedAt)],
		with: {
			lists: {
				with: {
					tasks: true,
				},
			},
		},
	});

	const allUserProjectIds = Array.from(
		new Set([...userProjects.map((p) => p.id), ...assignedProjectIds]),
	);

	// 3. Compute unique total members across all accessible projects
	const projectMemberRows =
		allUserProjectIds.length > 0
			? await db
					.select({ userId: projectMembers.userId })
					.from(projectMembers)
					.where(inArray(projectMembers.projectId, allUserProjectIds))
			: [];

	const uniqueMemberIds = new Set<string>();
	for (const p of userProjects) {
		uniqueMemberIds.add(p.userId);
	}
	for (const m of projectMemberRows) {
		uniqueMemberIds.add(m.userId);
	}

	const uniqueMemberCount = uniqueMemberIds.size || 1;

	// 4. Fetch live recent activity logs + joined project slug for direct links
	const activityCondition =
		allUserProjectIds.length > 0
			? or(
					inArray(activityLogs.projectId, allUserProjectIds),
					eq(activityLogs.userId, dbUser.id),
				)
			: eq(activityLogs.userId, dbUser.id);

	const recentActivitiesRaw = await db
		.select({
			id: activityLogs.id,
			action: activityLogs.action,
			entityType: activityLogs.entityType,
			entityName: activityLogs.entityName,
			details: activityLogs.details,
			createdAt: activityLogs.createdAt,
			projectId: activityLogs.projectId,
			projectSlug: projects.slug,
			user: {
				name: users.name,
				email: users.email,
				imageUrl: users.imageUrl,
			},
		})
		.from(activityLogs)
		.leftJoin(
			users,
			or(
				eq(activityLogs.userId, users.id),
				eq(activityLogs.userId, users.clerkId),
			),
		)
		.leftJoin(projects, eq(activityLogs.projectId, projects.id))
		.where(activityCondition)
		.orderBy(desc(activityLogs.createdAt))
		.limit(5);

	const recentActivities = recentActivitiesRaw.map((act) => ({
		...act,
		projectSlug: act.projectSlug || act.projectId,
	}));

	// 5. Tasks Data Pipeline
	const totalProjects = userProjects.length;
	let totalTasks = 0;
	let completedTasks = 0;
	let overdueTasks = 0;

	let myTodayTasks = 0;
	let myOverdueTasks = 0;
	let myUpcomingTasks = 0;
	let myReviewTasks = 0;

	const rawAttentionTasks: (AttentionTask & { rawDueDate: Date })[] = [];

	const todayStart = new Date();
	todayStart.setHours(0, 0, 0, 0);

	const tomorrowStart = new Date(todayStart);
	tomorrowStart.setDate(tomorrowStart.getDate() + 1);

	const myDisplayName = dbUser.name || dbUser.email || "Officer";

	const completedProjectsList: {
		id: string;
		slug: string | null;
		name: string;
	}[] = [];

	const recentProjectsData = userProjects.slice(0, 4).map((proj) => {
		let projTotalTasks = 0;
		let projCompletedTasks = 0;

		const isProjectOwner =
			proj.userId === dbUser.id || proj.userId === dbUser.clerkId;

		for (const list of proj.lists) {
			const listName = list.name.toLowerCase();
			const isDoneList =
				listName.includes("done") || listName.includes("complete");
			const isReviewList = listName.includes("review");

			for (const task of list.tasks) {
				projTotalTasks++;
				totalTasks++;

				const isAssignedToMe =
					task.userId === dbUser.id || task.userId === dbUser.clerkId;
				const shouldShowTask = isAssignedToMe || isProjectOwner;

				if (isDoneList) {
					projCompletedTasks++;
					completedTasks++;
				} else {
					if (task.dueDate) {
						const taskDueDate = new Date(task.dueDate);
						const taskDateStart = new Date(taskDueDate);
						taskDateStart.setHours(0, 0, 0, 0);

						const isOverdue = taskDateStart < todayStart;
						const isToday = taskDateStart.getTime() === todayStart.getTime();
						const isTomorrow =
							taskDateStart.getTime() === tomorrowStart.getTime();

						if (isOverdue) {
							overdueTasks++;
							if (shouldShowTask) myOverdueTasks++;
						} else if (isToday) {
							if (shouldShowTask) myTodayTasks++;
						} else {
							if (shouldShowTask) myUpcomingTasks++;
						}

						if (isReviewList && shouldShowTask) {
							myReviewTasks++;
						}

						if (shouldShowTask) {
							let groupLabel: "OVERDUE" | "TODAY" | "TOMORROW" | "UPCOMING" =
								"UPCOMING";
							let semanticDate = taskDueDate.toLocaleDateString("en-US", {
								month: "short",
								day: "numeric",
							});

							if (isOverdue) {
								groupLabel = "OVERDUE";
								const diffDays = Math.max(
									1,
									Math.floor(
										(todayStart.getTime() - taskDateStart.getTime()) /
											(1000 * 60 * 60 * 24),
									),
								);
								semanticDate = `${diffDays} ${diffDays === 1 ? "day" : "days"} overdue`;
							} else if (isToday) {
								groupLabel = "TODAY";
								semanticDate = "Today";
							} else if (isTomorrow) {
								groupLabel = "TOMORROW";
								semanticDate = "Tomorrow";
							}

							rawAttentionTasks.push({
								id: task.id,
								title: task.title,
								dueDate: task.dueDate,
								rawDueDate: taskDueDate,
								priority: task.priority || "Medium",
								projectName: proj.name,
								projectSlug: proj.slug || proj.id,
								assignedTo: isAssignedToMe ? myDisplayName : "Assigned Officer",
								groupLabel,
								semanticDate,
							});
						}
					}
				}
			}
		}

		if (projTotalTasks > 0 && projTotalTasks === projCompletedTasks) {
			completedProjectsList.push({
				id: proj.id,
				slug: proj.slug,
				name: proj.name,
			});
		}

		return {
			id: proj.id,
			slug: proj.slug,
			name: proj.name,
			description: proj.description,
			updatedAt: proj.updatedAt,
			totalTasks: projTotalTasks,
			completedTasks: projCompletedTasks,
		};
	});

	rawAttentionTasks.sort((a, b) => {
		const timeDiff = a.rawDueDate.getTime() - b.rawDueDate.getTime();
		if (timeDiff !== 0) return timeDiff;

		const pA = PRIORITY_ORDER[a.priority] || 3;
		const pB = PRIORITY_ORDER[b.priority] || 3;
		if (pA !== pB) return pA - pB;

		return a.id.localeCompare(b.id);
	});

	const pendingTasks = totalTasks - completedTasks;
	const completionRate =
		totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
	const overdueRate =
		totalTasks > 0 ? Math.round((overdueTasks / totalTasks) * 100) : 0;

	const firstSlug = userProjects[0]?.slug || userProjects[0]?.id;

	return (
		<DashboardLayoutContainer>
			<main className="space-y-6 sm:space-y-8 pb-12 sm:pb-16 min-w-0 font-serif text-[#F8EEDB]">
				{/* Header Bar */}
				<header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-[#4A2C1D] pb-6 relative">
					<div>
						<div className="flex items-center gap-2 text-[#D7B05C] text-xs font-sans uppercase font-extrabold tracking-[0.25em] mb-1.5">
							<span>⚔</span>
							<span>Royal Command Center</span>
							<span>⚔</span>
						</div>

						<h1 className="text-3xl sm:text-5xl font-black bg-gradient-to-b from-[#FFF5D6] via-[#D7B05C] to-[#B78B3E] bg-clip-text text-transparent uppercase tracking-[0.1em] filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
							Dashboard
						</h1>

						{dbUser?.name && (
							<p className="text-sm sm:text-base font-serif font-extrabold text-[#F8EEDB] mt-1 tracking-wide">
								Welcome back,{" "}
								<span className="text-[#D7B05C]">{dbUser.name}</span>
							</p>
						)}

						<p className="text-xs sm:text-sm font-sans text-[#E3C279] mt-1 italic max-w-2xl leading-relaxed">
							Review workspace operations, active project progress, and
							strategic priorities.
						</p>
					</div>

					<div className="shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
						<CreateProjectButton />
					</div>
				</header>

				{totalProjects === 0 ? (
					<OnboardingDashboard />
				) : (
					<>
						{/* 1. Command Urgency Alerts */}
						<section aria-label="Command Urgency Alerts">
							<CommandAlerts
								overdueCount={overdueTasks}
								totalTasks={totalTasks}
								pendingTasks={pendingTasks}
								completedProjectsList={completedProjectsList}
								firstActiveProjectSlug={firstSlug}
							/>
						</section>

						{/* 2. Workspace Overview Statistics Strip */}
						<section aria-label="Kingdom Overview Statistics">
							<KingdomOverviewStats
								activeProjects={totalProjects}
								totalMembers={uniqueMemberCount}
								completedTasks={completedTasks}
								pendingTasks={pendingTasks}
							/>
						</section>

						{/* 3. Compact My Work Metric Strip */}
						<section aria-label="Personal Work Summary">
							<MyWork
								todayCount={myTodayTasks}
								overdueCount={myOverdueTasks}
								upcomingCount={myUpcomingTasks}
								reviewCount={myReviewTasks}
								firstActiveProjectSlug={firstSlug}
							/>
						</section>

						{/* 4. Tasks Requiring Attention */}
						<section
							id="tasks-requiring-attention"
							className="scroll-mt-6"
							aria-label="Tasks Requiring Attention"
						>
							<TasksRequiringAttention tasks={rawAttentionTasks.slice(0, 8)} />
						</section>

						<div className="flex items-center justify-center gap-4 text-[#B78B3E] text-xs py-1">
							<div className="h-px w-24 sm:w-36 bg-gradient-to-r from-transparent to-[#4A2C1D]" />
							<span>⚔ ──── ⚜ ──── ⚔</span>
							<div className="h-px w-24 sm:w-36 bg-gradient-to-l from-transparent to-[#4A2C1D]" />
						</div>

						{/* 5. Main Responsive Grid */}
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
							<div className="lg:col-span-2 space-y-6 min-w-0">
								{/* Active Projects Anchor Target */}
								<section
									id="active-projects"
									className="scroll-mt-6"
									aria-label="Active Projects"
								>
									<RecentProjects projects={recentProjectsData} />
								</section>

								<section aria-label="Quest Logs">
									<ActivityArchive activities={recentActivities as any} />
								</section>
							</div>

							<div className="space-y-6 min-w-0">
								<section aria-label="Quick Actions">
									<QuickActionsPanel />
								</section>

								<section aria-label="Workspace Health Summary">
									<KingdomHealthWidget
										completionRate={completionRate}
										overdueRate={overdueRate}
										overdueTasksCount={overdueTasks}
									/>
								</section>
							</div>
						</div>
					</>
				)}
			</main>
		</DashboardLayoutContainer>
	);
}
