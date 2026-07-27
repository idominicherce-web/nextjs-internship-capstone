import { db } from "@/lib/db"
import { projects } from "@/lib/db/schema"
import { getOrCreateDbUser } from "@/lib/auth"
import { eq } from "drizzle-orm"
import { Plus, Shield } from "lucide-react"

import { CalendarTask, TaskType } from "@/components/calendar/types"
import { CalendarLegend } from "@/components/calendar/calendar-legend"
import { CalendarStats } from "@/components/calendar/calendar-stats"
import { CalendarGrid } from "@/components/calendar/calendar-grid"
import { TodaySidebar } from "@/components/calendar/today-sidebar"
import { UpcomingCampaigns } from "@/components/calendar/upcoming-campaigns"

export const dynamic = "force-dynamic"

export default async function CalendarPage() {
  const dbUser = await getOrCreateDbUser()

  if (!dbUser) {
    return (
      <div className="min-h-screen bg-[#15100C] flex items-center justify-center p-6 text-center text-[#D7B05C] font-serif">
        <div className="p-8 border-2 border-[#8F6236] bg-[#2D1B10] rounded-xs shadow-2xl">
          <Shield className="mx-auto mb-3 text-[#D7B05C]" size={32} />
          <h2 className="text-xl font-black uppercase tracking-widest text-[#F8EEDB]">Access Denied</h2>
          <p className="text-xs font-sans text-[#D7B05C]/70 mt-2">
            Unauthorized traveler. Please enter through the gatekeeper.
          </p>
        </div>
      </div>
    )
  }

  // Fetch real projects & tasks with due dates from database
  const userProjects = await db.query.projects.findMany({
    where: eq(projects.userId, dbUser.id),
    with: {
      lists: {
        with: {
          tasks: true,
        },
      },
    },
  })

  // Format real tasks into CalendarTask models
  const realTasks: CalendarTask[] = []

  userProjects.forEach((proj) => {
    proj.lists.forEach((list) => {
      const listName = list.name.toLowerCase()
      const isDone = listName.includes("done") || listName.includes("complete")

      list.tasks.forEach((task) => {
        if (task.dueDate) {
          let taskType: TaskType = "deadline"
          if (isDone) taskType = "completed"
          else if (task.title.toLowerCase().includes("review") || task.title.toLowerCase().includes("sync")) {
            taskType = "meeting"
          } else if (task.title.toLowerCase().includes("launch") || task.title.toLowerCase().includes("v1")) {
            taskType = "milestone"
          }

          realTasks.push({
            id: task.id,
            title: task.title,
            projectName: proj.name,
            dueDate: new Date(task.dueDate),
            type: taskType,
            isCompleted: isDone,
            priority: "High",
            assignedTo: "Lord Scribe",
          })
        }
      })
    })
  })

  // Fallback upcoming events if DB is empty
  const formattedTasks: CalendarTask[] =
    realTasks.length > 0
      ? realTasks
      : [
          {
            id: "f1",
            title: "API Integration",
            projectName: "Project Alpha",
            dueDate: new Date("2026-07-24"),
            type: "deadline",
            isCompleted: false,
            priority: "Urgent",
            assignedTo: "Sir Gareth",
          },
          {
            id: "f2",
            title: "Sprint Review",
            projectName: "Project Phoenix",
            dueDate: new Date("2026-07-24"),
            type: "meeting",
            isCompleted: true,
            priority: "Medium",
            assignedTo: "Lady Elaine",
          },
          {
            id: "f3",
            title: "Kingdom UI Overhaul",
            projectName: "Internal Tools",
            dueDate: new Date("2026-07-27"),
            type: "milestone",
            isCompleted: false,
            priority: "High",
            assignedTo: "Grand Master",
          },
          {
            id: "f4",
            title: "Database Backup Audit",
            projectName: "Project Alpha",
            dueDate: new Date("2026-07-29"),
            type: "reminder",
            isCompleted: false,
            priority: "Low",
            assignedTo: "Royal Warden",
          },
        ]

  // Summary Metrics Calculations
  const totalTasksCount = formattedTasks.length
  const completedTasksCount = formattedTasks.filter((t) => t.isCompleted).length
  const deadlinesThisWeekCount = formattedTasks.filter((t) => !t.isCompleted).length
  const milestoneCount = userProjects.length || 3

  return (
    <div className="min-h-screen bg-[#15100C] text-[#F8EEDB] font-serif p-4 sm:p-8 relative select-none overflow-hidden antialiased">
      {/* Torch Glow & Castle Strategy Room Ambient Vignette */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_15%,rgba(215,176,92,0.14),transparent_65%)] mix-blend-screen" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_50%,transparent_20%,rgba(0,0,0,0.92)_100%)] mix-blend-multiply" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        {/* Header Bar */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b-2 border-[#4A2C1D] pb-6">
          <div>
            <div className="flex items-center gap-2 text-[#D7B05C] text-xs font-sans uppercase font-extrabold tracking-[0.25em] mb-1.5">
              <span>⚔</span>
              <span>Campaign Ledger</span>
              <span>⚔</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black bg-gradient-to-b from-[#FFF5D6] via-[#D7B05C] to-[#B78B3E] bg-clip-text text-transparent uppercase tracking-[0.1em] filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              Calendar
            </h1>
            <p className="text-xs sm:text-sm font-sans text-[#D7B05C]/80 mt-2 italic max-w-2xl leading-relaxed">
              Manage project deadlines, strategic milestones, and kingdom schedules.
            </p>
          </div>

          {/* Add Calendar Event Button */}
          <button
            type="button"
            className="group relative inline-flex items-center px-6 py-3 border-2 border-[#D7B05C] bg-gradient-to-b from-[#5B3922] via-[#3B2415] to-[#1A120C] text-[#F8EEDB] font-sans text-xs font-black uppercase tracking-[0.2em] rounded-xs shadow-[0_10px_25px_rgba(0,0,0,0.8)] transition-all duration-200 hover:text-white hover:border-[#FFF5D6] hover:shadow-[0_0_30px_rgba(215,176,92,0.5)] active:translate-y-0.5 hover:-translate-y-0.5 cursor-pointer shrink-0"
          >
            <Plus size={18} className="mr-2 text-[#D7B05C] group-hover:scale-110 transition-transform" />
            <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">Add Calendar Event</span>
          </button>
        </div>

        {/* Legend Index Bar */}
        <CalendarLegend />

        {/* Campaign Summary Statistics */}
        <CalendarStats
          totalTasks={totalTasksCount}
          deadlinesCount={deadlinesThisWeekCount}
          completedCount={completedTasksCount}
          milestonesCount={milestoneCount}
        />

        {/* Decorative Divider */}
        <div className="flex items-center justify-center gap-4 text-[#B78B3E] text-xs py-1">
          <div className="h-px w-32 bg-gradient-to-r from-transparent to-[#4A2C1D]" />
          <span>⚔ ──── ❦ ──── ⚔</span>
          <div className="h-px w-32 bg-gradient-to-l from-transparent to-[#4A2C1D]" />
        </div>

        {/* Main Calendar Grid */}
        <CalendarGrid tasks={formattedTasks} />

        {/* Lower Dashboard Split: Today's Sidebar + Upcoming Campaigns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
          <div className="lg:col-span-1">
            <TodaySidebar />
          </div>
          <div className="lg:col-span-2">
            <UpcomingCampaigns tasks={formattedTasks.slice(0, 5)} />
          </div>
        </div>

      </div>
    </div>
  )
}