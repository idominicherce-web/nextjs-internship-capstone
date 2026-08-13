"use client";

import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { Member } from "@/components/team/team-directory-table";

interface RemoveMemberModalProps {
	member: Member | null;
	isOpen: boolean;
	onClose: () => void;
	onConfirm: (member: Member) => Promise<void>;
}

export function RemoveMemberModal({
	member,
	isOpen,
	onClose,
	onConfirm,
}: RemoveMemberModalProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	// Lock background page scroll & escape key listener
	useEffect(() => {
		if (!isOpen) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape" && !isLoading) onClose();
		};

		document.body.style.overflow = "hidden";
		window.addEventListener("keydown", handleKeyDown);

		return () => {
			document.body.style.overflow = "";
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [isOpen, onClose, isLoading]);

	if (!isOpen || !member || !mounted) return null;

	const handleRemove = async () => {
		setIsLoading(true);
		try {
			await onConfirm(member);
		} finally {
			setIsLoading(false);
		}
	};

	return createPortal(
		<div
			role="dialog"
			aria-modal="true"
			aria-labelledby="remove-member-title"
			className="fixed inset-0 z-[99999] h-screen w-screen bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-hidden font-serif animate-in fade-in duration-150"
			onClick={(e) => {
				if (e.target === e.currentTarget && !isLoading) onClose();
			}}
		>
			<div className="w-full max-w-md max-h-[90vh] rounded-xs border-2 border-rose-900 bg-[#1A120C] p-5 sm:p-6 shadow-2xl flex flex-col justify-between space-y-4 text-[#F8EEDB] relative my-auto overflow-hidden">
				{/* Modal Header */}
				<div className="flex items-center justify-between border-b border-rose-900/60 pb-3 shrink-0">
					<div className="flex items-center gap-2 text-rose-400">
						<AlertTriangle size={20} />
						<h2
							id="remove-member-title"
							className="font-serif font-black text-base sm:text-lg uppercase tracking-wider"
						>
							Remove Member?
						</h2>
					</div>
					<button
						type="button"
						onClick={onClose}
						disabled={isLoading}
						aria-label="Close Remove Member Modal"
						className="p-1 text-rose-300 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
					>
						<X size={18} />
					</button>
				</div>

				{/* Scrollable Warning Notice */}
				<div className="space-y-3 font-sans text-xs overflow-y-auto pr-1 flex-1">
					<p className="text-[#F8EEDB] leading-relaxed">
						Are you sure you want to remove{" "}
						<strong className="text-[#D7B05C] font-bold">{member.name}</strong>{" "}
						(<span className="text-[#E3C279]">{member.email}</span>) from the
						workspace?
					</p>

					<div className="p-3 rounded-xs border border-rose-900/60 bg-rose-950/40 text-rose-200 text-[11px] leading-normal space-y-1">
						<p className="font-bold uppercase tracking-wider text-rose-300">
							Consequences of removal:
						</p>
						<ul className="list-disc list-inside space-y-0.5 text-rose-200/90">
							<li>Workspace access will be revoked immediately</li>
							<li>All active project assignments will be removed</li>
							<li>Created task history will remain archived</li>
						</ul>
					</div>
				</div>

				{/* Actions */}
				<div className="flex items-center justify-end gap-3 pt-3 border-t border-[#4A2C1D] shrink-0">
					<button
						type="button"
						onClick={onClose}
						disabled={isLoading}
						className="min-h-11 sm:min-h-0 px-4 py-2 border border-[#8F6236]/60 bg-[#15100C] text-[#E3C279] hover:text-white text-xs font-sans font-bold uppercase rounded-xs transition-colors cursor-pointer disabled:opacity-50"
					>
						Cancel
					</button>
					<button
						type="button"
						onClick={handleRemove}
						disabled={isLoading}
						className="min-h-11 sm:min-h-0 px-5 py-2 border border-rose-700 bg-rose-950 text-rose-200 hover:bg-rose-900 font-sans text-xs font-black uppercase tracking-wider rounded-xs transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2 shadow-md"
					>
						{isLoading ? (
							<Loader2 size={14} className="animate-spin text-rose-300" />
						) : (
							<Trash2 size={14} className="text-rose-300" />
						)}
						<span>{isLoading ? "Removing..." : "Remove Member"}</span>
					</button>
				</div>
			</div>
		</div>,
		document.body,
	);
}
