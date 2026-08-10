export function CalendarLegend() {
	const legendItems = [
		{
			label: "Deadline",
			color: "bg-rose-500",
			border: "border-rose-700/50 text-rose-300",
		},
		{
			label: "Meeting",
			color: "bg-amber-500",
			border: "border-amber-700/50 text-amber-300",
		},
		{
			label: "Completed",
			color: "bg-emerald-500",
			border: "border-emerald-700/50 text-emerald-300",
		},
		{
			label: "Reminder",
			color: "bg-amber-400",
			border: "border-amber-600/50 text-amber-200",
		},
		{
			label: "Milestone",
			color: "bg-purple-500",
			border: "border-purple-700/50 text-purple-300",
		},
	];

	return (
		<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-xs border border-[#8F6236]/40 bg-[#1A120C] shadow-md">
			<span className="text-xs font-serif font-bold text-[#D7B05C] uppercase tracking-wider flex items-center gap-2 shrink-0">
				📜 Ledger Index
			</span>
			<div className="flex flex-wrap items-center gap-2">
				{legendItems.map((item) => (
					<span
						key={item.label}
						className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs border text-[10px] font-bold ${item.border} bg-[#0F0B08]`}
					>
						<span className={`w-2 h-2 rounded-full ${item.color}`} />
						{item.label}
					</span>
				))}
			</div>
		</div>
	);
}
