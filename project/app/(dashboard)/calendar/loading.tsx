export default function CalendarLoading() {
	const dayGridCells = Array.from({ length: 35 }, (_, i) => i);
	const statCardKeys = ["cal-stat-1", "cal-stat-2", "cal-stat-3"];
	const upcomingKeys = ["up-1", "up-2", "up-3"];

	return (
		<div className="relative min-h-screen w-full min-w-0 bg-[#15100C] font-serif text-[#F8EEDB] antialiased p-3 sm:p-6 lg:p-8">
			{/* Ambient Vignette Overlay */}
			<div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_10%,rgba(215,176,92,0.12),transparent_55%)]" />
			<div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_50%,transparent_15%,rgba(0,0,0,0.88)_100%)]" />

			<main className="relative z-10 mx-auto w-full max-w-7xl min-w-0 space-y-5">
				{/* 1. SKELETON HEADER BAR */}
				<header className="border-b border-[#4A2C1D] pb-3 sm:pb-4 animate-pulse">
					<div className="min-w-0 space-y-2">
						<div className="flex items-center gap-2">
							<div className="h-3 w-4 bg-[#D7B05C]/30 rounded-xs" />
							<div className="h-3 w-32 bg-[#D7B05C]/20 rounded-xs" />
							<div className="h-3 w-4 bg-[#D7B05C]/30 rounded-xs" />
						</div>

						<div className="h-8 sm:h-10 lg:h-12 w-48 sm:w-64 bg-gradient-to-b from-[#FFF5D6]/20 via-[#D7B05C]/20 to-[#B78B3E]/10 rounded-xs" />

						<div className="h-3.5 w-64 sm:w-80 bg-[#D7B05C]/15 rounded-xs" />
					</div>
				</header>

				{/* 2. SKELETON MAIN CALENDAR GRID */}
				<section className="w-full min-w-0 animate-pulse">
					<div className="p-4 sm:p-6 rounded-xs border-4 border-[#3B2415] bg-gradient-to-b from-[#2D1B10] via-[#1A120C] to-[#100A07] shadow-2xl space-y-4">
						{/* Calendar Navigation Bar */}
						<div className="flex items-center justify-between border-b-2 border-[#4A2C1D] pb-4">
							<div className="h-7 w-36 bg-[#FFF5D6]/20 rounded-xs" />
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
									className="min-h-[80px] sm:min-h-[95px] p-2 rounded-xs border border-[#4A2C1D]/60 bg-[#15100C]/60 space-y-2 flex flex-col justify-between"
								>
									<div className="h-3 w-4 bg-[#D7B05C]/20 rounded-xs self-end" />
									{idx % 3 === 0 && (
										<div className="h-3.5 w-full bg-[#3B2415] border border-[#8F6236]/40 rounded-xs" />
									)}
									{idx % 5 === 0 && (
										<div className="h-3.5 w-3/4 bg-[#3B2415] border border-[#8F6236]/40 rounded-xs" />
									)}
								</div>
							))}
						</div>
					</div>
				</section>

				{/* 3. SKELETON UPCOMING QUESTS */}
				<section className="w-full min-w-0 animate-pulse">
					<div className="p-4 sm:p-5 rounded-xs border-2 border-[#3B2415] bg-[#1A120C]/90 shadow-2xl space-y-3">
						<div className="flex justify-between items-center border-b border-[#4A2C1D] pb-3">
							<div className="h-5 w-44 bg-[#D7B05C]/20 rounded-xs" />
							<div className="h-3 w-20 bg-[#D7B05C]/15 rounded-xs" />
						</div>
						<div className="space-y-2.5">
							{upcomingKeys.map((k) => (
								<div
									key={k}
									className="p-3 bg-[#2D1B10]/50 border border-[#4A2C1D]/60 rounded-xs flex justify-between items-center"
								>
									<div className="space-y-1.5 flex-1">
										<div className="h-4 w-44 bg-[#F8EEDB]/20 rounded-xs" />
										<div className="h-3 w-28 bg-[#D7B05C]/15 rounded-xs" />
									</div>
									<div className="h-6 w-20 bg-[#3B2415] border border-[#8F6236]/40 rounded-xs" />
								</div>
							))}
						</div>
					</div>
				</section>

				{/* 4. SKELETON LEGEND & 5. CALENDAR STATISTICS */}
				<section className="space-y-4 pt-2 border-t border-[#8F6236]/30 animate-pulse">
					{/* Legend Index Skeleton Bar */}
					<div className="p-3.5 rounded-xs border-2 border-[#3B2415] bg-[#1A120C] flex flex-wrap items-center justify-between gap-4">
						<div className="h-3.5 w-32 bg-[#D7B05C]/20 rounded-xs" />
						<div className="flex flex-wrap gap-4">
							{[1, 2, 3, 4].map((i) => (
								<div
									key={`legend-skel-${i}`}
									className="flex items-center gap-2"
								>
									<div className="w-3 h-3 rounded-full bg-[#8F6236]/40" />
									<div className="h-3 w-16 bg-[#D7B05C]/15 rounded-xs" />
								</div>
							))}
						</div>
					</div>

					{/* Calendar Stats Summary Cards */}
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
						{statCardKeys.map((key) => (
							<div
								key={key}
								className="p-3.5 rounded-xs border-2 border-[#3B2415] bg-gradient-to-b from-[#2D1B10] via-[#1A120C] to-[#100A07] shadow-xl space-y-2 relative"
							>
								<div className="flex items-center justify-between">
									<div className="h-2.5 w-24 bg-[#D7B05C]/20 rounded-xs" />
									<div className="w-4 h-4 bg-[#8F6236]/30 rounded-xs" />
								</div>
								<div className="h-6 w-12 bg-[#FFF5D6]/20 rounded-xs" />
								<div className="h-2.5 w-28 bg-[#D7B05C]/10 rounded-xs" />
							</div>
						))}
					</div>
				</section>
			</main>
		</div>
	);
}
