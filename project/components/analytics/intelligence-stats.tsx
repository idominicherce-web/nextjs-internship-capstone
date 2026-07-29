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
			title: "Workspace Efficiency",
			value: `${overallEfficiency}%`,
			description: "Overall completion across all active work.",
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
			description: "Currently being worked on.",
			icon: Clock,
			color: "text-sky-400",
			borderColor: "border-sky-800/60",
		},
		{
			title: "Overdue Tasks",
			value: `${overdueTasks}`,
			description: "Past scheduled due date.",
			icon: AlertTriangle,
			color: overdueTasks > 0 ? "text-rose-400" : "text-[#D7B05C]",
			borderColor:
				overdueTasks > 0 ? "border-rose-800/60" : "border-[#8F6236]/60",
		},
	];

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
			{stats.map((stat) => {
				const Icon = stat.icon;
				return (
					<div
						key={stat.title}
						className={`p-4 rounded-xs border-2 bg-gradient-to-b from-[#2D1B10] via-[#1A120C] to-[#100A07] shadow-xl space-y-2 relative ${stat.borderColor}`}
					>
						<div className="flex justify-between items-center">
							<span className="text-[10px] font-sans font-black uppercase tracking-wider text-[#D7B05C]">
								{stat.title}
							</span>
							<Icon size={18} className={stat.color} />
						</div>

						<p className={`text-2xl font-serif font-black ${stat.color}`}>
							{stat.value}
						</p>

						<p className="text-[11px] font-sans text-[#D7B05C]/70 italic">
							{stat.description}
						</p>
					</div>
				);
			})}
		</div>
	);
}
