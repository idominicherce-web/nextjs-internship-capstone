"use client";

import { ShieldCheck } from "lucide-react";

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
	const completionComponent = overallEfficiency * 0.4;
	const overduePenalty =
		totalTasks > 0 ? Math.min((overdueTasks / totalTasks) * 100, 100) : 0;
	const overdueComponent = (100 - overduePenalty) * 0.3;
	const activeTasks = totalTasks - completedTasks;
	const workloadComponent = totalTasks > 0 ? (activeTasks > 0 ? 20 : 15) : 0;
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
		<div className="relative rounded-xs border-4 border-[#3B2415] bg-gradient-to-b from-[#2D1B10] via-[#1A120C] to-[#100A07] p-4 sm:p-6 shadow-2xl overflow-hidden min-w-0">
			{/* Decorative Corner Fittings */}
			<div className="absolute left-1 top-1 z-20 h-3 w-3 border border-black bg-gradient-to-br from-[#D7B05C] to-[#8F6236]" />
			<div className="absolute right-1 top-1 z-20 h-3 w-3 border border-black bg-gradient-to-br from-[#D7B05C] to-[#8F6236]" />
			<div className="absolute bottom-1 left-1 z-20 h-3 w-3 border border-black bg-gradient-to-br from-[#D7B05C] to-[#8F6236]" />
			<div className="absolute bottom-1 right-1 z-20 h-3 w-3 border border-black bg-gradient-to-br from-[#D7B05C] to-[#8F6236]" />

			<div className="flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6 min-w-0">
				{/* Left: Health Dial */}
				<div className="flex items-center gap-4 sm:gap-5 w-full md:w-auto">
					<div
						className={`relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 ${healthRating.border} bg-[#100A07] shadow-lg shrink-0`}
					>
						<div className="text-center">
							<span
								className={`text-xl sm:text-2xl font-black font-serif ${healthRating.color}`}
							>
								{healthScore}
							</span>
							<span className="block text-[8px] font-sans font-extrabold uppercase text-[#D7B05C]/70">
								/ 100
							</span>
						</div>
					</div>

					<div className="space-y-0.5 sm:space-y-1 min-w-0">
						<div className="flex items-center gap-1.5 text-[10px] font-sans font-black uppercase tracking-widest text-[#D7B05C]">
							<ShieldCheck size={14} className="shrink-0" />
							<span className="truncate">Workspace Health</span>
						</div>
						<h3
							className={`text-lg sm:text-xl font-serif font-black ${healthRating.color} truncate`}
						>
							{healthRating.label}
						</h3>
						<p className="text-[11px] sm:text-xs font-sans text-[#D7B05C]/70 italic">
							Combined score based on task throughput and scheduled deadlines.
						</p>
					</div>
				</div>

				{/* Right: Compact Secondary Metrics Grid */}
				<div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 w-full md:w-auto text-center border-t md:border-t-0 md:border-l border-[#4A2C1D] pt-4 md:pt-0 md:pl-6 min-w-0">
					<div className="p-2 sm:p-2.5 bg-[#15100C]/70 border border-[#4A2C1D] rounded-xs space-y-0.5">
						<span className="block text-[9px] sm:text-[10px] font-sans font-bold uppercase tracking-wider text-[#D7B05C]/70 truncate">
							Projects
						</span>
						<span className="text-base sm:text-lg font-serif font-black text-[#F8EEDB]">
							{totalProjects}
						</span>
					</div>

					<div className="p-2 sm:p-2.5 bg-[#15100C]/70 border border-[#4A2C1D] rounded-xs space-y-0.5">
						<span className="block text-[9px] sm:text-[10px] font-sans font-bold uppercase tracking-wider text-[#D7B05C]/70 truncate">
							On Schedule
						</span>
						<span className="text-base sm:text-lg font-serif font-black text-emerald-400">
							{projectsOnScheduleCount}
						</span>
					</div>

					<div className="p-2 sm:p-2.5 bg-[#15100C]/70 border border-[#4A2C1D] rounded-xs space-y-0.5">
						<span className="block text-[9px] sm:text-[10px] font-sans font-bold uppercase tracking-wider text-[#D7B05C]/70 truncate">
							Overdue
						</span>
						<span
							className={`text-base sm:text-lg font-serif font-black ${
								overdueTasks > 0 ? "text-rose-400" : "text-[#D7B05C]"
							}`}
						>
							{overdueTasks}
						</span>
					</div>

					<div className="p-2 sm:p-2.5 bg-[#15100C]/70 border border-[#4A2C1D] rounded-xs space-y-0.5">
						<span className="block text-[9px] sm:text-[10px] font-sans font-bold uppercase tracking-wider text-[#D7B05C]/70 truncate">
							Active Work
						</span>
						<span className="text-base sm:text-lg font-serif font-black text-sky-400">
							{activeTasks}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
