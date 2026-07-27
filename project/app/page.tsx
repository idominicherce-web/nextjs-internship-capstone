// app/page.tsx
import Link from "next/link"
import { ArrowRight, Shield, Users, Kanban, Scroll, BarChart3, Lock } from "lucide-react"
import { Header } from "@/components/header"

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#1A120C] text-[#F8EED5] flex flex-col font-serif select-none overflow-hidden">
      {/* Reusable Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 flex-1 flex flex-col items-center justify-center text-center">
        
        {/* Castle Background Glow */}
        <div className="pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-radial from-[#D4A74A]/25 via-orange-600/10 to-transparent blur-3xl" />

        <div className="container relative z-10 mx-auto max-w-4xl">
          
          {/* Decorative Divider Top */}
          <div className="flex items-center justify-center gap-3 text-[#D4A74A] text-sm mb-4 opacity-90 select-none">
            <span>✦</span>
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#D4A74A]/60 to-transparent" />
            <span>⚔</span>
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#D4A74A]/60 to-transparent" />
            <span>✦</span>
          </div>

          {/* High Impact Stacked Title */}
          <header className="mb-8">
            <h1 className="flex flex-col items-center justify-center font-black tracking-widest text-[#F8EED5] uppercase drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)]">
              <span className="text-xl sm:text-2xl font-bold text-[#8F6236] tracking-[0.4em] mb-1">
                THE
              </span>
              <span className="bg-gradient-to-b from-[#FFF5D6] via-[#D4A74A] to-[#8F6236] bg-clip-text text-5xl sm:text-7xl md:text-8xl tracking-[0.2em] pl-[0.2em] text-transparent filter drop-shadow-[0_0_25px_rgba(212,167,74,0.3)]">
                ROUNDTABLE
              </span>
            </h1>

            {/* Business + Fantasy Hybrid Subtitle */}
            <p className="mt-4 font-sans text-xs sm:text-sm font-extrabold uppercase tracking-[0.35em] pl-[0.35em] text-[#D4A74A]/90">
              Agile Task Management • Guild Team Collaboration • Project Workflows
            </p>
          </header>

          {/* Decorative Divider */}
          <div className="my-6 text-[#8F6236] text-xs flex items-center justify-center gap-2">
            <span>❦</span>
            <div className="h-px w-32 bg-gradient-to-r from-transparent via-[#8F6236] to-transparent" />
            <span>❦</span>
          </div>

          {/* HERO SCROLL CONTRACT */}
          <div className="relative mx-auto max-w-2xl z-10 mb-14">
            
            {/* Outer Carved Oak Frame */}
            <div className="rounded-sm border-4 border-[#3B2415] bg-gradient-to-b from-[#5B3922] via-[#3B2415] to-[#1A120C] p-3 sm:p-4 shadow-[0_30px_90px_rgba(0,0,0,0.95)] relative">
              
              {/* Cast Iron Brackets */}
              <div className="absolute left-1 top-1 z-30 h-4 w-4 border border-black bg-gradient-to-br from-zinc-600 to-zinc-900 rounded-xs" />
              <div className="absolute right-1 top-1 z-30 h-4 w-4 border border-black bg-gradient-to-br from-zinc-600 to-zinc-900 rounded-xs" />
              <div className="absolute bottom-1 left-1 z-30 h-4 w-4 border border-black bg-gradient-to-br from-zinc-600 to-zinc-900 rounded-xs" />
              <div className="absolute bottom-1 right-1 z-30 h-4 w-4 border border-black bg-gradient-to-br from-zinc-600 to-zinc-900 rounded-xs" />

              {/* Forged Iron Pin */}
              <div className="absolute left-1/2 -top-2 z-40 h-4 w-4 -translate-x-1/2 rounded-full border border-black bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-950 shadow-[0_4px_8px_rgba(0,0,0,0.8)]" />

              {/* Inner Parchment Scroll Surface */}
              <div
                className="relative z-20 overflow-hidden rounded-xs border-2 border-[#8F6236]/60 px-6 sm:px-10 py-8 shadow-inner"
                style={{
                  backgroundColor: "#F3E5C3",
                  backgroundImage: `
                    repeating-linear-gradient(
                      0deg,
                      rgba(0,0,0,0.03),
                      rgba(0,0,0,0.03) 1px,
                      transparent 1px,
                      transparent 10px
                    )
                  `,
                }}
              >
                {/* Weathered Vignette */}
                <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_40px_rgba(59,36,21,0.5)] z-30 mix-blend-multiply" />

                {/* High-Visibility Hybrid Business-Fantasy Copy */}
                <p className="relative z-40 font-serif italic text-base sm:text-lg text-[#1A120C] font-black leading-relaxed mb-8 text-center drop-shadow-xs">
                  "Welcome to the High Command Center. Here upon the master project board, team leaders and cross-functional members organize Kanban task bounties, track Sprint milestones, and streamline team operations."
                </p>

                {/* Carved Wooden Buttons Container */}
                <div className="relative z-40 flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/dashboard"
                    className="group relative inline-flex items-center justify-center px-8 py-4 border-2 border-[#D4A74A] bg-gradient-to-b from-[#5B3922] via-[#3B2415] to-[#1A120C] text-[#F3E5C3] font-sans text-xs font-black uppercase tracking-[0.2em] rounded-xs transition-all duration-200 hover:text-white hover:border-[#FFF5D6] hover:shadow-[0_0_25px_rgba(212,167,74,0.5)] active:translate-y-0.5 hover:-translate-y-0.5 shadow-xl cursor-pointer"
                  >
                    <span className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.9)] flex items-center gap-2">
                      Manage Kanban Tasks
                      <ArrowRight className="transition-transform group-hover:translate-x-1 text-[#D4A74A]" size={16} />
                    </span>
                  </Link>

                  <Link
                    href="/projects"
                    className="inline-flex items-center justify-center px-8 py-4 border-2 border-[#8F6236] bg-[#E3D2A8] text-[#1A120C] hover:bg-[#D8C393] font-sans text-xs font-black uppercase tracking-[0.2em] rounded-xs transition-all duration-200 shadow-md hover:-translate-y-0.5 cursor-pointer"
                  >
                    View Active Projects
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* CIRCULAR BRASS MEDALLIONS FEATURE SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-16">
            <div className="flex flex-col items-center justify-center bg-gradient-to-b from-[#3B2415] to-[#1A120C] border border-[#8F6236]/60 p-5 rounded-xs shadow-xl relative group hover:border-[#D4A74A]/80 transition-all">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#D4A74A] bg-gradient-to-br from-[#8F6236] via-[#5B3922] to-[#1A120C] shadow-[0_0_15px_rgba(212,167,74,0.3)] group-hover:scale-105 transition-transform">
                <Kanban className="h-6 w-6 text-[#D4A74A]" />
              </div>
              <span className="font-sans text-xs font-extrabold uppercase tracking-wider text-[#F8EED5]">
                Kanban Quest Board
              </span>
              <span className="font-serif italic text-[11px] text-[#D4A74A]/80 mt-1">
                Drag-and-Drop Task Backlog
              </span>
            </div>

            <div className="flex flex-col items-center justify-center bg-gradient-to-b from-[#3B2415] to-[#1A120C] border border-[#8F6236]/60 p-5 rounded-xs shadow-xl relative group hover:border-[#D4A74A]/80 transition-all">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#D4A74A] bg-gradient-to-br from-[#8F6236] via-[#5B3922] to-[#1A120C] shadow-[0_0_15px_rgba(212,167,74,0.3)] group-hover:scale-105 transition-transform">
                <Users className="h-6 w-6 text-[#D4A74A]" />
              </div>
              <span className="font-sans text-xs font-extrabold uppercase tracking-wider text-[#F8EED5]">
                Guild Team Roster
              </span>
              <span className="font-serif italic text-[11px] text-[#D4A74A]/80 mt-1">
                User Roles & Assignees
              </span>
            </div>

            <div className="flex flex-col items-center justify-center bg-gradient-to-b from-[#3B2415] to-[#1A120C] border border-[#8F6236]/60 p-5 rounded-xs shadow-xl relative group hover:border-[#D4A74A]/80 transition-all">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#D4A74A] bg-gradient-to-br from-[#8F6236] via-[#5B3922] to-[#1A120C] shadow-[0_0_15px_rgba(212,167,74,0.3)] group-hover:scale-105 transition-transform">
                <Scroll className="h-6 w-6 text-[#D4A74A]" />
              </div>
              <span className="font-sans text-xs font-extrabold uppercase tracking-wider text-[#F8EED5]">
                Analytics Ledger
              </span>
              <span className="font-serif italic text-[11px] text-[#D4A74A]/80 mt-1">
                Sprint KPIs & Activity Audit
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* NAVIGATION PLAQUES */}
      <section className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 border-t border-[#3B2415] bg-[#1A120C]/90">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-xl font-black uppercase tracking-[0.2em] text-[#D4A74A] mb-8 flex items-center justify-center gap-3">
            <span>⚔</span>
            <span>Explore High Chamber Views</span>
            <span>⚔</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <Link
              href="/dashboard"
              className="group p-5 bg-gradient-to-b from-[#5B3922] via-[#3B2415] to-[#1A120C] rounded-xs border-2 border-[#8F6236] hover:border-[#D4A74A] hover:shadow-[0_0_20px_rgba(212,167,74,0.3)] transition-all hover:-translate-y-1 relative"
            >
              <div className="flex items-center justify-center gap-2 mb-2 text-[#D4A74A] group-hover:scale-110 transition-transform">
                <span>⚔</span>
                <h3 className="font-sans text-xs font-black uppercase tracking-wider text-[#F8EED5]">
                  Dashboard
                </h3>
              </div>
              <p className="font-serif italic text-xs text-[#D4A74A]/80">Overview & Key Metrics</p>
            </Link>

            <Link
              href="/projects"
              className="group p-5 bg-gradient-to-b from-[#5B3922] via-[#3B2415] to-[#1A120C] rounded-xs border-2 border-[#8F6236] hover:border-[#D4A74A] hover:shadow-[0_0_20px_rgba(212,167,74,0.3)] transition-all hover:-translate-y-1 relative"
            >
              <div className="flex items-center justify-center gap-2 mb-2 text-[#D4A74A] group-hover:scale-110 transition-transform">
                <BarChart3 size={16} />
                <h3 className="font-sans text-xs font-black uppercase tracking-wider text-[#F8EED5]">
                  Projects
                </h3>
              </div>
              <p className="font-serif italic text-xs text-[#D4A74A]/80">Project Portfolio & Boards</p>
            </Link>

            <Link
              href="/analytics"
              className="group p-5 bg-gradient-to-b from-[#5B3922] via-[#3B2415] to-[#1A120C] rounded-xs border-2 border-[#8F6236] hover:border-[#D4A74A] hover:shadow-[0_0_20px_rgba(212,167,74,0.3)] transition-all hover:-translate-y-1 relative"
            >
              <div className="flex items-center justify-center gap-2 mb-2 text-[#D4A74A] group-hover:scale-110 transition-transform">
                <Scroll size={16} />
                <h3 className="font-sans text-xs font-black uppercase tracking-wider text-[#F8EED5]">
                  Analytics
                </h3>
              </div>
              <p className="font-serif italic text-xs text-[#D4A74A]/80">Sprint Audit & Progress</p>
            </Link>

            <Link
              href="/sign-in"
              className="group p-5 bg-gradient-to-b from-[#5B3922] via-[#3B2415] to-[#1A120C] rounded-xs border-2 border-[#8F6236] hover:border-[#D4A74A] hover:shadow-[0_0_20px_rgba(212,167,74,0.3)] transition-all hover:-translate-y-1 relative"
            >
              <div className="flex items-center justify-center gap-2 mb-2 text-[#D4A74A] group-hover:scale-110 transition-transform">
                <Lock size={16} />
                <h3 className="font-sans text-xs font-black uppercase tracking-wider text-[#F8EED5]">
                  Gatekeeper
                </h3>
              </div>
              <p className="font-serif italic text-xs text-[#D4A74A]/80">User Authentication</p>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 py-8 text-center border-t border-[#3B2415] bg-[#1A120C]">
        <div className="flex items-center justify-center gap-4 text-[#8F6236] text-xs mb-2">
          <div className="h-px w-24 bg-gradient-to-r from-transparent to-[#8F6236]" />
          <span>══════════════════════════</span>
          <div className="h-px w-24 bg-gradient-to-l from-transparent to-[#8F6236]" />
        </div>
        <p className="text-xs font-sans font-bold uppercase tracking-[0.3em] text-[#D4A74A]">
          The Roundtable © • Crafted by Dominic Herce
        </p>
      </footer>
    </div>
  )
}