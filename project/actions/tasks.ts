// actions/tasks.ts
"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { tasks } from "@/lib/db/schema"
import { getOrCreateDbUser } from "@/lib/auth"
import { eq, max } from "drizzle-orm"

export async function createTask(
  listId: string,
  projectId: string,
  title: string,
  description?: string
) {
  try {
    const dbUser = await getOrCreateDbUser()
    if (!dbUser) {
      return { success: false, error: "Unauthorized" }
    }

    if (!title || title.trim() === "") {
      return { success: false, error: "Task title is required" }
    }

    // Determine next position index for the task in this list
    const maxPositionResult = await db
      .select({ maxPos: max(tasks.position) })
      .from(tasks)
      .where(eq(tasks.listId, listId))

    const nextPosition = (maxPositionResult[0]?.maxPos ?? -1) + 1

    const [newTask] = await db
      .insert(tasks)
      .values({
        title: title.trim(),
        description: description?.trim() || null,
        listId,
        userId: dbUser.id,
        position: nextPosition,
      })
      .returning()

    revalidatePath(`/projects/${projectId}`)

    return { success: true, data: newTask }
  } catch (error) {
    console.error("Failed to create task:", error)
    return { success: false, error: "Failed to create task" }
  }
}

export async function deleteTask(taskId: string, projectId: string) {
  try {
    const dbUser = await getOrCreateDbUser()
    if (!dbUser) {
      return { success: false, error: "Unauthorized" }
    }

    await db.delete(tasks).where(eq(tasks.id, taskId))

    revalidatePath(`/projects/${projectId}`)

    return { success: true }
  } catch (error) {
    console.error("Failed to delete task:", error)
    return { success: false, error: "Failed to delete task" }
  }
}

export async function updateTaskPosition(
  taskId: string,
  newListId: string,
  newPosition: number,
  projectId: string
) {
  try {
    const dbUser = await getOrCreateDbUser()
    if (!dbUser) {
      return { success: false, error: "Unauthorized" }
    }

    await db
      .update(tasks)
      .set({
        listId: newListId,
        position: newPosition,
        updatedAt: new Date(),
      })
      .where(eq(tasks.id, taskId))

    revalidatePath(`/projects/${projectId}`)

    return { success: true }
  } catch (error) {
    console.error("Failed to update task position:", error)
    return { success: false, error: "Failed to update task position" }
  }
}