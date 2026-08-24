"use server";

import { eq, max } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { notifyProjectMembers } from "@/actions/notifications";
import { getOrCreateDbUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { lists, projects, tasks } from "@/lib/db/schema";
import { logActivity } from "@/lib/logger";

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

		await logActivity({
			projectId,
			userId: dbUser.id,
			action: "Created Objective",
			entityType: "task",
			entityName: newTask.title,
			details: `[TASK:${newTask.id}] Created new objective: "${newTask.title}"`,
		});

		await notifyProjectMembers({
			projectId,
			title: "New Task Appointed",
			description: `"${newTask.title}" created by ${dbUser.name || "a member"}.`,
			type: "task",
		});

		revalidatePath(`/projects/${projectId}`);
		revalidatePath("/dashboard");

		return { success: true, data: newTask };
	} catch (error) {
		console.error("Failed to create task:", error);
		return { success: false, error: "Failed to create task objective." };
	}
}

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

		const existingTask = await db.query.tasks.findFirst({
			where: eq(tasks.id, taskId),
		});

		if (!existingTask) {
			return { success: false, error: "Objective not found." };
		}

		const [updatedTask] = await db
			.update(tasks)
			.set({
				...updates,
				updatedAt: new Date(),
			})
			.where(eq(tasks.id, taskId))
			.returning();

		const changes: string[] = [];
		if (updates.title && updates.title !== existingTask.title) {
			changes.push(`Title changed to "${updates.title}"`);
		}
		if (updates.priority && updates.priority !== existingTask.priority) {
			changes.push(`Priority changed to ${updates.priority}`);
		}
		if (
			updates.userId !== undefined &&
			updates.userId !== existingTask.userId
		) {
			changes.push(
				updates.userId ? "Reassigned officer" : "Unassigned officer",
			);
		}

		if (changes.length > 0) {
			await logActivity({
				projectId,
				userId: dbUser.id,
				action: "Updated Objective",
				entityType: "task",
				entityName: updatedTask.title,
				details: `[TASK:${taskId}] ${changes.join(", ")}`,
			});

			await notifyProjectMembers({
				projectId,
				title: "Quest Objective Updated",
				description: `"${updatedTask.title}": ${changes.join(", ")}`,
				type: "task",
			});
		}

		revalidatePath(`/projects/${projectId}`);
		revalidatePath("/dashboard");

		return { success: true, data: updatedTask };
	} catch (error) {
		console.error("Failed to update task:", error);
		return { success: false, error: "Failed to update task objective." };
	}
}

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

		const [targetList, currentTask] = await Promise.all([
			db.query.lists.findFirst({ where: eq(lists.id, newListId) }),
			db.query.tasks.findFirst({ where: eq(tasks.id, taskId) }),
		]);

		await db
			.update(tasks)
			.set({
				listId: newListId,
				position: newPosition,
				updatedAt: new Date(),
			})
			.where(eq(tasks.id, taskId));

		if (targetList && currentTask && currentTask.listId !== newListId) {
			await logActivity({
				projectId,
				userId: dbUser.id,
				action: "Stage Shifted",
				entityType: "task",
				entityName: currentTask.title,
				details: `[TASK:${taskId}] Moved stage to ${targetList.name}`,
			});

			await notifyProjectMembers({
				projectId,
				title: "Objective Relocated",
				description: `"${currentTask.title}" shifted to column "${targetList.name}".`,
				type: "task",
			});

			// Check if moving this task completes 100% of project objectives
			const isDoneColumn =
				targetList.name.toLowerCase().includes("done") ||
				targetList.name.toLowerCase().includes("complete");

			if (isDoneColumn) {
				const projectLists = await db.query.lists.findMany({
					where: eq(lists.projectId, projectId),
					with: { tasks: true },
				});

				let totalTasksCount = 0;
				let completedTasksCount = 0;

				for (const col of projectLists) {
					const isColDone =
						col.name.toLowerCase().includes("done") ||
						col.name.toLowerCase().includes("complete");

					for (const t of col.tasks) {
						totalTasksCount++;
						if (isColDone || t.id === taskId) {
							completedTasksCount++;
						}
					}
				}

				if (totalTasksCount > 0 && totalTasksCount === completedTasksCount) {
					const projectObj = await db.query.projects.findFirst({
						where: eq(projects.id, projectId),
					});
					const targetSlug = projectObj?.slug || projectId;
					const projectName = projectObj?.name || "Quest Board";

					// 1. Log Activity in Quest Logs Activity Feed
					await logActivity({
						projectId,
						userId: dbUser.id,
						action: "Quest Completed",
						entityType: "project",
						entityName: projectName,
						details: `100% of campaign objectives for "${projectName}" have been fulfilled!`,
					});

					// 2. Broadcast Notification to Members (with project name in title and cleaned slug metadata)
					await notifyProjectMembers({
						projectId,
						title: `🏆 Quest Completed: ${projectName}`,
						description: `All campaign objectives for "${projectName}" have been fulfilled! [SLUG:${targetSlug}]`,
						type: "project",
						excludeSender: false,
					});
				}
			}
		}

		return { success: true };
	} catch (error) {
		console.error("Failed to update task position:", error);
		return { success: false, error: "Failed to reorder task objective." };
	}
}

export async function reorderTasks(
	taskUpdates: { id: string; listId: string; position: number }[],
	_projectId: string,
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

		return { success: true };
	} catch (error) {
		console.error("Failed to reorder tasks:", error);
		return { success: false, error: "Failed to batch reorder tasks." };
	}
}

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
			await logActivity({
				projectId,
				userId: dbUser.id,
				action: "Deleted Objective",
				entityType: "task",
				entityName: deletedTask.title,
				details: `[TASK:${taskId}] Removed objective: "${deletedTask.title}"`,
			});

			await notifyProjectMembers({
				projectId,
				title: "Quest Objective Removed",
				description: `"${deletedTask.title}" was deleted.`,
				type: "task",
			});
		}

		revalidatePath(`/projects/${projectId}`);
		revalidatePath("/dashboard");

		return { success: true };
	} catch (error) {
		console.error("Failed to delete task:", error);
		return { success: false, error: "Failed to remove task objective." };
	}
}
