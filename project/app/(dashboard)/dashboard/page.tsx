// app/(dashboard)/dashboard/page.tsx
import { db } from "@/lib/db"
import { projects } from "@/lib/db/schema"
import { getOrCreateDbUser } from "@/lib/auth"
import { eq, desc } from "drizzle-orm"
import { DashboardStats } from "@/components/dashboard-stats"
import { RecentProjects } from "@/components/recent-projects"
import { CreateProjectButton } from "@/components/create-project-button"
import { TaskOverview } from "@/components/task-overview"
import { Check } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const dbUser = await getOrCreateDbUser()

  if (!dbUser) {
    return (
      <div className="p-6 text-center text-payne's_gray-500">
        Unauthorized. Please sign in.
      </div>
    )
  }

  // 1. Fetch user projects with nested lists and tasks
  const userProjects = await db.query.projects.findMany({
    where: eq(projects.userId, dbUser.id),
    orderBy: [desc(projects.updatedAt)],
    with: {
      lists: {
        with: {
          tasks: true,
        },
      },
    },
  })

  // 2. Compute dynamic stats from PostgreSQL records
  const totalProjects = userProjects.length
  let totalTasks = 0
  let completedTasks = 0

  const recentProjectsData = userProjects.slice(0, 4).map((proj) => {
    let projTotalTasks = 0
    let projCompletedTasks = 0

    proj.lists.forEach((list) => {
      const isDoneList =
        list.name.toLowerCase().includes("done") ||
        list.name.toLowerCase().includes("complete")

      list.tasks.forEach(() => {
        projTotalTasks++
        totalTasks++
        if (isDoneList) {
          projCompletedTasks++
          completedTasks++
        }
      })
    })

    return {
      id: proj.id,
      name: proj.name,
      description: proj.description,
      updatedAt: proj.updatedAt,
      totalTasks: projTotalTasks,
      completedTasks: projCompletedTasks,
    }
  })

  const pendingTasks = totalTasks - completedTasks

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      {/* Header section with Create Project Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-outer_space-500 dark:text-platinum-500">
            Welcome back{dbUser?.name ? `, ${dbUser.name}` : ""}! 👋
          </h1>
          <p className="text-payne's_gray-500 dark:text-french_gray-400 mt-1">
            Here's an overview of your projects and task progress.
          </p>
        </div>

        <CreateProjectButton />
      </div>

      {/* User Sync Completion Status */}
      <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
              <Check className="text-white" size={16} />
            </div>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
              User Synchronization Active
            </h3>
            <p className="mt-1 text-sm text-emerald-800 dark:text-emerald-200">
              Connected as <span className="font-semibold">{dbUser?.email}</span>. Your workspace is synchronized with Neon PostgreSQL.
            </p>
          </div>
        </div>
      </div>

      {/* Dynamic Stats Grid */}
      <DashboardStats
        stats={{
          activeProjects: totalProjects,
          totalMembers: 1,
          completedTasks,
          pendingTasks,
        }}
      />

      {/* Main Grid: Recent Projects & Task Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RecentProjects projects={recentProjectsData} />
        </div>
        <div>
          <TaskOverview />
        </div>
      </div>
    </div>
  )
}