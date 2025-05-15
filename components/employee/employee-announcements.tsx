"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getAnnouncements } from "@/lib/firebase/firestore"

export function EmployeeAnnouncements() {
  const [announcements, setAnnouncements] = useState<any[]>([])

  useEffect(() => {
    async function fetchAnnouncements() {
      try {
        const announcementsData = await getAnnouncements()
        setAnnouncements(announcementsData)
      } catch (error) {
        console.error("Error fetching announcements:", error)
      }
    }

    fetchAnnouncements()
  }, [])

  // Sample announcements for demonstration
  const sampleAnnouncements = [
    {
      id: "1",
      title: "Office Closure",
      message: "The office will be closed on May 25th for maintenance. Please plan accordingly.",
      createdAt: { toDate: () => new Date(2025, 4, 15) },
    },
    {
      id: "2",
      title: "New Equipment Arrival",
      message: "New printing equipment will be delivered next week. Training sessions will be scheduled soon.",
      createdAt: { toDate: () => new Date(2025, 4, 10) },
    },
  ]

  // Use sample data if no announcements are fetched
  const displayAnnouncements = announcements.length > 0 ? announcements : sampleAnnouncements

  return (
    <Card className="border-none shadow-md">
      <CardHeader>
        <CardTitle>Announcements</CardTitle>
        <CardDescription>Latest announcements from management</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayAnnouncements.length === 0 ? (
            <p className="text-center text-muted-foreground">No announcements</p>
          ) : (
            displayAnnouncements.map((announcement) => (
              <div key={announcement.id} className="rounded-lg border p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{announcement.title}</h3>
                  <span className="text-xs text-muted-foreground">
                    {announcement.createdAt.toDate().toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{announcement.message}</p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
