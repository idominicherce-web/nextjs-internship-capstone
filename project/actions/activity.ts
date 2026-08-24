"use server";

import { desc, eq, like, or } from "drizzle-orm";
import { db } from "@/lib/db";
import { activityLogs, projects, users } from "@/lib/db/schema";

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

export async function getTaskActivityLogs(taskId: string, taskTitle?: string) {
	try {
		const conditions = [
			like(activityLogs.details, `%[TASK:${taskId}]%`),
			eq(activityLogs.entityName, taskId),
		];

		if (taskTitle) {
			conditions.push(eq(activityLogs.entityName, taskTitle));
		}

		const logs = await db
			.select({
				id: activityLogs.id,
				action: activityLogs.action,
				entityType: activityLogs.entityType,
				details: activityLogs.details,
				createdAt: activityLogs.createdAt,
				user: {
					name: users.name,
					email: users.email,
					imageUrl: users.imageUrl,
				},
			})
			.from(activityLogs)
			.leftJoin(users, eq(activityLogs.userId, users.id))
			.where(or(...conditions))
			.orderBy(desc(activityLogs.createdAt));

		const sanitizedLogs = logs.map((log) => ({
			...log,
			details: log.details
				? log.details.replace(/\[TASK:[^\]]+\]\s*/g, "")
				: null,
		}));

		return { success: true, data: sanitizedLogs };
	} catch (error) {
		console.error("Failed to fetch task activity logs:", error);
		return { success: false, data: [] };
	}
}

export async function getRecentActivities(limit = 20) {
	try {
		const logs = await db
			.select({
				id: activityLogs.id,
				action: activityLogs.action,
				entityType: activityLogs.entityType,
				entityName: activityLogs.entityName,
				details: activityLogs.details,
				createdAt: activityLogs.createdAt,
				projectId: activityLogs.projectId,
				projectSlug: projects.slug,
				user: {
					name: users.name,
					email: users.email,
					imageUrl: users.imageUrl,
				},
			})
			.from(activityLogs)
			.leftJoin(users, eq(activityLogs.userId, users.id))
			.leftJoin(projects, eq(activityLogs.projectId, projects.id))
			.orderBy(desc(activityLogs.createdAt))
			.limit(limit);

		return { success: true, data: logs };
	} catch (error) {
		console.error("Failed to fetch recent workspace activities:", error);
		return { success: false, data: [] };
	}
}
