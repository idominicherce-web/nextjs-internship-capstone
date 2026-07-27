"use client"

import { X, Mail, Shield, Scroll, Calendar, Trash2 } from "lucide-react"
import { Member } from "./team-directory-table"
import { getDisciplineTheme } from "@/lib/roles"

interface MemberDetailsDrawerProps {
  member: Member | null
  onClose: () => void
}

export function MemberDetailsDrawer({ member, onClose }: MemberDetailsDrawerProps) {
  if (!member) return null

  const theme = getDisciplineTheme(member.role)

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-xs">
      <div className="w-full max-w-md bg-[#1A120C] border-l-4 border-[#3B2415] h-full shadow-2xl p-6 overflow-y-auto space-y-6 relative flex flex-col justify-between">
        
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-[#4A2C1D] pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xs border-2 border-[#D7B05C] bg-[#15100C] text-[#D7B05C] font-black text-base shadow-md">
                {member.avatar}
              </div>
              <div>
                <h3 className="font-serif font-black text-lg text-[#F8EEDB]">{member.name}</h3>
                <span className={`inline-block text-[9px] font-sans font-black uppercase tracking-wider px-2 py-0.5 rounded-xs border ${theme.badgeBg} ${theme.badgeBorder} ${theme.badgeText}`}>
                  {member.role}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-[#D7B05C]/70 hover:text-white rounded-xs"
            >
              <X size={18} />
            </button>
          </div>

          {/* Details List */}
          <div className="space-y-4 text-xs font-sans">
            <div>
              <span className="block text-[10px] font-black uppercase text-[#D7B05C]/70 tracking-wider">Royal Title</span>
              <p className="font-serif italic text-[#F8EEDB] text-sm">{theme.royalTitle}</p>
            </div>

            <div>
              <span className="block text-[10px] font-black uppercase text-[#D7B05C]/70 tracking-wider">Email Address</span>
              <p className="flex items-center gap-1.5 text-[#F8EEDB] mt-0.5">
                <Mail size={14} className="text-[#D7B05C]" /> {member.email}
              </p>
            </div>

            <div>
              <span className="block text-[10px] font-black uppercase text-[#D7B05C]/70 tracking-wider">Assigned Projects</span>
              <p className="flex items-center gap-1.5 text-[#F8EEDB] mt-0.5">
                <Scroll size={14} className="text-[#D7B05C]" /> {member.projectCount} Active Projects
              </p>
            </div>

            <div>
              <span className="block text-[10px] font-black uppercase text-[#D7B05C]/70 tracking-wider">Last Active</span>
              <p className="flex items-center gap-1.5 text-[#F8EEDB] mt-0.5">
                <Calendar size={14} className="text-[#D7B05C]" /> {member.lastActive}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-[#4A2C1D]">
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-rose-800 bg-rose-950/60 text-rose-300 text-xs font-sans font-black uppercase tracking-wider rounded-xs hover:bg-rose-900 transition-colors cursor-pointer"
          >
            <Trash2 size={15} /> Remove Member
          </button>
        </div>

      </div>
    </div>
  )
}