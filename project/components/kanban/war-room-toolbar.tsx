"use client";

import { Calendar, Filter, Plus, Search, Users } from "lucide-react";

interface WarRoomToolbarProps {
	searchQuery?: string;
	onSearchChange?: (query: string) => void;
	onOpenCreateTaskModal?: () => void;
}

export function WarRoomToolbar({
	searchQuery = "",
	onSearchChange,
	onOpenCreateTaskModal,
}: WarRoomToolbarProps) {
	return (
		<div className="flex flex-wrap items-center justify-between gap-3 bg-[#100A07] p-2 border border-[#4A2C1D] rounded-xs shadow-inner">
			{/* Search Input */}
			<div className="relative flex-1 min-w-[200px] max-w-md">
				<Search
					size={14}
					className="absolute left-3 top-2.5 text-[#D7B05C]/60"
				/>
				<input
					type="text"
					value={searchQuery}
					onChange={(e) => onSearchChange?.(e.target.value)}
					placeholder="Filter objectives by title or officer..."
					className="w-full pl-9 pr-3 py-1.5 bg-[#15100C] border border-[#4A2C1D] rounded-xs text-xs font-sans font-bold text-[#F8EEDB] placeholder-[#D7B05C]/40 focus:outline-none focus:border-[#D7B05C]"
				/>
			</div>

			{/* Control Actions */}
			<div className="flex items-center space-x-2">
				<button
					type="button"
					className="p-2 border border-[#4A2C1D] bg-[#15100C] text-[#D7B05C] hover:text-white hover:border-[#D7B05C] rounded-xs transition-colors cursor-pointer"
					title="Filter Board"
				>
					<Filter size={16} />
				</button>

				<button
					type="button"
					className="p-2 border border-[#4A2C1D] bg-[#15100C] text-[#D7B05C] hover:text-white hover:border-[#D7B05C] rounded-xs transition-colors cursor-pointer"
					title="Roundtable Officers"
				>
					<Users size={16} />
				</button>

				<button
					type="button"
					className="p-2 border border-[#4A2C1D] bg-[#15100C] text-[#D7B05C] hover:text-white hover:border-[#D7B05C] rounded-xs transition-colors cursor-pointer"
					title="Quest Ledger View"
				>
					<Calendar size={16} />
				</button>

				{onOpenCreateTaskModal && (
					<button
						type="button"
						onClick={onOpenCreateTaskModal}
						className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#D7B05C] bg-gradient-to-b from-[#5B3922] to-[#2D1B10] text-[#FFF5D6] font-sans text-xs font-black uppercase tracking-wider rounded-xs shadow-md hover:border-[#FFF5D6] cursor-pointer"
					>
						<Plus size={14} className="text-[#D7B05C]" />
						<span>New Decree</span>
					</button>
				)}
			</div>
		</div>
	);
}
