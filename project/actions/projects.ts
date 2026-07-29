// actions/projects.ts

"use server";

import { and, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getOrCreateDbUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { activityLogs, lists, projects } from "@/lib/db/schema";
import { createProjectSchema, updateProjectSchema } from "@/lib/validations";

export type ActionResponse<T = unknown> = {
	success: boolean;
	data?: T;
	error?: string;
	fieldErrors?: Record<string, string[]>;
};

/**
 * Helper to transform project names into URL-friendly slugs.
 */
function slugify(text: string): string {
	return text
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, "")
		.replace(/[\s_-]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

// Universal Default Columns for every newly initialized project
const DEFAULT_PROJECT_COLUMNS = [
	{ name: "Backlog", position: 0 },
	{ name: "To Do", position: 1 },
	{ name: "In Progress", position: 2 },
	{ name: "In Review", position: 3 },
	{ name: "Done", position: 4 },
];

/**
 * Creates a new project along with its 5 default Kanban columns.
 */
export async function createProject(
	_prevState: unknown,
	formData?: FormData | { name: string; description?: string } | string,
	secondArgDescription?: string,
): Promise<ActionResponse> {
	try {
		const dbUser = await getOrCreateDbUser();
		if (!dbUser) {
			return { success: false, error: "Unauthorized access." };
		}

		let rawData: { name?: unknown; description?: unknown } = {};

		if (formData instanceof FormData) {
			rawData = {
				name: formData.get("name"),
				description: formData.get("description"),
			};
		} else if (typeof formData === "string") {
			rawData = {
				name: formData,
				description: secondArgDescription,
			};
		} else if (formData && typeof formData === "object") {
			rawData = formData;
		} else {
			return { success: false, error: "Invalid form payload." };
		}

		const parsed = createProjectSchema.safeParse(rawData);
		if (!parsed.success) {
			const flattened = parsed.error.flatten();
			const firstError =
				Object.values(flattened.fieldErrors)[0]?.[0] || "Validation failed.";
			return {
				success: false,
				error: firstError,
				fieldErrors: flattened.fieldErrors,
			};
		}

		// Generate unique slug
		const baseSlug = slugify(parsed.data.name) || "project";
		const uniqueSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

		// 1. Create the project
		const [newProject] = await db
			.insert(projects)
			.values({
				name: parsed.data.name,
				slug: uniqueSlug,
				description: parsed.data.description,
				userId: dbUser.id,
			})
			.returning();

		// 2. Automatically seed the 5 default columns for the new project
		await db.insert(lists).values(
			DEFAULT_PROJECT_COLUMNS.map((col) => ({
				name: col.name,
				position: col.position,
				projectId: newProject.id,
			})),
		);

		// 3. Record activity log
		await db.insert(activityLogs).values({
			userId: dbUser.id,
			action: "Created Project",
			entityType: "project",
			entityName: newProject.name,
			details: `Commissioned quest dossier: ${newProject.name}`,
		});

		revalidatePath("/dashboard");
		revalidatePath("/projects");
		revalidatePath("/analytics");

		return { success: true, data: newProject };
	} catch (error) {
		console.error("Failed to create project:", error);
		return {
			success: false,
			error: "An unexpected error occurred while creating the project.",
		};
	}
}

/**
 * Fetches all projects for the authenticated user.
 */
export async function getProjects() {
	try {
		const dbUser = await getOrCreateDbUser();
		if (!dbUser) {
			return [];
		}

		return await db.query.projects.findMany({
			where: eq(projects.userId, dbUser.id),
			orderBy: [desc(projects.createdAt)],
		});
	} catch (error) {
		console.error("Failed to fetch projects:", error);
		return [];
	}
}

/**
 * Updates an existing project dossier.
 */
export async function updateProject(
	id: string,
	formData: FormData | { name?: string; description?: string | null },
): Promise<ActionResponse> {
	try {
		const dbUser = await getOrCreateDbUser();
		if (!dbUser) {
			return { success: false, error: "Unauthorized access." };
		}

		let rawData: { name?: unknown; description?: unknown } = {};
		if (formData instanceof FormData) {
			rawData = {
				name: formData.get("name"),
				description: formData.get("description"),
			};
		} else {
			rawData = formData;
		}

		const parsed = updateProjectSchema.safeParse(rawData);
		if (!parsed.success) {
			const flattened = parsed.error.flatten();
			const firstError =
				Object.values(flattened.fieldErrors)[0]?.[0] || "Validation failed.";
			return {
				success: false,
				error: firstError,
				fieldErrors: flattened.fieldErrors,
			};
		}

		const updatePayload: Record<string, any> = {
			...parsed.data,
			updatedAt: new Date(),
		};

		if (parsed.data.name) {
			const baseSlug = slugify(parsed.data.name);
			updatePayload.slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
		}

		const [updatedProject] = await db
			.update(projects)
			.set(updatePayload)
			.where(and(eq(projects.id, id), eq(projects.userId, dbUser.id)))
			.returning();

		if (!updatedProject) {
			return {
				success: false,
				error: "Project not found or permission denied.",
			};
		}

		await db.insert(activityLogs).values({
			userId: dbUser.id,
			action: "Updated Project",
			entityType: "project",
			entityName: updatedProject.name,
			details: `Updated quest dossier details for ${updatedProject.name}`,
		});

		revalidatePath("/dashboard");
		revalidatePath("/projects");
		revalidatePath(`/projects/${updatedProject.slug}`);

		return { success: true, data: updatedProject };
	} catch (error) {
		console.error("Failed to update project:", error);
		return { success: false, error: "Failed to update project." };
	}
}

/**
 * Deletes a project and cascaded records.
 */
export async function deleteProject(id: string): Promise<ActionResponse> {
	try {
		const dbUser = await getOrCreateDbUser();
		if (!dbUser) {
			return { success: false, error: "Unauthorized access." };
		}

		const [deletedProject] = await db
			.delete(projects)
			.where(and(eq(projects.id, id), eq(projects.userId, dbUser.id)))
			.returning();

		if (deletedProject) {
			await db.insert(activityLogs).values({
				userId: dbUser.id,
				action: "Deleted Project",
				entityType: "project",
				entityName: deletedProject.name,
				details: `Archived quest dossier: ${deletedProject.name}`,
			});
		}

		revalidatePath("/dashboard");
		revalidatePath("/projects");

		return { success: true };
	} catch (error) {
		console.error("Failed to delete project:", error);
		return { success: false, error: "Failed to delete project." };
	}
}
