// app/(dashboard)/analytics/page.tsx
import { db } from "@/lib/db"
import { projects, activityLogs } from "@/lib/db/schema"
import { getOrCreateDbUser } from "@/lib/auth"
import { eq, desc } from "drizzle-orm"
import {
  BarChart3,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  FolderOpen,
  Activity,
  FileText,
  PlusCircle,
} from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AnalyticsPage() {
  const dbUser = await getOrCreateDbUser()

  if (!dbUser) {
    return (
      <div className="p-6 text-center text-payne's_gray-500 dark:text-french_gray-400">
        Unauthorized. Please sign in.
      </div>
    )
  }

  // 1. Fetch user projects with nested lists & tasks
  const userProjects = await db.query.projects.findMany({
    where: eq(projects.userId, dbUser.id),
    with: {
      lists: {
        with: {
          tasks: true,
        },
      },
    },
  })

  // 2. Fetch recent activity logs for this user
  const recentActivities = await db.query.activityLogs.findMany({
    where: eq(activityLogs.userId, dbUser.id),
    orderBy: [desc(activityLogs.createdAt)],
    limit: 8,
  })

  // 3. Compute live analytics metrics
  let totalTasks = 0
  let completedTasks = 0
  let overdueTasks = 0
  const today = new Date(new Date().setHours(0, 0, 0, 0))

  const projectAnalytics = userProjects.map((proj) => {
    let projTotalTasks = 0
    let projCompletedTasks = 0

    proj.lists.forEach((list) => {
      const isDoneList =
        list.name.toLowerCase().includes("done") ||
        list.name.toLowerCase().includes("complete")

      list.tasks.forEach((task) => {
        projTotalTasks++
        totalTasks++

        if (isDoneList) {
          projCompletedTasks++
          completedTasks++
        } else if (task.dueDate && new Date(task.dueDate) < today) {
          overdueTasks++
        }
      })
    })

    const completionRate =
      projTotalTasks > 0
        ? Math.round((projCompletedTasks / projTotalTasks) * 100)
        : 0

    return {
      id: proj.id,
      name: proj.name,
      totalTasks: projTotalTasks,
      completedTasks: projCompletedTasks,
      completionRate,
    }
  })

  const inProgressTasks = totalTasks - completedTasks
  const overallCompletionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-outer_space-500 dark:text-platinum-500 flex items-center gap-3">
          <BarChart3 className="text-blue_munsell-500" size={32} />
          Analytics & Performance
        </h1>
        <p className="text-payne's_gray-500 dark:text-french_gray-400 mt-1">
          Track project completion rates, task productivity, and live workspace activity.
        </p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white dark:bg-outer_space-500 rounded-lg border border-french_gray-300 dark:border-payne's_gray-400 p-6 shadow-sm">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-blue_munsell-500" size={20} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-payne's_gray-500 dark:text-french_gray-400">
                Overall Efficiency
              </p>
              <p className="text-2xl font-bold text-outer_space-500 dark:text-platinum-500">
                {overallCompletionRate}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-outer_space-500 rounded-lg border border-french_gray-300 dark:border-payne's_gray-400 p-6 shadow-sm">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
              <CheckCircle className="text-emerald-500" size={20} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-payne's_gray-500 dark:text-french_gray-400">
                Completed Tasks
              </p>
              <p className="text-2xl font-bold text-outer_space-500 dark:text-platinum-500">
                {completedTasks} / {totalTasks}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-outer_space-500 rounded-lg border border-french_gray-300 dark:border-payne's_gray-400 p-6 shadow-sm">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
              <Clock className="text-amber-500" size={20} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-payne's_gray-500 dark:text-french_gray-400">
                In Progress
              </p>
              <p className="text-2xl font-bold text-outer_space-500 dark:text-platinum-500">
                {inProgressTasks}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-outer_space-500 rounded-lg border border-french_gray-300 dark:border-payne's_gray-400 p-6 shadow-sm">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-rose-100 dark:bg-rose-900/30 rounded-lg flex items-center justify-center">
              <AlertCircle className="text-rose-500" size={20} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-payne's_gray-500 dark:text-french_gray-400">
                Overdue Tasks
              </p>
              <p className="text-2xl font-bold text-outer_space-500 dark:text-platinum-500">
                {overdueTasks}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Project Breakdown & Activity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Project Breakdown Chart */}
        <div className="bg-white dark:bg-outer_space-500 rounded-lg border border-french_gray-300 dark:border-payne's_gray-400 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-outer_space-500 dark:text-platinum-500 mb-6 flex items-center gap-2">
            <FolderOpen size={20} className="text-blue_munsell-500" />
            Project Breakdown
          </h3>

          {projectAnalytics.length === 0 ? (
            <p className="text-sm text-payne's_gray-500 dark:text-french_gray-400 text-center py-8">
              No active projects found.
            </p>
          ) : (
            <div className="space-y-6">
              {projectAnalytics.map((proj) => (
                <div key={proj.id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-outer_space-500 dark:text-platinum-500">
                      {proj.name}
                    </span>
                    <span className="text-payne's_gray-500 dark:text-french_gray-400 font-medium">
                      {proj.completionRate}% ({proj.completedTasks}/{proj.totalTasks} tasks)
                    </span>
                  </div>
                  <div className="w-full bg-french_gray-300 dark:bg-payne's_gray-400 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-blue_munsell-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${proj.completionRate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Activity Timeline / Audit Log */}
        <div className="bg-white dark:bg-outer_space-500 rounded-lg border border-french_gray-300 dark:border-payne's_gray-400 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-outer_space-500 dark:text-platinum-500 mb-6 flex items-center gap-2">
            <Activity size={20} className="text-blue_munsell-500" />
            Activity Timeline
          </h3>

          {recentActivities.length === 0 ? (
            <div className="text-center py-8 text-payne's_gray-500 dark:text-french_gray-400 space-y-2">
              <FileText size={32} className="mx-auto text-slate-400" />
              <p className="text-sm">No recent activity logged yet.</p>
              <p className="text-xs text-slate-400">
                Actions like creating projects or updating tasks will appear here.
              </p>
            </div>
          ) : (
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-french_gray-300 dark:before:bg-payne's_gray-400">
              {recentActivities.map((log) => (
                <div key={log.id} className="relative flex items-start gap-3">
                  <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-blue_munsell-500 ring-4 ring-white dark:ring-outer_space-500" />
                  <div>
                    <p className="text-sm font-medium text-outer_space-500 dark:text-platinum-500">
                      <span className="capitalize font-semibold">{log.action}</span>{" "}
                      <span className="text-blue_munsell-500 font-medium">
                        "{log.entityName}"
                      </span>
                    </p>
                    {log.details && (
                      <p className="text-xs text-payne's_gray-500 dark:text-french_gray-400 mt-0.5">
                        {log.details}
                      </p>
                    )}
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      {new Date(log.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}