"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getOrCreateDbUser } from "@/lib/auth";
import { logActivity } from "@/lib/logger";

export type ActionResponse<T = unknown> = {
	success: boolean;
	data?: T;
	error?: string;
	fieldErrors?: Record<string, string[]>;
};

const inviteWorkspaceSchema = z.object({
	email: z.string().trim().email("Please enter a valid email address."),
	role: z.enum(["org:admin", "org:member"], {
		message: "Invalid workspace role selected.",
	}),
});

/**
 * Creates a workspace invitation using Clerk Organization Invitations API.
 * Requires an active orgId and org:admin / admin role in Clerk.
 */
export async function inviteWorkspaceMember(
	projectId: string,
	email: string,
	roleInput: string,
): Promise<ActionResponse> {
	try {
		const { userId, orgId, orgRole } = await auth();
		const dbUser = await getOrCreateDbUser();

		if (!userId || !dbUser) {
			return { success: false, error: "Unauthorized access. Please sign in." };
		}

		// STRICT SECURITY: Require an active orgId in context
		if (!orgId) {
			return {
				success: false,
				error: "No active workspace organization selected.",
			};
		}

		// STRICT SECURITY: Require admin role explicitly
		if (orgRole !== "org:admin" && orgRole !== "admin") {
			return {
				success: false,
				error:
					"You do not have administrative permissions to invite members to this workspace.",
			};
		}

		// Map to Clerk's Organization role strings
		const clerkRole =
			roleInput === "Admin" || roleInput === "org:admin"
				? "org:admin"
				: "org:member";

		const parsed = inviteWorkspaceSchema.safeParse({
			email,
			role: clerkRole,
		});

		if (!parsed.success) {
			const flattened = parsed.error.flatten();
			const firstError =
				Object.values(flattened.fieldErrors)[0]?.[0] || "Validation failed.";
			return { success: false, error: firstError };
		}

		const client = await clerkClient();

		// Check for existing pending invitation in Clerk
		const existingInvites =
			await client.organizations.getOrganizationInvitationList({
				organizationId: orgId,
				status: ["pending"],
			});

		const isAlreadyInvited = existingInvites.data.some(
			(inv) => inv.emailAddress.toLowerCase() === email.toLowerCase(),
		);

		if (isAlreadyInvited) {
			return {
				success: false,
				error:
					"A pending workspace invitation already exists for this email address.",
			};
		}

		// Determine application origin dynamically
		const appOrigin =
			process.env.NEXT_PUBLIC_APP_URL ||
			(process.env.VERCEL_URL
				? `https://${process.env.VERCEL_URL}`
				: "http://localhost:3000");

		// Create Clerk Organization Invitation with explicit redirectUrl
		const invitation = await client.organizations.createOrganizationInvitation({
			organizationId: orgId,
			emailAddress: email.toLowerCase(),
			role: clerkRole,
			inviterUserId: userId,
			redirectUrl: `${appOrigin}/accept-invitation`,
		});

		await logActivity({
			userId: dbUser.id,
			action: "Invited Workspace Member",
			entityType: "project",
			entityName: email,
			details: `Dispatched workspace invitation (${clerkRole}) to ${email}`,
		});

		revalidatePath("/team");
		revalidatePath("/dashboard");

		return {
			success: true,
			data: {
				id: invitation.id,
				email: invitation.emailAddress,
				role: invitation.role,
			},
		};
	} catch (error: any) {
		console.error("Failed to create Clerk organization invitation.");
		const message =
			error?.errors?.[0]?.longMessage ||
			error?.message ||
			"Failed to dispatch workspace invitation.";
		return { success: false, error: message };
	}
}

/**
 * Fetches real pending invitations directly from Clerk Organizations.
 */
export async function getWorkspaceInvitations() {
	try {
		const { orgId } = await auth();
		if (!orgId) return { success: true, data: [] };

		const client = await clerkClient();
		const response = await client.organizations.getOrganizationInvitationList({
			organizationId: orgId,
			status: ["pending"],
		});

		const formattedInvites = response.data.map((inv) => ({
			id: inv.id,
			email: inv.emailAddress,
			role: inv.role === "org:admin" ? "Admin" : "Member",
			createdAt: inv.createdAt,
		}));

		return { success: true, data: formattedInvites };
	} catch {
		console.error("Failed to fetch Clerk invitations.");
		return { success: true, data: [] };
	}
}

/**
 * Revokes a pending Clerk Organization Invitation.
 */
export async function revokeInvitation(
	invitationId: string,
	_projectId = "global",
): Promise<ActionResponse> {
	try {
		const { userId, orgId, orgRole } = await auth();
		const dbUser = await getOrCreateDbUser();

		if (!userId || !dbUser || !orgId) {
			return { success: false, error: "Unauthorized access." };
		}

		// STRICT SECURITY: Require admin role explicitly
		if (orgRole !== "org:admin" && orgRole !== "admin") {
			return {
				success: false,
				error: "You do not have permission to revoke workspace invitations.",
			};
		}

		const client = await clerkClient();
		await client.organizations.revokeOrganizationInvitation({
			organizationId: orgId,
			invitationId,
			requestingUserId: userId,
		});

		await logActivity({
			userId: dbUser.id,
			action: "Revoked Workspace Invitation",
			entityType: "project",
			entityName: invitationId,
			details: `Revoked pending invitation ID ${invitationId}`,
		});

		revalidatePath("/team");
		return { success: true };
	} catch (error: any) {
		console.error("Failed to revoke Clerk invitation.");
		return {
			success: false,
			error: error?.errors?.[0]?.longMessage || "Failed to revoke invitation.",
		};
	}
}
