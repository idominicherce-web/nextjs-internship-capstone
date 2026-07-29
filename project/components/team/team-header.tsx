"use client";

import { UserPlus } from "lucide-react";

interface TeamHeaderProps {
	onInviteClick?: () => void;
}

export function TeamHeader({ onInviteClick }: TeamHeaderProps) {
	return (
		<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b-2 border-[#4A2C1D] pb-6">
			<div>
				<div className="flex items-center gap-2 text-[#D7B05C] text-xs font-sans uppercase font-extrabold tracking-[0.25em] mb-1.5">
					<span>⚔</span>
					<span>Roundtable Council</span>
					<span>⚔</span>
				</div>
				<h1 className="text-3xl sm:text-5xl font-black bg-gradient-to-b from-[#FFF5D6] via-[#D7B05C] to-[#B78B3E] bg-clip-text text-transparent uppercase tracking-[0.1em] filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
					Team
				</h1>
				<p className="text-xs sm:text-sm font-sans text-[#D7B05C]/80 mt-2 italic max-w-2xl leading-relaxed">
					Manage workspace members, roles, invitations, and collaboration across
					projects.
					<span className="block text-[11px] text-[#D7B05C]/60 font-serif">
						Coordinate your royal council and assign trusted officers throughout
						the realm.
					</span>
				</p>
			</div>

			<button
				type="button"
				onClick={onInviteClick}
				className="group relative inline-flex items-center px-5 py-2.5 border-2 border-[#D7B05C] bg-gradient-to-b from-[#5B3922] via-[#3B2415] to-[#1A120C] text-[#FFF5D6] font-sans text-xs font-black uppercase tracking-[0.2em] rounded-xs shadow-lg hover:border-[#FFF5D6] hover:shadow-[0_0_20px_rgba(215,176,92,0.4)] transition-all cursor-pointer shrink-0"
			>
				<UserPlus
					size={16}
					className="mr-2 text-[#D7B05C] group-hover:scale-110 transition-transform"
				/>
				<span>Invite Member</span>
			</button>
		</div>
	);
}
