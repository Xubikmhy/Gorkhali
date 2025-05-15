import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DepartmentList } from "@/components/admin/department-list"
import { Skeleton } from "@/components/ui/skeleton"
import { FolderPlus } from "lucide-react"

export default function DepartmentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Departments</h1>
        <Button asChild>
          <Link href="/admin/departments/new">
            <FolderPlus className="mr-2 h-4 w-4" />
            Add Department
          </Link>
        </Button>
      </div>

      <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
        <DepartmentList />
      </Suspense>
    </div>
  )
}
