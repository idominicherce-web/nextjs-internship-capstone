"use server";

import { currentUser } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { taskComments, users } from "@/lib/db/schema";
import { logActivity } from "@/lib/logger";

export interface TaskCommentWithAuthor {
	id: string;
	content: string;
	taskId: string;
	userId: string;
	createdAt: Date;
	updatedAt: Date;
	author: {
		id: string;
		name: string | null;
		email: string;
		imageUrl: string | null;
	} | null;
}

/**
 * Fetch all comments for a specific task ordered by newest first
 */
export async function getTaskComments(taskId: string): Promise<{
	success: boolean;
	data?: TaskCommentWithAuthor[];
	error?: string;
}> {
	try {
		const comments = await db.query.taskComments.findMany({
			where: eq(taskComments.taskId, taskId),
			orderBy: [desc(taskComments.createdAt)],
			with: {
				user: {
					columns: {
						id: true,
						name: true,
						email: true,
						imageUrl: true,
					},
				},
			},
		});

		const formattedComments: TaskCommentWithAuthor[] = comments.map((c) => ({
			id: c.id,
			content: c.content,
			taskId: c.taskId,
			userId: c.userId,
			createdAt: c.createdAt,
			updatedAt: c.updatedAt,
			author: c.user,
		}));

		return { success: true, data: formattedComments };
	} catch (error) {
		console.error("Failed to fetch task comments:", error);
		return {
			success: false,
			error: "Failed to load decree discussion history.",
		};
	}
}

/**
 * Create a new comment on a task
 */
export async function createTaskComment(
	taskId: string,
	projectId: string,
	content: string,
): Promise<{ success: boolean; data?: TaskCommentWithAuthor; error?: string }> {
	try {
		const user = await currentUser();
		if (!user) {
			return { success: false, error: "Unauthorized access." };
		}

		// Sync user from DB
		const dbUser = await db.query.users.findFirst({
			where: eq(users.clerkId, user.id),
		});

		if (!dbUser) {
			return { success: false, error: "User profile record not found." };
		}

		const cleanContent = content.trim();
		if (!cleanContent) {
			return { success: false, error: "Comment content cannot be blank." };
		}

		// Insert comment
		const [newComment] = await db
			.insert(taskComments)
			.values({
				taskId,
				userId: dbUser.id,
				content: cleanContent,
			})
			.returning();

		// Audit Log
		await logActivity({
			userId: dbUser.id,
			action: "COMMENTED",
			entityType: "task",
			entityName: cleanContent.slice(0, 30),
			details: `Posted dispatch comment on task ${taskId}`,
		});

		revalidatePath(`/projects/${projectId}`);

		return {
			success: true,
			data: {
				id: newComment.id,
				content: newComment.content,
				taskId: newComment.taskId,
				userId: newComment.userId,
				createdAt: newComment.createdAt,
				updatedAt: newComment.updatedAt,
				author: {
					id: dbUser.id,
					name: dbUser.name,
					email: dbUser.email,
					imageUrl: dbUser.imageUrl,
				},
			},
		};
	} catch (error) {
		console.error("Failed to post comment:", error);
		return {
			success: false,
			error: "Could not dispatch comment to decree log.",
		};
	}
}

/**
 * Delete a comment by ID
 */
export async function deleteTaskComment(
	commentId: string,
	projectId: string,
): Promise<{ success: boolean; error?: string }> {
	try {
		const user = await currentUser();
		if (!user) return { success: false, error: "Unauthorized access." };

		await db.delete(taskComments).where(eq(taskComments.id, commentId));

		revalidatePath(`/projects/${projectId}`);
		return { success: true };
	} catch (error) {
		console.error("Failed to delete comment:", error);
		return { success: false, error: "Failed to purge comment entry." };
	}
}
