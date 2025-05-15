"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getAnnouncements } from "@/lib/firebase/firestore"

export function AnnouncementList() {
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
      expiresAt: new Date(2025, 5, 15),
    },
    {
      id: "2",
      title: "New Equipment Arrival",
      message: "New printing equipment will be delivered next week. Training sessions will be scheduled soon.",
      createdAt: { toDate: () => new Date(2025, 4, 10) },
      expiresAt: new Date(2025, 5, 10),
    },
  ]

  // Use sample data if no announcements are fetched
  const displayAnnouncements = announcements.length > 0 ? announcements : sampleAnnouncements

  return (
    <div className="space-y-4">
      {displayAnnouncements.length === 0 ? (
        <Card className="border-none shadow-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No announcements found</p>
          </CardContent>
        </Card>
      ) : (
        displayAnnouncements.map((announcement) => (
          <Card key={announcement.id} className="border-none shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{announcement.title}</CardTitle>
                <span className="text-sm text-muted-foreground">
                  {announcement.createdAt.toDate().toLocaleDateString()}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{announcement.message}</p>
              <p className="mt-4 text-sm text-muted-foreground">
                Expires: {new Date(announcement.expiresAt).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
