"use client";

import { AlertTriangle, CheckCircle2, Clock, TrendingUp } from "lucide-react";

interface IntelligenceStatsProps {
	overallEfficiency: number;
	completedTasks: number;
	totalTasks: number;
	inProgressTasks: number;
	overdueTasks: number;
}

export function IntelligenceStats({
	overallEfficiency,
	completedTasks,
	totalTasks,
	inProgressTasks,
	overdueTasks,
}: IntelligenceStatsProps) {
	const stats = [
		{
			title: "Completion Rate",
			value: `${overallEfficiency}%`,
			description: "Overall completion across all work.",
			icon: TrendingUp,
			color: "text-amber-400",
			borderColor: "border-[#8F6236]/60",
		},
		{
			title: "Completed Tasks",
			value: `${completedTasks} / ${totalTasks}`,
			description: "Tasks marked as completed.",
			icon: CheckCircle2,
			color: "text-emerald-400",
			borderColor: "border-emerald-800/60",
		},
		{
			title: "Active Tasks",
			value: `${inProgressTasks}`,
			description: "Currently in progress.",
			icon: Clock,
			color: "text-sky-400",
			borderColor: "border-sky-800/60",
		},
		{
			title: "Overdue Tasks",
			value: `${overdueTasks}`,
			description: "Requires immediate attention.",
			icon: AlertTriangle,
			color: overdueTasks > 0 ? "text-rose-400" : "text-[#D7B05C]",
			borderColor:
				overdueTasks > 0 ? "border-rose-800/60" : "border-[#8F6236]/60",
		},
	];

	return (
		<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 min-w-0">
			{stats.map((stat) => {
				const Icon = stat.icon;
				return (
					<div
						key={stat.title}
						className={`p-3.5 sm:p-4 rounded-xs border-2 bg-gradient-to-b from-[#2D1B10] via-[#1A120C] to-[#100A07] shadow-xl space-y-1.5 sm:space-y-2 relative min-w-0 ${stat.borderColor}`}
					>
						<div className="flex justify-between items-center gap-1">
							<span className="text-[9px] sm:text-[10px] font-sans font-black uppercase tracking-wider text-[#D7B05C] truncate">
								{stat.title}
							</span>
							<Icon size={16} className={`${stat.color} shrink-0`} />
						</div>

						<p
							className={`text-xl sm:text-2xl font-serif font-black ${stat.color} truncate`}
						>
							{stat.value}
						</p>

						<p className="text-[10px] sm:text-[11px] font-sans text-[#D7B05C]/70 italic line-clamp-1">
							{stat.description}
						</p>
					</div>
				);
			})}
		</div>
	);
}
