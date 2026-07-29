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
		<div className="flex flex-col sm:flex-row gap-3 items-center">
			{/* Search Input */}
			<div className="relative flex-1 w-full">
				<Search
					size={16}
					className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D7B05C]/70"
				/>
				<input
					type="text"
					value={searchQuery}
					onChange={(e) => onSearchChange(e.target.value)}
					placeholder="Search members by name, role, or email..."
					className="w-full pl-10 pr-4 py-2 bg-[#FAF0D7] border border-[#8F6236] rounded-xs text-xs font-sans font-extrabold text-[#1A120C] placeholder-[#8F6236]/80 focus:outline-none focus:border-[#D7B05C] shadow-inner"
				/>
			</div>

			{/* Role Filter */}
			<div className="relative w-full sm:w-44">
				<select
					value={selectedRole}
					onChange={(e) => onRoleChange(e.target.value)}
					className="w-full px-3 py-2 appearance-none bg-[#2D1B10] border border-[#8F6236] text-[#D7B05C] font-sans text-xs font-bold uppercase rounded-xs focus:outline-none focus:border-[#D7B05C] cursor-pointer"
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
					className="absolute right-3 top-1/2 -translate-y-1/2 text-[#D7B05C] pointer-events-none"
				/>
			</div>

			{/* Status Filter */}
			<div className="relative w-full sm:w-40">
				<select
					value={selectedStatus}
					onChange={(e) => onStatusChange(e.target.value)}
					className="w-full px-3 py-2 appearance-none bg-[#2D1B10] border border-[#8F6236] text-[#D7B05C] font-sans text-xs font-bold uppercase rounded-xs focus:outline-none focus:border-[#D7B05C] cursor-pointer"
				>
					<option value="all">Status: All</option>
					<option value="Online">Online</option>
					<option value="Away">Away</option>
					<option value="Offline">Offline</option>
				</select>
				<ChevronDown
					size={14}
					className="absolute right-3 top-1/2 -translate-y-1/2 text-[#D7B05C] pointer-events-none"
				/>
			</div>

			{hasFilters && (
				<button
					onClick={onReset}
					className="p-2 text-[#D7B05C] hover:text-[#FFF5D6] border border-[#8F6236] bg-[#2D1B10] rounded-xs cursor-pointer shrink-0"
					title="Reset Filters"
				>
					<RefreshCw size={16} />
				</button>
			)}
		</div>
	);
}
