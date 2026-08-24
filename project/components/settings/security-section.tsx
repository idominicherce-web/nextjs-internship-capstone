"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { LogOut, ShieldCheck, UserCheck } from "lucide-react";

export function SecuritySection() {
	const { openUserProfile, signOut } = useClerk();
	const { user } = useUser();

	// Check if user authenticated via external OAuth (e.g. Google)
	const isOAuth = (user?.externalAccounts?.length ?? 0) > 0;

	return (
		<div className="p-6 sm:p-8 rounded-xs border-2 border-[#3B2415] bg-[#1A120C] shadow-2xl space-y-6 font-serif text-[#F8EEDB]">
			<div className="border-b border-[#4A2C1D] pb-4">
				<div className="flex items-center gap-2 text-[#D7B05C] text-xs font-sans uppercase font-black tracking-widest mb-1">
					<ShieldCheck size={16} />
					<span>Castle Defenses</span>
				</div>
				<h3 className="font-black text-xl uppercase tracking-wider text-[#F8EEDB]">
					Security & Authentication
				</h3>
				<p className="text-xs font-sans text-[#E3C279]/80 mt-1 italic">
					Review account authentication protocols and manage active sessions.
				</p>
			</div>

			<div className="space-y-4 font-sans text-xs">
				{/* Consolidated Authentication Profile Card */}
				<div className="p-4 rounded-xs border border-[#4A2C1D] bg-[#15100C] flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#8F6236] transition-colors">
					<div className="flex items-start sm:items-center gap-3">
						<div className="p-2.5 rounded-full border border-[#8F6236] bg-[#2D1B10] text-[#D7B05C] shrink-0">
							<UserCheck size={18} />
						</div>
						<div>
							<div className="flex items-center gap-2 flex-wrap">
								<h4 className="font-bold text-sm text-[#F8EEDB]">
									Authentication Credentials
								</h4>
								<span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded-xs border border-emerald-600 bg-emerald-950/80 text-emerald-300">
									{isOAuth ? "OAuth Fortified" : "Active"}
								</span>
							</div>
							<p className="text-[#E3C279]/80 text-[11px] mt-0.5">
								{isOAuth
									? "Secured via OAuth provider. Manage credentials and connected accounts."
									: "Manage account passkeys, multi-factor defenses, and email credentials."}
							</p>
						</div>
					</div>
					<button
						type="button"
						onClick={() => openUserProfile()}
						className="px-4 py-2 rounded-xs border border-[#8F6236] bg-[#2D1B10] hover:bg-[#3B2415] text-[#D7B05C] font-bold text-xs transition-colors shrink-0 cursor-pointer text-center"
					>
						Manage Profile
					</button>
				</div>

				{/* Session Management */}
				<div className="p-4 rounded-xs border border-rose-900/40 bg-[#15100C] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<div className="flex items-start sm:items-center gap-3">
						<div className="p-2.5 rounded-full border border-rose-900/60 bg-rose-950/40 text-rose-400 shrink-0">
							<LogOut size={18} />
						</div>
						<div>
							<h4 className="font-bold text-sm text-[#F8EEDB]">
								Session Management
							</h4>
							<p className="text-[#E3C279]/80 text-[11px] mt-0.5">
								Disconnect active session and exit the High Command Chamber.
							</p>
						</div>
					</div>
					<button
						type="button"
						onClick={() => signOut()}
						className="px-4 py-2 rounded-xs border border-rose-800 bg-rose-950/80 hover:bg-rose-900 text-rose-200 font-bold text-xs transition-colors shrink-0 cursor-pointer text-center"
					>
						Sign Out
					</button>
				</div>
			</div>
		</div>
	);
}
