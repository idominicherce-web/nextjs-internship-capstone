// components/task-card.tsx
"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Trash2 } from "lucide-react"

export interface TaskCardData {
  id: string
  title: string
  description: string | null
  listId: string
  position: number
  dueDate?: Date | null
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => onTaskClick(task)}
      className="group p-3 bg-white dark:bg-outer_space-300 rounded-lg border border-french_gray-300 dark:border-payne's_gray-400 shadow-sm flex items-start justify-between gap-2 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-start gap-2 flex-1">
        <button
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()} // Prevent modal opening when dragging
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
          e.stopPropagation() // Prevent modal opening when deleting
          onDeleteTask(task.id, projectId)
        }}
        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-opacity p-1 rounded"
        title="Delete task"
      >
        <Trash2 size={14} />
      </button>
    </div>
  )
}