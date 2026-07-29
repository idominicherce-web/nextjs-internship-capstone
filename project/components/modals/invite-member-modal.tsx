"use client";

import { AlertCircle, CheckCircle2, Loader2, UserPlus, X } from "lucide-react";
import { useState } from "react";
import { sendWorkspaceInvite } from "@/actions/users";

interface InviteMemberModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export function InviteMemberModal({ isOpen, onClose }: InviteMemberModalProps) {
	const [email, setEmail] = useState("");
	const [role, setRole] = useState("Project Manager");
	const [isLoading, setIsLoading] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [error, setError] = useState<string | null>(null);

	if (!isOpen) return null;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		try {
			const res = await sendWorkspaceInvite(email, role);
			if (res.success) {
				setIsSuccess(true);
				setTimeout(() => {
					setIsSuccess(false);
					setEmail("");
					onClose();
				}, 1500);
			} else {
				setError(res.error || "Failed to dispatch invitation.");
			}
		} catch (err) {
			console.error(err);
			setError("An unexpected error occurred.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in duration-200">
			<div className="w-full max-w-md rounded-xs border-2 border-[#8F6236] bg-[#1A120C] p-6 shadow-2xl space-y-5">
				{/* Header */}
				<div className="flex items-center justify-between border-b border-[#4A2C1D] pb-3">
					<div className="flex items-center gap-2">
						<UserPlus className="text-[#D7B05C]" size={20} />
						<h3 className="font-serif font-black text-lg text-[#F8EEDB] uppercase tracking-wider">
							Summon Ally
						</h3>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="text-[#D7B05C]/60 hover:text-[#F8EEDB] transition-colors p-1"
					>
						<X size={18} />
					</button>
				</div>

				{/* Body Form */}
				<form onSubmit={handleSubmit} className="space-y-4">
					<p className="text-xs font-serif italic text-[#D7B05C]/80">
						Dispatch a royal decree to invite a new officer to your workspace
						realm.
					</p>

					{/* Email Field */}
					<div className="space-y-1.5">
						<label className="block text-xs font-sans font-extrabold uppercase tracking-wider text-[#D7B05C]">
							Officer Email Address
						</label>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="e.g. chancellor@realm.com"
							required
							className="w-full px-3.5 py-2.5 bg-[#FAF0D7] border border-[#8F6236] rounded-xs text-xs font-sans font-extrabold text-[#1A120C] placeholder-[#8F6236]/80 focus:outline-none focus:border-[#D7B05C] focus:ring-1 focus:ring-[#D7B05C] shadow-inner"
						/>
					</div>

					{/* Role Field */}
					<div className="space-y-1.5">
						<label className="block text-xs font-sans font-extrabold uppercase tracking-wider text-[#D7B05C]">
							Designated Office Role
						</label>
						<select
							value={role}
							onChange={(e) => setRole(e.target.value)}
							className="w-full px-3.5 py-2.5 bg-[#2D1B10] border border-[#8F6236] text-[#D7B05C] font-sans text-xs font-bold uppercase rounded-xs focus:outline-none focus:border-[#D7B05C] cursor-pointer"
						>
							<option value="Administrator">Administrator (Chancellor)</option>
							<option value="Project Manager">
								Project Manager (High Commander)
							</option>
							<option value="Developer">Developer (Royal Engineer)</option>
							<option value="Designer">Designer (Master Artisan)</option>
							<option value="QA Engineer">
								QA Engineer (Royal Inquisitor)
							</option>
						</select>
					</div>

					{/* Success / Error Display */}
					{isSuccess && (
						<div className="p-3 rounded-xs bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs flex items-center gap-2">
							<CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
							<span>Invitation decree successfully dispatched!</span>
						</div>
					)}

					{error && (
						<div className="p-3 rounded-xs bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-center gap-2">
							<AlertCircle size={16} className="text-rose-400 shrink-0" />
							<span>{error}</span>
						</div>
					)}

					{/* Action Buttons */}
					<div className="flex items-center justify-end gap-3 pt-3 border-t border-[#4A2C1D]">
						<button
							type="button"
							onClick={onClose}
							disabled={isLoading}
							className="px-4 py-2 border border-[#8F6236]/60 bg-[#15100C] text-[#D7B05C]/80 hover:text-white text-xs font-sans font-bold uppercase rounded-xs transition-colors disabled:opacity-50"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isLoading || isSuccess}
							className="px-5 py-2 border-2 border-[#D7B05C] bg-gradient-to-b from-[#5B3922] via-[#3B2415] to-[#1A120C] text-[#FFF5D6] font-sans text-xs font-black uppercase tracking-wider rounded-xs shadow-md hover:border-[#FFF5D6] transition-all disabled:opacity-50 flex items-center gap-2"
						>
							{isLoading && (
								<Loader2 size={14} className="animate-spin text-[#D7B05C]" />
							)}
							<span>{isLoading ? "Dispatching..." : "Send Decree"}</span>
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
