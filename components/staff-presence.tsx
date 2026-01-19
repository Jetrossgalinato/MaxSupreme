"use client";

import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

export default function StaffPresence({ user }: { user: User | null }) {
  useEffect(() => {
    if (!user) return;

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
      supabase.removeChannel(channel);
    };
  }, [user]);

  return null;
}
