export default function CalendarLoading() {
	const dayGridCells = Array.from({ length: 35 }, (_, i) => i);
	const statCardKeys = ["cal-stat-1", "cal-stat-2", "cal-stat-3", "cal-stat-4"];
	const upcomingKeys = ["up-1", "up-2", "up-3"];

	return (
		<div className="min-h-screen bg-[#15100C] text-[#F8EEDB] font-serif p-4 sm:p-8 relative select-none overflow-hidden antialiased">
			{/* Ambient Vignette Overlay */}
			<div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_15%,rgba(215,176,92,0.14),transparent_65%)] mix-blend-screen" />
			<div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_50%,transparent_20%,rgba(0,0,0,0.92)_100%)] mix-blend-multiply" />

			<div className="max-w-7xl mx-auto space-y-8 relative z-10">
				{/* SKELETON HEADER BAR */}
				<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b-2 border-[#4A2C1D] pb-6 animate-pulse">
					<div className="space-y-2">
						<div className="flex items-center gap-2">
							<div className="h-3 w-4 bg-[#D7B05C]/30 rounded-xs" />
							<div className="h-3 w-40 bg-[#D7B05C]/20 rounded-xs" />
							<div className="h-3 w-4 bg-[#D7B05C]/30 rounded-xs" />
						</div>

						<div className="h-10 sm:h-12 w-52 bg-linear-to-b from-[#FFF5D6]/20 via-[#D7B05C]/20 to-[#B78B3E]/10 rounded-xs" />

						<div className="h-3.5 w-72 sm:w-96 bg-[#D7B05C]/15 rounded-xs mt-1" />
					</div>

					<div className="shrink-0 h-11 w-48 bg-[#3B2415] border-2 border-[#8F6236]/60 rounded-xs shadow-md" />
				</div>

				{/* SKELETON LEGEND INDEX BAR */}
				<div className="p-3.5 rounded-xs border-2 border-[#3B2415] bg-[#1A120C] flex flex-wrap items-center justify-between gap-4 animate-pulse">
					<div className="h-3.5 w-32 bg-[#D7B05C]/20 rounded-xs" />
					<div className="flex flex-wrap gap-4">
						{[1, 2, 3, 4, 5].map((i) => (
							<div key={`legend-skel-${i}`} className="flex items-center gap-2">
								<div className="w-3 h-3 rounded-full bg-[#8F6236]/40" />
								<div className="h-3 w-16 bg-[#D7B05C]/15 rounded-xs" />
							</div>
						))}
					</div>
				</div>

				{/* SKELETON quest STATS PLAQUES */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
					{statCardKeys.map((key) => (
						<div
							key={key}
							className="p-4 rounded-xs border-2 border-[#3B2415] bg-gradient-to-b from-[#2D1B10] via-[#1A120C] to-[#100A07] shadow-xl space-y-2 relative"
						>
							<div className="flex items-center justify-between">
								<div className="h-2.5 w-24 bg-[#D7B05C]/20 rounded-xs" />
								<div className="w-5 h-5 bg-[#8F6236]/30 rounded-xs" />
							</div>
							<div className="h-7 w-12 bg-[#FFF5D6]/20 rounded-xs" />
							<div className="h-2.5 w-28 bg-[#D7B05C]/10 rounded-xs" />
						</div>
					))}
				</div>

				{/* DECORATIVE DIVIDER */}
				<div className="flex items-center justify-center gap-4 text-[#B78B3E]/40 text-xs py-1">
					<div className="h-px w-32 bg-gradient-to-r from-transparent to-[#4A2C1D]" />
					<span>⚔ ──── ⚜ ──── ⚔</span>
					<div className="h-px w-32 bg-gradient-to-l from-transparent to-[#4A2C1D]" />
				</div>

				{/* SKELETON MAIN CALENDAR GRID */}
				<div className="p-4 sm:p-6 rounded-xs border-4 border-[#3B2415] bg-gradient-to-b from-[#2D1B10] via-[#1A120C] to-[#100A07] shadow-2xl space-y-4 animate-pulse">
					{/* Calendar Month Navigation Bar */}
					<div className="flex items-center justify-between border-b-2 border-[#4A2C1D] pb-4">
						<div className="h-8 w-44 bg-[#FFF5D6]/20 rounded-xs" />
						<div className="flex items-center gap-2">
							<div className="h-8 w-8 bg-[#3B2415] border border-[#8F6236]/40 rounded-xs" />
							<div className="h-8 w-16 bg-[#3B2415] border border-[#8F6236]/40 rounded-xs" />
							<div className="h-8 w-8 bg-[#3B2415] border border-[#8F6236]/40 rounded-xs" />
						</div>
					</div>

					{/* Days of Week Header */}
					<div className="grid grid-cols-7 gap-2 text-center pb-2 border-b border-[#4A2C1D]">
						{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
							<div
								key={day}
								className="h-3 w-8 bg-[#D7B05C]/20 rounded-xs mx-auto"
							/>
						))}
					</div>

					{/* 35-Day Grid Skeleton Cells */}
					<div className="grid grid-cols-7 gap-2 pt-1">
						{dayGridCells.map((idx) => (
							<div
								key={`grid-cell-${idx}`}
								className="min-h-[85px] sm:min-h-[100px] p-2 rounded-xs border border-[#4A2C1D]/60 bg-[#15100C]/60 space-y-2 flex flex-col justify-between"
							>
								<div className="h-3 w-4 bg-[#D7B05C]/20 rounded-xs self-end" />
								{idx % 3 === 0 && (
									<div className="h-4 w-full bg-[#3B2415] border border-[#8F6236]/40 rounded-xs" />
								)}
								{idx % 5 === 0 && (
									<div className="h-4 w-3/4 bg-[#3B2415] border border-[#8F6236]/40 rounded-xs" />
								)}
							</div>
						))}
					</div>
				</div>

				{/* LOWER SPLIT: TODAY'S SIDEBAR + UPCOMING questS */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4 animate-pulse">
					{/* Today's Sidebar Skeleton */}
					<div className="lg:col-span-1 p-5 rounded-xs border-2 border-[#3B2415] bg-[#1A120C]/90 shadow-2xl space-y-4">
						<div className="flex justify-between items-center border-b border-[#4A2C1D] pb-3">
							<div className="h-5 w-32 bg-[#D7B05C]/20 rounded-xs" />
							<div className="h-3 w-16 bg-[#D7B05C]/15 rounded-xs" />
						</div>
						<div className="space-y-3">
							<div className="h-16 bg-[#2D1B10]/60 border border-[#8F6236]/40 rounded-xs" />
							<div className="h-16 bg-[#2D1B10]/60 border border-[#8F6236]/40 rounded-xs" />
						</div>
					</div>

					{/* Upcoming quests Skeleton */}
					<div className="lg:col-span-2 p-5 rounded-xs border-2 border-[#3B2415] bg-[#1A120C]/90 shadow-2xl space-y-4">
						<div className="flex justify-between items-center border-b border-[#4A2C1D] pb-3">
							<div className="h-5 w-44 bg-[#D7B05C]/20 rounded-xs" />
							<div className="h-3 w-20 bg-[#D7B05C]/15 rounded-xs" />
						</div>
						<div className="space-y-3">
							{upcomingKeys.map((k) => (
								<div
									key={k}
									className="p-3 bg-[#2D1B10]/50 border border-[#4A2C1D]/60 rounded-xs flex justify-between items-center"
								>
									<div className="space-y-1.5 flex-1">
										<div className="h-4 w-40 bg-[#F8EEDB]/20 rounded-xs" />
										<div className="h-3 w-28 bg-[#D7B05C]/15 rounded-xs" />
									</div>
									<div className="h-6 w-20 bg-[#3B2415] border border-[#8F6236]/40 rounded-xs" />
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
