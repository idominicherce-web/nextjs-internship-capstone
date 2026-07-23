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

export async function updateTask(
  taskId: string,
  projectId: string,
  updates: {
    title?: string
    description?: string | null
    dueDate?: Date | null
  }
) {
  try {
    const dbUser = await getOrCreateDbUser()
    if (!dbUser) {
      return { success: false, error: "Unauthorized" }
    }

    const [updatedTask] = await db
      .update(tasks)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(tasks.id, taskId))
      .returning()

    revalidatePath(`/projects/${projectId}`)

    return { success: true, data: updatedTask }
  } catch (error) {
    console.error("Failed to update task:", error)
    return { success: false, error: "Failed to update task" }
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

export async function reorderTasks(
  taskUpdates: { id: string; listId: string; position: number }[],
  projectId: string
) {
  try {
    const dbUser = await getOrCreateDbUser()
    if (!dbUser) {
      return { success: false, error: "Unauthorized" }
    }

    // Batch update all task positions in PostgreSQL
    await Promise.all(
      taskUpdates.map((item) =>
        db
          .update(tasks)
          .set({
            listId: item.listId,
            position: item.position,
            updatedAt: new Date(),
          })
          .where(eq(tasks.id, item.id))
      )
    )

    revalidatePath(`/projects/${projectId}`)

    return { success: true }
  } catch (error) {
    console.error("Failed to reorder tasks:", error)
    return { success: false, error: "Failed to reorder tasks" }
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