"use client"

import { useState, useMemo } from "react"
import { TeamHeader } from "@/components/team/team-header"
import { TeamStats } from "@/components/team/team-stats"
import { TeamSearch } from "@/components/team/team-search"
import { TeamDirectoryTable, Member } from "@/components/team/team-directory-table"
import { TeamActivityChronicle, ActivityItem } from "@/components/team/team-activity-chronicle"
import { TeamPendingInvitations, PendingInvite } from "@/components/team/team-pending-invitations"
import { TeamQuickActions } from "@/components/team/team-quick-actions"
import { MemberDetailsDrawer } from "@/components/team/member-details-drawer"
import { DashboardLayoutContainer } from "@/components/layout/dashboard-layout-container"

interface TeamClientProps {
  initialMembers: Member[]
  activities: ActivityItem[]
  pendingInvitations: PendingInvite[]
}

export function TeamClient({
  initialMembers,
  activities,
  pendingInvitations,
}: TeamClientProps) {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  // Filter members based on search query, role, and status
  const filteredMembers = useMemo(() => {
    return initialMembers.filter((m) => {
      const matchesQuery =
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.role.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesRole =
        selectedRole === "all" ||
        m.role.toLowerCase() === selectedRole.toLowerCase()

      const matchesStatus =
        selectedStatus === "all" ||
        m.status.toLowerCase() === selectedStatus.toLowerCase()

      return matchesQuery && matchesRole && matchesStatus
    })
  }, [initialMembers, searchQuery, selectedRole, selectedStatus])

  const handleResetFilters = () => {
    setSearchQuery("")
    setSelectedRole("all")
    setSelectedStatus("all")
  }

  const handleInviteMember = () => {
    // Open invite modal or trigger invite action
    alert("Invite Member dialog opened!")
  }

  return (
    <DashboardLayoutContainer>
      <div className="space-y-8">
        {/* Header */}
        <TeamHeader onInviteClick={handleInviteMember} />

        {/* Stats Row */}
        <TeamStats
          totalMembers={initialMembers.length}
          activeThisWeek={initialMembers.filter((m) => m.status !== "Offline").length}
          totalProjectAssignments={initialMembers.reduce((acc, m) => acc + m.projectCount, 0)}
          pendingInvitationsCount={pendingInvitations.length}
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
            <TeamQuickActions onInviteMember={handleInviteMember} />
            <TeamPendingInvitations invitations={pendingInvitations} />
            <TeamActivityChronicle activities={activities} />
          </div>
        </div>
      </div>

      {/* Member Details Side Drawer */}
      <MemberDetailsDrawer
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </DashboardLayoutContainer>
  )
}