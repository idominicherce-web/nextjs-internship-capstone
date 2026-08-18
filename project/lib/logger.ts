import { db } from "@/lib/db";
import { activityLogs } from "@/lib/db/schema";

export async function logActivity({
	projectId,
	userId,
	action,
	entityType,
	entityName,
	details,
}: {
	projectId?: string;
	userId: string;
	action: string;
	entityType: "project" | "task" | "list";
	entityName: string;
	details?: string;
}) {
	try {
		await db.insert(activityLogs).values({
			projectId: projectId || null,
			userId,
			action,
			entityType,
			entityName,
			details: details || null,
		});
	} catch (error) {
		console.error("Failed to log activity:", error);
	}
}
