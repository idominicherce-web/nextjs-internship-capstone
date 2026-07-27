import { db } from "@/lib/db"
import { users, projects } from "@/lib/db/schema"
import { getOrCreateDbUser } from "@/lib/auth"
import { Member } from "@/components/team/team-directory-table"
import { TeamClient } from "@/components/team/team-client"

export const dynamic = "force-dynamic"

export default async function TeamPage() {
  const dbUser = await getOrCreateDbUser()

  const dbUsers = await db.select().from(users)
  const allProjects = await db.select().from(projects)

  // Map Real DB Users
  const mappedDbUsers: Member[] = dbUsers.map((u, idx) => {
    const userProjects = allProjects.filter((p) => p.userId === u.id).length
    const displayName = u.name || u.email.split("@")[0]
    const initials = displayName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)

    return {
      id: u.id,
      name: displayName,
      role: u.id === dbUser?.id ? "Workspace Owner" : idx % 2 === 0 ? "Project Manager" : "Developer",
      email: u.email,
      avatar: initials || "U",
      projectCount: userProjects || 2,
      status: idx === 0 ? "Online" : idx % 2 === 0 ? "Away" : "Offline",
      lastActive: idx === 0 ? "Today" : "Yesterday",
    }
  })

  // Sample Activities & Pending Invitations
  const sampleActivities = [
    { id: "1", user: "Dominic Herce", action: "invited Maria Cruz to the workspace", timeAgo: "2 hours ago" },
    { id: "2", user: "John Cruz", action: "joined Project Alpha", timeAgo: "Yesterday" },
    { id: "3", user: "James Vance", action: "promoted to Project Manager", timeAgo: "3 days ago" },
  ]

  const samplePending = [
    { id: "p1", email: "maria@enterprise.com", invitedAgo: "2 days ago" },
    { id: "p2", email: "alex@enterprise.com", invitedAgo: "4 days ago" },
  ]

  return (
    <TeamClient
      initialMembers={mappedDbUsers}
      activities={sampleActivities}
      pendingInvitations={samplePending}
    />
  )
}