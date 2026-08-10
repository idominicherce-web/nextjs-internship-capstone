import { z } from "zod";

// Task input schema matching client-side/server action validations
const createTaskSchema = z.object({
	title: z.string().min(1, "Title is required").max(100, "Title is too long"),
	description: z.string().nullable().optional(),
	listId: z.string().min(1, "List ID is required"),
	priority: z.enum(["Low", "Medium", "High", "Urgent"]).optional(),
	dueDate: z.string().nullable().optional(),
});

describe("Task Validation Schema Integration Tests", () => {
	it("validates correct task payloads", () => {
		const validPayload = {
			title: "Fortify Castle Defenses",
			description: "Implement rate limiting on high command endpoints.",
			listId: "list-123",
			priority: "High",
			dueDate: "2026-08-15",
		};

		const result = createTaskSchema.safeParse(validPayload);
		expect(result.success).toBe(true);
	});

	it("rejects task payloads with empty title", () => {
		const invalidPayload = {
			title: "",
			listId: "list-123",
		};

		const result = createTaskSchema.safeParse(invalidPayload);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe("Title is required");
		}
	});

	it("rejects invalid priority values", () => {
		const invalidPayload = {
			title: "Inspect Armory",
			listId: "list-123",
			priority: "Critical", // Invalid enum value
		};

		const result = createTaskSchema.safeParse(invalidPayload);
		expect(result.success).toBe(false);
	});
});