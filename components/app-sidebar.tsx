"use client"

import { usePathname, useRouter } from "next/navigation"
import {
  BarChart3,
  Users,
  Building,
  ClipboardList,
  Clock,
  DollarSign,
  Bell,
  Settings,
  LogOut,
  Home,
  PlusCircle,
  CheckCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-provider"

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut } = useAuth()

  // Default to admin if no user (should not happen in practice)
  const isAdmin = user?.role === "admin"

  // Define menu items based on user role
  const adminMenuItems = [
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
      title: "Add New Task",
      icon: PlusCircle,
      href: "/admin/tasks/new",
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
    {
      title: "Settings",
      icon: Settings,
      href: "/admin/settings",
    },
  ]

  const employeeMenuItems = [
    {
      title: "Home",
      icon: Home,
      href: "/employee/dashboard",
    },
    {
      title: "Punch In/Out",
      icon: Clock,
      href: "/employee/attendance",
    },
    {
      title: "My Tasks",
      icon: CheckCircle,
      href: "/employee/tasks",
    },
  ]

  const menuItems = isAdmin ? adminMenuItems : employeeMenuItems

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="flex flex-col h-screen w-64 bg-white border-r border-gray-200 shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
            EM
          </div>
          <span className="text-lg font-semibold">EM System</span>
        </div>
      </div>

      {user && (
        <div className="px-4 py-2 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
              {user.displayName?.charAt(0) || "U"}
            </div>
            <div>
              <p className="text-sm font-medium">{user.displayName}</p>
              <p className="text-xs text-gray-500">{isAdmin ? "Administrator" : user.department}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-2 space-y-1">
          {menuItems.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              className={`w-full justify-start ${
                pathname === item.href ? "bg-blue-500 text-white hover:bg-blue-600 hover:text-white" : ""
              }`}
              onClick={() => router.push(item.href)}
            >
              <item.icon className="mr-2 h-5 w-5" />
              <span>{item.title}</span>
            </Button>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
        <Button
          variant="outline"
          className="w-full justify-start text-gray-700 hover:text-gray-900"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-5 w-5" />
          <span>Sign out</span>
        </Button>
      </div>
    </div>
  )
}
