"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { getEmployees, punchIn } from "@/lib/firebase/firestore"

export function AttendancePunchIn() {
  const [employees, setEmployees] = useState<any[]>([])
  const [selectedEmployee, setSelectedEmployee] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const employeesData = await getEmployees()
        // Only show active employees
        const activeEmployees = employeesData.filter((emp) => emp.status === "Active")
        setEmployees(activeEmployees)
      } catch (error) {
        console.error("Error fetching employees:", error)
      }
    }

    fetchEmployees()
  }, [])

  const handlePunchIn = async () => {
    if (!selectedEmployee) {
      toast({
        title: "Error",
        description: "Please select an employee.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      await punchIn(selectedEmployee)

      toast({
        title: "Success",
        description: "Employee punched in successfully.",
      })

      // Reset selection
      setSelectedEmployee("")
    } catch (error) {
      console.error("Error punching in:", error)
      toast({
        title: "Error",
        description: "Failed to punch in. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-none shadow-md">
      <CardHeader>
        <CardTitle>Punch In</CardTitle>
        <CardDescription>Record attendance for employees</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
          <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
            <SelectTrigger className="w-full sm:w-[250px]">
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

          <Button onClick={handlePunchIn} disabled={loading || !selectedEmployee}>
            {loading ? "Processing..." : "Punch In"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
