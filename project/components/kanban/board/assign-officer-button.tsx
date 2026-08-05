"use client";

import { UserPlus } from "lucide-react";
import { useKanbanStore } from "@/stores/use-kanban-store";

export function AssignOfficerButton() {
	const openAssignProjectMemberModal = useKanbanStore(
		(state) => state.openAssignProjectMemberModal,
	);

	return (
		<button
			type="button"
			onClick={openAssignProjectMemberModal}
			className="inline-flex items-center gap-1.5 px-3.5 py-2 border-2 border-[#D7B05C] bg-gradient-to-b from-[#5B3922] via-[#3B2415] to-[#1A120C] text-[#FFF5D6] font-sans text-xs font-black uppercase tracking-wider rounded-xs shadow-md hover:border-[#FFF5D6] hover:shadow-[0_0_15px_rgba(215,176,92,0.3)] transition-all cursor-pointer shrink-0"
		>
			<UserPlus size={14} className="text-[#D7B05C]" />
			<span>Assign Officer</span>
		</button>
	);
}
