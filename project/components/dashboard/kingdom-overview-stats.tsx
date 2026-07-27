"use client"

import { FolderKanban, Users, Clock, CheckCircle2 } from "lucide-react"

interface KingdomOverviewStatsProps {
  activeProjects: number
  totalMembers: number
  pendingTasks: number
  completedTasks: number
}

export function KingdomOverviewStats({
  activeProjects,
  totalMembers,
  pendingTasks,
  completedTasks,
}: KingdomOverviewStatsProps) {
  const stats = [
    {
      label: "Active Projects",
      value: `${activeProjects} Active`,
      subtext: "Royal quests in operational status",
      icon: FolderKanban,
      color: "text-amber-400",
      borderColor: "border-[#8F6236]/60",
      iconBg: "border-[#D7B05C]/40 bg-[#15100C]",
    },
    {
      label: "Team Members",
      value: `${totalMembers} ${totalMembers === 1 ? "Member" : "Members"}`,
      subtext: "High officers assembled at the roundtable",
      icon: Users,
      color: "text-sky-400",
      borderColor: "border-sky-800/60",
      iconBg: "border-sky-500/40 bg-[#15100C]",
    },
    {
      label: "Pending Tasks",
      value: `${pendingTasks} Pending`,
      subtext: "Active operations in progress across boards",
      icon: Clock,
      color: "text-amber-300",
      borderColor: "border-amber-800/60",
      iconBg: "border-amber-500/40 bg-[#15100C]",
    },
    {
      label: "Completed Tasks",
      value: `${completedTasks} Completed`,
      subtext: "Objectives fulfilled",
      icon: CheckCircle2,
      color: "text-emerald-400",
      borderColor: "border-emerald-800/60",
      iconBg: "border-emerald-500/40 bg-[#15100C]",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.label}
            className={`p-4 rounded-xs border-2 bg-gradient-to-b from-[#2D1B10] via-[#1A120C] to-[#100A07] shadow-xl relative overflow-hidden flex items-center space-x-4 ${stat.borderColor}`}
          >
            {/* Heraldic Circular Icon Badge */}
            <div
              className={`p-3 rounded-full border shadow-md shrink-0 text-[#D7B05C] ${stat.iconBg}`}
            >
              <Icon size={20} className={stat.color} />
            </div>

            {/* Content Container */}
            <div className="min-w-0 flex-1 space-y-0.5">
              {/* PRIMARY INDUSTRY LABEL (UPPERCASE) */}
              <p className="text-[10px] font-sans font-black uppercase tracking-widest text-[#D7B05C]">
                {stat.label}
              </p>

              {/* CLEAR QUANTITATIVE METRIC VALUE */}
              <p className={`text-xl font-serif font-black truncate ${stat.color}`}>
                {stat.value}
              </p>

              {/* KINGDOM FLAVOR SUBTEXT (ITALIC) */}
              <p className="text-[10px] font-serif italic text-[#D7B05C]/60 truncate leading-tight">
                {stat.subtext}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}