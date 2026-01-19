"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function login(
  prevState: { error: string; timestamp?: number },
  formData: FormData,
) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message, timestamp: Date.now() };
  }

  revalidatePath("/", "layout");

  const role = data.user?.user_metadata?.role;
  if (role === "admin") {
    redirect("/dashboard?message=Logged+in+successfully");
  } else {
    redirect("/?message=Logged+in+successfully");
  }
}

export async function signup(
  prevState: { error: string; timestamp?: number },
  formData: FormData,
) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirm-password") as string;
  const firstName = formData.get("first-name") as string;
  const lastName = formData.get("last-name") as string;

  if (password !== confirmPassword) {
    return { error: "Passwords do not match", timestamp: Date.now() };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        role: "member", // Default role
      },
    },
  });

  if (error) {
    return { error: error.message, timestamp: Date.now() };
  }

  revalidatePath("/", "layout");
  redirect("/login?message=Account created successfully");
}

export async function signout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login?message=Logged out successfully");
}
