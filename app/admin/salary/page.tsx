import { Suspense } from "react"
import { SalaryManagement } from "@/components/admin/salary/salary-management"
import { AdvanceManagement } from "@/components/admin/salary/advance-management"
import { MonthlyReport } from "@/components/admin/salary/monthly-report"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SalaryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Salary Management</h1>
      </div>

      <Tabs defaultValue="salary" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="salary">Salary Calculation</TabsTrigger>
          <TabsTrigger value="advances">Advances</TabsTrigger>
          <TabsTrigger value="reports">Monthly Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="salary" className="mt-0">
          <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
            <SalaryManagement />
          </Suspense>
        </TabsContent>

        <TabsContent value="advances" className="mt-0">
          <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
            <AdvanceManagement />
          </Suspense>
        </TabsContent>

        <TabsContent value="reports" className="mt-0">
          <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
            <MonthlyReport />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}
