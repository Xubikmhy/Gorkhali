"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { MoreHorizontal } from "lucide-react"

type Department = {
  id: number
  name: string
  employee_count: number
}

export function DepartmentListNeon() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    async function fetchDepartments() {
      try {
        const response = await fetch("/api/departments")

        if (!response.ok) {
          throw new Error("Failed to fetch departments")
        }

        const data = await response.json()

        // Get employee counts
        const employeeResponse = await fetch("/api/employees")
        const employees = await employeeResponse.json()

        // Calculate employee counts per department
        const departmentsWithCounts = data.map((dept: any) => {
          const count = employees.filter((emp: any) => emp.department === dept.name).length
          return {
            ...dept,
            employee_count: count,
          }
        })

        setDepartments(departmentsWithCounts)
      } catch (error) {
        console.error("Error fetching departments:", error)
        toast({
          title: "Error",
          description: "Failed to load departments. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDepartments()
  }, [toast])

  return (
    <Card className="border-none shadow-md">
      <CardHeader>
        <CardTitle>Department Management (Neon)</CardTitle>
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4">
                    Loading departments...
                  </TableCell>
                </TableRow>
              ) : departments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4">
                    No departments found
                  </TableCell>
                </TableRow>
              ) : (
                departments.map((department) => (
                  <TableRow key={department.id}>
                    <TableCell className="font-medium">{department.name}</TableCell>
                    <TableCell>{department.employee_count}</TableCell>
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
                            disabled={department.employee_count > 0}
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
