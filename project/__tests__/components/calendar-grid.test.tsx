// __tests__/components/calendar-grid.test.tsx
import { fireEvent, render, screen, within } from "@testing-library/react";
import { CalendarGrid } from "@/components/calendar/calendar-grid";

jest.mock("@/actions/tasks", () => ({
	createTask: jest.fn().mockResolvedValue({ success: true }),
}));

describe("CalendarGrid Component", () => {
	// Use deterministic local dates (Year, Month Index 7 = August, Day)
	const aug17TaskDate = new Date(2026, 7, 17);
	const aug20TaskDate = new Date(2026, 7, 20);

	const mockTasks = [
		{
			id: "task-1",
			title: "Fortify Castle Walls",
			projectName: "Project Alpha",
			dueDate: aug17TaskDate,
			type: "deadline" as const,
			isCompleted: false,
		},
		{
			id: "task-2",
			title: "Inspect Armory",
			projectName: "Project Alpha",
			dueDate: aug20TaskDate,
			type: "deadline" as const,
			isCompleted: false,
		},
	];

	it("renders tasks across month grid cells and filters the selected-date task list", () => {
		render(<CalendarGrid tasks={mockTasks} />);

		// 1. Month Grid Assertion: Both tasks exist in their respective calendar date cells
		expect(screen.getAllByText("Fortify Castle Walls").length).toBeGreaterThan(0);
		expect(screen.getAllByText("Inspect Armory").length).toBeGreaterThan(0);

		// 2. Select August 17 on the calendar grid explicitly
		const aug17Button = screen.getByRole("button", { name: /17 Fortify Castle Walls/i });
		fireEvent.click(aug17Button);

		// 3. Selected-Date Task List Assertion: Target container heading matches selected date
		const selectedDateHeading = screen.getByRole("heading", {
			name: /TASKS FOR AUGUST 17, 2026/i,
		});
		expect(selectedDateHeading).toBeInTheDocument();

		// Target the parent container of the selected-date section
		const selectedDateSection = selectedDateHeading.closest("div")?.parentElement;
		expect(selectedDateSection).toBeDefined();

		if (selectedDateSection) {
			// Fortify Castle Walls MUST appear in today's selected task list
			expect(
				within(selectedDateSection).getByText("Fortify Castle Walls"),
			).toBeInTheDocument();

			// Inspect Armory (due Aug 20) MUST NOT appear in Aug 17's selected task list
			expect(
				within(selectedDateSection).queryByText("Inspect Armory"),
			).not.toBeInTheDocument();
		}
	});
});