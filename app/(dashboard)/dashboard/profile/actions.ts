"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfileAvatar(avatarUrl: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "User not authenticated" };
  }

  const { error } = await supabase.auth.updateUser({
    data: { avatar_url: avatarUrl },
  });

  if (error) {
    console.error("Error updating avatar:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/profile");
  return { success: true };
}

export async function updatePassword(
  prevState: { success?: boolean; error?: string; message?: string },
  formData: FormData,
) {
  const supabase = await createClient();

  const oldPassword = formData.get("oldPassword") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!oldPassword || !password || !confirmPassword) {
    return { success: false, error: "All fields are required." };
  }

  if (password !== confirmPassword) {
    return { success: false, error: "New passwords do not match." };
  }

  if (password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return { success: false, error: "User not authenticated." };
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: oldPassword,
  });

  if (signInError) {
    return { success: false, error: "Incorrect old password." };
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/profile");
  return { success: true, message: "Password updated successfully." };
}

export async function updateProfile(
  prevState: { success?: boolean; error?: string; message?: string },
  formData: FormData,
) {
  const supabase = await createClient();

  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;

  if (!firstName || !lastName) {
    return { success: false, error: "First name and last name are required." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "User not authenticated." };
  }

  const updates: {
    data: { first_name: string; last_name: string; full_name: string };
  } = {
    data: {
      first_name: firstName,
      last_name: lastName,
      full_name: `${firstName} ${lastName}`,
    },
  };

  const { error } = await supabase.auth.updateUser(updates);

  if (error) {
    console.error("Error updating profile:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/profile");

  return { success: true, message: "Profile updated successfully." };
}
