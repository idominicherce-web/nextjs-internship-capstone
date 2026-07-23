// app/(dashboard)/projects/[id]/page.tsx
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Settings, Users, Calendar, MoreHorizontal } from "lucide-react"
import { db } from "@/lib/db"
import { projects, lists, tasks } from "@/lib/db/schema"
import { getOrCreateDbUser } from "@/lib/auth"
import { eq, asc } from "drizzle-orm"
import { KanbanBoard } from "@/components/kanban-board"

export const dynamic = "force-dynamic"

interface ProjectPageProps {
  params: Promise<{ id: string }>
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params
  const dbUser = await getOrCreateDbUser()

  if (!dbUser) {
    return notFound()
  }

  // Fetch project from database
  const project = await db.query.projects.findFirst({
    where: eq(projects.id, id),
  })

  if (!project) {
    return notFound()
  }

  // Fetch lists and nested tasks ordered by position
  const projectLists = await db.query.lists.findMany({
    where: eq(lists.projectId, id),
    orderBy: [asc(lists.position)],
    with: {
      tasks: {
        orderBy: [asc(tasks.position)],
      },
    },
  })

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      {/* Project Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/projects"
            className="p-2 hover:bg-gray-100 dark:hover:bg-outer_space-400 rounded-lg transition-colors text-outer_space-500 dark:text-platinum-500"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-outer_space-500 dark:text-platinum-500">
              {project.name}
            </h1>
            <p className="text-payne's_gray-500 dark:text-french_gray-400 mt-1">
              {project.description || "Kanban board view for project management"}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-outer_space-400 rounded-lg transition-colors text-payne's_gray-500 dark:text-french_gray-400 hover:text-outer_space-500 dark:hover:text-platinum-500">
            <Users size={20} />
          </button>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-outer_space-400 rounded-lg transition-colors text-payne's_gray-500 dark:text-french_gray-400 hover:text-outer_space-500 dark:hover:text-platinum-500">
            <Calendar size={20} />
          </button>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-outer_space-400 rounded-lg transition-colors text-payne's_gray-500 dark:text-french_gray-400 hover:text-outer_space-500 dark:hover:text-platinum-500">
            <Settings size={20} />
          </button>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-outer_space-400 rounded-lg transition-colors text-payne's_gray-500 dark:text-french_gray-400 hover:text-outer_space-500 dark:hover:text-platinum-500">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>

      {/* Dynamic Kanban Board */}
      <KanbanBoard projectId={project.id} initialLists={projectLists as any} />
    </div>
  )
}