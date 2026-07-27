"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { projects, activityLogs } from "@/lib/db/schema"
import { getOrCreateDbUser } from "@/lib/auth"
import { createProjectSchema, updateProjectSchema } from "@/lib/validations"
import { eq, and, desc } from "drizzle-orm"

export type ActionResponse<T = unknown> = {
  success: boolean
  data?: T
  error?: string
  fieldErrors?: Record<string, string[]>
}

/**
 * Creates a new project.
 * Compatible with React 19 useActionState and direct async invocations.
 */
export async function createProject(
  prevState: unknown,
  formData?: FormData | { name: string; description?: string } | string,
  secondArgDescription?: string
): Promise<ActionResponse> {
  try {
    const dbUser = await getOrCreateDbUser()
    if (!dbUser) {
      return { success: false, error: "Unauthorized access." }
    }

    // Extract input based on how the function was invoked
    let rawData: { name?: unknown; description?: unknown } = {}

    if (formData instanceof FormData) {
      rawData = {
        name: formData.get("name"),
        description: formData.get("description"),
      }
    } else if (typeof formData === "string") {
      rawData = {
        name: formData,
        description: secondArgDescription,
      }
    } else if (formData && typeof formData === "object") {
      rawData = formData
    } else {
      return { success: false, error: "Invalid form payload." }
    }

    // Zod safeParse validation
    const parsed = createProjectSchema.safeParse(rawData)
    if (!parsed.success) {
      const flattened = parsed.error.flatten()
      const firstError = Object.values(flattened.fieldErrors)[0]?.[0] || "Validation failed."
      return {
        success: false,
        error: firstError,
        fieldErrors: flattened.fieldErrors,
      }
    }

    const [newProject] = await db
      .insert(projects)
      .values({
        name: parsed.data.name,
        description: parsed.data.description,
        userId: dbUser.id,
      })
      .returning()

    // Record activity audit log
    await db.insert(activityLogs).values({
      userId: dbUser.id,
      action: "Created Project",
      entityType: "project",
      entityName: newProject.name,
      details: `Commissioned campaign dossier: ${newProject.name}`,
    })

    // Cache purging
    revalidatePath("/dashboard")
    revalidatePath("/projects")
    revalidatePath("/analytics")

    return { success: true, data: newProject }
  } catch (error) {
    console.error("Failed to create project:", error)
    return { success: false, error: "An unexpected error occurred while creating the project." }
  }
}

/**
 * Fetches all projects for the authenticated user.
 */
export async function getProjects() {
  try {
    const dbUser = await getOrCreateDbUser()
    if (!dbUser) {
      return []
    }

    return await db.query.projects.findMany({
      where: eq(projects.userId, dbUser.id),
      orderBy: [desc(projects.createdAt)],
    })
  } catch (error) {
    console.error("Failed to fetch projects:", error)
    return []
  }
}

/**
 * Updates an existing project dossier.
 */
export async function updateProject(
  id: string,
  formData: FormData | { name?: string; description?: string }
): Promise<ActionResponse> {
  try {
    const dbUser = await getOrCreateDbUser()
    if (!dbUser) {
      return { success: false, error: "Unauthorized access." }
    }

    let rawData: { name?: unknown; description?: unknown } = {}
    if (formData instanceof FormData) {
      rawData = {
        name: formData.get("name"),
        description: formData.get("description"),
      }
    } else {
      rawData = formData
    }

    const parsed = updateProjectSchema.safeParse(rawData)
    if (!parsed.success) {
      const flattened = parsed.error.flatten()
      const firstError = Object.values(flattened.fieldErrors)[0]?.[0] || "Validation failed."
      return {
        success: false,
        error: firstError,
        fieldErrors: flattened.fieldErrors,
      }
    }

    const [updatedProject] = await db
      .update(projects)
      .set({
        ...parsed.data,
        updatedAt: new Date(),
      })
      .where(and(eq(projects.id, id), eq(projects.userId, dbUser.id)))
      .returning()

    if (!updatedProject) {
      return { success: false, error: "Project not found or permission denied." }
    }

    // Record activity audit log
    await db.insert(activityLogs).values({
      userId: dbUser.id,
      action: "Updated Project",
      entityType: "project",
      entityName: updatedProject.name,
      details: `Updated campaign dossier details for ${updatedProject.name}`,
    })

    revalidatePath("/dashboard")
    revalidatePath("/projects")
    revalidatePath(`/projects/${id}`)

    return { success: true, data: updatedProject }
  } catch (error) {
    console.error("Failed to update project:", error)
    return { success: false, error: "Failed to update project." }
  }
}

/**
 * Deletes a project and cascaded records.
 */
export async function deleteProject(id: string): Promise<ActionResponse> {
  try {
    const dbUser = await getOrCreateDbUser()
    if (!dbUser) {
      return { success: false, error: "Unauthorized access." }
    }

    const [deletedProject] = await db
      .delete(projects)
      .where(and(eq(projects.id, id), eq(projects.userId, dbUser.id)))
      .returning()

    if (deletedProject) {
      await db.insert(activityLogs).values({
        userId: dbUser.id,
        action: "Deleted Project",
        entityType: "project",
        entityName: deletedProject.name,
        details: `Archived campaign dossier: ${deletedProject.name}`,
      })
    }

    revalidatePath("/dashboard")
    revalidatePath("/projects")

    return { success: true }
  } catch (error) {
    console.error("Failed to delete project:", error)
    return { success: false, error: "Failed to delete project." }
  }
}