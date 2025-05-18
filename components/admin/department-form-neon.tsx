"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { addDepartment } from "@/app/actions/departments"

export function DepartmentFormNeon() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  async function handleSubmit(formData: FormData) {
    try {
      setLoading(true)
      const result = await addDepartment(formData)

      if (result.success) {
        toast({
          title: "Success",
          description: "Department created successfully",
        })
        router.push("/admin/departments/neon-v2")
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create department",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating department:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-none shadow-md">
      <CardHeader>
        <CardTitle>Add Department (Neon)</CardTitle>
        <CardDescription>Create a new department in your organization</CardDescription>
      </CardHeader>
      <form action={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Department Name</Label>
            <Input id="name" name="name" placeholder="Enter department name" required />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Department
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
