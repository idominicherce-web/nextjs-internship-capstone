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
	return (
		<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
			<div className="p-3 sm:p-4 rounded-xs border border-[#8F6236]/40 bg-[#1A120C] space-y-1 shadow-md">
				<span className="text-[10px] font-mono text-[#D7B05C]/70 uppercase tracking-wider block truncate">
					Scheduled Tasks
				</span>
				<div className="text-sm sm:text-xl font-serif font-bold text-[#FAF0D7]">
					{totalTasks} Objectives
				</div>
			</div>
			<div className="p-3 sm:p-4 rounded-xs border border-[#8F6236]/40 bg-[#1A120C] space-y-1 shadow-md">
				<span className="text-[10px] font-mono text-rose-400/80 uppercase tracking-wider block truncate">
					Deadlines
				</span>
				<div className="text-sm sm:text-xl font-serif font-bold text-rose-300">
					{deadlinesCount} Urgent
				</div>
			</div>
			<div className="p-3 sm:p-4 rounded-xs border border-[#8F6236]/40 bg-[#1A120C] space-y-1 shadow-md">
				<span className="text-[10px] font-mono text-emerald-400/80 uppercase tracking-wider block truncate">
					Completed
				</span>
				<div className="text-sm sm:text-xl font-serif font-bold text-emerald-300">
					{completedCount} Fulfilled
				</div>
			</div>
			<div className="p-3 sm:p-4 rounded-xs border border-[#8F6236]/40 bg-[#1A120C] space-y-1 shadow-md">
				<span className="text-[10px] font-mono text-purple-400/80 uppercase tracking-wider block truncate">
					Milestones
				</span>
				<div className="text-sm sm:text-xl font-serif font-bold text-purple-300">
					{milestonesCount} Active
				</div>
			</div>
		</div>
	);
}
