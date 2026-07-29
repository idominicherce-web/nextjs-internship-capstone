"use client";

import { AlertTriangle, CheckCircle2, ShieldCheck } from "lucide-react";

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
	return (
		<div className="space-y-3">
			{/* Section Header */}
			<div className="flex items-center gap-2 text-[#D7B05C] text-xs font-sans uppercase font-extrabold tracking-[0.2em]">
				<span>⚔</span>
				<span>Command Alerts</span>
			</div>

			<div className="grid grid-cols-1 gap-3">
				{/* ================= 1. OVERDUE STATUS ALERT ================= */}
				{overdueCount > 0 ? (
					<div className="p-3.5 rounded-xs border border-rose-800/80 bg-gradient-to-r from-rose-950/90 via-[#2A1010] to-[#1A0A0A] text-rose-200 shadow-md flex items-start gap-3">
						<AlertTriangle className="size-5 text-rose-400 shrink-0 mt-0.5" />
						<div className="min-w-0 flex-1">
							<h4 className="font-sans font-black text-sm uppercase tracking-wider text-rose-300">
								Overdue Tasks: {overdueCount} Requiring Attention
							</h4>
							<p className="text-xs font-sans text-rose-200/90 mt-0.5">
								{overdueCount} {overdueCount === 1 ? "task has" : "tasks have"}{" "}
								passed their scheduled due date.
							</p>
							<p className="text-[10px] font-serif italic text-rose-300/60 mt-1">
								Urgent decrees await execution across active war boards.
							</p>
						</div>
					</div>
				) : (
					<div className="p-3.5 rounded-xs border border-emerald-800/80 bg-gradient-to-r from-emerald-950/90 via-[#10241A] to-[#0A1A12] text-emerald-200 shadow-md flex items-start gap-3">
						<ShieldCheck className="size-5 text-emerald-400 shrink-0 mt-0.5" />
						<div className="min-w-0 flex-1">
							<h4 className="font-sans font-black text-sm uppercase tracking-wider text-emerald-300">
								No Overdue Tasks
							</h4>
							<p className="text-xs font-sans text-emerald-200/90 mt-0.5">
								All project deadlines are currently on schedule.
							</p>
							<p className="text-[10px] font-serif italic text-emerald-300/60 mt-1">
								The kingdom&apos;s operations remain in good order.
							</p>
						</div>
					</div>
				)}

				{/* ================= 2. ACTIVE PROGRESS ALERT ================= */}
				<div className="p-3.5 rounded-xs border border-amber-800/80 bg-gradient-to-r from-amber-950/90 via-[#2A1B10] to-[#1A120C] text-amber-200 shadow-md flex items-start gap-3">
					<AlertTriangle className="size-5 text-amber-400 shrink-0 mt-0.5" />
					<div className="min-w-0 flex-1">
						<h4 className="font-sans font-black text-sm uppercase tracking-wider text-amber-300">
							{pendingTasks > 0 ? "Tasks In Progress" : "No Active Work"}
						</h4>
						<p className="text-xs font-sans text-amber-200/90 mt-0.5">
							{pendingTasks > 0
								? `${pendingTasks} active ${pendingTasks === 1 ? "task is" : "tasks are"} currently being worked on out of ${totalTasks} total.`
								: "There are currently no active tasks remaining in the pipeline."}
						</p>
						<p className="text-[10px] font-serif italic text-amber-300/60 mt-1">
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
						<h4 className="font-sans font-black text-sm uppercase tracking-wider text-[#D7B05C]">
							Workspace Synced
						</h4>
						<p className="text-xs font-sans text-[#F8EEDB]/90 mt-0.5">
							Your workspace is connected and synchronized with live project
							data.
						</p>
						<p className="text-[10px] font-serif italic text-[#D7B05C]/60 mt-1">
							The royal archives remain current and fully operational.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
