"use client";

import { useMemo, useState } from "react";
import { revokeInvitation } from "@/actions/invitations";
import { DashboardLayoutContainer } from "@/components/layout/dashboard-layout-container";
import { AssignProjectMemberModal } from "@/components/modals/assign-project-member-modal";
import { InviteMemberModal } from "@/components/modals/invite-member-modal";
import { MemberDetailsDrawer } from "@/components/team/member-details-drawer";
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
import { TeamQuickActions } from "@/components/team/team-quick-actions";
import { TeamSearch } from "@/components/team/team-search";
import { TeamStats } from "@/components/team/team-stats";
import { useKanbanStore } from "@/stores/use-kanban-store";
import { useNotificationStore } from "@/stores/use-notification-store";

interface TeamClientProps {
	initialMembers: Member[];
	activities: ActivityItem[];
	pendingInvitations: PendingInvite[];
}

export function TeamClient({
	initialMembers,
	activities,
	pendingInvitations: initialPendingInvitations,
}: TeamClientProps) {
	const [selectedMember, setSelectedMember] = useState<Member | null>(null);
	const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>(
		initialPendingInvitations,
	);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedRole, setSelectedRole] = useState("all");
	const [selectedStatus, setSelectedStatus] = useState("all");
	const [isInviteOpen, setIsInviteOpen] = useState(false);

	const {
		isAssignProjectMemberModalOpen,
		openAssignProjectMemberModal,
		closeAssignProjectMemberModal,
	} = useKanbanStore();

	const addNotification = useNotificationStore(
		(state) => state.addNotification,
	);

	// Filter members based on search query, role, and status
	const filteredMembers = useMemo(() => {
		return initialMembers.filter((m) => {
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
	}, [initialMembers, searchQuery, selectedRole, selectedStatus]);

	const handleResetFilters = () => {
		setSearchQuery("");
		setSelectedRole("all");
		setSelectedStatus("all");
	};

	const handleInviteMember = () => {
		setIsInviteOpen(true);
	};

	const handleCancelInvite = async (invitationId: string) => {
		const targetInvite = pendingInvites.find((i) => i.id === invitationId);
		const res = await revokeInvitation(invitationId, "global");

		if (res.success) {
			setPendingInvites((prev) => prev.filter((i) => i.id !== invitationId));
			if (targetInvite) {
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
			<div className="space-y-8">
				{/* Header */}
				<TeamHeader onInviteClick={handleInviteMember} />

				{/* Stats Row */}
				<TeamStats
					totalMembers={initialMembers.length}
					activeThisWeek={
						initialMembers.filter((m) => m.status !== "Offline").length
					}
					totalProjectAssignments={initialMembers.reduce(
						(acc, m) => acc + m.projectCount,
						0,
					)}
					pendingInvitationsCount={pendingInvites.length}
				/>

				{/* Main Grid Layout */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Main Content Area */}
					<div className="lg:col-span-2 space-y-4">
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
							onSelectMember={(member) => setSelectedMember(member)}
						/>
					</div>

					{/* Right Sidebar */}
					<div className="space-y-6">
						<TeamQuickActions
							onInviteMember={handleInviteMember}
							onAssignProject={openAssignProjectMemberModal}
						/>
						<TeamPendingInvitations
							invitations={pendingInvites}
							onCancel={handleCancelInvite}
						/>
						<TeamActivityChronicle activities={activities} />
					</div>
				</div>
			</div>

			{/* Member Details Side Drawer */}
			<MemberDetailsDrawer
				member={selectedMember}
				onClose={() => setSelectedMember(null)}
			/>

			{/* Invite Member Modal */}
			<InviteMemberModal
				isOpen={isInviteOpen}
				onClose={() => setIsInviteOpen(false)}
			/>

			{/* Assign Project Officer Modal */}
			<AssignProjectMemberModal
				isOpen={isAssignProjectMemberModalOpen}
				onClose={closeAssignProjectMemberModal}
			/>
		</DashboardLayoutContainer>
	);
}
