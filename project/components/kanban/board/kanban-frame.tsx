"use client";

import { ShieldAlert } from "lucide-react";
import type React from "react";
import { BoardColumnScroller } from "@/components/kanban/board/board-column-scroller";
import type { List } from "@/components/kanban/column/kanban-column";
import type { TaskCardData } from "@/components/kanban/task/task-card";

interface KanbanFrameProps {
	lists: List[];
	projectId: string;
	taskInputs: Record<string, string>;
	setTaskInputs: React.Dispatch<React.SetStateAction<Record<string, string>>>;
	deleteList: (id: string, projectId: string) => void;
	handleAddTask: (listId: string) => void;
	onTaskClick: (task: TaskCardData) => void;
}

export function KanbanFrame({
	lists,
	projectId,
	taskInputs,
	setTaskInputs,
	deleteList,
	handleAddTask,
	onTaskClick,
}: KanbanFrameProps) {
	return (
		<div className="relative rounded-xs border-2 sm:border-4 border-[#3B2415] bg-gradient-to-b from-[#4A2C1D] via-[#2D1B10] to-[#15100C] p-0 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden">
			{/* Brass Corner Fittings */}
			<div className="absolute left-1 top-1 z-30 h-3 w-3 border border-black bg-gradient-to-br from-[#D7B05C] to-[#8F6236]" />
			<div className="absolute right-1 top-1 z-30 h-3 w-3 border border-black bg-gradient-to-br from-[#D7B05C] to-[#8F6236]" />
			<div className="absolute bottom-1 left-1 z-30 h-3 w-3 border border-black bg-gradient-to-br from-[#D7B05C] to-[#8F6236]" />
			<div className="absolute bottom-1 right-1 z-30 h-3 w-3 border border-black bg-gradient-to-br from-[#D7B05C] to-[#8F6236]" />

			{lists.length === 0 ? (
				<div className="text-center py-12 sm:py-16 border-2 border-dashed border-[#8F6236]/40 bg-[#15100C] rounded-xs space-y-2">
					<ShieldAlert size={32} className="mx-auto text-[#D7B05C]/50" />
					<h3 className="text-base sm:text-lg font-serif font-black text-[#F8EEDB]">
						No Columns Created Yet
					</h3>
					<p className="text-xs font-sans text-[#D7B05C]/70 max-w-sm mx-auto px-4">
						Type a column name above to start organizing your project tasks on
						the board.
					</p>
				</div>
			) : (
				<BoardColumnScroller
					lists={lists}
					projectId={projectId}
					taskInputs={taskInputs}
					setTaskInputs={setTaskInputs}
					deleteList={deleteList}
					handleAddTask={handleAddTask}
					onTaskClick={onTaskClick}
				/>
			)}
		</div>
	);
}
