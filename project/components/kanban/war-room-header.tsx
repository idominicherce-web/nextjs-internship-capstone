"use client";

import {
	ArrowLeft,
	BarChart3,
	CheckCircle,
	Clock,
	Folder,
	Shield,
	Users,
} from "lucide-react";
import Link from "next/link";

interface WarRoomHeaderProps {
	name: string;
	description?: string | null;
	createdAt: Date;
	updatedAt: Date;
	listsCount: number;
	totalTasksCount: number;
	completedTasksCount: number;
}

export function WarRoomHeader({
	name,
	description,
	createdAt,
	updatedAt,
	listsCount,
	totalTasksCount,
	completedTasksCount,
}: WarRoomHeaderProps) {
	const completionRate =
		totalTasksCount > 0
			? Math.round((completedTasksCount / totalTasksCount) * 100)
			: 0;

	return (
		<div className="space-y-4 border-b-2 border-[#4A2C1D] pb-6">
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
				<div className="flex items-start space-x-4">
					<Link
						href="/projects"
						className="p-2.5 border-2 border-[#8F6236] bg-gradient-to-b from-[#3B2415] to-[#15100C] text-[#D7B05C] hover:text-white hover:border-[#D7B05C] rounded-xs transition-colors shadow-md cursor-pointer"
					>
						<ArrowLeft size={20} />
					</Link>
					<div>
						<div className="flex items-center gap-2 text-[#D7B05C] text-xs font-sans uppercase font-extrabold tracking-[0.3em] mb-1">
							<span>✦</span> WAR ROOM STRATEGY TABLE <span>✦</span>
						</div>
						<h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-b from-[#FFF5D6] via-[#D7B05C] to-[#B78B3E] bg-clip-text text-transparent uppercase tracking-[0.15em] filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
							{name}
						</h1>
						<p className="text-xs sm:text-sm font-sans text-[#D7B05C]/80 mt-1 italic">
							{description ||
								"quest operational command and tactical planning."}
						</p>
					</div>
				</div>
			</div>

			{/* Medieval Information Metadata Chips */}
			<div className="flex flex-wrap items-center gap-2 pt-1">
				<div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xs bg-[#15100C] border border-[#4A2C1D] text-[10px] font-sans font-bold text-[#D7B05C]">
					<Shield size={12} /> Commander: Sovereign
				</div>
				<div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xs bg-[#15100C] border border-[#4A2C1D] text-[10px] font-sans font-bold text-[#D7B05C]">
					<Users size={12} /> Officers: 1 Member
				</div>
				<div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xs bg-[#15100C] border border-[#4A2C1D] text-[10px] font-sans font-bold text-[#D7B05C]">
					<Folder size={12} /> Boards: {listsCount} Columns
				</div>
				<div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xs bg-[#15100C] border border-[#4A2C1D] text-[10px] font-sans font-bold text-[#D7B05C]">
					<CheckCircle size={12} className="text-emerald-400" /> Tasks:{" "}
					{completedTasksCount} / {totalTasksCount}
				</div>
				<div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xs bg-[#15100C] border border-[#4A2C1D] text-[10px] font-sans font-bold text-[#D7B05C]">
					<BarChart3 size={12} className="text-amber-400" /> Completion:{" "}
					{completionRate}%
				</div>
				<div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xs bg-[#15100C] border border-[#4A2C1D] text-[10px] font-sans font-bold text-[#D7B05C]/70">
					<Clock size={12} /> Updated:{" "}
					{new Date(updatedAt).toLocaleDateString()}
				</div>
			</div>
		</div>
	);
}
