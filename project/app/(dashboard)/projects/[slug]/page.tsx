import { and, asc, eq, or } from "drizzle-orm";
import { notFound } from "next/navigation";
import { KanbanBoard } from "@/components/kanban/board/kanban-board";
import { WarRoomToolbar } from "@/components/kanban/toolbar/war-room-toolbar";
import { DashboardLayoutContainer } from "@/components/layout/dashboard-layout-container";
import { getOrCreateDbUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { lists, projects, tasks } from "@/lib/db/schema";

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

	// Security Hardening: Enforce user ownership (dbUser.id) alongside slug or id lookup
	const project = await db.query.projects.findFirst({
		where: and(
			eq(projects.userId, dbUser.id),
			or(eq(projects.slug, slug), eq(projects.id, slug)),
		),
	});

	if (!project) {
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

	return (
		<DashboardLayoutContainer>
			<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b-2 border-[#4A2C1D] pb-6 relative font-serif text-[#F8EEDB]">
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

				<div className="shrink-0">
					<WarRoomToolbar />
				</div>
			</div>

			<div
				className="
				mt-6
				rounded-xs
				border-4
				border-[#3B2415]
				bg-gradient-to-b
				from-[#2D1B10]
				via-[#1A120C]
				to-[#100A07]
				p-4
				sm:p-6
				shadow-2xl
				relative
				"
			>
				<KanbanBoard
					projectId={project.id}
					initialLists={projectLists as any}
				/>
			</div>
		</DashboardLayoutContainer>
	);
}
