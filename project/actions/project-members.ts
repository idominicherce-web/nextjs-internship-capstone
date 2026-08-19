"use server";

import { and, eq, notInArray, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { notifyProjectMembers } from "@/actions/notifications";
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

/**
 * Fetches workspace members from Neon DB who are NOT yet assigned to the specified project.
 */
export async function getAssignableWorkspaceMembers(projectId: string) {
	try {
		const dbUser = await getOrCreateDbUser();
		if (!dbUser) return { success: false, data: [] };

		// Fetch the project to get the owner ID
		const project = await db.query.projects.findFirst({
			where: eq(projects.id, projectId),
		});

		if (!project) return { success: false, data: [] };

		// Fetch existing members already assigned to this project
		const existingMembers = await db
			.select({ userId: projectMembers.userId })
			.from(projectMembers)
			.where(eq(projectMembers.projectId, projectId));

		const excludedUserIds = new Set<string>();
		excludedUserIds.add(project.userId); // Exclude project owner
		for (const m of existingMembers) {
			excludedUserIds.add(m.userId); // Exclude assigned members
		}

		const excludedArray = Array.from(excludedUserIds);

		// Fetch users from Neon DB who are NOT in the excluded array
		const eligibleUsers =
			excludedArray.length > 0
				? await db
						.select({
							id: users.id,
							clerkId: users.clerkId,
							name: users.name,
							email: users.email,
							role: users.role,
						})
						.from(users)
						.where(notInArray(users.id, excludedArray))
				: await db
						.select({
							id: users.id,
							clerkId: users.clerkId,
							name: users.name,
							email: users.email,
							role: users.role,
						})
						.from(users);

		return { success: true, data: eligibleUsers };
	} catch (error) {
		console.error("Failed to fetch assignable workspace members:", error);
		return { success: false, data: [] };
	}
}

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

		const project = await db.query.projects.findFirst({
			where: eq(projects.id, projectId),
		});

		if (!project) {
			return { success: false, error: "Project campaign not found." };
		}

		const targetUser = await db.query.users.findFirst({
			where: or(eq(users.id, userId), eq(users.clerkId, userId)),
		});

		if (!targetUser) {
			return { success: false, error: "Officer record not found." };
		}

		const targetNeonUserId = targetUser.id;

		const existingAssignment = await db.query.projectMembers.findFirst({
			where: and(
				eq(projectMembers.projectId, projectId),
				eq(projectMembers.userId, targetNeonUserId),
			),
		});

		if (existingAssignment) {
			await db
				.update(projectMembers)
				.set({ role })
				.where(
					and(
						eq(projectMembers.projectId, projectId),
						eq(projectMembers.userId, targetNeonUserId),
					),
				);
		} else {
			await db.insert(projectMembers).values({
				projectId,
				userId: targetNeonUserId,
				role,
			});
		}

		await logActivity({
			projectId,
			userId: dbUser.id,
			action: "Assigned Project Member",
			entityType: "project",
			entityName: project.name,
			details: `Assigned ${targetUser.name || targetUser.email} as ${role} to ${project.name}`,
		});

		await notifyProjectMembers({
			projectId,
			title: "Realm Officer Enlisted",
			description: `${targetUser.name || targetUser.email} was added as ${role}.`,
			type: "team",
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
			where: or(eq(users.id, userId), eq(users.clerkId, userId)),
		});

		const project = await db.query.projects.findFirst({
			where: eq(projects.id, projectId),
		});

		if (targetUser) {
			await db
				.delete(projectMembers)
				.where(
					and(
						eq(projectMembers.projectId, projectId),
						eq(projectMembers.userId, targetUser.id),
					),
				);
		}

		if (targetUser && project) {
			await logActivity({
				projectId,
				userId: dbUser.id,
				action: "Removed Project Member",
				entityType: "project",
				entityName: project.name,
				details: `Removed ${targetUser.name || targetUser.email} from ${project.name}`,
			});

			await notifyProjectMembers({
				projectId,
				title: "Officer Discharged",
				description: `${targetUser.name || targetUser.email} was removed from the project.`,
				type: "team",
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
