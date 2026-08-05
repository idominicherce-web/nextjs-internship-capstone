"use client";

import { useEffect, useRef, useState } from "react";
import { getUsers } from "@/actions/users";
import type { List } from "@/components/kanban/column/kanban-column";
import { AssignProjectMemberModal } from "@/components/modals/assign-project-member-modal";
import { CreateTaskModal } from "@/components/modals/create-task-modal";
import { InviteMemberModal } from "@/components/modals/invite-member-modal";
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
		isInviteMemberModalOpen,
		isAssignProjectMemberModalOpen,
		closeCreateTaskModal,
		closeTaskDetailModal,
		closeInviteMemberModal,
		closeAssignProjectMemberModal,
	} = useKanbanStore();

	useEffect(() => {
		if (hasFetchedRef.current) return;

		if (
			isCreateTaskModalOpen ||
			editingTask ||
			isInviteMemberModalOpen ||
			isAssignProjectMemberModalOpen
		) {
			hasFetchedRef.current = true;
			async function fetchUsers() {
				const res = await getUsers();
				if (res.success && res.data) {
					setUsersList(res.data);
				}
			}
			fetchUsers();
		}
	}, [
		isCreateTaskModalOpen,
		editingTask,
		isInviteMemberModalOpen,
		isAssignProjectMemberModalOpen,
	]);

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

			<InviteMemberModal
				projectId={projectId}
				isOpen={isInviteMemberModalOpen}
				onClose={closeInviteMemberModal}
			/>

			<AssignProjectMemberModal
				projectId={projectId}
				isOpen={isAssignProjectMemberModalOpen}
				onClose={closeAssignProjectMemberModal}
			/>
		</>
	);
}
