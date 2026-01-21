"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  LineChart,
  Settings,
  UserCog,
  FileText,
} from "lucide-react";
import Image from "next/image";

type SidebarProps = React.HTMLAttributes<HTMLDivElement> & {
  role?: string;
};

export function Sidebar({ className, role }: SidebarProps) {
  const pathname = usePathname();

  const dashboardHref = role === "employee" ? "/employee-dashboard" : "/dashboard";

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: dashboardHref,
      active: pathname === dashboardHref,
    },
    {
      label: "Users",
      icon: UserCog,
      href: "/dashboard/users",
      active: pathname === "/dashboard/users",
    },

    {
      label: "Documents",
      icon: FileText,
      href: "/dashboard/documents",
      active: pathname === "/dashboard/documents",
    },
    {
      label: "Investors",
      icon: LineChart,
      href: "/dashboard/investors",
      active: pathname === "/dashboard/investors",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/dashboard/settings",
      active: pathname === "/dashboard/settings",
    },
  ];

  return (
    <div className={cn("pb-12 min-h-screen border-r bg-background", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex items-center pl-2 mb-8">
            <div className="relative w-8 h-8 mr-2">
              <Image
                fill
                alt="Logo"
                src="/logo.png"
                className="object-contain"
              />
            </div>
            <h2 className="text-xl font-bold tracking-tight">Max Supreme</h2>
          </div>
          <div className="space-y-1">
            {routes.map((route) => (
              <Button
                key={route.href}
                variant={route.active ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href={route.href}>
                  <route.icon className="mr-2 h-4 w-4" />
                  {route.label}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
