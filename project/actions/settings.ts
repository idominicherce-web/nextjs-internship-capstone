// actions/settings.ts

"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getOrCreateDbUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { userSettings } from "@/lib/db/schema";

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
					taskAssignedEmail: true,
					dueDatesInApp: true,
					dueDatesEmail: true,
					mentionsInApp: true,
					mentionsEmail: false,
					emailDigest: "daily",
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
	taskAssignedEmail?: boolean;
	dueDatesInApp?: boolean;
	dueDatesEmail?: boolean;
	mentionsInApp?: boolean;
	mentionsEmail?: boolean;
	emailDigest?: string;
}) {
	try {
		const dbUser = await getOrCreateDbUser();
		if (!dbUser) return { success: false, error: "Unauthorized access." };

		// Changed 'let' to 'const' to satisfy Biome
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
