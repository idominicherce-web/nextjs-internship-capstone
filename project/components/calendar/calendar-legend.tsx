"use client";

export function CalendarLegend() {
	return (
		<div className="rounded-xs border border-[#8F6236]/50 bg-[#1A120C] px-3.5 py-2 font-sans text-xs">
			<div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-extrabold uppercase tracking-wider text-[#D7B05C]">
				<span className="text-[#F8EEDB] font-serif font-black">Legend:</span>
				<div className="flex items-center gap-1.5">
					<span className="h-2 w-2 rounded-full bg-rose-500" />
					<span>Deadline</span>
				</div>
				<div className="flex items-center gap-1.5">
					<span className="h-2 w-2 rounded-full bg-amber-500" />
					<span>Meeting</span>
				</div>
				<div className="flex items-center gap-1.5">
					<span className="h-2 w-2 rounded-full bg-emerald-500" />
					<span>Completed</span>
				</div>
				<div className="flex items-center gap-1.5">
					<span className="h-2 w-2 rounded-full bg-purple-500" />
					<span>Milestone</span>
				</div>
			</div>
		</div>
	);
}
