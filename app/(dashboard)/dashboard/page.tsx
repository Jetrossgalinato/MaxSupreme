import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Overview } from "../components/overview";
import { RecentActivity } from "../components/recent-activity";
import { StaffOnDuty } from "./components/staff-on-duty";
import { TypographyH2, TypographyMuted } from "@/components/ui/typography";

export default function DashboardPage() {
  const priorityInvestors = [
    { name: "Investment Corp A", tier: "Platinum" },
    { name: "Venture Partners B", tier: "Gold" },
    { name: "Global Holdings C", tier: "Platinum" },
  ];

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <TypographyH2>Dashboard</TypographyH2>
          <TypographyMuted>
            Overview of your properties and investments.
          </TypographyMuted>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentActivity />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StaffOnDuty />

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
