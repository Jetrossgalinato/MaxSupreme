"use client";

import { Task } from "@/types/tasks";
import { Badge } from "@/components/ui/badge"; // Assuming this exists or I'll use simple spans
import { cn } from "@/lib/utils";

interface TasksTableProps {
  tasks: Task[];
}

export function TasksTable({ tasks }: TasksTableProps) {
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Low': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'In Progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Blocked': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'Not Started': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="relative w-full overflow-auto rounded-md border">
      <table className="w-full caption-bottom text-sm">
        <thead className="[&_tr]:border-b">
          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Task</th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Priority</th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Start Date</th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">End Date</th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Milestone</th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Notes</th>
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {tasks.length === 0 ? (
            <tr>
              <td colSpan={7} className="p-4 text-center text-muted-foreground">
                No tasks found.
              </td>
            </tr>
          ) : (
            tasks.map((task) => (
              <tr
                key={task.id}
                className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
              >
                <td className="p-4 align-middle font-medium">{task.title}</td>
                <td className="p-4 align-middle">
                  <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", getPriorityColor(task.priority))}>
                    {task.priority}
                  </span>
                </td>
                <td className="p-4 align-middle">
                   <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", getStatusColor(task.status))}>
                    {task.status}
                  </span>
                </td>
                <td className="p-4 align-middle">
                  {task.start_date ? new Date(task.start_date).toLocaleDateString() : '-'}
                </td>
                <td className="p-4 align-middle">
                  {task.end_date ? new Date(task.end_date).toLocaleDateString() : '-'}
                </td>
                <td className="p-4 align-middle">{task.milestone || '-'}</td>
                <td className="p-4 align-middle max-w-[200px] truncate" title={task.notes || ''}>
                  {task.notes || '-'}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
