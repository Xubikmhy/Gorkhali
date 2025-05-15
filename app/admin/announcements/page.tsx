import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AnnouncementList } from "@/components/admin/announcement-list"
import { Skeleton } from "@/components/ui/skeleton"
import { Bell } from "lucide-react"

export default function AnnouncementsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
        <Button asChild>
          <Link href="/admin/announcements/new">
            <Bell className="mr-2 h-4 w-4" />
            Post Announcement
          </Link>
        </Button>
      </div>

      <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
        <AnnouncementList />
      </Suspense>
    </div>
  )
}
