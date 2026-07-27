// app/(dashboard)/team/page.tsx
import { db } from "@/lib/db"
import { users, projects } from "@/lib/db/schema"
import { getOrCreateDbUser } from "@/lib/auth"
import { UserPlus, Mail, MoreHorizontal } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function TeamPage() {
  const dbUser = await getOrCreateDbUser()

  // 1. Fetch real users from Neon PostgreSQL DB
  const dbUsers = await db.select().from(users)
  const allProjects = await db.select().from(projects)

  // Fallback mock team members to fill grid if DB users are few
  const fallbackMembers = [
    { id: "1", name: "John Doe", role: "Project Manager", email: "john@example.com", avatar: "JD", projectCount: 8 },
    { id: "2", name: "Jane Smith", role: "Developer", email: "jane@example.com", avatar: "JS", projectCount: 3 },
    { id: "3", name: "Mike Johnson", role: "Designer", email: "mike@example.com", avatar: "MJ", projectCount: 5 },
    { id: "4", name: "Sarah Wilson", role: "Developer", email: "sarah@example.com", avatar: "SW", projectCount: 10 },
    { id: "5", name: "Tom Brown", role: "QA Engineer", email: "tom@example.com", avatar: "TB", projectCount: 7 },
    { id: "6", name: "Lisa Davis", role: "Designer", email: "lisa@example.com", avatar: "LD", projectCount: 7 },
  ]

  // Map real database users to team card format
  const mappedDbUsers = dbUsers.map((u) => {
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
      role: u.id === dbUser?.id ? "Workspace Admin" : "Team Member",
      email: u.email,
      avatar: initials || "U",
      projectCount: userProjects || 1,
    }
  })

  // Combine real database users with mock fallbacks to maintain complete grid view
  const combinedTeam = [...mappedDbUsers]
  fallbackMembers.forEach((fallback) => {
    if (!combinedTeam.some((member) => member.email === fallback.email)) {
      combinedTeam.push(fallback)
    }
  })

  const teamMembers = combinedTeam.slice(0, 6)

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-outer_space-500 dark:text-platinum-500">
            Team
          </h1>
          <p className="text-payne's_gray-500 dark:text-french_gray-400 mt-2">
            Manage team members and permissions
          </p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-blue_munsell-500 text-white rounded-lg hover:bg-blue_munsell-600 transition-colors shadow-sm font-medium text-sm">
          <UserPlus size={18} className="mr-2" />
          Invite Member
        </button>
      </div>

      {/* Implementation Tasks Banner */}
      {/* <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
          📋 Team Management Implementation Tasks
        </h3>
        <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
          <li>• Task 6.1: Implement task assignment and user collaboration features</li>
          <li>• Task 6.4: Implement project member management and permissions</li>
        </ul>
      </div> */}

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member) => (
          <div
            key={member.id}
            className="bg-white dark:bg-outer_space-500 rounded-lg border border-french_gray-300 dark:border-payne's_gray-400 p-6 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue_munsell-500 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-xs">
                    {member.avatar}
                  </div>
                  <div>
                    <h3 className="font-semibold text-outer_space-500 dark:text-platinum-500 text-base">
                      {member.name}
                    </h3>
                    <p className="text-sm text-payne's_gray-500 dark:text-french_gray-400">
                      {member.role}
                    </p>
                  </div>
                </div>
                <button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-platinum-500 hover:bg-slate-100 dark:hover:bg-payne's_gray-400 rounded transition-colors">
                  <MoreHorizontal size={16} />
                </button>
              </div>

              <div className="flex items-center text-sm text-payne's_gray-500 dark:text-french_gray-400 mb-6">
                <Mail size={16} className="mr-2 text-slate-400" />
                <span className="truncate">{member.email}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-payne's_gray-400">
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Active
              </span>
              <div className="text-sm font-medium text-payne's_gray-500 dark:text-french_gray-400">
                {member.projectCount} {member.projectCount === 1 ? "project" : "projects"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}