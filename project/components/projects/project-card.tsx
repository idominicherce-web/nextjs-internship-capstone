"use client";

import { ArrowRight, Calendar, ScrollText, User } from "lucide-react";
import Link from "next/link";

export interface ProjectData {
	id: string;
	name: string;
	slug?: string | null;
	description: string | null;
	createdAt: Date;
	updatedAt: Date;
	lists?: Array<{
		id: string;
		name: string;
		tasks: Array<{ id: string; title?: string }>;
	}>;
}

interface ProjectCardProps {
	project: ProjectData;
}

export function ProjectCard({ project }: ProjectCardProps) {
	let totalTasks = 0;
	let completedTasks = 0;

	if (project.lists) {
		project.lists.forEach((list) => {
			const isDoneList =
				list.name.toLowerCase().includes("done") ||
				list.name.toLowerCase().includes("complete");

			list.tasks.forEach(() => {
				totalTasks++;
				if (isDoneList) {
					completedTasks++;
				}
			});
		});
	}

	const progress =
		totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

	const projectHref = `/projects/${project.slug || project.id}`;

	return (
		<div className="group relative flex flex-col justify-between p-6 rounded-sm border-2 border-[#7A5328] bg-gradient-to-br from-[#F5E6C4] via-[#EBD2A0] to-[#D9B87B] text-[#2A160A] shadow-[0_8px_20px_rgba(0,0,0,0.45),_inset_0_0_20px_rgba(100,60,30,0.15)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(0,0,0,0.6)] overflow-hidden select-none">
			{/* Double Inset Border Frame */}
			<div className="pointer-events-none absolute inset-1.5 border border-[#7A5328]/40 rounded-xs" />

			{/* Radial Parchment Texture Overlay */}
			<div
				className="pointer-events-none absolute inset-0 opacity-35 mix-blend-multiply"
				style={{
					backgroundImage: `
						radial-gradient(circle at 20% 20%, rgba(120,80,35,0.15) 0%, transparent 40%),
						radial-gradient(circle at 80% 70%, rgba(90,50,20,0.12) 0%, transparent 35%),
						repeating-linear-gradient(0deg, rgba(0,0,0,0.02), rgba(0,0,0,0.02) 1px, transparent 1px, transparent 8px)
					`,
				}}
			/>

			{/* Metallic Board Pins */}
			<div className="absolute left-4 top-3 h-3.5 w-3.5 rounded-full border border-[#3A1F10] bg-gradient-to-br from-[#FFF5D6] via-[#B99A62] to-[#5C3B1E] shadow-[0_2px_4px_rgba(0,0,0,0.5)] z-20" />
			<div className="absolute right-4 top-3 h-3.5 w-3.5 rounded-full border border-[#3A1F10] bg-gradient-to-br from-[#FFF5D6] via-[#B99A62] to-[#5C3B1E] shadow-[0_2px_4px_rgba(0,0,0,0.5)] z-20" />

			<div className="space-y-4 relative z-10 pt-2">
				{/* Header */}
				<div className="flex items-start justify-between gap-3 border-b-2 border-[#7A5328]/30 pb-3">
					<Link
						href={projectHref}
						className="flex items-center space-x-3 group/title min-w-0"
					>
						{/* Scroll Icon */}
						<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-[#7A5328] bg-[#D8B677] text-[#3A1F10] shadow-[inset_0_2px_4px_rgba(0,0,0,0.25)] group-hover/title:border-[#3A1F10] transition-colors">
							<ScrollText size={20} />
						</div>
						<div className="min-w-0">
							<h3 className="font-serif font-black text-lg text-[#2A160A] group-hover/title:text-[#633A18] transition-colors line-clamp-2 leading-tight tracking-wide">
								{project.name}
							</h3>
							<p className="text-[10px] font-sans font-black uppercase tracking-widest text-[#5C3A1A] mt-0.5">
								PROJECT{" "}
								<span className="italic font-serif font-bold text-[#6D4722]">
									• QUEST
								</span>
							</p>
						</div>
					</Link>

					{/* Exact Crimson Wax Seal from Reference Image */}
					<div className="relative shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-[#A81C1C] border border-[#6B0F0F] shadow-[0_2px_5px_rgba(0,0,0,0.4),_inset_0_1px_2px_rgba(255,255,255,0.2)] transition-transform hover:scale-105">
						<span className="italic font-sans text-[10px] text-white tracking-tight text-center leading-none">
							Active
						</span>
					</div>
				</div>

				{/* Description */}
				<p className="text-xs font-sans font-semibold text-[#4A2C18] line-clamp-2 italic min-h-[2.5rem] leading-relaxed">
					{project.description || "No project description provided."}
				</p>

				{/* Granular Segmented Progress Meter */}
				<div className="space-y-1.5 pt-1">
					<div className="flex justify-between text-[10.5px] font-sans font-black tracking-wide text-[#4A2C18]">
						<span>
							QUEST PROGRESS · {completedTasks} / {totalTasks} TASKS
						</span>
						<span className="font-bold">{progress}%</span>
					</div>

					{/* Discrete Task Bar Grid */}
					<div className="flex gap-1.5 h-3.5 w-full bg-[#B99A62]/20 p-1 rounded-xs border border-[#7A5328]">
						{totalTasks > 0 ? (
							Array.from({ length: totalTasks }).map((_, idx) => {
								const isCompleted = idx < completedTasks;
								return (
									<div
										key={idx}
										className={`h-full flex-1 rounded-[1px] transition-all duration-300 ${
											isCompleted
												? "bg-gradient-to-r from-[#8B5A2B] via-[#C49A45] to-[#E3C368] shadow-[0_0_3px_rgba(196,154,69,0.5)] border border-[#6D4722]"
												: "bg-[#7A5328]/15 border border-[#7A5328]/20"
										}`}
									/>
								);
							})
						) : (
							<div className="h-full w-full bg-[#7A5328]/10 rounded-[1px]" />
						)}
					</div>
				</div>

				{/* Info Strip */}
				<div className="grid grid-cols-2 gap-2 text-[10.5px] font-sans font-bold text-[#5C3A1A] pt-2.5 border-t border-[#7A5328]/30">
					<span className="flex items-center gap-1.5 truncate">
						<User size={13} className="text-[#7A5328] shrink-0" /> Owner:
						Dominic
					</span>
					<span className="flex items-center gap-1.5 text-right justify-end truncate">
						<Calendar size={13} className="text-[#7A5328] shrink-0" /> Updated:{" "}
						{new Date(project.updatedAt).toLocaleDateString()}
					</span>
				</div>
			</div>

			{/* Action Button: Crimson Command Button */}
			<div className="mt-5 pt-3 border-t border-[#7A5328]/30 relative z-10">
				<Link
					href={projectHref}
					className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-[#5A1A1A] bg-gradient-to-b from-[#6E2222] to-[#4A1414] text-[#FDE8BF] rounded-xs shadow-[0_2px_6px_rgba(0,0,0,0.35),_inset_0_1px_0_rgba(255,255,255,0.2)] hover:from-[#812828] hover:to-[#5A1A1A] hover:border-[#C49A45] transition-all cursor-pointer group/btn"
				>
					<div className="text-center">
						<span className="block text-xs font-sans font-black uppercase tracking-[0.18em] leading-tight text-[#FDE8BF]">
							ENTER QUEST
						</span>
						<span className="block text-[9px] font-serif italic text-[#E5CD98]/80">
							Enter the War Room
						</span>
					</div>
					<ArrowRight
						size={15}
						className="group-hover/btn:translate-x-1 transition-transform text-[#FDE8BF]"
					/>
				</Link>
			</div>
		</div>
	);
}
