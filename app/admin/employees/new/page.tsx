"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { createUser } from "@/lib/firebase/auth"
import { getDepartments } from "@/lib/firebase/firestore"

export default function NewEmployeePage() {
  const [firstName, setFirstName] = useState("")
  const [department, setDepartment] = useState("")
  const [phone, setPhone] = useState("")
  const [employmentType, setEmploymentType] = useState<"Full-time" | "Part-time">("Full-time")
  const [salaryType, setSalaryType] = useState<"Hourly" | "Monthly">("Hourly")
  const [rate, setRate] = useState("")
  const [departments, setDepartments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    async function fetchDepartments() {
      try {
        const departmentsData = await getDepartments()
        setDepartments(departmentsData)
      } catch (error) {
        console.error("Error fetching departments:", error)
        toast({
          title: "Error",
          description: "Failed to load departments. Please try again.",
          variant: "destructive",
        })
      }
    }

    fetchDepartments()
  }, [toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!firstName || !department || !rate) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      await createUser(firstName, department, phone, employmentType, salaryType, Number.parseFloat(rate))

      toast({
        title: "Success",
        description: `Employee ${firstName} has been created successfully.`,
      })

      router.push("/admin/employees")
    } catch (error) {
      console.error("Error creating employee:", error)
      toast({
        title: "Error",
        description: "Failed to create employee. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Add New Employee</h1>

      <Card className="border-none shadow-md">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Employee Information</CardTitle>
            <CardDescription>
              Enter the details for the new employee. They will be able to log in with their first name as username and{" "}
              {firstName ? `"${firstName}@123"` : "FirstName@123"} as password.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter first name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">
                Department <span className="text-red-500">*</span>
              </Label>
              <Select value={department} onValueChange={setDepartment} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.name}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number (optional)"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="employmentType">
                  Employment Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={employmentType}
                  onValueChange={(value) => setEmploymentType(value as "Full-time" | "Part-time")}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="salaryType">
                  Salary Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={salaryType}
                  onValueChange={(value) => setSalaryType(value as "Hourly" | "Monthly")}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hourly">Hourly</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rate">
                {salaryType === "Hourly" ? "Hourly Rate" : "Monthly Salary"} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="rate"
                type="number"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                placeholder={salaryType === "Hourly" ? "Enter hourly rate" : "Enter monthly salary"}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/employees")}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Employee"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
