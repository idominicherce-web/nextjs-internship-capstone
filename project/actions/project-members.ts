"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getOrCreateDbUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { projectMembers, projects, users } from "@/lib/db/schema";
import { logActivity } from "@/lib/logger";

export type ActionResponse<T = unknown> = {
	success: boolean;
	data?: T;
	error?: string;
};

const assignMemberSchema = z.object({
	projectId: z.string().min(1, "Project identifier is required."),
	userId: z.string().min(1, "User identifier is required."),
	role: z.enum(["Viewer", "Member", "Admin"]),
});

export async function assignUserToProject(
	projectId: string,
	userId: string,
	role: "Viewer" | "Member" | "Admin" = "Member",
): Promise<ActionResponse> {
	try {
		const dbUser = await getOrCreateDbUser();
		if (!dbUser) {
			return { success: false, error: "Unauthorized access." };
		}

		const parsed = assignMemberSchema.safeParse({ projectId, userId, role });
		if (!parsed.success) {
			return { success: false, error: "Invalid assignment request." };
		}

		// Verify target project exists
		const project = await db.query.projects.findFirst({
			where: eq(projects.id, projectId),
		});

		if (!project) {
			return { success: false, error: "Project campaign not found." };
		}

		// Verify target user exists
		const targetUser = await db.query.users.findFirst({
			where: eq(users.id, userId),
		});

		if (!targetUser) {
			return { success: false, error: "Officer record not found." };
		}

		// Upsert assignment record
		const existingAssignment = await db.query.projectMembers.findFirst({
			where: and(
				eq(projectMembers.projectId, projectId),
				eq(projectMembers.userId, userId),
			),
		});

		if (existingAssignment) {
			await db
				.update(projectMembers)
				.set({ role })
				.where(
					and(
						eq(projectMembers.projectId, projectId),
						eq(projectMembers.userId, userId),
					),
				);
		} else {
			await db.insert(projectMembers).values({
				projectId,
				userId,
				role,
			});
		}

		await logActivity({
			userId: dbUser.id,
			action: "Assigned Project Officer",
			entityType: "project",
			entityName: project.name,
			details: `Assigned ${targetUser.name || targetUser.email} as ${role} to ${project.name}`,
		});

		revalidatePath(`/projects/${projectId}`);
		revalidatePath("/team");

		return { success: true };
	} catch (error) {
		console.error("Failed to assign user to project:", error);
		return { success: false, error: "Failed to assign officer to project." };
	}
}

export async function removeUserFromProject(
	projectId: string,
	userId: string,
): Promise<ActionResponse> {
	try {
		const dbUser = await getOrCreateDbUser();
		if (!dbUser) {
			return { success: false, error: "Unauthorized access." };
		}

		const targetUser = await db.query.users.findFirst({
			where: eq(users.id, userId),
		});

		const project = await db.query.projects.findFirst({
			where: eq(projects.id, projectId),
		});

		await db
			.delete(projectMembers)
			.where(
				and(
					eq(projectMembers.projectId, projectId),
					eq(projectMembers.userId, userId),
				),
			);

		if (targetUser && project) {
			await logActivity({
				userId: dbUser.id,
				action: "Removed Project Officer",
				entityType: "project",
				entityName: project.name,
				details: `Removed ${targetUser.name || targetUser.email} from ${project.name}`,
			});
		}

		revalidatePath(`/projects/${projectId}`);
		revalidatePath("/team");

		return { success: true };
	} catch (error) {
		console.error("Failed to remove user from project:", error);
		return { success: false, error: "Failed to remove officer from project." };
	}
}

export async function getProjectAssignedMembers(projectId: string) {
	try {
		const members = await db
			.select({
				id: users.id,
				name: users.name,
				email: users.email,
				role: projectMembers.role,
				assignedAt: projectMembers.createdAt,
			})
			.from(projectMembers)
			.innerJoin(users, eq(projectMembers.userId, users.id))
			.where(eq(projectMembers.projectId, projectId));

		return { success: true, data: members };
	} catch (error) {
		console.error("Failed to fetch project assigned members:", error);
		return { success: true, data: [] };
	}
}
