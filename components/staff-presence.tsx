"use client";

import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { updateUserActivity } from "@/app/(dashboard)/dashboard/users/tracking-actions";

export default function StaffPresence({ user }: { user: User | null }) {
  // Extract stable properties to avoid unnecessary re-runs when user metadata changes (e.g. last_active_timestamp)
  const userId = user?.id;
  const userEmail = user?.email;
  const userFullName = user?.user_metadata?.full_name;
  const userRole = user?.user_metadata?.role;

  useEffect(() => {
    if (!userId || !userEmail) return;

    // Heartbeat to update total_hours in DB
    const heartbeatInterval = setInterval(async () => {
      await updateUserActivity();
    }, 60 * 1000); // Every 1 minute

    // Initial ping on mount to establish "active" state
    updateUserActivity();

    // Track presence for all logged in users (admins, employees, members)
    // We can filter who to show on the dashboard side

    const supabase = createClient();
    const channel = supabase.channel("staff-room");

    channel
      .on("presence", { event: "sync" }, () => {
        // console.log("Synced presence state: ", channel.presenceState());
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            id: userId,
            name: userFullName || userEmail,
            email: userEmail,
            role: userRole,
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      clearInterval(heartbeatInterval);
      supabase.removeChannel(channel);
    };
  }, [userId, userEmail, userFullName, userRole]);

  return null;
}
