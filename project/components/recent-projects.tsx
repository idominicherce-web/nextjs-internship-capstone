"use client"

import Link from "next/link"
import { DashboardSection } from "@/components/layout/dashboard-section"
import { DashboardCard } from "@/components/layout/dashboard-card"
import { FolderKanban, ArrowRight, Shield, Users, Clock } from "lucide-react"

interface ProjectItem {
  id: string
  name: string
  description: string | null
  updatedAt: Date
  totalTasks: number
  completedTasks: number
}

interface RecentProjectsProps {
  projects: ProjectItem[]
}

export function RecentProjects({ projects }: RecentProjectsProps) {
  return (
    <DashboardSection>
      <div className="flex items-center justify-between border-b border-[#4A2C1D] pb-3 mb-4">
        <div className="flex items-center gap-2 text-[#D7B05C]">
          <FolderKanban size={20} />
          <h2 className="font-serif font-black uppercase text-base tracking-widest text-[#F8EEDB]">
            Active Campaign Dossiers
          </h2>
        </div>
        <Link
          href="/projects"
          className="text-xs font-sans font-bold text-[#D7B05C] hover:underline flex items-center gap-1"
        >
          View Archives <ArrowRight size={14} />
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="p-8 text-center text-[#D7B05C]/70 font-serif italic border border-dashed border-[#8F6236]/40 rounded-xs">
          No active campaign dossiers recorded in the ledger.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3.5">
          {projects.map((project) => {
            const progress =
              project.totalTasks > 0
                ? Math.round((project.completedTasks / project.totalTasks) * 100)
                : 0

            const statusBadge =
              progress === 100
                ? { label: "Completed", color: "bg-emerald-950 text-emerald-300 border-emerald-700" }
                : progress > 50
                ? { label: "In Testing", color: "bg-sky-950 text-sky-300 border-sky-700" }
                : progress > 0
                ? { label: "In Development", color: "bg-amber-950 text-amber-300 border-amber-700" }
                : { label: "Planning", color: "bg-[#2D1B10] text-[#D7B05C] border-[#8F6236]" }

            return (
              <DashboardCard key={project.id}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Shield size={16} className="text-[#8F6236] shrink-0" />
                      <h3 className="font-serif font-black text-[#1A120C] text-base truncate">
                        {project.name}
                      </h3>
                      <span className={`px-2 py-0.5 text-[8.5px] font-sans font-black uppercase rounded-xs border ${statusBadge.color}`}>
                        {statusBadge.label}
                      </span>
                    </div>

                    <p className="text-xs font-sans text-[#3B2415] line-clamp-1 italic">
                      {project.description || "No official mission brief recorded."}
                    </p>

                    <div className="flex items-center gap-3 text-[10px] font-sans font-bold text-[#5B3922] pt-1">
                      <span className="flex items-center gap-1">
                        <Users size={12} /> 1 Officer
                      </span>
                      <span>• {project.completedTasks}/{project.totalTasks} Objectives</span>
                    </div>
                  </div>

                  {/* Medieval Progress Bar & Link */}
                  <div className="w-full sm:w-48 shrink-0 space-y-2">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-sans font-black text-[#2D1B10]">
                        <span>PROGRESS</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="h-2.5 w-full bg-[#100A07] rounded-xs overflow-hidden border border-[#8F6236] p-0.5">
                        <div
                          className="h-full bg-gradient-to-r from-[#8F6236] via-[#B78B3E] to-[#FFF5D6] transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[9px] font-sans text-[#5B3922]">
                      <span className="flex items-center gap-1">
                        <Clock size={10} /> {new Date(project.updatedAt).toLocaleDateString()}
                      </span>
                      <Link
                        href={`/projects/${project.id}`}
                        className="font-black uppercase text-[#3B2415] hover:text-[#D7B05C] flex items-center gap-0.5"
                      >
                        Open <ArrowRight size={10} />
                      </Link>
                    </div>
                  </div>
                </div>
              </DashboardCard>
            )
          })}
        </div>
      )}
    </DashboardSection>
  )
}