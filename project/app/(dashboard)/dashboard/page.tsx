// app/(dashboard)/dashboard/page.tsx
import { TrendingUp, Users, CheckCircle, Clock, Plus, Check } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { getOrCreateDbUser } from "@/lib/auth"

export default async function DashboardPage() {
  // Trigger user synchronization with Neon PostgreSQL database
  const dbUser = await getOrCreateDbUser()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-outer_space-500 dark:text-platinum-500">
            Welcome back{dbUser?.name ? `, ${dbUser.name}` : ""}! 👋
          </h1>
          <p className="text-payne's_gray-500 dark:text-french_gray-500 mt-2">
            Here's an overview of your projects and tasks. Time to lock in!
          </p>
        </div>

        {/* User Sync Completion Banner (Task 4.1) */}
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                <Check className="text-white" size={16} />
              </div>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                Task 4.1: User Synchronization Complete
              </h3>
              <p className="mt-1 text-sm text-emerald-800 dark:text-emerald-200">
                Connected as <span className="font-semibold">{dbUser?.email ?? "Authenticated User"}</span>. Your Clerk account is synchronized with Neon PostgreSQL.
              </p>
            </div>
          </div>
        </div>

        {/* Implementation Status Banner */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue_munsell-500 rounded-full flex items-center justify-center">
                <TrendingUp className="text-white" size={16} />
              </div>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100">Upcoming Implementation Tasks</h3>
              <div className="mt-2 text-sm text-blue-800 dark:text-blue-200">
                <ul className="list-disc list-inside space-y-1">
                  <li>Task 4.2: Create project listing and CRUD Server Actions</li>
                  <li>Task 4.3: Set up Kanban list and task CRUD functionality</li>
                  <li>Task 4.4: Add interactive drag-and-drop board view</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid - Placeholder */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { name: "Active Projects", value: "12", icon: TrendingUp, change: "+2.5%" },
            { name: "Team Members", value: "24", icon: Users, change: "+4.1%" },
            { name: "Completed Tasks", value: "156", icon: CheckCircle, change: "+12.3%" },
            { name: "Pending Tasks", value: "43", icon: Clock, change: "-2.1%" },
          ].map((stat) => (
            <div
              key={stat.name}
              className="bg-white dark:bg-outer_space-500 overflow-hidden rounded-lg border border-french_gray-300 dark:border-payne's_gray-400 p-6"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue_munsell-100 dark:bg-blue_munsell-900 rounded-lg flex items-center justify-center">
                    <stat.icon className="text-blue_munsell-500" size={20} />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-payne's_gray-500 dark:text-french_gray-400 truncate">
                      {stat.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-outer_space-500 dark:text-platinum-500">
                        {stat.value}
                      </div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600 dark:text-green-400">
                        {stat.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Projects */}
          <div className="bg-white dark:bg-outer_space-500 rounded-lg border border-french_gray-300 dark:border-payne's_gray-400 p-6">
            <h3 className="text-lg font-semibold text-outer_space-500 dark:text-platinum-500 mb-4">Recent Projects</h3>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-platinum-800 dark:bg-outer_space-400 rounded-lg"
                >
                  <div>
                    <div className="font-medium text-outer_space-500 dark:text-platinum-500">Project {i}</div>
                    <div className="text-sm text-payne's_gray-500 dark:text-french_gray-400">
                      Last updated 2 hours ago
                    </div>
                  </div>
                  <div className="w-12 h-2 bg-french_gray-300 dark:bg-payne's_gray-400 rounded-full">
                    <div className="w-8 h-2 bg-blue_munsell-500 rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                📋 <strong>Task 4.2:</strong> Implement project CRUD operations
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-outer_space-500 rounded-lg border border-french_gray-300 dark:border-payne's_gray-400 p-6">
            <h3 className="text-lg font-semibold text-outer_space-500 dark:text-platinum-500 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center px-4 py-3 bg-blue_munsell-500 text-white rounded-lg hover:bg-blue_munsell-600 transition-colors">
                <Plus size={20} className="mr-2" />
                Create New Project
              </button>
              <button className="w-full flex items-center justify-center px-4 py-3 border border-french_gray-300 dark:border-payne's_gray-400 text-outer_space-500 dark:text-platinum-500 rounded-lg hover:bg-platinum-500 dark:hover:bg-payne's_gray-400 transition-colors">
                <Plus size={20} className="mr-2" />
                Add Team Member
              </button>
              <button className="w-full flex items-center justify-center px-4 py-3 border border-french_gray-300 dark:border-payne's_gray-400 text-outer_space-500 dark:text-platinum-500 rounded-lg hover:bg-platinum-500 dark:hover:bg-payne's_gray-400 transition-colors">
                <Plus size={20} className="mr-2" />
                Create Task
              </button>
            </div>
            <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                📋 <strong>Task 4.3:</strong> Build task creation and editing functionality
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}