"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ElegantSidebar } from "@/components/elegant-sidebar"
import { motion } from "framer-motion"

export function ElegantLayout({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <ElegantSidebar />
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 p-4 md:p-6 lg:p-8 ml-0 lg:ml-80"
      >
        <div className="max-w-7xl mx-auto">{children}</div>
      </motion.main>
    </div>
  )
}
