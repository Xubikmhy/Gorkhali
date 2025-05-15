"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { getEmployees, getDepartments } from "@/lib/firebase/firestore"

export function AttendanceList() {
  const [employees, setEmployees] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split("T")[0])
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const { toast } = useToast()

  // Sample attendance data for demonstration
  const attendanceData = [
    {
      id: "1",
      employeeId: "emp1",
      employeeName: "John",
      department: "Printing",
      date: new Date().toISOString().split("T")[0],
      punchInTime: "08:30 AM",
      punchOutTime: "05:30 PM",
      hours: 9,
    },
    {
      id: "2",
      employeeId: "emp2",
      employeeName: "Sarah",
      department: "Design",
      date: new Date().toISOString().split("T")[0],
      punchInTime: "09:00 AM",
      punchOutTime: "06:00 PM",
      hours: 9,
    },
    {
      id: "3",
      employeeId: "emp3",
      employeeName: "Mike",
      department: "Binding",
      date: new Date().toISOString().split("T")[0],
      punchInTime: "08:45 AM",
      punchOutTime: "05:45 PM",
      hours: 9,
    },
  ]

  useEffect(() => {
    async function fetchData() {
      try {
        const [employeesData, departmentsData] = await Promise.all([getEmployees(), getDepartments()])

        setEmployees(employeesData)
        setDepartments(departmentsData)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive",
        })
      }
    }

    fetchData()
  }, [toast])

  // Filter attendance data based on date and department
  const filteredAttendance = attendanceData.filter((record) => {
    const dateMatch = record.date === dateFilter
    const departmentMatch = departmentFilter === "all" || record.department === departmentFilter

    return dateMatch && departmentMatch
  })

  // Calculate total hours for the filtered records
  const totalHours = filteredAttendance.reduce((sum, record) => sum + record.hours, 0)

  return (
    <Card className="border-none shadow-md">
      <CardHeader>
        <CardTitle>Attendance Records</CardTitle>
        <CardDescription>View and filter attendance records</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0 mb-4">
          <div className="space-y-2 sm:space-y-0">
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full sm:w-[200px]"
            />
          </div>

          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((department) => (
                <SelectItem key={department.id} value={department.name}>
                  {department.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline">Export CSV</Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Punch In</TableHead>
                <TableHead>Punch Out</TableHead>
                <TableHead>Hours</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAttendance.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No attendance records found
                  </TableCell>
                </TableRow>
              ) : (
                filteredAttendance.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.employeeName}</TableCell>
                    <TableCell>{record.department}</TableCell>
                    <TableCell>{record.punchInTime}</TableCell>
                    <TableCell>{record.punchOutTime || "Not punched out"}</TableCell>
                    <TableCell>{record.hours.toFixed(2)}</TableCell>
                  </TableRow>
                ))
              )}
              {filteredAttendance.length > 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-right font-medium">
                    Total Hours:
                  </TableCell>
                  <TableCell className="font-bold">{totalHours.toFixed(2)}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
