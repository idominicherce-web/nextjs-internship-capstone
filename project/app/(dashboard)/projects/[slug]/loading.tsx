import { DashboardLayoutContainer } from "@/components/layout/dashboard-layout-container";

export default function ProjectDetailLoading() {
	const columnSkeletons = [
		{ title: "Backlog", subtext: "Royal Archives", taskCount: 3 },
		{ title: "To Do", subtext: "Awaiting Orders", taskCount: 2 },
		{ title: "In Progress", subtext: "Active quest", taskCount: 4 },
		{ title: "In Review", subtext: "High Council Review", taskCount: 1 },
		{ title: "Done", subtext: "Completed quest", taskCount: 2 },
	];

	return (
		<DashboardLayoutContainer>
			{/* 1. SKELETON HEADER PLANK */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-[#4A2C1D] pb-6 relative font-serif text-[#F8EEDB] animate-pulse">
				<div className="space-y-2">
					{/* Badge Subheading Placeholder */}
					<div className="flex items-center gap-2 text-[#D7B05C]">
						<div className="h-3 w-4 bg-[#D7B05C]/30 rounded-xs" />
						<div className="h-3 w-48 bg-[#D7B05C]/20 rounded-xs" />
						<div className="h-3 w-4 bg-[#D7B05C]/30 rounded-xs" />
					</div>

					{/* Project Name Title Placeholder */}
					<div className="h-8 sm:h-12 w-64 sm:w-96 bg-gradient-to-b from-[#FFF5D6]/20 via-[#D7B05C]/20 to-[#B78B3E]/10 rounded-xs" />

					{/* Description Placeholder */}
					<div className="h-3.5 w-72 sm:w-[480px] bg-[#D7B05C]/15 rounded-xs mt-1" />
				</div>

				{/* Header Actions Placeholder */}
				<div className="shrink-0 flex items-center gap-3">
					<div className="h-10 w-28 bg-[#3B2415] border border-[#8F6236]/60 rounded-xs" />
					<div className="h-10 w-10 bg-[#3B2415] border border-[#8F6236]/60 rounded-xs" />
				</div>
			</div>

			{/* 2. SKELETON STRATEGY KANBAN WAR BOARD */}
			<div className="mt-6 rounded-xs border-4 border-[#3B2415] bg-gradient-to-b from-[#2D1B10] via-[#1A120C] to-[#100A07] p-4 sm:p-6 shadow-2xl relative">
				<div className="flex space-x-6 overflow-x-auto pb-4 relative z-20 animate-pulse">
					{columnSkeletons.map((col, index) => (
						<div key={`col-skel-${index}`} className="shrink-0 w-80">
							<div className="rounded-xs border-2 border-[#8F6236]/60 bg-gradient-to-b from-[#2D1B10] via-[#1A120C] to-[#15100C] shadow-2xl overflow-hidden flex flex-col">
								{/* Column Header Plank */}
								<div className="p-3 border-b-2 border-[#4A2C1D] bg-[#15100C]/90 flex items-center justify-between">
									<div className="flex items-center space-x-2.5 min-w-0">
										<div className="w-4 h-4 bg-[#8F6236]/40 rounded-xs shrink-0" />
										<div className="space-y-1 min-w-0">
											<div className="flex items-center gap-2">
												<div className="h-3.5 w-24 bg-[#F8EEDB]/20 rounded-xs" />
												<div className="h-3 w-5 bg-[#3B2415] border border-[#8F6236]/50 rounded-xs shrink-0" />
											</div>
											<div className="h-2.5 w-20 bg-[#D7B05C]/15 rounded-xs" />
										</div>
									</div>
									<div className="w-4 h-4 bg-[#8F6236]/30 rounded-xs shrink-0" />
								</div>

								{/* Task Card Items Placeholder */}
								<div className="p-3 space-y-3 min-h-[300px]">
									{Array.from({ length: col.taskCount }).map((_, taskIndex) => (
										<div
											key={`task-skel-${index}-${taskIndex}`}
											className="p-3 bg-[#FAF0D7]/10 border-2 border-[#8F6236]/40 rounded-xs space-y-2.5 shadow-md"
										>
											<div className="h-3.5 w-5/6 bg-[#FFF5D6]/20 rounded-xs" />
											<div className="h-2.5 w-full bg-[#D7B05C]/10 rounded-xs" />

											<div className="flex items-center justify-between pt-1 border-t border-[#4A2C1D]/40">
												<div className="h-2.5 w-16 bg-[#D7B05C]/15 rounded-xs" />
												<div className="w-5 h-5 rounded-full bg-[#D7B05C]/20 border border-[#8F6236]/40" />
											</div>
										</div>
									))}

									{/* Quick Task Input Placeholder */}
									<div className="pt-2 border-t border-[#4A2C1D]">
										<div className="h-8 w-full bg-[#FAF0D7]/15 border border-[#8F6236]/40 rounded-xs" />
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</DashboardLayoutContainer>
	);
}
