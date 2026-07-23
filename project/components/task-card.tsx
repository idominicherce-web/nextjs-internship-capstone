// components/task-card.tsx
"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Trash2, Calendar } from "lucide-react"

export interface TaskCardData {
  id: string
  title: string
  description: string | null
  listId: string
  position: number
  dueDate?: Date | string | null
  userId?: string | null
  user?: {
    name: string | null
    email: string
  } | null
}

interface TaskCardProps {
  task: TaskCardData
  projectId: string
  onTaskClick: (task: TaskCardData) => void
  onDeleteTask: (taskId: string, projectId: string) => void
}

export function TaskCard({
  task,
  projectId,
  onTaskClick,
  onDeleteTask,
}: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { task } })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  // Calculate if overdue
  const isOverdue = task.dueDate
    ? new Date(task.dueDate) < new Date(new Date().setHours(0, 0, 0, 0))
    : false

  // Format initial for avatar
  const assigneeName = task.user?.name || task.user?.email || ""
  const avatarInitial = assigneeName ? assigneeName.charAt(0).toUpperCase() : "?"

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => onTaskClick(task)}
      className="group p-3 bg-white dark:bg-outer_space-300 rounded-lg border border-french_gray-300 dark:border-payne's_gray-400 shadow-sm flex flex-col justify-between gap-2 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 flex-1">
          <button
            {...attributes}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
            className="mt-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-platinum-500 cursor-grab active:cursor-grabbing"
            title="Drag to reorder"
          >
            <GripVertical size={14} />
          </button>
          <div>
            <h4 className="font-medium text-slate-800 dark:text-platinum-500 text-sm">
              {task.title}
            </h4>
            {task.description && (
              <p className="text-xs text-slate-500 dark:text-french_gray-400 mt-1 line-clamp-2">
                {task.description}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDeleteTask(task.id, projectId)
          }}
          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-opacity p-1 rounded"
          title="Delete task"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Task Footer Meta (Assignee & Due Date) */}
      {(task.dueDate || task.userId) && (
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-payne's_gray-400 mt-1 text-xs">
          {task.dueDate ? (
            <div
              className={`flex items-center gap-1 font-medium px-1.5 py-0.5 rounded ${
                isOverdue
                  ? "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                  : "text-slate-500 dark:text-french_gray-400"
              }`}
            >
              <Calendar size={12} />
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          ) : (
            <div></div>
          )}

          {task.user && (
            <div
              className="w-6 h-6 rounded-full bg-blue_munsell-500 text-white font-semibold flex items-center justify-center text-[10px] shadow-sm"
              title={`Assigned to ${assigneeName}`}
            >
              {avatarInitial}
            </div>
          )}
        </div>
      )}
    </div>
  )
}