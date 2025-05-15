"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-provider"
import { getTasks, updateTask } from "@/lib/firebase/firestore"
import { useToast } from "@/components/ui/use-toast"

export function EmployeeTasks() {
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    async function fetchTasks() {
      if (!user?.employeeId) return

      try {
        const tasksData = await getTasks(user.employeeId)
        setTasks(tasksData)
      } catch (error) {
        console.error("Error fetching tasks:", error)
      }
    }

    fetchTasks()
  }, [user])

  // Sample tasks for demonstration
  const sampleTasks = [
    {
      id: "1",
      title: "Complete monthly report",
      description: "Prepare the monthly sales report for the management team.",
      dueDate: "2025-05-20",
      status: "In Progress",
    },
    {
      id: "2",
      title: "Design new brochure",
      description: "Create a new brochure design for the upcoming product launch.",
      dueDate: "2025-05-25",
      status: "Pending",
    },
    {
      id: "3",
      title: "Fix printer issues",
      description: "Troubleshoot and fix the issues with the main printer.",
      dueDate: "2025-05-18",
      status: "Completed",
    },
  ]

  // Use sample data if no tasks are fetched
  const displayTasks = tasks.length > 0 ? tasks : sampleTasks

  const handleUpdateStatus = async (taskId: string, newStatus: string) => {
    setLoading(true)

    try {
      await updateTask(taskId, { status: newStatus })

      // Update local state
      setTasks((prevTasks) => prevTasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)))

      toast({
        title: "Task Updated",
        description: `Task status updated to ${newStatus}.`,
      })
    } catch (error) {
      console.error("Error updating task:", error)
      toast({
        title: "Error",
        description: "Failed to update task status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string, dueDate: string) => {
    const isOverdue = new Date(dueDate) < new Date() && status !== "Completed"

    if (isOverdue) {
      return <Badge variant="destructive">Overdue</Badge>
    }

    switch (status) {
      case "Pending":
        return <Badge variant="secondary">Pending</Badge>
      case "In Progress":
        return <Badge variant="default">In Progress</Badge>
      case "Completed":
        return (
          <Badge variant="success" className="bg-green-500">
            Completed
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <Card className="border-none shadow-md">
      <CardHeader>
        <CardTitle>My Tasks</CardTitle>
        <CardDescription>View and manage your assigned tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayTasks.length === 0 ? (
            <p className="text-center text-muted-foreground">No tasks assigned</p>
          ) : (
            displayTasks.map((task) => (
              <div key={task.id} className="rounded-lg border p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{task.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                    <div className="flex items-center mt-2 space-x-2">
                      <span className="text-xs text-muted-foreground">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                      {getStatusBadge(task.status, task.dueDate)}
                    </div>
                  </div>
                  {task.status !== "Completed" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateStatus(task.id, "Completed")}
                      disabled={loading}
                    >
                      Mark Complete
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
