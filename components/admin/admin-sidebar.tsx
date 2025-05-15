"use client"

import { usePathname, useRouter } from "next/navigation"
import { BarChart3, Users, Briefcase, ClipboardList, Clock, DollarSign, Bell, LogOut, Building } from "lucide-react"
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

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  const menuItems = [
    {
      title: "Dashboard",
      icon: BarChart3,
      href: "/admin/dashboard",
    },
    {
      title: "Employees",
      icon: Users,
      href: "/admin/employees",
    },
    {
      title: "Departments",
      icon: Building,
      href: "/admin/departments",
    },
    {
      title: "Tasks",
      icon: ClipboardList,
      href: "/admin/tasks",
    },
    {
      title: "Attendance",
      icon: Clock,
      href: "/admin/attendance",
    },
    {
      title: "Salary",
      icon: DollarSign,
      href: "/admin/salary",
    },
    {
      title: "Announcements",
      icon: Bell,
      href: "/admin/announcements",
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
