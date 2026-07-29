import { DashboardLayoutContainer } from "@/components/layout/dashboard-layout-container";

export default function DashboardLoading() {
	const projectSkeletonKeys = ["proj-skel-1", "proj-skel-2", "proj-skel-3"];

	const activitySkeletonKeys = [
		"act-skel-1",
		"act-skel-2",
		"act-skel-3",
		"act-skel-4",
	];

	return (
		<DashboardLayoutContainer>
			{/* SKELETON HEADER BAR */}
			<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b-2 border-[#4A2C1D] pb-6 relative animate-pulse">
				<div className="space-y-2">
					{/* Badge Subheading Placeholder */}
					<div className="flex items-center gap-2">
						<div className="h-3 w-4 bg-[#D7B05C]/30 rounded-xs" />
						<div className="h-3 w-40 bg-[#D7B05C]/20 rounded-xs" />
						<div className="h-3 w-4 bg-[#D7B05C]/30 rounded-xs" />
					</div>

					{/* Main Dashboard Title Placeholder */}
					<div className="h-10 sm:h-12 w-64 bg-linear-to-b from-[#FFF5D6]/20 via-[#D7B05C]/20 to-[#B78B3E]/10 rounded-xs" />

					{/* Welcome Subtitle Placeholder */}
					<div className="h-4 w-48 bg-[#F8EEDB]/15 rounded-xs" />

					{/* Description Placeholder */}
					<div className="h-3.5 w-72 sm:w-96 bg-[#D7B05C]/15 rounded-xs mt-1" />
				</div>

				{/* Button Placeholder */}
				<div className="shrink-0 h-10 w-36 bg-[#3B2415] border border-[#8F6236]/60 rounded-xs shadow-md" />
			</div>

			<div className="space-y-8 mt-8">
				{/* SKELETON COMMAND URGENCY ALERTS */}
				<div className="p-4 rounded-xs border-2 border-[#8F6236]/30 bg-gradient-to-r from-[#2D1B10]/80 via-[#1A120C]/80 to-[#2D1B10]/80 shadow-xl flex items-center justify-between animate-pulse">
					<div className="flex items-center gap-3">
						<div className="w-8 h-8 rounded-full bg-[#D7B05C]/20 border border-[#D7B05C]/30" />
						<div className="space-y-1.5">
							<div className="h-4 w-48 bg-[#F8EEDB]/20 rounded-xs" />
							<div className="h-3 w-64 bg-[#D7B05C]/15 rounded-xs" />
						</div>
					</div>
					<div className="h-6 w-20 bg-[#3B2415] border border-[#8F6236]/40 rounded-xs" />
				</div>

				{/* SKELETON KINGDOM OVERVIEW STATS PLAQUES */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
					{[1, 2, 3, 4].map((index) => (
						<div
							key={`stat-plaque-${index}`}
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

				{/* DECORATIVE DIVIDER */}
				<div className="flex items-center justify-center gap-4 text-[#B78B3E]/40 text-xs py-1">
					<div className="h-px w-36 bg-gradient-to-r from-transparent to-[#4A2C1D]" />
					<span>⚔ ──── ⚜ ──── ⚔</span>
					<div className="h-px w-36 bg-gradient-to-l from-transparent to-[#4A2C1D]" />
				</div>

				{/* MAIN SKELETON GRID: RECENT PROJECTS & ACTIVITIES + SIDE PANELS */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* LEFT COLUMN: RECENT PROJECTS & ACTIVITY ARCHIVE */}
					<div className="lg:col-span-2 space-y-6">
						{/* RECENT PROJECTS SKELETON CARD LIST */}
						<div className="p-5 rounded-xs border-2 border-[#3B2415] bg-[#1A120C]/90 shadow-2xl space-y-4 animate-pulse">
							<div className="flex justify-between items-center border-b border-[#4A2C1D] pb-3">
								<div className="h-5 w-48 bg-[#D7B05C]/20 rounded-xs" />
								<div className="h-4 w-24 bg-[#D7B05C]/15 rounded-xs" />
							</div>

							<div className="space-y-3">
								{projectSkeletonKeys.map((key) => (
									<div
										key={key}
										className="p-4 rounded-xs border border-[#4A2C1D]/60 bg-[#2D1B10]/50 space-y-3"
									>
										<div className="flex justify-between items-start">
											<div className="space-y-1.5 flex-1">
												<div className="flex items-center gap-2">
													<div className="h-4 w-40 bg-[#FFF5D6]/20 rounded-xs" />
													<div className="h-4 w-16 bg-[#D7B05C]/20 rounded-xs" />
												</div>
												<div className="h-3 w-3/4 bg-[#D7B05C]/15 rounded-xs" />
											</div>
											<div className="h-7 w-24 bg-[#3B2415] border border-[#8F6236]/40 rounded-xs" />
										</div>

										<div className="space-y-1 pt-1">
											<div className="flex justify-between">
												<div className="h-2.5 w-20 bg-[#D7B05C]/20 rounded-xs" />
												<div className="h-2.5 w-8 bg-[#D7B05C]/20 rounded-xs" />
											</div>
											<div className="h-2 w-full bg-[#100A07] border border-[#8F6236]/40 rounded-xs" />
										</div>
									</div>
								))}
							</div>
						</div>

						{/* ACTIVITY ARCHIVE SKELETON */}
						<div className="p-5 rounded-xs border-2 border-[#3B2415] bg-[#1A120C]/90 shadow-2xl space-y-4 animate-pulse">
							<div className="flex justify-between items-center border-b border-[#4A2C1D] pb-3">
								<div className="h-5 w-40 bg-[#D7B05C]/20 rounded-xs" />
								<div className="h-4 w-16 bg-[#D7B05C]/15 rounded-xs" />
							</div>

							<div className="space-y-3">
								{activitySkeletonKeys.map((key) => (
									<div
										key={key}
										className="flex items-center justify-between p-3 border-b border-[#4A2C1D]/40"
									>
										<div className="flex items-center gap-3">
											<div className="w-7 h-7 rounded-full bg-[#8F6236]/20" />
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

					{/* RIGHT COLUMN: QUICK ACTIONS & KINGDOM HEALTH WIDGET */}
					<div className="space-y-6">
						{/* QUICK ACTIONS SKELETON */}
						<div className="p-5 rounded-xs border-2 border-[#3B2415] bg-[#1A120C]/90 shadow-2xl space-y-4 animate-pulse">
							<div className="h-5 w-32 bg-[#D7B05C]/20 border-b border-[#4A2C1D] pb-3" />
							<div className="grid grid-cols-2 gap-2.5">
								{[1, 2, 3, 4].map((i) => (
									<div
										key={`qa-skel-${i}`}
										className="h-12 bg-[#2D1B10]/80 border border-[#8F6236]/40 rounded-xs"
									/>
								))}
							</div>
						</div>

						{/* KINGDOM HEALTH WIDGET SKELETON */}
						<div className="p-5 rounded-xs border-2 border-[#3B2415] bg-[#1A120C]/90 shadow-2xl space-y-4 animate-pulse">
							<div className="h-5 w-36 bg-[#D7B05C]/20 border-b border-[#4A2C1D] pb-3" />
							<div className="space-y-3">
								<div className="h-3 w-full bg-[#D7B05C]/15 rounded-xs" />
								<div className="h-3 w-5/6 bg-[#D7B05C]/15 rounded-xs" />
								<div className="h-16 w-full bg-[#2D1B10]/80 border border-[#8F6236]/30 rounded-xs mt-2" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</DashboardLayoutContainer>
	);
}
