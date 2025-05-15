"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { getTasks, getEmployees, updateTask } from "@/lib/firebase/firestore"
import { MoreHorizontal, Search } from "lucide-react"

export function TaskList() {
  const [tasks, setTasks] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])
  const [filteredTasks, setFilteredTasks] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [employeeFilter, setEmployeeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      try {
        const [tasksData, employeesData] = await Promise.all([getTasks(), getEmployees()])

        setTasks(tasksData)
        setFilteredTasks(tasksData)
        setEmployees(employeesData)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    let filtered = [...tasks]

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((task) => task.title.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    // Apply employee filter
    if (employeeFilter !== "all") {
      filtered = filtered.filter((task) => task.employeeId === employeeFilter)
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((task) => task.status === statusFilter)
    }

    setFilteredTasks(filtered)
  }, [searchQuery, employeeFilter, statusFilter, tasks])

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      await updateTask(taskId, { status: newStatus })

      // Update local state
      setTasks((prevTasks) => prevTasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)))
    } catch (error) {
      console.error("Error updating task status:", error)
    }
  }

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find((emp) => emp.id === employeeId)
    return employee ? employee.firstName : "Unknown"
  }

  const getStatusBadge = (status: string, dueDate: string) => {
    const isOverdue = new Date(dueDate) < new Date() && status !== "Completed"

    if (isOverdue) {
      return <Badge variant="destructive">Overdue</Badge>
    }

    switch (status) {
      case "Pending":
        return <Badge variant="secondary">Pending</Badge>
      case "In Progress":
        return <Badge variant="default">In Progress</Badge>
      case "Completed":
        return (
          <Badge variant="success" className="bg-green-500">
            Completed
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <Card className="border-none shadow-md">
      <CardHeader>
        <CardTitle>Task Management</CardTitle>
        <CardDescription>Manage tasks assigned to employees</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={employeeFilter} onValueChange={setEmployeeFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Employee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Employees</SelectItem>
              {employees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id}>
                  {employee.firstName}
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
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No tasks found
                  </TableCell>
                </TableRow>
              ) : (
                filteredTasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.title}</TableCell>
                    <TableCell>{getEmployeeName(task.employeeId)}</TableCell>
                    <TableCell>{new Date(task.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(task.status, task.dueDate)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => router.push(`/admin/tasks/edit/${task.id}`)}>
                            Edit Task
                          </DropdownMenuItem>
                          {task.status !== "Completed" && (
                            <DropdownMenuItem onClick={() => handleStatusChange(task.id, "Completed")}>
                              Mark as Completed
                            </DropdownMenuItem>
                          )}
                          {task.status === "Pending" && (
                            <DropdownMenuItem onClick={() => handleStatusChange(task.id, "In Progress")}>
                              Mark as In Progress
                            </DropdownMenuItem>
                          )}
                          {task.status === "In Progress" && (
                            <DropdownMenuItem onClick={() => handleStatusChange(task.id, "Pending")}>
                              Mark as Pending
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
