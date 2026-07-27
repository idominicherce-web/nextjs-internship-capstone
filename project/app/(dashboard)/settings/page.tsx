// app/(dashboard)/settings/page.tsx
import { getOrCreateDbUser } from "@/lib/auth"
import { User, Bell, Shield, Palette, CheckCircle } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function SettingsPage() {
  const dbUser = await getOrCreateDbUser()

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-outer_space-500 dark:text-platinum-500">
          Settings
        </h1>
        <p className="text-payne's_gray-500 dark:text-french_gray-400 mt-2">
          Manage your account and application preferences
        </p>
      </div>

      {/* Implementation Tasks Banner */}
      {/* <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
          ⚙️ Settings Implementation Tasks
        </h3>
        <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
          <li>• Task 2.4: Implement user session management.</li>
          <li>• Task 6.4: Implement project member management and permissions.</li>
        </ul>
      </div> */}

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Sidebar Navigation */}
        <div className="bg-white dark:bg-outer_space-500 rounded-lg border border-french_gray-300 dark:border-payne's_gray-400 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-outer_space-500 dark:text-platinum-500 mb-4">
            Navigation
          </h3>
          <nav className="space-y-2">
            {[
              { name: "Profile", icon: User, active: true },
              { name: "Notifications", icon: Bell, active: false },
              { name: "Security", icon: Shield, active: false },
              { name: "Appearance", icon: Palette, active: false },
            ].map((item) => (
              <button
                key={item.name}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  item.active
                    ? "bg-blue_munsell-500 text-white font-semibold shadow-xs"
                    : "text-outer_space-500 dark:text-platinum-500 hover:bg-slate-100 dark:hover:bg-payne's_gray-400"
                }`}
              >
                <item.icon className="mr-3" size={16} />
                {item.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Form Content */}
        <div className="lg:col-span-2 bg-white dark:bg-outer_space-500 rounded-lg border border-french_gray-300 dark:border-payne's_gray-400 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-outer_space-500 dark:text-platinum-500 mb-6 flex items-center gap-2">
            <User size={20} className="text-blue_munsell-500" />
            Profile Settings
          </h3>

          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-outer_space-500 dark:text-platinum-500 mb-2">
                Full Name
              </label>
              <input
                type="text"
                defaultValue={dbUser?.name || "John Doe"}
                className="w-full px-3 py-2 border border-french_gray-300 dark:border-payne's_gray-400 rounded-lg bg-white dark:bg-outer_space-400 text-outer_space-500 dark:text-platinum-500 focus:outline-none focus:ring-2 focus:ring-blue_munsell-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-outer_space-500 dark:text-platinum-500 mb-2">
                Email Address
              </label>
              <input
                type="email"
                defaultValue={dbUser?.email || "john@example.com"}
                className="w-full px-3 py-2 border border-french_gray-300 dark:border-payne's_gray-400 rounded-lg bg-white dark:bg-outer_space-400 text-outer_space-500 dark:text-platinum-500 focus:outline-none focus:ring-2 focus:ring-blue_munsell-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-outer_space-500 dark:text-platinum-500 mb-2">
                Workspace Role
              </label>
              <select
                defaultValue="Project Manager"
                className="w-full px-3 py-2 border border-french_gray-300 dark:border-payne's_gray-400 rounded-lg bg-white dark:bg-outer_space-400 text-outer_space-500 dark:text-platinum-500 focus:outline-none focus:ring-2 focus:ring-blue_munsell-500 text-sm"
              >
                <option>Project Manager</option>
                <option>Developer</option>
                <option>Designer</option>
                <option>QA Engineer</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-payne's_gray-400">
              <span className="text-xs text-payne's_gray-500 dark:text-french_gray-400 flex items-center gap-1.5">
                <CheckCircle size={14} className="text-emerald-500" /> Session Active
              </span>
              <div className="flex space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-payne's_gray-500 dark:text-french_gray-400 hover:bg-slate-100 dark:hover:bg-payne's_gray-400 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium bg-blue_munsell-500 text-white rounded-lg hover:bg-blue_munsell-600 transition-colors shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}