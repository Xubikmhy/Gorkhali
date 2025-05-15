"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { PlusCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

// Sample employees for demonstration
const sampleEmployees = [
  { id: "1", name: "John" },
  { id: "2", name: "Sarah" },
  { id: "3", name: "Mike" },
]

export function QuickTaskForm() {
  const [title, setTitle] = useState("")
  const [employeeId, setEmployeeId] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Fetch employees from API
    const fetchEmployees = async () => {
      try {
        // This would be a call to your API
        // const response = await fetch('/api/employees')
        // const data = await response.json()
        // setEmployees(data)

        // For demo, use sample data
        setEmployees(sampleEmployees)
      } catch (error) {
        console.error("Error fetching employees:", error)
      }
    }

    fetchEmployees()
  }, [])

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
      // This would be a call to your API
      // await fetch('/api/tasks', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     title,
      //     employeeId,
      //     dueDate,
      //     status: 'Pending'
      //   })
      // })

      toast({
        title: "Success",
        description: "Task has been created successfully.",
      })

      // Reset form
      setTitle("")
      setEmployeeId("")
      setDueDate("")
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
    <Card className="apple-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <PlusCircle className="mr-2 h-5 w-5 text-blue-500" />
          Add New Task
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              className="apple-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="employee">Assign To</Label>
            <Select value={employeeId} onValueChange={setEmployeeId}>
              <SelectTrigger className="apple-input">
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="apple-input"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={loading} className="w-full apple-button hover-scale">
            {loading ? "Creating..." : "Create Task"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
