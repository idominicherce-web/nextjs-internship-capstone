import { useNotificationStore } from "@/stores/use-notification-store";

describe("Notification Store (Zustand)", () => {
	beforeEach(() => {
		useNotificationStore.getState().clearNotifications();
	});

	it("adds a new notification", () => {
		useNotificationStore.getState().addNotification({
			title: "New Quest Forged",
			description: "Task 1 created by High Commander",
			type: "task",
		});

		const notifications = useNotificationStore.getState().notifications;
		expect(notifications).toHaveLength(1);
		expect(notifications[0].title).toBe("New Quest Forged");
		expect(notifications[0].description).toBe("Task 1 created by High Commander");
	});

	it("marks a notification as read", () => {
		useNotificationStore.getState().addNotification({
			title: "Alert",
			description: "System maintenance scheduled",
			type: "system",
		});

		const store = useNotificationStore.getState();
		const targetId = store.notifications[0].id;

		store.markAsRead(targetId);

		expect(useNotificationStore.getState().notifications[0].read).toBe(true);
	});

	it("clears all notifications", () => {
		useNotificationStore.getState().addNotification({
			title: "Alert",
			description: "To be removed",
			type: "task",
		});

		useNotificationStore.getState().clearNotifications();

		expect(useNotificationStore.getState().notifications).toHaveLength(0);
	});
});