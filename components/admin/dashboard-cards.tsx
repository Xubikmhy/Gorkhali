"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function DashboardCards() {
  // Sample data for demonstration
  const taskCompletionRate = 65
  const attendanceRate = 92
  const departmentDistribution = [
    { name: "Printing", count: 5 },
    { name: "Design", count: 4 },
    { name: "Binding", count: 3 },
    { name: "Office", count: 3 },
  ]

  return (
    <>
      <Card className="border-none shadow-md">
        <CardHeader className="pb-2">
          <CardTitle>Task Completion</CardTitle>
          <CardDescription>Weekly task completion rate</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">{taskCompletionRate}%</div>
          </div>
          <Progress value={taskCompletionRate} className="mt-2 h-2" />
          <div className="mt-4 text-sm text-muted-foreground">
            {taskCompletionRate > 50 ? "Good progress this week" : "Needs improvement"}
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-md">
        <CardHeader className="pb-2">
          <CardTitle>Attendance</CardTitle>
          <CardDescription>Monthly attendance rate</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">{attendanceRate}%</div>
          </div>
          <Progress value={attendanceRate} className="mt-2 h-2" />
          <div className="mt-4 text-sm text-muted-foreground">
            {attendanceRate > 90 ? "Excellent attendance" : "Room for improvement"}
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-md">
        <CardHeader className="pb-2">
          <CardTitle>Departments</CardTitle>
          <CardDescription>Employee distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {departmentDistribution.map((dept, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="text-sm font-medium">{dept.name}</div>
                <div className="text-sm text-muted-foreground">{dept.count} employees</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  )
}
