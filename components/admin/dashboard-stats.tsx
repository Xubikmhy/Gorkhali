"use client"

import { useEffect, useState } from "react"
import { Users, Clock, ClipboardList } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { getEmployees } from "@/lib/firebase/firestore"

export function DashboardStats() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    punchedInToday: 0,
    hoursToday: 0,
    tasksCompleted: 0,
    tasksPending: 0,
  })

  useEffect(() => {
    async function fetchStats() {
      try {
        const employees = await getEmployees()

        // For demo purposes, we'll set some placeholder values
        setStats({
          totalEmployees: employees.length,
          punchedInToday: Math.floor(employees.length * 0.7), // 70% of employees
          hoursToday: employees.length * 4, // Average 4 hours per employee
          tasksCompleted: 12,
          tasksPending: 8,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      title: "Total Employees",
      value: stats.totalEmployees,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Punched In Today",
      value: stats.punchedInToday,
      icon: Clock,
      color: "bg-green-500",
    },
    {
      title: "Hours Today",
      value: stats.hoursToday,
      icon: Clock,
      color: "bg-purple-500",
    },
    {
      title: "Tasks",
      value: `${stats.tasksCompleted}/${stats.tasksPending + stats.tasksCompleted}`,
      icon: ClipboardList,
      color: "bg-amber-500",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
