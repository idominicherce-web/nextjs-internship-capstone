"use client";

import { ChevronDown, RefreshCw, Search } from "lucide-react";

interface TeamSearchProps {
	searchQuery: string;
	onSearchChange: (value: string) => void;
	selectedRole: string;
	onRoleChange: (value: string) => void;
	selectedStatus: string;
	onStatusChange: (value: string) => void;
	onReset: () => void;
}

export function TeamSearch({
	searchQuery,
	onSearchChange,
	selectedRole,
	onRoleChange,
	selectedStatus,
	onStatusChange,
	onReset,
}: TeamSearchProps) {
	const hasFilters = Boolean(
		searchQuery || selectedRole !== "all" || selectedStatus !== "all",
	);

	return (
		<div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 items-stretch sm:items-center w-full min-w-0">
			{/* Search Input */}
			<div className="relative flex-1 w-full min-w-0">
				<Search
					size={16}
					className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D7B05C]/70 pointer-events-none"
				/>
				<input
					type="text"
					value={searchQuery}
					onChange={(e) => onSearchChange(e.target.value)}
					placeholder="Search members by name, role, or email..."
					aria-label="Search members"
					className="w-full min-h-11 sm:min-h-0 pl-10 pr-4 py-2 sm:py-2.5 bg-[#FAF0D7] border border-[#8F6236] rounded-xs text-xs font-sans font-extrabold text-[#1A120C] placeholder-[#8F6236]/80 focus:outline-hidden focus:border-[#D7B05C] shadow-inner"
				/>
			</div>

			{/* Filter Controls Row on Mobile */}
			<div className="flex items-center gap-2 w-full sm:w-auto">
				{/* Role Filter */}
				<div className="relative flex-1 sm:w-44 min-w-0">
					<select
						value={selectedRole}
						onChange={(e) => onRoleChange(e.target.value)}
						aria-label="Filter by role"
						className="w-full min-h-11 sm:min-h-0 px-3 py-2 appearance-none bg-[#2D1B10] border border-[#8F6236] text-[#D7B05C] font-sans text-xs font-bold uppercase rounded-xs focus:outline-hidden focus:border-[#D7B05C] cursor-pointer pr-8 truncate"
					>
						<option value="all">Role: All</option>
						<option value="Workspace Owner">Workspace Owner</option>
						<option value="Administrator">Administrator</option>
						<option value="Project Manager">Project Manager</option>
						<option value="Developer">Developer</option>
						<option value="Designer">Designer</option>
						<option value="QA Engineer">QA Engineer</option>
					</select>
					<ChevronDown
						size={14}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-[#D7B05C] pointer-events-none shrink-0"
					/>
				</div>

				{/* Status Filter */}
				<div className="relative flex-1 sm:w-36 min-w-0">
					<select
						value={selectedStatus}
						onChange={(e) => onStatusChange(e.target.value)}
						aria-label="Filter by status"
						className="w-full min-h-11 sm:min-h-0 px-3 py-2 appearance-none bg-[#2D1B10] border border-[#8F6236] text-[#D7B05C] font-sans text-xs font-bold uppercase rounded-xs focus:outline-hidden focus:border-[#D7B05C] cursor-pointer pr-8 truncate"
					>
						<option value="all">Status: All</option>
						<option value="Online">Online</option>
						<option value="Away">Away</option>
						<option value="Offline">Offline</option>
					</select>
					<ChevronDown
						size={14}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-[#D7B05C] pointer-events-none shrink-0"
					/>
				</div>

				{hasFilters && (
					<button
						type="button"
						onClick={onReset}
						aria-label="Reset Search Filters"
						className="min-h-11 sm:min-h-0 p-2.5 sm:p-2 text-[#D7B05C] hover:text-[#FFF5D6] border border-[#8F6236] bg-[#2D1B10] rounded-xs cursor-pointer shrink-0 flex items-center justify-center"
						title="Reset Filters"
					>
						<RefreshCw size={16} />
					</button>
				)}
			</div>
		</div>
	);
}
