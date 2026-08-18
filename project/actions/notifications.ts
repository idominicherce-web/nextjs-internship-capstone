"use server";

import { and, desc, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getOrCreateDbUser } from "@/lib/auth";
import { db } from "@/lib/db";
import {
	notifications,
	projectMembers,
	projects,
	userSettings,
} from "@/lib/db/schema";

/**
 * Fetch all notifications for the authenticated user
 */
export async function getNotifications() {
	try {
		const dbUser = await getOrCreateDbUser();
		if (!dbUser) return { success: false, data: [] };

		const userNotifications = await db
			.select()
			.from(notifications)
			.where(eq(notifications.userId, dbUser.id))
			.orderBy(desc(notifications.createdAt));

		return { success: true, data: userNotifications };
	} catch (error) {
		console.error("Failed to fetch notifications:", error);
		return { success: false, data: [] };
	}
}

/**
 * Create a single notification record in DB (respects target user settings)
 */
export async function createNotification(payload: {
	userId?: string;
	title: string;
	description?: string;
	type?: "system" | "task" | "team" | "project";
}) {
	try {
		const dbUser = await getOrCreateDbUser();
		const targetUserId = payload.userId || dbUser?.id;
		if (!targetUserId) return { success: false, error: "Target user missing." };

		// Check recipient's notification preferences
		const settings = await db.query.userSettings.findFirst({
			where: eq(userSettings.userId, targetUserId),
		});

		const notifType = payload.type || "system";
		if (settings) {
			if (notifType === "task" && !settings.taskAssignedInApp) {
				return { success: true, skipped: true };
			}
		}

		const [newNotification] = await db
			.insert(notifications)
			.values({
				userId: targetUserId,
				title: payload.title,
				description: payload.description,
				type: notifType,
				read: false,
			})
			.returning();

		revalidatePath("/dashboard");
		return { success: true, data: newNotification };
	} catch (error) {
		console.error("Failed to create notification:", error);
		return { success: false, error: "Failed to create notification." };
	}
}

/**
 * Broadcast a notification to project members respecting each user's in-app preference
 */
export async function notifyProjectMembers(payload: {
	projectId: string;
	title: string;
	description?: string;
	type?: "system" | "task" | "team" | "project";
	excludeSender?: boolean;
}) {
	try {
		const dbUser = await getOrCreateDbUser();
		if (!dbUser) return { success: false, error: "Unauthorized." };

		const project = await db
			.select({ ownerId: projects.userId })
			.from(projects)
			.where(eq(projects.id, payload.projectId))
			.limit(1);

		const members = await db
			.select({ userId: projectMembers.userId })
			.from(projectMembers)
			.where(eq(projectMembers.projectId, payload.projectId));

		const allUserIds = new Set<string>();
		if (project[0]?.ownerId) allUserIds.add(project[0].ownerId);
		for (const m of members) {
			allUserIds.add(m.userId);
		}

		if (payload.excludeSender !== false) {
			allUserIds.delete(dbUser.id);
		}

		if (allUserIds.size === 0) {
			return { success: true, count: 0 };
		}

		const targetUserIds = Array.from(allUserIds);

		// Fetch preferences for all target recipients
		const settingsList = await db
			.select()
			.from(userSettings)
			.where(inArray(userSettings.userId, targetUserIds));

		const settingsMap = new Map(settingsList.map((s) => [s.userId, s]));

		const notifType = payload.type || "project";

		// Filter users based on their in-app preferences
		const eligibleUserIds = targetUserIds.filter((uId) => {
			const pref = settingsMap.get(uId);
			if (!pref) return true; // Default to true if no preference row exists
			if (notifType === "task" && !pref.taskAssignedInApp) return false;
			return true;
		});

		if (eligibleUserIds.length === 0) {
			return { success: true, count: 0 };
		}

		const newNotifications = eligibleUserIds.map((userId) => ({
			userId,
			title: payload.title,
			description: payload.description,
			type: notifType,
			read: false,
		}));

		await db.insert(notifications).values(newNotifications);

		revalidatePath("/dashboard");
		return { success: true, count: newNotifications.length };
	} catch (error) {
		console.error("Failed to notify project members:", error);
		return { success: false, error: "Failed to broadcast notifications." };
	}
}

/**
 * Mark a single notification as read
 */
export async function markNotificationAsRead(notificationId: string) {
	try {
		const dbUser = await getOrCreateDbUser();
		if (!dbUser) return { success: false, error: "Unauthorized." };

		await db
			.update(notifications)
			.set({ read: true })
			.where(
				and(
					eq(notifications.id, notificationId),
					eq(notifications.userId, dbUser.id),
				),
			);

		revalidatePath("/dashboard");
		return { success: true };
	} catch (error) {
		console.error("Failed to mark notification read:", error);
		return { success: false, error: "Failed to mark as read." };
	}
}

/**
 * Mark all notifications as read for current user
 */
export async function markAllNotificationsAsRead() {
	try {
		const dbUser = await getOrCreateDbUser();
		if (!dbUser) return { success: false, error: "Unauthorized." };

		await db
			.update(notifications)
			.set({ read: true })
			.where(eq(notifications.userId, dbUser.id));

		revalidatePath("/dashboard");
		return { success: true };
	} catch (error) {
		console.error("Failed to mark all notifications read:", error);
		return { success: false, error: "Failed to mark all as read." };
	}
}

/**
 * Delete a single notification
 */
export async function deleteNotification(notificationId: string) {
	try {
		const dbUser = await getOrCreateDbUser();
		if (!dbUser) return { success: false, error: "Unauthorized." };

		await db
			.delete(notifications)
			.where(
				and(
					eq(notifications.id, notificationId),
					eq(notifications.userId, dbUser.id),
				),
			);

		revalidatePath("/dashboard");
		return { success: true };
	} catch (error) {
		console.error("Failed to delete notification:", error);
		return { success: false, error: "Failed to delete notification." };
	}
}

/**
 * Delete all notifications for current user
 */
export async function deleteAllNotifications() {
	try {
		const dbUser = await getOrCreateDbUser();
		if (!dbUser) return { success: false, error: "Unauthorized." };

		await db.delete(notifications).where(eq(notifications.userId, dbUser.id));

		revalidatePath("/dashboard");
		return { success: true };
	} catch (error) {
		console.error("Failed to delete all notifications:", error);
		return { success: false, error: "Failed to clear notifications." };
	}
}
