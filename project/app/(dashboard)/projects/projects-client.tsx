// app/(dashboard)/projects/projects-client.tsx
"use client"

import { useState, useMemo } from "react"
import { CreateProjectModal } from "@/components/modals/create-project-modal"
import { ProjectCard, ProjectData } from "@/components/project-card"
import { Plus, Search, Filter, Folder, X, ArrowUpDown } from "lucide-react"

interface ProjectsClientProps {
  initialProjects: ProjectData[]
}

type SortOption = "newest" | "oldest" | "alphabetical"

export function ProjectsClient({ initialProjects }: ProjectsClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("newest")
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Combined search & filter memoization
  const filteredProjects = useMemo(() => {
    let result = [...initialProjects]

    // 1. Text Search Filter (Matches Title or Description)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (project) =>
          project.name.toLowerCase().includes(q) ||
          project.description?.toLowerCase().includes(q)
      )
    }

    // 2. Sorting Logic
    result.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
      if (sortBy === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      }
      if (sortBy === "alphabetical") {
        return a.name.localeCompare(b.name)
      }
      return 0
    })

    return result
  }, [initialProjects, searchQuery, sortBy])

  const handleResetFilters = () => {
    setSearchQuery("")
    setSortBy("newest")
  }

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
          <li>• Task 4.6 / 5.4: Add project search, filtering, and sorting capabilities</li>
        </ul>
      </div>

      {/* Search and Filter Control Bar */}
      <div className="flex flex-col sm:flex-row gap-4 relative">
        {/* Input Field */}
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-payne's_gray-500 dark:text-french_gray-400"
            size={16}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by name or description..."
            className="w-full pl-10 pr-10 py-2 bg-white dark:bg-outer_space-500 border border-french_gray-300 dark:border-payne's_gray-400 rounded-lg text-outer_space-500 dark:text-platinum-500 placeholder-payne's_gray-500 dark:placeholder-french_gray-400 focus:outline-none focus:ring-2 focus:ring-blue_munsell-500 text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-platinum-500"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filter / Sort Button Toggle */}
        <div className="relative">
          <button
            onClick={() => setIsFilterOpen((prev) => !prev)}
            className={`inline-flex items-center justify-center px-4 py-2 border rounded-lg text-sm font-medium transition-colors w-full sm:w-auto ${
              isFilterOpen || sortBy !== "newest"
                ? "border-blue_munsell-500 text-blue_munsell-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-french_gray-300 dark:border-payne's_gray-400 text-outer_space-500 dark:text-platinum-500 hover:bg-gray-100 dark:hover:bg-outer_space-400"
            }`}
          >
            <Filter size={16} className="mr-2" />
            Sort & Filter
          </button>

          {/* Filter Dropdown Popover */}
          {isFilterOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-outer_space-500 rounded-lg border border-french_gray-300 dark:border-payne's_gray-400 p-4 shadow-xl z-20 space-y-4">
              <div>
                <label className="text-xs font-semibold text-payne's_gray-500 dark:text-french_gray-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                  <ArrowUpDown size={12} /> Sort By
                </label>
                <div className="space-y-1">
                  {[
                    { id: "newest", label: "Newest First" },
                    { id: "oldest", label: "Oldest First" },
                    { id: "alphabetical", label: "Alphabetical (A-Z)" },
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setSortBy(option.id as SortOption)}
                      className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${
                        sortBy === option.id
                          ? "bg-blue_munsell-500 text-white font-medium"
                          : "text-outer_space-500 dark:text-platinum-500 hover:bg-slate-100 dark:hover:bg-outer_space-400"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {(searchQuery || sortBy !== "newest") && (
                <div className="pt-2 border-t border-french_gray-300 dark:border-payne's_gray-400">
                  <button
                    onClick={handleResetFilters}
                    className="w-full text-center text-xs text-red-500 hover:text-red-600 font-medium py-1"
                  >
                    Reset all filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Filter Status Badge */}
      {(searchQuery || sortBy !== "newest") && (
        <div className="flex items-center gap-2 text-xs text-payne's_gray-500 dark:text-french_gray-400">
          <span>Showing {filteredProjects.length} of {initialProjects.length} projects</span>
          <button
            onClick={handleResetFilters}
            className="text-blue_munsell-500 hover:underline font-medium"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12 rounded-lg border border-dashed border-french_gray-300 dark:border-payne's_gray-400 bg-white dark:bg-outer_space-500">
          <Folder className="mx-auto h-12 w-12 text-payne's_gray-500 dark:text-french_gray-400 mb-3" />
          <h3 className="text-lg font-medium text-outer_space-500 dark:text-platinum-500">
            No projects found
          </h3>
          <p className="text-sm text-payne's_gray-500 dark:text-french_gray-400 mt-1 mb-4">
            {searchQuery
              ? `No projects matching "${searchQuery}"`
              : "Get started by creating your first project!"}
          </p>
          {searchQuery ? (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 rounded-md border border-french_gray-300 dark:border-payne's_gray-400 px-4 py-2 text-sm font-medium text-outer_space-500 dark:text-platinum-500 hover:bg-slate-100 dark:hover:bg-outer_space-400"
            >
              Clear Search
            </button>
          ) : (
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

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}