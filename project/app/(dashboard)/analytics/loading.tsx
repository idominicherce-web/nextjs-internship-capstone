import { DashboardLayoutContainer } from "@/components/layout/dashboard-layout-container"

export default function AnalyticsLoading() {
  const statCardKeys = ["stat-1", "stat-2", "stat-3", "stat-4"]
  const activityKeys = ["act-1", "act-2", "act-3", "act-4"]

  return (
    <DashboardLayoutContainer>
      {/* SKELETON HERO HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b-2 border-[#4A2C1D] pb-6 relative animate-pulse">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-3 w-4 bg-[#D7B05C]/30 rounded-xs" />
            <div className="h-3 w-44 bg-[#D7B05C]/20 rounded-xs" />
            <div className="h-3 w-4 bg-[#D7B05C]/30 rounded-xs" />
          </div>

          <div className="h-10 sm:h-12 w-80 sm:w-[450px] bg-linear-to-b from-[#FFF5D6]/20 via-[#D7B05C]/20 to-[#B78B3E]/10 rounded-xs" />

          <div className="h-3.5 w-72 sm:w-96 bg-[#D7B05C]/15 rounded-xs mt-1" />
        </div>
      </div>

      <div className="space-y-8 mt-8">
        {/* 1. SKELETON EXECUTIVE KPI SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {statCardKeys.map((key) => (
            <div
              key={key}
              className="p-4 rounded-xs border-2 border-[#3B2415] bg-gradient-to-b from-[#2D1B10] via-[#1A120C] to-[#100A07] shadow-xl space-y-3 relative overflow-hidden"
            >
              <div className="flex justify-between items-center">
                <div className="h-3 w-24 bg-[#D7B05C]/20 rounded-xs" />
                <div className="w-5 h-5 bg-[#8F6236]/30 rounded-xs" />
              </div>
              <div className="h-8 w-16 bg-[#FFF5D6]/20 rounded-xs" />
              <div className="h-2.5 w-32 bg-[#D7B05C]/15 rounded-xs" />
            </div>
          ))}
        </div>

        {/* 2. SKELETON WORKSPACE HEALTH SCORE CARD */}
        <div className="p-6 rounded-xs border-4 border-[#3B2415] bg-gradient-to-b from-[#2D1B10] via-[#1A120C] to-[#100A07] shadow-2xl animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-[#15100C]/80 border-2 border-[#4A2C1D] rounded-xs space-y-3">
              <div className="h-3 w-32 bg-[#D7B05C]/20 rounded-xs" />
              <div className="w-28 h-28 rounded-full border-4 border-[#8F6236]/40 bg-[#100A07]" />
              <div className="h-6 w-24 bg-[#2D1B10] border border-[#8F6236]/40 rounded-xs" />
            </div>

            <div className="lg:col-span-8 space-y-4">
              <div className="h-5 w-44 bg-[#D7B05C]/20 rounded-xs" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[1, 2, 3, 4].map((i) => (
                  <div key={`summary-skel-${i}`} className="h-16 bg-[#15100C]/60 border border-[#4A2C1D] rounded-xs" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* DECORATIVE DIVIDER */}
        <div className="flex items-center justify-center gap-4 text-[#B78B3E]/40 text-xs py-1">
          <div className="h-px w-36 bg-gradient-to-r from-transparent to-[#4A2C1D]" />
          <span>⚔ ──── ❦ ──── ⚔</span>
          <div className="h-px w-36 bg-gradient-to-l from-transparent to-[#4A2C1D]" />
        </div>

        {/* 3. SKELETON VISUAL CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-pulse">
          <div className="p-5 rounded-xs border-2 border-[#3B2415] bg-[#1A120C] shadow-2xl h-60" />
          <div className="p-5 rounded-xs border-2 border-[#3B2415] bg-[#1A120C] shadow-2xl h-60" />
        </div>

        {/* 4. SKELETON ACTIVITY ARCHIVE FEED */}
        <div className="p-5 rounded-xs border-2 border-[#3B2415] bg-[#1A120C] shadow-2xl space-y-4 animate-pulse">
          <div className="flex justify-between items-center border-b border-[#4A2C1D] pb-3">
            <div className="h-5 w-40 bg-[#D7B05C]/20 rounded-xs" />
            <div className="h-4 w-16 bg-[#D7B05C]/15 rounded-xs" />
          </div>

          <div className="space-y-3 pt-1">
            {activityKeys.map((key) => (
              <div
                key={key}
                className="flex items-center justify-between p-2.5 border-b border-[#4A2C1D]/40 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#8F6236]/20 shrink-0" />
                  <div className="space-y-1">
                    <div className="h-3.5 w-48 bg-[#F8EEDB]/20 rounded-xs" />
                    <div className="h-2.5 w-32 bg-[#D7B05C]/15 rounded-xs" />
                  </div>
                </div>
                <div className="h-2.5 w-16 bg-[#D7B05C]/10 rounded-xs" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayoutContainer>
  )
}