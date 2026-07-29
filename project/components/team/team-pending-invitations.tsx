"use client";

import { Mail, X } from "lucide-react";

export interface PendingInvite {
	id: string;
	email: string;
	invitedAgo: string;
}

interface TeamPendingInvitationsProps {
	invitations: PendingInvite[];
	onResend?: (id: string) => void;
	onCancel?: (id: string) => void;
}

export function TeamPendingInvitations({
	invitations,
	onResend,
	onCancel,
}: TeamPendingInvitationsProps) {
	return (
		<div className="p-4 rounded-xs border-2 border-[#3B2415] bg-[#1A120C] shadow-2xl space-y-3">
			<div className="flex items-center justify-between border-b border-[#4A2C1D] pb-2">
				<div className="flex items-center gap-2 text-[#D7B05C]">
					<Mail size={16} />
					<h3 className="font-serif font-black uppercase text-xs tracking-wider text-[#F8EEDB]">
						Pending Invitations
					</h3>
				</div>
				<span className="text-[9px] font-serif italic text-[#D7B05C]/60">
					Royal Summons
				</span>
			</div>

			{invitations.length === 0 ? (
				<p className="text-xs font-serif italic text-[#D7B05C]/60 py-2 text-center">
					No royal summons awaiting acceptance.
				</p>
			) : (
				<div className="space-y-2.5">
					{invitations.map((invite) => (
						<div
							key={invite.id}
							className="flex items-center justify-between p-2.5 bg-[#2D1B10]/60 border border-[#8F6236]/40 rounded-xs text-xs"
						>
							<div className="min-w-0 flex-1 pr-2">
								<p className="font-bold text-[#F8EEDB] truncate">
									{invite.email}
								</p>
								<span className="text-[10px] text-[#D7B05C]/60 italic font-serif">
									Invited {invite.invitedAgo}
								</span>
							</div>
							<div className="flex items-center gap-1.5 shrink-0">
								<button
									type="button"
									onClick={() => onResend?.(invite.id)}
									className="px-2 py-1 text-[10px] font-bold text-[#D7B05C] hover:text-white border border-[#8F6236] bg-[#15100C] rounded-xs transition-colors"
								>
									Resend
								</button>
								<button
									type="button"
									onClick={() => onCancel?.(invite.id)}
									className="p-1 text-[#D7B05C]/60 hover:text-rose-400 transition-colors"
									title="Cancel invite"
								>
									<X size={14} />
								</button>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
