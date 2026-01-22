"use server";

import { createClient } from "@/utils/supabase/server";
import { Task } from "@/types/tasks";

export async function getMyTasks(): Promise<{ success: boolean; data?: Task[]; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("assigned_to", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching tasks:", error);
    return { success: false, error: "Failed to fetch tasks" };
  }

  return { success: true, data: data as Task[] };
}
