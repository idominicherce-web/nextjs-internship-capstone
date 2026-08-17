// __tests__/components/create-task-modal.test.tsx
import { render, screen } from "@testing-library/react";
import { CreateTaskModal } from "@/components/modals/create-task-modal";

jest.mock("@/actions/tasks", () => ({
	createTask: jest.fn().mockResolvedValue({ success: true }),
}));

describe("CreateTaskModal Component", () => {
	const mockProjects = [
		{
			id: "proj-1",
			name: "Kingdom Infrastructure",
			lists: [{ id: "list-1", name: "To Do" }],
		},
	];

	const mockOnClose = jest.fn();

	it("pre-populates target due date and requires project selection when opened globally", () => {
		render(
			<CreateTaskModal
				projects={mockProjects}
				initialDueDate={new Date(2026, 7, 17)} // Local Aug 17, 2026
				isOpen={true}
				onClose={mockOnClose}
			/>,
		);

		// Check modal header title
		expect(
			screen.getByRole("heading", { name: /create task/i }),
		).toBeInTheDocument();

		// Check due date matches 2026-08-17 in local time
		const dueDateInput = screen.getByLabelText(/Due Date/i) as HTMLInputElement;
		expect(dueDateInput.value).toBe("2026-08-17");

		// Check required project selector exists
		expect(screen.getByLabelText(/Project/i)).toBeInTheDocument();
	});
});