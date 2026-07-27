// app/(dashboard)/team/page.tsx
import { db } from "@/lib/db"
import { users, projects } from "@/lib/db/schema"
import { getOrCreateDbUser } from "@/lib/auth"
import { getDisciplineTheme } from "@/lib/roles"
import { UserPlus, Mail, MoreHorizontal, Shield, Scroll, Award, Users, Activity } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function TeamPage() {
  const dbUser = await getOrCreateDbUser()

  // 1. Fetch real users from Neon PostgreSQL DB
  const dbUsers = await db.select().from(users)
  const allProjects = await db.select().from(projects)

  // Fallback mock team members to fill grid if DB users are few
  const fallbackMembers = [
    { id: "1", name: "John Doe", role: "Project Manager", email: "john@example.com", avatar: "JD", projectCount: 8 },
    { id: "2", name: "Jane Smith", role: "Frontend Developer", email: "jane@example.com", avatar: "JS", projectCount: 3 },
    { id: "3", name: "Mike Johnson", role: "UI/UX Designer", email: "mike@example.com", avatar: "MJ", projectCount: 5 },
    { id: "4", name: "Sarah Wilson", role: "Software Engineer", email: "sarah@example.com", avatar: "SW", projectCount: 10 },
    { id: "5", name: "Tom Brown", role: "QA Engineer", email: "tom@example.com", avatar: "TB", projectCount: 7 },
    { id: "6", name: "Lisa Davis", role: "DevOps Engineer", email: "lisa@example.com", avatar: "LD", projectCount: 7 },
  ]

  // Map real database users to team card format
  const mappedDbUsers = dbUsers.map((u) => {
    const userProjects = allProjects.filter((p) => p.userId === u.id).length
    const displayName = u.name || u.email.split("@")[0]
    const initials = displayName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)

    return {
      id: u.id,
      name: displayName,
      role: u.id === dbUser?.id ? "Workspace Admin" : "Team Member",
      email: u.email,
      avatar: initials || "U",
      projectCount: userProjects || 1,
    }
  })

  // Combine real database users with mock fallbacks to maintain complete grid view
  const combinedTeam = [...mappedDbUsers]
  fallbackMembers.forEach((fallback) => {
    if (!combinedTeam.some((member) => member.email === fallback.email)) {
      combinedTeam.push(fallback)
    }
  })

  const teamMembers = combinedTeam.slice(0, 6)

  // Separate Officers/Admins vs. Regular Members for hierarchy
  const officers = teamMembers.filter((m) => m.role.includes("Admin") || m.role.includes("Manager"))
  const regularMembers = teamMembers.filter((m) => !m.role.includes("Admin") && !m.role.includes("Manager"))

  // Summary Metrics calculations
  const totalMembers = teamMembers.length
  const totalActiveProjects = teamMembers.reduce((acc, curr) => acc + curr.projectCount, 0)
  const totalAdmins = teamMembers.filter((m) => m.role.includes("Admin")).length

  return (
    <div className="min-h-screen bg-[#15100C] text-[#F8EEDB] font-serif p-4 sm:p-8 relative select-none overflow-hidden antialiased">
      
      {/* Castle Stone Wall Vignette & Subtle Atmospheric Torch Lighting */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_20%,rgba(215,176,92,0.15),transparent_60%)] mix-blend-screen" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_50%,transparent_30%,rgba(0,0,0,0.9)_100%)] mix-blend-multiply" />

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        
        {/* Header Bar */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b-2 border-[#4A2C1D] pb-6">
          <div>
            <div className="flex items-center gap-2 text-[#D7B05C] text-xs font-sans uppercase font-extrabold tracking-[0.25em] mb-1.5">
              <span>⚔</span>
              <span>Roundtable Council</span>
              <span>⚔</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black bg-gradient-to-b from-[#FFF5D6] via-[#D7B05C] to-[#B78B3E] bg-clip-text text-transparent uppercase tracking-[0.1em] filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              Team Members
            </h1>
            <p className="text-xs sm:text-sm font-sans text-[#D7B05C]/80 mt-2 italic max-w-2xl leading-relaxed">
              Manage team members, assign permissions, and oversee active workspace operations.
            </p>
          </div>

          {/* Carved Oak & Gold Trim Recruit Button */}
          <button className="group relative inline-flex items-center px-6 py-3 border-2 border-[#D7B05C] bg-gradient-to-b from-[#5B3922] via-[#3B2415] to-[#1A120C] text-[#F8EEDB] font-sans text-xs font-black uppercase tracking-[0.2em] rounded-xs shadow-[0_10px_25px_rgba(0,0,0,0.8)] transition-all duration-200 hover:text-white hover:border-[#FFF5D6] hover:shadow-[0_0_30px_rgba(215,176,92,0.5)] active:translate-y-0.5 hover:-translate-y-0.5 cursor-pointer shrink-0">
            <UserPlus size={16} className="mr-2.5 text-[#D7B05C] group-hover:scale-110 transition-transform" />
            <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">Recruit New Member</span>
          </button>
        </div>

        {/* ================= GUILD SUMMARY STATISTICS BAR ================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xs border-2 border-[#4A2C1D] bg-gradient-to-b from-[#2D1B10] via-[#1A120C] to-[#15100C] shadow-2xl relative">
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#D7B05C]/50 to-transparent" />
          
          <div className="flex items-center space-x-3 p-2 border-r border-[#4A2C1D]/60 last:border-0">
            <div className="p-2.5 rounded-full border border-[#D7B05C]/50 bg-[#15100C] text-[#D7B05C]">
              <Users size={18} />
            </div>
            <div>
              <p className="text-[10px] font-sans uppercase font-bold text-[#D7B05C]/70 tracking-widest">Total Guild</p>
              <p className="text-lg font-black text-[#F8EEDB]">{totalMembers} Members</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-2 border-r border-[#4A2C1D]/60 last:border-0">
            <div className="p-2.5 rounded-full border border-[#D7B05C]/50 bg-[#15100C] text-[#D7B05C]">
              <Scroll size={18} />
            </div>
            <div>
              <p className="text-[10px] font-sans uppercase font-bold text-[#D7B05C]/70 tracking-widest">Active Projects</p>
              <p className="text-lg font-black text-[#F8EEDB]">{totalActiveProjects} Assigned</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-2 border-r border-[#4A2C1D]/60 last:border-0">
            <div className="p-2.5 rounded-full border border-[#D7B05C]/50 bg-[#15100C] text-[#D7B05C]">
              <Award size={18} />
            </div>
            <div>
              <p className="text-[10px] font-sans uppercase font-bold text-[#D7B05C]/70 tracking-widest">High Command</p>
              <p className="text-lg font-black text-[#F8EEDB]">{totalAdmins} Admin</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-2">
            <div className="p-2.5 rounded-full border border-emerald-500/50 bg-[#15100C] text-emerald-400">
              <Activity size={18} />
            </div>
            <div>
              <p className="text-[10px] font-sans uppercase font-bold text-[#D7B05C]/70 tracking-widest">Readiness</p>
              <p className="text-lg font-black text-emerald-400">100% On Duty</p>
            </div>
          </div>
        </div>

        {/* Decorative Divider */}
        <div className="flex items-center justify-center gap-4 text-[#B78B3E] text-xs py-2">
          <div className="h-px w-36 bg-gradient-to-r from-transparent to-[#4A2C1D]" />
          <span>⚔ ──── ❦ ──── ⚔</span>
          <div className="h-px w-36 bg-gradient-to-l from-transparent to-[#4A2C1D]" />
        </div>

        {/* ================= SECTION 1: GUILD OFFICERS ================= */}
        {officers.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm font-sans font-black uppercase tracking-[0.25em] text-[#D7B05C]">
              <span>👑</span>
              <h2>Guild Officers & Leadership</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-[#4A2C1D] to-transparent" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {officers.map((member) => renderMemberCard(member))}
            </div>
          </div>
        )}

        {/* ================= SECTION 2: GUILD MEMBERS ================= */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-3 text-sm font-sans font-black uppercase tracking-[0.25em] text-[#D7B05C]">
            <span>🛡️</span>
            <h2>Guild Members & Specialists</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-[#4A2C1D] to-transparent" />
          </div>

          {regularMembers.length === 0 ? (
            /* Parchment Empty State Scroll */
            <div className="p-8 rounded-xs border-2 border-[#8F6236]/60 bg-[#F2E3BE] text-center text-[#2D1B10] shadow-2xl">
              <Scroll size={32} className="mx-auto mb-2 text-[#7B4A2A]" />
              <h3 className="font-serif font-black text-lg">The Guild Hall awaits its first brave member.</h3>
              <p className="text-xs font-sans italic mt-1 text-[#7B4A2A]">Recruit a new member above to expand your project command.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularMembers.map((member) => renderMemberCard(member))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

// Helper Renderer for Handcrafted Mounted Plaque Member Cards
function renderMemberCard(member: { id: string; name: string; role: string; email: string; avatar: string; projectCount: number }) {
  const theme = getDisciplineTheme(member.role)

  return (
    <div
      key={member.id}
      className="group relative transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] z-10"
    >
      {/* House Banner Stripe Color Top Identifier */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 h-2 w-16 ${theme.bannerColor} rounded-t-xs z-30 border-t border-x border-black shadow-md`} />

      {/* Layered Cast Shadow Depth */}
      <div className="absolute inset-0 translate-y-4 rounded-md bg-black/90 blur-lg pointer-events-none transition-all group-hover:blur-2xl" />

      {/* Forged Iron Pin */}
      <div className="absolute left-1/2 -top-2.5 z-40 h-4 w-4 -translate-x-1/2 rounded-full border border-black bg-gradient-to-br from-zinc-600 via-zinc-800 to-zinc-950 shadow-[0_4px_8px_rgba(0,0,0,0.9)]" />

      {/* Carved Oak Outer Plaque Frame */}
      <div className="relative z-20 rounded-xs border-4 border-[#3B2415] bg-gradient-to-b from-[#4A2C1D] via-[#2D1B10] to-[#15100C] p-6 shadow-2xl overflow-hidden group-hover:border-[#D7B05C] group-hover:shadow-[0_0_25px_rgba(215,176,92,0.35)] transition-all">
        
        {/* Brass Corner Fittings */}
        <div className="absolute left-1 top-1 z-30 h-4 w-4 border border-black bg-gradient-to-br from-[#D7B05C] to-[#B78B3E] rounded-xs group-hover:from-[#FFF5D6] group-hover:to-[#D7B05C] transition-colors" />
        <div className="absolute right-1 top-1 z-30 h-4 w-4 border border-black bg-gradient-to-br from-[#D7B05C] to-[#B78B3E] rounded-xs group-hover:from-[#FFF5D6] group-hover:to-[#D7B05C] transition-colors" />
        <div className="absolute bottom-1 left-1 z-30 h-4 w-4 border border-black bg-gradient-to-br from-[#D7B05C] to-[#B78B3E] rounded-xs group-hover:from-[#FFF5D6] group-hover:to-[#D7B05C] transition-colors" />
        <div className="absolute bottom-1 right-1 z-30 h-4 w-4 border border-black bg-gradient-to-br from-[#D7B05C] to-[#B78B3E] rounded-xs group-hover:from-[#FFF5D6] group-hover:to-[#D7B05C] transition-colors" />

        {/* Sunken Dark Walnut Inner Well */}
        <div className="bg-[#100A07] border-2 border-[#2D1B10] p-4 rounded-xs shadow-inner">
          
          {/* Header Area: Discipline Heraldic Shield & Name */}
          <div className="flex items-start justify-between mb-4 relative z-30">
            <div className="flex items-center space-x-3.5">
              
              {/* Heraldic Shield Avatar with Discipline Color Gradient */}
              <div className={`relative flex h-14 w-12 shrink-0 items-center justify-center rounded-t-lg rounded-b-xl border-2 ${theme.shieldBorder} bg-gradient-to-b ${theme.shieldBg} font-bold text-sm shadow-[0_0_15px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform`}>
                <Shield className={`absolute inset-0 h-full w-full opacity-20 pointer-events-none ${theme.shieldIcon}`} />
                <span className={`relative z-10 tracking-widest font-sans font-black drop-shadow-md ${theme.shieldIcon}`}>
                  {member.avatar}
                </span>
              </div>

              <div>
                {/* DOMINANT MEMBER NAME */}
                <h3 className="font-serif font-black text-[#F8EEDB] text-lg tracking-wide group-hover:text-[#D7B05C] transition-colors drop-shadow-xs">
                  {member.name}
                </h3>
                
                {/* PROMINENT COLOR-CODED REAL ROLE BADGE */}
                <span className={`inline-block mt-1 font-sans text-[10px] font-black uppercase tracking-[0.15em] px-2.5 py-0.5 rounded-xs border shadow-md ${theme.badgeBg} ${theme.badgeBorder} ${theme.badgeText}`}>
                  {member.role}
                </span>
              </div>
            </div>

            <button className="p-1.5 text-[#D7B05C]/60 hover:text-[#D7B05C] hover:bg-[#15100C] rounded transition-colors cursor-pointer">
              <MoreHorizontal size={16} />
            </button>
          </div>

          {/* Parchment Messenger Email Panel */}
          <div
            className="relative z-30 rounded-xs border border-[#8F6236]/60 p-3 mb-4 shadow-inner"
            style={{
              backgroundColor: "#FAF0D7",
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
            <div className="flex items-center text-xs font-sans font-extrabold text-[#1A120C]">
              <Mail size={14} className="mr-2 text-[#7B4A2A] shrink-0" />
              <span className="truncate">{member.email}</span>
            </div>
          </div>

          {/* Bottom Footer Details */}
          <div className="flex items-center justify-between pt-3 border-t border-[#4A2C1D]/80 relative z-30">
            
            {/* Pulsing On Duty Status Beacon */}
            <span className="inline-flex items-center px-2.5 py-0.5 text-[10px] font-sans font-extrabold uppercase tracking-widest rounded-xs bg-emerald-950/90 text-emerald-300 border border-emerald-700/80 shadow-xs">
              <span className="relative flex h-2 w-2 mr-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              On Duty
            </span>

            {/* Assigned Projects Count */}
            <div className="flex items-center text-xs font-sans font-extrabold uppercase tracking-wider text-[#D7B05C]">
              <Scroll size={14} className="mr-1.5 text-[#D7B05C]" />
              <span>
                {member.projectCount} {member.projectCount === 1 ? "Assigned Project" : "Assigned Projects"}
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}