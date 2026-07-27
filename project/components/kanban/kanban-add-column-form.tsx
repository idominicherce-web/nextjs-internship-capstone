"use client"

import type React from "react"
import { Plus, Loader2 } from "lucide-react"

interface KanbanAddColumnFormProps {
  newListName: string
  setNewListName: (value: string) => void
  isLoading: boolean
  onSubmit: (e: React.FormEvent) => void
}

export function KanbanAddColumnForm({
  newListName,
  setNewListName,
  isLoading,
  onSubmit,
}: KanbanAddColumnFormProps) {
  return (
    <div className="p-4 rounded-xs border-2 border-[#8F6236]/70 bg-gradient-to-r from-[#2D1B10] via-[#1A120C] to-[#2D1B10] shadow-xl flex flex-col sm:flex-row items-center gap-3">
      <form onSubmit={onSubmit} className="flex gap-3 w-full max-w-xl">
        <input
          type="text"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          placeholder="New column name (e.g. Backlog, In Review, Done)..."
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
  )
}