"use client"

import Link from "next/link"
import { Shield, ArrowRight, User, Calendar } from "lucide-react"

export interface ProjectData {
  id: string
  name: string
  slug?: string | null
  description: string | null
  createdAt: Date
  updatedAt: Date
  lists?: Array<{
    tasks: Array<{ id: string; completed?: boolean }>
  }>
}

interface LeatherProjectCardProps {
  project: ProjectData
}

export function LeatherProjectCard({ project }: LeatherProjectCardProps) {
  let totalTasks = 0
  let completedTasks = 0

  if (project.lists) {
    project.lists.forEach((list) => {
      list.tasks.forEach((t) => {
        totalTasks++
        if (t.completed) completedTasks++
      })
    })
  }

  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  // Fallback to project.id if project.slug is missing or null
  const projectHref = `/projects/${project.slug || project.id}`

  return (
    <div className="group relative p-5 rounded-xs border-4 border-[#3B2415] bg-gradient-to-b from-[#2D1B10] via-[#1A120C] to-[#100A07] shadow-2xl transition-all duration-200 hover:-translate-y-1 hover:border-[#D7B05C] hover:shadow-[0_12px_30px_rgba(215,176,92,0.3)] flex flex-col justify-between overflow-hidden">
      {/* Corner Brackets */}
      <div className="absolute left-1 top-1 w-3 h-3 border border-black bg-gradient-to-br from-[#D7B05C] to-[#8F6236]" />
      <div className="absolute right-1 top-1 w-3 h-3 border border-black bg-gradient-to-br from-[#D7B05C] to-[#8F6236]" />
      <div className="absolute bottom-1 left-1 w-3 h-3 border border-black bg-gradient-to-br from-[#D7B05C] to-[#8F6236]" />
      <div className="absolute bottom-1 right-1 w-3 h-3 border border-black bg-gradient-to-br from-[#D7B05C] to-[#8F6236]" />

      <div className="space-y-4 relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-[#4A2C1D] pb-3">
          <Link href={projectHref} className="flex items-center space-x-3 group/title">
            <div className="p-2.5 rounded-xs border border-[#D7B05C]/50 bg-[#15100C] text-[#D7B05C] group-hover/title:border-[#D7B05C] transition-colors shadow-md">
              <Shield size={20} />
            </div>
            <div>
              <h3 className="font-serif font-black text-base text-[#F8EEDB] group-hover/title:text-[#D7B05C] transition-colors line-clamp-1">
                {project.name}
              </h3>
              <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#D7B05C]/70">
                Project <span className="italic font-serif font-normal text-[#D7B05C]/50">• quest Dossier</span>
              </p>
            </div>
          </Link>

          <span className="px-2 py-0.5 text-[9px] font-sans font-black uppercase bg-[#3B2415] text-[#D7B05C] rounded-xs border border-[#8F6236]">
            Active
          </span>
        </div>

        {/* Description */}
        <p className="text-xs font-sans text-[#D7B05C]/80 line-clamp-2 italic min-h-[2.5rem]">
          {project.description || "No project description provided."}
        </p>

        {/* Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-[10px] font-sans font-black text-[#D7B05C]">
            <span>PROGRESS ({completedTasks} / {totalTasks} TASKS)</span>
            <span>{progress}%</span>
          </div>
          <div className="h-3.5 w-full bg-[#100A07] rounded-xs overflow-hidden border-2 border-[#8F6236] p-0.5 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-[#8F6236] via-[#B78B3E] to-[#FFF5D6] rounded-xs transition-all duration-500 shadow-[0_0_10px_rgba(215,176,92,0.6)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Info Strip */}
        <div className="grid grid-cols-2 gap-2 text-[10px] font-sans text-[#D7B05C]/70 pt-2 border-t border-[#4A2C1D]/60">
          <span className="flex items-center gap-1">
            <User size={12} className="text-[#D7B05C]" /> Owner: Dominic
          </span>
          <span className="flex items-center gap-1 text-right justify-end">
            <Calendar size={12} className="text-[#D7B05C]" /> Updated: {new Date(project.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Dual-Label Action Button */}
      <div className="mt-5 pt-3 border-t border-[#4A2C1D] relative z-10">
        <Link
          href={projectHref}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 border border-[#D7B05C]/80 bg-gradient-to-b from-[#5B3922] via-[#3B2415] to-[#1A120C] text-[#FFF5D6] rounded-xs group-hover:border-[#FFF5D6] group-hover:shadow-[0_0_20px_rgba(215,176,92,0.4)] transition-all cursor-pointer"
        >
          <div className="text-center">
            <span className="block text-xs font-sans font-black uppercase tracking-[0.15em] leading-tight">
              Open Project
            </span>
            <span className="block text-[8.5px] font-serif italic text-[#D7B05C]/80">
              Enter the War Room
            </span>
          </div>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  )
}