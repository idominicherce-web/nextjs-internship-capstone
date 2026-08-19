"use client";

import { Compass, Loader2, Scroll, X } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { createPortal, useFormStatus } from "react-dom";
import { type ActionResponse, createProject } from "@/actions/projects";

interface CreateProjectModalProps {
	isOpen: boolean;
	onClose: () => void;
}

// Reusable submit button using React 19's useFormStatus
function SubmitButton() {
	const { pending } = useFormStatus();

	return (
		<button
			type="submit"
			disabled={pending}
			className="inline-flex items-center gap-2 px-6 py-2 border-2 border-[#D7B05C] bg-gradient-to-b from-[#5B3922] via-[#3B2415] to-[#1A120C] text-[#FFF5D6] font-sans text-xs font-black uppercase tracking-[0.15em] rounded-xs shadow-lg hover:border-[#FFF5D6] hover:shadow-[0_0_20px_rgba(215,176,92,0.4)] transition-all cursor-pointer disabled:opacity-50"
		>
			{pending ? (
				<Loader2 size={16} className="animate-spin text-[#D7B05C]" />
			) : (
				<Compass size={16} className="text-[#D7B05C]" />
			)}
			<span>{pending ? "Commissioning..." : "Create Project"}</span>
		</button>
	);
}

export function CreateProjectModal({
	isOpen,
	onClose,
}: CreateProjectModalProps) {
	const [mounted, setMounted] = useState(false);

	// React 19 useActionState hook for Server Action wiring
	const [state, formAction] = useActionState<ActionResponse, FormData>(
		createProject,
		{ success: false },
	);

	useEffect(() => {
		setMounted(true);
	}, []);

	// Lock body scroll & listen for Escape key
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

	// Automatically close modal when project creation succeeds
	useEffect(() => {
		if (state.success) {
			onClose();
		}
	}, [state.success, onClose]);

	if (!isOpen || !mounted) return null;

	return createPortal(
		<div
			role="dialog"
			aria-modal="true"
			aria-labelledby="create-project-title"
			className="fixed inset-0 min-h-[100dvh] w-screen z-[99999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150 font-serif"
			onClick={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}
		>
			<div className="relative w-full max-w-lg rounded-xs border-4 border-[#3B2415] bg-gradient-to-b from-[#2D1B10] via-[#1A120C] to-[#100A07] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.95)] overflow-hidden text-[#F8EEDB] font-serif my-auto">
				{/* Forged Brass Corner Brackets */}
				<div className="absolute left-1 top-1 w-4 h-4 border border-black bg-gradient-to-br from-[#FFE5A3] via-[#D7B05C] to-[#8F6236] rounded-xs shadow-md" />
				<div className="absolute right-1 top-1 w-4 h-4 border border-black bg-gradient-to-br from-[#FFE5A3] via-[#D7B05C] to-[#8F6236] rounded-xs shadow-md" />
				<div className="absolute bottom-1 left-1 w-4 h-4 border border-black bg-gradient-to-br from-[#FFE5A3] via-[#D7B05C] to-[#8F6236] rounded-xs shadow-md" />
				<div className="absolute bottom-1 right-1 w-4 h-4 border border-black bg-gradient-to-br from-[#FFE5A3] via-[#D7B05C] to-[#8F6236] rounded-xs shadow-md" />

				{/* Modal Header */}
				<div className="flex items-center justify-between border-b-2 border-[#4A2C1D] pb-4 mb-5">
					<div className="flex items-center space-x-3">
						<div className="p-2 rounded-xs border border-[#D7B05C] bg-[#15100C] text-[#D7B05C]">
							<Scroll size={22} />
						</div>
						<div>
							<div className="text-[9px] font-sans font-black uppercase tracking-[0.25em] text-[#D7B05C]">
								New Project •{" "}
								<span className="italic font-serif text-[#D7B05C]/70">
									Commission quest
								</span>
							</div>
							<h2
								id="create-project-title"
								className="text-xl font-black bg-gradient-to-b from-[#FFF5D6] via-[#D7B05C] to-[#B78B3E] bg-clip-text text-transparent uppercase tracking-wider"
							>
								Create Project
							</h2>
						</div>
					</div>

					<button
						type="button"
						onClick={onClose}
						aria-label="Close modal"
						className="p-1.5 text-[#D7B05C] hover:text-white transition-colors cursor-pointer"
					>
						<X size={20} />
					</button>
				</div>

				{/* React 19 Form Submission */}
				<form action={formAction} className="space-y-4">
					{/* Validation or Action Error Alert */}
					{state.error && (
						<div className="p-3 rounded-xs border border-rose-600 bg-rose-950/80 text-rose-300 text-xs font-sans font-bold">
							{state.error}
						</div>
					)}

					{/* Project Name Input */}
					<div className="space-y-1.5">
						<label className="block text-xs font-sans font-black uppercase tracking-wider text-[#D7B05C]">
							Project Name <span className="text-rose-400">*</span>
						</label>
						<input
							type="text"
							name="name"
							placeholder="e.g. Website Redesign"
							required
							className="w-full px-3.5 py-2.5 bg-[#FAF0D7] border-2 border-[#8F6236] rounded-xs text-xs font-sans font-extrabold text-[#1A120C] placeholder-[#8F6236]/70 focus:outline-none focus:border-[#D7B05C] shadow-inner"
							autoFocus
						/>
						{state.fieldErrors?.name && (
							<p className="text-[10px] font-sans font-bold text-rose-400 mt-1">
								{state.fieldErrors.name[0]}
							</p>
						)}
					</div>

					{/* Description Input */}
					<div className="space-y-1.5">
						<label className="block text-xs font-sans font-black uppercase tracking-wider text-[#D7B05C]">
							Description (Mission Brief)
						</label>
						<textarea
							name="description"
							placeholder="Describe project objectives and scope..."
							rows={3}
							className="w-full px-3.5 py-2.5 bg-[#FAF0D7] border-2 border-[#8F6236] rounded-xs text-xs font-sans font-extrabold text-[#1A120C] placeholder-[#8F6236]/70 focus:outline-none focus:border-[#D7B05C] shadow-inner resize-none"
						/>
					</div>

					{/* Actions */}
					<div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#4A2C1D]">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 border border-[#8F6236] bg-[#15100C] text-[#D7B05C] hover:text-white rounded-xs text-xs font-sans font-extrabold uppercase tracking-wider transition-colors cursor-pointer"
						>
							Cancel
						</button>

						{/* React 19 Pending State Submit Button */}
						<SubmitButton />
					</div>
				</form>
			</div>
		</div>,
		document.body,
	);
}
