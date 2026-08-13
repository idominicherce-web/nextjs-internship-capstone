"use server";

import { and, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getOrCreateDbUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { notifications } from "@/lib/db/schema";

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
 * Create a new notification record in DB
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

		const [newNotification] = await db
			.insert(notifications)
			.values({
				userId: targetUserId,
				title: payload.title,
				description: payload.description,
				type: payload.type || "system",
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
