// actions/projects.ts
"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { projects } from "@/lib/db/schema"
import { getOrCreateDbUser } from "@/lib/auth"
import { createProjectSchema, updateProjectSchema } from "@/lib/validations"
import { eq, and, desc } from "drizzle-orm"

export async function createProject(formData: unknown) {
  try {
    const dbUser = await getOrCreateDbUser()
    if (!dbUser) {
      return { success: false, error: "Unauthorized" }
    }

    const validatedData = createProjectSchema.parse(formData)

    const [project] = await db
      .insert(projects)
      .values({
        name: validatedData.name,
        description: validatedData.description,
        userId: dbUser.id,
      })
      .returning()

    revalidatePath("/dashboard")
    revalidatePath("/projects")

    return { success: true, data: project }
  } catch (error) {
    console.error("Failed to create project:", error)
    return { success: false, error: "Failed to create project" }
  }
}

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

export async function updateProject(id: string, formData: unknown) {
  try {
    const dbUser = await getOrCreateDbUser()
    if (!dbUser) {
      return { success: false, error: "Unauthorized" }
    }

    const validatedData = updateProjectSchema.parse(formData)

    const [project] = await db
      .update(projects)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(and(eq(projects.id, id), eq(projects.userId, dbUser.id)))
      .returning()

    revalidatePath("/dashboard")
    revalidatePath("/projects")
    revalidatePath(`/projects/${id}`)

    return { success: true, data: project }
  } catch (error) {
    console.error("Failed to update project:", error)
    return { success: false, error: "Failed to update project" }
  }
}

export async function deleteProject(id: string) {
  try {
    const dbUser = await getOrCreateDbUser()
    if (!dbUser) {
      return { success: false, error: "Unauthorized" }
    }

    await db
      .delete(projects)
      .where(and(eq(projects.id, id), eq(projects.userId, dbUser.id)))

    revalidatePath("/dashboard")
    revalidatePath("/projects")

    return { success: true }
  } catch (error) {
    console.error("Failed to delete project:", error)
    return { success: false, error: "Failed to delete project" }
  }
}