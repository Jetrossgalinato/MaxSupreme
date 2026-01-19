import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { UserTable } from "./user-table";
import { getUsers } from "./actions";
import { AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const { users, error } = await getUsers();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">
          Manage system users and their roles.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="flex items-center gap-2 rounded-md bg-destructive/15 p-4 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <p>
                {/* Check for the specific error regarding environment variables */}
                {JSON.stringify(error).includes(
                  "Missing Supabase environment variables",
                )
                  ? "Admin configuration missing (Service Role Key). Cannot list users."
                  : `Error loading users: ${JSON.stringify(error)}`}
              </p>
            </div>
          ) : (
            <UserTable users={users || []} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
