import { db } from "@/lib/db"
import { projects, activityLogs } from "@/lib/db/schema"
import { getOrCreateDbUser } from "@/lib/auth"
import { eq, desc } from "drizzle-orm"
import { Shield } from "lucide-react"

import { DashboardLayoutContainer } from "@/components/layout/dashboard-layout-container"
import { IntelligenceStats } from "@/components/analytics/intelligence-stats"
import { WorkspaceHealthScore } from "@/components/analytics/workspace-health-score"
import { VisualPerformanceCharts } from "@/components/analytics/visual-performance-charts"
import { ActivityArchive } from "@/components/analytics/activity-archive"

export const dynamic = "force-dynamic"

export default async function AnalyticsPage() {
  const dbUser = await getOrCreateDbUser()

  if (!dbUser) {
    return (
      <div className="min-h-screen bg-[#15100C] flex items-center justify-center p-6 text-center text-[#D7B05C] font-serif">
        <div className="p-8 border-2 border-[#8F6236] bg-[#2D1B10] rounded-xs shadow-2xl">
          <Shield className="mx-auto mb-3 text-[#D7B05C]" size={32} />
          <h2 className="text-xl font-black uppercase tracking-widest text-[#F8EEDB]">
            Access Denied
          </h2>
          <p className="text-xs font-sans text-[#D7B05C]/70 mt-2">
            Unauthorized traveler. Please sign in to access the Intelligence Chamber.
          </p>
        </div>
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
    limit: 6,
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
    <DashboardLayoutContainer>
      {/* Hero Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b-2 border-[#4A2C1D] pb-6 relative">
        <div>
          <div className="flex items-center gap-2 text-[#D7B05C] text-xs font-sans uppercase font-extrabold tracking-[0.25em] mb-1.5">
            <span>⚔</span>
            <span>Strategic Briefing</span>
            <span>⚔</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black bg-gradient-to-b from-[#FFF5D6] via-[#D7B05C] to-[#B78B3E] bg-clip-text text-transparent uppercase tracking-[0.1em] filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            Analytics & Performance
          </h1>
          <p className="text-xs sm:text-sm font-sans text-[#D7B05C]/80 mt-2 italic max-w-2xl leading-relaxed">
            Track project completion rates, workspace productivity, and live operational activity.
          </p>
        </div>
      </div>

      <div className="space-y-8 mt-6">
        {/* 1. Executive KPI Summary Cards */}
        <IntelligenceStats
          overallEfficiency={overallCompletionRate}
          completedTasks={completedTasks}
          totalTasks={totalTasks}
          inProgressTasks={inProgressTasks}
          overdueTasks={overdueTasks}
        />

        {/* 2. Signature Feature: Workspace Health Score & Operational Summary */}
        <WorkspaceHealthScore
          totalProjects={userProjects.length}
          overallEfficiency={overallCompletionRate}
          completedTasks={completedTasks}
          totalTasks={totalTasks}
          overdueTasks={overdueTasks}
        />

        {/* Decorative Divider */}
        <div className="flex items-center justify-center gap-4 text-[#B78B3E] text-xs py-1">
          <div className="h-px w-36 bg-gradient-to-r from-transparent to-[#4A2C1D]" />
          <span>⚔ ──── ⚜ ──── ⚔</span>
          <div className="h-px w-36 bg-gradient-to-l from-transparent to-[#4A2C1D]" />
        </div>

        {/* 3. Visual Performance Charts */}
        <VisualPerformanceCharts
          projects={projectAnalytics}
          totalTasks={totalTasks}
          completedTasks={completedTasks}
          inProgressTasks={inProgressTasks}
          overdueTasks={overdueTasks}
        />

        {/* 4. Activity Chronicle Feed */}
        <ActivityArchive activities={recentActivities} />
      </div>
    </DashboardLayoutContainer>
  )
}