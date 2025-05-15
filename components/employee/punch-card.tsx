"use client"

import { useState } from "react"
import { Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export function PunchCard() {
  const [isPunchedIn, setIsPunchedIn] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handlePunchInOut = async () => {
    setLoading(true)

    try {
      // This would be a call to your API
      setTimeout(() => {
        setIsPunchedIn(!isPunchedIn)

        toast({
          title: isPunchedIn ? "Punched Out" : "Punched In",
          description: isPunchedIn ? "You have successfully punched out." : "You have successfully punched in.",
        })

        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Error punching in/out:", error)
      toast({
        title: "Error",
        description: "Failed to record attendance. Please try again.",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Clock className="mr-2 h-5 w-5 text-blue-500" />
          Attendance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center p-4">
          <div className="mb-4 text-center">
            {isPunchedIn && <p className="text-sm text-muted-foreground">You are currently punched in</p>}
          </div>
          <Button
            onClick={handlePunchInOut}
            disabled={loading}
            className={`w-full ${isPunchedIn ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"}`}
          >
            {loading ? "Processing..." : isPunchedIn ? "Punch Out" : "Punch In"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
