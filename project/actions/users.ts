// actions/users.ts
"use server"

import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"

export async function getUsers() {
  try {
    const allUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
      })
      .from(users)

    return { success: true, data: allUsers }
  } catch (error) {
    console.error("Failed to fetch users:", error)
    return { success: false, data: [] }
  }
}