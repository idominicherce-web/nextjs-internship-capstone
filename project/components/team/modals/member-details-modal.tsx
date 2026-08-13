"use client";

import { Briefcase, Calendar, Mail, Trash2, X } from "lucide-react";
import { useEffect } from "react";
import type { Member } from "@/components/team/team-directory-table";

interface MemberDetailsModalProps {
	member: Member | null;
	isOpen: boolean;
	onClose: () => void;
	onRemoveMember?: (userId: string) => void;
}

export function MemberDetailsModal({
	member,
	isOpen,
	onClose,
	onRemoveMember,
}: MemberDetailsModalProps) {
	useEffect(() => {
		if (!isOpen) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};

		document.body.style.overflow = "hidden";
		window.addEventListener("keydown", handleKeyDown);

		return () => {
			document.body.style.overflow = "";
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [isOpen, onClose]);

	if (!isOpen || !member) return null;

	return (
		<div
			role="dialog"
			aria-modal="true"
			aria-labelledby="member-details-title"
			className="fixed inset-0 z-[100] h-screen w-screen bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto font-serif animate-in fade-in duration-150"
			onClick={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}
		>
			<div className="w-full max-w-md max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-xs border-2 border-[#8F6236] bg-[#1A120C] p-6 shadow-2xl space-y-5 text-[#F8EEDB] relative my-auto">
				{/* Modal Header */}
				<div className="flex items-center justify-between border-b border-[#4A2C1D] pb-3">
					<div className="flex items-center gap-3">
						<div className="flex h-11 w-11 items-center justify-center rounded-xs border-2 border-[#D7B05C] bg-[#15100C] font-black text-base text-[#D7B05C]">
							{member.avatar}
						</div>
						<div>
							<h2
								id="member-details-title"
								className="font-serif font-black text-base text-[#F8EEDB]"
							>
								{member.name}
							</h2>
							<span className="inline-block px-2 py-0.5 rounded-xs border border-[#8F6236] bg-[#2D1B10] text-[9px] font-sans font-bold uppercase text-[#D7B05C]">
								{member.role}
							</span>
						</div>
					</div>

					<button
						type="button"
						onClick={onClose}
						aria-label="Close Member Details"
						className="p-1 text-[#E3C279] hover:text-white transition-colors cursor-pointer"
					>
						<X size={18} />
					</button>
				</div>

				{/* Profile Details */}
				<div className="space-y-3.5 font-sans text-xs">
					<div className="space-y-1">
						<span className="block text-[10px] font-bold uppercase tracking-wider text-[#E3C279]">
							Email Address
						</span>
						<div className="flex items-center gap-2 p-2.5 rounded-xs border border-[#4A2C1D] bg-[#15100C] text-[#F8EEDB]">
							<Mail size={14} className="text-[#D7B05C]" />
							<span className="truncate">{member.email}</span>
						</div>
					</div>

					<div className="space-y-1">
						<span className="block text-[10px] font-bold uppercase tracking-wider text-[#E3C279]">
							Assigned Projects
						</span>
						<div className="flex items-center gap-2 p-2.5 rounded-xs border border-[#4A2C1D] bg-[#15100C] text-[#F8EEDB]">
							<Briefcase size={14} className="text-[#D7B05C]" />
							<span>{member.projectCount} Active Projects</span>
						</div>
					</div>

					<div className="space-y-1">
						<span className="block text-[10px] font-bold uppercase tracking-wider text-[#E3C279]">
							Last Active
						</span>
						<div className="flex items-center gap-2 p-2.5 rounded-xs border border-[#4A2C1D] bg-[#15100C] text-[#F8EEDB]">
							<Calendar size={14} className="text-[#D7B05C]" />
							<span>{member.lastActive}</span>
						</div>
					</div>
				</div>

				{/* Footer Actions */}
				<div className="pt-4 border-t border-[#4A2C1D] flex items-center justify-between gap-3">
					<button
						type="button"
						onClick={onClose}
						className="px-4 py-2 border border-[#8F6236]/60 bg-[#15100C] text-[#E3C279] hover:text-white text-xs font-sans font-bold uppercase rounded-xs transition-colors cursor-pointer"
					>
						Close
					</button>

					{onRemoveMember && (
						<button
							type="button"
							onClick={() => {
								if (
									confirm(
										`Are you sure you wish to discharge ${member.name} from the workspace?`,
									)
								) {
									onRemoveMember(member.id);
									onClose();
								}
							}}
							aria-label={`Discharge ${member.name}`}
							className="px-4 py-2 border border-rose-800 bg-rose-950/80 text-rose-200 hover:bg-rose-900 transition-colors font-sans text-xs font-bold uppercase rounded-xs flex items-center gap-1.5 cursor-pointer"
						>
							<Trash2 size={14} />
							<span>Remove Member</span>
						</button>
					)}
				</div>
			</div>
		</div>
	);
}
