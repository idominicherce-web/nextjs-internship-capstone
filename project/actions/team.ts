"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getOrCreateDbUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { activityLogs, projectMembers, users } from "@/lib/db/schema";
import { logActivity } from "@/lib/logger";

/**
 * Removes a member from the Clerk Organization, deletes their global Clerk user,
 * and cleans up their project assignments, activity logs, and user record in Neon DB.
 */
export async function removeMemberAction(targetUserId: string) {
	try {
		const { userId, orgId, orgRole } = await auth();
		const dbUser = await getOrCreateDbUser();

		if (!userId || !dbUser) {
			return { success: false, error: "Unauthorized access. Please sign in." };
		}

		if (!orgId) {
			return { success: false, error: "No active workspace organization." };
		}

		// STRICT SECURITY: Require admin permissions to discharge members
		if (orgRole !== "org:admin" && orgRole !== "admin") {
			return {
				success: false,
				error: "You do not have administrative permission to remove members.",
			};
		}

		const client = await clerkClient();

		// 1. Find the target Neon DB user record first (matching clerkId or id)
		const targetDbUser = await db.query.users.findFirst({
			where: (u, { eq, or }) =>
				or(eq(u.clerkId, targetUserId), eq(u.id, targetUserId)),
		});

		// 2. Revoke Clerk Organization Membership
		try {
			await client.organizations.deleteOrganizationMembership({
				organizationId: orgId,
				userId: targetUserId,
			});
		} catch (err) {
			console.warn(
				"Could not delete Clerk org membership (may already be removed):",
				err,
			);
		}

		// 3. Delete global user from Clerk Backend
		try {
			await client.users.deleteUser(targetUserId);
		} catch (err) {
			console.warn(
				"Could not delete global Clerk user (may be managed externally):",
				err,
			);
		}

		// 4. Clean up Neon DB user record and foreign key dependencies
		if (targetDbUser) {
			try {
				// Delete project memberships
				await db
					.delete(projectMembers)
					.where(eq(projectMembers.userId, targetDbUser.id));

				// Delete activity logs linked to this user
				await db
					.delete(activityLogs)
					.where(eq(activityLogs.userId, targetDbUser.id));

				// Delete user record from Neon DB
				await db.delete(users).where(eq(users.id, targetDbUser.id));
			} catch (err) {
				console.error("Failed to delete user from Neon DB:", err);
			}
		} else {
			// Fallback: Attempt deletion matching targetUserId against clerkId directly
			try {
				await db.delete(users).where(eq(users.clerkId, targetUserId));
			} catch (err) {
				console.error("Fallback Neon deletion failed:", err);
			}
		}

		// Log discharge activity
		await logActivity({
			userId: dbUser.id,
			action: "Discharged Workspace Member",
			entityType: "project",
			entityName: targetUserId,
			details: `Removed member ${targetUserId} from workspace and database.`,
		});

		revalidatePath("/team");
		revalidatePath("/dashboard");

		return { success: true };
	} catch (error: any) {
		console.error("Failed to discharge workspace member:", error);
		return {
			success: false,
			error: error?.message || "Failed to remove member from workspace.",
		};
	}
}

/**
 * Updates a member's workspace role in Clerk Organization and logs the activity.
 */
export async function updateMemberRoleAction(
	targetUserId: string,
	newRoleInput: string,
) {
	try {
		const { userId, orgId, orgRole } = await auth();
		const dbUser = await getOrCreateDbUser();

		if (!userId || !dbUser) {
			return { success: false, error: "Unauthorized access. Please sign in." };
		}

		if (!orgId) {
			return { success: false, error: "No active workspace organization." };
		}

		// STRICT SECURITY: Require admin permissions to update member roles
		if (orgRole !== "org:admin" && orgRole !== "admin") {
			return {
				success: false,
				error:
					"You do not have administrative permission to update member roles.",
			};
		}

		const client = await clerkClient();

		// Map to Clerk Organization role strings
		const clerkRole =
			newRoleInput === "Admin" || newRoleInput === "org:admin"
				? "org:admin"
				: "org:member";

		// Update role in Clerk Organization
		await client.organizations.updateOrganizationMembership({
			organizationId: orgId,
			userId: targetUserId,
			role: clerkRole,
		});

		// Log activity
		await logActivity({
			userId: dbUser.id,
			action: "Updated Member Workspace Role",
			entityType: "project",
			entityName: targetUserId,
			details: `Updated role for member ID ${targetUserId} to ${clerkRole}`,
		});

		revalidatePath("/team");
		revalidatePath("/dashboard");

		return { success: true };
	} catch (error: any) {
		console.error("Failed to update workspace member role:", error);
		return {
			success: false,
			error:
				error?.errors?.[0]?.longMessage ||
				error?.message ||
				"Failed to update member role.",
		};
	}
}
