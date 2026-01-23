import { getAllTasks } from "./actions";
import { getUsers } from "../users/actions";
import { EmployeeTasksView } from "./employee-tasks-view";
import { CreateTaskButton } from "./create-task-button";

export default async function TasksPage() {
  const { data: tasks } = await getAllTasks();
  const { users } = await getUsers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tasks Overview</h2>
          <p className="text-muted-foreground">
            Manage and assign tasks by employee.
          </p>
        </div>
        <CreateTaskButton users={users || []} />
      </div>

      <EmployeeTasksView tasks={tasks || []} users={users || []} />
    </div>
  );
}
