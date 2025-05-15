"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Clock, ClipboardCheck, ClipboardList } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-provider"
import { useToast } from "@/components/ui/use-toast"
import { punchIn } from "@/lib/firebase/firestore"

export function EmployeeDashboardStats() {
  const [isPunchedIn, setIsPunchedIn] = useState(false)
  const [punchInTime, setPunchInTime] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  // Sample stats for demonstration
  const stats = {
    tasksCompleted: 5,
    tasksPending: 3,
    hoursThisWeek: 32,
  }

  useEffect(() => {
    // Check if user is already punched in
    // This would normally come from the database
    const checkPunchInStatus = () => {
      // For demo purposes, we'll just set a random status
      const randomStatus = Math.random() > 0.5
      setIsPunchedIn(randomStatus)

      if (randomStatus) {
        // Set a random punch-in time for demo
        const now = new Date()
        now.setHours(now.getHours() - Math.floor(Math.random() * 8))
        setPunchInTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
      }
    }

    checkPunchInStatus()
  }, [])

  const handlePunchInOut = async () => {
    if (!user?.employeeId) return

    setLoading(true)

    try {
      if (!isPunchedIn) {
        await punchIn(user.employeeId)
        setIsPunchedIn(true)
        setPunchInTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))

        toast({
          title: "Punched In",
          description: "You have successfully punched in.",
        })
      } else {
        // This would be punchOut in a real implementation
        setIsPunchedIn(false)
        setPunchInTime(null)

        toast({
          title: "Punched Out",
          description: "You have successfully punched out.",
        })
      }
    } catch (error) {
      console.error("Error punching in/out:", error)
      toast({
        title: "Error",
        description: "Failed to record attendance. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: "Tasks Completed",
      value: stats.tasksCompleted,
      icon: ClipboardCheck,
      color: "bg-green-500",
    },
    {
      title: "Tasks Pending",
      value: stats.tasksPending,
      icon: ClipboardList,
      color: "bg-amber-500",
    },
    {
      title: "Hours This Week",
      value: stats.hoursThisWeek,
      icon: Clock,
      color: "bg-blue-500",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card className="border-none shadow-md md:col-span-1">
        <CardContent className="flex flex-col items-center justify-center p-6">
          <div className="mb-4 text-center">
            <h3 className="text-lg font-medium">Attendance</h3>
            {isPunchedIn && punchInTime && <p className="text-sm text-muted-foreground">Punched in at {punchInTime}</p>}
          </div>
          <Button
            onClick={handlePunchInOut}
            disabled={loading}
            className={`w-full ${isPunchedIn ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}
          >
            {loading ? "Processing..." : isPunchedIn ? "Punch Out" : "Punch In"}
          </Button>
        </CardContent>
      </Card>

      {statCards.map((stat, index) => (
        <Card key={index} className="border-none shadow-md">
          <CardContent className="flex items-center p-6">
            <div className={`rounded-full p-3 mr-4 ${stat.color}`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
