"use client";

import Link from "next/link";
import { ModeToggle } from "@/app/landing/components/toggleButton";
import { User } from "@supabase/supabase-js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User as UserIcon, Bell } from "lucide-react";
import { signout } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";

export default function DashboardHeader({ user }: { user?: User | null }) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-background px-6 shadow-sm">
      <div className="flex items-center gap-4 mr-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-foreground/80 hover:bg-foreground/10 px-3 py-2 rounded-full"
        >
          Home
        </Link>
      </div>
      <div className="flex flex-1 items-center justify-end gap-4">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
        </Button>
        <ModeToggle />

        <div className="h-6 w-px mx-2 bg-foreground/20" />

        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 outline-none">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback>
                    {user.user_metadata?.first_name
                      ? getInitials(
                          user.user_metadata.first_name +
                            " " +
                            (user.user_metadata.last_name || ""),
                        )
                      : user.email?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:flex text-sm font-medium">
                  {user.user_metadata?.full_name ||
                    user.user_metadata?.first_name ||
                    user.email?.split("@")[0]}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.user_metadata?.full_name ||
                      user.user_metadata?.first_name +
                        " " +
                        (user.user_metadata?.last_name || "") ||
                      "My Account"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                  <div className="flex items-center pt-1">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary capitalize">
                      {user.user_metadata?.role || "member"}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <Link href="/dashboard/profile">
                  <DropdownMenuItem>
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/dashboard/settings">
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signout()}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
