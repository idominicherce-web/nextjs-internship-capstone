"use client";

import { UserPlus } from "lucide-react";
import { useState } from "react";
import { AssignProjectMemberModal } from "@/components/modals/assign-project-member-modal";

interface ProjectHeaderActionsProps {
	projectId: string;
	projectName: string;
}

export function ProjectHeaderActions({
	projectId,
	projectName,
}: ProjectHeaderActionsProps) {
	const [isAssignOpen, setIsAssignOpen] = useState(false);

	return (
		<>
			<button
				type="button"
				onClick={() => setIsAssignOpen(true)}
				className="group relative inline-flex items-center px-4 py-2 border-2 border-[#D7B05C] bg-gradient-to-b from-[#5B3922] via-[#3B2415] to-[#1A120C] text-[#FFF5D6] font-sans text-xs font-black uppercase tracking-wider rounded-xs shadow-lg hover:border-[#FFF5D6] transition-all cursor-pointer"
			>
				<UserPlus size={16} className="mr-2 text-[#D7B05C]" />
				<span>Assign Officer to Project</span>
			</button>

			<AssignProjectMemberModal
				projectId={projectId}
				isOpen={isAssignOpen}
				onClose={() => setIsAssignOpen(false)}
			/>
		</>
	);
}
