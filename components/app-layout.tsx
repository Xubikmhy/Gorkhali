"use client"

import type { ReactNode } from "react"
import { useEffect, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { MobileSidebar } from "@/components/mobile-sidebar"

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="hidden md:block">
        <AppSidebar />
      </div>
      <MobileSidebar />
      <main className="flex-1 p-4 md:p-6 md:ml-64">{children}</main>
    </div>
  )
}
