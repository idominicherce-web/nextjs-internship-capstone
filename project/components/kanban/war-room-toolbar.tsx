"use client"

import { Users, Calendar, Settings, MoreHorizontal } from "lucide-react"

export function WarRoomToolbar() {
  return (
    <div className="flex items-center space-x-1.5 bg-[#100A07] p-1 border border-[#4A2C1D] rounded-xs shadow-inner">
      <button
        type="button"
        className="p-2 border border-[#4A2C1D] bg-[#15100C] text-[#D7B05C] hover:text-white hover:border-[#D7B05C] rounded-xs transition-colors cursor-pointer"
        title="War Room Officers"
      >
        <Users size={18} />
      </button>
      <button
        type="button"
        className="p-2 border border-[#4A2C1D] bg-[#15100C] text-[#D7B05C] hover:text-white hover:border-[#D7B05C] rounded-xs transition-colors cursor-pointer"
        title="Campaign Calendar"
      >
        <Calendar size={18} />
      </button>
      <button
        type="button"
        className="p-2 border border-[#4A2C1D] bg-[#15100C] text-[#D7B05C] hover:text-white hover:border-[#D7B05C] rounded-xs transition-colors cursor-pointer"
        title="Strategy Settings"
      >
        <Settings size={18} />
      </button>
      <button
        type="button"
        className="p-2 border border-[#4A2C1D] bg-[#15100C] text-[#D7B05C] hover:text-white hover:border-[#D7B05C] rounded-xs transition-colors cursor-pointer"
        title="Additional Command Options"
      >
        <MoreHorizontal size={18} />
      </button>
    </div>
  )
}