"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { createDepartment } from "@/lib/firebase/firestore"

export default function NewDepartmentPage() {
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name) {
      toast({
        title: "Missing Field",
        description: "Please enter a department name.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      await createDepartment(name)

      toast({
        title: "Success",
        description: `Department "${name}" has been created successfully.`,
      })

      router.push("/admin/departments")
    } catch (error: any) {
      console.error("Error creating department:", error)

      const errorMessage =
        error.message === "Department already exists"
          ? "A department with this name already exists."
          : "Failed to create department. Please try again."

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Add New Department</h1>

      <Card className="border-none shadow-md">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Department Information</CardTitle>
            <CardDescription>Enter the name for the new department.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="name">
                Department Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter department name"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/departments")}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Department"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
