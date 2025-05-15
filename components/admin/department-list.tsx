"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { getDepartments, getEmployees } from "@/lib/firebase/firestore"
import { MoreHorizontal } from "lucide-react"

export function DepartmentList() {
  const [departments, setDepartments] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      try {
        const [departmentsData, employeesData] = await Promise.all([getDepartments(), getEmployees()])

        setDepartments(departmentsData)
        setEmployees(employeesData)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [])

  // Count employees in each department
  const departmentsWithCounts = departments.map((department) => {
    const count = employees.filter((employee) => employee.department === department.name).length

    return {
      ...department,
      employeeCount: count,
    }
  })

  return (
    <Card className="border-none shadow-md">
      <CardHeader>
        <CardTitle>Department Management</CardTitle>
        <CardDescription>Manage your departments and see how many employees are in each</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department Name</TableHead>
                <TableHead>Employees</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departmentsWithCounts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4">
                    No departments found
                  </TableCell>
                </TableRow>
              ) : (
                departmentsWithCounts.map((department) => (
                  <TableRow key={department.id}>
                    <TableCell className="font-medium">{department.name}</TableCell>
                    <TableCell>{department.employeeCount}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => router.push(`/admin/departments/edit/${department.id}`)}>
                            Edit Department
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            disabled={department.employeeCount > 0}
                            onClick={() => {
                              // Delete department logic would go here
                              // Only enabled if no employees are in the department
                            }}
                          >
                            Delete Department
                          </DropdownMenuItem>
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
