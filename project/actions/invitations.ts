"use server";

import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getOrCreateDbUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, workspaceInvitations } from "@/lib/db/schema";
import { logActivity } from "@/lib/logger";

export type ActionResponse<T = unknown> = {
	success: boolean;
	data?: T;
	error?: string;
	fieldErrors?: Record<string, string[]>;
};

const inviteMemberSchema = z.object({
	email: z.string().trim().email("Please provide a valid email address."),
	role: z.enum(["Viewer", "Member", "Admin"]),
	projectId: z.string().min(1, "Project identifier is required."),
});

export async function inviteWorkspaceMember(
	projectId: string,
	email: string,
	role: "Viewer" | "Member" | "Admin",
): Promise<ActionResponse> {
	try {
		const dbUser = await getOrCreateDbUser();
		if (!dbUser) {
			return { success: false, error: "Unauthorized access." };
		}

		const parsed = inviteMemberSchema.safeParse({ email, role, projectId });
		if (!parsed.success) {
			const flattened = parsed.error.flatten();
			const firstError =
				Object.values(flattened.fieldErrors)[0]?.[0] || "Validation failed.";
			return { success: false, error: firstError };
		}

		// Check if invitation already pending
		const existingInvite = await db.query.workspaceInvitations.findFirst({
			where: eq(workspaceInvitations.email, email.toLowerCase()),
		});

		if (existingInvite && existingInvite.status === "pending") {
			return {
				success: false,
				error: "A pending invitation already exists for this email address.",
			};
		}

		// Create invitation record
		const [newInvitation] = await db
			.insert(workspaceInvitations)
			.values({
				email: email.toLowerCase(),
				role,
				invitedById: dbUser.id,
				status: "pending",
			})
			.returning();

		await logActivity({
			userId: dbUser.id,
			action: "Invited Member",
			entityType: "project",
			entityName: email,
			details: `Sent ${role} invitation to ${email}`,
		});

		revalidatePath(`/projects/${projectId}`);
		revalidatePath("/dashboard");

		return { success: true, data: newInvitation };
	} catch (error) {
		console.error("Failed to invite workspace member:", error);
		return { success: false, error: "Failed to send invitation dispatch." };
	}
}

export async function getWorkspaceInvitations() {
	try {
		const invitations = await db
			.select({
				id: workspaceInvitations.id,
				email: workspaceInvitations.email,
				role: workspaceInvitations.role,
				status: workspaceInvitations.status,
				createdAt: workspaceInvitations.createdAt,
				invitedBy: {
					name: users.name,
					email: users.email,
				},
			})
			.from(workspaceInvitations)
			.leftJoin(users, eq(workspaceInvitations.invitedById, users.id))
			.orderBy(desc(workspaceInvitations.createdAt));

		return { success: true, data: invitations };
	} catch (error) {
		console.error("Failed to fetch invitations:", error);
		return { success: false, data: [] };
	}
}

export async function revokeInvitation(
	invitationId: string,
	projectId: string,
): Promise<ActionResponse> {
	try {
		const dbUser = await getOrCreateDbUser();
		if (!dbUser) {
			return { success: false, error: "Unauthorized access." };
		}

		const [revoked] = await db
			.update(workspaceInvitations)
			.set({ status: "cancelled" })
			.where(eq(workspaceInvitations.id, invitationId))
			.returning();

		if (revoked) {
			await logActivity({
				userId: dbUser.id,
				action: "Revoked Invitation",
				entityType: "project",
				entityName: revoked.email,
				details: `Revoked pending invitation for ${revoked.email}`,
			});
		}

		revalidatePath(`/projects/${projectId}`);
		return { success: true };
	} catch (error) {
		console.error("Failed to revoke invitation:", error);
		return { success: false, error: "Failed to revoke member invitation." };
	}
}
