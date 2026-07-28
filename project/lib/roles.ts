// lib/roles.ts

export interface RoleTheme {
  royalTitle: string
  shieldBg: string
  shieldBorder: string
  shieldIcon: string
  badgeBg: string
  badgeBorder: string
  badgeText: string
  bannerColor: string
}

/**
 * Color-coding & Dual-Label helper for Heraldic Shields, Role Badges, 
 * and Royal Titles based on professional discipline.
 */
export function getDisciplineTheme(role: string): RoleTheme {
  const r = role.toLowerCase().trim()

  // Workspace Owner / Admin / King
  if (r.includes("owner") || r.includes("admin") || r.includes("king")) {
    return {
      royalTitle: r.includes("owner") ? "Royal Sovereign" : "Chancellor",
      shieldBg: "from-[#D7B05C] via-[#B78B3E] to-[#5B3922]",
      shieldBorder: "border-[#FFF5D6]",
      shieldIcon: "text-[#15100C]",
      badgeBg: "bg-[#D7B05C]/20",
      badgeBorder: "border-[#D7B05C]",
      badgeText: "text-[#D7B05C]",
      bannerColor: "bg-[#D7B05C]",
    }
  }

  // Project Manager / Lead
  if (r.includes("manager") || r.includes("lead")) {
    return {
      royalTitle: "High Commander",
      shieldBg: "from-[#2A4365] via-[#1A202C] to-[#0F172A]",
      shieldBorder: "border-[#63B3ED]",
      shieldIcon: "text-[#63B3ED]",
      badgeBg: "bg-[#2B6CB0]/25",
      badgeBorder: "border-[#63B3ED]",
      badgeText: "text-[#90CDF4]",
      bannerColor: "bg-[#3182CE]",
    }
  }

  // Frontend / Web Developer
  if (r.includes("frontend") || r.includes("developer")) {
    return {
      royalTitle: "Royal Engineer",
      shieldBg: "from-[#1D4ED8] via-[#1E3A8A] to-[#0F172A]",
      shieldBorder: "border-[#93C5FD]",
      shieldIcon: "text-[#93C5FD]",
      badgeBg: "bg-[#1E40AF]/25",
      badgeBorder: "border-[#60A5FA]",
      badgeText: "text-[#93C5FD]",
      bannerColor: "bg-[#2563EB]",
    }
  }

  // Software / Systems Engineer
  if (r.includes("engineer") || r.includes("software")) {
    return {
      royalTitle: "Royal Siege Engineer",
      shieldBg: "from-[#991B1B] via-[#450A0A] to-[#180202]",
      shieldBorder: "border-[#FCA5A5]",
      shieldIcon: "text-[#FCA5A5]",
      badgeBg: "bg-[#991B1B]/25",
      badgeBorder: "border-[#F87171]",
      badgeText: "text-[#FCA5A5]",
      bannerColor: "bg-[#DC2626]",
    }
  }

  // QA Engineer / Tester
  if (r.includes("qa") || r.includes("tester")) {
    return {
      royalTitle: "Royal Inquisitor",
      shieldBg: "from-[#065F46] via-[#022C22] to-[#021A12]",
      shieldBorder: "border-[#6EE7B7]",
      shieldIcon: "text-[#6EE7B7]",
      badgeBg: "bg-[#065F46]/25",
      badgeBorder: "border-[#34D399]",
      badgeText: "text-[#6EE7B7]",
      bannerColor: "bg-[#059669]",
    }
  }

  // UI/UX Designer
  if (r.includes("designer") || r.includes("ui") || r.includes("ux")) {
    return {
      royalTitle: "Master Artisan",
      shieldBg: "from-[#6B21A8] via-[#3B0764] to-[#1E0236]",
      shieldBorder: "border-[#D8B4FE]",
      shieldIcon: "text-[#D8B4FE]",
      badgeBg: "bg-[#6B21A8]/25",
      badgeBorder: "border-[#C084FC]",
      badgeText: "text-[#E9D5FF]",
      bannerColor: "bg-[#9333EA]",
    }
  }

  // DevOps / Infrastructure
  if (r.includes("devops") || r.includes("infra")) {
    return {
      royalTitle: "Realm Keeper",
      shieldBg: "from-[#334155] via-[#1E293B] to-[#0F172A]",
      shieldBorder: "border-[#94A3B8]",
      shieldIcon: "text-[#CBD5E1]",
      badgeBg: "bg-[#334155]/30",
      badgeBorder: "border-[#94A3B8]",
      badgeText: "text-[#E2E8F0]",
      bannerColor: "bg-[#64748B]",
    }
  }

  // Default Guild Member Theme
  return {
    royalTitle: "Council Officer",
    shieldBg: "from-[#4A2C1D] via-[#2D1B10] to-[#15100C]",
    shieldBorder: "border-[#B78B3E]",
    shieldIcon: "text-[#D7B05C]",
    badgeBg: "bg-[#B78B3E]/20",
    badgeBorder: "border-[#B78B3E]",
    badgeText: "text-[#D7B05C]",
    bannerColor: "bg-[#B78B3E]",
  }
}