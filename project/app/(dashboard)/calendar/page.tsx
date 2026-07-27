// app/(dashboard)/calendar/page.tsx
import { db } from "@/lib/db"
import { projects } from "@/lib/db/schema"
import { getOrCreateDbUser } from "@/lib/auth"
import { eq } from "drizzle-orm"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Clock, CheckCircle } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function CalendarPage() {
  const dbUser = await getOrCreateDbUser()

  if (!dbUser) {
    return (
      <div className="p-6 text-center text-payne's_gray-500 dark:text-french_gray-400">
        Unauthorized. Please sign in.
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

  // Extract all scheduled tasks
  const realTasks: Array<{
    id: string
    title: string
    projectName: string
    dueDate: Date
    isCompleted: boolean
  }> = []

  userProjects.forEach((proj) => {
    proj.lists.forEach((list) => {
      const isDone =
        list.name.toLowerCase().includes("done") ||
        list.name.toLowerCase().includes("complete")

      list.tasks.forEach((task) => {
        if (task.dueDate) {
          realTasks.push({
            id: task.id,
            title: task.title,
            projectName: proj.name,
            dueDate: new Date(task.dueDate),
            isCompleted: isDone,
          })
        }
      })
    })
  })

  // Fallback upcoming events if DB is empty
  const upcomingDeadlines =
    realTasks.length > 0
      ? realTasks.slice(0, 5)
      : [
          { title: "Website Redesign", projectName: "Project Deadline", dueDate: new Date("2026-08-15"), isCompleted: false },
          { title: "Team Meeting", projectName: "Meeting", dueDate: new Date("2026-08-18"), isCompleted: true },
          { title: "Mobile App Launch", projectName: "Milestone", dueDate: new Date("2026-08-22"), isCompleted: false },
        ]

  // Monthly Calendar Grid Helper
  const daysInMonth = 31
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      {/* Top Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-outer_space-500 dark:text-platinum-500">
            Calendar
          </h1>
          <p className="text-payne's_gray-500 dark:text-french_gray-400 mt-2">
            View project deadlines and team schedules
          </p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-blue_munsell-500 text-white rounded-lg hover:bg-blue_munsell-600 transition-colors shadow-sm text-sm font-medium">
          <Plus size={20} className="mr-2" />
          Add Event
        </button>
      </div>

      {/* Main Calendar Card */}
      <div className="bg-white dark:bg-outer_space-500 rounded-lg border border-french_gray-300 dark:border-payne's_gray-400 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-payne's_gray-400 rounded-lg text-outer_space-500 dark:text-platinum-500 transition-colors">
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-xl font-semibold text-outer_space-500 dark:text-platinum-500">
              July 2026
            </h2>
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-payne's_gray-400 rounded-lg text-outer_space-500 dark:text-platinum-500 transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm font-medium bg-blue_munsell-500 text-white rounded shadow-sm">
              Month
            </button>
            <button className="px-3 py-1 text-sm text-payne's_gray-500 dark:text-french_gray-400 hover:bg-slate-100 dark:hover:bg-payne's_gray-400 rounded transition-colors">
              Week
            </button>
            <button className="px-3 py-1 text-sm text-payne's_gray-500 dark:text-french_gray-400 hover:bg-slate-100 dark:hover:bg-payne's_gray-400 rounded transition-colors">
              Day
            </button>
          </div>
        </div>

        {/* Calendar Grid Header */}
        <div className="grid grid-cols-7 gap-1 text-center font-semibold text-xs text-payne's_gray-500 dark:text-french_gray-400 mb-2">
          {weekDays.map((day) => (
            <div key={day} className="py-2">
              {day}
            </div>
          ))}
        </div>

        {/* 35-Cell Monthly Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => {
            const hasTask = realTasks.some(
              (t) => t.dueDate.getDate() === day
            )

            return (
              <div
                key={day}
                className={`h-24 p-2 border rounded-lg flex flex-col justify-between transition-colors ${
                  day === 27
                    ? "bg-blue-50 dark:bg-blue-900/30 border-blue_munsell-500"
                    : "bg-slate-50 dark:bg-outer_space-400 border-french_gray-300 dark:border-payne's_gray-400"
                }`}
              >
                <span
                  className={`text-xs font-semibold ${
                    day === 27
                      ? "text-blue_munsell-500 dark:text-blue-400 font-bold"
                      : "text-outer_space-500 dark:text-platinum-500"
                  }`}
                >
                  {day}
                </span>

                {hasTask && (
                  <div className="bg-blue_munsell-500 text-white text-[10px] p-1 rounded font-medium truncate shadow-xs">
                    Task Due
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Upcoming Deadlines Section */}
      <div className="bg-white dark:bg-outer_space-500 rounded-lg border border-french_gray-300 dark:border-payne's_gray-400 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-outer_space-500 dark:text-platinum-500 mb-4">
          Upcoming Deadlines
        </h3>
        <div className="space-y-3">
          {upcomingDeadlines.map((event, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-outer_space-400 rounded-lg border border-french_gray-300 dark:border-payne's_gray-400"
            >
              <div className="flex items-center gap-3">
                {event.isCompleted ? (
                  <CheckCircle size={18} className="text-emerald-500" />
                ) : (
                  <Clock size={18} className="text-amber-500" />
                )}
                <div>
                  <div className="font-medium text-outer_space-500 dark:text-platinum-500 text-sm">
                    {event.title}
                  </div>
                  <div className="text-xs text-payne's_gray-500 dark:text-french_gray-400 mt-0.5">
                    {event.projectName}
                  </div>
                </div>
              </div>
              <div className="text-xs font-medium text-payne's_gray-500 dark:text-french_gray-400 bg-white dark:bg-outer_space-500 px-2.5 py-1 rounded border border-french_gray-300 dark:border-payne's_gray-400">
                {new Date(event.dueDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}