"use client";

import { Clock, ShieldAlert } from "lucide-react";

interface ScheduleItem {
	time: string;
	title: string;
	project: string;
	typeBadge: string;
}

const TODAY_SCHEDULE: ScheduleItem[] = [
	{
		time: "09:00",
		title: "War Council Strategy",
		project: "Project Alpha",
		typeBadge: "Meeting",
	},
	{
		time: "11:30",
		title: "API Integration Audit",
		project: "Internal Tools",
		typeBadge: "Deadline",
	},
	{
		time: "14:00",
		title: "Realm UI Review",
		project: "Project Phoenix",
		typeBadge: "Review",
	},
	{
		time: "16:30",
		title: "Deployment Milestone",
		project: "Project Alpha",
		typeBadge: "Milestone",
	},
];

export function TodaySidebar() {
	return (
		<div className="rounded-xs border-2 border-[#8F6236]/80 bg-gradient-to-b from-[#2D1B10] via-[#1A120C] to-[#15100C] p-4 shadow-xl space-y-4">
			<div className="flex items-center justify-between border-b border-[#4A2C1D] pb-3">
				<div className="flex items-center gap-2 text-[#D7B05C]">
					<Clock size={18} />
					<h3 className="font-serif font-black uppercase text-sm tracking-wider text-[#F8EEDB]">
						Today's Decrees
					</h3>
				</div>
				<span className="px-2 py-0.5 text-[9px] font-sans font-black bg-[#3B2415] text-[#D7B05C] border border-[#D7B05C]/40 rounded-xs uppercase">
					July 27
				</span>
			</div>

			<div className="space-y-2.5">
				{TODAY_SCHEDULE.map((item, idx) => (
					<div
						key={idx}
						className="p-2.5 rounded-xs border border-[#4A2C1D] bg-[#15100C] hover:border-[#D7B05C]/60 transition-colors flex items-center justify-between gap-3 group"
					>
						<div className="flex items-center space-x-3">
							<span className="text-[10px] font-mono font-bold text-[#D7B05C] bg-[#2D1B10] px-1.5 py-1 rounded-xs border border-[#4A2C1D]">
								{item.time}
							</span>
							<div>
								<p className="text-xs font-sans font-bold text-[#F8EEDB] group-hover:text-[#D7B05C] transition-colors">
									{item.title}
								</p>
								<p className="text-[9.5px] font-sans text-[#D7B05C]/70">
									{item.project}
								</p>
							</div>
						</div>
						<span className="text-[8.5px] font-sans font-extrabold uppercase px-1.5 py-0.5 bg-[#2D1B10] text-[#D7B05C]/80 border border-[#8F6236]/40 rounded-xs">
							{item.typeBadge}
						</span>
					</div>
				))}
			</div>

			<div className="p-2.5 rounded-xs border border-amber-600/40 bg-amber-950/20 text-amber-300 text-[10px] font-sans flex items-start space-x-2">
				<ShieldAlert size={14} className="shrink-0 mt-0.5 text-amber-400" />
				<p>
					Royal Scribe Note: High-priority deadlines scheduled for tomorrow
					morning.
				</p>
			</div>
		</div>
	);
}
