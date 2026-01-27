"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download } from "lucide-react";
import { Task } from "@/types/tasks";
import * as XLSX from "xlsx";
import { User } from "@supabase/supabase-js";

interface ExportTasksButtonProps {
  tasks: Task[];
  users: User[];
}

export function ExportTasksButton({ tasks, users }: ExportTasksButtonProps) {
  const getUserName = (userId: string | null) => {
    if (!userId) return "";
    const user = users.find((u) => u.id === userId);
    if (!user) return userId;
    const { first_name, last_name } = user.user_metadata || {};
    return first_name && last_name
      ? `${first_name} ${last_name}`
      : user.email || userId;
  };

  const prepareData = () => {
    return tasks.map((task) => ({
      Title: task.title,
      Priority: task.priority,
      Status: task.status,
      "Start Date": task.start_date || "",
      "End Date": task.end_date || "",
      Milestone: task.milestone || "",
      Notes: task.notes || "",
      "Assigned To": getUserName(task.assigned_to),
      "Created At": task.created_at,
    }));
  };

  const handleExportCSV = () => {
    const headers = [
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
          `"${task.title?.replace(/"/g, '""') || ""}"`,
          task.priority,
          task.status,
          task.start_date || "",
          task.end_date || "",
          `"${task.milestone?.replace(/"/g, '""') || ""}"`,
          `"${task.notes?.replace(/"/g, '""') || ""}"`,
          `"${getUserName(task.assigned_to).replace(/"/g, '""')}"`,
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

  const handleExportExcel = () => {
    const data = prepareData();
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");
    XLSX.writeFile(
      workbook,
      `tasks_export_${new Date().toISOString().split("T")[0]}.xlsx`,
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleExportExcel}>
          Export to Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportCSV}>
          Export to CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
