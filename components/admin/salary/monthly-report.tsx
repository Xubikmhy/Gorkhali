"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { getSalaryReport, exportSalaryReportCSV } from "@/lib/firebase/salary"
import { Label } from "@/components/ui/label"
import { Download } from "lucide-react"

export function MonthlyReport() {
  const [report, setReport] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth().toString())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString())
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
    generateReport()
  }, [selectedMonth, selectedYear]) // eslint-disable-line react-hooks/exhaustive-deps

  const generateReport = async () => {
    setLoading(true)
    try {
      const month = Number.parseInt(selectedMonth)
      const year = Number.parseInt(selectedYear)

      const reportData = await getSalaryReport(month, year)
      setReport(reportData)
    } catch (error) {
      console.error("Error generating report:", error)
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleExportCSV = async () => {
    setExporting(true)
    try {
      const month = Number.parseInt(selectedMonth)
      const year = Number.parseInt(selectedYear)

      await exportSalaryReportCSV(month, year)

      toast({
        title: "Success",
        description: "Report exported successfully.",
      })
    } catch (error) {
      console.error("Error exporting report:", error)
      toast({
        title: "Error",
        description: "Failed to export report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setExporting(false)
    }
  }

  // Calculate totals
  const totals = report.reduce(
    (acc, item) => {
      acc.basePay += item.basePay
      acc.advances += item.advances
      acc.netPayable += item.netPayable
      return acc
    },
    { basePay: 0, advances: 0, netPayable: 0 },
  )

  return (
    <Card className="border-none shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Monthly Salary Report</CardTitle>
          <CardDescription>View and export monthly salary reports</CardDescription>
        </div>
        <Button
          onClick={handleExportCSV}
          disabled={exporting || loading || report.length === 0}
          className="flex items-center"
        >
          <Download className="mr-2 h-4 w-4" />
          {exporting ? "Exporting..." : "Export CSV"}
        </Button>
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

          <Button onClick={generateReport} disabled={loading} className="mt-4 sm:mt-0">
            {loading ? "Generating..." : "Generate Report"}
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead className="text-right">Base Pay</TableHead>
                <TableHead className="text-right">Advances</TableHead>
                <TableHead className="text-right">Net Payable</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Generating report...
                  </TableCell>
                </TableRow>
              ) : report.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No salary data for the selected month.
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {report.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.firstName}</TableCell>
                      <TableCell>{item.department}</TableCell>
                      <TableCell className="text-right">${item.basePay.toFixed(2)}</TableCell>
                      <TableCell className="text-right">${item.advances.toFixed(2)}</TableCell>
                      <TableCell className="text-right">${item.netPayable.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={2} className="font-bold text-right">
                      Totals:
                    </TableCell>
                    <TableCell className="font-bold text-right">${totals.basePay.toFixed(2)}</TableCell>
                    <TableCell className="font-bold text-right">${totals.advances.toFixed(2)}</TableCell>
                    <TableCell className="font-bold text-right">${totals.netPayable.toFixed(2)}</TableCell>
                  </TableRow>
                </>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
