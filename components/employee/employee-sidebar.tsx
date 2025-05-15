"use client"

import { usePathname, useRouter } from "next/navigation"
import { BarChart3, ClipboardList, Clock, Bell, LogOut, Briefcase } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { signOut } from "@/lib/firebase/auth"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-provider"

export function EmployeeSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  const menuItems = [
    {
      title: "Dashboard",
      icon: BarChart3,
      href: "/employee/dashboard",
    },
    {
      title: "Tasks",
      icon: ClipboardList,
      href: "/employee/tasks",
    },
    {
      title: "Attendance",
      icon: Clock,
      href: "/employee/attendance",
    },
    {
      title: "Announcements",
      icon: Bell,
      href: "/employee/announcements",
    },
  ]

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <Briefcase className="h-6 w-6" />
          <span className="text-lg font-semibold">EM System</span>
        </div>
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        <div className="px-4 py-2">
          <p className="text-sm font-medium">Welcome, {user?.displayName || "Employee"}</p>
        </div>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                <Button variant="ghost" className="w-full justify-start" onClick={() => router.push(item.href)}>
                  <item.icon className="mr-2 h-5 w-5" />
                  <span>{item.title}</span>
                </Button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <Button variant="outline" className="w-full justify-start" onClick={handleSignOut}>
          <LogOut className="mr-2 h-5 w-5" />
          <span>Sign out</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
