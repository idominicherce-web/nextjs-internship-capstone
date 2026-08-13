"use client";

import { Clock, Mail, RefreshCw, XCircle } from "lucide-react";

export interface PendingInvite {
	id: string;
	email: string;
	role?: string;
	invitedAgo: string;
}

interface TeamPendingInvitationsProps {
	invitations: PendingInvite[];
	onResend: (id: string) => void;
	onCancel: (id: string) => void;
}

export function TeamPendingInvitations({
	invitations = [],
	onResend,
	onCancel,
}: TeamPendingInvitationsProps) {
	return (
		<div className="p-4 rounded-xs border-2 border-[#3B2415] bg-[#1A120C] shadow-2xl space-y-3 font-serif">
			<div className="flex items-center justify-between border-b border-[#4A2C1D] pb-2">
				<div className="flex items-center gap-2 text-[#D7B05C]">
					<Mail size={16} />
					<h3 className="font-serif font-black uppercase text-xs tracking-wider text-[#F8EEDB]">
						Pending Invites ({invitations.length})
					</h3>
				</div>
			</div>

			<div className="space-y-2.5 pt-1">
				{invitations.length === 0 ? (
					<div className="py-4 text-center text-xs italic text-[#E3C279]/60">
						No pending workspace invitations.
					</div>
				) : (
					invitations.map((inv) => (
						<div
							key={inv.id}
							className="p-2.5 rounded-xs border border-[#4A2C1D] bg-[#15100C] flex items-center justify-between text-xs font-sans"
						>
							<div className="space-y-0.5 min-w-0 pr-2">
								<p className="font-bold text-[#F8EEDB] truncate">{inv.email}</p>
								<div className="flex items-center gap-2 text-[10px] text-[#E3C279]">
									<span className="uppercase font-extrabold text-[#D7B05C]">
										{inv.role || "Member"}
									</span>
									<span>•</span>
									<span className="flex items-center gap-1 italic">
										<Clock size={10} /> {inv.invitedAgo}
									</span>
								</div>
							</div>

							<div className="flex items-center gap-1 shrink-0">
								<button
									type="button"
									onClick={() => onResend(inv.id)}
									title="Resend Invitation"
									className="p-1.5 text-[#E3C279] hover:text-[#F8EEDB] transition-colors cursor-pointer"
								>
									<RefreshCw size={14} />
								</button>
								<button
									type="button"
									onClick={() => onCancel(inv.id)}
									title="Revoke Invitation"
									className="p-1.5 text-rose-400 hover:text-rose-200 transition-colors cursor-pointer"
								>
									<XCircle size={14} />
								</button>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
}
