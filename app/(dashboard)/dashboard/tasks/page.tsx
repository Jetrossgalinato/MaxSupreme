import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getAllTasks } from "./actions";
import { getUsers } from "../users/actions";
import { TasksTable } from "./tasks-table";
import { CreateTaskButton } from "./create-task-button";

export default async function TasksPage() {
  const { data: tasks } = await getAllTasks();
  const { users } = await getUsers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tasks</h2>
          <p className="text-muted-foreground">
            Manage and assign tasks to team members.
          </p>
        </div>
        <CreateTaskButton users={users || []} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <TasksTable tasks={tasks || []} users={users || []} />
        </CardContent>
      </Card>
    </div>
  );
}
