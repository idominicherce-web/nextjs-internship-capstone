"use client";

import { BarChart3, CalendarPlus, Plus, UserPlus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CreateProjectModal } from "@/components/modals/create-project-modal";
import { InviteMemberModal } from "@/components/modals/invite-member-modal";

export function QuickActionsPanel() {
	const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
	const [isInviteMemberOpen, setIsInviteMemberOpen] = useState(false);

	return (
		<>
			<div className="rounded-xs border-2 border-[#8F6236]/70 bg-gradient-to-b from-[#2D1B10] via-[#1A120C] to-[#15100C] p-4 shadow-xl space-y-3">
				<div className="border-b border-[#4A2C1D] pb-2">
					<h3 className="font-serif font-black uppercase text-xs tracking-widest text-[#F8EEDB]">
						Quick Actions
					</h3>
				</div>

				<div className="grid grid-cols-2 gap-2.5">
					{/* 1. New Project Trigger */}
					<button
						type="button"
						onClick={() => setIsCreateProjectOpen(true)}
						className="group flex flex-col items-center justify-center p-3 rounded-xs border-2 border-[#4A2C1D] bg-[#15100C] hover:border-[#D7B05C] hover:bg-[#2D1B10] transition-all text-center space-y-1 shadow-md cursor-pointer w-full"
					>
						<Plus
							size={20}
							className="text-[#D7B05C] group-hover:scale-110 transition-transform"
						/>
						<div>
							<span className="block text-[11px] font-sans font-black uppercase tracking-wider text-[#F8EEDB]">
								New Project
							</span>
							<span className="block text-[8.5px] font-serif italic text-[#D7B05C]/70">
								Open Quest
							</span>
						</div>
					</button>

					{/* 2. Invite Member Trigger */}
					<button
						type="button"
						onClick={() => setIsInviteMemberOpen(true)}
						className="group flex flex-col items-center justify-center p-3 rounded-xs border-2 border-[#4A2C1D] bg-[#15100C] hover:border-[#D7B05C] hover:bg-[#2D1B10] transition-all text-center space-y-1 shadow-md cursor-pointer w-full"
					>
						<UserPlus
							size={20}
							className="text-sky-300 group-hover:scale-110 transition-transform"
						/>
						<div>
							<span className="block text-[11px] font-sans font-black uppercase tracking-wider text-[#F8EEDB]">
								Invite Member
							</span>
							<span className="block text-[8.5px] font-serif italic text-[#D7B05C]/70">
								Recruit Officer
							</span>
						</div>
					</button>

					{/* 3. Schedule Event Link */}
					<Link
						href="/calendar"
						className="group flex flex-col items-center justify-center p-3 rounded-xs border-2 border-[#4A2C1D] bg-[#15100C] hover:border-[#D7B05C] hover:bg-[#2D1B10] transition-all text-center space-y-1 shadow-md cursor-pointer"
					>
						<CalendarPlus
							size={20}
							className="text-amber-400 group-hover:scale-110 transition-transform"
						/>
						<div>
							<span className="block text-[11px] font-sans font-black uppercase tracking-wider text-[#F8EEDB]">
								Schedule Event
							</span>
							<span className="block text-[8.5px] font-serif italic text-[#D7B05C]/70">
								Quest Ledger
							</span>
						</div>
					</Link>

					{/* 4. View Analytics Link */}
					<Link
						href="/analytics"
						className="group flex flex-col items-center justify-center p-3 rounded-xs border-2 border-[#4A2C1D] bg-[#15100C] hover:border-[#D7B05C] hover:bg-[#2D1B10] transition-all text-center space-y-1 shadow-md cursor-pointer"
					>
						<BarChart3
							size={20}
							className="text-emerald-400 group-hover:scale-110 transition-transform"
						/>
						<div>
							<span className="block text-[11px] font-sans font-black uppercase tracking-wider text-[#F8EEDB]">
								View Analytics
							</span>
							<span className="block text-[8.5px] font-serif italic text-[#D7B05C]/70">
								Intelligence Chamber
							</span>
						</div>
					</Link>
				</div>
			</div>

			{/* Self-contained Modal Instances */}
			<CreateProjectModal
				isOpen={isCreateProjectOpen}
				onClose={() => setIsCreateProjectOpen(false)}
			/>

			<InviteMemberModal
				isOpen={isInviteMemberOpen}
				onClose={() => setIsInviteMemberOpen(false)}
			/>
		</>
	);
}
