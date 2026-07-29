"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function ScrollToTop() {
  const pathname = usePathname()

  useEffect(() => {
    // Scroll the window to the top instantly upon route change
    window.scrollTo(0, 0)
    
    // Also reset scroll position for any scrollable main containers
    const mainContent = document.querySelector("main")
    if (mainContent) {
      mainContent.scrollTop = 0
    }
  }, [pathname])

  return null
}