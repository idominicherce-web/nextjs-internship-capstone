// hooks/use-projects.ts
"use client";

import { useState, useTransition } from "react";
import {
	createProject,
	deleteProject,
	updateProject,
} from "@/actions/projects";
import type { CreateProjectInput, UpdateProjectInput } from "@/lib/validations";

export function useProjects() {
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | null>(null);

	/**
	 * Create a new project
	 */
	const handleCreateProject = async (data: CreateProjectInput) => {
		setError(null);
		let result: { success: boolean; error?: string; data?: any } = {
			success: false,
		};

		await new Promise<void>((resolve) => {
			startTransition(async () => {
				result = await createProject(data);
				if (!result.success) {
					setError(result.error ?? "Failed to create project");
				}
				resolve();
			});
		});

		return result;
	};

	/**
	 * Update an existing project
	 */
	const handleUpdateProject = async (id: string, data: UpdateProjectInput) => {
		setError(null);
		let result: { success: boolean; error?: string; data?: any } = {
			success: false,
		};

		await new Promise<void>((resolve) => {
			startTransition(async () => {
				result = await updateProject(id, data);
				if (!result.success) {
					setError(result.error ?? "Failed to update project");
				}
				resolve();
			});
		});

		return result;
	};

	/**
	 * Delete a project
	 */
	const handleDeleteProject = async (id: string) => {
		setError(null);
		let result: { success: boolean; error?: string } = { success: false };

		await new Promise<void>((resolve) => {
			startTransition(async () => {
				result = await deleteProject(id);
				if (!result.success) {
					setError(result.error ?? "Failed to delete project");
				}
				resolve();
			});
		});

		return result;
	};

	return {
		isLoading: isPending,
		error,
		createProject: handleCreateProject,
		updateProject: handleUpdateProject,
		deleteProject: handleDeleteProject,
	};
}
