import { Suspense } from "react"
import { AttendanceList } from "@/components/admin/attendance-list"
import { AttendancePunchIn } from "@/components/admin/attendance-punch-in"
import { Skeleton } from "@/components/ui/skeleton"

export default function AttendancePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
      </div>

      <Suspense fallback={<Skeleton className="h-[200px] w-full" />}>
        <AttendancePunchIn />
      </Suspense>

      <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
        <AttendanceList />
      </Suspense>
    </div>
  )
}
