"use client";

import { UserPlus } from "lucide-react";

interface TeamHeaderProps {
	onInviteClick?: () => void;
}

export function TeamHeader({ onInviteClick }: TeamHeaderProps) {
	return (
		<header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 border-b-2 border-[#4A2C1D] pb-5 sm:pb-6 relative min-w-0">
			<div className="space-y-1 sm:space-y-1.5 min-w-0">
				<div className="flex items-center gap-2 text-[#D7B05C] text-[10px] sm:text-xs font-sans uppercase font-extrabold tracking-[0.2em] sm:tracking-[0.25em]">
					<span>⚔</span>
					<span className="truncate">Roundtable Council</span>
					<span>⚔</span>
				</div>
				<h1 className="text-2xl sm:text-4xl md:text-5xl font-black bg-gradient-to-b from-[#FFF5D6] via-[#D7B05C] to-[#B78B3E] bg-clip-text text-transparent uppercase tracking-[0.08em] sm:tracking-[0.1em] filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] leading-none">
					Team
				</h1>
				<p className="text-xs sm:text-sm font-sans text-[#D7B05C]/80 italic max-w-2xl leading-relaxed">
					Manage workspace members, roles, invitations, and project assignments.
				</p>
			</div>

			<button
				type="button"
				onClick={onInviteClick}
				aria-label="Invite new team member"
				className="w-full sm:w-auto min-h-11 sm:min-h-0 flex items-center justify-center px-5 py-2.5 border-2 border-[#D7B05C] bg-gradient-to-b from-[#5B3922] via-[#3B2415] to-[#1A120C] text-[#FFF5D6] font-sans text-xs font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] rounded-xs shadow-lg hover:border-[#FFF5D6] hover:shadow-[0_0_20px_rgba(215,176,92,0.4)] transition-all cursor-pointer shrink-0"
			>
				<UserPlus size={16} className="mr-2 text-[#D7B05C]" />
				<span>Invite Member</span>
			</button>
		</header>
	);
}
