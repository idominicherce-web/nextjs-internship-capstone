"use client"

import React from "react"

interface DashboardSectionProps {
  children: React.ReactNode
  className?: string
}

export function DashboardSection({ children, className = "" }: DashboardSectionProps) {
  return (
    <div className={`relative rounded-xs border-4 border-[#3B2415] bg-gradient-to-b from-[#4A2C1D] via-[#2D1B10] to-[#15100C] p-5 sm:p-6 shadow-[0_15px_35px_rgba(0,0,0,0.85)] overflow-hidden ${className}`}>
      {/* Forged Brass Corner Plates with Rivets */}
      <div className="absolute left-1 top-1 z-30 h-4 w-4 border border-[#1A120C] bg-gradient-to-br from-[#FFE5A3] via-[#D7B05C] to-[#8F6236] rounded-xs shadow-xs" />
      <div className="absolute right-1 top-1 z-30 h-4 w-4 border border-[#1A120C] bg-gradient-to-br from-[#FFE5A3] via-[#D7B05C] to-[#8F6236] rounded-xs shadow-xs" />
      <div className="absolute bottom-1 left-1 z-30 h-4 w-4 border border-[#1A120C] bg-gradient-to-br from-[#FFE5A3] via-[#D7B05C] to-[#8F6236] rounded-xs shadow-xs" />
      <div className="absolute bottom-1 right-1 z-30 h-4 w-4 border border-[#1A120C] bg-gradient-to-br from-[#FFE5A3] via-[#D7B05C] to-[#8F6236] rounded-xs shadow-xs" />

      {/* Inner Wood Bevel Shadow */}
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] z-10" />

      <div className="relative z-20">{children}</div>
    </div>
  )
}