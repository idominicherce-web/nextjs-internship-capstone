"use client";

import { useMemo, useState } from "react";
import { revokeInvitation } from "@/actions/invitations";
import { removeMemberAction } from "@/actions/team";
import { DashboardLayoutContainer } from "@/components/layout/dashboard-layout-container";
import { AssignProjectMemberModal } from "@/components/modals/assign-project-member-modal";
import { ChangeRoleModal } from "@/components/modals/change-role-modal";
import { InviteMemberModal } from "@/components/modals/invite-member-modal";
import { MemberActionsModal } from "@/components/team/modals/member-actions-modal";
import { MemberDetailsModal } from "@/components/team/modals/member-details-modal";
import { RemoveMemberModal } from "@/components/team/modals/remove-member-modal";
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
	const [activeModal, setActiveModal] = useState<
		"actions" | "view" | "assign" | "role" | "invite" | "remove" | null
	>(null);

	const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>(
		initialPendingInvitations,
	);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedRole, setSelectedRole] = useState("all");
	const [selectedStatus, setSelectedStatus] = useState("all");

	const addNotification = useNotificationStore(
		(state) => state.addNotification,
	);

	// Helper to dynamically record activity feed items on client
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
			setActiveModal(null);
			setSelectedMember(null);
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
				<TeamHeader onInviteClick={() => setActiveModal("invite")} />

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

				{/* Main Grid Layout */}
				<div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)] gap-6 min-w-0">
					{/* Member Directory */}
					<div className="space-y-4 min-w-0">
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
							onOpenActions={(m) => {
								setSelectedMember(m);
								setActiveModal("actions");
							}}
						/>
					</div>

					{/* Sidebar: Pending Invitations & Activity Chronicle */}
					<div className="space-y-6 min-w-0">
						<TeamPendingInvitations
							invitations={pendingInvites}
							onResend={handleResendInvite}
							onCancel={handleCancelInvite}
						/>
						<TeamActivityChronicle activities={activityList} />
					</div>
				</div>
			</div>

			{/* Central Member Actions Hub Modal */}
			<MemberActionsModal
				member={selectedMember}
				isOpen={activeModal === "actions"}
				onClose={() => {
					setActiveModal(null);
					setSelectedMember(null);
				}}
				onViewMember={() => setActiveModal("view")}
				onAssignProject={() => setActiveModal("assign")}
				onChangeRole={() => setActiveModal("role")}
				onRemoveMember={() => setActiveModal("remove")}
			/>

			{/* Member Details Modal */}
			<MemberDetailsModal
				member={selectedMember}
				isOpen={activeModal === "view"}
				onClose={() => {
					setActiveModal(null);
					setSelectedMember(null);
				}}
				onRemoveMember={() => setActiveModal("remove")}
			/>

			{/* Remove Member Confirmation Modal */}
			<RemoveMemberModal
				member={selectedMember}
				isOpen={activeModal === "remove"}
				onClose={() => {
					setActiveModal(null);
					setSelectedMember(null);
				}}
				onConfirm={handleConfirmRemoveMember}
			/>

			{/* Invite Member Modal */}
			<InviteMemberModal
				isOpen={activeModal === "invite"}
				onClose={() => setActiveModal(null)}
			/>

			{/* Assign Project Modal */}
			<AssignProjectMemberModal
				isOpen={activeModal === "assign"}
				onClose={() => {
					setActiveModal(null);
					setSelectedMember(null);
				}}
				selectedMember={
					selectedMember
						? {
								id: selectedMember.id,
								name: selectedMember.name,
								email: selectedMember.email,
							}
						: undefined
				}
			/>

			{/* Change Member Role Modal */}
			<ChangeRoleModal
				member={selectedMember}
				isOpen={activeModal === "role"}
				onClose={() => {
					setActiveModal(null);
					setSelectedMember(null);
				}}
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
		</DashboardLayoutContainer>
	);
}
