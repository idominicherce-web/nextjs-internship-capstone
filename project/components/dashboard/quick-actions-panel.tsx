"use client";

import { BarChart3, CalendarPlus, Plus, UserPlus } from "lucide-react";
import Link from "next/link";

export function QuickActionsPanel() {
	const actions = [
		{
			primary: "New Project",
			sub: "Open Quest",
			href: "/projects",
			icon: Plus,
			color: "text-[#D7B05C]",
		},
		{
			primary: "Invite Member",
			sub: "Recruit Officer",
			href: "/team",
			icon: UserPlus,
			color: "text-sky-300",
		},
		{
			primary: "Schedule Event",
			sub: "Quest Ledger",
			href: "/calendar",
			icon: CalendarPlus,
			color: "text-amber-400",
		},
		{
			primary: "View Analytics",
			sub: "Intelligence Chamber",
			href: "/analytics",
			icon: BarChart3,
			color: "text-emerald-400",
		},
	];

	return (
		<div className="rounded-xs border-2 border-[#8F6236]/70 bg-gradient-to-b from-[#2D1B10] via-[#1A120C] to-[#15100C] p-4 shadow-xl space-y-3">
			<div className="border-b border-[#4A2C1D] pb-2">
				<h3 className="font-serif font-black uppercase text-xs tracking-widest text-[#F8EEDB]">
					Quick Actions
				</h3>
			</div>

			<div className="grid grid-cols-2 gap-2.5">
				{actions.map((act, i) => {
					const Icon = act.icon;
					return (
						<Link
							key={i}
							href={act.href}
							className="group flex flex-col items-center justify-center p-3 rounded-xs border-2 border-[#4A2C1D] bg-[#15100C] hover:border-[#D7B05C] hover:bg-[#2D1B10] transition-all text-center space-y-1 shadow-md cursor-pointer"
						>
							<Icon
								size={20}
								className={`${act.color} group-hover:scale-110 transition-transform`}
							/>
							<div>
								<span className="block text-[11px] font-sans font-black uppercase tracking-wider text-[#F8EEDB]">
									{act.primary}
								</span>
								<span className="block text-[8.5px] font-serif italic text-[#D7B05C]/70">
									{act.sub}
								</span>
							</div>
						</Link>
					);
				})}
			</div>
		</div>
	);
}
