"use server";

import { desc, like } from "drizzle-orm";
import { db } from "@/lib/db";
import { activityLogs } from "@/lib/db/schema";

export interface TaskActivityLog {
	id: string;
	action: string;
	entityType: string;
	details: string | null;
	createdAt: Date;
	user?: {
		name: string | null;
		email: string;
		imageUrl?: string | null;
	} | null;
}

export async function getTaskActivityLogs(taskId: string, _taskTitle?: string) {
	try {
		// Query activity logs referencing the task ID in details
		const rawLogs = await db
			.select({
				id: activityLogs.id,
				userId: activityLogs.userId,
				action: activityLogs.action,
				entityType: activityLogs.entityType,
				details: activityLogs.details,
				createdAt: activityLogs.createdAt,
			})
			.from(activityLogs)
			.where(like(activityLogs.details, `%[TASK:${taskId}]%`))
			.orderBy(desc(activityLogs.createdAt));

		if (rawLogs.length === 0) return { success: true, data: [] };

		// Fetch associated users in-memory on the server
		const userIds = Array.from(
			new Set(rawLogs.map((l) => l.userId).filter(Boolean)),
		);

		const userRows =
			userIds.length > 0
				? await db.query.users.findMany({
						where: (u, { inArray, or }) =>
							or(inArray(u.id, userIds), inArray(u.clerkId, userIds)),
					})
				: [];

		const sanitizedLogs = rawLogs.map((log) => {
			const matchingUser = userRows.find(
				(u) => u.id === log.userId || u.clerkId === log.userId,
			);

			return {
				id: log.id,
				action: log.action,
				entityType: log.entityType,
				details: log.details
					? log.details.replace(/\[TASK:[^\]]+\]\s*/g, "").trim()
					: null,
				createdAt: log.createdAt,
				user: matchingUser
					? {
							name: matchingUser.name,
							email: matchingUser.email,
							imageUrl: matchingUser.imageUrl,
						}
					: null,
			};
		});

		return { success: true, data: sanitizedLogs };
	} catch (error) {
		console.error("❌ Failed to fetch task activity logs:", error);
		return { success: false, data: [] };
	}
}
