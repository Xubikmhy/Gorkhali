"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { getEmployees, calculateSalaries, updateSalary } from "@/lib/firebase/salary"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Pencil } from "lucide-react"

export function SalaryManagement() {
  const [employees, setEmployees] = useState<any[]>([])
  const [salaries, setSalaries] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [calculating, setCalculating] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth().toString())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString())
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null)
  const [overrideAmount, setOverrideAmount] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const { toast } = useToast()

  const months = [
    { value: "0", label: "January" },
    { value: "1", label: "February" },
    { value: "2", label: "March" },
    { value: "3", label: "April" },
    { value: "4", label: "May" },
    { value: "5", label: "June" },
    { value: "6", label: "July" },
    { value: "7", label: "August" },
    { value: "8", label: "September" },
    { value: "9", label: "October" },
    { value: "10", label: "November" },
    { value: "11", label: "December" },
  ]

  const years = Array.from({ length: 5 }, (_, i) => {
    const year = new Date().getFullYear() - 2 + i
    return { value: year.toString(), label: year.toString() }
  })

  useEffect(() => {
    async function fetchEmployees() {
      setLoading(true)
      try {
        const employeesData = await getEmployees()
        setEmployees(employeesData)
      } catch (error) {
        console.error("Error fetching employees:", error)
        toast({
          title: "Error",
          description: "Failed to load employees. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchEmployees()
  }, [toast])

  const handleCalculateSalaries = async () => {
    setCalculating(true)
    try {
      const month = Number.parseInt(selectedMonth)
      const year = Number.parseInt(selectedYear)

      const calculatedSalaries = await calculateSalaries(month, year)
      setSalaries(calculatedSalaries)

      toast({
        title: "Success",
        description: "Salaries calculated successfully.",
      })
    } catch (error) {
      console.error("Error calculating salaries:", error)
      toast({
        title: "Error",
        description: "Failed to calculate salaries. Please try again.",
        variant: "destructive",
      })
    } finally {
      setCalculating(false)
    }
  }

  const openOverrideDialog = (employee: any) => {
    setSelectedEmployee(employee)
    setOverrideAmount(employee.basePay.toString())
    setDialogOpen(true)
  }

  const handleOverrideSalary = async () => {
    if (!selectedEmployee) return

    try {
      const amount = Number.parseFloat(overrideAmount)
      if (isNaN(amount) || amount < 0) {
        toast({
          title: "Invalid Amount",
          description: "Please enter a valid amount.",
          variant: "destructive",
        })
        return
      }

      const month = Number.parseInt(selectedMonth)
      const year = Number.parseInt(selectedYear)

      await updateSalary(selectedEmployee.id, month, year, amount)

      // Update the local state
      setSalaries(
        salaries.map((salary) =>
          salary.id === selectedEmployee.id
            ? { ...salary, basePay: amount, netPayable: amount - salary.advances }
            : salary,
        ),
      )

      toast({
        title: "Success",
        description: "Salary updated successfully.",
      })

      setDialogOpen(false)
    } catch (error) {
      console.error("Error updating salary:", error)
      toast({
        title: "Error",
        description: "Failed to update salary. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="border-none shadow-md">
      <CardHeader>
        <CardTitle>Salary Calculation</CardTitle>
        <CardDescription>Calculate and manage employee salaries</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-end sm:space-x-4 sm:space-y-0 mb-6">
          <div className="space-y-2">
            <Label htmlFor="month">Month</Label>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-full sm:w-[120px]">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year.value} value={year.value}>
                    {year.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleCalculateSalaries} disabled={calculating || loading} className="mt-4 sm:mt-0">
            {calculating ? "Calculating..." : "Calculate Salaries"}
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Salary Type</TableHead>
                <TableHead className="text-right">Base Pay</TableHead>
                <TableHead className="text-right">Advances</TableHead>
                <TableHead className="text-right">Net Payable</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    Loading employees...
                  </TableCell>
                </TableRow>
              ) : salaries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No salary data. Please calculate salaries for the selected month.
                  </TableCell>
                </TableRow>
              ) : (
                salaries.map((salary) => (
                  <TableRow key={salary.id}>
                    <TableCell className="font-medium">{salary.firstName}</TableCell>
                    <TableCell>{salary.department}</TableCell>
                    <TableCell>{salary.salaryType}</TableCell>
                    <TableCell className="text-right">${salary.basePay.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${salary.advances.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${salary.netPayable.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openOverrideDialog(salary)}
                        title="Override Salary"
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Override Salary</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Override Salary</DialogTitle>
            <DialogDescription>Update the base salary for {selectedEmployee?.firstName}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Salary Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={overrideAmount}
                onChange={(e) => setOverrideAmount(e.target.value)}
                placeholder="Enter amount"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleOverrideSalary}>Update Salary</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
