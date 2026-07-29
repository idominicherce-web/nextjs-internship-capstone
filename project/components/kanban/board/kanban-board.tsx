"use client";

import {
	closestCorners,
	DndContext,
	type DragEndEvent,
	type DragOverEvent,
	DragOverlay,
	type DragStartEvent,
	KeyboardSensor,
	MouseSensor,
	TouchSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { ShieldAlert } from "lucide-react";
import type React from "react";
import { useEffect, useOptimistic, useState, useTransition } from "react";
import { createList, deleteList } from "@/actions/lists";
import { createTask, reorderTasks } from "@/actions/tasks";
import { getUsers } from "@/actions/users";
import { BoardColumnScroller } from "@/components/kanban/board/board-column-scroller";
import { KanbanAddColumnForm } from "@/components/kanban/board/kanban-add-column-form";
import type { List } from "@/components/kanban/column/kanban-column";
import { FloatingActionButton } from "@/components/kanban/fab/floating-action-button";
import type { TaskCardData } from "@/components/kanban/task/task-card";
import { CreateTaskModal } from "@/components/modals/create-task-modal";
import { TaskDetailModal } from "@/components/modals/task-detail-modal";

interface KanbanBoardProps {
	projectId: string;
	initialLists?: List[];
}

type OptimisticAction =
	| {
			type: "MOVE_TASK";
			payload: { taskId: string; sourceListId: string; targetListId: string };
	  }
	| { type: "ADD_TASK"; payload: { listId: string; newTask: TaskCardData } }
	| { type: "DELETE_TASK"; payload: { taskId: string } };

export function KanbanBoard({
	projectId,
	initialLists = [],
}: KanbanBoardProps) {
	const [listsState, setListsState] = useState<List[]>(initialLists);
	const [activeTask, setActiveTask] = useState<TaskCardData | null>(null);
	const [editingTask, setEditingTask] = useState<TaskCardData | null>(null);
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [newListName, setNewListName] = useState("");
	const [taskInputs, setTaskInputs] = useState<Record<string, string>>({});
	const [isLoading, setIsLoading] = useState(false);
	const [isMounted, setIsMounted] = useState(false);
	const [usersList, setUsersList] = useState<
		{ id: string; name: string | null; email: string }[]
	>([]);
	const [, startTransition] = useTransition();

	useEffect(() => {
		setIsMounted(true);
	}, []);

	useEffect(() => {
		setListsState(initialLists);
	}, [initialLists]);

	useEffect(() => {
		async function fetchUsers() {
			const res = await getUsers();
			if (res.success && res.data) {
				setUsersList(res.data);
			}
		}
		fetchUsers();
	}, []);

	const [optimisticLists, setOptimisticLists] = useOptimistic(
		listsState,
		(currentLists: List[], action: OptimisticAction) => {
			switch (action.type) {
				case "MOVE_TASK": {
					const { taskId, sourceListId, targetListId } = action.payload;
					let movedTask: TaskCardData | undefined;

					const newLists = currentLists.map((list) => {
						if (list.id === sourceListId) {
							movedTask = list.tasks.find((t) => t.id === taskId);
							return {
								...list,
								tasks: list.tasks.filter((t) => t.id !== taskId),
							};
						}
						return list;
					});

					if (!movedTask) return currentLists;

					return newLists.map((list) => {
						if (list.id === targetListId) {
							return {
								...list,
								tasks: [...list.tasks, { ...movedTask!, listId: targetListId }],
							};
						}
						return list;
					});
				}
				case "ADD_TASK": {
					const { listId, newTask } = action.payload;
					return currentLists.map((list) => {
						if (list.id === listId) {
							return { ...list, tasks: [...list.tasks, newTask] };
						}
						return list;
					});
				}
				case "DELETE_TASK": {
					const { taskId } = action.payload;
					return currentLists.map((list) => ({
						...list,
						tasks: list.tasks.filter((t) => t.id !== taskId),
					}));
				}
				default:
					return currentLists;
			}
		},
	);

	// Static sensor array reference to prevent useEffect dependency size changes
	const sensors = useSensors(
		useSensor(MouseSensor, {
			activationConstraint: {
				distance: 10,
			},
		}),
		useSensor(TouchSensor, {
			activationConstraint: {
				delay: 250,
				tolerance: 5,
			},
		}),
		useSensor(KeyboardSensor),
	);

	const handleAddList = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newListName.trim()) return;

		setIsLoading(true);
		await createList(projectId, newListName);
		setNewListName("");
		setIsLoading(false);
	};

	const handleAddTask = async (listId: string) => {
		const taskTitle = taskInputs[listId];
		if (!taskTitle?.trim()) return;

		const tempId = `temp-${Date.now()}`;
		const tempTask: TaskCardData = {
			id: tempId,
			title: taskTitle.trim(),
			description: null,
			position: 999,
			listId,
			userId: null,
			dueDate: null,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		setTaskInputs((prev) => ({ ...prev, [listId]: "" }));

		startTransition(async () => {
			setOptimisticLists({
				type: "ADD_TASK",
				payload: { listId, newTask: tempTask },
			});
			await createTask(null, {
				listId,
				projectId,
				title: taskTitle.trim(),
			});
		});
	};

	const handleDragStart = (event: DragStartEvent) => {
		const taskData = event.active.data.current?.task as
			| TaskCardData
			| undefined;
		if (taskData) {
			setActiveTask(taskData);
		}
	};

	const handleDragOver = (event: DragOverEvent) => {
		const { active, over } = event;
		if (!over) return;

		const activeTaskId = active.id as string;
		const overId = over.id as string;

		const sourceList = optimisticLists.find((l) =>
			l.tasks.some((t) => t.id === activeTaskId),
		);
		const targetList = optimisticLists.find(
			(l) => l.id === overId || l.tasks.some((t) => t.id === overId),
		);

		if (!sourceList || !targetList || sourceList.id === targetList.id) return;

		startTransition(() => {
			setOptimisticLists({
				type: "MOVE_TASK",
				payload: {
					taskId: activeTaskId,
					sourceListId: sourceList.id,
					targetListId: targetList.id,
				},
			});
		});
	};

	const handleDragEnd = async (event: DragEndEvent) => {
		const { over } = event;
		setActiveTask(null);

		if (!over) return;

		const overId = over.id as string;

		const targetList = optimisticLists.find(
			(l) => l.id === overId || l.tasks.some((t) => t.id === overId),
		);

		if (!targetList) return;

		const taskUpdates = targetList.tasks.map((task, index) => ({
			id: task.id,
			listId: targetList.id,
			position: index,
		}));

		await reorderTasks(taskUpdates, projectId);
	};

	if (!isMounted) return null;

	return (
		<div className="space-y-4 sm:space-y-6">
			{/* Add Column Form */}
			<KanbanAddColumnForm
				newListName={newListName}
				setNewListName={setNewListName}
				isLoading={isLoading}
				onSubmit={handleAddList}
			/>

			<DndContext
				sensors={sensors}
				collisionDetection={closestCorners}
				onDragStart={handleDragStart}
				onDragOver={handleDragOver}
				onDragEnd={handleDragEnd}
			>
				{/* Outer Board Frame */}
				<div className="relative rounded-xs border-2 sm:border-4 border-[#3B2415] bg-gradient-to-b from-[#4A2C1D] via-[#2D1B10] to-[#15100C] p-1 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden">
					{/* Brass Corner Fittings */}
					<div className="absolute left-1 top-1 z-30 h-3 w-3 border border-black bg-gradient-to-br from-[#D7B05C] to-[#8F6236]" />
					<div className="absolute right-1 top-1 z-30 h-3 w-3 border border-black bg-gradient-to-br from-[#D7B05C] to-[#8F6236]" />
					<div className="absolute bottom-1 left-1 z-30 h-3 w-3 border border-black bg-gradient-to-br from-[#D7B05C] to-[#8F6236]" />
					<div className="absolute bottom-1 right-1 z-30 h-3 w-3 border border-black bg-gradient-to-br from-[#D7B05C] to-[#8F6236]" />

					{optimisticLists.length === 0 ? (
						<div className="text-center py-12 sm:py-16 border-2 border-dashed border-[#8F6236]/40 bg-[#15100C] rounded-xs space-y-2">
							<ShieldAlert size={32} className="mx-auto text-[#D7B05C]/50" />
							<h3 className="text-base sm:text-lg font-serif font-black text-[#F8EEDB]">
								No Columns Created Yet
							</h3>
							<p className="text-xs font-sans text-[#D7B05C]/70 max-w-sm mx-auto px-4">
								Type a column name above to start organizing your project tasks
								on the board.
							</p>
						</div>
					) : (
						<BoardColumnScroller
							lists={optimisticLists}
							projectId={projectId}
							taskInputs={taskInputs}
							setTaskInputs={setTaskInputs}
							deleteList={deleteList}
							handleAddTask={handleAddTask}
							onTaskClick={(task) => setEditingTask(task)}
						/>
					)}
				</div>

				<DragOverlay>
					{activeTask ? (
						<div className="p-3 bg-[#FAF0D7] border-2 border-[#D7B05C] text-[#1A120C] rounded-xs shadow-2xl opacity-95 -rotate-2 scale-105">
							<h4 className="font-serif font-black text-xs">
								{activeTask.title}
							</h4>
						</div>
					) : null}
				</DragOverlay>
			</DndContext>

			{/* Floating Action Button */}
			<FloatingActionButton onClick={() => setIsCreateModalOpen(true)} />

			{/* Modals */}
			<CreateTaskModal
				projectId={projectId}
				lists={optimisticLists.map((l) => ({ id: l.id, name: l.name }))}
				users={usersList}
				isOpen={isCreateModalOpen}
				onClose={() => setIsCreateModalOpen(false)}
			/>

			<TaskDetailModal
				task={editingTask}
				projectId={projectId}
				users={usersList}
				lists={optimisticLists.map((l) => ({ id: l.id, name: l.name }))}
				isOpen={!!editingTask}
				onClose={() => setEditingTask(null)}
			/>
		</div>
	);
}
