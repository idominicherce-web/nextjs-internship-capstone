"use client";

import { TASK_TYPE_CONFIG, type TaskType } from "./types";

export function CalendarLegend() {
	return (
		<div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xs border border-[#8F6236]/50 bg-gradient-to-r from-[#2D1B10] via-[#1A120C] to-[#2D1B10] shadow-md">
			<span className="text-xs font-sans font-black uppercase tracking-[0.2em] text-[#D7B05C] flex items-center gap-1.5">
				<span>📜</span> Ledger Index
			</span>
			<div className="flex flex-wrap items-center gap-2 sm:gap-4">
				{(Object.keys(TASK_TYPE_CONFIG) as TaskType[]).map((key) => {
					const item = TASK_TYPE_CONFIG[key];
					return (
						<div
							key={key}
							className="flex items-center gap-1.5 px-2.5 py-1 rounded-xs bg-[#15100C] border border-[#4A2C1D] text-[10px] font-sans font-bold text-[#F8EEDB]/90 shadow-xs hover:border-[#D7B05C]/50 transition-colors"
						>
							<span className={`w-2 h-2 rounded-full ${item.badge}`} />
							<span className="text-xs">{item.icon}</span>
							<span>{item.label}</span>
						</div>
					);
				})}
			</div>
		</div>
	);
}
