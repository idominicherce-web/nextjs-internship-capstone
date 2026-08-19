"use client";

import { AlertCircle, Loader2, Trash2, Users, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { removeUserFromProject } from "@/actions/project-members";

interface AssignedMember {
	id: string;
	name: string | null;
	email: string;
	role: string;
}

interface ProjectRosterModalProps {
	projectId: string;
	projectName: string;
	isOpen: boolean;
	initialMembers?: AssignedMember[];
	onClose: () => void;
}

export function ProjectRosterModal({
	projectId,
	projectName,
	isOpen,
	initialMembers = [],
	onClose,
}: ProjectRosterModalProps) {
	const [mounted, setMounted] = useState(false);
	const [members, setMembers] = useState<AssignedMember[]>(initialMembers);
	const [removingId, setRemovingId] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		setMembers(initialMembers);
	}, [initialMembers]);

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

	if (!isOpen || !mounted) return null;

	const handleRemove = async (userId: string) => {
		setRemovingId(userId);
		setError(null);
		try {
			const res = await removeUserFromProject(projectId, userId);
			if (res.success) {
				setMembers((prev) => prev.filter((m) => m.id !== userId));
			} else {
				setError(res.error || "Failed to remove officer from project.");
			}
		} catch (err) {
			console.error(err);
			setError("An unexpected error occurred.");
		} finally {
			setRemovingId(null);
		}
	};

	return createPortal(
		<div
			role="dialog"
			aria-modal="true"
			aria-labelledby="roster-modal-title"
			className="fixed inset-0 z-[99999] h-screen w-screen bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto font-serif animate-in fade-in duration-150"
			onClick={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}
		>
			<div className="w-full max-w-md rounded-xs border-2 border-[#8F6236] bg-[#1A120C] p-6 shadow-2xl space-y-5 relative my-auto text-[#F8EEDB]">
				{/* Modal Header */}
				<div className="flex items-center justify-between border-b border-[#4A2C1D] pb-3">
					<div className="flex items-center gap-2">
						<Users className="text-[#D7B05C]" size={20} />
						<h2
							id="roster-modal-title"
							className="font-serif font-black text-lg text-[#F8EEDB] uppercase tracking-wider"
						>
							Enlisted Officers
						</h2>
					</div>
					<button
						type="button"
						onClick={onClose}
						aria-label="Close modal"
						className="text-[#E3C279] hover:text-[#F8EEDB] transition-colors p-1 cursor-pointer"
					>
						<X size={18} />
					</button>
				</div>

				<div className="space-y-3">
					<div className="p-3 rounded-xs border border-[#4A2C1D] bg-[#15100C] space-y-0.5">
						<span className="block text-[10px] font-sans font-extrabold uppercase text-[#E3C279]">
							Campaign Dossier
						</span>
						<p className="text-sm font-bold text-[#F8EEDB]">{projectName}</p>
					</div>

					{error && (
						<div className="p-3 rounded-xs bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-center gap-2 font-sans">
							<AlertCircle size={16} className="text-rose-400 shrink-0" />
							<span>{error}</span>
						</div>
					)}

					<div className="max-h-60 overflow-y-auto border border-[#4A2C1D] bg-[#15100C] rounded-xs divide-y divide-[#4A2C1D]/60">
						{members.length === 0 ? (
							<div className="p-4 text-center text-xs italic text-[#E3C279]/70 font-sans">
								No assigned officers found in this quest roster.
							</div>
						) : (
							members.map((member) => (
								<div
									key={member.id}
									className="p-3 flex items-center justify-between gap-3 font-sans"
								>
									<div className="min-w-0 flex-1">
										<div className="text-xs font-bold text-[#F8EEDB] truncate">
											{member.name || member.email}
										</div>
										<div className="text-[10px] text-[#E3C279]/80 truncate">
											{member.email}
										</div>
										<span className="inline-block mt-1 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider bg-[#2D1B10] text-[#D7B05C] rounded-xs border border-[#8F6236]/50">
											{member.role}
										</span>
									</div>

									<button
										type="button"
										onClick={() => handleRemove(member.id)}
										disabled={removingId === member.id}
										aria-label={`Remove ${member.name || member.email} from project`}
										className="p-2 border border-rose-900/60 bg-rose-950/30 hover:bg-rose-900/80 text-rose-300 rounded-xs transition-colors cursor-pointer disabled:opacity-50 shrink-0"
									>
										{removingId === member.id ? (
											<Loader2
												size={14}
												className="animate-spin text-rose-300"
											/>
										) : (
											<Trash2 size={14} />
										)}
									</button>
								</div>
							))
						)}
					</div>
				</div>

				<div className="flex justify-end pt-3 border-t border-[#4A2C1D]">
					<button
						type="button"
						onClick={onClose}
						className="px-4 py-2 border border-[#8F6236]/60 bg-[#15100C] text-[#E3C279] hover:text-white text-xs font-sans font-bold uppercase rounded-xs transition-colors cursor-pointer"
					>
						Close
					</button>
				</div>
			</div>
		</div>,
		document.body,
	);
}
