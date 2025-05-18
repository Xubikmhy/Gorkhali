"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/lib/auth-provider"
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
  CheckCircle,
  Menu,
  X,
  ChevronRight,
  User,
  Calendar,
  MessageSquare,
  HelpCircle,
  Sun,
  Moon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

type MenuItem = {
  title: string
  icon: React.ElementType
  href: string
  color: string
  description?: string
  badge?: string | number
}

export function ElegantSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut } = useAuth()
  const { theme, setTheme } = useTheme()

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth >= 1024) {
        setIsOpen(true)
      } else {
        setIsOpen(false)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Default to admin if no user (should not happen in practice)
  const isAdmin = user?.role === "admin"

  // Define menu items based on user role
  const adminMenuItems: MenuItem[] = [
    {
      title: "Dashboard",
      icon: BarChart3,
      href: "/admin/dashboard",
      color: "bg-gradient-primary",
      description: "Overview of system activity",
    },
    {
      title: "Employees",
      icon: Users,
      href: "/admin/employees",
      color: "bg-gradient-accent",
      description: "Manage employee accounts",
      badge: 15,
    },
    {
      title: "Departments",
      icon: Building,
      href: "/admin/departments",
      color: "bg-gradient-secondary",
      description: "Organize company structure",
      badge: 4,
    },
    {
      title: "Tasks",
      icon: ClipboardList,
      href: "/admin/tasks",
      color: "bg-gradient-warning",
      description: "Assign and track tasks",
      badge: 8,
    },
    {
      title: "Attendance",
      icon: Clock,
      href: "/admin/attendance",
      color: "bg-gradient-success",
      description: "Monitor employee attendance",
    },
    {
      title: "Salary",
      icon: DollarSign,
      href: "/admin/salary",
      color: "bg-purple-500",
      description: "Manage payroll and advances",
    },
    {
      title: "Announcements",
      icon: Bell,
      href: "/admin/announcements",
      color: "bg-pink-500",
      description: "Post company updates",
      badge: 2,
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/admin/settings",
      color: "bg-gray-500",
      description: "Configure system preferences",
    },
  ]

  const employeeMenuItems: MenuItem[] = [
    {
      title: "Dashboard",
      icon: Home,
      href: "/employee/dashboard",
      color: "bg-gradient-primary",
      description: "Your personal overview",
    },
    {
      title: "My Tasks",
      icon: CheckCircle,
      href: "/employee/tasks",
      color: "bg-gradient-warning",
      description: "View and complete tasks",
      badge: 3,
    },
    {
      title: "Attendance",
      icon: Clock,
      href: "/employee/attendance",
      color: "bg-gradient-success",
      description: "Manage your attendance",
    },
    {
      title: "Calendar",
      icon: Calendar,
      href: "/employee/calendar",
      color: "bg-gradient-secondary",
      description: "View schedule and events",
    },
    {
      title: "Messages",
      icon: MessageSquare,
      href: "/employee/messages",
      color: "bg-gradient-accent",
      description: "Internal communications",
      badge: 5,
    },
    {
      title: "Profile",
      icon: User,
      href: "/employee/profile",
      color: "bg-purple-500",
      description: "Manage your information",
    },
    {
      title: "Announcements",
      icon: Bell,
      href: "/employee/announcements",
      color: "bg-pink-500",
      description: "Company updates",
      badge: 2,
    },
    {
      title: "Help",
      icon: HelpCircle,
      href: "/employee/help",
      color: "bg-gray-500",
      description: "Support and resources",
    },
  ]

  const menuItems = isAdmin ? adminMenuItems : employeeMenuItems

  const handleSignOut = () => {
    signOut()
  }

  const handleNavigation = (href: string) => {
    router.push(href)
    if (isMobile) {
      setIsOpen(false)
    }
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  // Sidebar variants for animations
  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: isMobile ? "-100%" : 0, opacity: isMobile ? 0 : 1 },
  }

  // Menu item variants for staggered animations
  const menuItemVariants = {
    open: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
      },
    }),
    closed: { opacity: 0, x: -20 },
  }

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed top-4 left-4 z-50 p-2 rounded-full shadow-lg lg:hidden",
          "bg-gradient-primary text-white",
          "transition-all duration-300 ease-in-out",
          "hover:shadow-xl hover:scale-105",
          isOpen && "rotate-90",
        )}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Backdrop for mobile */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        variants={sidebarVariants}
        initial={isMobile ? "closed" : "open"}
        animate={isOpen ? "open" : "closed"}
        className={cn(
          "fixed top-0 left-0 h-full z-50",
          "w-72 lg:w-80",
          "flex flex-col",
          "bg-white dark:bg-gray-900",
          "shadow-xl",
          "transition-all duration-300 ease-in-out",
          "border-r border-gray-200 dark:border-gray-800",
          isMobile ? "lg:relative" : "relative",
        )}
      >
        {/* Logo and Header */}
        <div className="relative h-24 bg-gradient-primary flex items-center justify-center p-4">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent"></div>
          </div>
          <div className="relative flex items-center space-x-3">
            <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl font-bold">EM</span>
            </div>
            <div>
              <h1 className="text-white text-xl font-bold">EM System</h1>
              <p className="text-white/80 text-xs">{isAdmin ? "Admin Portal" : "Employee Portal"}</p>
            </div>
          </div>
        </div>

        {/* User Profile Section */}
        {user && (
          <div className="p-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="h-12 w-12 rounded-full bg-gradient-accent flex items-center justify-center text-white font-semibold shadow-md">
                  {user.displayName?.charAt(0) || "U"}
                </div>
                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-900"></div>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">{user.displayName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {isAdmin ? "Administrator" : user.department}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-1">
            <AnimatePresence>
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  custom={index}
                  variants={menuItemVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  className="relative"
                >
                  <button
                    onClick={() => handleNavigation(item.href)}
                    className={cn(
                      "w-full flex items-center text-left space-x-3 px-3 py-3 rounded-lg",
                      "transition-all duration-200 ease-in-out",
                      "hover:bg-gray-100 dark:hover:bg-gray-800",
                      pathname === item.href
                        ? "bg-gray-100 dark:bg-gray-800 font-medium"
                        : "text-gray-700 dark:text-gray-300",
                    )}
                  >
                    <div
                      className={cn(
                        "flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center text-white",
                        item.color,
                      )}
                    >
                      <item.icon size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{item.title}</p>
                      {item.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{item.description}</p>
                      )}
                    </div>
                    {item.badge && (
                      <div className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-gradient-accent rounded-full">
                        {item.badge}
                      </div>
                    )}
                    <ChevronRight
                      size={16}
                      className={cn(
                        "text-gray-400",
                        pathname === item.href ? "opacity-100" : "opacity-0 group-hover:opacity-100",
                      )}
                    />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="flex items-center space-x-3">
              {theme === "dark" ? <Moon size={20} /> : <Sun size={20} />}
              <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
            </div>
            <div className="relative">
              <div
                className={cn(
                  "w-10 h-5 rounded-full transition-colors",
                  theme === "dark" ? "bg-gray-700" : "bg-gray-300",
                )}
              ></div>
              <div
                className={cn(
                  "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform",
                  theme === "dark" && "translate-x-5",
                )}
              ></div>
            </div>
          </button>

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut size={20} />
            <span>Sign out</span>
          </button>
        </div>
      </motion.div>

      {/* Mini Sidebar for Desktop (when collapsed) */}
      {!isMobile && !isOpen && (
        <div className="fixed top-0 left-0 h-full w-20 bg-white dark:bg-gray-900 shadow-lg border-r border-gray-200 dark:border-gray-800 z-40 hidden lg:flex flex-col items-center py-6">
          <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg mb-6">
            <span className="text-white text-2xl font-bold">EM</span>
          </div>

          <div className="flex-1 flex flex-col items-center space-y-4 overflow-y-auto py-4">
            {menuItems.map((item) => (
              <button key={item.href} onClick={() => handleNavigation(item.href)} className="group relative">
                <div
                  className={cn(
                    "h-12 w-12 rounded-lg flex items-center justify-center text-white",
                    item.color,
                    "transition-all duration-200 ease-in-out",
                    "hover:scale-110",
                    pathname === item.href ? "ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900" : "",
                  )}
                >
                  <item.icon size={20} />
                  {item.badge && (
                    <div className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-gradient-accent rounded-full">
                      {item.badge}
                    </div>
                  )}
                </div>
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                  {item.title}
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={toggleTheme}
            className="h-10 w-10 rounded-lg flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors mb-2 group relative"
          >
            {theme === "dark" ? <Moon size={20} /> : <Sun size={20} />}
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </div>
          </button>

          <button
            onClick={handleSignOut}
            className="h-10 w-10 rounded-lg flex items-center justify-center text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group relative"
          >
            <LogOut size={20} />
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
              Sign out
            </div>
          </button>

          <button
            onClick={() => setIsOpen(true)}
            className="absolute -right-3 top-1/2 transform -translate-y-1/2 h-6 w-6 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronRight size={14} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      )}
    </>
  )
}
