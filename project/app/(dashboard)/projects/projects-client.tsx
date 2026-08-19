"use client";

import { Plus, Scroll } from "lucide-react";
import { useMemo, useState } from "react";
import { DashboardLayoutContainer } from "@/components/layout/dashboard-layout-container";
import { CreateProjectModal } from "@/components/modals/create-project-modal";
import {
	ArchiveOrderDropdown,
	type SortOption,
} from "@/components/projects/archive-order-dropdown";
import { CreateProjectButton } from "@/components/projects/create-project-button";
import { ParchmentSearch } from "@/components/projects/parchment-search";
import {
	ProjectCard,
	type ProjectData,
} from "@/components/projects/project-card";
import { ProjectStatsSummary } from "@/components/projects/project-stats-summary";

interface ProjectsClientProps {
	initialProjects: ProjectData[];
}

export function ProjectsClient({ initialProjects }: ProjectsClientProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [sortBy, setSortBy] = useState<SortOption>("newest");
	const [isFilterOpen, setIsFilterOpen] = useState(false);

	// Combined search & filter memoization
	const filteredProjects = useMemo(() => {
		let result = [...initialProjects];

		if (searchQuery.trim()) {
			const q = searchQuery.toLowerCase();
			result = result.filter(
				(project) =>
					project.name.toLowerCase().includes(q) ||
					project.description?.toLowerCase().includes(q),
			);
		}

		result.sort((a, b) => {
			if (sortBy === "newest") {
				return (
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
				);
			}
			if (sortBy === "oldest") {
				return (
					new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
				);
			}
			if (sortBy === "alphabetical") {
				return a.name.localeCompare(b.name);
			}
			return 0;
		});

		return result;
	}, [initialProjects, searchQuery, sortBy]);

	const handleResetFilters = () => {
		setSearchQuery("");
		setSortBy("newest");
	};

	// Calculate totals based on nested list and task completion states
	const totalCount = initialProjects.length;
	const completedCount = initialProjects.filter((p) => {
		if (!p.lists || p.lists.length === 0) return false;

		let projectTotal = 0;
		let projectCompleted = 0;

		p.lists.forEach((list) => {
			const isDoneList =
				list.name.toLowerCase().includes("done") ||
				list.name.toLowerCase().includes("complete");

			list.tasks.forEach(() => {
				projectTotal++;
				if (isDoneList) projectCompleted++;
			});
		});

		return projectTotal > 0 && projectTotal === projectCompleted;
	}).length;
	const activeCount = totalCount - completedCount;

	return (
		<DashboardLayoutContainer>
			{/* Hero Welcome Header */}
			<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b-2 border-[#4A2C1D] pb-6 relative">
				<div>
					<div className="flex items-center gap-2 text-[#D7B05C] text-xs font-sans uppercase font-extrabold tracking-[0.25em] mb-1.5">
						<span>⚔</span>
						<span>The Questboard</span>
						<span>⚔</span>
					</div>
					<h1 className="text-3xl sm:text-5xl font-black bg-gradient-to-b from-[#FFF5D6] via-[#D7B05C] to-[#B78B3E] bg-clip-text text-transparent uppercase tracking-[0.1em] filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
						Projects
					</h1>
					<p className="text-xs sm:text-sm font-sans text-[#D7B05C]/80 mt-2 italic max-w-2xl leading-relaxed">
						Manage workspace projects, track completion progress, and organize
						team dossiers.
					</p>
				</div>

				<div className="shrink-0">
					<CreateProjectButton />
				</div>
			</div>

			{/* Summary Statistics Bar */}
			<ProjectStatsSummary
				total={totalCount}
				active={activeCount}
				completed={completedCount}
			/>

			{/* Control Bar: Feather Search & Scroll Sort */}
			<div className="flex flex-col sm:flex-row gap-4 relative">
				<ParchmentSearch value={searchQuery} onChange={setSearchQuery} />

				<ArchiveOrderDropdown
					isOpen={isFilterOpen}
					onToggle={() => setIsFilterOpen((prev) => !prev)}
					sortBy={sortBy}
					onSelectSort={(option) => {
						setSortBy(option);
						setIsFilterOpen(false);
					}}
					onReset={handleResetFilters}
					hasActiveFilters={Boolean(searchQuery || sortBy !== "newest")}
				/>
			</div>

			{/* Projects Grid or Empty Parchment Notice */}
			{filteredProjects.length === 0 ? (
				<div className="text-center py-16 rounded-xs border-2 border-dashed border-[#8F6236]/50 bg-[#15100C] p-8 space-y-3">
					<Scroll className="mx-auto h-12 w-12 text-[#D7B05C]/50" />
					<h3 className="text-xl font-serif font-black text-[#F8EEDB]">
						Royal Archives Empty
					</h3>
					<p className="text-xs font-sans text-[#D7B05C]/70 max-w-md mx-auto">
						{searchQuery
							? `No quest dossiers matching "${searchQuery}" found in the archives.`
							: "No project records found. Create your first project to begin organizing work."}
					</p>
					<button
						type="button"
						onClick={() => setIsModalOpen(true)}
						className="inline-flex items-center gap-2 mt-2 px-5 py-2.5 border border-[#D7B05C] bg-[#3B2415] text-[#FFF5D6] font-sans text-xs font-black uppercase tracking-wider rounded-xs hover:bg-[#5B3922] transition-colors cursor-pointer"
					>
						<Plus size={16} /> New Project
					</button>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredProjects.map((project) => (
						<ProjectCard key={project.id} project={project} />
					))}
				</div>
			)}

			{/* Create Project Modal */}
			<CreateProjectModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			/>
		</DashboardLayoutContainer>
	);
}
