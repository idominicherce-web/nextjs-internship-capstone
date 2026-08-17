import type { ActionResponse } from "@/actions/tasks";

describe("Server Actions Response Shape Standard", () => {
	const createTaskMock = async (title: string): Promise<ActionResponse> => {
		if (!title.trim()) {
			return {
				success: false,
				error: "Title parameter is required.",
				fieldErrors: { title: ["Title is required"] },
			};
		}
		return { success: true, data: { id: "task-1", title } };
	};

	it("returns standardized field errors on validation failure", async () => {
		const res = await createTaskMock("");
		expect(res.success).toBe(false);
		if (!res.success) {
			expect(res.fieldErrors?.title).toBeDefined();
			expect(res.fieldErrors?.title?.[0]).toBe("Title is required");
		}
	});
});