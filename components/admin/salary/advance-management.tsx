"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { getEmployees, getAdvances, addAdvance, updateAdvance, deleteAdvance } from "@/lib/firebase/salary"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, Pencil, Trash2 } from "lucide-react"

export function AdvanceManagement() {
  const [employees, setEmployees] = useState<any[]>([])
  const [advances, setAdvances] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [alertDialogOpen, setAlertDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedAdvance, setSelectedAdvance] = useState<any>(null)

  // Form state
  const [employeeId, setEmployeeId] = useState("")
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])

  const { toast } = useToast()

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const [employeesData, advancesData] = await Promise.all([getEmployees(), getAdvances()])

        setEmployees(employeesData)
        setAdvances(advancesData)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [toast])

  const resetForm = () => {
    setEmployeeId("")
    setAmount("")
    setDate(new Date().toISOString().split("T")[0])
    setIsEditing(false)
    setSelectedAdvance(null)
  }

  const openAddDialog = () => {
    resetForm()
    setDialogOpen(true)
  }

  const openEditDialog = (advance: any) => {
    setSelectedAdvance(advance)
    setEmployeeId(advance.employeeId)
    setAmount(advance.amount.toString())
    setDate(advance.date.split("T")[0])
    setIsEditing(true)
    setDialogOpen(true)
  }

  const openDeleteDialog = (advance: any) => {
    setSelectedAdvance(advance)
    setAlertDialogOpen(true)
  }

  const handleSubmit = async () => {
    try {
      if (!employeeId || !amount || !date) {
        toast({
          title: "Missing Fields",
          description: "Please fill in all required fields.",
          variant: "destructive",
        })
        return
      }

      const advanceData = {
        employeeId,
        amount: Number.parseFloat(amount),
        date,
      }

      if (isEditing && selectedAdvance) {
        await updateAdvance(selectedAdvance.id, advanceData)

        // Update local state
        setAdvances(
          advances.map((adv) =>
            adv.id === selectedAdvance.id
              ? {
                  ...adv,
                  ...advanceData,
                  employeeName: employees.find((e) => e.id === employeeId)?.firstName || "Unknown",
                }
              : adv,
          ),
        )

        toast({
          title: "Success",
          description: "Advance updated successfully.",
        })
      } else {
        const newAdvance = await addAdvance(advanceData)

        // Update local state
        setAdvances([
          ...advances,
          {
            ...newAdvance,
            employeeName: employees.find((e) => e.id === employeeId)?.firstName || "Unknown",
          },
        ])

        toast({
          title: "Success",
          description: "Advance added successfully.",
        })
      }

      setDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Error saving advance:", error)
      toast({
        title: "Error",
        description: "Failed to save advance. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    if (!selectedAdvance) return

    try {
      await deleteAdvance(selectedAdvance.id)

      // Update local state
      setAdvances(advances.filter((adv) => adv.id !== selectedAdvance.id))

      toast({
        title: "Success",
        description: "Advance deleted successfully.",
      })

      setAlertDialogOpen(false)
    } catch (error) {
      console.error("Error deleting advance:", error)
      toast({
        title: "Error",
        description: "Failed to delete advance. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Calculate total advances
  const totalAdvances = advances.reduce((sum, advance) => sum + advance.amount, 0)

  return (
    <Card className="border-none shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Advances</CardTitle>
          <CardDescription>Manage employee advances</CardDescription>
        </div>
        <Button onClick={openAddDialog} className="rounded-full h-10 w-10 p-0">
          <Plus className="h-5 w-5" />
          <span className="sr-only">Add Advance</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Loading advances...
                  </TableCell>
                </TableRow>
              ) : advances.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No advances found. Click the + button to add an advance.
                  </TableCell>
                </TableRow>
              ) : (
                advances.map((advance) => (
                  <TableRow key={advance.id}>
                    <TableCell className="font-medium">{advance.employeeName}</TableCell>
                    <TableCell>{advance.department}</TableCell>
                    <TableCell className="text-right">${advance.amount.toFixed(2)}</TableCell>
                    <TableCell>{new Date(advance.date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(advance)}
                          title="Edit Advance"
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteDialog(advance)}
                          title="Delete Advance"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
              {advances.length > 0 && (
                <TableRow>
                  <TableCell colSpan={2} className="font-bold text-right">
                    Total Advances:
                  </TableCell>
                  <TableCell className="font-bold text-right">${totalAdvances.toFixed(2)}</TableCell>
                  <TableCell colSpan={2}></TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Add/Edit Advance Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Advance" : "Add Advance"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Update the advance details" : "Enter the details for the new advance"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="employee">Employee</Label>
              <Select value={employeeId} onValueChange={setEmployeeId}>
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
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>{isEditing ? "Update" : "Add"} Advance</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the advance for {selectedAdvance?.employeeName}. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
