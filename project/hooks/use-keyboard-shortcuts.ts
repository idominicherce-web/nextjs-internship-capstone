"use client";

import { useEffect } from "react";
import { useKanbanStore } from "@/stores/use-kanban-store";

export function useKeyboardShortcuts() {
	const {
		isCreateTaskModalOpen,
		isInviteMemberModalOpen,
		isAssignProjectMemberModalOpen,
		editingTask,
		openCreateTaskModal,
		closeCreateTaskModal,
		openInviteMemberModal,
		closeInviteMemberModal,
		openAssignProjectMemberModal,
		closeAssignProjectMemberModal,
		closeTaskDetailModal,
	} = useKanbanStore();

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			// Do not trigger global shortcuts when typing inside form inputs, textareas, or select elements
			const target = event.target as HTMLElement;
			const isInputActive =
				target.tagName === "INPUT" ||
				target.tagName === "TEXTAREA" ||
				target.tagName === "SELECT" ||
				target.isContentEditable;

			// 1. Escape Key Dismissal (Works regardless of active input)
			if (event.key === "Escape") {
				if (isCreateTaskModalOpen) closeCreateTaskModal();
				if (isInviteMemberModalOpen) closeInviteMemberModal();
				if (isAssignProjectMemberModalOpen) closeAssignProjectMemberModal();
				if (editingTask) closeTaskDetailModal();
				return;
			}

			// Ignore single-key shortcuts if user is typing in an input field
			if (isInputActive) return;

			// 2. Global Quick Trigger Shortcuts
			if (event.key === "n" || event.key === "N") {
				event.preventDefault();
				openCreateTaskModal();
			} else if (event.key === "i" || event.key === "I") {
				event.preventDefault();
				openInviteMemberModal();
			} else if (event.key === "a" || event.key === "A") {
				event.preventDefault();
				openAssignProjectMemberModal();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [
		isCreateTaskModalOpen,
		isInviteMemberModalOpen,
		isAssignProjectMemberModalOpen,
		editingTask,
		openCreateTaskModal,
		closeCreateTaskModal,
		openInviteMemberModal,
		closeInviteMemberModal,
		openAssignProjectMemberModal,
		closeAssignProjectMemberModal,
		closeTaskDetailModal,
	]);
}
