"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Calendar, MessageSquare, Trash2, User } from "lucide-react";
import { TaskPriorityBadge } from "@/components/kanban/task/task-priority-badge";

export interface TaskCardData {
	id: string;
	title: string;
	description: string | null;
	position: number;
	listId: string;
	userId?: string | null;
	dueDate?: Date | string | null;
	priority?: "Low" | "Medium" | "High" | "Urgent" | null;
	assignee?: {
		id: string;
		name: string | null;
		email: string;
	} | null;
	comments?: any[];
	createdAt?: Date | string | null;
	updatedAt?: Date | string | null;
}

interface TaskCardProps {
	task: TaskCardData;
	projectId: string;
	onTaskClick: (task: TaskCardData) => void;
	onDeleteTask: (taskId: string, projectId: string) => void;
}

export function TaskCard({
	task,
	projectId,
	onTaskClick,
	onDeleteTask,
}: TaskCardProps) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: task.id,
		data: { type: "Task", task },
	});

	const style = {
		transform: CSS.Translate.toString(transform),
		transition: isDragging ? undefined : transition,
		willChange: "transform",
	};

	const getDueStatus = () => {
		if (!task.dueDate) return null;
		const due = new Date(task.dueDate);
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		if (due < today) {
			return {
				label: `Overdue (${due.toLocaleDateString("en-US", { month: "short", day: "numeric" })})`,
				color: "bg-rose-950 text-rose-300 border-rose-600/70",
				dot: "bg-rose-500",
			};
		}
		const diffDays = Math.ceil(
			(due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
		);
		if (diffDays <= 2) {
			return {
				label: `Due ${due.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
				color: "bg-amber-950 text-amber-300 border-amber-600/70",
				dot: "bg-amber-500",
			};
		}
		return {
			label: `Due ${due.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
			color: "bg-[#1A120C] text-[#D7B05C] border-[#8F6236]",
			dot: "bg-emerald-500",
		};
	};

	const dueStatus = getDueStatus();
	const commentCount = task.comments?.length || 0;

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			onClick={() => onTaskClick(task)}
			className={`group relative w-full p-3.5 sm:p-4 rounded-xs border-2 border-[#8F6236] bg-[#FAF0D7] text-[#1A120C] shadow-md hover:-translate-y-0.5 hover:border-[#D7B05C] hover:shadow-[0_8px_20px_rgba(215,176,92,0.35)] cursor-grab active:cursor-grabbing select-none overflow-hidden ${
				isDragging
					? "opacity-30 border-dashed border-[#D7B05C]"
					: "transition-transform duration-150"
			}`}
		>
			<div
				className="pointer-events-none absolute inset-0 opacity-40 mix-blend-multiply"
				style={{
					backgroundImage: `
            repeating-linear-gradient(
              0deg,
              rgba(0,0,0,0.03),
              rgba(0,0,0,0.03) 1px,
              transparent 1px,
              transparent 8px
            )
          `,
				}}
			/>

			<div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#8F6236] border border-[#1A120C] shadow-xs" />

			<div className="space-y-2 relative z-10 pr-3">
				<h4 className="font-serif font-black text-xs sm:text-sm text-[#1A120C] group-hover:text-[#5B3922] transition-colors leading-snug">
					{task.title}
				</h4>

				{task.description && (
					<p className="hidden sm:block text-[10px] font-sans text-[#3B2415]/80 line-clamp-2 italic leading-tight">
						{task.description}
					</p>
				)}

				<div className="flex flex-wrap items-center gap-1.5 pt-1.5 border-t border-[#8F6236]/20">
					{dueStatus && (
						<span
							className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-xs border text-[9px] font-sans font-extrabold uppercase shadow-xs ${dueStatus.color}`}
						>
							<span className={`w-1.5 h-1.5 rounded-full ${dueStatus.dot}`} />
							<Calendar size={10} />
							{dueStatus.label}
						</span>
					)}

					<TaskPriorityBadge priority={task.priority} />

					{/* Comment Count Badge */}
					{commentCount > 0 && (
						<span
							className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs bg-[#1A120C] text-[#D7B05C] border border-[#8F6236] text-[9px] font-mono font-bold shadow-xs"
							title={`${commentCount} comment(s)`}
						>
							<MessageSquare size={10} />
							{commentCount}
						</span>
					)}

					{task.assignee && (
						<span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-xs bg-[#1A120C] text-[#D7B05C] border border-[#4A2C1D] text-[9px] font-sans font-bold shadow-xs">
							<User size={10} />
							{task.assignee.name || task.assignee.email.split("@")[0]}
						</span>
					)}
				</div>
			</div>

			<button
				type="button"
				onPointerDown={(e) => e.stopPropagation()}
				onClick={(e) => {
					e.stopPropagation();
					e.preventDefault();
					onDeleteTask(task.id, projectId);
				}}
				className="absolute top-2 right-6 opacity-0 group-hover:opacity-100 p-1 text-[#8F6236] hover:text-rose-700 transition-all cursor-pointer z-20 pointer-events-auto"
				title="Delete Task"
			>
				<Trash2 size={13} />
			</button>
		</div>
	);
}
