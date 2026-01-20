"use client";

import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { updateUserActivity } from "@/app/(dashboard)/dashboard/users/tracking-actions";

export default function StaffPresence({ user }: { user: User | null }) {
  useEffect(() => {
    if (!user) return;

    // Heartbeat to update total_hours in DB
    const heartbeatInterval = setInterval(async () => {
      await updateUserActivity();
    }, 60 * 1000); // Every 1 minute

    // Initial ping on mount to establish "active" state
    updateUserActivity();

    const role = user.user_metadata?.role;
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
            id: user.id,
            name: user.user_metadata?.full_name || user.email,
            email: user.email,
            role: role,
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      clearInterval(heartbeatInterval);
      // Try to send one last pulse on unmount?
      // Often unreliable but worth a shot if component unmounts cleanly
      updateUserActivity();
      supabase.removeChannel(channel);
    };
  }, [user]);

  return null;
}
