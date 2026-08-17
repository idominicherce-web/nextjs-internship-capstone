// __tests__/utils/activity-sanitizer.test.ts
function sanitizeActivityDetails(details: string): string {
	return details
		.replace(/\borg:admin\b/g, "Admin")
		.replace(/\borg:member\b/g, "Member")
		.replace(/member ID user_[a-zA-Z0-9]+/g, "workspace member")
		.replace(/invitation ID orginv_[a-zA-Z0-9]+/g, "invitation summons");
}

describe("Activity Feed Sanitizer", () => {
	it("replaces technical Clerk strings with clean display titles", () => {
		const rawLog = "Updated role for member ID user_3HqisLF9 to org:member";
		const sanitized = sanitizeActivityDetails(rawLog);

		expect(sanitized).toBe("Updated role for workspace member to Member");
		expect(sanitized).not.toContain("user_3HqisLF9");
		expect(sanitized).not.toContain("org:member");
	});
});