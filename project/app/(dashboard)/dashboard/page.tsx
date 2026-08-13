// app\(dashboard)\dashboard\page.tsx
import { desc, eq } from "drizzle-orm";
import { Shield } from "lucide-react";
import { ActivityArchive } from "@/components/analytics/activity-archive";
import { CommandAlerts } from "@/components/dashboard/command-alerts";
import { KingdomHealthWidget } from "@/components/dashboard/kingdom-health-widget";
import { KingdomOverviewStats } from "@/components/dashboard/kingdom-overview-stats";
import { OnboardingDashboard } from "@/components/dashboard/onboarding-dashboard";
import { QuickActionsPanel } from "@/components/dashboard/quick-actions-panel";
import { DashboardLayoutContainer } from "@/components/layout/dashboard-layout-container";
import { CreateProjectButton } from "@/components/projects/create-project-button";
import { RecentProjects } from "@/components/projects/recent-projects";
import { getOrCreateDbUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { activityLogs, projects } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

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

	// 1. Fetch user projects with nested lists and tasks
	const userProjects = await db.query.projects.findMany({
		where: eq(projects.userId, dbUser.id),
		orderBy: [desc(projects.updatedAt)],
		with: {
			lists: {
				with: {
					tasks: true,
				},
			},
		},
	});

	// 2. Fetch live recent activity logs
	const recentActivities = await db.query.activityLogs.findMany({
		where: eq(activityLogs.userId, dbUser.id),
		orderBy: [desc(activityLogs.createdAt)],
		limit: 5,
	});

	// 3. Compute live metrics
	const totalProjects = userProjects.length;
	let totalTasks = 0;
	let completedTasks = 0;
	let overdueTasks = 0;
	const today = new Date(new Date().setHours(0, 0, 0, 0));

	const recentProjectsData = userProjects.slice(0, 4).map((proj) => {
		let projTotalTasks = 0;
		let projCompletedTasks = 0;

		proj.lists.forEach((list) => {
			const isDoneList =
				list.name.toLowerCase().includes("done") ||
				list.name.toLowerCase().includes("complete");

			list.tasks.forEach((task) => {
				projTotalTasks++;
				totalTasks++;
				if (isDoneList) {
					projCompletedTasks++;
					completedTasks++;
				} else if (task.dueDate && new Date(task.dueDate) < today) {
					overdueTasks++;
				}
			});
		});

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

	const pendingTasks = totalTasks - completedTasks;
	const completionRate =
		totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
	const overdueRate =
		totalTasks > 0 ? Math.round((overdueTasks / totalTasks) * 100) : 0;

	return (
		<DashboardLayoutContainer>
			{/* HTML5 Main Landmark */}
			<main className="space-y-6 sm:space-y-8 pb-12 sm:pb-16 min-w-0">
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

				{/* Onboarding State or Main Dashboard Grid */}
				{totalProjects === 0 ? (
					<OnboardingDashboard />
				) : (
					<>
						{/* Command Urgency Alerts */}
						<section aria-label="Command Urgency Alerts">
							<CommandAlerts
								overdueCount={overdueTasks}
								totalTasks={totalTasks}
								pendingTasks={pendingTasks}
							/>
						</section>

						{/* Kingdom Overview Report Plaques */}
						<section aria-label="Kingdom Overview Statistics">
							<KingdomOverviewStats
								activeProjects={totalProjects}
								totalMembers={1}
								completedTasks={completedTasks}
								pendingTasks={pendingTasks}
							/>
						</section>

						{/* Decorative Divider */}
						<div className="flex items-center justify-center gap-4 text-[#B78B3E] text-xs py-1">
							<div className="h-px w-24 sm:w-36 bg-gradient-to-r from-transparent to-[#4A2C1D]" />
							<span>⚔ ──── ⚜ ──── ⚔</span>
							<div className="h-px w-24 sm:w-36 bg-gradient-to-l from-transparent to-[#4A2C1D]" />
						</div>

						{/* Main Grid: Responsive stacking for mobile screens */}
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
							<div className="lg:col-span-2 space-y-6 min-w-0">
								<section aria-label="Recent Campaigns">
									<RecentProjects projects={recentProjectsData} />
								</section>
								<section aria-label="Council Activity Archive">
									<ActivityArchive activities={recentActivities} />
								</section>
							</div>

							<div className="space-y-6 min-w-0">
								<section aria-label="Quick Actions">
									<QuickActionsPanel />
								</section>
								<section aria-label="Kingdom Health & Metrics">
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
