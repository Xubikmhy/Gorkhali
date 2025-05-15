import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { EmployeeList } from "@/components/admin/employee-list"
import { Skeleton } from "@/components/ui/skeleton"
import { UserPlus } from "lucide-react"

export default function EmployeesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
        <Button asChild>
          <Link href="/admin/employees/new">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Employee
          </Link>
        </Button>
      </div>

      <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
        <EmployeeList />
      </Suspense>
    </div>
  )
}
