"use client";

import { useEffect, useRef, useState } from "react";
import { getUsers } from "@/actions/users";
import type { List } from "@/components/kanban/column/kanban-column";
import { CreateTaskModal } from "@/components/modals/create-task-modal";
import { TaskDetailModal } from "@/components/modals/task-detail-modal";
import { useKanbanStore } from "@/stores/use-kanban-store";

interface KanbanModalsProps {
	projectId: string;
	lists: List[];
}

export function KanbanModals({ projectId, lists }: KanbanModalsProps) {
	const [usersList, setUsersList] = useState<
		{ id: string; name: string | null; email: string }[]
	>([]);
	const hasFetchedRef = useRef(false);

	const {
		isCreateTaskModalOpen,
		editingTask,
		closeCreateTaskModal,
		closeTaskDetailModal,
	} = useKanbanStore();

	// Fetch users ONCE when a modal opens, guarded by ref
	useEffect(() => {
		if (hasFetchedRef.current) return;

		if (isCreateTaskModalOpen || editingTask) {
			hasFetchedRef.current = true;
			async function fetchUsers() {
				const res = await getUsers();
				if (res.success && res.data) {
					setUsersList(res.data);
				}
			}
			fetchUsers();
		}
	}, [isCreateTaskModalOpen, editingTask]);

	const formattedLists = lists.map((l) => ({ id: l.id, name: l.name }));

	return (
		<>
			<CreateTaskModal
				projectId={projectId}
				lists={formattedLists}
				users={usersList}
				isOpen={isCreateTaskModalOpen}
				onClose={closeCreateTaskModal}
			/>

			<TaskDetailModal
				task={editingTask}
				projectId={projectId}
				users={usersList}
				lists={formattedLists}
				isOpen={!!editingTask}
				onClose={closeTaskDetailModal}
			/>
		</>
	);
}
