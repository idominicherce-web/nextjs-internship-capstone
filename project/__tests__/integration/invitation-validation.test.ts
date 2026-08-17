import { z } from "zod";

const inviteWorkspaceSchema = z.object({
	email: z.string().trim().email("Please enter a valid email address."),
	role: z.enum(["org:admin", "org:member"]),
});

describe("Invitation Schema Validation", () => {
	it("accepts valid invitation payload with Clerk role format", () => {
		const result = inviteWorkspaceSchema.safeParse({
			email: "officer@roundtable.realm",
			role: "org:member",
		});
		expect(result.success).toBe(true);
	});

	it("rejects empty or whitespace-only emails", () => {
		const result = inviteWorkspaceSchema.safeParse({
			email: "   ",
			role: "org:member",
		});
		expect(result.success).toBe(false);
	});
});