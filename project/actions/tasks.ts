"use server";

import { eq, max } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getOrCreateDbUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { activityLogs, tasks } from "@/lib/db/schema";

export type ActionResponse<T = unknown> = {
	success: boolean;
	data?: T;
	error?: string;
	fieldErrors?: Record<string, string[]>;
};

const createTaskSchema = z.object({
	title: z.string().trim().min(1, "Task objective title is required.").max(255),
	description: z.string().trim().optional(),
	listId: z.string().min(1, "Target column is required."),
	projectId: z.string().min(1, "Project identifier is required."),
	userId: z.string().optional(),
	dueDate: z.string().optional(),
	priority: z.string().optional(),
});

/**
 * Creates a new task objective inside a strategy column.
 */
export async function createTask(
	_prevState: unknown,
	formData?:
		| FormData
		| {
				listId: string;
				projectId: string;
				title: string;
				description?: string;
				userId?: string;
				dueDate?: string;
				priority?: string;
		  },
): Promise<ActionResponse> {
	try {
		const dbUser = await getOrCreateDbUser();
		if (!dbUser) {
			return { success: false, error: "Unauthorized access." };
		}

		let rawData: Record<string, unknown> = {};
		if (formData instanceof FormData) {
			rawData = {
				title: formData.get("title"),
				description: formData.get("description"),
				listId: formData.get("listId"),
				projectId: formData.get("projectId"),
				userId: formData.get("userId"),
				dueDate: formData.get("dueDate"),
				priority: formData.get("priority"),
			};
		} else if (formData && typeof formData === "object") {
			rawData = formData;
		} else {
			return { success: false, error: "Invalid form payload." };
		}

		const parsed = createTaskSchema.safeParse(rawData);
		if (!parsed.success) {
			const flattened = parsed.error.flatten();
			const firstError =
				Object.values(flattened.fieldErrors)[0]?.[0] || "Validation failed.";
			return {
				success: false,
				error: firstError,
				fieldErrors: flattened.fieldErrors,
			};
		}

		const { listId, projectId, title, description, userId, dueDate, priority } =
			parsed.data;

		// Determine next position index for the task in this list
		const maxPositionResult = await db
			.select({ maxPos: max(tasks.position) })
			.from(tasks)
			.where(eq(tasks.listId, listId));

		const nextPosition = (maxPositionResult[0]?.maxPos ?? -1) + 1;

		const [newTask] = await db
			.insert(tasks)
			.values({
				title,
				description: description || null,
				listId,
				userId: userId && userId.trim() !== "" ? userId : dbUser.id,
				priority: priority || "Medium",
				dueDate: dueDate && dueDate.trim() !== "" ? new Date(dueDate) : null,
				position: nextPosition,
			})
			.returning();

		// Activity log
		await db.insert(activityLogs).values({
			userId: dbUser.id,
			action: "Created Objective",
			entityType: "task",
			entityName: newTask.title,
			details: `Added new objective: "${newTask.title}"`,
		});

		revalidatePath(`/projects/${projectId}`);
		revalidatePath("/dashboard");
		revalidatePath("/analytics");
		revalidatePath("/calendar");

		return { success: true, data: newTask };
	} catch (error) {
		console.error("Failed to create task:", error);
		return { success: false, error: "Failed to create task objective." };
	}
}

/**
 * Updates a task objective (title, description, due date, assignee, priority).
 */
export async function updateTask(
	taskId: string,
	projectId: string,
	updates: {
		title?: string;
		description?: string | null;
		dueDate?: Date | null;
		userId?: string | null;
		priority?: string | null;
	},
): Promise<ActionResponse> {
	try {
		const dbUser = await getOrCreateDbUser();
		if (!dbUser) {
			return { success: false, error: "Unauthorized access." };
		}

		const [updatedTask] = await db
			.update(tasks)
			.set({
				...updates,
				updatedAt: new Date(),
			})
			.where(eq(tasks.id, taskId))
			.returning();

		revalidatePath(`/projects/${projectId}`);
		revalidatePath("/dashboard");
		revalidatePath("/calendar");
		revalidatePath("/analytics");

		return { success: true, data: updatedTask };
	} catch (error) {
		console.error("Failed to update task:", error);
		return { success: false, error: "Failed to update task objective." };
	}
}

/**
 * Updates a single task's column and position during dnd.
 */
export async function updateTaskPosition(
	taskId: string,
	newListId: string,
	newPosition: number,
	projectId: string,
): Promise<ActionResponse> {
	try {
		const dbUser = await getOrCreateDbUser();
		if (!dbUser) {
			return { success: false, error: "Unauthorized access." };
		}

		await db
			.update(tasks)
			.set({
				listId: newListId,
				position: newPosition,
				updatedAt: new Date(),
			})
			.where(eq(tasks.id, taskId));

		revalidatePath(`/projects/${projectId}`);
		revalidatePath("/dashboard");

		return { success: true };
	} catch (error) {
		console.error("Failed to update task position:", error);
		return { success: false, error: "Failed to reorder task objective." };
	}
}

/**
 * Batch reorders task positions after drag-and-drop.
 */
export async function reorderTasks(
	taskUpdates: { id: string; listId: string; position: number }[],
	projectId: string,
): Promise<ActionResponse> {
	try {
		const dbUser = await getOrCreateDbUser();
		if (!dbUser) {
			return { success: false, error: "Unauthorized access." };
		}

		await Promise.all(
			taskUpdates.map((item) =>
				db
					.update(tasks)
					.set({
						listId: item.listId,
						position: item.position,
						updatedAt: new Date(),
					})
					.where(eq(tasks.id, item.id)),
			),
		);

		revalidatePath(`/projects/${projectId}`);
		revalidatePath("/dashboard");

		return { success: true };
	} catch (error) {
		console.error("Failed to reorder tasks:", error);
		return { success: false, error: "Failed to batch reorder tasks." };
	}
}

/**
 * Removes a task objective.
 */
export async function deleteTask(
	taskId: string,
	projectId: string,
): Promise<ActionResponse> {
	try {
		const dbUser = await getOrCreateDbUser();
		if (!dbUser) {
			return { success: false, error: "Unauthorized access." };
		}

		const [deletedTask] = await db
			.delete(tasks)
			.where(eq(tasks.id, taskId))
			.returning();

		if (deletedTask) {
			await db.insert(activityLogs).values({
				userId: dbUser.id,
				action: "Deleted Objective",
				entityType: "task",
				entityName: deletedTask.title,
				details: `Removed objective: "${deletedTask.title}"`,
			});
		}

		revalidatePath(`/projects/${projectId}`);
		revalidatePath("/dashboard");
		revalidatePath("/analytics");
		revalidatePath("/calendar");

		return { success: true };
	} catch (error) {
		console.error("Failed to delete task:", error);
		return { success: false, error: "Failed to remove task objective." };
	}
}
