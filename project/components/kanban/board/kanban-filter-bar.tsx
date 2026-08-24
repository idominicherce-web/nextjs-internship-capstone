"use client";

import { ChevronDown, Filter, RotateCcw, Search, X } from "lucide-react";
import { useKanbanStore } from "@/stores/use-kanban-store";

export function KanbanFilterBar() {
	const {
		searchQuery,
		selectedPriority,
		setSearchQuery,
		setSelectedPriority,
		clearFilters,
	} = useKanbanStore();

	const hasActiveFilters = Boolean(searchQuery || selectedPriority);

	return (
		<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xs border-2 border-[#4A2C1D] bg-[#1A120C] shadow-md">
			{/* Search Input Box */}
			<div className="relative flex-1">
				<Search
					size={16}
					className="absolute left-3 top-1/2 -translate-y-1/2 text-[#D7B05C]/60 pointer-events-none"
				/>
				<input
					type="text"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					placeholder="Search objectives by title or description..."
					className="w-full pl-9 pr-8 py-2 bg-[#FAF0D7] border border-[#8F6236] rounded-xs text-xs font-sans font-bold text-[#1A120C] placeholder-[#8F6236]/80 focus:outline-none focus:border-[#D7B05C] shadow-inner"
				/>
				{searchQuery && (
					<button
						type="button"
						onClick={() => setSearchQuery("")}
						className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8F6236] hover:text-[#1A120C] cursor-pointer"
					>
						<X size={14} />
					</button>
				)}
			</div>

			{/* Filter Controls: Priority Selector & Reset */}
			<div className="flex items-center gap-2 shrink-0">
				{/* Priority Dropdown Container */}
				<div className="relative flex items-center">
					{/* Filter Funnel Icon */}
					<Filter
						size={14}
						className="absolute left-3 top-1/2 -translate-y-1/2 text-[#D7B05C] pointer-events-none z-10"
					/>

					{/* Select Dropdown with Proper Padding & Hidden Default Arrow */}
					<select
						value={selectedPriority || "all"}
						onChange={(e) =>
							setSelectedPriority(
								e.target.value === "all" ? null : e.target.value,
							)
						}
						className="pl-8 pr-8 py-2 bg-[#2D1B10] border border-[#8F6236] text-[#D7B05C] text-xs font-bold uppercase rounded-xs cursor-pointer appearance-none focus:outline-none focus:border-[#D7B05C]"
					>
						<option value="all">All Priorities</option>
						<option value="High">High Priority</option>
						<option value="Medium">Medium Priority</option>
						<option value="Low">Low Priority</option>
					</select>

					{/* Custom Dropdown Chevron */}
					<ChevronDown
						size={14}
						className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#D7B05C] pointer-events-none z-10"
					/>
				</div>

				{/* Clear Filters Button */}
				{hasActiveFilters && (
					<button
						type="button"
						onClick={clearFilters}
						className="inline-flex items-center gap-1.5 px-3 py-2 border border-rose-800/80 bg-rose-950/40 text-rose-300 hover:text-white hover:bg-rose-900/60 rounded-xs text-xs font-sans font-bold uppercase tracking-wider transition-colors cursor-pointer"
						title="Clear Filters"
					>
						<RotateCcw size={12} />
						<span className="hidden sm:inline">Reset</span>
					</button>
				)}
			</div>
		</div>
	);
}
