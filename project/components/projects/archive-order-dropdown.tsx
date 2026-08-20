"use client";

import { ArrowUpDown, Filter } from "lucide-react";

export type SortOption = "newest" | "oldest" | "alphabetical";

interface ArchiveOrderDropdownProps {
	isOpen: boolean;
	onToggle: () => void;
	sortBy: SortOption;
	onSelectSort: (option: SortOption) => void;
	onReset: () => void;
	hasActiveFilters: boolean;
}

export function ArchiveOrderDropdown({
	isOpen,
	onToggle,
	sortBy,
	onSelectSort,
	onReset,
	hasActiveFilters,
}: ArchiveOrderDropdownProps) {
	return (
		<div className="relative">
			<button
				type="button"
				onClick={onToggle}
				className={`inline-flex items-center justify-center px-4 py-2 border-2 rounded-xs text-xs font-sans font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
					isOpen || hasActiveFilters
						? "border-[#D7B05C] bg-[#5B3922] text-[#FFF5D6] shadow-[0_0_15px_rgba(215,176,92,0.3)]"
						: "border-[#8F6236] bg-gradient-to-b from-[#3B2415] to-[#15100C] text-[#D7B05C] hover:border-[#D7B05C] hover:text-white"
				}`}
			>
				<Filter size={16} className="mr-2" />
				Sort Quests
			</button>

			{isOpen && (
				<div className="absolute right-0 mt-2 w-64 bg-[#FAF0D7] border-2 border-[#8F6236] rounded-xs p-4 shadow-2xl z-30 space-y-3 text-[#1A120C]">
					<div className="flex items-center gap-1.5 text-xs font-sans font-black uppercase tracking-wider text-[#5B3922] border-b border-[#8F6236]/30 pb-2">
						<ArrowUpDown size={14} /> Sort Quests
					</div>

					<div className="space-y-1">
						{[
							{ id: "newest", label: "Newest quests" },
							{ id: "oldest", label: "Oldest quests" },
							{ id: "alphabetical", label: "Alphabetical (A-Z)" },
						].map((option) => (
							<button
								key={option.id}
								type="button"
								onClick={() => onSelectSort(option.id as SortOption)}
								className={`w-full text-left px-3 py-2 rounded-xs text-xs font-sans font-extrabold transition-colors cursor-pointer ${
									sortBy === option.id
										? "bg-[#3B2415] text-[#D7B05C] font-black shadow-xs"
										: "hover:bg-[#8F6236]/20 text-[#2D1B10]"
								}`}
							>
								{option.label}
							</button>
						))}
					</div>

					{hasActiveFilters && (
						<div className="pt-2 border-t border-[#8F6236]/30">
							<button
								type="button"
								onClick={onReset}
								className="w-full text-center text-xs font-sans font-black text-rose-800 hover:underline py-1"
							>
								Clear Archive Filters
							</button>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
