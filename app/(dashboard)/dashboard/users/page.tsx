import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function UsersPage() {
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
          <p>User management feature coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
