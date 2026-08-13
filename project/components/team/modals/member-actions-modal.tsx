"use client";

import {
	Briefcase,
	Eye,
	Shield,
	Trash2,
	UserCheck,
	UserPlus,
	X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { Member } from "@/components/team/team-directory-table";

interface MemberActionsModalProps {
	member: Member | null;
	isOpen: boolean;
	onClose: () => void;
	onViewMember: (member: Member) => void;
	onAssignProject: (member: Member) => void;
	onChangeRole: (member: Member) => void;
	onRemoveMember: (member: Member) => void;
}

const ROLE_SUBTITLE_MAP: Record<string, string> = {
	"Workspace Owner": "Royal Sovereign · Full workspace control",
	Administrator: "Chancellor · Administrative access",
	"Project Manager": "High Commander · Manages projects and teams",
	Developer: "Royal Engineer · Builds and resolves objectives",
	Designer: "Master Artisan · Crafts visuals and interfaces",
	"QA Engineer": "Royal Inquisitor · Verifies quality and tests",
	Member: "Knight · Creates and updates assigned work",
};

export function MemberActionsModal({
	member,
	isOpen,
	onClose,
	onViewMember,
	onAssignProject,
	onChangeRole,
	onRemoveMember,
}: MemberActionsModalProps) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	// Lock background page scroll & escape key listener
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

	if (!isOpen || !member || !mounted) return null;

	const roleSubtitle =
		ROLE_SUBTITLE_MAP[member.role] || "Council Member · Workspace contributor";

	return createPortal(
		<div
			role="dialog"
			aria-modal="true"
			aria-labelledby="member-actions-title"
			className="fixed inset-0 z-[99999] h-screen w-screen bg-black/90 backdrop-blur-md flex items-center justify-center p-3 font-serif animate-in fade-in duration-150"
			onClick={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}
		>
			<div className="w-full max-w-md rounded-xs border-2 border-[#8F6236] bg-[#1A120C] p-3.5 sm:p-5 shadow-2xl space-y-3 text-[#F8EEDB] relative my-auto">
				{/* Modal Header */}
				<div className="flex items-center justify-between border-b border-[#4A2C1D] pb-2 shrink-0">
					<div className="flex items-center gap-2">
						<Shield size={18} className="text-[#D7B05C]" />
						<h2
							id="member-actions-title"
							className="font-serif font-black text-sm sm:text-base text-[#F8EEDB] uppercase tracking-wider"
						>
							Member Actions
						</h2>
					</div>
					<button
						type="button"
						onClick={onClose}
						aria-label="Close Member Actions"
						className="p-1 text-[#E3C279] hover:text-[#F8EEDB] transition-colors cursor-pointer"
					>
						<X size={16} />
					</button>
				</div>

				{/* Selected Member Dossier Summary */}
				<div className="p-2.5 rounded-xs border border-[#4A2C1D] bg-[#15100C] space-y-2 font-sans">
					<div className="flex items-center gap-2.5">
						<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xs border-2 border-[#D7B05C] bg-[#2D1B10] font-serif font-black text-xs text-[#D7B05C] shadow-md">
							{member.avatar}
						</div>
						<div className="min-w-0 flex-1">
							<h3 className="font-serif font-bold text-xs sm:text-sm text-[#F8EEDB] truncate">
								{member.name}
							</h3>
							<p className="text-[10px] text-[#E3C279] truncate">
								{member.email}
							</p>
						</div>
					</div>

					<div className="pt-1.5 border-t border-[#4A2C1D]/60 flex items-center justify-between gap-1 text-[11px]">
						<div className="min-w-0 flex-1">
							<span className="block font-black uppercase text-[#D7B05C] truncate text-[10px]">
								{member.role}
							</span>
							<span className="block text-[9px] font-serif italic text-[#E3C279] truncate">
								{roleSubtitle}
							</span>
						</div>

						<div className="flex items-center gap-2 shrink-0">
							<span className="flex items-center gap-1 text-[10px] font-bold text-[#F8EEDB]">
								<Briefcase size={11} className="text-[#D7B05C]" />
								{member.projectCount} Proj
							</span>
							<span
								className={`inline-block px-1.5 py-0.5 rounded-xs text-[8px] font-bold uppercase border ${
									member.status === "Online"
										? "border-emerald-800 bg-emerald-950 text-emerald-300"
										: member.status === "Away"
											? "border-amber-800 bg-amber-950 text-amber-300"
											: "border-[#8F6236]/40 bg-[#15100C] text-[#E3C279]"
								}`}
							>
								● {member.status}
							</span>
						</div>
					</div>
				</div>

				{/* Compact Actions List */}
				<div className="space-y-1.5 font-sans">
					<button
						type="button"
						onClick={() => onViewMember(member)}
						aria-label={`View details for ${member.name}`}
						className="w-full p-2 rounded-xs border border-[#8F6236] bg-[#2D1B10] text-[#D7B05C] hover:text-white hover:border-[#D7B05C] transition-colors text-xs font-extrabold uppercase tracking-wider cursor-pointer text-left shadow-sm flex items-center gap-2.5"
					>
						<Eye size={15} className="text-[#D7B05C] shrink-0" />
						<div className="flex flex-col min-w-0">
							<span className="leading-tight">View Member</span>
							<span className="text-[9px] font-serif italic text-[#E3C279] normal-case tracking-normal truncate">
								Inspect activity history & assignments
							</span>
						</div>
					</button>

					<button
						type="button"
						onClick={() => onAssignProject(member)}
						aria-label={`Assign ${member.name} to a project`}
						className="w-full p-2 rounded-xs border border-[#8F6236] bg-[#2D1B10] text-[#D7B05C] hover:text-white hover:border-[#D7B05C] transition-colors text-xs font-extrabold uppercase tracking-wider cursor-pointer text-left shadow-sm flex items-center gap-2.5"
					>
						<UserPlus size={15} className="text-[#D7B05C] shrink-0" />
						<div className="flex flex-col min-w-0">
							<span className="leading-tight">Assign to Project</span>
							<span className="text-[9px] font-serif italic text-[#E3C279] normal-case tracking-normal truncate">
								Deploy member & set project role
							</span>
						</div>
					</button>

					<button
						type="button"
						onClick={() => onChangeRole(member)}
						aria-label={`Change workspace role for ${member.name}`}
						className="w-full p-2 rounded-xs border border-[#8F6236] bg-[#2D1B10] text-[#D7B05C] hover:text-white hover:border-[#D7B05C] transition-colors text-xs font-extrabold uppercase tracking-wider cursor-pointer text-left shadow-sm flex items-center gap-2.5"
					>
						<UserCheck size={15} className="text-[#D7B05C] shrink-0" />
						<div className="flex flex-col min-w-0">
							<span className="leading-tight">Change Workspace Role</span>
							<span className="text-[9px] font-serif italic text-[#E3C279] normal-case tracking-normal truncate">
								Update workspace permissions
							</span>
						</div>
					</button>

					<div className="pt-1 border-t border-[#4A2C1D]">
						<button
							type="button"
							onClick={() => onRemoveMember(member)}
							aria-label={`Remove ${member.name} from workspace`}
							className="w-full p-2 rounded-xs border border-rose-900 bg-rose-950/80 text-rose-200 hover:bg-rose-900 transition-colors text-xs font-extrabold uppercase tracking-wider cursor-pointer text-left shadow-sm flex items-center gap-2.5"
						>
							<Trash2 size={15} className="text-rose-400 shrink-0" />
							<div className="flex flex-col min-w-0">
								<span className="leading-tight">Remove Member</span>
								<span className="text-[9px] font-serif italic text-rose-300 normal-case tracking-normal truncate">
									Discharge member & revoke access
								</span>
							</div>
						</button>
					</div>
				</div>

				{/* Close Footer */}
				<div className="pt-1.5 border-t border-[#4A2C1D] text-right shrink-0">
					<button
						type="button"
						onClick={onClose}
						className="px-4 py-1.5 border border-[#8F6236]/60 bg-[#15100C] text-[#E3C279] hover:text-white text-xs font-sans font-bold uppercase rounded-xs transition-colors cursor-pointer"
					>
						Close
					</button>
				</div>
			</div>
		</div>,
		document.body,
	);
}
