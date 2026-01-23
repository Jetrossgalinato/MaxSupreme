import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TypographyH2, TypographyMuted } from "@/components/ui/typography";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { getMyTasks } from "./actions";
import { TasksTable } from "./tasks-table";
import { CreateTaskButton } from "./create-task-button";

export default async function EmployeeDashboardPage() {
  const { data: tasks } = await getMyTasks();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="p-4 space-y-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <TypographyH2>Employee Dashboard</TypographyH2>
          <TypographyMuted>
            Welcome back. Here is your daily overview.
          </TypographyMuted>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Announcements</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No new announcements.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Schedule</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="text-center mb-4">
              <div className="text-xl font-bold">Weekdays</div>
              <p className="text-xs text-muted-foreground">
                10:00 PM - 2:00 AM
              </p>
            </div>
            <Calendar
              mode="single"
              selected={today}
              className="rounded-md border shadow-sm"
              disabled={[{ before: today }]}
            />
          </CardContent>
        </Card>

        <Card className="col-span-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>My Tasks</CardTitle>
            <CreateTaskButton />
          </CardHeader>
          <CardContent>
            <TasksTable tasks={tasks || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
