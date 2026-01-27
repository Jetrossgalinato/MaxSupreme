"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Task } from "@/types/tasks";

interface ExportTasksButtonProps {
  tasks: Task[];
}

export function ExportTasksButton({ tasks }: ExportTasksButtonProps) {
  const handleExport = () => {
    const headers = [
      "ID",
      "Title",
      "Priority",
      "Status",
      "Start Date",
      "End Date",
      "Milestone",
      "Notes",
      "Assigned To",
      "Created At",
    ];

    const csvContent = [
      headers.join(","),
      ...tasks.map((task) =>
        [
          task.id,
          `"${task.title?.replace(/"/g, '""') || ""}"`,
          task.priority,
          task.status,
          task.start_date || "",
          task.end_date || "",
          `"${task.milestone?.replace(/"/g, '""') || ""}"`,
          `"${task.notes?.replace(/"/g, '""') || ""}"`,
          task.assigned_to || "",
          task.created_at,
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `tasks_export_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button variant="outline" onClick={handleExport} className="gap-2">
      <Download className="h-4 w-4" />
      Export
    </Button>
  );
}
