import type React from "react"
import { ElegantLayout } from "@/components/elegant-layout"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ElegantLayout>{children}</ElegantLayout>
}
