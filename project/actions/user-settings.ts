"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getOrCreateDbUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

export async function updateProfileSettingsAction(formData: FormData) {
	const dbUser = await getOrCreateDbUser();
	if (!dbUser) {
		return { success: false, error: "Unauthorized officer." };
	}

	const name = formData.get("name")?.toString().trim();

	if (!name || name.length < 2) {
		return {
			success: false,
			error: "Name must be at least 2 characters long.",
		};
	}

	try {
		await db
			.update(users)
			.set({
				name,
				updatedAt: new Date(),
			})
			.where(eq(users.id, dbUser.id));

		revalidatePath("/settings");
		revalidatePath("/dashboard");
		return { success: true };
	} catch (error) {
		console.error("Failed to update profile settings:", error);
		return { success: false, error: "Failed to persist profile settings." };
	}
}
