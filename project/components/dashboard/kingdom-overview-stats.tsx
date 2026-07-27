"use client"

import { FolderKanban, Users, CheckCircle, Clock } from "lucide-react"

interface KingdomOverviewStatsProps {
  activeProjects: number
  totalMembers: number
  completedTasks: number
  pendingTasks: number
}

export function KingdomOverviewStats({
  activeProjects,
  totalMembers,
  completedTasks,
  pendingTasks,
}: KingdomOverviewStatsProps) {
  const cards = [
    {
      label: "Royal Dossiers",
      value: `${activeProjects} Active`,
      subText: "↑ 8% from last moon",
      icon: FolderKanban,
      color: "text-[#D7B05C]",
      border: "border-[#D7B05C]/40",
    },
    {
      label: "High Officers",
      value: `${totalMembers} Member`,
      subText: "Roundtable Assembled",
      icon: Users,
      color: "text-sky-300",
      border: "border-sky-500/40",
    },
    {
      label: "Active Operations",
      value: `${pendingTasks} Pending`,
      subText: "In progress across boards",
      icon: Clock,
      color: "text-amber-400",
      border: "border-amber-500/40",
    },
    {
      label: "Missions Completed",
      value: `${completedTasks} Victories`,
      subText: "↑ 12% this week",
      icon: CheckCircle,
      color: "text-emerald-400",
      border: "border-emerald-500/40",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon
        return (
          <div
            key={idx}
            className="group relative p-4 rounded-xs border-2 border-[#4A2C1D] bg-gradient-to-b from-[#2D1B10] via-[#1A120C] to-[#15100C] shadow-lg transition-all duration-200 hover:-translate-y-1 hover:border-[#D7B05C] hover:shadow-[0_10px_25px_rgba(215,176,92,0.25)] overflow-hidden"
          >
            <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#D7B05C]/50 to-transparent group-hover:via-[#D7B05C]" />
            <div className="flex items-center space-x-3">
              <div className={`p-2.5 rounded-full border bg-[#15100C] ${card.border} ${card.color} group-hover:scale-110 transition-transform`}>
                <Icon size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-sans uppercase font-black text-[#D7B05C]/70 tracking-widest truncate">
                  {card.label}
                </p>
                <p className={`text-lg font-black font-serif ${card.color} truncate`}>
                  {card.value}
                </p>
                <p className="text-[9px] font-sans text-[#D7B05C]/50 italic truncate">
                  {card.subText}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}