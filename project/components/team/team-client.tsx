"use client";

import { useEffect, useMemo, useState } from "react";
import { revokeInvitation } from "@/actions/invitations";
import { removeMemberAction } from "@/actions/team";
import { DashboardLayoutContainer } from "@/components/layout/dashboard-layout-container";
import { InviteMemberModal } from "@/components/modals/invite-member-modal";
import {
	MemberActionSheet,
	type MemberView,
} from "@/components/team/sheet/member-action-sheet";
import {
	type ActivityItem,
	TeamActivityChronicle,
} from "@/components/team/team-activity-chronicle";
import {
	type Member,
	TeamDirectoryTable,
} from "@/components/team/team-directory-table";
import { TeamHeader } from "@/components/team/team-header";
import {
	type PendingInvite,
	TeamPendingInvitations,
} from "@/components/team/team-pending-invitations";
import { TeamSearch } from "@/components/team/team-search";
import { TeamStats } from "@/components/team/team-stats";
import { useNotificationStore } from "@/stores/use-notification-store";

interface TeamClientProps {
	initialMembers: Member[];
	activities: ActivityItem[];
	pendingInvitations: PendingInvite[];
}

export function TeamClient({
	initialMembers: rawMembers,
	activities: initialActivities = [],
	pendingInvitations: initialPendingInvitations,
}: TeamClientProps) {
	const [members, setMembers] = useState<Member[]>(rawMembers);
	const [activityList, setActivityList] =
		useState<ActivityItem[]>(initialActivities);

	const [selectedMember, setSelectedMember] = useState<Member | null>(null);
	const [sheetOpen, setSheetOpen] = useState(false);
	const [sheetView, setSheetView] = useState<MemberView>("actions");
	const [inviteModalOpen, setInviteModalOpen] = useState(false);

	const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>(
		initialPendingInvitations,
	);

	const [searchQuery, setSearchQuery] = useState("");
	const [selectedRole, setSelectedRole] = useState("all");
	const [selectedStatus, setSelectedStatus] = useState("all");

	const addNotification = useNotificationStore(
		(state) => state.addNotification,
	);

	useEffect(() => {
		if (sheetOpen || inviteModalOpen) {
			document.body.style.overflow = "hidden";
			document.body.style.touchAction = "none";
		} else {
			document.body.style.overflow = "";
			document.body.style.touchAction = "";
		}

		return () => {
			document.body.style.overflow = "";
			document.body.style.touchAction = "";
		};
	}, [sheetOpen, inviteModalOpen]);

	const handleOpenMemberSheet = (
		member: Member,
		initialView: MemberView = "actions",
	) => {
		setSelectedMember(member);
		setSheetView(initialView);
		setSheetOpen(true);
	};

	const handleCloseMemberSheet = () => {
		setSheetOpen(false);
		setSelectedMember(null);
	};

	const appendActivity = (
		user: string,
		action: string,
		type: ActivityItem["type"] = "general",
	) => {
		const newActivity: ActivityItem = {
			id: crypto.randomUUID(),
			user,
			action,
			timeAgo: "Just now",
			type,
		};
		setActivityList((prev) => [newActivity, ...prev]);
	};

	const filteredMembers = useMemo(() => {
		return members.filter((m) => {
			const matchesQuery =
				m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
				m.role.toLowerCase().includes(searchQuery.toLowerCase());

			const matchesRole =
				selectedRole === "all" ||
				m.role.toLowerCase() === selectedRole.toLowerCase();

			const matchesStatus =
				selectedStatus === "all" ||
				m.status.toLowerCase() === selectedStatus.toLowerCase();

			return matchesQuery && matchesRole && matchesStatus;
		});
	}, [members, searchQuery, selectedRole, selectedStatus]);

	const handleResetFilters = () => {
		setSearchQuery("");
		setSelectedRole("all");
		setSelectedStatus("all");
	};

	const handleConfirmRemoveMember = async (member: Member) => {
		const res = await removeMemberAction(member.id);

		if (res.success) {
			setMembers((prev) => prev.filter((m) => m.id !== member.id));
			appendActivity(member.name, "was discharged from workspace", "revoke");
			handleCloseMemberSheet();
			addNotification({
				title: "Officer Discharged",
				description: "Member removed from workspace.",
				type: "team",
			});
		}
	};

	const handleResendInvite = (invitationId: string) => {
		const targetInvite = pendingInvites.find((i) => i.id === invitationId);
		if (targetInvite) {
			appendActivity(
				"Admin",
				`resent invitation dispatch to ${targetInvite.email}`,
				"invite",
			);
			addNotification({
				title: "Invitation Resent",
				description: `Dispatch resent to ${targetInvite.email}.`,
				type: "team",
			});
		}
	};

	const handleCancelInvite = async (invitationId: string) => {
		const targetInvite = pendingInvites.find((i) => i.id === invitationId);
		const res = await revokeInvitation(invitationId, "global");

		if (res.success) {
			setPendingInvites((prev) => prev.filter((i) => i.id !== invitationId));
			if (targetInvite) {
				appendActivity(
					"Admin",
					`revoked invitation summons for ${targetInvite.email}`,
					"revoke",
				);
				addNotification({
					title: "Decree Revoked",
					description: `Invitation for ${targetInvite.email} has been cancelled.`,
					type: "team",
				});
			}
		}
	};

	return (
		<DashboardLayoutContainer>
			<div className="space-y-6 sm:space-y-8 min-w-0">
				{/* Header */}
				<TeamHeader onInviteClick={() => setInviteModalOpen(true)} />

				{/* Summary Stats Row */}
				<TeamStats
					totalMembers={members.length}
					activeThisWeek={members.filter((m) => m.status !== "Offline").length}
					totalProjectAssignments={members.reduce(
						(acc, m) => acc + m.projectCount,
						0,
					)}
					pendingInvitationsCount={pendingInvites.length}
				/>

				{/* Full-Width Member Directory Table */}
				<div className="space-y-4 min-w-0 w-full">
					<TeamSearch
						searchQuery={searchQuery}
						onSearchChange={setSearchQuery}
						selectedRole={selectedRole}
						onRoleChange={setSelectedRole}
						selectedStatus={selectedStatus}
						onStatusChange={setSelectedStatus}
						onReset={handleResetFilters}
					/>

					<TeamDirectoryTable
						members={filteredMembers}
						onOpenActions={(m) => handleOpenMemberSheet(m, "actions")}
					/>
				</div>

				{/* Bottom Grid for Pending Invites & Activity Chronicle */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-w-0 pt-2 border-t border-[#4A2C1D]/60">
					<TeamPendingInvitations
						invitations={pendingInvites}
						onResend={handleResendInvite}
						onCancel={handleCancelInvite}
					/>
					<TeamActivityChronicle activities={activityList} />
				</div>
			</div>

			{/* Persistent Member Action Container Sheet */}
			<MemberActionSheet
				member={selectedMember}
				isOpen={sheetOpen}
				initialView={sheetView}
				onClose={handleCloseMemberSheet}
				onConfirmRemove={handleConfirmRemoveMember}
				onRoleUpdated={(userId, newRole) => {
					setMembers((prev) =>
						prev.map((m) => (m.id === userId ? { ...m, role: newRole } : m)),
					);
					if (selectedMember) {
						appendActivity(
							selectedMember.name,
							`workspace role updated to ${newRole}`,
							"general",
						);
					}
				}}
			/>

			{/* Invite Member Modal */}
			<InviteMemberModal
				isOpen={inviteModalOpen}
				onClose={() => setInviteModalOpen(false)}
			/>
		</DashboardLayoutContainer>
	);
}
