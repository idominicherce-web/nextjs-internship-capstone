describe("Server Actions Response Handlers", () => {
	const mockActionHandler = async (payload: { title?: string }) => {
		if (!payload.title || payload.title.trim() === "") {
			return { success: false as const, error: "Title parameter is required." };
		}
		return { success: true as const, data: { id: "task-999", title: payload.title } };
	};

	it("returns success payload when valid inputs are supplied", async () => {
		const response = await mockActionHandler({ title: "Forge Royal Decree" });
		expect(response.success).toBe(true);
		if (response.success && response.data) {
			expect(response.data.title).toBe("Forge Royal Decree");
		}
	});

	it("returns structured error response when required inputs are missing", async () => {
		const response = await mockActionHandler({ title: "" });
		expect(response.success).toBe(false);
		if (!response.success) {
			expect(response.error).toBe("Title parameter is required.");
		}
	});
});