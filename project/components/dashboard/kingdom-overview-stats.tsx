"use client";

import { CheckCircle2, Clock, FolderKanban, Users } from "lucide-react";
import Link from "next/link";

interface KingdomOverviewStatsProps {
	activeProjects: number;
	totalMembers: number;
	pendingTasks: number;
	completedTasks: number;
}

export function KingdomOverviewStats({
	activeProjects,
	totalMembers,
	pendingTasks,
	completedTasks,
}: KingdomOverviewStatsProps) {
	const stats = [
		{
			label: "Recent Projects",
			value: `${activeProjects} Active`,
			subtext: "Jump to active campaign boards below",
			icon: FolderKanban,
			color: "text-amber-400",
			borderColor: "border-[#8F6236]/60 hover:border-amber-400",
			iconBg: "border-[#D7B05C]/40 bg-[#15100C]",
			href: "#active-projects",
			isAnchor: true,
			anchorId: "active-projects",
		},
		{
			label: "Team Members",
			value: `${totalMembers} ${totalMembers === 1 ? "Officer" : "Officers"}`,
			subtext: "High officers assembled at the roundtable",
			icon: Users,
			color: "text-sky-400",
			borderColor: "border-sky-800/60 hover:border-sky-400",
			iconBg: "border-sky-500/40 bg-[#15100C]",
			href: "/team",
			isAnchor: false,
		},
		{
			label: "Pending Tasks",
			value: `${pendingTasks} Pending`,
			subtext: "Jump to active operations below",
			icon: Clock,
			color: "text-amber-300",
			borderColor: "border-amber-800/60 hover:border-amber-400",
			iconBg: "border-amber-500/40 bg-[#15100C]",
			href: "#tasks-requiring-attention",
			isAnchor: true,
			anchorId: "tasks-requiring-attention",
		},
		{
			label: "Completed Tasks",
			value: `${completedTasks} Completed`,
			subtext: "Objectives fulfilled in archive",
			icon: CheckCircle2,
			color: "text-emerald-400",
			borderColor: "border-emerald-800/60 hover:border-emerald-400",
			iconBg: "border-emerald-500/40 bg-[#15100C]",
			href: "/analytics",
			isAnchor: false,
		},
	];

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 font-serif">
			{stats.map((stat) => {
				const Icon = stat.icon;
				const content = (
					<div
						className={`p-3.5 sm:p-4 rounded-xs border-2 bg-gradient-to-b from-[#2D1B10] via-[#1A120C] to-[#100A07] shadow-xl relative overflow-hidden flex items-center space-x-3.5 transition-all hover:scale-[1.01] cursor-pointer ${stat.borderColor}`}
					>
						{/* Heraldic Circular Icon Badge */}
						<div
							className={`p-2.5 sm:p-3 rounded-full border shadow-md shrink-0 text-[#D7B05C] ${stat.iconBg}`}
						>
							<Icon size={18} className={`${stat.color} sm:w-5 sm:h-5`} />
						</div>

						{/* Content Container */}
						<div className="min-w-0 flex-1 space-y-0.5">
							<p className="text-[9.5px] font-sans font-black uppercase tracking-widest text-[#D7B05C] truncate">
								{stat.label}
							</p>

							<p
								className={`text-lg sm:text-xl font-serif font-black truncate ${stat.color}`}
							>
								{stat.value}
							</p>

							<p className="text-[9.5px] font-serif italic text-[#D7B05C]/60 truncate leading-tight">
								{stat.subtext}
							</p>
						</div>
					</div>
				);

				if (stat.isAnchor) {
					return (
						<a
							key={stat.label}
							href={stat.href}
							onClick={(e) => {
								e.preventDefault();
								if (stat.anchorId) {
									const el = document.getElementById(stat.anchorId);
									if (el) {
										el.scrollIntoView({ behavior: "smooth" });
									}
								}
							}}
						>
							{content}
						</a>
					);
				}

				return (
					<Link key={stat.label} href={stat.href}>
						{content}
					</Link>
				);
			})}
		</div>
	);
}
