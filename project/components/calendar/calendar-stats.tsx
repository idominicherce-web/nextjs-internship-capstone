"use client";

import { Award, CheckCircle, Clock, Scroll } from "lucide-react";

interface CalendarStatsProps {
	totalTasks: number;
	deadlinesCount: number;
	completedCount: number;
	milestonesCount: number;
}

export function CalendarStats({
	totalTasks,
	deadlinesCount,
	completedCount,
	milestonesCount,
}: CalendarStatsProps) {
	const cards = [
		{
			title: "Scheduled Tasks",
			value: `${totalTasks} quests`,
			icon: Scroll,
			color: "text-[#D7B05C]",
			borderColor: "border-[#D7B05C]/40",
		},
		{
			title: "Deadlines This Week",
			value: `${deadlinesCount} Urgent`,
			icon: Clock,
			color: "text-red-400",
			borderColor: "border-red-500/40",
		},
		{
			title: "Completed Tasks",
			value: `${completedCount} Fulfilled`,
			icon: CheckCircle,
			color: "text-emerald-400",
			borderColor: "border-emerald-500/40",
		},
		{
			title: "Major Milestones",
			value: `${milestonesCount} Active`,
			icon: Award,
			color: "text-purple-300",
			borderColor: "border-purple-500/40",
		},
	];

	return (
		<div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
			{cards.map((card, idx) => {
				const Icon = card.icon;
				return (
					<button
						key={idx}
						type="button"
						className="group relative text-left p-3.5 rounded-xs border-2 border-[#4A2C1D] bg-gradient-to-b from-[#2D1B10] via-[#1A120C] to-[#15100C] shadow-lg transition-all duration-200 hover:-translate-y-1 hover:border-[#D7B05C] hover:shadow-[0_8px_20px_rgba(215,176,92,0.25)] active:translate-y-0 cursor-pointer overflow-hidden"
					>
						{/* Top Brass Edge Highlight */}
						<div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#D7B05C]/40 to-transparent group-hover:via-[#D7B05C]" />

						<div className="flex items-center space-x-3">
							<div
								className={`p-2 rounded-full border bg-[#15100C] ${card.borderColor} ${card.color} group-hover:scale-110 transition-transform`}
							>
								<Icon size={18} />
							</div>
							<div className="min-w-0 flex-1">
								<p className="text-[10px] font-sans uppercase font-bold text-[#D7B05C]/70 tracking-wider truncate">
									{card.title}
								</p>
								<p className={`text-base font-black truncate ${card.color}`}>
									{card.value}
								</p>
							</div>
						</div>
					</button>
				);
			})}
		</div>
	);
}
