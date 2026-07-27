"use client"

import { BarChart3, PieChart } from "lucide-react"

interface ProjectAnalyticsData {
  id: string
  name: string
  totalTasks: number
  completedTasks: number
  completionRate: number
}

interface VisualPerformanceChartsProps {
  projects: ProjectAnalyticsData[]
  totalTasks: number
  completedTasks: number
  inProgressTasks: number
  overdueTasks: number
}

export function VisualPerformanceCharts({
  projects,
  totalTasks,
  completedTasks,
  inProgressTasks,
  overdueTasks,
}: VisualPerformanceChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* CHART 1: TASK STATUS DISTRIBUTION */}
      <div className="p-5 rounded-xs border-2 border-[#3B2415] bg-[#1A120C] shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#4A2C1D] pb-3">
          <div className="flex items-center gap-2 text-[#D7B05C]">
            <PieChart size={18} />
            <h3 className="font-serif font-black uppercase text-sm tracking-wider text-[#F8EEDB]">
              Task Status Distribution
            </h3>
          </div>
          <span className="text-[10px] font-serif italic text-[#D7B05C]/60">
            Workload Breakdown
          </span>
        </div>

        <div className="space-y-3 pt-2">
          {/* Completed Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-sans font-bold text-[#F8EEDB]">
              <span className="text-emerald-400">Completed ({completedTasks})</span>
              <span>{totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%</span>
            </div>
            <div className="h-2.5 w-full bg-[#100A07] rounded-xs overflow-hidden border border-[#8F6236]/40 p-0.5">
              <div
                className="h-full bg-emerald-500 rounded-2xs transition-all duration-300"
                style={{
                  width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%`,
                }}
              />
            </div>
          </div>

          {/* Active / In Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-sans font-bold text-[#F8EEDB]">
              <span className="text-sky-400">In Progress ({inProgressTasks})</span>
              <span>{totalTasks > 0 ? Math.round((inProgressTasks / totalTasks) * 100) : 0}%</span>
            </div>
            <div className="h-2.5 w-full bg-[#100A07] rounded-xs overflow-hidden border border-[#8F6236]/40 p-0.5">
              <div
                className="h-full bg-sky-500 rounded-2xs transition-all duration-300"
                style={{
                  width: `${totalTasks > 0 ? (inProgressTasks / totalTasks) * 100 : 0}%`,
                }}
              />
            </div>
          </div>

          {/* Overdue Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-sans font-bold text-[#F8EEDB]">
              <span className="text-rose-400">Overdue ({overdueTasks})</span>
              <span>{totalTasks > 0 ? Math.round((overdueTasks / totalTasks) * 100) : 0}%</span>
            </div>
            <div className="h-2.5 w-full bg-[#100A07] rounded-xs overflow-hidden border border-[#8F6236]/40 p-0.5">
              <div
                className="h-full bg-rose-500 rounded-2xs transition-all duration-300"
                style={{
                  width: `${totalTasks > 0 ? (overdueTasks / totalTasks) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* CHART 2: PROJECT COMPLETION COMPARISON */}
      <div className="p-5 rounded-xs border-2 border-[#3B2415] bg-[#1A120C] shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#4A2C1D] pb-3">
          <div className="flex items-center gap-2 text-[#D7B05C]">
            <BarChart3 size={18} />
            <h3 className="font-serif font-black uppercase text-sm tracking-wider text-[#F8EEDB]">
              Projects Progress Rate
            </h3>
          </div>
          <span className="text-[10px] font-serif italic text-[#D7B05C]/60">
            Comparative Velocity
          </span>
        </div>

        {projects.length === 0 ? (
          <p className="text-xs font-serif italic text-[#D7B05C]/60 text-center py-6">
            No projects found to compare.
          </p>
        ) : (
          <div className="space-y-3 pt-1">
            {projects.slice(0, 4).map((proj) => (
              <div key={proj.id} className="space-y-1">
                <div className="flex justify-between text-xs font-sans font-bold text-[#F8EEDB]">
                  <span className="truncate max-w-[200px]">{proj.name}</span>
                  <span className="font-mono text-[#D7B05C]">{proj.completionRate}%</span>
                </div>
                <div className="h-2.5 w-full bg-[#100A07] rounded-xs overflow-hidden border border-[#8F6236]/40 p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-[#8F6236] via-[#B78B3E] to-[#FFF5D6] rounded-2xs transition-all duration-300"
                    style={{ width: `${proj.completionRate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}