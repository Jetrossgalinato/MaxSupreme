import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TypographyH2, TypographyMuted } from "@/components/ui/typography";
import { getMyTasks } from "./actions";
import { TasksTable } from "./tasks-table";
import { CreateTaskButton } from "./create-task-button";

export default async function EmployeeDashboardPage() {
  const { data: tasks } = await getMyTasks();

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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>My Tasks</CardTitle>
            <CreateTaskButton />
          </CardHeader>
          <CardContent>
            <TasksTable tasks={tasks || []} />
          </CardContent>
        </Card>

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
          <CardHeader>
            <CardTitle>Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Your shift ends at 5:00 PM.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
