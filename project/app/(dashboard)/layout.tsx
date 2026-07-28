"use client"

import type React from "react"
import { useState, Suspense } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserButton } from "@clerk/nextjs"
import {
  Home,
  FolderOpen,
  Users,
  Settings,
  Menu,
  X,
  BarChart3,
  Calendar,
  Bell,
  Shield,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", subtext: "Royal Command Center", href: "/dashboard", icon: Home },
  { name: "Projects", subtext: "Project Archives", href: "/projects", icon: FolderOpen },
  { name: "Team", subtext: "Roundtable Council", href: "/team", icon: Users },
  { name: "Analytics", subtext: "Intelligence Chamber", href: "/analytics", icon: BarChart3 },
  { name: "Calendar", subtext: "Quest Ledger", href: "/calendar", icon: Calendar },
  { name: "Settings", subtext: "Realm Configuration", href: "/settings", icon: Settings },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Mobile drawer state
  const [mobileOpen, setMobileOpen] = useState(false)
  // Desktop sidebar state: COLLAPSED BY DEFAULT
  const [isCollapsed, setIsCollapsed] = useState(true)
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-[#15100C] text-[#F8EEDB] font-serif antialiased selection:bg-[#D7B05C] selection:text-[#15100C]">
      
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Medieval Castle Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 border-r-2 border-[#4A2C1D] bg-gradient-to-b from-[#2D1B10] via-[#1A120C] to-[#100A07] shadow-2xl transition-all duration-300 ease-in-out transform lg:translate-x-0 ${
          mobileOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0"
        } ${isCollapsed ? "lg:w-20" : "lg:w-64"}`}
      >
        {/* Brand Header Bar - Exactly h-20 to match top navbar */}
        <div className="flex items-center justify-between h-20 px-3.5 border-b-2 border-[#4A2C1D] shrink-0">
          
          {/* ================= COLLAPSED VIEW (Desktop) ================= */}
          {isCollapsed && !mobileOpen ? (
            <div className="w-full flex justify-center items-center">
              <button
                type="button"
                onClick={() => setIsCollapsed(false)}
                className="group relative p-2.5 rounded-xs border border-[#D7B05C] bg-[#15100C] text-[#D7B05C] hover:text-white hover:border-[#FFF5D6] transition-all shadow-md cursor-pointer flex items-center justify-center"
                title="Expand Command Sidebar"
              >
                <Shield size={20} className="group-hover:hidden transition-all" />
                <PanelLeftOpen size={20} className="hidden group-hover:block transition-all" />
              </button>
            </div>
          ) : (
            /* ================= EXPANDED VIEW ================= */
            <>
              <Link href="/dashboard" className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
                <div className="p-1.5 rounded-xs border border-[#D7B05C] bg-[#15100C] text-[#D7B05C] shadow-md shrink-0">
                  <Shield size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block text-sm sm:text-base font-black bg-gradient-to-b from-[#FFF5D6] via-[#D7B05C] to-[#B78B3E] bg-clip-text text-transparent uppercase tracking-wide leading-tight truncate">
                    Roundtable
                  </span>
                  <span className="block text-[7.5px] font-sans font-bold text-[#D7B05C]/70 uppercase tracking-wider truncate">
                    Royal Command Center
                  </span>
                </div>
              </Link>

              {/* Desktop Collapse Trigger Button */}
              <button
                type="button"
                onClick={() => setIsCollapsed(true)}
                className="hidden lg:flex shrink-0 p-1.5 rounded-xs border border-[#8F6236]/60 bg-[#15100C] text-[#D7B05C] hover:text-white hover:border-[#D7B05C] transition-colors cursor-pointer ml-1"
                title="Collapse Sidebar"
              >
                <PanelLeftClose size={18} />
              </button>
            </>
          )}

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="lg:hidden shrink-0 p-1.5 text-[#D7B05C] hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Dual-Label Navigation Items */}
        <nav className="mt-6 px-3 space-y-2 overflow-x-hidden">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
            const Icon = item.icon

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                title={isCollapsed && !mobileOpen ? `${item.name} • ${item.subtext}` : undefined}
                className={`flex items-center px-3.5 py-3 rounded-xs border transition-all duration-200 ${
                  isActive
                    ? "border-[#D7B05C] bg-gradient-to-r from-[#5B3922] to-[#2D1B10] text-[#FFF5D6] shadow-[0_0_15px_rgba(215,176,92,0.3)]"
                    : "border-transparent text-[#D7B05C]/70 hover:text-[#FFF5D6] hover:bg-[#2D1B10]/60 hover:border-[#8F6236]/40"
                } ${isCollapsed && !mobileOpen ? "justify-center px-0" : ""}`}
              >
                <Icon size={20} className="shrink-0 text-[#D7B05C]" />
                {(!isCollapsed || mobileOpen) && (
                  <div className="ml-3 min-w-0 flex-1 truncate transition-all duration-200">
                    <span className="block text-xs font-sans font-black uppercase tracking-wider truncate">
                      {item.name}
                    </span>
                    <span className="block text-[9px] font-serif italic text-[#D7B05C]/60 truncate">
                      {item.subtext}
                    </span>
                  </div>
                )}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main Layout Content Area */}
      <div className={`transition-all duration-300 ease-in-out ${isCollapsed ? "lg:pl-20" : "lg:pl-64"}`}>
        
        {/* Top Header Control Bar - Height matched exactly (h-20) to sidebar header */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b-2 border-[#4A2C1D] bg-[#15100C]/95 backdrop-blur-md px-4 shadow-xl sm:px-6 lg:px-8">
          
          {/* Mobile Menu Trigger */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 text-[#D7B05C] hover:text-white"
          >
            <Menu size={22} />
          </button>

          {/* Desktop Left Spacer */}
          <div className="hidden lg:block" />

          {/* Right Controls: Notification Bell & User Profile Avatar */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="p-2.5 rounded-xs border border-[#8F6236]/60 bg-[#2D1B10] text-[#D7B05C] hover:text-white hover:border-[#D7B05C] transition-colors relative cursor-pointer shadow-md"
              title="Notifications"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            </button>

            <UserButton userProfileMode="modal" />
          </div>
        </header>

        {/* Page Content Container */}
        <main className="min-h-[calc(100vh-5rem)]">
          <Suspense>{children}</Suspense>
        </main>

        {/* GLOBAL FOOTER */}
        <footer className="relative z-10 py-8 text-center border-t border-[#3B2415] bg-[#1A120C] mt-auto">
          <div className="flex items-center justify-center gap-4 text-[#8F6236] text-xs mb-2">
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-[#8F6236]" />
            <span>══════════════════════════</span>
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-[#8F6236]" />
          </div>
          <p className="text-xs font-sans font-bold uppercase tracking-[0.3em] text-[#D4A74A]">
            The Roundtable © 2026 • Crafted by Dominic Herce
          </p>
        </footer>
      </div>
    </div>
  )
}