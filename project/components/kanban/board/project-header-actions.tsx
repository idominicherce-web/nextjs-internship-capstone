"use client";

import { UserPlus, Users } from "lucide-react";
import { useState } from "react";
import { ProjectRosterModal } from "@/components/kanban/toolbar/project-roster-modal";
import { AssignProjectMemberModal } from "@/components/modals/assign-project-member-modal";

interface AssignedMember {
	id: string;
	name: string | null;
	email: string;
	role: string;
}

interface ProjectHeaderActionsProps {
	projectId: string;
	projectName: string;
	initialMembers?: AssignedMember[];
}

export function ProjectHeaderActions({
	projectId,
	projectName,
	initialMembers = [],
}: ProjectHeaderActionsProps) {
	const [isAssignOpen, setIsAssignOpen] = useState(false);
	const [isRosterOpen, setIsRosterOpen] = useState(false);

	return (
		<>
			<div className="flex items-center gap-2">
				{/* View Enlisted Officers Roster */}
				<button
					type="button"
					onClick={() => setIsRosterOpen(true)}
					className="inline-flex items-center px-3 py-2 border-2 border-[#8F6236] bg-[#1A120C] text-[#D7B05C] hover:text-[#FFF5D6] hover:border-[#D7B05C] text-xs font-sans font-bold uppercase rounded-xs transition-all cursor-pointer shadow-md"
				>
					<Users size={15} className="mr-1.5 text-[#D7B05C]" />
					<span>Officers ({initialMembers.length})</span>
				</button>

				{/* Assign Officer Action */}
				<button
					type="button"
					onClick={() => setIsAssignOpen(true)}
					className="inline-flex items-center px-4 py-2 border-2 border-[#D7B05C] bg-gradient-to-b from-[#5B3922] via-[#3B2415] to-[#1A120C] text-[#FFF5D6] font-sans text-xs font-black uppercase tracking-wider rounded-xs shadow-lg hover:border-[#FFF5D6] transition-all cursor-pointer"
				>
					<UserPlus size={15} className="mr-2 text-[#D7B05C]" />
					<span>Assign Officer</span>
				</button>
			</div>

			{/* Project Roster Inspection Modal */}
			<ProjectRosterModal
				projectId={projectId}
				projectName={projectName}
				isOpen={isRosterOpen}
				initialMembers={initialMembers}
				onClose={() => setIsRosterOpen(false)}
			/>

			{/* Assign Member Modal */}
			<AssignProjectMemberModal
				projectId={projectId}
				isOpen={isAssignOpen}
				onClose={() => setIsAssignOpen(false)}
			/>
		</>
	);
}
