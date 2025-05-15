import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock } from "lucide-react"

export default function EmployeeDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Employee Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Current Status</p>
                  <p className="text-sm text-green-600 font-medium">Punched In</p>
                </div>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Clock className="mr-2 h-4 w-4" />
                  Punch Out
                </Button>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last punch in: Today at 9:00 AM</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Design new brochure</p>
                  <p className="text-sm text-muted-foreground">Due: May 20, 2025</p>
                </div>
                <Button variant="outline" size="sm">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Complete
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Update website content</p>
                  <p className="text-sm text-muted-foreground">Due: May 25, 2025</p>
                </div>
                <Button variant="outline" size="sm">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Complete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Announcements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">New Schedule Starting Next Week</h3>
                <p className="text-sm text-muted-foreground">Posted on May 14, 2025</p>
                <p className="text-sm">
                  We will be implementing a new work schedule starting next Monday. Please check your email for details.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Office Closed for Holiday</h3>
                <p className="text-sm text-muted-foreground">Posted on May 10, 2025</p>
                <p className="text-sm">
                  The office will be closed on May 30th for the holiday. Enjoy your long weekend!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
