import { DashboardLayoutContainer } from "@/components/layout/dashboard-layout-container";

export default function DashboardLoading() {
	const projectSkeletonKeys = ["proj-skel-1", "proj-skel-2"];
	const taskSkeletonKeys = ["task-skel-1", "task-skel-2", "task-skel-3"];
	const activitySkeletonKeys = [
		"act-skel-1",
		"act-skel-2",
		"act-skel-3",
		"act-skel-4",
	];

	return (
		<DashboardLayoutContainer>
			<div className="space-y-6 sm:space-y-8 pb-12 sm:pb-16 min-w-0 font-serif">
				{/* 1. SKELETON HEADER BAR */}
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-[#4A2C1D] pb-6 relative animate-pulse">
					<div className="space-y-2">
						{/* Badge Subheading Placeholder */}
						<div className="flex items-center gap-2">
							<div className="h-3 w-4 bg-[#D7B05C]/30 rounded-xs" />
							<div className="h-3 w-40 bg-[#D7B05C]/20 rounded-xs" />
							<div className="h-3 w-4 bg-[#D7B05C]/30 rounded-xs" />
						</div>

						{/* Main Dashboard Title Placeholder */}
						<div className="h-8 sm:h-12 w-56 sm:w-72 bg-gradient-to-b from-[#FFF5D6]/20 via-[#D7B05C]/20 to-[#B78B3E]/10 rounded-xs" />

						{/* Welcome Subtitle Placeholder */}
						<div className="h-4 w-44 bg-[#F8EEDB]/15 rounded-xs" />

						{/* Description Placeholder */}
						<div className="h-3.5 w-64 sm:w-96 bg-[#D7B05C]/15 rounded-xs mt-1" />
					</div>

					{/* Button Placeholder */}
					<div className="shrink-0 h-10 w-full sm:w-36 bg-[#3B2415] border border-[#8F6236]/60 rounded-xs shadow-md mt-2 sm:mt-0" />
				</div>

				{/* 2. SKELETON COMMAND ALERTS */}
				<div className="p-3.5 rounded-xs border border-[#8F6236]/40 bg-[#1A120C] shadow-md space-y-3 animate-pulse">
					<div className="flex items-center justify-between border-b border-[#4A2C1D]/60 pb-2">
						<div className="flex items-center gap-2">
							<div className="h-3 w-4 bg-[#D7B05C]/30 rounded-xs" />
							<div className="h-3.5 w-32 bg-[#D7B05C]/20 rounded-xs" />
						</div>
						<div className="h-3 w-16 bg-[#E3C279]/20 rounded-xs" />
					</div>
					<div className="h-12 w-full bg-[#15100C] border border-[#4A2C1D]/60 rounded-xs" />
				</div>

				{/* 3. SKELETON KINGDOM OVERVIEW STATS STRIP */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 animate-pulse">
					{[1, 2, 3, 4].map((index) => (
						<div
							key={`stat-plaque-${index}`}
							className="p-3.5 sm:p-4 rounded-xs border-2 border-[#3B2415] bg-gradient-to-b from-[#2D1B10] via-[#1A120C] to-[#100A07] shadow-xl flex items-center space-x-3.5"
						>
							<div className="w-10 h-10 rounded-full bg-[#8F6236]/30 border border-[#D7B05C]/20 shrink-0" />
							<div className="space-y-1.5 flex-1 min-w-0">
								<div className="h-2.5 w-20 bg-[#D7B05C]/20 rounded-xs" />
								<div className="h-6 w-16 bg-[#FFF5D6]/20 rounded-xs" />
								<div className="h-2 w-28 bg-[#D7B05C]/15 rounded-xs" />
							</div>
						</div>
					))}
				</div>

				{/* 4. SKELETON MY WORK BAR */}
				<div className="p-3 rounded-xs border border-[#8F6236]/60 bg-[#1A120C] shadow-md space-y-2.5 animate-pulse">
					<div className="flex items-center justify-between border-b border-[#4A2C1D]/60 pb-1.5">
						<div className="h-3.5 w-36 bg-[#D7B05C]/20 rounded-xs" />
						<div className="h-3 w-20 bg-[#D7B05C]/15 rounded-xs" />
					</div>
					<div className="grid grid-cols-4 gap-2">
						{[1, 2, 3, 4].map((i) => (
							<div
								key={`my-work-skel-${i}`}
								className="h-11 bg-[#15100C] border border-[#4A2C1D] rounded-xs"
							/>
						))}
					</div>
				</div>

				{/* 5. SKELETON TASKS REQUIRING ATTENTION */}
				<div className="p-4 rounded-xs border-2 border-[#8F6236]/60 bg-[#1A120C] shadow-xl space-y-4 animate-pulse">
					<div className="flex justify-between items-center border-b border-[#4A2C1D] pb-2">
						<div className="h-4 w-44 bg-[#D7B05C]/20 rounded-xs" />
						<div className="h-3 w-20 bg-[#D7B05C]/15 rounded-xs" />
					</div>

					<div className="space-y-2">
						{taskSkeletonKeys.map((key) => (
							<div
								key={key}
								className="p-3 rounded-xs border border-[#4A2C1D]/60 bg-[#15100C] space-y-2"
							>
								<div className="flex justify-between items-start">
									<div className="space-y-1 flex-1">
										<div className="h-3.5 w-48 bg-[#F8EEDB]/20 rounded-xs" />
										<div className="h-2.5 w-28 bg-[#E3C279]/15 rounded-xs" />
									</div>
									<div className="h-4 w-14 bg-[#3B2415] rounded-xs" />
								</div>
								<div className="pt-1.5 border-t border-[#4A2C1D]/40 flex justify-between">
									<div className="h-2.5 w-20 bg-[#E3C279]/10 rounded-xs" />
									<div className="h-2.5 w-16 bg-[#D7B05C]/15 rounded-xs" />
								</div>
							</div>
						))}
					</div>
				</div>

				{/* DECORATIVE DIVIDER */}
				<div className="flex items-center justify-center gap-4 text-[#B78B3E]/40 text-xs py-1">
					<div className="h-px w-24 sm:w-36 bg-gradient-to-r from-transparent to-[#4A2C1D]" />
					<span>⚔ ──── ⚜ ──── ⚔</span>
					<div className="h-px w-24 sm:w-36 bg-gradient-to-l from-transparent to-[#4A2C1D]" />
				</div>

				{/* 6. MAIN SKELETON GRID */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
					{/* LEFT COLUMN: ACTIVE PROJECTS & ACTIVITY ARCHIVE */}
					<div className="lg:col-span-2 space-y-6">
						{/* RECENT PROJECTS SKELETON */}
						<div className="p-5 rounded-xs border-2 border-[#3B2415] bg-[#1A120C]/90 shadow-2xl space-y-4 animate-pulse">
							<div className="flex justify-between items-center border-b border-[#4A2C1D] pb-3">
								<div className="h-5 w-40 bg-[#D7B05C]/20 rounded-xs" />
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
												<div className="h-4 w-40 bg-[#FFF5D6]/20 rounded-xs" />
												<div className="h-3 w-3/4 bg-[#D7B05C]/15 rounded-xs" />
											</div>
											<div className="h-6 w-20 bg-[#3B2415] rounded-xs" />
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
								<div className="h-5 w-36 bg-[#D7B05C]/20 rounded-xs" />
								<div className="h-4 w-16 bg-[#D7B05C]/15 rounded-xs" />
							</div>

							<div className="space-y-3">
								{activitySkeletonKeys.map((key) => (
									<div
										key={key}
										className="flex items-center justify-between p-2.5 border-b border-[#4A2C1D]/40"
									>
										<div className="flex items-center gap-3">
											<div className="w-6 h-6 rounded-full bg-[#8F6236]/20" />
											<div className="space-y-1">
												<div className="h-3.5 w-44 bg-[#F8EEDB]/20 rounded-xs" />
												<div className="h-2.5 w-28 bg-[#D7B05C]/15 rounded-xs" />
											</div>
										</div>
										<div className="h-2.5 w-14 bg-[#D7B05C]/10 rounded-xs" />
									</div>
								))}
							</div>
						</div>
					</div>

					{/* RIGHT COLUMN: QUICK ACTIONS & KINGDOM HEALTH */}
					<div className="space-y-6">
						{/* QUICK ACTIONS SKELETON */}
						<div className="p-4 rounded-xs border-2 border-[#3B2415] bg-[#1A120C]/90 shadow-2xl space-y-3 animate-pulse">
							<div className="h-4 w-28 bg-[#D7B05C]/20 border-b border-[#4A2C1D] pb-2" />
							<div className="grid grid-cols-2 gap-2.5">
								{[1, 2, 3, 4].map((i) => (
									<div
										key={`qa-skel-${i}`}
										className="h-16 bg-[#15100C] border border-[#4A2C1D] rounded-xs"
									/>
								))}
							</div>
						</div>

						{/* KINGDOM HEALTH SKELETON */}
						<div className="p-4 rounded-xs border-2 border-[#3B2415] bg-[#1A120C]/90 shadow-2xl space-y-3 animate-pulse">
							<div className="h-4 w-36 bg-[#D7B05C]/20 border-b border-[#4A2C1D] pb-2" />
							<div className="space-y-3">
								<div className="h-3 w-full bg-[#D7B05C]/15 rounded-xs" />
								<div className="grid grid-cols-2 gap-2">
									{[1, 2, 3, 4].map((i) => (
										<div
											key={`health-skel-${i}`}
											className="h-12 bg-[#15100C] border border-[#4A2C1D] rounded-xs"
										/>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</DashboardLayoutContainer>
	);
}
