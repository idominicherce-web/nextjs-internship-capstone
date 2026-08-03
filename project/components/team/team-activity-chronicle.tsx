"use client";

import { Clock, Scroll } from "lucide-react";

export interface ActivityItem {
	id: string;
	user: string;
	action: string;
	timeAgo: string;
}

interface TeamActivityChronicleProps {
	activities: ActivityItem[];
}

export function TeamActivityChronicle({
	activities,
}: TeamActivityChronicleProps) {
	return (
		<div className="p-4 rounded-xs border-2 border-[#3B2415] bg-[#1A120C] shadow-2xl space-y-3">
			<div className="flex items-center justify-between border-b border-[#4A2C1D] pb-2">
				<div className="flex items-center gap-2 text-[#D7B05C]">
					<Scroll size={16} />
					<h3 className="font-serif font-black uppercase text-xs tracking-wider text-[#F8EEDB]">
						Team Activity Feed
					</h3>
				</div>
				<span className="text-[9px] font-serif italic text-[#D7B05C]/60">
					Council Comments
				</span>
			</div>

			<div className="space-y-3 pt-1">
				{activities.map((act) => (
					<div
						key={act.id}
						className="text-xs font-sans space-y-1 border-b border-[#4A2C1D]/40 pb-2.5 last:border-0 last:pb-0"
					>
						<p className="text-[#F8EEDB] leading-tight">
							<span className="font-extrabold text-[#D7B05C]">{act.user}</span>{" "}
							{act.action}
						</p>
						<span className="flex items-center gap-1 text-[10px] text-[#D7B05C]/60 font-serif italic">
							<Clock size={10} /> {act.timeAgo}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}
