"use client"

import { Users, Activity, FolderKanban, Mail } from "lucide-react"

interface TeamStatsProps {
  totalMembers: number
  activeThisWeek: number
  totalProjectAssignments: number
  pendingInvitationsCount: number
}

export function TeamStats({
  totalMembers,
  activeThisWeek,
  totalProjectAssignments,
  pendingInvitationsCount,
}: TeamStatsProps) {
  const stats = [
    {
      title: "Total Members",
      subtext: "Registered officers",
      value: totalMembers,
      icon: Users,
    },
    {
      title: "Active This Week",
      subtext: "Recently deployed",
      value: activeThisWeek,
      icon: Activity,
    },
    {
      title: "Project Assignments",
      subtext: "Active collaborations",
      value: totalProjectAssignments,
      icon: FolderKanban,
    },
    {
      title: "Pending Invitations",
      subtext: "Awaiting response",
      value: pendingInvitationsCount,
      icon: Mail,
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xs border-2 border-[#4A2C1D] bg-gradient-to-b from-[#2D1B10] via-[#1A120C] to-[#15100C] shadow-2xl relative">
      <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#D7B05C]/50 to-transparent" />
      {stats.map((stat, idx) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.title}
            className={`flex items-center space-x-3 p-2 ${
              idx !== stats.length - 1 ? "md:border-r border-[#4A2C1D]/60" : ""
            }`}
          >
            <div className="p-2.5 rounded-full border border-[#D7B05C]/50 bg-[#15100C] text-[#D7B05C] shrink-0">
              <Icon size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-sans uppercase font-bold text-[#D7B05C]/80 tracking-wider truncate">
                {stat.title}
              </p>
              <p className="text-lg font-black text-[#F8EEDB]">{stat.value}</p>
              <p className="text-[9px] font-serif italic text-[#D7B05C]/50 truncate">
                {stat.subtext}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}