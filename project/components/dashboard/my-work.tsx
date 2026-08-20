"use client";

import { FolderKanban } from "lucide-react";
import Link from "next/link";

interface MyWorkProps {
	todayCount: number;
	overdueCount: number;
	upcomingCount: number;
	reviewCount: number;
	firstActiveProjectSlug?: string;
}

export function MyWork({
	todayCount,
	overdueCount,
	upcomingCount,
	reviewCount,
	firstActiveProjectSlug,
}: MyWorkProps) {
	const targetHref = firstActiveProjectSlug
		? `/projects/${firstActiveProjectSlug}`
		: "/projects";

	return (
		<div className="rounded-xs border border-[#8F6236]/80 bg-[#1A120C] p-3 shadow-md font-serif space-y-2">
			<div className="flex items-center justify-between border-b border-[#4A2C1D]/60 pb-1.5">
				<div className="flex items-center gap-2 text-[#D7B05C]">
					<FolderKanban size={14} />
					<h3 className="font-serif font-black uppercase text-[11px] tracking-wider text-[#F8EEDB]">
						Personal Work Summary
					</h3>
				</div>
				<Link
					href={targetHref}
					className="text-[10px] font-sans font-extrabold uppercase text-[#D7B05C] hover:text-[#FFF5D6] transition-colors"
				>
					View Workspace →
				</Link>
			</div>

			{/* High-density compact metric strip */}
			<div className="grid grid-cols-4 gap-2 font-sans text-center">
				<div className="p-1.5 rounded-xs border border-[#4A2C1D] bg-[#15100C]">
					<span className="block text-[9px] font-extrabold uppercase text-[#E3C279]">
						Due Today
					</span>
					<span className="text-sm font-serif font-black text-[#F8EEDB]">
						{todayCount}
					</span>
				</div>

				<div className="p-1.5 rounded-xs border border-rose-900/60 bg-rose-950/20">
					<span className="block text-[9px] font-extrabold uppercase text-rose-300">
						Overdue
					</span>
					<span className="text-sm font-serif font-black text-rose-300">
						{overdueCount}
					</span>
				</div>

				<div className="p-1.5 rounded-xs border border-[#4A2C1D] bg-[#15100C]">
					<span className="block text-[9px] font-extrabold uppercase text-[#E3C279]">
						Upcoming
					</span>
					<span className="text-sm font-serif font-black text-amber-300">
						{upcomingCount}
					</span>
				</div>

				<div className="p-1.5 rounded-xs border border-[#4A2C1D] bg-[#15100C]">
					<span className="block text-[9px] font-extrabold uppercase text-[#E3C279]">
						In Review
					</span>
					<span className="text-sm font-serif font-black text-sky-300">
						{reviewCount}
					</span>
				</div>
			</div>
		</div>
	);
}
