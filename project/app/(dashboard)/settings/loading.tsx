import { DashboardLayoutContainer } from "@/components/layout/dashboard-layout-container"

export default function SettingsLoading() {
  return (
    <DashboardLayoutContainer>
      {/* SKELETON HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b-2 border-[#4A2C1D] pb-6 animate-pulse">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-3 w-4 bg-[#D7B05C]/30 rounded-xs" />
            <div className="h-3 w-40 bg-[#D7B05C]/20 rounded-xs" />
            <div className="h-3 w-4 bg-[#D7B05C]/30 rounded-xs" />
          </div>

          <div className="h-10 sm:h-12 w-48 bg-linear-to-b from-[#FFF5D6]/20 via-[#D7B05C]/20 to-[#B78B3E]/10 rounded-xs" />

          <div className="h-3.5 w-72 sm:w-96 bg-[#D7B05C]/15 rounded-xs mt-1" />
        </div>
      </div>

      {/* SKELETON DECORATIVE DIVIDER */}
      <div className="flex items-center justify-center gap-4 text-[#B78B3E]/40 text-xs py-2 my-2">
        <div className="h-px w-36 bg-gradient-to-r from-transparent to-[#4A2C1D]" />
        <span>⚔ ──── ⚜ ──── ⚔</span>
        <div className="h-px w-36 bg-gradient-to-l from-transparent to-[#4A2C1D]" />
      </div>

      {/* SKELETON SETTINGS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-pulse">
        
        {/* Navigation Sidebar Skeleton (3 Cols) */}
        <div className="lg:col-span-3 p-4 rounded-xs border-2 border-[#3B2415] bg-[#1A120C] space-y-4">
          <div className="h-3 w-20 bg-[#D7B05C]/20 rounded-xs" />
          <div className="space-y-2">
            <div className="h-9 w-full bg-[#2D1B10] border-l-4 border-[#D7B05C] rounded-xs" />
            <div className="h-9 w-full bg-[#15100C] rounded-xs" />
          </div>

          <div className="h-px w-full bg-[#4A2C1D]" />

          <div className="h-3 w-24 bg-[#D7B05C]/20 rounded-xs" />
          <div className="space-y-2">
            <div className="h-9 w-full bg-[#15100C] rounded-xs" />
            <div className="h-9 w-full bg-[#15100C] rounded-xs" />
          </div>
        </div>

        {/* Main Form Skeleton Workspace (9 Cols) */}
        <div className="lg:col-span-9 space-y-6">
          <div className="p-6 rounded-xs border-2 border-[#3B2415] bg-[#1A120C] space-y-6">
            <div className="flex justify-between items-center border-b border-[#4A2C1D] pb-4">
              <div className="h-6 w-44 bg-[#FFF5D6]/20 rounded-xs" />
              <div className="h-5 w-24 bg-[#D7B05C]/15 rounded-xs" />
            </div>

            {/* Profile Summary Banner Skeleton */}
            <div className="h-20 bg-[#2D1B10]/60 border border-[#8F6236]/40 rounded-xs" />

            {/* Form Inputs Skeleton */}
            <div className="max-w-2xl space-y-4">
              <div className="space-y-2">
                <div className="h-3 w-20 bg-[#D7B05C]/20 rounded-xs" />
                <div className="h-10 w-full bg-[#FAF0D7]/15 border border-[#8F6236]/40 rounded-xs" />
              </div>

              <div className="space-y-2">
                <div className="h-3 w-28 bg-[#D7B05C]/20 rounded-xs" />
                <div className="h-10 w-full bg-[#FAF0D7]/15 border border-[#8F6236]/40 rounded-xs" />
              </div>

              <div className="space-y-2">
                <div className="h-3 w-28 bg-[#D7B05C]/20 rounded-xs" />
                <div className="h-10 w-full bg-[#2D1B10] border border-[#8F6236]/40 rounded-xs" />
              </div>
            </div>
          </div>

          {/* Session Status Skeleton */}
          <div className="h-16 bg-[#1A120C] border-2 border-[#3B2415] rounded-xs" />
        </div>

      </div>
    </DashboardLayoutContainer>
  )
}