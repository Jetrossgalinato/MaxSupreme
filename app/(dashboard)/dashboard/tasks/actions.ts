"use server";

import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { Task } from "@/types/tasks";
import { revalidatePath } from "next/cache";

export async function getAllTasks(): Promise<{ success: boolean; data?: Task[]; error?: string }> {
  // 1. Verify the user is authenticated and is an admin
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "Unauthorized" };
  }

  // Check role
  const role = user.user_metadata?.role;
  if (role !== 'admin') {
     return { success: false, error: "Forbidden: Admin access required" };
  }

  // 2. Use Admin Client to fetch ALL tasks (bypassing RLS)
  const adminClient = createAdminClient();
  const { data, error } = await adminClient
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
  // 1. Verify admin access
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) return { success: false, error: "Unauthorized" };
  if (user.user_metadata?.role !== 'admin') return { success: false, error: "Forbidden" };

  // 2. Use Admin Client for the write operation
  const adminClient = createAdminClient();

  const title = formData.get("title") as string;
  const priority = formData.get("priority") as string;
  const status = formData.get("status") as string;
  const startDate = formData.get("start_date") as string || null;
  const endDate = formData.get("end_date") as string || null;
  const milestone = formData.get("milestone") as string || null;
  const notes = formData.get("notes") as string || null;
  const assignedTo = formData.get("assigned_to") as string || null;

  const { error } = await adminClient
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
  // 1. Verify admin access
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) return { success: false, error: "Unauthorized" };
  if (user.user_metadata?.role !== 'admin') return { success: false, error: "Forbidden" };

  // 2. Use Admin Client for the write operation
  const adminClient = createAdminClient();

  const title = formData.get("title") as string;
  const priority = formData.get("priority") as string;
  const status = formData.get("status") as string;
  const startDate = formData.get("start_date") as string || null;
  const endDate = formData.get("end_date") as string || null;
  const milestone = formData.get("milestone") as string || null;
  const notes = formData.get("notes") as string || null;
  const assignedTo = formData.get("assigned_to") as string || null;

  const { error } = await adminClient
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
  // 1. Verify admin access
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) return { success: false, error: "Unauthorized" };
  if (user.user_metadata?.role !== 'admin') return { success: false, error: "Forbidden" };

  // 2. Use Admin Client for the write operation
  const adminClient = createAdminClient();

  const { error } = await adminClient
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
