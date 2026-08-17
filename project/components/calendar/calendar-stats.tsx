"use client";

interface CalendarStatsProps {
	totalTasks: number;
	deadlinesCount: number;
	completedCount: number;
}

export function CalendarStats({
	totalTasks,
	deadlinesCount,
	completedCount,
}: CalendarStatsProps) {
	return (
		<div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 font-serif">
			<div className="rounded-xs border border-[#8F6236]/60 bg-[#1A120C] p-3 text-center shadow-md">
				<span className="block font-sans text-[10px] font-extrabold uppercase tracking-wider text-[#D7B05C]/70">
					Scheduled Tasks
				</span>
				<span className="text-xl font-black text-[#F8EEDB] sm:text-2xl">
					{totalTasks}
				</span>
			</div>

			<div className="rounded-xs border border-[#8F6236]/60 bg-[#1A120C] p-3 text-center shadow-md">
				<span className="block font-sans text-[10px] font-extrabold uppercase tracking-wider text-rose-400/80">
					Pending Deadlines
				</span>
				<span className="text-xl font-black text-rose-300 sm:text-2xl">
					{deadlinesCount}
				</span>
			</div>

			<div className="rounded-xs border border-[#8F6236]/60 bg-[#1A120C] p-3 text-center shadow-md">
				<span className="block font-sans text-[10px] font-extrabold uppercase tracking-wider text-emerald-400/80">
					Completed
				</span>
				<span className="text-xl font-black text-emerald-300 sm:text-2xl">
					{completedCount}
				</span>
			</div>
		</div>
	);
}
