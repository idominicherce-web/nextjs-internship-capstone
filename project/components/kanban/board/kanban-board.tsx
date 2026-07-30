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
import type React from "react";
import {
	useEffect,
	useMemo,
	useOptimistic,
	useState,
	useTransition,
} from "react";
import { createList, deleteList } from "@/actions/lists";
import { createTask, reorderTasks } from "@/actions/tasks";
import { KanbanAddColumnForm } from "@/components/kanban/board/kanban-add-column-form";
import { KanbanFilterBar } from "@/components/kanban/board/kanban-filter-bar";
import { KanbanFrame } from "@/components/kanban/board/kanban-frame";
import { KanbanModals } from "@/components/kanban/board/kanban-modals";
import type { List } from "@/components/kanban/column/kanban-column";
import { FloatingActionButton } from "@/components/kanban/fab/floating-action-button";
import type { TaskCardData } from "@/components/kanban/task/task-card";
import { useKanbanStore } from "@/stores/use-kanban-store";

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
	const [newListName, setNewListName] = useState("");
	const [taskInputs, setTaskInputs] = useState<Record<string, string>>({});
	const [isLoading, setIsLoading] = useState(false);
	const [isMounted, setIsMounted] = useState(false);
	const [, startTransition] = useTransition();

	const {
		searchQuery,
		selectedPriority,
		openCreateTaskModal,
		openTaskDetailModal,
	} = useKanbanStore();

	useEffect(() => {
		setIsMounted(true);
	}, []);

	useEffect(() => {
		setListsState(initialLists);
	}, [initialLists]);

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

	const filteredLists = useMemo(() => {
		if (!searchQuery.trim() && !selectedPriority) return optimisticLists;
		const q = searchQuery.toLowerCase().trim();

		return optimisticLists.map((list) => ({
			...list,
			tasks: list.tasks.filter((task) => {
				const matchesSearch =
					!q ||
					task.title.toLowerCase().includes(q) ||
					task.description?.toLowerCase().includes(q);

				const matchesPriority =
					!selectedPriority ||
					task.priority?.toLowerCase() === selectedPriority.toLowerCase();

				return matchesSearch && matchesPriority;
			}),
		}));
	}, [optimisticLists, searchQuery, selectedPriority]);

	const sensors = useSensors(
		useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
		useSensor(TouchSensor, {
			activationConstraint: { delay: 250, tolerance: 5 },
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

		const tempTask: TaskCardData = {
			id: `temp-${Date.now()}`,
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
		if (taskData) setActiveTask(taskData);
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
			<KanbanAddColumnForm
				newListName={newListName}
				setNewListName={setNewListName}
				isLoading={isLoading}
				onSubmit={handleAddList}
			/>

			<KanbanFilterBar />

			<DndContext
				sensors={sensors}
				collisionDetection={closestCorners}
				onDragStart={handleDragStart}
				onDragOver={handleDragOver}
				onDragEnd={handleDragEnd}
			>
				<KanbanFrame
					lists={filteredLists}
					projectId={projectId}
					taskInputs={taskInputs}
					setTaskInputs={setTaskInputs}
					deleteList={deleteList}
					handleAddTask={handleAddTask}
					onTaskClick={(task) => openTaskDetailModal(task)}
				/>

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

			<FloatingActionButton onClick={() => openCreateTaskModal()} />

			<KanbanModals projectId={projectId} lists={optimisticLists} />
		</div>
	);
}
