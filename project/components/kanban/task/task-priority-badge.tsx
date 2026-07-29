"use client";

import { AlertTriangle, Shield, ShieldAlert, ShieldCheck } from "lucide-react";

export type PriorityLevel = "Urgent" | "High" | "Medium" | "Low";

interface TaskPriorityBadgeProps {
	priority?: PriorityLevel | string | null;
	className?: string;
}

export function TaskPriorityBadge({
	priority = "Medium",
	className = "",
}: TaskPriorityBadgeProps) {
	const getBadgeConfig = (level?: string | null) => {
		switch (level) {
			case "Urgent":
				return {
					label: "Urgent",
					subtext: "Crucial Vow",
					icon: AlertTriangle,
					style:
						"bg-rose-950/90 text-rose-300 border-rose-600/80 shadow-[0_0_10px_rgba(225,29,72,0.3)]",
				};
			case "High":
				return {
					label: "High",
					subtext: "High Honor",
					icon: ShieldAlert,
					style:
						"bg-amber-950/90 text-amber-300 border-amber-600/80 shadow-[0_0_8px_rgba(217,119,6,0.3)]",
				};
			case "Low":
				return {
					label: "Low",
					subtext: "Low Duty",
					icon: Shield,
					style: "bg-[#1A120C] text-[#D7B05C]/70 border-[#4A2C1D]",
				};
			default:
				return {
					label: "Medium",
					subtext: "Standard Quest",
					icon: ShieldCheck,
					style: "bg-[#2D1B10] text-[#FFF5D6] border-[#8F6236]",
				};
		}
	};

	const config = getBadgeConfig(priority);
	const Icon = config.icon;

	return (
		<span
			className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xs border text-[9px] font-sans font-extrabold uppercase tracking-wider transition-all ${config.style} ${className}`}
			title={`${config.label} Priority — ${config.subtext}`}
		>
			<Icon size={11} className="shrink-0" />
			<span>{config.label}</span>
		</span>
	);
}
