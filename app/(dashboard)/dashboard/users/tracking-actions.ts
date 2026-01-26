"use server";

import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function updateUserActivity() {
  const supabase = await createClient();
  const supabaseAdmin = createAdminClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const metadata = user.user_metadata || {};
    const lastSignIn = user.last_sign_in_at
      ? new Date(user.last_sign_in_at).getTime()
      : 0;

    // Get last active timestamp from metadata, default to 0
    const lastActive = metadata.last_active_timestamp
      ? new Date(metadata.last_active_timestamp).getTime()
      : 0;

    // If last_active is older than last_sign_in, it means this is a fresh session
    // or the first ping of the new session.
    // We should anchor from last_sign_in in that case for the first interval?
    // Actually, if we just logged in, last_active (old) < last_sign_in (new).
    // The "gap" is login time -> now.

    // Logic:
    // Determine the valid anchor point for this segment of time.
    // If we have a recent last_active that is INSIDE the current session (after last_sign_in), use it.
    // Otherwise, use last_sign_in as the start point.

    let anchorTime = lastActive;
    if (lastSignIn > lastActive) {
      anchorTime = lastSignIn;
    }

    const now = Date.now();
    const diffMs = now - anchorTime;

    // Safety check: ignore negative diffs or suspiciously large diffs (e.g. > 10 mins)
    // to prevent messing up hours if clocks are weird or if a "new session" logic fails.
    // A heartbeat is expected every 1 min. Let's allow up to 5 mins.
    // If diff is huge, we assume we missed the boat and just reset the anchor to now without adding.
    // BUT, if it's the first ping after login, diff might be small (seconds).

    let hoursToAdd = 0;
    if (diffMs > 0 && diffMs < 5 * 60 * 1000) {
      hoursToAdd = diffMs / (1000 * 60 * 60);
    }

    // If no meaningful time passed, just exit without error to avoid unnecessary updates
    if (hoursToAdd <= 0) {
      return { success: true };
    }

    const currentTotal = parseFloat(metadata.total_hours || "0");
    const newTotal = currentTotal + hoursToAdd;

    // Update work_log for granular tracking
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const workLog = metadata.work_log || {};
    const currentToday =
      typeof workLog[today] === "number" ? workLog[today] : 0;
    workLog[today] = currentToday + hoursToAdd;

    // 1. Update Metadata (Legacy/Backup)
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        total_hours: newTotal,
        work_log: workLog,
        last_active_timestamp: new Date(now).toISOString(),
      },
    });

    if (updateError) {
      console.error("Failed to update user activity:", updateError);
      return { success: false, error: updateError.message };
    }

    // 2. Update work_logs table
    if (hoursToAdd > 0) {
      // Use admin client to bypass RLS issues for background tracking
      // Check for existing record
      const { data: existingLog, error: fetchError } = await supabaseAdmin
        .from("work_logs")
        .select("*")
        .eq("user_id", user.id)
        .eq("work_date", today)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        // PGRST116 is "no rows returned"
        console.error("Error fetching work log:", fetchError);
      }

      if (existingLog) {
        // Update
        const { error: updateError } = await supabaseAdmin
          .from("work_logs")
          .update({
            hours_worked: (Number(existingLog.hours_worked) || 0) + hoursToAdd,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingLog.id);

        if (updateError) console.error("Error updating work log:", updateError);
      } else {
        // Insert
        const { error: insertError } = await supabaseAdmin
          .from("work_logs")
          .insert({
            user_id: user.id,
            work_date: today,
            hours_worked: hoursToAdd,
          });

        if (insertError)
          console.error("Error inserting work log:", insertError);
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error in updateUserActivity:", error);
    return { success: false, error: "Internal Server Error" };
  }
}
