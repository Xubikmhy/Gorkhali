"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getEmployees, getDepartments, updateEmployee } from "@/lib/firebase/firestore"
import { MoreHorizontal, Search } from "lucide-react"

export function EmployeeList() {
  const [employees, setEmployees] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [filteredEmployees, setFilteredEmployees] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      try {
        const [employeesData, departmentsData] = await Promise.all([getEmployees(), getDepartments()])

        setEmployees(employeesData)
        setFilteredEmployees(employeesData)
        setDepartments(departmentsData)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    let filtered = [...employees]

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((employee) => employee.firstName.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    // Apply department filter
    if (departmentFilter !== "all") {
      filtered = filtered.filter((employee) => employee.department === departmentFilter)
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((employee) => employee.status === statusFilter)
    }

    setFilteredEmployees(filtered)
  }, [searchQuery, departmentFilter, statusFilter, employees])

  const handleStatusChange = async (employeeId: string, newStatus: string) => {
    try {
      await updateEmployee(employeeId, { status: newStatus })

      // Update local state
      setEmployees((prevEmployees) =>
        prevEmployees.map((employee) => (employee.id === employeeId ? { ...employee, status: newStatus } : employee)),
      )
    } catch (error) {
      console.error("Error updating employee status:", error)
    }
  }

  return (
    <Card className="border-none shadow-md">
      <CardHeader>
        <CardTitle>Employee Management</CardTitle>
        <CardDescription>Manage your employees, their departments, and status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
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
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Employment</TableHead>
                <TableHead>Salary Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No employees found
                  </TableCell>
                </TableRow>
              ) : (
                filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.firstName}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>
                      <Badge variant={employee.status === "Active" ? "default" : "secondary"}>{employee.status}</Badge>
                    </TableCell>
                    <TableCell>{employee.employmentType}</TableCell>
                    <TableCell>{employee.salaryType}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => router.push(`/admin/employees/edit/${employee.id}`)}>
                            Edit Employee
                          </DropdownMenuItem>
                          {employee.status === "Active" ? (
                            <DropdownMenuItem onClick={() => handleStatusChange(employee.id, "Inactive")}>
                              Deactivate
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handleStatusChange(employee.id, "Active")}>
                              Activate
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
