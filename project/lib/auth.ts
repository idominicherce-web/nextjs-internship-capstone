// lib/auth.ts
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

export async function getOrCreateDbUser() {
	const clerkUser = await currentUser();

	if (!clerkUser) {
		return null;
	}

	const primaryEmail =
		clerkUser.emailAddresses.find(
			(email) => email.id === clerkUser.primaryEmailAddressId,
		)?.emailAddress ??
		clerkUser.emailAddresses[0]?.emailAddress ??
		"";

	const fullName =
		`${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() || null;

	// Check if user exists
	const existingUser = await db.query.users.findFirst({
		where: eq(users.clerkId, clerkUser.id),
	});

	if (existingUser) {
		// Update existing user
		const [updatedUser] = await db
			.update(users)
			.set({
				email: primaryEmail,
				name: fullName,
				imageUrl: clerkUser.imageUrl,
				updatedAt: new Date(),
			})
			.where(eq(users.clerkId, clerkUser.id))
			.returning();

		return updatedUser;
	}

	// Insert new user
	const [newUser] = await db
		.insert(users)
		.values({
			clerkId: clerkUser.id,
			email: primaryEmail,
			name: fullName,
			imageUrl: clerkUser.imageUrl,
		})
		.returning();

	return newUser;
}
