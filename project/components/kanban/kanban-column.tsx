"use client"

import type React from "react"
import { useDroppable } from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { GripVertical, Trash2 } from "lucide-react"
import { TaskCard, TaskCardData } from "@/components/kanban/task-card"
import { deleteTask } from "@/actions/tasks" // 👈 Added missing task deletion action

export interface List {
  id: string
  name: string
  tasks: TaskCardData[]
}

// Dual-label mapping for kingdom flavor subtext
const KINGDOM_SUBTEXT_MAP: Record<string, string> = {
  backlog: "Royal Archives",
  "to do": "Awaiting Orders",
  todo: "Awaiting Orders",
  "in progress": "Active Campaign",
  doing: "Active Campaign",
  "in review": "High Council Review",
  review: "High Council Review",
  done: "Completed Campaign",
  completed: "Completed Campaign",
}

function getKingdomSubtext(columnName: string): string {
  const normalized = columnName.toLowerCase().trim()
  return KINGDOM_SUBTEXT_MAP[normalized] || "Strategic Command"
}

interface KanbanColumnProps {
  list: List
  projectId: string
  taskInputs: Record<string, string>
  setTaskInputs: React.Dispatch<React.SetStateAction<Record<string, string>>>
  deleteList: (id: string, projectId: string) => void
  handleAddTask: (listId: string) => void
  onTaskClick: (task: TaskCardData) => void
}

export function KanbanColumn({
  list,
  projectId,
  taskInputs,
  setTaskInputs,
  deleteList,
  handleAddTask,
  onTaskClick,
}: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id: list.id,
    data: { type: "Column", list },
  })

  const isDoneColumn =
    list.name.toLowerCase().includes("done") ||
    list.name.toLowerCase().includes("complete")

  const kingdomSubtext = getKingdomSubtext(list.name)

  return (
    <div className="flex-shrink-0 w-80">
      <div
        className={`rounded-xs border-2 shadow-2xl overflow-hidden flex flex-col transition-all ${
          isDoneColumn
            ? "border-emerald-800/80 bg-gradient-to-b from-[#1A2E22] via-[#121F17] to-[#0D1610]"
            : "border-[#8F6236]/80 bg-gradient-to-b from-[#2D1B10] via-[#1A120C] to-[#15100C]"
        }`}
      >
        {/* Column Header Plank */}
        <div className="p-3 border-b-2 border-[#4A2C1D] bg-[#15100C]/90 flex items-center justify-between">
          <div className="flex items-center space-x-2.5 min-w-0">
            <GripVertical size={16} className="text-[#8F6236] cursor-grab shrink-0" />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-serif font-black text-sm uppercase tracking-wider text-[#F8EEDB] truncate">
                  {list.name}
                </h3>
                <span className="px-1.5 py-0.2 text-[9px] font-sans font-black bg-[#3B2415] text-[#D7B05C] rounded-xs border border-[#8F6236] shrink-0">
                  {list.tasks?.length || 0}
                </span>
              </div>
              {/* Dual-Label Kingdom Subtext */}
              <p className="text-[9.5px] font-serif italic text-[#D7B05C]/60 truncate leading-tight">
                {kingdomSubtext}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => deleteList(list.id, projectId)}
            className="text-[#8F6236] hover:text-rose-400 transition-colors p-1 cursor-pointer shrink-0"
            title="Delete column"
          >
            <Trash2 size={15} />
          </button>
        </div>

        {/* Task Container */}
        <SortableContext
          items={list.tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <div ref={setNodeRef} className="p-3 space-y-3 min-h-[260px]">
            {list.tasks.length === 0 ? (
              <div className="p-4 border border-dashed border-[#8F6236]/30 bg-[#15100C]/40 text-center rounded-xs my-2">
                <p className="text-[11px] font-serif italic text-[#D7B05C]/50">
                  No objectives assigned.
                </p>
                <p className="text-[9px] font-sans text-[#D7B05C]/30 mt-0.5">
                  Drag a task here or add a new one below.
                </p>
              </div>
            ) : (
              list.tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  projectId={projectId}
                  onTaskClick={onTaskClick}
                  onDeleteTask={deleteTask} // 👈 Fixed: Now correctly calls deleteTask action
                />
              ))
            )}

            {/* Quick Task Creator */}
            <div className="pt-2 border-t border-[#4A2C1D]">
              <input
                type="text"
                value={taskInputs[list.id] || ""}
                onChange={(e) =>
                  setTaskInputs((prev) => ({
                    ...prev,
                    [list.id]: e.target.value,
                  }))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddTask(list.id)
                  }
                }}
                placeholder="＋ Add task and press Enter..."
                className="w-full px-3 py-2 bg-[#FAF0D7] border border-[#8F6236] rounded-xs text-xs font-sans font-extrabold text-[#1A120C] placeholder-[#8F6236]/80 focus:outline-none focus:border-[#D7B05C] shadow-inner"
              />
            </div>
          </div>
        </SortableContext>
      </div>
    </div>
  )
}