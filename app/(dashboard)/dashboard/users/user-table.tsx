"use client";

import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MoreHorizontal, Pencil, Trash2, X } from "lucide-react";
import { deleteUser, updateUser } from "./actions";
import { HelperText } from "@/components/ui/typography";
import { useRouter } from "next/navigation";
import { UserRole } from "@/types/roles";

interface UserTableProps {
  users: User[];
}

export function UserTable({ users }: UserTableProps) {
  const router = useRouter();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState<UserRole>("member");

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setFirstName(user.user_metadata?.first_name || "");
    setLastName(user.user_metadata?.last_name || "");
    setRole(user.user_metadata?.role || "member");
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setIsLoading(true);
    const result = await updateUser(editingUser.id, {
      firstName,
      lastName,
      role,
    });
    setIsLoading(false);

    if (result.success) {
      setEditingUser(null);
      router.refresh();
    } else {
      alert("Failed to update user: " + result.error);
    }
  };

  const handleDelete = async (userId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this user? This action cannot be undone.",
      )
    ) {
      return;
    }

    const result = await deleteUser(userId);
    if (result.success) {
      router.refresh();
    } else {
      alert("Failed to delete user: " + result.error);
    }
  };

  return (
    <div className="rounded-md border">
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b">
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Name
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Email
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Role
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
                <td colSpan={5} className="p-4 text-center">
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
                  <td className="p-4 align-middle">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4 align-middle text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEditClick(user)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDelete(user.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
    </div>
  );
}
