// components/recent-projects.tsx
"use client"

import Link from "next/link"
import { Users, Calendar, Folder } from "lucide-react"

export interface RecentProjectData {
  id: string
  name: string
  description: string | null
  updatedAt: Date
  totalTasks: number
  completedTasks: number
}

interface RecentProjectsProps {
  projects: RecentProjectData[]
}

export function RecentProjects({ projects }: RecentProjectsProps) {
  return (
    <div className="bg-white dark:bg-outer_space-500 rounded-lg border border-french_gray-300 dark:border-payne's_gray-400 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-outer_space-500 dark:text-platinum-500">
          Recent Projects
        </h3>
        <Link
          href="/projects"
          className="text-blue_munsell-500 hover:text-blue_munsell-600 text-sm font-medium transition-colors"
        >
          View all
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-8 text-payne's_gray-500 dark:text-french_gray-400">
          <Folder className="mx-auto h-8 w-8 mb-2 text-slate-400" />
          <p className="text-sm">No active projects found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => {
            const progress =
              project.totalTasks > 0
                ? Math.round((project.completedTasks / project.totalTasks) * 100)
                : 0

            return (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="block border border-french_gray-300 dark:border-payne's_gray-400 rounded-lg p-4 hover:border-blue_munsell-500 dark:hover:border-blue_munsell-500 transition-colors"
              >
                <div>
                  <h4 className="font-medium text-outer_space-500 dark:text-platinum-500">
                    {project.name}
                  </h4>
                  <p className="text-sm text-payne's_gray-500 dark:text-french_gray-400 mt-1 line-clamp-1">
                    {project.description || "No description provided."}
                  </p>

                  <div className="flex items-center space-x-4 mt-3 text-xs text-payne's_gray-500 dark:text-french_gray-400">
                    <div className="flex items-center">
                      <Users size={14} className="mr-1" />
                      1 Member
                    </div>
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      Updated {new Date(project.updatedAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-payne's_gray-500 dark:text-french_gray-400">
                        Progress
                      </span>
                      <span className="text-outer_space-500 dark:text-platinum-500 font-medium">
                        {progress}% ({project.completedTasks}/{project.totalTasks} tasks)
                      </span>
                    </div>
                    <div className="w-full bg-french_gray-300 dark:bg-payne's_gray-400 rounded-full h-1.5">
                      <div
                        className="bg-blue_munsell-500 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}