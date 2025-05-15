"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function RecentActivity() {
  // Sample data for demonstration
  const activities = [
    {
      type: "punch-in",
      user: "John",
      time: "08:30 AM",
      date: "Today",
    },
    {
      type: "task-complete",
      user: "Sarah",
      task: "Design new brochure",
      time: "09:15 AM",
      date: "Today",
    },
    {
      type: "punch-out",
      user: "Mike",
      time: "05:00 PM",
      date: "Yesterday",
    },
    {
      type: "new-employee",
      user: "Lisa",
      department: "Design",
      time: "11:30 AM",
      date: "Yesterday",
    },
    {
      type: "announcement",
      title: "Office Closure",
      time: "04:45 PM",
      date: "May 14, 2025",
    },
  ]

  return (
    <Card className="border-none shadow-md">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest actions across the system</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3 border-b pb-3 last:border-0">
              <div className="flex-1">
                {activity.type === "punch-in" && (
                  <p className="text-sm font-medium">
                    {activity.user} punched in at {activity.time}
                  </p>
                )}
                {activity.type === "punch-out" && (
                  <p className="text-sm font-medium">
                    {activity.user} punched out at {activity.time}
                  </p>
                )}
                {activity.type === "task-complete" && (
                  <p className="text-sm font-medium">
                    {activity.user} completed task: {activity.task}
                  </p>
                )}
                {activity.type === "new-employee" && (
                  <p className="text-sm font-medium">
                    {activity.user} joined {activity.department} department
                  </p>
                )}
                {activity.type === "announcement" && (
                  <p className="text-sm font-medium">New announcement: {activity.title}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  {activity.date} at {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
