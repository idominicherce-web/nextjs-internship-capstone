"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getOrCreateDbUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { userSettings, users, workspaceInvitations } from "@/lib/db/schema";

// --- EXISTING FUNCTION ---
export async function getUsers() {
	try {
		const allUsers = await db
			.select({
				id: users.id,
				name: users.name,
				email: users.email,
			})
			.from(users);

		return { success: true, data: allUsers };
	} catch (error) {
		console.error("Failed to fetch users:", error);
		return { success: false, data: [] };
	}
}

// --- NEW SERVER ACTIONS FOR SETTINGS & INVITATIONS ---

export async function updateUserProfile(data: {
	name: string;
	email: string;
	role: string;
}) {
	try {
		const dbUser = await getOrCreateDbUser();
		if (!dbUser) throw new Error("Unauthorized");

		await db
			.update(users)
			.set({
				name: data.name,
				email: data.email,
				updatedAt: new Date(),
			})
			.where(eq(users.id, dbUser.id));

		revalidatePath("/settings");
		revalidatePath("/dashboard");
		revalidatePath("/team");

		return { success: true };
	} catch (error) {
		console.error("Failed to update profile:", error);
		return { success: false, error: "Failed to update profile" };
	}
}

export async function updateNotificationPreferences(data: {
	taskAssignedInApp: boolean;
	taskAssignedEmail: boolean;
	dueDatesInApp: boolean;
	dueDatesEmail: boolean;
	mentionsInApp: boolean;
	mentionsEmail: boolean;
	emailDigest: string;
}) {
	try {
		const dbUser = await getOrCreateDbUser();
		if (!dbUser) throw new Error("Unauthorized");

		await db
			.insert(userSettings)
			.values({
				userId: dbUser.id,
				...data,
				updatedAt: new Date(),
			})
			.onConflictDoUpdate({
				target: userSettings.userId,
				set: {
					...data,
					updatedAt: new Date(),
				},
			});

		revalidatePath("/settings");
		return { success: true };
	} catch (error) {
		console.error("Failed to update notification preferences:", error);
		return { success: false, error: "Failed to save preferences" };
	}
}

export async function sendWorkspaceInvite(email: string, role: string) {
	try {
		const dbUser = await getOrCreateDbUser();
		if (!dbUser) throw new Error("Unauthorized");

		await db.insert(workspaceInvitations).values({
			email,
			role,
			invitedById: dbUser.id,
			status: "pending",
		});

		revalidatePath("/team");
		return { success: true };
	} catch (error) {
		console.error("Failed to send invitation:", error);
		return { success: false, error: "Failed to send invitation" };
	}
}
