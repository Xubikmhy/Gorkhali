import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TaskList } from "@/components/admin/task-list"
import { Skeleton } from "@/components/ui/skeleton"
import { ClipboardPlus } from "lucide-react"

export default function TasksPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
        <Button asChild>
          <Link href="/admin/tasks/new">
            <ClipboardPlus className="mr-2 h-4 w-4" />
            Create Task
          </Link>
        </Button>
      </div>

      <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
        <TaskList />
      </Suspense>
    </div>
  )
}
