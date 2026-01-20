"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteDocument(id: string, filePath: string) {
  const supabase = await createClient();

  try {
    // 1. Delete from Storage
    const { error: storageError } = await supabase.storage
      .from("documents")
      .remove([filePath]);

    if (storageError) {
      // If file not found in storage, we might still want to delete the record
      console.error("Storage delete error:", storageError);
    }

    // 2. Delete from Database
    const { error: dbError } = await supabase
      .from("documents")
      .delete()
      .eq("id", id);

    if (dbError) {
      return { error: dbError.message };
    }

    revalidatePath("/dashboard/documents");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
