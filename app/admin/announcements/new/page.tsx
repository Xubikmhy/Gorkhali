"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { createAnnouncement } from "@/lib/firebase/firestore"

export default function NewAnnouncementPage() {
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !message) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      await createAnnouncement({
        title,
        message,
        date: new Date(),
      })

      toast({
        title: "Success",
        description: "Announcement has been posted successfully.",
      })

      router.push("/admin/announcements")
    } catch (error) {
      console.error("Error posting announcement:", error)
      toast({
        title: "Error",
        description: "Failed to post announcement. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Post New Announcement</h1>

      <Card className="border-none shadow-md">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Announcement Details</CardTitle>
            <CardDescription>
              Create a new announcement for all employees. Announcements will automatically expire after 30 days.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter announcement title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">
                Message <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter announcement message"
                rows={6}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/announcements")}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Posting..." : "Post Announcement"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
