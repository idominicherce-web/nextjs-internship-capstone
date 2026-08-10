import { renderHook, act } from "@testing-library/react";
import { useState } from "react";

// Example pattern testing custom search/filter hook logic
function useProjectFilter() {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedPriority, setSelectedPriority] = useState<string | null>(null);

	const resetFilters = () => {
		setSearchQuery("");
		setSelectedPriority(null);
	};

	return { searchQuery, setSearchQuery, selectedPriority, setSelectedPriority, resetFilters };
}

describe("useProjectFilter Hook", () => {
	it("updates search query and resets filter states correctly", () => {
		const { result } = renderHook(() => useProjectFilter());

		act(() => {
			result.current.setSearchQuery("Database");
			result.current.setSelectedPriority("Urgent");
		});

		expect(result.current.searchQuery).toBe("Database");
		expect(result.current.selectedPriority).toBe("Urgent");

		act(() => {
			result.current.resetFilters();
		});

		expect(result.current.searchQuery).toBe("");
		expect(result.current.selectedPriority).toBeNull();
	});
});