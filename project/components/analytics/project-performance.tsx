"use client"

import { DashboardSection } from "@/components/layout/dashboard-section"
import { DashboardCard } from "@/components/layout/dashboard-card"
import { FolderOpen, Scroll } from "lucide-react"
import { ProjectMetric } from "./types"

interface ProjectPerformanceProps {
  projects: ProjectMetric[]
}

export function ProjectPerformance({ projects }: ProjectPerformanceProps) {
  return (
    <DashboardSection className="h-full">
      <div className="flex items-center justify-between border-b border-[#4A2C1D] pb-3 mb-4">
        <div className="flex items-center gap-2 text-[#D7B05C]">
          <FolderOpen size={20} />
          <h2 className="font-serif font-black uppercase text-base tracking-widest text-[#F8EEDB]">
            Campaign Intelligence Reports
          </h2>
        </div>
        <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#D7B05C]/60">
          {projects.length} Active
        </span>
      </div>

      {projects.length === 0 ? (
        <div className="p-8 border-2 border-dashed border-[#8F6236]/40 bg-[#15100C] text-center rounded-xs">
          <Scroll size={28} className="mx-auto text-[#D7B05C]/50 mb-2" />
          <p className="font-serif italic text-[#D7B05C]/80 text-sm">
            The Royal Archive contains no active project dispatches.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {projects.map((proj) => (
            <DashboardCard key={proj.id}>
              <div className="space-y-2.5">
                {/* Header: Name + Task Counter */}
                <div className="flex items-center justify-between gap-2 border-b border-[#2D1B10]/15 pb-1.5">
                  <div className="flex items-center gap-2">
                    {/* Royal Wax Seal Marker */}
                    <div className="w-2.5 h-2.5 rounded-full bg-[#8F6236] border border-[#D7B05C] shadow-xs" />
                    <h3 className="font-serif font-black text-[#1A120C] text-base">
                      {proj.name}
                    </h3>
                  </div>

                  <span className="px-2 py-0.5 text-[9px] font-sans font-black uppercase bg-[#2D1B10] text-[#D7B05C] rounded-xs border border-[#8F6236] shadow-xs">
                    {proj.completedTasks} / {proj.totalTasks} Tasks
                  </span>
                </div>

                {/* Carved Wooden Trough Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-sans font-black text-[#2D1B10]">
                    <span>CAMPAIGN PROGRESS</span>
                    <span className="text-[#5B3922] font-black">{proj.completionRate}%</span>
                  </div>

                  <div className="relative h-3 w-full bg-[#1A120C] rounded-xs overflow-hidden border-2 border-[#8F6236] shadow-inner p-0.5">
                    <div
                      className="h-full bg-gradient-to-r from-[#8F6236] via-[#B78B3E] to-[#FFF5D6] rounded-xs transition-all duration-500 shadow-[0_0_10px_rgba(215,176,92,0.6)]"
                      style={{ width: `${proj.completionRate}%` }}
                    />
                  </div>
                </div>
              </div>
            </DashboardCard>
          ))}
        </div>
      )}
    </DashboardSection>
  )
}