"use client";

import {
	AlertTriangle,
	CheckCircle2,
	Clock,
	Layers,
	ShieldCheck,
} from "lucide-react";

interface WorkspaceHealthScoreProps {
	totalProjects: number;
	overallEfficiency: number;
	completedTasks: number;
	totalTasks: number;
	overdueTasks: number;
}

export function WorkspaceHealthScore({
	totalProjects,
	overallEfficiency,
	completedTasks,
	totalTasks,
	overdueTasks,
}: WorkspaceHealthScoreProps) {
	// Weighted Health Score Formula
	// 1. Completion Rate (40%)
	const completionComponent = overallEfficiency * 0.4;

	// 2. Overdue Penalty (30%) - 0 overdue tasks = 30 points
	const overduePenalty =
		totalTasks > 0 ? Math.min((overdueTasks / totalTasks) * 100, 100) : 0;
	const overdueComponent = (100 - overduePenalty) * 0.3;

	// 3. Workload Activity (20%) - active tasks existing = 20 points
	const activeTasks = totalTasks - completedTasks;
	const workloadComponent = totalTasks > 0 ? (activeTasks > 0 ? 20 : 15) : 0;

	// 4. Project Engagement (10%)
	const projectComponent = totalProjects > 0 ? 10 : 0;

	const healthScore = Math.round(
		completionComponent +
			overdueComponent +
			workloadComponent +
			projectComponent,
	);

	const healthRating =
		healthScore >= 85
			? {
					label: "Excellent",
					color: "text-emerald-400",
					border: "border-emerald-600",
				}
			: healthScore >= 70
				? {
						label: "Operational",
						color: "text-amber-400",
						border: "border-amber-600",
					}
				: {
						label: "Attention Required",
						color: "text-rose-400",
						border: "border-rose-600",
					};

	const projectsOnScheduleCount = totalProjects - (overdueTasks > 0 ? 1 : 0);

	return (
		<div className="relative rounded-xs border-4 border-[#3B2415] bg-gradient-to-b from-[#2D1B10] via-[#1A120C] to-[#100A07] p-6 shadow-2xl overflow-hidden">
			{/* Corner fittings */}
			<div className="absolute left-1 top-1 z-30 h-3.5 w-3.5 border border-black bg-gradient-to-br from-[#D7B05C] to-[#8F6236]" />
			<div className="absolute right-1 top-1 z-30 h-3.5 w-3.5 border border-black bg-gradient-to-br from-[#D7B05C] to-[#8F6236]" />
			<div className="absolute bottom-1 left-1 z-30 h-3.5 w-3.5 border border-black bg-gradient-to-br from-[#D7B05C] to-[#8F6236]" />
			<div className="absolute bottom-1 right-1 z-30 h-3.5 w-3.5 border border-black bg-gradient-to-br from-[#D7B05C] to-[#8F6236]" />

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
				{/* LEFT COLUMN: Circular Health Score Badge (4 Columns) */}
				<div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-[#15100C]/80 border-2 border-[#4A2C1D] rounded-xs shadow-inner text-center space-y-3">
					<div className="flex items-center gap-1.5 text-[10px] font-sans font-black uppercase tracking-widest text-[#D7B05C]">
						<ShieldCheck size={14} />
						<span>Workspace Health Score</span>
					</div>

					{/* Large Health Score Dial */}
					<div
						className={`relative flex items-center justify-center w-28 h-28 rounded-full border-4 ${healthRating.border} bg-[#100A07] shadow-[0_0_20px_rgba(0,0,0,0.8)]`}
					>
						<div className="text-center">
							<span
								className={`text-3xl font-black font-serif ${healthRating.color}`}
							>
								{healthScore}
							</span>
							<span className="block text-[9px] font-sans font-extrabold uppercase text-[#D7B05C]/70">
								/ 100
							</span>
						</div>
					</div>

					<span
						className={`text-xs font-sans font-black uppercase tracking-wider px-3 py-1 rounded-xs bg-[#2D1B10] border ${healthRating.border} ${healthRating.color}`}
					>
						{healthRating.label}
					</span>
				</div>

				{/* RIGHT COLUMN: Operational Summary Points (8 Columns) */}
				<div className="lg:col-span-8 space-y-4">
					<div className="border-b border-[#4A2C1D] pb-2">
						<h3 className="font-serif font-black text-base uppercase tracking-wider text-[#F8EEDB]">
							Operational Summary
						</h3>
						<p className="text-xs font-sans text-[#D7B05C]/70 italic">
							Live status report derived from active campaigns and task
							velocity.
						</p>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs font-sans">
						{/* Active Projects */}
						<div className="p-3 bg-[#15100C]/60 border border-[#4A2C1D] rounded-xs space-y-1">
							<div className="flex items-center gap-2 text-[#F8EEDB] font-bold">
								<Layers size={14} className="text-[#D7B05C]" />
								<span>{totalProjects} Active Projects</span>
							</div>
							<p className="text-[11px] text-[#D7B05C]/70">
								Currently managing {totalProjects} active project workspaces.
							</p>
						</div>

						{/* Projects On Schedule */}
						<div className="p-3 bg-[#15100C]/60 border border-[#4A2C1D] rounded-xs space-y-1">
							<div className="flex items-center gap-2 text-[#F8EEDB] font-bold">
								<CheckCircle2 size={14} className="text-emerald-400" />
								<span>{projectsOnScheduleCount} Projects On Schedule</span>
							</div>
							<p className="text-[11px] text-[#D7B05C]/70">
								{totalProjects > 0
									? `${Math.round((projectsOnScheduleCount / totalProjects) * 100)}% of projects have no overdue work.`
									: "All project workflows are up to date."}
							</p>
						</div>

						{/* Attention Required / Overdue */}
						<div className="p-3 bg-[#15100C]/60 border border-[#4A2C1D] rounded-xs space-y-1">
							<div className="flex items-center gap-2 text-[#F8EEDB] font-bold">
								<AlertTriangle
									size={14}
									className={
										overdueTasks > 0 ? "text-rose-400" : "text-emerald-400"
									}
								/>
								<span>
									{overdueTasks > 0
										? "Attention Required"
										: "No Critical Overdue Tasks"}
								</span>
							</div>
							<p className="text-[11px] text-[#D7B05C]/70">
								{overdueTasks > 0
									? `${overdueTasks} task${overdueTasks === 1 ? "" : "s"} require urgent attention.`
									: "All campaign deadlines are operating within normal parameters."}
							</p>
						</div>

						{/* Workload Balance */}
						<div className="p-3 bg-[#15100C]/60 border border-[#4A2C1D] rounded-xs space-y-1">
							<div className="flex items-center gap-2 text-[#F8EEDB] font-bold">
								<Clock size={14} className="text-sky-400" />
								<span>Team Workload ({activeTasks} Active)</span>
							</div>
							<p className="text-[11px] text-[#D7B05C]/70">
								{activeTasks} active task{activeTasks === 1 ? "" : "s"}{" "}
								currently assigned across workspaces.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
