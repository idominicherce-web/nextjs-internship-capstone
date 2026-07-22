// app/page.tsx
import Link from "next/link"
import { ArrowRight, CheckCircle, Users, Kanban } from "lucide-react"
import { Header } from "@/components/header"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-platinum-900 to-platinum-800 dark:from-outer_space-500 dark:to-payne's_gray-500">
      {/* Reusable Header with Clerk Auth Controls */}
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-outer_space-500 dark:text-platinum-500 mb-6">
            Manage Projects with
            <span className="text-blue_munsell-500"> Kanban Boards</span>
          </h1>

          <p className="text-xl text-payne's_gray-500 dark:text-french_gray-500 mb-8 max-w-2xl mx-auto">
            Organize tasks, collaborate with teams, and track progress with our intuitive drag-and-drop project
            management platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/dashboard"
              className="inline-flex items-center px-8 py-4 bg-blue_munsell-500 text-white rounded-lg hover:bg-blue_munsell-600 text-lg font-semibold"
            >
              Start Managing Projects
              <ArrowRight className="ml-2" size={20} />
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center px-8 py-4 border-2 border-blue_munsell-500 text-blue_munsell-500 rounded-lg hover:bg-blue_munsell-50 dark:hover:bg-blue_munsell-900 text-lg font-semibold"
            >
              View Projects
            </Link>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="flex items-center justify-center space-x-2 text-outer_space-500 dark:text-platinum-500">
              <Kanban className="text-blue_munsell-500" size={20} />
              <span>Drag & Drop Boards</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-outer_space-500 dark:text-platinum-500">
              <Users className="text-blue_munsell-500" size={20} />
              <span>Team Collaboration</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-outer_space-500 dark:text-platinum-500">
              <CheckCircle className="text-blue_munsell-500" size={20} />
              <span>Task Management</span>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Demo Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-outer_space-400/50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-outer_space-500 dark:text-platinum-500 mb-8">
            🚀 Navigate the App
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <Link
              href="/dashboard"
              className="p-4 bg-white dark:bg-outer_space-500 rounded-lg border border-french_gray-300 dark:border-payne's_gray-400 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold text-outer_space-500 dark:text-platinum-500 mb-2">Dashboard</h3>
              <p className="text-sm text-payne's_gray-500 dark:text-french_gray-400">Main dashboard view</p>
            </Link>

            <Link
              href="/projects"
              className="p-4 bg-white dark:bg-outer_space-500 rounded-lg border border-french_gray-300 dark:border-payne's_gray-400 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold text-outer_space-500 dark:text-platinum-500 mb-2">Projects</h3>
              <p className="text-sm text-payne's_gray-500 dark:text-french_gray-400">Projects listing page</p>
            </Link>

            <Link
              href="/projects/1"
              className="p-4 bg-white dark:bg-outer_space-500 rounded-lg border border-french_gray-300 dark:border-payne's_gray-400 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold text-outer_space-500 dark:text-platinum-500 mb-2">Kanban Board</h3>
              <p className="text-sm text-payne's_gray-500 dark:text-french_gray-400">Project board view</p>
            </Link>

            <Link
              href="/sign-in"
              className="p-4 bg-white dark:bg-outer_space-500 rounded-lg border border-french_gray-300 dark:border-payne's_gray-400 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold text-outer_space-500 dark:text-platinum-500 mb-2">Auth Pages</h3>
              <p className="text-sm text-payne's_gray-500 dark:text-french_gray-400">Sign in/up pages</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}