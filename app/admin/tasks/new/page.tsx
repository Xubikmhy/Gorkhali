"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { getEmployees, createTask } from "@/lib/firebase/firestore"

export default function NewTaskPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [employeeId, setEmployeeId] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const employeesData = await getEmployees()
        // Only show active employees
        const activeEmployees = employeesData.filter((emp) => emp.status === "Active")
        setEmployees(activeEmployees)
      } catch (error) {
        console.error("Error fetching employees:", error)
        toast({
          title: "Error",
          description: "Failed to load employees. Please try again.",
          variant: "destructive",
        })
      }
    }

    fetchEmployees()
  }, [toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !employeeId || !dueDate) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      await createTask({
        title,
        description,
        employeeId,
        dueDate,
        status: "Pending",
      })

      toast({
        title: "Success",
        description: "Task has been created successfully.",
      })

      router.push("/admin/tasks")
    } catch (error) {
      console.error("Error creating task:", error)
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Create New Task</h1>

      <Card className="border-none shadow-md">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Task Information</CardTitle>
            <CardDescription>Enter the details for the new task.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">
                Task Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter task description"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="employee">
                Assign To <span className="text-red-500">*</span>
              </Label>
              <Select value={employeeId} onValueChange={setEmployeeId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.firstName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">
                Due Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/tasks")}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Task"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
