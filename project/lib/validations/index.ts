// lib/validations/index.ts
import { z } from "zod";

// ============================================
// PROJECT SCHEMAS
// ============================================
export const createProjectSchema = z.object({
	name: z
		.string()
		.min(1, "Project name is required")
		.max(100, "Project name cannot exceed 100 characters")
		.trim(),
	description: z
		.string()
		.max(500, "Description cannot exceed 500 characters")
		.optional()
		.nullable(),
});

export const updateProjectSchema = createProjectSchema.partial();

// ============================================
// LIST SCHEMAS
// ============================================
export const createListSchema = z.object({
	name: z
		.string()
		.min(1, "List name is required")
		.max(50, "List name cannot exceed 50 characters")
		.trim(),
	position: z.number().int().min(0, "Position must be a non-negative integer"),
	projectId: z.string().min(1, "Project ID is required"),
});

export const updateListSchema = z.object({
	name: z
		.string()
		.min(1, "List name is required")
		.max(50, "List name cannot exceed 50 characters")
		.trim()
		.optional(),
	position: z.number().int().min(0).optional(),
});

// ============================================
// TASK SCHEMAS
// ============================================
export const createTaskSchema = z.object({
	title: z
		.string()
		.min(1, "Task title is required")
		.max(200, "Task title cannot exceed 200 characters")
		.trim(),
	description: z
		.string()
		.max(2000, "Description cannot exceed 2000 characters")
		.optional()
		.nullable(),
	position: z.number().int().min(0, "Position must be a non-negative integer"),
	listId: z.string().min(1, "List ID is required"),
	dueDate: z.coerce.date().optional().nullable(),
	userId: z.string().optional().nullable(),
});

export const updateTaskSchema = createTaskSchema.partial();

// ============================================
// INFERRED TYPES
// ============================================
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

export type CreateListInput = z.infer<typeof createListSchema>;
export type UpdateListInput = z.infer<typeof updateListSchema>;

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
