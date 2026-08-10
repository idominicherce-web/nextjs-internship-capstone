import { z } from "zod";

const inviteMemberSchema = z.object({
	email: z.string().email("Invalid email address"),
	role: z.enum(["Workspace Owner", "Administrator", "Project Manager", "Developer", "Designer", "QA Engineer"]),
});

describe("Invitation Schema Validation", () => {
	it("accepts valid invitation payload", () => {
		const result = inviteMemberSchema.safeParse({
			email: "officer@roundtable.realm",
			role: "Developer",
		});
		expect(result.success).toBe(true);
	});

	it("rejects malformed email addresses", () => {
		const result = inviteMemberSchema.safeParse({
			email: "invalid-email",
			role: "Developer",
		});
		expect(result.success).toBe(false);
	});
});