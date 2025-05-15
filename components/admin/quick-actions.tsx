"use client"

import { useRouter } from "next/navigation"
import { UserPlus, FolderPlus, ClipboardPlus, Bell } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function QuickActions() {
  const router = useRouter()

  const actions = [
    {
      title: "Add Employee",
      description: "Create a new employee account",
      icon: UserPlus,
      href: "/admin/employees/new",
    },
    {
      title: "Create Task",
      description: "Assign a new task to an employee",
      icon: ClipboardPlus,
      href: "/admin/tasks/new",
    },
    {
      title: "Add Department",
      description: "Create a new department",
      icon: FolderPlus,
      href: "/admin/departments/new",
    },
    {
      title: "Post Announcement",
      description: "Create a new announcement",
      icon: Bell,
      href: "/admin/announcements/new",
    },
  ]

  return (
    <Card className="border-none shadow-md">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks you can perform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto flex-col items-start justify-start p-4 text-left"
              onClick={() => router.push(action.href)}
            >
              <div className="flex items-center">
                <action.icon className="mr-2 h-5 w-5" />
                <span className="font-medium">{action.title}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{action.description}</p>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
