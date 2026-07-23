// components/create-project-button.tsx
"use client"

import { useState } from "react"
import { CreateProjectModal } from "@/components/modals/create-project-modal"
import { Plus } from "lucide-react"

export function CreateProjectButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center px-4 py-2 bg-blue_munsell-500 text-white rounded-lg hover:bg-blue_munsell-600 transition-colors shadow-sm font-medium text-sm gap-2"
      >
        <Plus size={18} />
        New Project
      </button>

      <CreateProjectModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  )
}