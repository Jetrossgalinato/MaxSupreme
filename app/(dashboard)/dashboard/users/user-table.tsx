"use client";

import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2, X } from "lucide-react";
import { deleteUser, updateUser } from "./actions";
import { HelperText } from "@/components/ui/typography";
import { useRouter } from "next/navigation";
import { UserRole } from "@/types/roles";
import Alert from "@/components/custom-alert";
import { createClient } from "@/utils/supabase/client";

import { DeleteConfirmationModal } from "../../components/delete-confirmation-modal";

interface UserTableProps {
  users: User[];
}

export function UserTable({ users }: UserTableProps) {
  const router = useRouter();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error" | "warning" | "info";
    title?: string;
    message: string;
  } | null>(null);

  const [timeFilter, setTimeFilter] = useState<
    "today" | "week" | "month" | "all"
  >("all");

  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase.channel("staff-room");

    channel
      .on("presence", { event: "sync" }, () => {
        const newState = channel.presenceState();
        const onlineIds = new Set<string>();

        // Iterate over the state to find online user IDs
        // presenceState returns { [key: string]: PresencePayload[] }
        Object.values(newState).forEach((presences) => {
          presences.forEach((presence) => {
            const p = presence as unknown as { id: string };
            if (p.id) {
              onlineIds.add(p.id);
            }
          });
        });

        setOnlineUsers(onlineIds);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getDisplayHours = (user: User) => {
    let total = 0;
    const workLog = (user.user_metadata?.work_log || {}) as Record<
      string,
      number
    >;

    // Calculate base hours based on filter
    if (timeFilter === "all") {
      total = parseFloat(user.user_metadata?.total_hours || "0");
    } else {
      const now = new Date();
      // Use UTC to match the server-side logging which uses UTC dates
      const currentUTCYear = now.getUTCFullYear();
      const currentUTCMonth = now.getUTCMonth();

      // Calculate start of week (Sunday) in UTC
      const dayOfWeek = now.getUTCDay();
      const startOfWeek = new Date(now);
      startOfWeek.setUTCDate(now.getUTCDate() - dayOfWeek);
      startOfWeek.setUTCHours(0, 0, 0, 0);

      Object.entries(workLog).forEach(([dateStr, hours]) => {
        // dateStr is in YYYY-MM-DD format
        const [y, m, d] = dateStr.split("-").map(Number);
        const entryDate = new Date(Date.UTC(y, m - 1, d));

        if (timeFilter === "today") {
          const todayStr = now.toISOString().split("T")[0];
          if (dateStr === todayStr) {
            total += hours;
          }
        } else if (timeFilter === "week") {
          // Include if entry is on or after start of current week
          if (entryDate >= startOfWeek) {
            total += hours;
          }
        } else if (timeFilter === "month") {
          if (y === currentUTCYear && m - 1 === currentUTCMonth) {
            total += hours;
          }
        }
      });
    }

    // If user is online, add the time since their last activity or login
    if (onlineUsers.has(user.id)) {
      // Determine the anchor time: either last_active_timestamp or last_sign_in_at
      const lastActive = user.user_metadata?.last_active_timestamp
        ? new Date(user.user_metadata.last_active_timestamp).getTime()
        : 0;
      const lastSignIn = user.last_sign_in_at
        ? new Date(user.last_sign_in_at).getTime()
        : 0;

      // Use the most recent timestamp as the start of the current "unaccounted" segment
      let anchorTime = lastActive;
      if (lastSignIn > lastActive) {
        anchorTime = lastSignIn;
      }

      // If we have a valid anchor, calculate the live diff
      if (anchorTime > 0) {
        const diffMs = currentTime.getTime() - anchorTime;
        if (diffMs > 0) {
          const currentSessionHours = diffMs / (1000 * 60 * 60);

          // Live session counts for all time filters as it is happening "now"
          total += currentSessionHours;
        }
      }
    }

    const totalSeconds = Math.floor(total * 3600);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (num: number) => num.toString().padStart(2, "0");
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  // Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState<UserRole>("member");
  const [totalHours, setTotalHours] = useState<number>(0);

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setFirstName(user.user_metadata?.first_name || "");
    setLastName(user.user_metadata?.last_name || "");
    setRole(user.user_metadata?.role || "member");
    setTotalHours(Number(user.user_metadata?.total_hours) || 0);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setIsLoading(true);
    const result = await updateUser(editingUser.id, {
      firstName,
      lastName,
      role,
      totalHours,
    });
    setIsLoading(false);

    if (result.success) {
      setEditingUser(null);
      router.refresh();
      setAlert({
        type: "success",
        title: "Success",
        message: "User updated successfully.",
      });
    } else {
      setAlert({
        type: "error",
        title: "Error",
        message: "Failed to update user: " + result.error,
      });
    }
  };

  const handleDeleteClick = (user: User) => {
    setDeletingUser(user);
  };

  const confirmDelete = async () => {
    if (!deletingUser) return;

    setIsLoading(true);
    const result = await deleteUser(deletingUser.id);
    setIsLoading(false);

    if (result.success) {
      setDeletingUser(null);
      router.refresh();
      setAlert({
        type: "success",
        title: "Success",
        message: "User deleted successfully.",
      });
    } else {
      setAlert({
        type: "error",
        title: "Error",
        message: "Failed to delete user: " + result.error,
      });
      // Optionally keep the modal open or close it
      setDeletingUser(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        <Button
          variant={timeFilter === "today" ? "default" : "outline"}
          size="sm"
          onClick={() => setTimeFilter("today")}
        >
          Today
        </Button>
        <Button
          variant={timeFilter === "week" ? "default" : "outline"}
          size="sm"
          onClick={() => setTimeFilter("week")}
        >
          This Week
        </Button>
        <Button
          variant={timeFilter === "month" ? "default" : "outline"}
          size="sm"
          onClick={() => setTimeFilter("month")}
        >
          This Month
        </Button>
        <Button
          variant={timeFilter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setTimeFilter("all")}
        >
          All Time
        </Button>
      </div>

      <div className="rounded-md border">
        {alert && (
          <Alert
            type={alert.type}
            title={alert.title}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[250px]">
                  Name
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Email
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Role
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  {timeFilter === "today"
                    ? "Hours Today"
                    : timeFilter === "week"
                      ? "Hours This Week"
                      : timeFilter === "month"
                        ? "Hours This Month"
                        : "Total Hours"}
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Created At
                </th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    <td className="p-4 align-middle font-medium">
                      {user.user_metadata?.full_name ||
                        `${user.user_metadata?.first_name || ""} ${
                          user.user_metadata?.last_name || ""
                        }`.trim() ||
                        "N/A"}
                    </td>
                    <td className="p-4 align-middle">{user.email}</td>
                    <td className="p-4 align-middle">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${
                          user.user_metadata?.role === "admin"
                            ? "bg-purple-50 text-purple-700 ring-purple-600/20"
                            : user.user_metadata?.role === "employee"
                              ? "bg-blue-50 text-blue-700 ring-blue-600/20"
                              : "bg-gray-50 text-gray-600 ring-gray-500/10"
                        } capitalize`}
                      >
                        {user.user_metadata?.role || "member"}
                      </span>
                    </td>
                    <td
                      className="p-4 align-middle font-mono"
                      suppressHydrationWarning
                    >
                      {getDisplayHours(user)}
                      {onlineUsers.has(user.id) && (
                        <span
                          className="ml-2 inline-block h-2 w-2 rounded-full bg-green-500 animate-pulse align-middle"
                          title="Tracking time active"
                        />
                      )}
                    </td>
                    <td className="p-4 align-middle">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 align-middle text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditClick(user)}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteClick(user)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Edit Modal (Simple Implementation) */}
        {editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-background border rounded-lg shadow-lg w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Edit User</h3>
                <button
                  onClick={() => setEditingUser(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input
                      id="first-name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input
                      id="last-name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last Name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="member">Member</option>
                    <option value="employee">Employee</option>
                    <option value="admin">Admin</option>
                  </select>
                  <HelperText>
                    Controls user access levels within the system.
                  </HelperText>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditingUser(null)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={!!deletingUser}
          onClose={() => setDeletingUser(null)}
          onConfirm={confirmDelete}
          isLoading={isLoading}
          title="Delete User"
          description={
            deletingUser ? (
              <>
                Are you sure you want to delete{" "}
                <span className="font-medium text-foreground">
                  {deletingUser.user_metadata?.full_name ||
                    deletingUser.email ||
                    "this user"}
                </span>
                ? This action cannot be undone.
              </>
            ) : undefined
          }
        />
      </div>
    </div>
  );
}
