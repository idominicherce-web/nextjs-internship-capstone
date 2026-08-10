import { render, screen } from "@testing-library/react";
import { IntelligenceStats } from "@/components/analytics/intelligence-stats";

describe("IntelligenceStats Component", () => {
	it("renders all four operational KPI metrics", () => {
		render(
			<IntelligenceStats
				overallEfficiency={85}
				completedTasks={8}
				totalTasks={10}
				inProgressTasks={2}
				overdueTasks={1}
			/>,
		);

		expect(screen.getByText("Completion Rate")).toBeInTheDocument();
		expect(screen.getByText("85%")).toBeInTheDocument();

		expect(screen.getByText("Completed Tasks")).toBeInTheDocument();
		expect(screen.getByText("8 / 10")).toBeInTheDocument();

		expect(screen.getByText("Active Tasks")).toBeInTheDocument();
		expect(screen.getByText("2")).toBeInTheDocument();

		expect(screen.getByText("Overdue Tasks")).toBeInTheDocument();
		expect(screen.getByText("1")).toBeInTheDocument();
	});
});