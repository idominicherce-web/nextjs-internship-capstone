import { DashboardLayoutContainer } from "@/components/layout/dashboard-layout-container"

export default function TeamLoading() {
  return (
    <DashboardLayoutContainer>
      {/* HEADER SKELETON */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b-2 border-[#4A2C1D] pb-6 animate-pulse">
        <div className="space-y-2">
          <div className="h-3 w-36 bg-[#D7B05C]/20 rounded-xs" />
          <div className="h-10 w-48 bg-[#FFF5D6]/20 rounded-xs" />
          <div className="h-3.5 w-80 bg-[#D7B05C]/15 rounded-xs" />
        </div>
        <div className="h-10 w-36 bg-[#3B2415] border border-[#8F6236]/60 rounded-xs" />
      </div>

      <div className="space-y-8 mt-8">
        {/* STATS SKELETON */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xs border-2 border-[#4A2C1D] bg-[#1A120C] animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-[#2D1B10]/80 rounded-xs" />
          ))}
        </div>

        {/* MAIN GRID SKELETON */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-[#1A120C] border-2 border-[#3B2415] rounded-xs animate-pulse" />
          <div className="space-y-6">
            <div className="h-36 bg-[#1A120C] border-2 border-[#3B2415] rounded-xs animate-pulse" />
            <div className="h-48 bg-[#1A120C] border-2 border-[#3B2415] rounded-xs animate-pulse" />
          </div>
        </div>
      </div>
    </DashboardLayoutContainer>
  )
}