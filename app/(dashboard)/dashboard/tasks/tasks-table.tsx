"use client";

import { Task } from "@/types/tasks";
import { User } from "@supabase/supabase-js";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateTask, deleteTask } from "./actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Alert from "@/components/custom-alert";
import { DeleteConfirmationModal } from "@/app/(dashboard)/components/delete-confirmation-modal";

interface TasksTableProps {
  tasks: Task[];
  users: User[];
}

export function TasksTable({ tasks, users }: TasksTableProps) {
  const router = useRouter();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
  } | null>(null);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "Low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "In Progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "Blocked":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "Not Started":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getUserName = (userId: string | null) => {
    if (!userId) return "-";
    const user = users.find((u) => u.id === userId);
    if (!user) return "Unknown User";
    return (
      user.user_metadata?.full_name ||
      `${user.user_metadata?.first_name || ""} ${user.user_metadata?.last_name || ""}`.trim() ||
      user.email ||
      "Unknown User"
    );
  };

  const handleDeleteClick = (task: Task) => {
    setDeletingTask(task);
  };

  const confirmDelete = async () => {
    if (!deletingTask) return;

    setIsLoading(true);
    const result = await deleteTask(deletingTask.id);
    setIsLoading(false);

    if (result.success) {
      setDeletingTask(null);
      setAlert({
        type: "success",
        title: "Success",
        message: "Task deleted successfully",
      });
      router.refresh();
    } else {
      setAlert({
        type: "error",
        title: "Error",
        message: result.error || "Failed to delete task",
      });
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingTask) return;

    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await updateTask(editingTask.id, formData);
    setIsLoading(false);

    if (result.success) {
      setEditingTask(null);
      setAlert({
        type: "success",
        title: "Success",
        message: "Task updated successfully",
      });
      router.refresh();
    } else {
      setAlert({
        type: "error",
        title: "Error",
        message: result.error || "Failed to update task",
      });
    }
  };

  return (
    <>
      {alert && (
        <Alert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
      <div className="relative w-full overflow-auto rounded-md border">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b">
            <tr className="border-b transition-colors data-[state=selected]:bg-muted">
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Task
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Assigned To
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Priority
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Status
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Start Date
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                End Date
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Milestone
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Notes
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {tasks.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="p-4 text-center text-muted-foreground"
                >
                  No tasks found.
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr
                  key={task.id}
                  className="border-b transition-colors data-[state=selected]:bg-muted"
                >
                  <td className="p-4 align-middle font-medium">{task.title}</td>
                  <td className="p-4 align-middle">
                    {getUserName(task.assigned_to)}
                  </td>
                  <td className="p-4 align-middle">
                    <Badge
                      className={cn(
                        "font-semibold border-0",
                        getPriorityColor(task.priority),
                      )}
                    >
                      {task.priority}
                    </Badge>
                  </td>
                  <td className="p-4 align-middle">
                    <Badge
                      className={cn(
                        "font-semibold border-0",
                        getStatusColor(task.status),
                      )}
                    >
                      {task.status}
                    </Badge>
                  </td>
                  <td className="p-4 align-middle">
                    {task.start_date
                      ? new Date(task.start_date).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="p-4 align-middle">
                    {task.end_date
                      ? new Date(task.end_date).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="p-4 align-middle">{task.milestone || "-"}</td>
                  <td className="p-4 align-middle">{task.notes || "-"}</td>
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingTask(task)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => handleDeleteClick(task)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-background border rounded-lg shadow-lg w-full max-w-lg p-6 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Edit Task</h3>
              <button
                onClick={() => setEditingTask(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Task Title</Label>
                <Input
                  id="title"
                  name="title"
                  required
                  defaultValue={editingTask.title}
                  placeholder="Enter task title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="assigned_to">Assign To</Label>
                <select
                  id="assigned_to"
                  name="assigned_to"
                  defaultValue={editingTask.assigned_to || ""}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Unassigned</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.user_metadata?.full_name || user.email}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <select
                    id="priority"
                    name="priority"
                    defaultValue={editingTask.priority}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    name="status"
                    defaultValue={editingTask.status}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Blocked">Blocked</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    name="start_date"
                    type="date"
                    defaultValue={
                      editingTask.start_date
                        ? new Date(editingTask.start_date)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    name="end_date"
                    type="date"
                    defaultValue={
                      editingTask.end_date
                        ? new Date(editingTask.end_date)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="milestone">Milestone</Label>
                <Input
                  id="milestone"
                  name="milestone"
                  defaultValue={editingTask.milestone || ""}
                  placeholder="e.g. Q1 Release"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <textarea
                  id="notes"
                  name="notes"
                  defaultValue={editingTask.notes || ""}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Additional details..."
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingTask(null)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Updating..." : "Update Task"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={!!deletingTask}
        onClose={() => setDeletingTask(null)}
        onConfirm={confirmDelete}
        isLoading={isLoading}
        title="Delete Task"
        description={
          deletingTask ? (
            <>
              Are you sure you want to delete{" "}
              <span className="font-medium text-foreground">
                {deletingTask.title}
              </span>
              ? This action cannot be undone.
            </>
          ) : undefined
        }
      />
    </>
  );
}
