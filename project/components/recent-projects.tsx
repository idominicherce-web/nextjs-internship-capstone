"use client"

import Link from "next/link"
import { DashboardSection } from "@/components/layout/dashboard-section"
import { DashboardCard } from "@/components/layout/dashboard-card"
import { FolderKanban, ArrowRight, Users, Clock, CheckCircle2 } from "lucide-react"

interface ProjectItem {
  id: string
  name: string
  slug?: string | null
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
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-[#4A2C1D] pb-3 mb-4">
        <div className="flex items-center gap-2 text-[#D7B05C]">
          <FolderKanban size={18} />
          <h2 className="font-serif font-black uppercase text-sm sm:text-base tracking-widest text-[#F8EEDB]">
            Active Campaign Dossiers
          </h2>
        </div>
        <Link
          href="/projects"
          className="text-xs font-sans font-bold text-[#D7B05C] hover:text-[#FFF5D6] transition-colors flex items-center gap-1 group"
        >
          View Archives{" "}
          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="p-8 text-center text-[#D7B05C]/70 font-serif italic border border-dashed border-[#8F6236]/40 rounded-xs">
          No active campaign dossiers recorded in the ledger.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {projects.map((project) => {
            const progress =
              project.totalTasks > 0
                ? Math.round((project.completedTasks / project.totalTasks) * 100)
                : 0

            const statusBadge =
              progress === 100
                ? { label: "Completed", color: "bg-emerald-950/90 text-emerald-300 border-emerald-700/80" }
                : progress > 50
                ? { label: "In Testing", color: "bg-sky-950/90 text-sky-300 border-sky-700/80" }
                : progress > 0
                ? { label: "In Development", color: "bg-amber-950/90 text-amber-300 border-amber-700/80" }
                : { label: "Planning", color: "bg-[#2D1B10] text-[#D7B05C] border-[#8F6236]" }

            const projectHref = `/projects/${project.slug || project.id}`

            return (
              <DashboardCard key={project.id}>
                {/* 3-Column Modern Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-4 py-1">
                  
                  {/* REGION 1: Left - Primary Information (Columns 1 to 6) */}
                  <div className="md:col-span-6 space-y-1.5 min-w-0">
                    {/* Header Row: Title + Status Pill */}
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={projectHref}
                        className="font-serif font-black text-[#1A120C] hover:text-[#5B3922] transition-colors text-base sm:text-lg leading-snug truncate"
                      >
                        {project.name}
                      </Link>

                      <span
                        className={`inline-flex items-center px-2 py-0.5 text-[9px] font-sans font-black uppercase tracking-wider rounded-xs border shadow-xs ${statusBadge.color}`}
                      >
                        {statusBadge.label}
                      </span>
                    </div>

                    {/* Mission Brief Description */}
                    <p className="text-xs font-sans text-[#3B2415]/85 line-clamp-1 italic">
                      {project.description || "No official mission brief recorded."}
                    </p>

                    {/* Metadata Row */}
                    <div className="flex flex-wrap items-center gap-3 text-[10px] font-sans font-semibold text-[#5B3922] pt-0.5">
                      <span className="inline-flex items-center gap-1">
                        <Users size={12} className="text-[#8F6236]" /> 1 Officer
                      </span>
                      <span className="text-[#8F6236]/40">•</span>
                      <span className="inline-flex items-center gap-1">
                        <CheckCircle2 size={12} className="text-[#8F6236]" />
                        {project.completedTasks}/{project.totalTasks} Objectives
                      </span>
                      <span className="text-[#8F6236]/40">•</span>
                      <span className="inline-flex items-center gap-1 text-[#5B3922]/80">
                        <Clock size={11} className="text-[#8F6236]" />
                        {new Date(project.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* REGION 2: Middle - Progress Tracker (Columns 7 to 9) */}
                  <div className="md:col-span-3 space-y-1.5 px-0 md:px-2 border-t md:border-t-0 md:border-l border-[#8F6236]/20 pt-3 md:pt-0">
                    <div className="flex justify-between items-center text-[10px] font-sans font-black tracking-wider text-[#2D1B10]">
                      <span className="uppercase text-[#5B3922]">PROGRESS</span>
                      <span className="font-mono text-xs">{progress}%</span>
                    </div>
                    <div className="h-2.5 w-full bg-[#100A07] rounded-xs overflow-hidden border border-[#8F6236] p-0.5 shadow-inner">
                      <div
                        className="h-full bg-gradient-to-r from-[#8F6236] via-[#B78B3E] to-[#FFF5D6] rounded-2xs transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* REGION 3: Right - Balanced CTA (Columns 10 to 12) */}
                  <div className="md:col-span-3 flex justify-start md:justify-end items-center pt-2 md:pt-0">
                    <Link
                      href={projectHref}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-[#D7B05C] bg-gradient-to-b from-[#3B2415] via-[#2D1B10] to-[#1A120C] text-[#FFF5D6] font-sans text-xs font-black uppercase tracking-wider rounded-xs shadow-sm hover:border-[#FFF5D6] hover:shadow-[0_0_12px_rgba(215,176,92,0.3)] hover:-translate-y-0.5 transition-all cursor-pointer group"
                    >
                      <span>Open Board</span>
                      <ArrowRight
                        size={13}
                        className="text-[#D7B05C] group-hover:translate-x-0.5 transition-transform"
                      />
                    </Link>
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