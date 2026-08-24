export type WorkspaceRole =
	| "Workspace Owner"
	| "Administrator"
	| "Project Manager"
	| "Developer"
	| "Designer"
	| "QA Engineer"
	| "Member";

export type ProjectRole = "Admin" | "Member" | "Viewer";

export function canManageWorkspaceMembers(role?: string | null): boolean {
	return role === "Workspace Owner" || role === "Administrator";
}

export function canManageWorkspaceRoles(role?: string | null): boolean {
	return role === "Workspace Owner" || role === "Administrator";
}

export function canModifyTasks(
	workspaceRole?: string | null,
	projectRole?: ProjectRole | null,
): boolean {
	// Viewers are strictly read-only
	if (projectRole === "Viewer") return false;
	return true;
}
