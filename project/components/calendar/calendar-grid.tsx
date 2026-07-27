"use client"

import { ChevronLeft, ChevronRight, Crown } from "lucide-react"
import { CalendarTask, TASK_TYPE_CONFIG, PROJECT_RIBBONS } from "./types"

interface CalendarGridProps {
  tasks: CalendarTask[]
  currentMonthName?: string
  currentYear?: number
}

export function CalendarGrid({
  tasks,
  currentMonthName = "JULY",
  currentYear = 2026,
}: CalendarGridProps) {
  const daysInMonth = 31
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="relative rounded-xs border-4 border-[#3B2415] bg-gradient-to-b from-[#4A2C1D] via-[#2D1B10] to-[#15100C] p-4 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden">
      
      {/* Forged Brass Corner Plates with Rivets */}
      <div className="absolute left-1.5 top-1.5 z-30 h-5 w-5 border-2 border-[#1A120C] bg-gradient-to-br from-[#FFE5A3] via-[#D7B05C] to-[#8F6236] rounded-xs shadow-md flex items-center justify-center">
        <div className="w-1 h-1 bg-[#1A120C] rounded-full" />
      </div>
      <div className="absolute right-1.5 top-1.5 z-30 h-5 w-5 border-2 border-[#1A120C] bg-gradient-to-br from-[#FFE5A3] via-[#D7B05C] to-[#8F6236] rounded-xs shadow-md flex items-center justify-center">
        <div className="w-1 h-1 bg-[#1A120C] rounded-full" />
      </div>
      <div className="absolute bottom-1.5 left-1.5 z-30 h-5 w-5 border-2 border-[#1A120C] bg-gradient-to-br from-[#FFE5A3] via-[#D7B05C] to-[#8F6236] rounded-xs shadow-md flex items-center justify-center">
        <div className="w-1 h-1 bg-[#1A120C] rounded-full" />
      </div>
      <div className="absolute bottom-1.5 right-1.5 z-30 h-5 w-5 border-2 border-[#1A120C] bg-gradient-to-br from-[#FFE5A3] via-[#D7B05C] to-[#8F6236] rounded-xs shadow-md flex items-center justify-center">
        <div className="w-1 h-1 bg-[#1A120C] rounded-full" />
      </div>

      {/* Outer Wooden Table Inner Shadow */}
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_30px_rgba(0,0,0,0.8)] z-10" />

      {/* Month Navigation Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 relative z-20 pb-4 border-b-2 border-[#4A2C1D]">
        
        {/* Carved Wooden Month Controls */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button
            type="button"
            className="flex items-center gap-1 px-3 py-2 border-2 border-[#8F6236] bg-gradient-to-b from-[#3B2415] to-[#15100C] text-[#D7B05C] hover:text-white hover:border-[#D7B05C] active:scale-95 rounded-xs transition-all duration-200 shadow-md cursor-pointer group"
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline text-xs font-sans font-black tracking-widest text-[#D7B05C]">◀─</span>
          </button>

          <h2 className="text-xl sm:text-3xl font-black bg-gradient-to-b from-[#FFF5D6] via-[#D7B05C] to-[#B78B3E] bg-clip-text text-transparent uppercase tracking-[0.25em] px-2 text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            {currentMonthName} {currentYear}
          </h2>

          <button
            type="button"
            className="flex items-center gap-1 px-3 py-2 border-2 border-[#8F6236] bg-gradient-to-b from-[#3B2415] to-[#15100C] text-[#D7B05C] hover:text-white hover:border-[#D7B05C] active:scale-95 rounded-xs transition-all duration-200 shadow-md cursor-pointer group"
          >
            <span className="hidden sm:inline text-xs font-sans font-black tracking-widest text-[#D7B05C]">─▶</span>
            <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* View Selection Engraved Tabs */}
        <div className="flex space-x-1 bg-[#100A07] p-1 border border-[#4A2C1D] rounded-xs">
          {["Month", "Week", "Day"].map((view, i) => (
            <button
              key={view}
              type="button"
              className={`px-3.5 py-1.5 text-xs font-sans font-black uppercase tracking-wider rounded-xs transition-all duration-150 cursor-pointer ${
                i === 0
                  ? "bg-gradient-to-b from-[#5B3922] to-[#2D1B10] text-[#FFF5D6] border border-[#D7B05C]/70 shadow-md"
                  : "text-[#D7B05C]/60 hover:text-[#D7B05C] hover:bg-[#2D1B10]/40"
              }`}
            >
              {view}
            </button>
          ))}
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-2 text-center font-sans font-black text-xs text-[#D7B05C] uppercase tracking-[0.2em] mb-3 relative z-20">
        {weekDays.map((day) => (
          <div key={day} className="py-2 bg-[#15100C]/90 border border-[#4A2C1D] rounded-xs shadow-inner">
            {day}
          </div>
        ))}
      </div>

      {/* 31-Day Interactive Parchment Tile Grid */}
      <div className="grid grid-cols-7 gap-2.5 sm:gap-3 relative z-20">
        {days.map((day) => {
          const dayTasks = tasks.filter((t) => t.dueDate.getDate() === day)
          const isToday = day === 27
          const ribbonClass = PROJECT_RIBBONS[dayTasks[0]?.projectName] || PROJECT_RIBBONS["Default"]

          return (
            <div
              key={day}
              className={`min-h-28 sm:min-h-32 p-2 border-2 rounded-xs flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:scale-[1.01] shadow-md relative overflow-hidden group/tile ${
                isToday
                  ? "border-[#D7B05C] bg-[#FAF0D7] shadow-[0_0_25px_rgba(215,176,92,0.45)] ring-2 ring-[#D7B05C]/30"
                  : "border-[#8F6236]/70 bg-[#F4E4C1] hover:bg-[#FAF0D7] hover:border-[#D7B05C]"
              }`}
              style={{
                backgroundImage: `
                  repeating-linear-gradient(
                    0deg,
                    rgba(0,0,0,0.03),
                    rgba(0,0,0,0.03) 1px,
                    transparent 1px,
                    transparent 8px
                  )
                `,
              }}
            >
              {/* Today Candlelight Radial Glow Overlay */}
              {isToday && (
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(215,176,92,0.35),transparent_70%)] animate-pulse" />
              )}

              {/* Weathered Parchment Vignette */}
              <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_12px_rgba(59,36,21,0.2)] mix-blend-multiply" />

              {/* Header: Date Number + Decree Crest */}
              <div className="flex justify-between items-center relative z-10 border-b border-[#2D1B10]/10 pb-1">
                <span
                  className={`text-xs sm:text-sm font-sans font-black ${
                    isToday ? "text-[#1A120C] font-black" : "text-[#2D1B10]"
                  }`}
                >
                  {day}
                </span>

                {isToday ? (
                  <span className="flex items-center gap-1 px-1.5 py-0.5 text-[8px] font-sans font-black uppercase tracking-wider bg-[#3B2415] text-[#FFF5D6] rounded-xs border border-[#D7B05C] shadow-sm">
                    <Crown size={10} className="text-[#D7B05C]" />
                    Decree
                  </span>
                ) : (
                  dayTasks.length > 0 && (
                    <span className="text-[9px] font-sans font-bold text-[#8F6236]">
                      {dayTasks.length} {dayTasks.length === 1 ? "event" : "events"}
                    </span>
                  )
                )}
              </div>

              {/* Body: Task Chips or Faint Empty State */}
              <div className="space-y-1.5 mt-1.5 flex-1 relative z-10">
                {dayTasks.length > 0 ? (
                  <>
                    {dayTasks.slice(0, 2).map((t) => {
                      const cfg = TASK_TYPE_CONFIG[t.type] || TASK_TYPE_CONFIG.deadline
                      return (
                        <div
                          key={t.id}
                          className={`text-[9.5px] font-sans font-extrabold p-1 rounded-xs flex items-center justify-between gap-1 shadow-xs border border-l-4 ${ribbonClass} bg-[#2D1B10] text-[#F8EEDB] hover:text-[#D7B05C] transition-colors`}
                        >
                          <span className="truncate">{t.title}</span>
                          <span className="text-[9px] shrink-0">{cfg.icon}</span>
                        </div>
                      )
                    })}
                    {dayTasks.length > 2 && (
                      <p className="text-[8px] font-sans font-bold text-[#5B3922] text-right tracking-tight">
                        +{dayTasks.length - 2} more
                      </p>
                    )}
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center opacity-30 select-none">
                    <span className="text-[9px] font-serif italic text-[#3B2415]">No quests</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}