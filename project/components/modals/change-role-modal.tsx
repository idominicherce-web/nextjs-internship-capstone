"use client";

import { AlertCircle, CheckCircle2, Loader2, UserCheck, X } from "lucide-react";
import { useEffect, useState } from "react";
import { updateMemberRoleAction } from "@/actions/team";
import type { Member } from "@/components/team/team-directory-table";

interface ChangeRoleModalProps {
	member: Member | null;
	isOpen: boolean;
	onClose: () => void;
	onRoleUpdated?: (userId: string, newRole: string) => void;
}

const WORKSPACE_ROLES = [
	{
		title: "Workspace Owner",
		subtext: "Royal Sovereign · Full workspace control",
	},
	{ title: "Administrator", subtext: "Chancellor · Administrative access" },
	{
		title: "Project Manager",
		subtext: "High Commander · Manages projects and teams",
	},
	{
		title: "Developer",
		subtext: "Royal Engineer · Builds and resolves objectives",
	},
	{
		title: "Designer",
		subtext: "Master Artisan · Crafts visuals and interfaces",
	},
	{
		title: "QA Engineer",
		subtext: "Royal Inquisitor · Verifies quality and tests",
	},
	{ title: "Member", subtext: "Knight · Creates and updates assigned work" },
];

export function ChangeRoleModal({
	member,
	isOpen,
	onClose,
	onRoleUpdated,
}: ChangeRoleModalProps) {
	const [selectedRole, setSelectedRole] = useState(
		member?.role || "Project Manager",
	);
	const [isLoading, setIsLoading] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Sync initial role when member changes
	useEffect(() => {
		if (member?.role) {
			setSelectedRole(member.role);
		}
	}, [member?.role]);

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

	if (!isOpen || !member) return null;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		try {
			// Pass arguments individually as expected by updateMemberRoleAction(targetUserId, newRoleInput)
			const res = await updateMemberRoleAction(member.id, selectedRole);

			if (res.success) {
				setIsSuccess(true);
				if (onRoleUpdated) onRoleUpdated(member.id, selectedRole);
				setTimeout(() => {
					setIsSuccess(false);
					onClose();
				}, 1000);
			} else {
				setError(res.error || "Failed to update workspace role.");
			}
		} catch (err) {
			console.error(err);
			setError("An unexpected error occurred.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div
			role="dialog"
			aria-modal="true"
			className="fixed inset-0 z-[99999] h-screen w-screen bg-black/90 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-hidden font-serif animate-in fade-in duration-150"
			onClick={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}
		>
			<div className="w-full max-w-md max-h-[90vh] rounded-xs border-2 border-[#8F6236] bg-[#1A120C] p-5 sm:p-6 shadow-2xl flex flex-col justify-between space-y-4 text-[#F8EEDB] relative my-auto overflow-hidden">
				<div className="flex items-center justify-between border-b border-[#4A2C1D] pb-3 shrink-0">
					<div className="flex items-center gap-2">
						<UserCheck size={20} className="text-[#D7B05C]" />
						<h2 className="font-serif font-black text-base sm:text-lg text-[#F8EEDB] uppercase tracking-wider">
							Change Member Role
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

				<form
					onSubmit={handleSubmit}
					className="space-y-4 overflow-y-auto pr-1 flex-1"
				>
					<div className="p-3 rounded-xs border border-[#4A2C1D] bg-[#15100C] space-y-1">
						<span className="block text-[10px] font-sans font-extrabold uppercase text-[#E3C279]">
							Selected Member
						</span>
						<p className="text-sm font-bold text-[#F8EEDB]">{member.name}</p>
						<p className="text-xs text-[#E3C279] font-sans">{member.email}</p>
					</div>

					<div className="space-y-1.5 font-sans">
						<label
							htmlFor="select-workspace-role"
							className="block text-xs font-extrabold uppercase tracking-wider text-[#D7B05C]"
						>
							New Workspace Role
						</label>
						<select
							id="select-workspace-role"
							value={selectedRole}
							onChange={(e) => setSelectedRole(e.target.value)}
							aria-label="New Workspace Role"
							className="w-full px-3.5 py-2.5 bg-[#2D1B10] border border-[#8F6236] text-[#D7B05C] font-sans text-xs font-bold rounded-xs focus:outline-hidden focus:border-[#D7B05C] cursor-pointer"
						>
							{WORKSPACE_ROLES.map((r) => (
								<option key={r.title} value={r.title}>
									{r.title} ({r.subtext})
								</option>
							))}
						</select>
					</div>

					{isSuccess && (
						<div className="p-3 rounded-xs bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs flex items-center gap-2 font-sans">
							<CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
							<span>Workspace role successfully updated!</span>
						</div>
					)}

					{error && (
						<div className="p-3 rounded-xs bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-center gap-2 font-sans">
							<AlertCircle size={16} className="text-rose-400 shrink-0" />
							<span>{error}</span>
						</div>
					)}

					<div className="flex items-center justify-end gap-3 pt-3 border-t border-[#4A2C1D] shrink-0">
						<button
							type="button"
							onClick={onClose}
							disabled={isLoading}
							className="px-4 py-2 border border-[#8F6236]/60 bg-[#15100C] text-[#E3C279] hover:text-white text-xs font-sans font-bold uppercase rounded-xs transition-colors disabled:opacity-50 cursor-pointer"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isLoading || isSuccess}
							className="px-5 py-2 border-2 border-[#D7B05C] bg-gradient-to-b from-[#5B3922] via-[#3B2415] to-[#1A120C] text-[#FFF5D6] font-sans text-xs font-black uppercase tracking-wider rounded-xs shadow-md hover:border-[#FFF5D6] transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
						>
							{isLoading && (
								<Loader2 size={14} className="animate-spin text-[#D7B05C]" />
							)}
							<span>{isLoading ? "Saving..." : "Save Role"}</span>
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
