import { create } from "zustand";

interface SidebarStore {
	isCollapsed: boolean;
	toggleSidebar: () => void;
	setCollapsed: (collapsed: boolean) => void;
}

export const useSidebarStore = create<SidebarStore>((set) => ({
	isCollapsed: true, // Collapsed by default
	toggleSidebar: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
	setCollapsed: (collapsed) => set({ isCollapsed: collapsed }),
}));
