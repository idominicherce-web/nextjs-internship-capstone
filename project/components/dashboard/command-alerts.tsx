"use client";

import {
	AlertTriangle,
	CheckCircle2,
	ChevronDown,
	ChevronUp,
	ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface CommandAlertsProps {
	overdueCount: number;
	totalTasks: number;
	pendingTasks: number;
	firstActiveProjectSlug?: string;
}

export function CommandAlerts({
	overdueCount,
	totalTasks,
	pendingTasks,
	firstActiveProjectSlug,
}: CommandAlertsProps) {
	const [isExpanded, setIsExpanded] = useState(true);
	const targetHref = firstActiveProjectSlug
		? `/projects/${firstActiveProjectSlug}`
		: "/projects";

	return (
		<div className="space-y-2 rounded-xs border border-[#8F6236]/60 bg-[#1A120C] p-3 sm:p-3.5 shadow-md font-serif min-w-0">
			{/* Accordion Header Bar */}
			<button
				type="button"
				onClick={() => setIsExpanded((prev) => !prev)}
				aria-expanded={isExpanded}
				aria-label={
					isExpanded ? "Collapse Command Alerts" : "Expand Command Alerts"
				}
				className="flex w-full items-center justify-between gap-2 text-left transition-colors hover:opacity-90 cursor-pointer min-w-0"
			>
				<div className="flex items-center gap-2 font-sans text-xs font-extrabold uppercase tracking-[0.2em] text-[#D7B05C] min-w-0 flex-1">
					<span>⚔</span>
					<h2 className="text-xs font-extrabold truncate">Command Alerts</h2>

					{!isExpanded && (
						<div className="ml-1 sm:ml-2 flex items-center gap-1.5 text-[10px] font-bold normal-case tracking-normal">
							{overdueCount > 0 ? (
								<span className="inline-flex items-center gap-1 rounded-xs border border-rose-800/80 bg-rose-950/60 px-2 py-0.5 text-rose-300">
									<AlertTriangle size={11} /> {overdueCount} Overdue
								</span>
							) : (
								<span className="inline-flex items-center gap-1 rounded-xs border border-emerald-800/80 bg-emerald-950/60 px-2 py-0.5 text-emerald-300">
									<ShieldCheck size={11} /> All Clear
								</span>
							)}
						</div>
					)}
				</div>

				<div className="flex items-center gap-1 font-sans text-[10px] font-bold uppercase tracking-wider text-[#E3C279] shrink-0">
					<span>{isExpanded ? "Minimize" : "Expand Alerts"}</span>
					{isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
				</div>
			</button>

			{/* Expanded Alerts Panel */}
			{isExpanded && (
				<div className="grid grid-cols-1 gap-2.5 sm:gap-3 pt-2.5 border-t border-[#4A2C1D]/60 animate-in fade-in duration-200 min-w-0">
					{/* OVERDUE STATUS ALERT */}
					{overdueCount > 0 ? (
						<div className="p-3 sm:p-3.5 rounded-xs border border-rose-800/80 bg-gradient-to-r from-rose-950/90 via-[#2A1010] to-[#1A0A0A] text-rose-200 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-3 min-w-0">
							<div className="flex items-start gap-2.5 min-w-0">
								<AlertTriangle className="size-5 text-rose-400 shrink-0 mt-0.5" />
								<div className="min-w-0 flex-1">
									<h3 className="font-sans font-black text-xs sm:text-sm uppercase tracking-wider text-rose-300">
										Overdue Objectives: {overdueCount} Requiring Attention
									</h3>
									<p className="text-[11px] sm:text-xs font-sans text-rose-200/90 mt-0.5 leading-relaxed">
										{overdueCount}{" "}
										{overdueCount === 1 ? "task has" : "tasks have"} passed
										their scheduled due date.
									</p>
								</div>
							</div>
							<Link
								href={targetHref}
								className="w-full sm:w-auto text-center px-3 py-1.5 border border-rose-700 bg-rose-950 text-rose-200 hover:bg-rose-900 text-[10px] font-sans font-black uppercase rounded-xs shrink-0 cursor-pointer"
							>
								Resolve Tasks
							</Link>
						</div>
					) : (
						<div className="p-3 sm:p-3.5 rounded-xs border border-emerald-800/80 bg-gradient-to-r from-emerald-950/90 via-[#10241A] to-[#0A1A12] text-emerald-200 shadow-md flex items-start gap-2.5 min-w-0">
							<ShieldCheck className="size-5 text-emerald-400 shrink-0 mt-0.5" />
							<div className="min-w-0 flex-1">
								<h3 className="font-sans font-black text-xs sm:text-sm uppercase tracking-wider text-emerald-300">
									All Objectives On Schedule
								</h3>
								<p className="text-[11px] sm:text-xs font-sans text-emerald-200/90 mt-0.5 leading-relaxed">
									No overdue tasks detected across active campaign boards.
								</p>
							</div>
						</div>
					)}

					{/* WORKSPACE SYNC STATUS */}
					<div className="p-3 sm:p-3.5 rounded-xs border border-[#8F6236]/80 bg-[#15100C] text-[#FFF5D6] shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 min-w-0">
						<div className="flex items-start sm:items-center gap-2.5 min-w-0">
							<CheckCircle2 className="size-4 text-[#D7B05C] shrink-0 mt-0.5 sm:mt-0" />
							<span className="text-xs font-sans font-bold text-[#F8EEDB] leading-relaxed">
								Active Pipelines: {pendingTasks} tasks in progress out of{" "}
								{totalTasks} total.
							</span>
						</div>
						<Link
							href="/projects"
							className="text-[10px] font-sans font-extrabold uppercase text-[#D7B05C] hover:text-[#FFF5D6] shrink-0 self-end sm:self-auto"
						>
							View Projects →
						</Link>
					</div>
				</div>
			)}
		</div>
	);
}
