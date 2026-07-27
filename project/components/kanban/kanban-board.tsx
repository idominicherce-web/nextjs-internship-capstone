// components/kanban-board.tsx
"use client"

import { useState, useEffect } from "react"
import { createList, deleteList } from "@/actions/lists"
import { createTask, deleteTask, reorderTasks } from "@/actions/tasks"
import { TaskCard, TaskCardData } from "@/components/kanban/task-card"
import { TaskDetailModal } from "@/components/modals/task-detail-modal"
import { Plus, Trash2, Loader2, GripVertical, ShieldAlert } from "lucide-react"
import { getUsers } from "@/actions/users"

import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"

interface List {
  id: string
  name: string
  tasks: TaskCardData[]
}

interface KanbanBoardProps {
  projectId: string
  initialLists?: List[]
}

function KanbanColumn({
  list,
  projectId,
  taskInputs,
  setTaskInputs,
  deleteList,
  handleAddTask,
  onTaskClick,
}: {
  list: List
  projectId: string
  taskInputs: Record<string, string>
  setTaskInputs: React.Dispatch<React.SetStateAction<Record<string, string>>>
  deleteList: (id: string, projectId: string) => void
  handleAddTask: (listId: string) => void
  onTaskClick: (task: TaskCardData) => void
}) {
  const { setNodeRef } = useDroppable({
    id: list.id,
    data: { type: "Column", list },
  })

  const isDoneColumn =
    list.name.toLowerCase().includes("done") ||
    list.name.toLowerCase().includes("complete")

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
        <div className="p-3.5 border-b-2 border-[#4A2C1D] bg-[#15100C]/90 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <GripVertical size={16} className="text-[#8F6236] cursor-grab" />
            <h3 className="font-serif font-black text-sm uppercase tracking-wider text-[#F8EEDB]">
              {list.name}
            </h3>
            <span className="px-2 py-0.5 text-[9px] font-sans font-black bg-[#3B2415] text-[#D7B05C] rounded-xs border border-[#8F6236]">
              {list.tasks?.length || 0}
            </span>
          </div>

          <button
            onClick={() => deleteList(list.id, projectId)}
            className="text-[#8F6236] hover:text-rose-400 transition-colors p-1"
            title="Delete column"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <SortableContext
          items={list.tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <div ref={setNodeRef} className="p-3 space-y-3 min-h-[260px]">
            {list.tasks.length === 0 ? (
              <div className="p-4 border border-dashed border-[#8F6236]/30 bg-[#15100C]/40 text-center rounded-xs my-2">
                <p className="text-[11px] font-serif italic text-[#D7B05C]/50">
                  No tasks assigned.
                </p>
                <p className="text-[9px] font-sans text-[#D7B05C]/30 mt-0.5">
                  Drag a task here or create a new one below.
                </p>
              </div>
            ) : (
              list.tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  projectId={projectId}
                  onTaskClick={onTaskClick}
                  onDeleteTask={deleteTask}
                />
              ))
            )}

            {/* Parchment Add Task Input */}
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

export function KanbanBoard({ projectId, initialLists = [] }: KanbanBoardProps) {
  const [listsState, setListsState] = useState<List[]>(initialLists)
  const [activeTask, setActiveTask] = useState<TaskCardData | null>(null)
  const [editingTask, setEditingTask] = useState<TaskCardData | null>(null)
  const [newListName, setNewListName] = useState("")
  const [taskInputs, setTaskInputs] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [usersList, setUsersList] = useState<{ id: string; name: string | null; email: string }[]>([])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    setListsState(initialLists)
  }, [initialLists])

  useEffect(() => {
    setIsMounted(true)

    async function fetchUsers() {
      const res = await getUsers()
      if (res.success && res.data) {
        setUsersList(res.data)
      }
    }

    fetchUsers()
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  )

  const handleAddList = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newListName.trim()) return

    setIsLoading(true)
    await createList(projectId, newListName)
    setNewListName("")
    setIsLoading(false)
  }

  const handleAddTask = async (listId: string) => {
    const taskTitle = taskInputs[listId]
    if (!taskTitle?.trim()) return

    setIsLoading(true)
    await createTask(listId, projectId, taskTitle)
    setTaskInputs((prev) => ({ ...prev, [listId]: "" }))
    setIsLoading(false)
  }

  const handleDragStart = (event: DragStartEvent) => {
    const taskData = event.active.data.current?.task as TaskCardData | undefined
    if (taskData) {
      setActiveTask(taskData)
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeTaskId = active.id as string
    const overId = over.id as string

    const sourceList = listsState.find((l) =>
      l.tasks.some((t) => t.id === activeTaskId)
    )
    const targetList = listsState.find(
      (l) => l.id === overId || l.tasks.some((t) => t.id === overId)
    )

    if (!sourceList || !targetList || sourceList.id === targetList.id) return

    setListsState((prevLists) => {
      const activeTaskItem = sourceList.tasks.find((t) => t.id === activeTaskId)
      if (!activeTaskItem) return prevLists

      return prevLists.map((list) => {
        if (list.id === sourceList.id) {
          return {
            ...list,
            tasks: list.tasks.filter((t) => t.id !== activeTaskId),
          }
        }
        if (list.id === targetList.id) {
          return {
            ...list,
            tasks: [...list.tasks, { ...activeTaskItem, listId: targetList.id }],
          }
        }
        return list
      })
    })
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const activeTaskId = active.id as string
    const overId = over.id as string

    const targetList = listsState.find(
      (l) => l.id === overId || l.tasks.some((t) => t.id === overId)
    )

    if (!targetList) return

    const taskUpdates = targetList.tasks.map((task, index) => ({
      id: task.id,
      listId: targetList.id,
      position: index,
    }))

    await reorderTasks(taskUpdates, projectId)
  }

  if (!isMounted) return null

  return (
    <div className="space-y-6">
      {/* Create New Column Control Plank */}
      <div className="p-4 rounded-xs border-2 border-[#8F6236]/70 bg-gradient-to-r from-[#2D1B10] via-[#1A120C] to-[#2D1B10] shadow-xl flex flex-col sm:flex-row items-center gap-3">
        <form onSubmit={handleAddList} className="flex gap-3 w-full max-w-xl">
          <input
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="New strategy column name (e.g. Vanguard, Operations)..."
            className="flex-1 px-4 py-2.5 bg-[#FAF0D7] border-2 border-[#8F6236] rounded-xs text-xs sm:text-sm font-sans font-extrabold text-[#1A120C] placeholder-[#8F6236]/70 focus:outline-none focus:border-[#D7B05C] shadow-inner"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center px-5 py-2.5 border-2 border-[#D7B05C] bg-gradient-to-b from-[#5B3922] via-[#3B2415] to-[#1A120C] text-[#FFF5D6] font-sans text-xs font-black uppercase tracking-[0.15em] rounded-xs shadow-md hover:border-[#FFF5D6] hover:shadow-[0_0_20px_rgba(215,176,92,0.4)] transition-all cursor-pointer disabled:opacity-50 shrink-0"
          >
            {isLoading ? (
              <Loader2 className="animate-spin text-[#D7B05C] mr-1.5" size={16} />
            ) : (
              <Plus size={16} className="text-[#D7B05C] mr-1.5" />
            )}
            <span>Add Column</span>
          </button>
        </form>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {/* Strategy War Board Outer Frame */}
        <div className="relative rounded-xs border-4 border-[#3B2415] bg-gradient-to-b from-[#4A2C1D] via-[#2D1B10] to-[#15100C] p-4 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden">
          
          {/* Inner Bevel Corner Fittings */}
          <div className="absolute left-1 top-1 z-30 h-3.5 w-3.5 border border-black bg-gradient-to-br from-[#D7B05C] to-[#8F6236]" />
          <div className="absolute right-1 top-1 z-30 h-3.5 w-3.5 border border-black bg-gradient-to-br from-[#D7B05C] to-[#8F6236]" />
          <div className="absolute bottom-1 left-1 z-30 h-3.5 w-3.5 border border-black bg-gradient-to-br from-[#D7B05C] to-[#8F6236]" />
          <div className="absolute bottom-1 right-1 z-30 h-3.5 w-3.5 border border-black bg-gradient-to-br from-[#D7B05C] to-[#8F6236]" />

          {listsState.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-[#8F6236]/40 bg-[#15100C] rounded-xs space-y-2">
              <ShieldAlert size={32} className="mx-auto text-[#D7B05C]/50" />
              <h3 className="text-lg font-serif font-black text-[#F8EEDB]">
                No Strategy Columns Created Yet
              </h3>
              <p className="text-xs font-sans text-[#D7B05C]/70 max-w-sm mx-auto">
                Type a column name above to start organizing your project tasks on the war table.
              </p>
            </div>
          ) : (
            <div className="flex space-x-6 overflow-x-auto pb-4 relative z-20 scrollbar-thin scrollbar-thumb-[#8F6236]">
              {listsState.map((list) => (
                <KanbanColumn
                  key={list.id}
                  list={list}
                  projectId={projectId}
                  taskInputs={taskInputs}
                  setTaskInputs={setTaskInputs}
                  deleteList={deleteList}
                  handleAddTask={handleAddTask}
                  onTaskClick={(task) => setEditingTask(task)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Drag Overlay parchment note feel */}
        <DragOverlay>
          {activeTask ? (
            <div className="p-3 bg-[#FAF0D7] border-2 border-[#D7B05C] text-[#1A120C] rounded-xs shadow-2xl opacity-95 -rotate-2 scale-105">
              <h4 className="font-serif font-black text-xs">
                {activeTask.title}
              </h4>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Task Editing Detail Modal */}
      <TaskDetailModal
        task={editingTask}
        projectId={projectId}
        users={usersList}
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
      />
    </div>
  )
}