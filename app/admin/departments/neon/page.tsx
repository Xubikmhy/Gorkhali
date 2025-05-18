import { DepartmentListNeon } from "@/components/admin/department-list-neon"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FolderPlus } from "lucide-react"

export default function DepartmentsNeonPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Departments (Neon)</h1>
        <Button asChild>
          <Link href="/admin/departments/new">
            <FolderPlus className="mr-2 h-4 w-4" />
            Add Department
          </Link>
        </Button>
      </div>

      <DepartmentListNeon />
    </div>
  )
}
