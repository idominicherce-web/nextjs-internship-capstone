"use client";

import {
	CheckCircle2,
	Clock,
	Loader2,
	Mail,
	Shield,
	Trash2,
	UserCheck,
	UserPlus,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
	getWorkspaceInvitations,
	revokeInvitation,
} from "@/actions/invitations";
import { getUsers } from "@/actions/users";
import { DashboardSection } from "@/components/layout/dashboard-section";
import { useKanbanStore } from "@/stores/use-kanban-store";
import { useNotificationStore } from "@/stores/use-notification-store";

interface UserItem {
	id: string;
	name: string | null;
	email: string;
}

interface InvitationItem {
	id: string;
	email: string;
	role: string;
	status: string;
	createdAt: Date | string;
	invitedBy?: {
		name: string | null;
		email: string;
	} | null;
}

interface WorkspaceMembersListProps {
	projectId: string;
}

export function WorkspaceMembersList({ projectId }: WorkspaceMembersListProps) {
	const [members, setMembers] = useState<UserItem[]>([]);
	const [invitations, setInvitations] = useState<InvitationItem[]>([]);
	const [isFetching, setIsFetching] = useState(true);
	const [revokingId, setRevokingId] = useState<string | null>(null);

	const { openInviteMemberModal } = useKanbanStore();
	const addNotification = useNotificationStore(
		(state) => state.addNotification,
	);

	const fetchData = useCallback(async () => {
		setIsFetching(true);
		const [usersRes, invitesRes] = await Promise.all([
			getUsers(),
			getWorkspaceInvitations(),
		]);

		if (usersRes.success && usersRes.data) {
			setMembers(usersRes.data);
		}
		if (invitesRes.success && invitesRes.data) {
			setInvitations(invitesRes.data as InvitationItem[]);
		}
		setIsFetching(false);
	}, []);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const handleRevoke = async (invitationId: string, email: string) => {
		setRevokingId(invitationId);
		const res = await revokeInvitation(invitationId, projectId);
		setRevokingId(null);

		if (res.success) {
			setInvitations((prev) =>
				prev.map((inv) =>
					inv.id === invitationId ? { ...inv, status: "cancelled" } : inv,
				),
			);

			addNotification({
				title: "Invitation Revoked",
				description: `Cancelled dispatch for ${email}.`,
				type: "team",
			});
		}
	};

	const pendingInvitations = invitations.filter((i) => i.status === "pending");

	return (
		<DashboardSection className="space-y-6 font-serif">
			{/* Section Header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#4A2C1D] pb-4">
				<div>
					<div className="flex items-center gap-2 text-[#D7B05C]">
						<Shield size={20} />
						<h2 className="font-serif font-black uppercase text-lg tracking-widest text-[#F8EEDB]">
							Workspace Officers & Allies
						</h2>
					</div>
					<p className="text-xs font-sans text-[#D7B05C]/70 italic mt-1">
						Manage active workspace members and outstanding dispatch
						invitations.
					</p>
				</div>

				<button
					type="button"
					onClick={openInviteMemberModal}
					className="px-4 py-2 border-2 border-[#D7B05C] bg-gradient-to-b from-[#5B3922] via-[#3B2415] to-[#1A120C] text-[#FFF5D6] font-sans text-xs font-black uppercase tracking-wider rounded-xs shadow-md hover:border-[#FFF5D6] transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto shrink-0"
				>
					<UserPlus size={14} className="text-[#D7B05C]" />
					<span>Summon Ally</span>
				</button>
			</div>

			{isFetching ? (
				<div className="flex items-center justify-center py-12 text-xs font-sans text-[#D7B05C]/70 gap-2">
					<Loader2 size={16} className="animate-spin text-[#D7B05C]" />
					<span>Gathering officer rosters...</span>
				</div>
			) : (
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Active Members Card */}
					<div className="p-4 rounded-xs border-2 border-[#3B2415] bg-[#1A120C] shadow-xl space-y-4">
						<div className="flex items-center justify-between border-b border-[#4A2C1D] pb-2.5">
							<div className="flex items-center gap-2 text-[#D7B05C]">
								<UserCheck size={16} />
								<h3 className="font-serif font-black uppercase text-sm tracking-wider text-[#F8EEDB]">
									Active Officers ({members.length})
								</h3>
							</div>
							<span className="text-[10px] font-sans font-bold uppercase text-[#D7B05C]/60">
								Sworn Members
							</span>
						</div>

						<div className="space-y-2.5">
							{members.map((member) => (
								<div
									key={member.id}
									className="p-3 rounded-xs border border-[#4A2C1D] bg-[#15100C] flex items-center justify-between text-xs font-sans"
								>
									<div className="space-y-0.5">
										<p className="font-extrabold text-[#F8EEDB]">
											{member.name || "Officer"}
										</p>
										<p className="text-[11px] text-[#D7B05C]/70 flex items-center gap-1">
											<Mail size={11} />
											<span>{member.email}</span>
										</p>
									</div>
									<span className="px-2 py-0.5 text-[9px] font-bold uppercase bg-[#2D1B10] text-[#D7B05C] rounded-xs border border-[#8F6236]">
										Sworn
									</span>
								</div>
							))}
						</div>
					</div>

					{/* Pending Invitations Card */}
					<div className="p-4 rounded-xs border-2 border-[#3B2415] bg-[#1A120C] shadow-xl space-y-4">
						<div className="flex items-center justify-between border-b border-[#4A2C1D] pb-2.5">
							<div className="flex items-center gap-2 text-[#D7B05C]">
								<Clock size={16} />
								<h3 className="font-serif font-black uppercase text-sm tracking-wider text-[#F8EEDB]">
									Pending Decrees ({pendingInvitations.length})
								</h3>
							</div>
							<span className="text-[10px] font-sans font-bold uppercase text-[#D7B05C]/60">
								Awaiting Acceptance
							</span>
						</div>

						{pendingInvitations.length === 0 ? (
							<div className="p-6 border border-dashed border-[#8F6236]/40 bg-[#15100C]/60 text-center rounded-xs space-y-1">
								<CheckCircle2 size={24} className="mx-auto text-[#D7B05C]/40" />
								<p className="text-xs font-serif italic text-[#D7B05C]/70">
									No outstanding invitation dispatches.
								</p>
							</div>
						) : (
							<div className="space-y-2.5">
								{pendingInvitations.map((invite) => (
									<div
										key={invite.id}
										className="p-3 rounded-xs border border-[#8F6236]/60 bg-[#15100C] flex items-center justify-between gap-2 text-xs font-sans"
									>
										<div className="space-y-0.5 min-w-0">
											<p className="font-extrabold text-[#F8EEDB] truncate">
												{invite.email}
											</p>
											<div className="flex items-center gap-2 text-[10px] text-[#D7B05C]/70">
												<span className="px-1.5 py-0.2 bg-[#2D1B10] border border-[#8F6236] rounded-2xs text-[#D7B05C] font-bold">
													Role: {invite.role}
												</span>
												<span>
													Sent:{" "}
													{new Date(invite.createdAt).toLocaleDateString()}
												</span>
											</div>
										</div>

										<button
											type="button"
											onClick={() => handleRevoke(invite.id, invite.email)}
											disabled={revokingId === invite.id}
											className="px-2.5 py-1 border border-rose-800/80 bg-rose-950/40 text-rose-300 hover:text-white hover:bg-rose-900/60 rounded-xs text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50 shrink-0"
											title="Revoke Invitation"
										>
											{revokingId === invite.id ? (
												<Loader2 size={12} className="animate-spin" />
											) : (
												<Trash2 size={12} />
											)}
											<span>Revoke</span>
										</button>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			)}
		</DashboardSection>
	);
}
