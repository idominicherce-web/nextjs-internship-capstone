"use client";

import { Archive, Clock, FolderKanban, ShieldCheck } from "lucide-react";

interface ProjectStatsSummaryProps {
	total: number;
	active: number;
	completed: number;
}

export function ProjectStatsSummary({
	total,
	active,
	completed,
}: ProjectStatsSummaryProps) {
	const cards = [
		{
			label: "Total Projects",
			value: total,
			icon: FolderKanban,
			color: "text-[#D7B05C]",
		},
		{
			label: "Active Projects",
			value: active,
			icon: Clock,
			color: "text-amber-400",
		},
		{
			label: "Completed Projects",
			value: completed,
			icon: ShieldCheck,
			color: "text-emerald-400",
		},
		{
			label: "Archived Records",
			value: 0,
			icon: Archive,
			color: "text-[#D7B05C]/60",
		},
	];

	return (
		<div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
			{cards.map((card, idx) => {
				const Icon = card.icon;
				return (
					<div
						key={idx}
						className="group relative p-3.5 rounded-xs border-2 border-[#4A2C1D] bg-gradient-to-b from-[#2D1B10] via-[#1A120C] to-[#15100C] shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:border-[#D7B05C]"
					>
						<div className="flex items-center space-x-3">
							<div
								className={`p-2 rounded-full border border-[#8F6236]/50 bg-[#15100C] ${card.color}`}
							>
								<Icon size={18} />
							</div>
							<div>
								<p className="text-[10px] font-sans uppercase font-bold text-[#D7B05C]/70 tracking-wider">
									{card.label}
								</p>
								<p className={`text-lg font-black font-serif ${card.color}`}>
									{card.value}
								</p>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
}
