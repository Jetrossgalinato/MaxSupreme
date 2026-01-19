"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  online_at: string;
}

export function StaffOnDuty() {
  const [onlineStaff, setOnlineStaff] = useState<StaffMember[]>([]);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase.channel("staff-room");

    channel
      .on("presence", { event: "sync" }, () => {
        const newState = channel.presenceState();
        const staff: StaffMember[] = [];

        for (const id in newState) {
          const presence = newState[id];
          // Presence is an array of objects for that key
          // We assume one session per user for simplicity, or just take the first one
          if (presence && presence.length > 0) {
            staff.push(presence[0] as unknown as StaffMember);
          }
        }
        setOnlineStaff(staff);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Staff on Duty</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {onlineStaff.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No staff currently online.
          </p>
        ) : (
          onlineStaff
            .filter((s) => s.role === "employee")
            .map((staff) => (
              <div
                key={staff.id}
                className="flex items-center justify-between space-x-4"
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback>{getInitials(staff.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">
                      {staff.name}
                    </p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {staff.role}
                    </p>
                  </div>
                </div>
                <div className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  Active
                </div>
              </div>
            ))
        )}
      </CardContent>
    </Card>
  );
}
