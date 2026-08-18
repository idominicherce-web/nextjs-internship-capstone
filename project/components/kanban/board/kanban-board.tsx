"use client";

import {
	closestCenter,
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
	useCallback,
	useEffect,
	useMemo,
	useOptimistic,
	useState,
	useTransition,
} from "react";
import { createList, deleteList } from "@/actions/lists";
import { createTask, reorderTasks, updateTaskPosition } from "@/actions/tasks";
import { KanbanAddColumnForm } from "@/components/kanban/board/kanban-add-column-form";
import { KanbanFilterBar } from "@/components/kanban/board/kanban-filter-bar";
import { KanbanFrame } from "@/components/kanban/board/kanban-frame";
import { KanbanModals } from "@/components/kanban/board/kanban-modals";
import type { List } from "@/components/kanban/column/kanban-column";
import { FloatingActionButton } from "@/components/kanban/fab/floating-action-button";
import type { TaskCardData } from "@/components/kanban/task/task-card";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
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

	useKeyboardShortcuts();

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
		useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
		useSensor(TouchSensor, {
			activationConstraint: { delay: 150, tolerance: 5 },
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

	const handleDragStart = useCallback((event: DragStartEvent) => {
		const taskData = event.active.data.current?.task as
			| TaskCardData
			| undefined;
		if (taskData) setActiveTask(taskData);
	}, []);

	const handleDragOver = useCallback((_event: DragOverEvent) => {}, []);

	const handleDragEnd = useCallback(
		async (event: DragEndEvent) => {
			const { active, over } = event;
			setActiveTask(null);
			if (!over) return;

			const activeTaskId = active.id as string;
			const overId = over.id as string;

			if (activeTaskId.startsWith("temp-")) return;

			const sourceList = listsState.find((l) =>
				l.tasks.some((t) => t.id === activeTaskId),
			);
			const targetList = listsState.find(
				(l) => l.id === overId || l.tasks.some((t) => t.id === overId),
			);

			if (!sourceList || !targetList) return;

			const isCrossColumn = sourceList.id !== targetList.id;
			const movedTask = sourceList.tasks.find((t) => t.id === activeTaskId);

			if (!movedTask) return;

			// Update state locally first so UI updates immediately with smooth animation
			const updatedLists = listsState
				.map((list) => {
					if (list.id === sourceList.id) {
						return {
							...list,
							tasks: list.tasks.filter((t) => t.id !== activeTaskId),
						};
					}
					return list;
				})
				.map((list) => {
					if (list.id === targetList.id) {
						const overTaskIndex = list.tasks.findIndex((t) => t.id === overId);
						const insertIndex =
							overTaskIndex >= 0 ? overTaskIndex : list.tasks.length;
						const newTasks = [...list.tasks];
						newTasks.splice(insertIndex, 0, {
							...movedTask!,
							listId: targetList.id,
						});
						return {
							...list,
							tasks: newTasks,
						};
					}
					return list;
				});

			setListsState(updatedLists);

			// Persist stage shift in background without full route revalidation
			if (isCrossColumn) {
				const targetTasks =
					updatedLists.find((l) => l.id === targetList.id)?.tasks || [];
				const newPosition = targetTasks.findIndex((t) => t.id === activeTaskId);

				await updateTaskPosition(
					activeTaskId,
					targetList.id,
					newPosition >= 0 ? newPosition : 0,
					projectId,
				);
			}

			const targetTasks =
				updatedLists.find((l) => l.id === targetList.id)?.tasks || [];
			const updatedTaskPositions = targetTasks
				.filter((t) => !t.id.startsWith("temp-"))
				.map((task, index) => ({
					id: task.id,
					listId: targetList.id,
					position: index,
				}));

			if (updatedTaskPositions.length > 0) {
				await reorderTasks(updatedTaskPositions, projectId);
			}
		},
		[listsState, projectId],
	);

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
				collisionDetection={closestCenter}
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

				<DragOverlay dropAnimation={null}>
					{activeTask ? (
						<div className="w-full max-w-[280px] sm:max-w-xs p-3.5 bg-[#FAF0D7] border-2 border-[#D7B05C] text-[#1A120C] rounded-xs shadow-2xl pointer-events-none cursor-grabbing opacity-90">
							<h4 className="font-serif font-black text-xs sm:text-sm">
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
