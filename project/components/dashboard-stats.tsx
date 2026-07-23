// components/dashboard-stats.tsx
"use client"

import { FolderOpen, Users, CheckCircle, Clock } from "lucide-react"

interface DashboardStatsProps {
  stats: {
    activeProjects: number
    totalMembers: number
    completedTasks: number
    pendingTasks: number
  }
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const statItems = [
    {
      name: "Active Projects",
      value: stats.activeProjects,
      icon: FolderOpen,
    },
    {
      name: "Team Members",
      value: stats.totalMembers,
      icon: Users,
    },
    {
      name: "Completed Tasks",
      value: stats.completedTasks,
      icon: CheckCircle,
    },
    {
      name: "Pending Tasks",
      value: stats.pendingTasks,
      icon: Clock,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {statItems.map((stat) => (
        <div
          key={stat.name}
          className="bg-white dark:bg-outer_space-500 overflow-hidden rounded-lg border border-french_gray-300 dark:border-payne's_gray-400 p-6 shadow-sm"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue_munsell-100 dark:bg-blue_munsell-900/30 rounded-lg flex items-center justify-center">
                <stat.icon className="text-blue_munsell-500" size={20} />
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-payne's_gray-500 dark:text-french_gray-400 truncate">
                  {stat.name}
                </dt>
                <dd className="text-2xl font-semibold text-outer_space-500 dark:text-platinum-500">
                  {stat.value}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}