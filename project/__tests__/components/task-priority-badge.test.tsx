import { render, screen } from "@testing-library/react";
import { TaskPriorityBadge } from "@/components/kanban/task/task-priority-badge";

describe("TaskPriorityBadge Component", () => {
	it("renders Urgent priority badge correctly", () => {
		render(<TaskPriorityBadge priority="Urgent" />);
		expect(screen.getByText("Urgent")).toBeInTheDocument();
	});

	it("renders High priority badge correctly", () => {
		render(<TaskPriorityBadge priority="High" />);
		expect(screen.getByText("High")).toBeInTheDocument();
	});

	it("renders Medium priority badge correctly", () => {
		render(<TaskPriorityBadge priority="Medium" />);
		expect(screen.getByText("Medium")).toBeInTheDocument();
	});

	it("renders Low priority badge correctly", () => {
		render(<TaskPriorityBadge priority="Low" />);
		expect(screen.getByText("Low")).toBeInTheDocument();
	});

	it("defaults to Medium when priority is null or undefined", () => {
		render(<TaskPriorityBadge priority={null} />);
		expect(screen.getByText("Medium")).toBeInTheDocument();
	});
});