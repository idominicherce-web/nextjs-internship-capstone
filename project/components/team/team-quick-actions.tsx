"use client";

import { FolderPlus, Settings, UserPlus } from "lucide-react";

interface TeamQuickActionsProps {
	onInviteMember?: () => void;
}

export function TeamQuickActions({ onInviteMember }: TeamQuickActionsProps) {
	return (
		<div className="p-4 rounded-xs border-2 border-[#3B2415] bg-[#1A120C] shadow-2xl space-y-3">
			<h3 className="font-serif font-black uppercase text-xs tracking-wider text-[#F8EEDB] border-b border-[#4A2C1D] pb-2">
				Quick Actions
			</h3>

			<div className="grid grid-cols-1 gap-2 pt-1">
				<button
					type="button"
					onClick={onInviteMember}
					className="w-full flex items-center gap-2.5 px-3 py-2 border border-[#8F6236] bg-[#2D1B10] text-[#D7B05C] hover:text-[#FFF5D6] hover:border-[#D7B05C] font-sans text-xs font-bold uppercase rounded-xs transition-colors text-left cursor-pointer"
				>
					<UserPlus size={15} /> Invite Member
				</button>

				<button
					type="button"
					className="w-full flex items-center gap-2.5 px-3 py-2 border border-[#8F6236]/60 bg-[#15100C] text-[#D7B05C]/70 hover:text-[#D7B05C] font-sans text-xs font-bold uppercase rounded-xs transition-colors text-left cursor-pointer"
				>
					<FolderPlus size={15} /> Assign Project
				</button>

				<button
					type="button"
					className="w-full flex items-center gap-2.5 px-3 py-2 border border-[#8F6236]/60 bg-[#15100C] text-[#D7B05C]/70 hover:text-[#D7B05C] font-sans text-xs font-bold uppercase rounded-xs transition-colors text-left cursor-pointer"
				>
					<Settings size={15} /> Manage Permissions
				</button>
			</div>
		</div>
	);
}
