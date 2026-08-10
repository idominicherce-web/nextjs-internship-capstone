// Role hierarchy and permission checker utility function
type Role = "Workspace Owner" | "Administrator" | "Project Manager" | "Developer" | "Viewer";

function canManageMembers(role: Role): boolean {
	return role === "Workspace Owner" || role === "Administrator";
}

function canEditTask(role: Role): boolean {
	return role !== "Viewer";
}

describe("Permission Utilities (RBAC)", () => {
	describe("canManageMembers", () => {
		it("allows Workspace Owners and Administrators to manage members", () => {
			expect(canManageMembers("Workspace Owner")).toBe(true);
			expect(canManageMembers("Administrator")).toBe(true);
		});

		it("denies Developers and Viewers from managing members", () => {
			expect(canManageMembers("Developer")).toBe(false);
			expect(canManageMembers("Viewer")).toBe(false);
		});
	});

	describe("canEditTask", () => {
		it("allows active roles to edit tasks", () => {
			expect(canEditTask("Project Manager")).toBe(true);
			expect(canEditTask("Developer")).toBe(true);
		});

		it("denies read-only Viewers from editing tasks", () => {
			expect(canEditTask("Viewer")).toBe(false);
		});
	});
});