// actions/lists.ts
"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { lists } from "@/lib/db/schema"
import { getOrCreateDbUser } from "@/lib/auth"
import { eq, asc, and, max } from "drizzle-orm"

export async function createList(projectId: string, name: string) {
  try {
    const dbUser = await getOrCreateDbUser()
    if (!dbUser) {
      return { success: false, error: "Unauthorized" }
    }

    if (!name || name.trim() === "") {
      return { success: false, error: "List name is required" }
    }

    // Determine the next position index for the new list
    const maxPositionResult = await db
      .select({ maxPos: max(lists.position) })
      .from(lists)
      .where(eq(lists.projectId, projectId))

    const nextPosition = (maxPositionResult[0]?.maxPos ?? -1) + 1

    const [newList] = await db
      .insert(lists)
      .values({
        name: name.trim(),
        projectId,
        position: nextPosition,
      })
      .returning()

    revalidatePath(`/projects/${projectId}`)

    return { success: true, data: newList }
  } catch (error) {
    console.error("Failed to create list:", error)
    return { success: false, error: "Failed to create list" }
  }
}

export async function deleteList(listId: string, projectId: string) {
  try {
    const dbUser = await getOrCreateDbUser()
    if (!dbUser) {
      return { success: false, error: "Unauthorized" }
    }

    await db.delete(lists).where(eq(lists.id, listId))

    revalidatePath(`/projects/${projectId}`)

    return { success: true }
  } catch (error) {
    console.error("Failed to delete list:", error)
    return { success: false, error: "Failed to delete list" }
  }
}