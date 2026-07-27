"use client"

import { Feather, X } from "lucide-react"

interface ParchmentSearchProps {
  value: string
  onChange: (val: string) => void
}

export function ParchmentSearch({ value, onChange }: ParchmentSearchProps) {
  return (
    <div className="relative flex-1">
      <div className="relative flex items-center rounded-xs border-2 border-[#8F6236] bg-[#FAF0D7] text-[#1A120C] shadow-inner px-3 py-2">
        <Feather className="text-[#8F6236] mr-2 shrink-0" size={18} />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search campaign dossier by name or description..."
          className="w-full bg-transparent text-xs sm:text-sm font-sans font-bold text-[#1A120C] placeholder-[#8F6236]/70 focus:outline-none"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-[#8F6236] hover:text-[#1A120C] transition-colors p-1"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  )
}