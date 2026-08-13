"use client";

import { AlertCircle, CheckCircle2, Loader2, UserPlus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { inviteWorkspaceMember } from "@/actions/invitations";
import { useNotificationStore } from "@/stores/use-notification-store";

interface InviteMemberModalProps {
	projectId?: string;
	projectName?: string;
	isOpen: boolean;
	onClose: () => void;
}

export function InviteMemberModal({
	projectId = "global",
	projectName,
	isOpen,
	onClose,
}: InviteMemberModalProps) {
	const [email, setEmail] = useState("");
	const [role, setRole] = useState<"Viewer" | "Member" | "Admin">("Member");
	const [isLoading, setIsLoading] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const addNotification = useNotificationStore(
		(state) => state.addNotification,
	);

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}

		return () => {
			document.body.style.overflow = "";
		};
	}, [isOpen]);

	if (!isOpen) return null;

	const isProjectContext = projectId !== "global";

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email.trim() || isLoading) return;

		setIsLoading(true);
		setError(null);

		try {
			const res = await inviteWorkspaceMember(projectId, email.trim(), role);

			if (res.success) {
				setIsSuccess(true);
				addNotification({
					title: isProjectContext
						? "Project Invite Sent"
						: "Workspace Invitation Dispatched",
					description: `Invitation dispatched to ${email.trim()} with ${role} permissions.`,
					type: "team",
				});

				setTimeout(() => {
					setEmail("");
					setIsSuccess(false);
					onClose();
				}, 1000);
			} else {
				setError(res.error || "Failed to send invitation.");
			}
		} catch (err) {
			console.error(err);
			setError("An unexpected error occurred while sending invitation.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div
			role="dialog"
			aria-modal="true"
			className="fixed inset-0 z-[100] h-screen w-screen bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150 font-serif"
			onClick={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}
		>
			<div className="w-full max-w-md rounded-xs border-2 border-[#8F6236] bg-[#1A120C] p-6 shadow-2xl space-y-5 relative my-auto text-[#F8EEDB]">
				<div className="flex items-center justify-between border-b border-[#4A2C1D] pb-3">
					<div className="flex items-center gap-2">
						<UserPlus size={20} className="text-[#D7B05C]" />
						<h2 className="font-serif font-black text-lg text-[#F8EEDB] uppercase tracking-wider">
							{isProjectContext ? "Invite to Project" : "Invite Member"}
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

				<form onSubmit={handleSubmit} className="space-y-4">
					{isProjectContext && projectName && (
						<div className="p-3 rounded-xs border border-[#4A2C1D] bg-[#15100C] space-y-1">
							<span className="block text-[10px] font-sans font-extrabold uppercase text-[#E3C279]">
								Target Project
							</span>
							<p className="text-sm font-bold text-[#F8EEDB]">{projectName}</p>
						</div>
					)}

					<div className="space-y-1.5 font-sans">
						<label className="block text-xs font-extrabold uppercase tracking-wider text-[#D7B05C]">
							Email Address
						</label>
						<input
							type="email"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="colleague@company.com"
							className="w-full px-3.5 py-2.5 bg-[#FAF0D7] border border-[#8F6236] text-[#1A120C] text-xs font-bold placeholder-[#8F6236]/70 rounded-xs focus:outline-hidden focus:border-[#D7B05C]"
						/>
					</div>

					<div className="space-y-1.5 font-sans">
						<label className="block text-xs font-extrabold uppercase tracking-wider text-[#D7B05C]">
							Workspace Role
						</label>
						<select
							value={role}
							onChange={(e) => setRole(e.target.value as "Member" | "Admin")}
							aria-label="Select Workspace Role"
							className="w-full px-3.5 py-2.5 bg-[#2D1B10] border border-[#8F6236] text-[#D7B05C] text-xs font-bold uppercase rounded-xs focus:outline-none focus:border-[#D7B05C] cursor-pointer"
						>
							<option value="Member">Member (Standard workspace access)</option>
							<option value="Admin">Admin (Full workspace control)</option>
						</select>
					</div>

					{isSuccess && (
						<div className="p-3 rounded-xs bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs flex items-center gap-2 font-sans">
							<CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
							<span>Invitation successfully dispatched!</span>
						</div>
					)}

					{error && (
						<div className="p-3 rounded-xs bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-center gap-2 font-sans">
							<AlertCircle size={16} className="text-rose-400 shrink-0" />
							<span>{error}</span>
						</div>
					)}

					<div className="flex items-center justify-end gap-3 pt-3 border-t border-[#4A2C1D]">
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
							{isLoading ? (
								<Loader2 size={14} className="animate-spin text-[#D7B05C]" />
							) : (
								<UserPlus size={14} className="text-[#D7B05C]" />
							)}
							<span>{isLoading ? "Sending..." : "Send Invitation"}</span>
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
