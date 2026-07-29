// actions/users.ts
"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getOrCreateDbUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

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
				role: data.role,
				updatedAt: new Date(),
			})
			.where(eq(users.id, dbUser.id));

		revalidatePath("/settings");
		revalidatePath("/dashboard");
		revalidatePath("/team");

		return { success: true };
	} catch (error) {
		console.error("Failed to update user profile:", error);
		return { success: false, error: "Failed to update profile." };
	}
}
