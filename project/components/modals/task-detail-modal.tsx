// components/modals/task-detail-modal.tsx
"use client"

import { useState, useEffect } from "react"
import { updateTask } from "@/actions/tasks"
import { X, Loader2, Calendar, FileText, CheckCircle, User as UserIcon } from "lucide-react"

interface Task {
  id: string
  title: string
  description: string | null
  dueDate?: Date | string | null
  userId?: string | null
}

interface UserOption {
  id: string
  name: string | null
  email: string
}

interface TaskDetailModalProps {
  task: Task | null
  projectId: string
  isOpen: boolean
  users?: UserOption[]
  onClose: () => void
}

export function TaskDetailModal({
  task,
  projectId,
  isOpen,
  users = [],
  onClose,
}: TaskDetailModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [assignedUserId, setAssignedUserId] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")

  useEffect(() => {
    if (task) {
      setTitle(task.title || "")
      setDescription(task.description || "")
      setDueDate(
        task.dueDate
          ? new Date(task.dueDate).toISOString().split("T")[0]
          : ""
      )
      setAssignedUserId(task.userId || "")
    }
  }, [task])

  if (!isOpen || !task) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setIsLoading(true)
    setSuccessMsg("")

    const result = await updateTask(task.id, projectId, {
      title: title.trim(),
      description: description.trim() || null,
      dueDate: dueDate ? new Date(dueDate) : null,
      userId: assignedUserId || null,
    })

    setIsLoading(false)

    if (result.success) {
      setSuccessMsg("Task updated successfully!")
      setTimeout(() => {
        setSuccessMsg("")
        onClose()
      }, 1000)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg mx-4 rounded-lg bg-white dark:bg-outer_space-500 p-6 shadow-xl border border-french_gray-300 dark:border-payne's_gray-400">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-outer_space-500 dark:text-platinum-500 flex items-center gap-2">
            <FileText size={18} className="text-blue_munsell-500" /> Task Details
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-platinum-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {successMsg && (
          <div className="mb-4 rounded bg-green-50 dark:bg-green-900/20 p-3 text-sm text-green-700 dark:text-green-300 flex items-center gap-2 border border-green-200 dark:border-green-800">
            <CheckCircle size={16} /> {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-outer_space-500 dark:text-platinum-500 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border border-french_gray-300 dark:border-payne's_gray-400 px-3 py-2 text-sm bg-white dark:bg-outer_space-400 text-outer_space-500 dark:text-platinum-500 focus:outline-none focus:ring-2 focus:ring-blue_munsell-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-outer_space-500 dark:text-platinum-500 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Add more details about this task..."
              className="w-full rounded-md border border-french_gray-300 dark:border-payne's_gray-400 px-3 py-2 text-sm bg-white dark:bg-outer_space-400 text-outer_space-500 dark:text-platinum-500 focus:outline-none focus:ring-2 focus:ring-blue_munsell-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-outer_space-500 dark:text-platinum-500 mb-1 items-center gap-1.5">
                <UserIcon size={14} /> Assignee
              </label>
              <select
                value={assignedUserId}
                onChange={(e) => setAssignedUserId(e.target.value)}
                className="w-full rounded-md border border-french_gray-300 dark:border-payne's_gray-400 px-3 py-2 text-sm bg-white dark:bg-outer_space-400 text-outer_space-500 dark:text-platinum-500 focus:outline-none focus:ring-2 focus:ring-blue_munsell-500"
              >
                <option value="">Unassigned</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name || u.email}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-outer_space-500 dark:text-platinum-500 mb-1 items-center gap-1.5">
                <Calendar size={14} /> Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-md border border-french_gray-300 dark:border-payne's_gray-400 px-3 py-2 text-sm bg-white dark:bg-outer_space-400 text-outer_space-500 dark:text-platinum-500 focus:outline-none focus:ring-2 focus:ring-blue_munsell-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 dark:text-french_gray-400 dark:hover:bg-outer_space-400 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 rounded-md bg-blue_munsell-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue_munsell-600 disabled:opacity-50 transition-colors shadow-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={16} /> Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}