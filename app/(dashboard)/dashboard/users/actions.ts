"use server";

import { createAdminClient } from "@/utils/supabase/admin";
import { revalidatePath } from "next/cache";
import { UserRole } from "@/types/roles";

export async function getUsers() {
  try {
    const supabase = createAdminClient();
    const {
      data: { users },
      error,
    } = await supabase.auth.admin.listUsers();

    if (error) {
      console.error("Error fetching users:", error);
      return { success: false, error: error.message };
    }

    return { success: true, users };
  } catch (error) {
    console.error("Failed to get users:", error);
    return { success: false, error: "Failed to fetch users" };
  }
}

export async function updateUser(
  userId: string,
  data: { firstName?: string; lastName?: string; role?: UserRole },
) {
  try {
    const supabase = createAdminClient();

    const updates: {
      first_name?: string;
      last_name?: string;
      full_name?: string;
      role?: UserRole;
    } = {};

    if (data.firstName) updates.first_name = data.firstName;
    if (data.lastName) updates.last_name = data.lastName;

    // Combine names for full path if both present (optional logic depending on how full_name is used)
    if (data.firstName && data.lastName) {
      updates.full_name = `${data.firstName} ${data.lastName}`;
    }

    if (data.role) updates.role = data.role;

    const { data: user, error } = await supabase.auth.admin.updateUserById(
      userId,
      { user_metadata: updates },
    );

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard/users");
    return { success: true, user };
  } catch (error) {
    return { success: false, error: "Failed to update user" };
  }
}

export async function deleteUser(userId: string) {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.auth.admin.deleteUser(userId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard/users");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete user" };
  }
}
