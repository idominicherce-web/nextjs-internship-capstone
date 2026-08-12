"use client";

import {
	AlertCircle,
	Calendar,
	CheckCircle2,
	Globe,
	Loader2,
	Monitor,
	Shield,
	User,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { updateUserProfile } from "@/actions/settings";

interface ProfileSettingsFormProps {
	user: {
		name?: string | null;
		email: string;
		role?: string | null;
		createdAt?: Date | string;
	};
}

export function ProfileSettingsForm({ user }: ProfileSettingsFormProps) {
	const [fullName, setFullName] = useState(user.name || "");
	const [email] = useState(user.email || "");
	const [role, setRole] = useState(user.role || "Project Manager");
	const [isSaved, setIsSaved] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const displayName = fullName || email.split("@")[0] || "Traveler";
	const initials = displayName
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setErrorMessage(null);

		try {
			const res = await updateUserProfile({
				name: fullName,
				role,
			});

			if (res.success) {
				setIsSaved(true);
				setTimeout(() => setIsSaved(false), 3000);
			} else {
				setErrorMessage(res.error || "Failed to update profile.");
			}
		} catch (error) {
			console.error(error);
			setErrorMessage("An unexpected error occurred. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="space-y-6">
			{/* Settings Card Frame */}
			<div className="rounded-xs border-2 border-[#3B2415] bg-[#1A120C] shadow-2xl p-6 sm:p-8 space-y-6">
				{/* Section Header */}
				<div className="border-b border-[#4A2C1D] pb-4 flex items-start justify-between gap-4">
					<div>
						<div className="flex items-center gap-2">
							<User size={18} className="text-[#D7B05C]" />
							<h2 className="font-serif font-black text-xl text-[#F8EEDB]">
								Profile Settings
							</h2>
						</div>
						<p className="text-xs font-sans text-[#E3C279] mt-1 italic">
							Update your personal information, contact email, and workspace
							role.
						</p>
					</div>

					<span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#E3C279] bg-[#15100C] border border-[#8F6236]/40 px-2.5 py-1 rounded-xs shrink-0">
						Royal Identity
					</span>
				</div>

				{/* User Summary Banner */}
				<div className="flex items-center gap-4 p-4 rounded-xs border border-[#8F6236]/50 bg-gradient-to-r from-[#2D1B10] via-[#1A120C] to-[#15100C]">
					<div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xs border-2 border-[#D7B05C] bg-[#15100C] text-[#D7B05C] font-black text-lg shadow-md">
						{initials}
					</div>
					<div className="min-w-0 flex-1 space-y-0.5">
						<h3 className="font-serif font-black text-[#F8EEDB] text-base truncate">
							{displayName}
						</h3>
						<div className="flex flex-wrap items-center gap-3 text-[11px] font-sans text-[#E3C279]">
							<span className="flex items-center gap-1">
								<Shield size={12} className="text-[#D7B05C]" /> {role}
							</span>
							<span className="text-[#8F6236]/40">•</span>
							<span className="flex items-center gap-1 italic text-[#E3C279]">
								<Calendar size={12} className="text-[#D7B05C]" />
								Member since{" "}
								{user.createdAt
									? new Date(user.createdAt).toLocaleDateString("en-US", {
											month: "short",
											year: "numeric",
										})
									: "Jan 2026"}
							</span>
						</div>
					</div>
				</div>

				{/* Form Body */}
				<form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
					{/* Full Name */}
					<div className="space-y-1.5">
						<label
							htmlFor="full-name-input"
							className="block text-xs font-sans font-extrabold uppercase tracking-wider text-[#D7B05C]"
						>
							Full Name
						</label>
						<input
							id="full-name-input"
							type="text"
							value={fullName}
							onChange={(e) => setFullName(e.target.value)}
							required
							aria-label="Full Name"
							className="w-full px-3.5 py-2.5 bg-[#FAF0D7] border border-[#8F6236] rounded-xs text-xs font-sans font-extrabold text-[#1A120C] placeholder-[#8F6236]/80 focus:outline-hidden focus:border-[#D7B05C] focus:ring-1 focus:ring-[#D7B05C] shadow-inner transition-colors"
						/>
					</div>

					{/* Email Address (Read-only) */}
					<div className="space-y-1.5">
						<label
							htmlFor="email-input"
							className="block text-xs font-sans font-extrabold uppercase tracking-wider text-[#D7B05C]"
						>
							Email Address
						</label>
						<input
							id="email-input"
							type="email"
							value={email}
							disabled
							aria-label="Email Address"
							className="w-full px-3.5 py-2.5 bg-[#15100C] border border-[#4A2C1D] rounded-xs text-xs font-sans font-bold text-[#E3C279]/60 cursor-not-allowed shadow-inner"
						/>
					</div>

					{/* Workspace Role */}
					<div className="space-y-1.5">
						<label
							htmlFor="role-select"
							className="block text-xs font-sans font-extrabold uppercase tracking-wider text-[#D7B05C]"
						>
							Workspace Role
						</label>
						<select
							id="role-select"
							value={role}
							onChange={(e) => setRole(e.target.value)}
							aria-label="Workspace Role"
							className="w-full px-3.5 py-2.5 bg-[#2D1B10] border border-[#8F6236] text-[#D7B05C] font-sans text-xs font-bold uppercase rounded-xs focus:outline-hidden focus:border-[#D7B05C] cursor-pointer shadow-md"
						>
							<option value="Workspace Owner">
								Workspace Owner (Royal Sovereign)
							</option>
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

					{/* Error Banner */}
					{errorMessage && (
						<div className="p-3 rounded-xs bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-center gap-2">
							<AlertCircle size={16} className="text-rose-400 shrink-0" />
							<span>{errorMessage}</span>
						</div>
					)}

					{/* Form Actions Footer Bar */}
					<div className="flex items-center justify-between pt-6 border-t border-[#4A2C1D]">
						{isSaved ? (
							<span className="inline-flex items-center gap-1.5 text-xs font-sans font-bold text-emerald-400">
								<CheckCircle2 size={16} /> Profile changes saved to database.
							</span>
						) : (
							<span className="text-[11px] font-serif italic text-[#E3C279]">
								Ensure all information are verified before updating records.
							</span>
						)}

						<div className="flex items-center gap-3">
							<button
								type="button"
								disabled={isLoading}
								onClick={() => {
									setFullName(user.name || "");
									setRole(user.role || "Project Manager");
									setErrorMessage(null);
								}}
								aria-label="Cancel Profile Edits"
								className="px-4 py-2 border border-[#8F6236]/60 bg-[#15100C] text-[#E3C279] hover:text-white hover:border-[#8F6236] text-xs font-sans font-bold uppercase rounded-xs transition-colors cursor-pointer disabled:opacity-50"
							>
								Cancel
							</button>

							<button
								type="submit"
								disabled={isLoading}
								aria-label="Save Profile Changes"
								className="px-5 py-2 border-2 border-[#D7B05C] bg-gradient-to-b from-[#5B3922] via-[#3B2415] to-[#1A120C] text-[#FFF5D6] font-sans text-xs font-black uppercase tracking-wider rounded-xs shadow-md hover:border-[#FFF5D6] transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
							>
								{isLoading && (
									<Loader2 size={14} className="animate-spin text-[#D7B05C]" />
								)}
								<span>{isLoading ? "Saving..." : "Save Changes"}</span>
							</button>
						</div>
					</div>
				</form>
			</div>

			{/* Session Status Card */}
			<div className="p-4 rounded-xs border-2 border-[#3B2415] bg-[#1A120C] shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
				<div className="flex items-center gap-3">
					<div className="p-2 rounded-full border border-emerald-700 bg-emerald-950 text-emerald-400 shrink-0">
						<CheckCircle2 size={16} />
					</div>
					<div>
						<div className="flex items-center gap-2">
							<h3 className="font-sans font-black text-xs uppercase tracking-wider text-[#F8EEDB]">
								Current Session
							</h3>
							<span className="px-1.5 py-0.2 text-[9px] font-sans font-black bg-emerald-950 text-emerald-300 rounded-xs border border-emerald-700 uppercase">
								Active
							</span>
						</div>
						<p className="text-[11px] font-serif italic text-[#E3C279] mt-0.5">
							Connected securely to High Command Chamber.
						</p>
					</div>
				</div>

				<div className="flex items-center gap-4 text-[11px] font-sans text-[#E3C279] border-t sm:border-t-0 border-[#4A2C1D] pt-2 sm:pt-0 w-full sm:w-auto">
					<span className="flex items-center gap-1">
						<Monitor size={12} className="text-[#D7B05C]" /> Active Client
					</span>
					<span className="text-[#8F6236]/40">•</span>
					<span className="flex items-center gap-1">
						<Globe size={12} className="text-[#D7B05C]" /> Active Now
					</span>
				</div>
			</div>
		</div>
	);
}
