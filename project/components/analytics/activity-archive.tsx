"use client"

import { DashboardSection } from "@/components/layout/dashboard-section"
import { Activity, Plus, Edit2, Check, Trash2, Folder, FileText, Bookmark, Clock } from "lucide-react"
import { ActivityLogItem } from "./types"

interface ActivityArchiveProps {
  activities: ActivityLogItem[]
}

export function ActivityArchive({ activities }: ActivityArchiveProps) {
  // Map actions to medieval icons & heraldic accent colors
  const getActionConfig = (action: string) => {
    const act = action.toLowerCase()
    if (act.includes("create") || act.includes("add")) {
      return { icon: Plus, color: "text-emerald-400 bg-emerald-950/80 border-emerald-600/60" }
    }
    if (act.includes("update") || act.includes("edit")) {
      return { icon: Edit2, color: "text-amber-300 bg-amber-950/80 border-amber-600/60" }
    }
    if (act.includes("complete") || act.includes("finish")) {
      return { icon: Check, color: "text-sky-300 bg-sky-950/80 border-sky-600/60" }
    }
    if (act.includes("delete") || act.includes("remove")) {
      return { icon: Trash2, color: "text-rose-400 bg-rose-950/80 border-rose-600/60" }
    }
    return { icon: Bookmark, color: "text-[#D7B05C] bg-[#2D1B10] border-[#8F6236]" }
  }

  const getEntityIcon = (entityType?: string | null) => {
    const type = entityType?.toLowerCase() || ""
    if (type.includes("project")) return <Folder size={12} className="text-[#D7B05C]" />
    return <FileText size={12} className="text-[#D7B05C]" />
  }

  return (
    <DashboardSection className="">
      <div className="flex items-center justify-between border-b border-[#4A2C1D] pb-3 mb-4">
        <div className="flex items-center gap-2 text-[#D7B05C]">
          <Activity size={20} />
          <h2 className="font-serif font-black uppercase text-base tracking-widest text-[#F8EEDB]">
            QUEST LOGS
          </h2>
        </div>
        <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#D7B05C]/60">
          Live Dispatch Log
        </span>
      </div>

      {activities.length === 0 ? (
        <div className="p-8 border-2 border-dashed border-[#8F6236]/40 bg-[#15100C] text-center rounded-xs space-y-2">
          <FileText size={32} className="mx-auto text-[#D7B05C]/40" />
          <p className="font-serif font-bold text-sm text-[#F8EEDB]">Royal Archive Empty</p>
          <p className="text-xs font-sans text-[#D7B05C]/70">
            No recent activity has been recorded. Actions performed within your workspace will be preserved here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((log) => {
            const config = getActionConfig(log.action)
            const ActionIcon = config.icon

            return (
              <div
                key={log.id}
                className="group relative p-3 rounded-xs border border-[#4A2C1D] bg-[#15100C] hover:border-[#D7B05C]/60 transition-colors shadow-xs flex items-start gap-3"
              >
                {/* Forged Brass Pin / Wax Seal Badge */}
                <div
                  className={`mt-0.5 shrink-0 w-7 h-7 rounded-full border flex items-center justify-center shadow-xs ${config.color}`}
                >
                  <ActionIcon size={14} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <p className="text-xs font-sans font-black text-[#F8EEDB] group-hover:text-[#D7B05C] transition-colors">
                      <span className="capitalize">{log.action}</span>{" "}
                      <span className="text-[#D7B05C] italic">"{log.entityName}"</span>
                    </p>

                    <span className="flex items-center gap-1 text-[9.5px] font-mono text-[#D7B05C]/60">
                      <Clock size={10} />
                      {new Date(log.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>

                  {log.details && (
                    <p className="text-[11px] font-sans text-[#D7B05C]/70 mt-0.5 line-clamp-1 italic">
                      {log.details}
                    </p>
                  )}

                  <div className="flex items-center gap-2 mt-1.5 text-[9px] font-sans font-bold text-[#D7B05C]/50 uppercase tracking-wider">
                    <span className="flex items-center gap-1 bg-[#2D1B10] px-1.5 py-0.5 rounded-xs border border-[#4A2C1D]">
                      {getEntityIcon(log.entityType)} {log.entityType || "Workspace"}
                    </span>
                    <span>• {new Date(log.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </DashboardSection>
  )
}