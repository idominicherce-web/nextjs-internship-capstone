// app/(dashboard)/projects/projects-client.tsx
"use client"

import { useState } from "react"
import { CreateProjectModal } from "@/components/modals/create-project-modal"
import { ProjectCard, ProjectData } from "@/components/project-card"
import { Plus, Search, Filter, Folder } from "lucide-react"

interface ProjectsClientProps {
  initialProjects: ProjectData[]
}

export function ProjectsClient({ initialProjects }: ProjectsClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredProjects = initialProjects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-outer_space-500 dark:text-platinum-500">
            Projects
          </h1>
          <p className="text-payne's_gray-500 dark:text-french_gray-500 mt-1">
            Manage and organize your team projects
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue_munsell-500 text-white rounded-lg hover:bg-blue_munsell-600 transition-colors shadow-sm font-medium text-sm"
        >
          <Plus size={18} />
          New Project
        </button>
      </div>

      {/* Implementation Tasks Banner */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
          📋 Projects Page Implementation Tasks
        </h3>
        <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
          <li>• Task 4.1: Implement project CRUD operations</li>
          <li>• Task 4.2: Create project listing and dashboard interface</li>
          <li>• Task 4.5: Design and implement project cards and layouts</li>
          <li>• Task 4.6: Add project and task search/filtering capabilities</li>
        </ul>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-payne's_gray-500 dark:text-french_gray-400"
            size={16}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-outer_space-500 border border-french_gray-300 dark:border-payne's_gray-400 rounded-lg text-outer_space-500 dark:text-platinum-500 placeholder-payne's_gray-500 dark:placeholder-french_gray-400 focus:outline-none focus:ring-2 focus:ring-blue_munsell-500 text-sm"
          />
        </div>
        <button className="inline-flex items-center justify-center px-4 py-2 border border-french_gray-300 dark:border-payne's_gray-400 text-outer_space-500 dark:text-platinum-500 rounded-lg hover:bg-gray-100 dark:hover:bg-outer_space-400 transition-colors text-sm font-medium">
          <Filter size={16} className="mr-2" />
          Filter
        </button>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12 rounded-lg border border-dashed border-french_gray-300 dark:border-payne's_gray-400 bg-white dark:bg-outer_space-500">
          <Folder className="mx-auto h-12 w-12 text-payne's_gray-500 dark:text-french_gray-400 mb-3" />
          <h3 className="text-lg font-medium text-outer_space-500 dark:text-platinum-500">
            No projects found
          </h3>
          <p className="text-sm text-payne's_gray-500 dark:text-french_gray-400 mt-1 mb-4">
            {searchQuery
              ? "Try matching a different search term"
              : "Get started by creating your first project!"}
          </p>
          {!searchQuery && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-md bg-blue_munsell-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue_munsell-600"
            >
              <Plus size={16} /> New Project
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      {/* Component Reference Guide */}
      <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
          📁 Components to Implement
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div>
            <strong>components/project-card.tsx</strong>
            <p>Project display component with progress, members, and actions</p>
          </div>
          <div>
            <strong>components/modals/create-project-modal.tsx</strong>
            <p>Modal for creating new projects with form validation</p>
          </div>
          <div>
            <strong>hooks/use-projects.ts</strong>
            <p>Custom hook for project data fetching and mutations</p>
          </div>
          <div>
            <strong>lib/db/schema.ts</strong>
            <p>Database schema for projects, lists, and tasks</p>
          </div>
        </div>
      </div>

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}