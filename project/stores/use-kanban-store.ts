import { create } from "zustand";

interface TaskCardData {
	id: string;
	title: string;
	description: string | null;
	listId: string;
	userId?: string | null;
	dueDate?: Date | string | null;
	priority?: string | null;
}

interface KanbanStore {
	// Filter State
	searchQuery: string;
	selectedPriority: string | null;
	setSearchQuery: (query: string) => void;
	setSelectedPriority: (priority: string | null) => void;
	clearFilters: () => void;

	// Modal State
	isCreateTaskModalOpen: boolean;
	createTaskDefaultListId: string | null;
	editingTask: TaskCardData | null;

	// Modal Actions
	openCreateTaskModal: (listId?: string) => void;
	closeCreateTaskModal: () => void;
	openTaskDetailModal: (task: TaskCardData) => void;
	closeTaskDetailModal: () => void;
}

export const useKanbanStore = create<KanbanStore>((set) => ({
	// Initial Filter State
	searchQuery: "",
	selectedPriority: null,
	setSearchQuery: (searchQuery) => set({ searchQuery }),
	setSelectedPriority: (selectedPriority) => set({ selectedPriority }),
	clearFilters: () => set({ searchQuery: "", selectedPriority: null }),

	// Initial Modal State
	isCreateTaskModalOpen: false,
	createTaskDefaultListId: null,
	editingTask: null,

	// Modal Handlers
	openCreateTaskModal: (listId) =>
		set({
			isCreateTaskModalOpen: true,
			createTaskDefaultListId: listId || null,
		}),
	closeCreateTaskModal: () =>
		set({ isCreateTaskModalOpen: false, createTaskDefaultListId: null }),
	openTaskDetailModal: (task) => set({ editingTask: task }),
	closeTaskDetailModal: () => set({ editingTask: null }),
}));
