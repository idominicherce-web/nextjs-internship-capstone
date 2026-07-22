// components/modals/create-project-modal.tsx
"use client"

import { useState } from "react"
import { useProjects } from "@/hooks/use-projects"
import { createProjectSchema } from "@/lib/validations"
import { Plus, Loader2, X } from "lucide-react"

interface CreateProjectModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateProjectModal({ isOpen, onClose }: CreateProjectModalProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; description?: string }>({})
  
  const { createProject, isLoading, error: serverError } = useProjects()

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFieldErrors({})

    // Client-side Zod validation
    const validationResult = createProjectSchema.safeParse({ name, description })

    if (!validationResult.success) {
      const formattedErrors = validationResult.error.format()
      setFieldErrors({
        name: formattedErrors.name?._errors[0],
        description: formattedErrors.description?._errors[0],
      })
      return
    }

    // Call project creation Server Action via useProjects hook
    const result = await createProject(validationResult.data)

    if (result.success) {
      setName("")
      setDescription("")
      setFieldErrors({})
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md mx-4 rounded-lg bg-white p-6 shadow-xl dark:bg-outer_space-500 border border-french_gray-300 dark:border-payne's_gray-400">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-outer_space-500 dark:text-platinum-500">
            Create New Project
          </h3>
          <button
            onClick={onClose}
            className="text-payne's_gray-500 hover:text-outer_space-500 dark:text-french_gray-400 dark:hover:text-platinum-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {serverError && (
          <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-outer_space-500 dark:text-platinum-500 mb-1">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Website Redesign"
              className="w-full rounded-md border border-french_gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue_munsell-500 dark:border-payne's_gray-400 dark:bg-outer_space-400 dark:text-platinum-500"
            />
            {fieldErrors.name && (
              <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-outer_space-500 dark:text-platinum-500 mb-1">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the project..."
              rows={3}
              className="w-full rounded-md border border-french_gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue_munsell-500 dark:border-payne's_gray-400 dark:bg-outer_space-400 dark:text-platinum-500 resize-none"
            />
            {fieldErrors.description && (
              <p className="mt-1 text-xs text-red-500">{fieldErrors.description}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-4 py-2 text-sm font-medium text-payne's_gray-500 hover:bg-platinum-800 dark:text-french_gray-400 dark:hover:bg-outer_space-400 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 rounded-md bg-blue_munsell-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue_munsell-600 disabled:opacity-50 transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={16} /> Creating...
                </>
              ) : (
                <>
                  <Plus size={16} /> Create Project
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}