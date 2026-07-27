"use client"

import { Clock, CheckCircle, Shield, User, AlertCircle } from "lucide-react"
import { CalendarTask, TASK_TYPE_CONFIG } from "./types"

interface UpcomingCampaignsProps {
  tasks: CalendarTask[]
}

export function UpcomingCampaigns({ tasks }: UpcomingCampaignsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 text-sm font-sans font-black uppercase tracking-[0.2em] text-[#D7B05C]">
        <span>📜</span>
        <h2>Upcoming Campaigns & Priorities</h2>
        <div className="h-px flex-1 bg-gradient-to-r from-[#4A2C1D] to-transparent" />
      </div>

      {tasks.length === 0 ? (
        <div className="p-8 border-2 border-dashed border-[#8F6236]/50 bg-[#15100C] text-center rounded-xs">
          <p className="font-serif italic text-[#D7B05C]/80 text-sm">
            📜 The Royal Scribe has recorded no campaigns for this season.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {tasks.map((event) => {
            const cfg = TASK_TYPE_CONFIG[event.type] || TASK_TYPE_CONFIG.deadline
            const daysRemaining = Math.max(
              0,
              Math.ceil((event.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
            )

            return (
              <div
                key={event.id}
                className="group relative flex flex-col md:flex-row items-start md:items-center justify-between p-4 border-2 border-[#8F6236]/60 bg-gradient-to-b from-[#2D1B10] to-[#15100C] rounded-xs shadow-xl transition-all duration-200 hover:border-[#D7B05C] hover:shadow-[0_0_20px_rgba(215,176,92,0.2)] hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 shadow-md ${cfg.bg} ${cfg.border} ${cfg.color}`}
                  >
                    {event.isCompleted ? <CheckCircle size={20} /> : <Clock size={20} />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif font-black text-[#F8EEDB] text-base group-hover:text-[#D7B05C] transition-colors">
                        {event.title}
                      </h3>
                      <span className={`text-[9px] font-sans font-black uppercase px-2 py-0.5 rounded-xs border ${cfg.bg} ${cfg.border} ${cfg.color}`}>
                        {cfg.icon} {cfg.label}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs font-sans text-[#D7B05C]/80 mt-1">
                      <span className="flex items-center gap-1">
                        <Shield size={12} /> {event.projectName}
                      </span>
                      {event.assignedTo && (
                        <span className="flex items-center gap-1 text-[#F8EEDB]/70">
                          <User size={12} /> {event.assignedTo}
                        </span>
                      )}
                      {event.priority && (
                        <span className="flex items-center gap-1 text-red-400 font-bold">
                          <AlertCircle size={12} /> {event.priority} Priority
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-3 md:mt-0 flex items-center gap-3">
                  <div className="text-right">
                    <span className="block text-[10px] font-sans uppercase font-bold text-[#D7B05C]/60">
                      Countdown
                    </span>
                    <span className="text-xs font-sans font-black text-[#F8EEDB]">
                      {daysRemaining === 0 ? "Due Today" : `In ${daysRemaining} days`}
                    </span>
                  </div>

                  <div className="font-sans text-xs font-black uppercase tracking-wider text-[#1A120C] bg-[#FAF0D7] px-3 py-1.5 rounded-xs border border-[#8F6236] shadow-xs">
                    Due: {event.dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}