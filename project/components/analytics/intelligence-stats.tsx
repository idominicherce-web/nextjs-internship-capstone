"use client"

import { TrendingUp, CheckCircle, Clock, AlertCircle } from "lucide-react"

interface IntelligenceStatsProps {
  overallEfficiency: number
  completedTasks: number
  totalTasks: number
  inProgressTasks: number
  overdueTasks: number
}

export function IntelligenceStats({
  overallEfficiency,
  completedTasks,
  totalTasks,
  inProgressTasks,
  overdueTasks,
}: IntelligenceStatsProps) {
  const cards = [
    {
      label: "Overall Efficiency",
      value: `${overallEfficiency}%`,
      subText: "Master Campaign Rate",
      icon: TrendingUp,
      accent: "text-[#D7B05C]",
      border: "border-[#D7B05C]/40",
      bgGlow: "from-[#D7B05C]/10",
    },
    {
      label: "Completed Tasks",
      value: `${completedTasks} / ${totalTasks}`,
      subText: "Decrees Fulfilled",
      icon: CheckCircle,
      accent: "text-emerald-400",
      border: "border-emerald-500/40",
      bgGlow: "from-emerald-500/10",
    },
    {
      label: "In Progress",
      value: `${inProgressTasks}`,
      subText: "Active Operations",
      icon: Clock,
      accent: "text-amber-400",
      border: "border-amber-500/40",
      bgGlow: "from-amber-500/10",
    },
    {
      label: "Overdue Tasks",
      value: `${overdueTasks}`,
      subText: "Urgent Attention Needed",
      icon: AlertCircle,
      accent: "text-rose-400",
      border: "border-rose-500/40",
      bgGlow: "from-rose-500/10",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon
        return (
          <div
            key={idx}
            className={`group relative p-4 rounded-xs border-2 border-[#4A2C1D] bg-gradient-to-b from-[#2D1B10] via-[#1A120C] to-[#15100C] shadow-xl transition-all duration-200 hover:-translate-y-1 hover:border-[#D7B05C] hover:shadow-[0_10px_25px_rgba(215,176,92,0.25)] overflow-hidden`}
          >
            {/* Forged Brass Edge Highlight */}
            <div className={`absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#D7B05C]/40 to-transparent group-hover:via-[#D7B05C]`} />
            
            {/* Ambient Accent Radial Background */}
            <div className={`pointer-events-none absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-gradient-to-br ${card.bgGlow} to-transparent blur-xl opacity-50 group-hover:opacity-100 transition-opacity`} />

            <div className="flex items-center space-x-3.5 relative z-10">
              <div className={`p-2.5 rounded-full border bg-[#15100C] ${card.border} ${card.accent} group-hover:scale-110 transition-transform`}>
                <Icon size={22} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-sans uppercase font-black text-[#D7B05C]/70 tracking-widest truncate">
                  {card.label}
                </p>
                <p className={`text-2xl font-black font-serif truncate ${card.accent}`}>
                  {card.value}
                </p>
                <p className="text-[9px] font-sans text-[#D7B05C]/50 italic">
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