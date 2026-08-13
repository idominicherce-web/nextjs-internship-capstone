"use client";

import { Activity, FolderKanban, Mail, Users } from "lucide-react";

interface TeamStatsProps {
	totalMembers: number;
	activeThisWeek: number;
	totalProjectAssignments: number;
	pendingInvitationsCount: number;
}

export function TeamStats({
	totalMembers,
	activeThisWeek,
	totalProjectAssignments,
	pendingInvitationsCount,
}: TeamStatsProps) {
	const stats = [
		{
			title: "Total Members",
			subtext: "Registered officers",
			value: totalMembers,
			icon: Users,
		},
		{
			title: "Active This Week",
			subtext: "Recently deployed",
			value: activeThisWeek,
			icon: Activity,
		},
		{
			title: "Project Assignments",
			subtext: "Active collaborations",
			value: totalProjectAssignments,
			icon: FolderKanban,
		},
		{
			title: "Pending Invites",
			subtext: "Awaiting response",
			value: pendingInvitationsCount,
			icon: Mail,
		},
	];

	return (
		<div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 p-3 sm:p-4 rounded-xs border-2 border-[#4A2C1D] bg-gradient-to-b from-[#2D1B10] via-[#1A120C] to-[#15100C] shadow-2xl relative w-full min-w-0">
			<div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#D7B05C]/50 to-transparent" />
			{stats.map((stat, idx) => {
				const Icon = stat.icon;
				return (
					<div
						key={stat.title}
						className={`flex items-center space-x-2.5 sm:space-x-3 p-1.5 sm:p-2 min-w-0 ${
							idx !== stats.length - 1 ? "lg:border-r border-[#4A2C1D]/60" : ""
						}`}
					>
						<div className="p-2 sm:p-2.5 rounded-full border border-[#D7B05C]/50 bg-[#15100C] text-[#D7B05C] shrink-0">
							<Icon size={16} className="sm:w-[18px] sm:h-[18px]" />
						</div>
						<div className="min-w-0 flex-1">
							<p className="text-[9px] sm:text-[10px] font-sans uppercase font-bold text-[#E3C279] tracking-wider leading-tight truncate">
								{stat.title}
							</p>
							<p className="text-base sm:text-xl font-black text-[#F8EEDB] mt-0.5 leading-tight">
								{stat.value}
							</p>
							<p className="hidden sm:block text-[9px] font-serif italic text-[#E3C279]/70 truncate mt-0.5">
								{stat.subtext}
							</p>
						</div>
					</div>
				);
			})}
		</div>
	);
}
