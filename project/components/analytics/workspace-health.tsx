"use client"

import { DashboardSection } from "@/components/layout/dashboard-section"
import { Shield, Target, Activity, Flame } from "lucide-react"

interface WorkspaceHealthProps {
  totalProjects: number
  overallEfficiency: number
  completedTasks: number
  totalTasks: number
  overdueTasks: number
}

export function WorkspaceHealth({
  totalProjects,
  overallEfficiency,
  completedTasks,
  totalTasks,
  overdueTasks,
}: WorkspaceHealthProps) {
  const healthStatus =
    overdueTasks === 0 && overallEfficiency >= 50
      ? { label: "Realm Operational & Secure", color: "text-emerald-400", border: "border-emerald-500/50" }
      : overdueTasks > 0
      ? { label: "Attention Required in Campaigns", color: "text-rose-400", border: "border-rose-500/50" }
      : { label: "Operations Stabilizing", color: "text-amber-400", border: "border-amber-500/50" }

  return (
    <DashboardSection>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#4A2C1D] pb-3 mb-4">
        <div className="flex items-center gap-2 text-[#D7B05C]">
          <Shield size={20} />
          <h2 className="font-serif font-black uppercase text-base tracking-widest text-[#F8EEDB]">
            Workspace Intelligence Briefing
          </h2>
        </div>
        <div className={`px-3 py-1 rounded-xs bg-[#15100C] border ${healthStatus.border} ${healthStatus.color} text-[10px] font-sans font-black uppercase tracking-wider`}>
          {healthStatus.label}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xs border border-[#4A2C1D] bg-[#15100C]/80">
          <div className="flex items-center gap-1.5 text-[10px] font-sans font-black uppercase text-[#D7B05C]/70">
            <Target size={12} /> Active Realms
          </div>
          <p className="text-lg font-serif font-black text-[#F8EEDB] mt-1">{totalProjects} Projects</p>
        </div>

        <div className="p-3 rounded-xs border border-[#4A2C1D] bg-[#15100C]/80">
          <div className="flex items-center gap-1.5 text-[10px] font-sans font-black uppercase text-[#D7B05C]/70">
            <Activity size={12} /> Completion Rate
          </div>
          <p className="text-lg font-serif font-black text-[#D7B05C] mt-1">{overallEfficiency}%</p>
        </div>

        <div className="p-3 rounded-xs border border-[#4A2C1D] bg-[#15100C]/80">
          <div className="flex items-center gap-1.5 text-[10px] font-sans font-black uppercase text-[#D7B05C]/70">
            <Flame size={12} /> Task Load
          </div>
          <p className="text-lg font-serif font-black text-[#F8EEDB] mt-1">{completedTasks} / {totalTasks}</p>
        </div>

        <div className="p-3 rounded-xs border border-[#4A2C1D] bg-[#15100C]/80">
          <div className="flex items-center gap-1.5 text-[10px] font-sans font-black uppercase text-[#D7B05C]/70">
            <Shield size={12} /> Critical Overdue
          </div>
          <p className={`text-lg font-serif font-black mt-1 ${overdueTasks > 0 ? "text-rose-400" : "text-emerald-400"}`}>
            {overdueTasks} Tasks
          </p>
        </div>
      </div>
    </DashboardSection>
  )
}