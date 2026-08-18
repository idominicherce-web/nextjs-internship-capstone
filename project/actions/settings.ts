"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getOrCreateDbUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { userSettings, users } from "@/lib/db/schema";

export async function getUserSettings() {
	try {
		const dbUser = await getOrCreateDbUser();
		if (!dbUser) return { success: false, data: null };

		let settings = await db.query.userSettings.findFirst({
			where: eq(userSettings.userId, dbUser.id),
		});

		if (!settings) {
			const [newSettings] = await db
				.insert(userSettings)
				.values({
					userId: dbUser.id,
					taskAssignedInApp: true,
					dueDatesInApp: true,
					mentionsInApp: true,
				})
				.returning();

			settings = newSettings;
		}

		return { success: true, data: settings };
	} catch (error) {
		console.error("Failed to fetch user settings:", error);
		return { success: false, data: null };
	}
}

export async function updateUserSettings(payload: {
	taskAssignedInApp?: boolean;
	dueDatesInApp?: boolean;
	mentionsInApp?: boolean;
}) {
	try {
		const dbUser = await getOrCreateDbUser();
		if (!dbUser) return { success: false, error: "Unauthorized access." };

		const settings = await db.query.userSettings.findFirst({
			where: eq(userSettings.userId, dbUser.id),
		});

		if (!settings) {
			await db.insert(userSettings).values({
				userId: dbUser.id,
				...payload,
			});
		} else {
			await db
				.update(userSettings)
				.set({
					...payload,
					updatedAt: new Date(),
				})
				.where(eq(userSettings.userId, dbUser.id));
		}

		revalidatePath("/settings");
		return { success: true };
	} catch (error) {
		console.error("Failed to update user settings:", error);
		return { success: false, error: "Failed to update settings." };
	}
}

export async function updateUserProfile(payload: {
	name?: string;
	email?: string;
	role?: string;
}) {
	try {
		const dbUser = await getOrCreateDbUser();
		if (!dbUser) return { success: false, error: "Unauthorized access." };

		if (payload.name && payload.name.trim().length < 2) {
			return {
				success: false,
				error: "Officer name must be at least 2 characters long.",
			};
		}

		await db
			.update(users)
			.set({
				name: payload.name?.trim(),
				role: payload.role,
				updatedAt: new Date(),
			})
			.where(eq(users.id, dbUser.id));

		revalidatePath("/settings");
		revalidatePath("/dashboard");
		return { success: true };
	} catch (error) {
		console.error("Failed to update user profile:", error);
		return { success: false, error: "Failed to update profile." };
	}
}
