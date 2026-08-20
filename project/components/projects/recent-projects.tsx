"use client";

import {
	ArrowRight,
	CheckCircle2,
	Clock,
	FolderKanban,
	Users,
} from "lucide-react";
import Link from "next/link";
import { DashboardCard } from "@/components/layout/dashboard-card";
import { DashboardSection } from "@/components/layout/dashboard-section";

interface ProjectItem {
	id: string;
	name: string;
	slug?: string | null;
	description: string | null;
	updatedAt: Date;
	totalTasks: number;
	completedTasks: number;
	totalMembers?: number;
}

interface RecentProjectsProps {
	projects: ProjectItem[];
}

export function RecentProjects({ projects }: RecentProjectsProps) {
	const displayedProjects = projects.slice(0, 2);

	return (
		<DashboardSection>
			<div className="flex items-center justify-between border-b border-[#4A2C1D] pb-3 mb-4">
				<div className="flex items-center gap-2 text-[#D7B05C]">
					<FolderKanban size={18} />
					<h2 className="font-serif font-black uppercase text-sm sm:text-base tracking-widest text-[#F8EEDB]">
						Recent Projects
					</h2>
				</div>
				<Link
					href="/projects"
					className="text-xs font-sans font-bold text-[#D7B05C] hover:text-[#FFF5D6] transition-colors flex items-center gap-1 group"
				>
					View All Projects{" "}
					<ArrowRight
						size={14}
						className="group-hover:translate-x-0.5 transition-transform"
					/>
				</Link>
			</div>

			{displayedProjects.length === 0 ? (
				<div className="p-8 text-center text-[#D7B05C]/70 font-serif italic border border-dashed border-[#8F6236]/40 rounded-xs">
					No active projects recorded in the ledger.
				</div>
			) : (
				<div className="grid grid-cols-1 gap-3">
					{displayedProjects.map((project) => {
						const progress =
							project.totalTasks > 0
								? Math.round(
										(project.completedTasks / project.totalTasks) * 100,
									)
								: 0;

						const isCompleted = progress === 100;
						const memberCount = project.totalMembers ?? 1;

						const statusBadge = isCompleted
							? {
									label: "QUEST COMPLETE!",
									color:
										"bg-emerald-950 text-emerald-300 border-emerald-600 font-black shadow-[0_0_8px_rgba(16,185,129,0.3)]",
								}
							: progress > 0
								? {
										label: "In Progress",
										color: "bg-amber-950 text-amber-300 border-amber-700",
									}
								: {
										label: "Planning",
										color: "bg-[#2D1B10] text-[#D7B05C] border-[#8F6236]",
									};

						const projectHref = `/projects/${project.slug || project.id}`;

						return (
							<DashboardCard key={project.id}>
								<div className="grid grid-cols-1 md:grid-cols-12 items-center gap-4 py-1">
									<div className="md:col-span-6 space-y-1.5 min-w-0">
										<div className="flex items-start justify-between gap-3">
											<Link
												href={projectHref}
												className="font-serif font-black text-[#1A120C] hover:text-[#5B3922] transition-colors text-base sm:text-lg leading-snug break-words min-w-0"
											>
												{project.name}
											</Link>

											<span
												className={`inline-flex items-center px-2 py-0.5 text-[9px] font-sans uppercase tracking-wider rounded-xs border shrink-0 ${statusBadge.color}`}
											>
												{statusBadge.label}
											</span>
										</div>

										<p className="text-xs font-sans text-[#3B2415]/85 line-clamp-1 italic">
											{project.description ||
												"No official quest brief recorded."}
										</p>

										<div className="flex flex-wrap items-center gap-2.5 text-[10px] font-sans font-semibold text-[#5B3922] pt-0.5">
											<span className="inline-flex items-center gap-1">
												<Users size={12} className="text-[#8F6236]" />{" "}
												{memberCount}{" "}
												{memberCount === 1 ? "Officer" : "Officers"}
											</span>
											<span className="text-[#8F6236]/40">•</span>
											<span className="inline-flex items-center gap-1">
												<CheckCircle2 size={12} className="text-[#8F6236]" />
												{project.completedTasks}/{project.totalTasks} Objectives
											</span>
											<span className="text-[#8F6236]/40">•</span>
											<span className="inline-flex items-center gap-1 text-[#5B3922]/80">
												<Clock size={11} className="text-[#8F6236]" />
												{new Date(project.updatedAt).toLocaleDateString()}
											</span>
										</div>
									</div>

									<div className="md:col-span-3 space-y-1.5 px-0 md:px-2 border-t md:border-t-0 md:border-l border-[#8F6236]/20 pt-3 md:pt-0">
										<div className="flex justify-between items-center text-[10px] font-sans font-black tracking-wider text-[#2D1B10]">
											<span className="uppercase text-[#5B3922]">PROGRESS</span>
											<span className="font-mono text-xs">{progress}%</span>
										</div>

										<div className="flex gap-1 h-3.5 w-full bg-[#3B2415]/40 p-1 rounded-xs border border-[#7A5328] shadow-inner">
											{project.totalTasks > 0 ? (
												Array.from({ length: project.totalTasks }).map(
													(_, idx) => {
														const isSegmentDone = idx < project.completedTasks;
														return (
															<div
																key={idx}
																className={`h-full flex-1 rounded-[1px] transition-all duration-300 ${
																	isSegmentDone
																		? "bg-[#D7B05C] border border-[#FFF5D6] shadow-[0_0_6px_rgba(215,176,92,0.9)]"
																		: "bg-[#2A160A] border border-[#5C3A1A]/40"
																}`}
															/>
														);
													},
												)
											) : (
												<div className="h-full w-full bg-[#2A160A] rounded-[1px]" />
											)}
										</div>
									</div>

									<div className="md:col-span-3 flex justify-start md:justify-end items-center pt-2 md:pt-0">
										<Link
											href={projectHref}
											className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-[#D7B05C] bg-[#3B2415] text-[#FFF5D6] font-sans text-xs font-black uppercase tracking-wider rounded-xs shadow-sm hover:border-[#FFF5D6] hover:-translate-y-0.5 transition-all cursor-pointer group"
										>
											<span>Open Board</span>
											<ArrowRight
												size={13}
												className="text-[#D7B05C] group-hover:translate-x-0.5 transition-transform"
											/>
										</Link>
									</div>
								</div>
							</DashboardCard>
						);
					})}
				</div>
			)}
		</DashboardSection>
	);
}
