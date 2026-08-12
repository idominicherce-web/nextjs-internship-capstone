"use client";

import {
	AlertTriangle,
	CheckCircle2,
	ChevronDown,
	ChevronUp,
	ShieldCheck,
} from "lucide-react";
import { useState } from "react";

interface CommandAlertsProps {
	overdueCount: number;
	totalTasks: number;
	pendingTasks: number;
}

export function CommandAlerts({
	overdueCount,
	totalTasks,
	pendingTasks,
}: CommandAlertsProps) {
	const [isExpanded, setIsExpanded] = useState(false);

	return (
		<div className="space-y-2 rounded-xs border border-[#8F6236]/60 bg-[#1A120C] p-3 shadow-md">
			{/* Section Header Bar / Accordion Trigger */}
			<button
				type="button"
				onClick={() => setIsExpanded((prev) => !prev)}
				aria-expanded={isExpanded}
				aria-label={
					isExpanded ? "Collapse Command Alerts" : "Expand Command Alerts"
				}
				className="flex w-full items-center justify-between gap-2 text-left transition-colors hover:opacity-90 cursor-pointer"
			>
				<div className="flex items-center gap-2 font-sans text-xs font-extrabold uppercase tracking-[0.2em] text-[#D7B05C]">
					<span>⚔</span>
					<h2 className="text-xs font-extrabold">Command Alerts</h2>
					{/* Compact Summary Badge when collapsed */}
					{!isExpanded && (
						<div className="ml-2 flex items-center gap-2 text-[10px] font-bold normal-case tracking-normal">
							{overdueCount > 0 ? (
								<span className="inline-flex items-center gap-1 rounded-xs border border-rose-800/80 bg-rose-950/60 px-2 py-0.5 text-rose-300">
									<AlertTriangle size={11} /> {overdueCount} Overdue
								</span>
							) : (
								<span className="inline-flex items-center gap-1 rounded-xs border border-emerald-800/80 bg-emerald-950/60 px-2 py-0.5 text-emerald-300">
									<ShieldCheck size={11} /> All Clear
								</span>
							)}

							<span className="hidden sm:inline-flex items-center gap-1 rounded-xs border border-amber-800/80 bg-amber-950/60 px-2 py-0.5 text-amber-300">
								{pendingTasks} Active
							</span>
						</div>
					)}
				</div>

				<div className="flex items-center gap-1 font-sans text-[10px] font-bold uppercase tracking-wider text-[#E3C279]">
					<span>{isExpanded ? "Minimize" : "Expand Alerts"}</span>
					{isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
				</div>
			</button>

			{/* Collapsible Alerts Panel */}
			{isExpanded && (
				<div className="grid grid-cols-1 gap-3 pt-2 border-t border-[#4A2C1D]/60 animate-in fade-in duration-200">
					{/* ================= 1. OVERDUE STATUS ALERT ================= */}
					{overdueCount > 0 ? (
						<div className="p-3.5 rounded-xs border border-rose-800/80 bg-gradient-to-r from-rose-950/90 via-[#2A1010] to-[#1A0A0A] text-rose-200 shadow-md flex items-start gap-3">
							<AlertTriangle className="size-5 text-rose-400 shrink-0 mt-0.5" />
							<div className="min-w-0 flex-1">
								<h3 className="font-sans font-black text-sm uppercase tracking-wider text-rose-300">
									Overdue Tasks: {overdueCount} Requiring Attention
								</h3>
								<p className="text-xs font-sans text-rose-200 mt-0.5">
									{overdueCount}{" "}
									{overdueCount === 1 ? "task has" : "tasks have"} passed their
									scheduled due date.
								</p>
								<p className="text-[10px] font-serif italic text-rose-200 mt-1">
									Urgent decrees await execution across active war boards.
								</p>
							</div>
						</div>
					) : (
						<div className="p-3.5 rounded-xs border border-emerald-800/80 bg-gradient-to-r from-emerald-950/90 via-[#10241A] to-[#0A1A12] text-emerald-200 shadow-md flex items-start gap-3">
							<ShieldCheck className="size-5 text-emerald-400 shrink-0 mt-0.5" />
							<div className="min-w-0 flex-1">
								<h3 className="font-sans font-black text-sm uppercase tracking-wider text-emerald-300">
									No Overdue Tasks
								</h3>
								<p className="text-xs font-sans text-emerald-200 mt-0.5">
									All project deadlines are currently on schedule.
								</p>
								<p className="text-[10px] font-serif italic text-emerald-200 mt-1">
									The kingdom&apos;s operations remain in good order.
								</p>
							</div>
						</div>
					)}

					{/* ================= 2. ACTIVE PROGRESS ALERT ================= */}
					<div className="p-3.5 rounded-xs border border-amber-800/80 bg-gradient-to-r from-amber-950/90 via-[#2A1B10] to-[#1A120C] text-amber-200 shadow-md flex items-start gap-3">
						<AlertTriangle className="size-5 text-amber-400 shrink-0 mt-0.5" />
						<div className="min-w-0 flex-1">
							<h3 className="font-sans font-black text-sm uppercase tracking-wider text-amber-300">
								{pendingTasks > 0 ? "Tasks In Progress" : "No Active Work"}
							</h3>
							<p className="text-xs font-sans text-amber-200 mt-0.5">
								{pendingTasks > 0
									? `${pendingTasks} active ${pendingTasks === 1 ? "task is" : "tasks are"} currently being worked on out of ${totalTasks} total.`
									: "There are currently no active tasks remaining in the pipeline."}
							</p>
							<p className="text-[10px] font-serif italic text-amber-200 mt-1">
								{pendingTasks > 0
									? "Royal operations continue across active projects."
									: "No quest operations are currently underway."}
							</p>
						</div>
					</div>

					{/* ================= 3. WORKSPACE SYNC STATUS ================= */}
					<div className="p-3.5 rounded-xs border border-[#8F6236]/80 bg-gradient-to-r from-[#2D1B10] via-[#1A120C] to-[#100A07] text-[#FFF5D6] shadow-md flex items-start gap-3">
						<CheckCircle2 className="size-5 text-[#D7B05C] shrink-0 mt-0.5" />
						<div className="min-w-0 flex-1">
							<h3 className="font-sans font-black text-sm uppercase tracking-wider text-[#D7B05C]">
								Workspace Synced
							</h3>
							<p className="text-xs font-sans text-[#F8EEDB] mt-0.5">
								Your workspace is connected and synchronized with live project
								data.
							</p>
							<p className="text-[10px] font-serif italic text-[#E3C279] mt-1">
								The royal archives remain current and fully operational.
							</p>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
