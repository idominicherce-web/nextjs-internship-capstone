// app/(dashboard)/projects/projects-client.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { CreateProjectModal } from "@/components/modals/create-project-modal"
import { Plus, Folder, Calendar, Search } from "lucide-react"

interface Project {
  id: string
  name: string
  description: string | null
  createdAt: Date
}

interface ProjectsClientProps {
  initialProjects: Project[]
}

export function ProjectsClient({ initialProjects }: ProjectsClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredProjects = initialProjects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-outer_space-500 dark:text-platinum-500">
            Projects
          </h1>
          <p className="text-sm text-payne's_gray-500 dark:text-french_gray-400">
            Manage and track all your project workspaces
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-blue_munsell-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue_munsell-600 transition-colors shadow-sm"
        >
          <Plus size={16} /> Create Project
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-payne's_gray-500 dark:text-french_gray-400" size={18} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search projects..."
          className="w-full pl-10 pr-4 py-2 text-sm rounded-md border border-french_gray-300 dark:border-payne's_gray-400 dark:bg-outer_space-400 dark:text-platinum-500 focus:outline-none focus:ring-2 focus:ring-blue_munsell-500"
        />
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12 rounded-lg border border-dashed border-french_gray-300 dark:border-payne's_gray-400">
          <Folder className="mx-auto h-12 w-12 text-payne's_gray-500 dark:text-french_gray-400 mb-3" />
          <h3 className="text-lg font-medium text-outer_space-500 dark:text-platinum-500">
            No projects found
          </h3>
          <p className="text-sm text-payne's_gray-500 dark:text-french_gray-400 mt-1 mb-4">
            {searchQuery ? "Try matching a different search term" : "Get started by creating your first project!"}
          </p>
          {!searchQuery && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-md bg-blue_munsell-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue_munsell-600"
            >
              <Plus size={16} /> Create Project
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="group rounded-lg border border-french_gray-300 dark:border-payne's_gray-400 bg-white dark:bg-outer_space-500 p-5 shadow-sm transition-all hover:shadow-md hover:border-blue_munsell-500 dark:hover:border-blue_munsell-500"
            >
              <div className="flex items-start justify-between">
                <h2 className="font-semibold text-lg text-outer_space-500 dark:text-platinum-500 group-hover:text-blue_munsell-500 transition-colors">
                  {project.name}
                </h2>
              </div>
              <p className="text-sm text-payne's_gray-500 dark:text-french_gray-400 mt-2 line-clamp-2 min-h-[2.5rem]">
                {project.description || "No description provided."}
              </p>
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-french_gray-200 dark:border-payne's_gray-400 text-xs text-payne's_gray-500 dark:text-french_gray-400">
                <Calendar size={14} />
                Created {new Date(project.createdAt).toLocaleDateString()}
              </div>
            </Link>
          ))}
        </div>
      )}

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}