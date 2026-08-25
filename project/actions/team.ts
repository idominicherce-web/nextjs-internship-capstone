"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getOrCreateDbUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { projectMembers, users } from "@/lib/db/schema";
import { logActivity } from "@/lib/logger";

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

		const isMainAccount =
			dbUser.email?.toLowerCase() === "dominicherce@gmail.com" ||
			dbUser.role === "Workspace Owner";

		const isAdmin =
			isMainAccount || orgRole === "org:admin" || orgRole === "admin";

		if (!isAdmin) {
			return {
				success: false,
				error: "You do not have administrative permission to remove members.",
			};
		}

		const client = await clerkClient();

		const targetDbUser = await db.query.users.findFirst({
			where: (u, { eq, or }) =>
				or(eq(u.clerkId, targetUserId), eq(u.id, targetUserId)),
		});

		const displayName =
			targetDbUser?.name || targetDbUser?.email || "Workspace Member";

		try {
			await client.organizations.deleteOrganizationMembership({
				organizationId: orgId,
				userId: targetUserId,
			});
		} catch (err) {
			console.warn("Could not delete Clerk org membership:", err);
		}

		try {
			await client.users.deleteUser(targetUserId);
		} catch (err) {
			console.warn("Could not delete global Clerk user:", err);
		}

		if (targetDbUser) {
			try {
				await db
					.delete(projectMembers)
					.where(eq(projectMembers.userId, targetDbUser.id));
				await db.delete(users).where(eq(users.id, targetDbUser.id));
			} catch (err) {
				console.error("Failed to delete user from Neon DB:", err);
			}
		}

		await logActivity({
			userId: dbUser.id,
			action: "Discharged Member",
			entityType: "team",
			entityName: displayName,
			details: `Discharged ${displayName} from workspace council`,
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

		const isMainAccount =
			dbUser.email?.toLowerCase() === "dominicherce@gmail.com" ||
			dbUser.role === "Workspace Owner";

		const isAdmin =
			isMainAccount || orgRole === "org:admin" || orgRole === "admin";

		if (!isAdmin) {
			return {
				success: false,
				error:
					"You do not have administrative permission to update member roles.",
			};
		}

		const client = await clerkClient();

		const targetDbUser = await db.query.users.findFirst({
			where: (u, { eq, or }) =>
				or(eq(u.clerkId, targetUserId), eq(u.id, targetUserId)),
		});

		const displayName =
			targetDbUser?.name || targetDbUser?.email || "Workspace Member";

		const clerkRole =
			newRoleInput === "Admin" || newRoleInput === "org:admin"
				? "org:admin"
				: "org:member";

		await client.organizations.updateOrganizationMembership({
			organizationId: orgId,
			userId: targetUserId,
			role: clerkRole,
		});

		if (targetDbUser) {
			await db
				.update(users)
				.set({
					role: newRoleInput,
					updatedAt: new Date(),
				})
				.where(eq(users.id, targetDbUser.id));
		}

		await logActivity({
			userId: dbUser.id,
			action: "Updated Member Role",
			entityType: "team",
			entityName: displayName,
			details: `Updated workspace role for ${displayName} to ${newRoleInput}`,
		});

		revalidatePath("/team");
		revalidatePath("/dashboard");

		return { success: true };
	} catch (error: any) {
		console.error("Failed to update workspace member role:", error);
		return {
			success: false,
			error: error?.message || "Failed to update member role.",
		};
	}
}
