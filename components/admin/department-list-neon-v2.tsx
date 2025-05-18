"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { MoreHorizontal, Loader2 } from "lucide-react"
import { fetchDepartmentsWithEmployeeCount, removeDepartment } from "@/app/actions/departments"

type Department = {
  id: number
  name: string
  employee_count: number
  created_at: string
}

export function DepartmentListNeonV2() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<number | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    async function loadDepartments() {
      try {
        setLoading(true)
        const result = await fetchDepartmentsWithEmployeeCount()

        if (result.success) {
          setDepartments(result.data)
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to load departments",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error loading departments:", error)
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadDepartments()
  }, [toast])

  const handleDelete = async (id: number) => {
    try {
      setDeleting(id)
      const result = await removeDepartment(id)

      if (result.success) {
        setDepartments(departments.filter((dept) => dept.id !== id))
        toast({
          title: "Success",
          description: "Department deleted successfully",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete department",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting department:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setDeleting(null)
    }
  }

  return (
    <Card className="border-none shadow-md">
      <CardHeader>
        <CardTitle>Department Management (Neon v2)</CardTitle>
        <CardDescription>Manage your departments and see how many employees are in each</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department Name</TableHead>
                <TableHead>Employees</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    <div className="flex justify-center items-center">
                      <Loader2 className="h-6 w-6 animate-spin mr-2" />
                      Loading departments...
                    </div>
                  </TableCell>
                </TableRow>
              ) : departments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    No departments found
                  </TableCell>
                </TableRow>
              ) : (
                departments.map((department) => (
                  <TableRow key={department.id}>
                    <TableCell className="font-medium">{department.name}</TableCell>
                    <TableCell>{department.employee_count}</TableCell>
                    <TableCell>{new Date(department.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            {deleting === department.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <MoreHorizontal className="h-4 w-4" />
                            )}
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => router.push(`/admin/departments/edit/${department.id}`)}>
                            Edit Department
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            disabled={department.employee_count > 0 || deleting !== null}
                            onClick={() => handleDelete(department.id)}
                            className={department.employee_count > 0 ? "text-muted-foreground" : "text-destructive"}
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
