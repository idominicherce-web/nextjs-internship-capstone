"use client";

import { AlertCircle, Clock, ShieldAlert } from "lucide-react";
import Link from "next/link";

export interface AttentionTask {
	id: string;
	title: string;
	dueDate: Date | string;
	priority: string;
	projectName: string;
	projectSlug: string;
	assignedTo?: string;
	groupLabel: "OVERDUE" | "TODAY" | "TOMORROW" | "UPCOMING";
	semanticDate: string;
}

interface TasksRequiringAttentionProps {
	tasks: AttentionTask[];
}

export function TasksRequiringAttention({
	tasks = [],
}: TasksRequiringAttentionProps) {
	// Group tasks by their calculated groupLabel
	const groupedTasks = {
		OVERDUE: tasks.filter((t) => t.groupLabel === "OVERDUE"),
		TODAY: tasks.filter((t) => t.groupLabel === "TODAY"),
		TOMORROW: tasks.filter((t) => t.groupLabel === "TOMORROW"),
		UPCOMING: tasks.filter((t) => t.groupLabel === "UPCOMING"),
	};

	return (
		<div className="rounded-xs border-2 border-[#8F6236] bg-[#1A120C] p-4 shadow-xl space-y-4 font-serif">
			{/* Section Header */}
			<div className="flex items-center justify-between border-b border-[#4A2C1D] pb-2">
				<div className="flex items-center gap-2 text-[#D7B05C]">
					<ShieldAlert size={18} className="text-[#D7B05C]" />
					<h3 className="font-serif font-black uppercase text-xs tracking-wider text-[#F8EEDB]">
						Tasks Requiring Attention
					</h3>
				</div>
				<Link
					href="/calendar"
					className="text-[10px] font-sans font-extrabold uppercase text-[#D7B05C] hover:text-[#FFF5D6] transition-colors"
				>
					View Calendar →
				</Link>
			</div>

			{tasks.length === 0 ? (
				<div className="py-6 text-center text-xs italic text-[#E3C279]/60 font-sans border border-dashed border-[#4A2C1D] rounded-xs bg-[#15100C]">
					All clear! You have no pending tasks requiring immediate attention.
				</div>
			) : (
				<div className="space-y-4 font-sans">
					{/* OVERDUE BUCKET */}
					{groupedTasks.OVERDUE.length > 0 && (
						<div className="space-y-2">
							<div className="flex items-center gap-2 text-[10px] font-black uppercase text-rose-400 tracking-wider">
								<AlertCircle size={12} />
								<span>Overdue</span>
								<div className="h-px flex-1 bg-rose-900/60" />
							</div>
							<div className="space-y-2">
								{groupedTasks.OVERDUE.map((task) => (
									<TaskCard key={task.id} task={task} isOverdue />
								))}
							</div>
						</div>
					)}

					{/* TODAY BUCKET */}
					{groupedTasks.TODAY.length > 0 && (
						<div className="space-y-2">
							<div className="flex items-center gap-2 text-[10px] font-black uppercase text-amber-400 tracking-wider">
								<Clock size={12} />
								<span>Due Today</span>
								<div className="h-px flex-1 bg-amber-900/60" />
							</div>
							<div className="space-y-2">
								{groupedTasks.TODAY.map((task) => (
									<TaskCard key={task.id} task={task} />
								))}
							</div>
						</div>
					)}

					{/* TOMORROW BUCKET */}
					{groupedTasks.TOMORROW.length > 0 && (
						<div className="space-y-2">
							<div className="flex items-center gap-2 text-[10px] font-black uppercase text-[#D7B05C] tracking-wider">
								<span>Tomorrow</span>
								<div className="h-px flex-1 bg-[#4A2C1D]" />
							</div>
							<div className="space-y-2">
								{groupedTasks.TOMORROW.map((task) => (
									<TaskCard key={task.id} task={task} />
								))}
							</div>
						</div>
					)}

					{/* UPCOMING BUCKET */}
					{groupedTasks.UPCOMING.length > 0 && (
						<div className="space-y-2">
							<div className="flex items-center gap-2 text-[10px] font-black uppercase text-[#E3C279]/70 tracking-wider">
								<span>Upcoming</span>
								<div className="h-px flex-1 bg-[#4A2C1D]/60" />
							</div>
							<div className="space-y-2">
								{groupedTasks.UPCOMING.map((task) => (
									<TaskCard key={task.id} task={task} />
								))}
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
}

function TaskCard({
	task,
	isOverdue = false,
}: {
	task: AttentionTask;
	isOverdue?: boolean;
}) {
	return (
		<Link
			href={`/projects/${task.projectSlug}?task=${task.id}`}
			className={`block p-3 rounded-xs border transition-colors shadow-sm ${
				isOverdue
					? "border-rose-900/80 bg-rose-950/20 hover:border-rose-600"
					: "border-[#8F6236]/60 bg-[#15100C] hover:border-[#D7B05C]"
			}`}
		>
			<div className="flex items-start justify-between gap-2">
				<div className="min-w-0 flex-1">
					<h4 className="font-serif font-bold text-xs text-[#F8EEDB] truncate">
						{task.title}
					</h4>
					<p className="text-[10px] text-[#E3C279] truncate mt-0.5">
						{task.projectName}
					</p>
				</div>

				<span
					className={`shrink-0 px-2 py-0.5 text-[8.5px] font-sans font-black uppercase rounded-xs border ${
						task.priority === "Urgent" || task.priority === "High"
							? "bg-rose-950 border-rose-800 text-rose-300"
							: "bg-[#2D1B10] border-[#8F6236] text-[#D7B05C]"
					}`}
				>
					{task.priority || "Medium"}
				</span>
			</div>

			<div className="mt-2 flex items-center justify-between text-[10px] font-sans pt-1.5 border-t border-[#4A2C1D]/40">
				<span className="text-[#E3C279]/70 truncate">
					{task.assignedTo || "Unassigned"}
				</span>
				<span
					className={`font-bold italic flex items-center gap-1 ${
						isOverdue ? "text-rose-400" : "text-[#D7B05C]"
					}`}
				>
					<Clock size={10} />
					{task.semanticDate}
				</span>
			</div>
		</Link>
	);
}
