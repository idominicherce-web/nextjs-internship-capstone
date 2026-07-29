"use client";

import { GripVertical, Trash2 } from "lucide-react";

const KINGDOM_SUBTEXT_MAP: Record<string, string> = {
	backlog: "Royal Archives",
	"to do": "Awaiting Orders",
	todo: "Awaiting Orders",
	"in progress": "Active Quest",
	doing: "Active Quest",
	"in review": "High Council Review",
	review: "High Council Review",
	done: "Completed Quest",
	completed: "Completed Quest",
};

function getKingdomSubtext(columnName: string): string {
	const normalized = columnName.toLowerCase().trim();
	return KINGDOM_SUBTEXT_MAP[normalized] || "Strategic Command";
}

interface KanbanColumnHeaderProps {
	name: string;
	taskCount: number;
	listId: string;
	projectId: string;
	onDeleteList: (id: string, projectId: string) => void;
}

export function KanbanColumnHeader({
	name,
	taskCount,
	listId,
	projectId,
	onDeleteList,
}: KanbanColumnHeaderProps) {
	const kingdomSubtext = getKingdomSubtext(name);

	return (
		<div className="p-3 border-b-2 border-[#4A2C1D] bg-[#15100C]/90 flex items-center justify-between">
			<div className="flex items-center space-x-2.5 min-w-0">
				<GripVertical
					size={16}
					className="text-[#8F6236] cursor-grab shrink-0"
				/>
				<div className="min-w-0">
					<div className="flex items-center gap-1.5">
						<h3 className="font-serif font-black text-sm uppercase tracking-wider text-[#F8EEDB] truncate">
							{name}
						</h3>
						<span className="px-1.5 py-0.2 text-[9px] font-sans font-black bg-[#3B2415] text-[#D7B05C] rounded-xs border border-[#8F6236] shrink-0">
							{taskCount}
						</span>
					</div>
					<p className="text-[9.5px] font-serif italic text-[#D7B05C]/60 truncate leading-tight">
						{kingdomSubtext}
					</p>
				</div>
			</div>

			<button
				type="button"
				onClick={() => onDeleteList(listId, projectId)}
				className="text-[#8F6236] hover:text-rose-400 transition-colors p-1 cursor-pointer shrink-0"
				title="Delete column"
			>
				<Trash2 size={15} />
			</button>
		</div>
	);
}
