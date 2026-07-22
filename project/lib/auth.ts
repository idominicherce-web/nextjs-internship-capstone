// lib/auth.ts
import { currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

/**
 * Syncs the currently authenticated Clerk user with our Neon PostgreSQL database.
 * If the user exists in the database, it updates their email, name, and image URL.
 * If the user does not exist, it creates a new User record.
 * 
 * @returns The database User record, or null if unauthenticated.
 */
export async function getOrCreateDbUser() {
  const clerkUser = await currentUser()

  if (!clerkUser) {
    return null
  }

  const primaryEmail = clerkUser.emailAddresses.find(
    (email) => email.id === clerkUser.primaryEmailAddressId
  )?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress ?? ""

  const fullName = `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() || null

  const dbUser = await prisma.user.upsert({
    where: { clerkId: clerkUser.id },
    update: {
      email: primaryEmail,
      name: fullName,
      imageUrl: clerkUser.imageUrl,
    },
    create: {
      clerkId: clerkUser.id,
      email: primaryEmail,
      name: fullName,
      imageUrl: clerkUser.imageUrl,
    },
  })

  return dbUser
}