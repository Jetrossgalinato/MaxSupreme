import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function DashboardPage() {
  const staffOnDuty = [
    { name: "Alice Johnson", role: "Manager", status: "Active" },
    { name: "Bob Smith", role: "Support", status: "Busy" },
    { name: "Charlie Brown", role: "Sales", status: "Active" },
  ];

  const priorityInvestors = [
    { name: "Investment Corp A", tier: "Platinum" },
    { name: "Venture Partners B", tier: "Gold" },
    { name: "Global Holdings C", tier: "Platinum" },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Staff on Duty</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {staffOnDuty.map((staff, index) => (
              <div
                key={index}
                className="flex items-center justify-between space-x-4"
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback>{staff.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">
                      {staff.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {staff.role}
                    </p>
                  </div>
                </div>
                <div
                  className={`text-xs px-2 py-1 rounded-full ${
                    staff.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {staff.status}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Priority Investors</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {priorityInvestors.map((investor, index) => (
              <div
                key={index}
                className="flex items-center justify-between space-x-4"
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback>{investor.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">
                      {investor.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {investor.tier}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
