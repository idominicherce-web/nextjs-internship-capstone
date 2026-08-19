import { and, asc, eq, or } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getProjectAssignedMembers } from "@/actions/project-members";
import { KanbanBoard } from "@/components/kanban/board/kanban-board";
import { ProjectHeaderActions } from "@/components/kanban/board/project-header-actions";
import { DashboardLayoutContainer } from "@/components/layout/dashboard-layout-container";
import { getOrCreateDbUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { lists, projectMembers, projects, tasks } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

interface ProjectPageProps {
	params: Promise<{ slug: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
	const { slug } = await params;
	const dbUser = await getOrCreateDbUser();

	if (!dbUser) {
		return notFound();
	}

	// 1. Fetch project by slug or ID
	const project = await db.query.projects.findFirst({
		where: or(eq(projects.slug, slug), eq(projects.id, slug)),
	});

	if (!project) {
		return notFound();
	}

	// 2. Access control check: user must be owner OR assigned in projectMembers
	const isOwner = project.userId === dbUser.id;
	let isMember = false;

	if (!isOwner) {
		const membership = await db.query.projectMembers.findFirst({
			where: and(
				eq(projectMembers.projectId, project.id),
				eq(projectMembers.userId, dbUser.id),
			),
		});
		isMember = !!membership;
	}

	if (!isOwner && !isMember) {
		return notFound();
	}

	const projectLists = await db.query.lists.findMany({
		where: eq(lists.projectId, project.id),
		orderBy: [asc(lists.position)],
		with: {
			tasks: {
				orderBy: [asc(tasks.position)],
			},
		},
	});

	// 3. Fetch assigned officers for this project
	const assignedMembersRes = await getProjectAssignedMembers(project.id);
	const initialMembers = assignedMembersRes.success
		? assignedMembersRes.data
		: [];

	return (
		<DashboardLayoutContainer>
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-[#4A2C1D] pb-6 relative font-serif text-[#F8EEDB]">
				<div>
					<div className="flex items-center gap-2 text-[#D7B05C] text-xs font-sans uppercase font-extrabold tracking-[0.25em] mb-1.5">
						<span>⚔</span>
						<span>Quest Strategy Board</span>
						<span>⚔</span>
					</div>
					<h1 className="text-3xl sm:text-5xl font-black bg-gradient-to-b from-[#FFF5D6] via-[#D7B05C] to-[#B78B3E] bg-clip-text text-transparent uppercase tracking-[0.1em] filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
						{project.name}
					</h1>
					<p className="text-xs sm:text-sm font-sans text-[#D7B05C]/80 mt-2 italic max-w-2xl leading-relaxed">
						{project.description ||
							"Interactive Kanban board for project operations and task strategy."}
					</p>
				</div>

				<div className="shrink-0 flex items-center gap-3">
					<ProjectHeaderActions
						projectId={project.id}
						projectName={project.name}
						initialMembers={initialMembers as any}
					/>
				</div>
			</div>

			<div className="mt-6 rounded-xs border-4 border-[#3B2415] bg-gradient-to-b from-[#2D1B10] via-[#1A120C] to-[#100A07] p-4 sm:p-6 shadow-2xl relative">
				<KanbanBoard
					projectId={project.id}
					initialLists={projectLists as any}
				/>
			</div>
		</DashboardLayoutContainer>
	);
}
