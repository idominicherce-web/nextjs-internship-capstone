"use client";

import { useDroppable } from "@dnd-kit/core";
import {
	SortableContext,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type React from "react";
import { deleteTask } from "@/actions/tasks";
import { KanbanColumnHeader } from "@/components/kanban/column/kanban-column-header";
import {
	TaskCard,
	type TaskCardData,
} from "@/components/kanban/task/task-card";

export interface List {
	id: string;
	name: string;
	tasks: TaskCardData[];
}

interface KanbanColumnProps {
	list: List;
	projectId: string;
	taskInputs: Record<string, string>;
	setTaskInputs: React.Dispatch<React.SetStateAction<Record<string, string>>>;
	deleteList: (id: string, projectId: string) => void;
	handleAddTask: (listId: string) => void;
	onTaskClick: (task: TaskCardData) => void;
}

export function KanbanColumn({
	list,
	projectId,
	taskInputs,
	setTaskInputs,
	deleteList,
	handleAddTask,
	onTaskClick,
}: KanbanColumnProps) {
	const { setNodeRef } = useDroppable({
		id: list.id,
		data: { type: "Column", list },
	});

	const isDoneColumn =
		list.name.toLowerCase().includes("done") ||
		list.name.toLowerCase().includes("complete");

	return (
		<div className="shrink-0 w-full sm:w-80 lg:w-80 snap-center">
			<div
				className={`w-full rounded-xs border-2 shadow-2xl overflow-hidden flex flex-col transition-all ${
					isDoneColumn
						? "border-emerald-800/80 bg-gradient-to-b from-[#1A2E22] via-[#121F17] to-[#0D1610]"
						: "border-[#8F6236]/80 bg-gradient-to-b from-[#2D1B10] via-[#1A120C] to-[#15100C]"
				}`}
			>
				{/* Column Header */}
				<KanbanColumnHeader
					name={list.name}
					taskCount={list.tasks?.length || 0}
					listId={list.id}
					projectId={projectId}
					onDeleteList={deleteList}
				/>

				{/* Task Container */}
				<SortableContext
					items={list.tasks.map((t) => t.id)}
					strategy={verticalListSortingStrategy}
				>
					<div
						ref={setNodeRef}
						className="p-2 sm:p-3 space-y-2.5 min-h-[260px]"
					>
						{list.tasks.length === 0 ? (
							<div className="p-4 border border-dashed border-[#8F6236]/30 bg-[#15100C]/40 text-center rounded-xs my-2">
								<p className="text-[11px] font-serif italic text-[#D7B05C]/50">
									No objectives assigned.
								</p>
								<p className="text-[9px] font-sans text-[#D7B05C]/30 mt-0.5">
									Add a new objective below or edit stage from modal.
								</p>
							</div>
						) : (
							list.tasks.map((task) => (
								<TaskCard
									key={task.id}
									task={task}
									projectId={projectId}
									onTaskClick={onTaskClick}
									onDeleteTask={deleteTask}
								/>
							))
						)}

						{/* Quick Task Creator */}
						<div className="pt-2 border-t border-[#4A2C1D]">
							<input
								type="text"
								value={taskInputs[list.id] || ""}
								onChange={(e) =>
									setTaskInputs((prev) => ({
										...prev,
										[list.id]: e.target.value,
									}))
								}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										e.preventDefault();
										handleAddTask(list.id);
									}
								}}
								placeholder="＋ Add objective and press Enter..."
								className="w-full px-3 py-2 bg-[#FAF0D7] border border-[#8F6236] rounded-xs text-xs font-sans font-extrabold text-[#1A120C] placeholder-[#8F6236]/80 focus:outline-none focus:border-[#D7B05C] shadow-inner"
							/>
						</div>
					</div>
				</SortableContext>
			</div>
		</div>
	);
}
