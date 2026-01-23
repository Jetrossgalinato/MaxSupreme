"use server";

import { createClient } from "@/utils/supabase/server";
import { Task } from "@/types/tasks";
import { revalidatePath } from "next/cache";

export async function getAllTasks(): Promise<{ success: boolean; data?: Task[]; error?: string }> {
  const supabase = await createClient();
  
  // RLS policy "Admins can view all tasks" should handle permission check
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching tasks:", error);
    return { success: false, error: "Failed to fetch tasks" };
  }

  return { success: true, data: data as Task[] };
}

export async function createTask(formData: FormData): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const priority = formData.get("priority") as string;
  const status = formData.get("status") as string;
  const startDate = formData.get("start_date") as string || null;
  const endDate = formData.get("end_date") as string || null;
  const milestone = formData.get("milestone") as string || null;
  const notes = formData.get("notes") as string || null;
  const assignedTo = formData.get("assigned_to") as string || null;

  const { error } = await supabase
    .from("tasks")
    .insert({
      title,
      priority,
      status,
      start_date: startDate,
      end_date: endDate,
      milestone,
      notes,
      assigned_to: assignedTo,
    });

  if (error) {
    console.error("Error creating task:", error);
    return { success: false, error: "Failed to create task: " + error.message };
  }
  
  revalidatePath("/dashboard/tasks");
  return { success: true };
}

export async function updateTask(taskId: string, formData: FormData): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const priority = formData.get("priority") as string;
  const status = formData.get("status") as string;
  const startDate = formData.get("start_date") as string || null;
  const endDate = formData.get("end_date") as string || null;
  const milestone = formData.get("milestone") as string || null;
  const notes = formData.get("notes") as string || null;
  const assignedTo = formData.get("assigned_to") as string || null;

  const { error } = await supabase
    .from("tasks")
    .update({
      title,
      priority,
      status,
      start_date: startDate,
      end_date: endDate,
      milestone,
      notes,
      assigned_to: assignedTo,
    })
    .eq("id", taskId);

  if (error) {
    console.error("Error updating task:", error);
    return { success: false, error: "Failed to update task: " + error.message };
  }

  revalidatePath("/dashboard/tasks");
  return { success: true };
}

export async function deleteTask(taskId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", taskId);

  if (error) {
    console.error("Error deleting task:", error);
    return { success: false, error: "Failed to delete task: " + error.message };
  }

  revalidatePath("/dashboard/tasks");
  return { success: true };
}
