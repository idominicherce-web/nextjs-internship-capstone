"use client";

import { Calendar, Clock } from "lucide-react";
import Link from "next/link";
import type { CalendarTask } from "./types";

interface UpcomingQuestsProps {
	tasks: CalendarTask[];
}

const PRIORITY_RANK: Record<string, number> = {
	Urgent: 4,
	High: 3,
	Medium: 2,
	Low: 1,
};

function slugify(text: string): string {
	return text
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, "")
		.replace(/[\s_-]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

export function Upcomingquests({ tasks = [] }: UpcomingQuestsProps) {
	const sortedTasks = [...tasks].sort((a, b) => {
		if (a.isCompleted !== b.isCompleted) {
			return a.isCompleted ? 1 : -1;
		}

		const dateA = new Date(a.dueDate).getTime();
		const dateB = new Date(b.dueDate).getTime();
		if (dateA !== dateB) {
			return dateA - dateB;
		}

		const rankA = PRIORITY_RANK[a.priority || "Medium"] || 2;
		const rankB = PRIORITY_RANK[b.priority || "Medium"] || 2;
		return rankB - rankA;
	});

	return (
		<div className="rounded-xs border-2 border-[#8F6236] bg-[#1A120C] p-4 shadow-xl space-y-3 font-serif">
			<div className="flex items-center justify-between border-b border-[#4A2C1D] pb-2">
				<div className="flex items-center gap-2 text-[#D7B05C]">
					<Calendar size={16} />
					<h3 className="font-serif font-black uppercase text-xs tracking-wider text-[#F8EEDB]">
						Upcoming Tasks & Priorities
					</h3>
				</div>
				<span className="text-[10px] font-sans font-extrabold uppercase text-[#D7B05C]/70">
					Next Objectives
				</span>
			</div>

			<div className="space-y-2">
				{sortedTasks.length === 0 ? (
					<div className="py-4 text-center text-xs italic text-[#D7B05C]/50">
						No upcoming tasks scheduled.
					</div>
				) : (
					sortedTasks.map((task) => {
						const projectSlug = slugify(task.projectName);
						const targetHref = `/projects/${projectSlug}?task=${task.id}`;

						return (
							<Link
								key={task.id}
								href={targetHref}
								className="block rounded-xs border border-[#8F6236]/60 bg-[#0F0B08] p-2.5 text-xs transition-colors hover:border-[#D7B05C] cursor-pointer"
							>
								<div className="flex items-start justify-between gap-2">
									<span className="font-serif font-bold text-[#F8EEDB] truncate">
										{task.title}
									</span>
									<span
										className={`shrink-0 rounded-xs px-1.5 py-0.5 text-[9px] font-sans font-black uppercase border ${
											task.isCompleted
												? "bg-emerald-950 border-emerald-700 text-emerald-300"
												: task.priority === "Urgent" || task.priority === "High"
													? "bg-rose-950 border-rose-800 text-rose-300"
													: "bg-[#1A120C] border-[#8F6236] text-[#D7B05C]"
										}`}
									>
										{task.isCompleted ? "Completed" : task.priority || "Medium"}
									</span>
								</div>

								<div className="mt-1 flex items-center justify-between text-[10px] text-[#D7B05C]/70 font-sans">
									<span className="truncate">
										{task.projectName} · {task.assignedTo || "Unassigned"}
									</span>
									<span className="flex items-center gap-1 shrink-0 italic">
										<Clock size={10} />
										Due{" "}
										{new Date(task.dueDate).toLocaleDateString("en-US", {
											month: "short",
											day: "numeric",
										})}
									</span>
								</div>
							</Link>
						);
					})
				)}
			</div>
		</div>
	);
}
