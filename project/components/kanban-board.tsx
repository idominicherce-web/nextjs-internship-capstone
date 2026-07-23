// components/kanban-board.tsx
"use client"

import { useState, useEffect } from "react"
import { createList, deleteList } from "@/actions/lists"
import { createTask, deleteTask, updateTaskPosition } from "@/actions/tasks"
import { Plus, Trash2, Loader2, GripVertical } from "lucide-react"

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
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

interface Task {
  id: string
  title: string
  description: string | null
  listId: string
  position: number
}

interface List {
  id: string
  name: string
  tasks: Task[]
}

interface KanbanBoardProps {
  projectId: string
  initialLists?: List[]
}

// Draggable Task Card Component
function TaskCard({ task, projectId }: { task: Task; projectId: string }) {
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
      className="group p-3 bg-white dark:bg-outer_space-300 rounded-lg border border-french_gray-300 dark:border-payne's_gray-400 shadow-sm flex items-start justify-between gap-2 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-2 flex-1">
        <button
          {...attributes}
          {...listeners}
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
            <p className="text-xs text-slate-500 dark:text-french_gray-400 mt-1">
              {task.description}
            </p>
          )}
        </div>
      </div>
      <button
        onClick={() => deleteTask(task.id, projectId)}
        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-opacity"
      >
        <Trash2 size={14} />
      </button>
    </div>
  )
}

// Droppable Column Component (Allows dropping into empty columns!)
function KanbanColumn({
  list,
  projectId,
  taskInputs,
  setTaskInputs,
  deleteList,
  handleAddTask,
}: {
  list: List
  projectId: string
  taskInputs: Record<string, string>
  setTaskInputs: React.Dispatch<React.SetStateAction<Record<string, string>>>
  deleteList: (id: string, projectId: string) => void
  handleAddTask: (listId: string) => void
}) {
  const { setNodeRef } = useDroppable({
    id: list.id,
    data: { type: "Column", list },
  })

  return (
    <div className="flex-shrink-0 w-80">
      <div className="bg-slate-100 dark:bg-outer_space-400 rounded-lg border border-french_gray-300 dark:border-payne's_gray-400">
        {/* Column Header */}
        <div className="p-4 border-b border-french_gray-300 dark:border-payne's_gray-400">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-800 dark:text-platinum-500 flex items-center">
              {list.name}
              <span className="ml-2 px-2 py-0.5 text-xs bg-slate-200 dark:bg-payne's_gray-400 text-slate-700 dark:text-platinum-500 rounded-full font-medium">
                {list.tasks?.length || 0}
              </span>
            </h3>
            <button
              onClick={() => deleteList(list.id, projectId)}
              className="p-1 text-slate-400 hover:text-red-500 dark:text-french_gray-400 dark:hover:text-red-400 rounded transition-colors"
              title="Delete column"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Droppable Task Area */}
        <SortableContext
          items={list.tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <div ref={setNodeRef} className="p-4 space-y-3 min-h-[250px]">
            {list.tasks.map((task) => (
              <TaskCard key={task.id} task={task} projectId={projectId} />
            ))}

            {/* Add Task Input */}
            <div className="pt-2">
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
                placeholder="+ Add task and press Enter..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-dashed border-slate-300 dark:border-payne's_gray-400 bg-white dark:bg-outer_space-300 text-slate-800 dark:text-platinum-500 placeholder-slate-400 dark:placeholder-french_gray-400 focus:outline-none focus:border-blue_munsell-500"
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
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [newListName, setNewListName] = useState("")
  const [taskInputs, setTaskInputs] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Prevent SSR hydration mismatch for dnd-kit auto-generated IDs
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    setListsState(initialLists)
  }, [initialLists])

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
    const taskData = event.active.data.current?.task as Task | undefined
    if (taskData) {
      setActiveTask(taskData)
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeTaskId = active.id as string
    const overId = over.id as string

    // Find source and target lists
    const sourceList = listsState.find((l) =>
      l.tasks.some((t) => t.id === activeTaskId)
    )
    const targetList = listsState.find(
      (l) => l.id === overId || l.tasks.some((t) => t.id === overId)
    )

    if (!sourceList || !targetList || sourceList.id === targetList.id) return

    // Optimistically update client state while dragging over different columns
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

    // Find target column list
    const targetList = listsState.find(
      (l) => l.id === overId || l.tasks.some((t) => t.id === overId)
    )

    if (!targetList) return

    const overTaskIndex = targetList.tasks.findIndex((t) => t.id === overId)
    const newPosition = overTaskIndex >= 0 ? overTaskIndex : targetList.tasks.length

    // Persist position update to PostgreSQL database
    await updateTaskPosition(activeTaskId, targetList.id, newPosition, projectId)
  }

  if (!isMounted) return null

  return (
    <div className="space-y-6">
      {/* Create New Column Control */}
      <div className="bg-white dark:bg-outer_space-500 p-4 rounded-lg border border-french_gray-300 dark:border-payne's_gray-400 shadow-sm">
        <form onSubmit={handleAddList} className="flex gap-2 max-w-md">
          <input
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="New column name (e.g. To Do)..."
            className="flex-1 rounded-md border border-french_gray-300 dark:border-payne's_gray-400 px-3 py-2 text-sm bg-white dark:bg-outer_space-400 text-outer_space-500 dark:text-platinum-500 focus:outline-none focus:ring-2 focus:ring-blue_munsell-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center gap-1 rounded-md bg-blue_munsell-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue_munsell-600 disabled:opacity-50 transition-colors shadow-sm"
          >
            {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />} Add Column
          </button>
        </form>
      </div>

      {/* DndContext Wrapping Kanban Columns */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="bg-white dark:bg-outer_space-500 rounded-lg border border-french_gray-300 dark:border-payne's_gray-400 p-6 shadow-sm">
          {listsState.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-outer_space-500 dark:text-platinum-500 mb-2">
                No columns created yet
              </h3>
              <p className="text-sm text-payne's_gray-500 dark:text-french_gray-400">
                Type a column name above to start organizing your project tasks.
              </p>
            </div>
          ) : (
            <div className="flex space-x-6 overflow-x-auto pb-4">
              {listsState.map((list) => (
                <KanbanColumn
                  key={list.id}
                  list={list}
                  projectId={projectId}
                  taskInputs={taskInputs}
                  setTaskInputs={setTaskInputs}
                  deleteList={deleteList}
                  handleAddTask={handleAddTask}
                />
              ))}
            </div>
          )}
        </div>

        {/* Floating Overlay while dragging */}
        <DragOverlay>
          {activeTask ? (
            <div className="p-3 bg-white dark:bg-outer_space-300 rounded-lg border border-blue_munsell-500 shadow-xl opacity-90">
              <h4 className="font-medium text-slate-800 dark:text-platinum-500 text-sm">
                {activeTask.title}
              </h4>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}