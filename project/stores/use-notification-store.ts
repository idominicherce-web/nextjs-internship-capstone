import { create } from "zustand";

export interface NotificationItem {
	id: string;
	title: string;
	description: string;
	timestamp: string;
	type: "task" | "project" | "team" | "system";
	read: boolean;
}

interface NotificationState {
	isOpen: boolean;
	notifications: NotificationItem[];
	openDrawer: () => void;
	closeDrawer: () => void;
	toggleDrawer: () => void;
	addNotification: (
		item: Omit<NotificationItem, "id" | "timestamp" | "read">,
	) => void;
	markAsRead: (id: string) => void;
	markAllAsRead: () => void;
	clearNotifications: () => void;
}

const initialNotifications: NotificationItem[] = [
	{
		id: "notif-1",
		title: "Task Reassigned",
		description:
			"You have been assigned to 'Fortify Front-End Infrastructure'.",
		timestamp: "10m ago",
		type: "task",
		read: false,
	},
	{
		id: "notif-2",
		title: "Quest Completed",
		description: "Column 'In Progress' objective reached 100% completion.",
		timestamp: "1h ago",
		type: "project",
		read: false,
	},
];

export const useNotificationStore = create<NotificationState>((set) => ({
	isOpen: false,
	notifications: initialNotifications,
	openDrawer: () => set({ isOpen: true }),
	closeDrawer: () => set({ isOpen: false }),
	toggleDrawer: () => set((state) => ({ isOpen: !state.isOpen })),
	addNotification: (item) =>
		set((state) => {
			const newNotif: NotificationItem = {
				id: `notif-${Date.now()}`,
				title: item.title,
				description: item.description,
				type: item.type,
				timestamp: "Just now",
				read: false,
			};
			return {
				notifications: [newNotif, ...state.notifications],
			};
		}),
	markAsRead: (id) =>
		set((state) => ({
			notifications: state.notifications.map((n) =>
				n.id === id ? { ...n, read: true } : n,
			),
		})),
	markAllAsRead: () =>
		set((state) => ({
			notifications: state.notifications.map((n) => ({ ...n, read: true })),
		})),
	clearNotifications: () => set({ notifications: [] }),
}));
