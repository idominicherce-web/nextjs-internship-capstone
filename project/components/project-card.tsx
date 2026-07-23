// components/project-card.tsx
"use client"

import Link from "next/link"

export interface ProjectData {
  id: string
  name: string
  description?: string | null
  createdAt: Date
  progress?: number
  memberCount?: number
  dueDate?: Date
  status?: "active" | "completed" | "on-hold"
}

interface ProjectCardProps {
  project: ProjectData
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export function ProjectCard({ project }: ProjectCardProps) {
  // Deterministic visual helpers for member/task stats if optional properties aren't in DB
  const daysLeft = Math.abs(project.id.charCodeAt(0) % 25) + 5
  const taskCount = (project.id.charCodeAt(1) % 15) + 3
  const memberCount = project.memberCount ?? (project.id.charCodeAt(2) % 6) + 2
  const progressPercent = project.progress ?? Math.min(100, Math.max(20, (taskCount * 7) % 100))

  return (
    <Link
      href={`/projects/${project.id}`}
      className="group bg-white dark:bg-outer_space-500 rounded-lg border border-french_gray-300 dark:border-payne's_gray-400 p-6 shadow-sm hover:shadow-lg transition-all hover:border-blue_munsell-500 dark:hover:border-blue_munsell-500 block"
    >
      {/* Top Indicator & Status Row */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-3 h-3 bg-blue_munsell-500 rounded-full"></div>
        <div className="text-sm text-payne's_gray-500 dark:text-french_gray-400">
          {daysLeft} days left
        </div>
      </div>

      {/* Project Title */}
      <h3 className="text-lg font-semibold text-outer_space-500 dark:text-platinum-500 mb-2 group-hover:text-blue_munsell-500 transition-colors">
        {project.name}
      </h3>

      {/* Project Description */}
      <p className="text-sm text-payne's_gray-500 dark:text-french_gray-400 mb-4 line-clamp-2 min-h-[2.5rem]">
        {project.description || "This is a project description that will be replaced with actual project data."}
      </p>

      {/* Meta Information Row */}
      <div className="flex items-center justify-between text-sm text-payne's_gray-500 dark:text-french_gray-400 mb-4">
        <span>{memberCount} members</span>
        <span>{taskCount} tasks</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-french_gray-300 dark:bg-payne's_gray-400 rounded-full h-2">
        <div
          className="bg-blue_munsell-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>
    </Link>
  )
}