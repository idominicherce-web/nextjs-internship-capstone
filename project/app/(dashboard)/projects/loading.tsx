import { DashboardLayoutContainer } from "@/components/layout/dashboard-layout-container"

export default function ProjectsLoading() {
  const cardSkeletons = [
    "proj-card-skel-1",
    "proj-card-skel-2",
    "proj-card-skel-3",
    "proj-card-skel-4",
    "proj-card-skel-5",
    "proj-card-skel-6",
  ]

  return (
    <DashboardLayoutContainer>
      {/* SKELETON HERO HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b-2 border-[#4A2C1D] pb-6 relative animate-pulse">
        <div className="space-y-2">
          {/* Badge Subheading Placeholder */}
          <div className="flex items-center gap-2">
            <div className="h-3 w-4 bg-[#D7B05C]/30 rounded-xs" />
            <div className="h-3 w-48 bg-[#D7B05C]/20 rounded-xs" />
            <div className="h-3 w-4 bg-[#D7B05C]/30 rounded-xs" />
          </div>

          {/* Main Title Placeholder */}
          <div className="h-10 sm:h-12 w-56 bg-linear-to-b from-[#FFF5D6]/20 via-[#D7B05C]/20 to-[#B78B3E]/10 rounded-xs" />

          {/* Description Placeholder */}
          <div className="h-3.5 w-72 sm:w-96 bg-[#D7B05C]/15 rounded-xs mt-1" />
        </div>

        {/* Action Button Placeholder */}
        <div className="shrink-0 h-10 w-36 bg-[#3B2415] border border-[#8F6236]/60 rounded-xs shadow-md" />
      </div>

      <div className="space-y-6 mt-6">
        {/* SKELETON SUMMARY STATS BAR */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-pulse">
          {[1, 2, 3].map((index) => (
            <div
              key={`stats-plaque-${index}`}
              className="p-4 rounded-xs border-2 border-[#3B2415] bg-gradient-to-b from-[#2D1B10] via-[#1A120C] to-[#100A07] shadow-xl flex items-center justify-between"
            >
              <div className="space-y-1.5">
                <div className="h-2.5 w-24 bg-[#D7B05C]/20 rounded-xs" />
                <div className="h-7 w-12 bg-[#FFF5D6]/20 rounded-xs" />
              </div>
              <div className="w-8 h-8 rounded-full bg-[#8F6236]/20 border border-[#8F6236]/30" />
            </div>
          ))}
        </div>

        {/* SKELETON SEARCH & SORT CONTROL BAR */}
        <div className="flex flex-col sm:flex-row gap-4 relative animate-pulse">
          {/* Search Input Placeholder */}
          <div className="flex-1 h-11 bg-[#1A120C] border-2 border-[#8F6236]/40 rounded-xs shadow-inner" />

          {/* Sort Dropdown Placeholder */}
          <div className="w-full sm:w-48 h-11 bg-[#2D1B10] border-2 border-[#8F6236]/40 rounded-xs" />
        </div>

        {/* SKELETON LEATHER PROJECT CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {cardSkeletons.map((key) => (
            <div
              key={key}
              className="relative p-5 rounded-xs border-4 border-[#3B2415] bg-gradient-to-b from-[#2D1B10] via-[#1A120C] to-[#100A07] shadow-2xl space-y-4 flex flex-col justify-between overflow-hidden min-h-[280px]"
            >
              {/* Corner Brackets */}
              <div className="absolute left-1 top-1 w-3 h-3 border border-black/40 bg-[#D7B05C]/20" />
              <div className="absolute right-1 top-1 w-3 h-3 border border-black/40 bg-[#D7B05C]/20" />
              <div className="absolute bottom-1 left-1 w-3 h-3 border border-black/40 bg-[#D7B05C]/20" />
              <div className="absolute bottom-1 right-1 w-3 h-3 border border-black/40 bg-[#D7B05C]/20" />

              <div className="space-y-4">
                {/* Header Row */}
                <div className="flex items-start justify-between gap-3 border-b border-[#4A2C1D] pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xs border border-[#D7B05C]/30 bg-[#15100C]" />
                    <div className="space-y-1.5">
                      <div className="h-4 w-32 bg-[#F8EEDB]/20 rounded-xs" />
                      <div className="h-2.5 w-24 bg-[#D7B05C]/15 rounded-xs" />
                    </div>
                  </div>

                  <div className="h-4 w-12 bg-[#3B2415] border border-[#8F6236]/40 rounded-xs" />
                </div>

                {/* Description Lines */}
                <div className="space-y-2 py-1">
                  <div className="h-3 w-full bg-[#D7B05C]/15 rounded-xs" />
                  <div className="h-3 w-4/5 bg-[#D7B05C]/15 rounded-xs" />
                </div>

                {/* Progress Bar Section */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between">
                    <div className="h-2.5 w-28 bg-[#D7B05C]/20 rounded-xs" />
                    <div className="h-2.5 w-8 bg-[#D7B05C]/20 rounded-xs" />
                  </div>
                  <div className="h-3.5 w-full bg-[#100A07] rounded-xs border border-[#8F6236]/40" />
                </div>

                {/* Info Strip */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#4A2C1D]/60">
                  <div className="h-3 w-20 bg-[#D7B05C]/15 rounded-xs" />
                  <div className="h-3 w-24 bg-[#D7B05C]/15 rounded-xs justify-self-end" />
                </div>
              </div>

              {/* Action Button Placeholder */}
              <div className="mt-4 pt-3 border-t border-[#4A2C1D]">
                <div className="h-10 w-full bg-[#3B2415] border border-[#D7B05C]/40 rounded-xs shadow-sm" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayoutContainer>
  )
}