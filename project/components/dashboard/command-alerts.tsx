"use client"

import { CheckCircle, AlertTriangle, ShieldAlert } from "lucide-react"

interface CommandAlertsProps {
  overdueCount: number
  totalTasks: number
  pendingTasks: number
}

export function CommandAlerts({ overdueCount, pendingTasks }: CommandAlertsProps) {
  const alerts = [
    {
      priority: "high",
      icon: ShieldAlert,
      message: overdueCount > 0 
        ? `${overdueCount} campaign objectives are overdue and require commander intervention.`
        : "All critical campaign deadlines are currently up to date.",
      color: overdueCount > 0 ? "bg-rose-950/80 border-rose-600/80 text-rose-300" : "bg-emerald-950/80 border-emerald-600/80 text-emerald-300",
    },
    {
      priority: "medium",
      icon: AlertTriangle,
      message: `${pendingTasks} active objectives remain in development across war boards.`,
      color: "bg-amber-950/80 border-amber-600/80 text-amber-300",
    },
    {
      priority: "low",
      icon: CheckCircle,
      message: "Royal Database synchronization active and nominal.",
      color: "bg-[#15100C] border-[#4A2C1D] text-[#D7B05C]",
    },
  ]

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs font-sans font-black uppercase tracking-[0.2em] text-[#D7B05C]">
        <span>⚔</span>
        <h2>Command Alerts</h2>
        <div className="h-px flex-1 bg-gradient-to-r from-[#4A2C1D] to-transparent" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {alerts.map((alert, idx) => {
          const Icon = alert.icon
          return (
            <div
              key={idx}
              className={`p-3 rounded-xs border-2 ${alert.color} shadow-lg flex items-center space-x-3 text-xs font-sans font-bold`}
            >
              <Icon size={18} className="shrink-0" />
              <p className="flex-1 line-clamp-2">{alert.message}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}