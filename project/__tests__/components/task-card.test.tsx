import { render, screen, fireEvent } from "@testing-library/react";
import { TaskCard, TaskCardData } from "@/components/kanban/task/task-card";

describe("TaskCard Component", () => {
	const mockTask: TaskCardData = {
		id: "task-1",
		title: "Fortify Front-End Infrastructure",
		description: "Ensure high availability and clean CSS rendering.",
		position: 0,
		listId: "list-1",
		priority: "Urgent",
		dueDate: new Date("2026-08-20"),
		assignee: {
			id: "user-1",
			name: "Dominic Herce",
			email: "dominic@stratpoint.com",
		},
	};

	const mockOnTaskClick = jest.fn();
	const mockOnDeleteTask = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("renders task title, description, priority, and assignee name", () => {
		render(
			<TaskCard
				task={mockTask}
				projectId="proj-1"
				onTaskClick={mockOnTaskClick}
				onDeleteTask={mockOnDeleteTask}
			/>,
		);

		expect(
			screen.getByText("Fortify Front-End Infrastructure"),
		).toBeInTheDocument();
		expect(
			screen.getByText("Ensure high availability and clean CSS rendering."),
		).toBeInTheDocument();
		expect(screen.getByText("Dominic Herce")).toBeInTheDocument();
	});

	it("triggers onTaskClick when card body is clicked", () => {
		render(
			<TaskCard
				task={mockTask}
				projectId="proj-1"
				onTaskClick={mockOnTaskClick}
				onDeleteTask={mockOnDeleteTask}
			/>,
		);

		fireEvent.click(screen.getByText("Fortify Front-End Infrastructure"));
		expect(mockOnTaskClick).toHaveBeenCalledWith(mockTask);
	});

	it("triggers onDeleteTask when trash button is clicked", () => {
		render(
			<TaskCard
				task={mockTask}
				projectId="proj-1"
				onTaskClick={mockOnTaskClick}
				onDeleteTask={mockOnDeleteTask}
			/>,
		);

		const deleteButton = screen.getByTitle("Delete Task");
		fireEvent.click(deleteButton);

		expect(mockOnDeleteTask).toHaveBeenCalledWith("task-1", "proj-1");
		expect(mockOnTaskClick).not.toHaveBeenCalled();
	});
});