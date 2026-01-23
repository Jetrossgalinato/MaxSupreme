"use client";

import { links } from "../helpers";
import { ModeToggle } from "./toggleButton";
import Image from "next/image";
import Link from "next/link";
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
import { LogOut, Settings, User as UserIcon } from "lucide-react";
import { signout } from "@/app/(auth)/actions";

export default function Navbar({ user }: { user?: User | null }) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="fixed top-6 inset-x-0 z-50 flex justify-center px-6">
      <div className="flex items-center justify-between w-full max-w-7xl bg-background/70 backdrop-blur-md p-2 rounded-full shadow-sm ring-1 ring-black/5">
        {/* Left Side: Logo and Nav Links */}
        <div className="flex items-center gap-6">
          <Image
            src="/logo.png"
            alt="Logo"
            width={36}
            height={36}
            className="ml-4 flex-shrink-0"
          />

          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              let href = link.href;
              if (link.name === "Work" && user) {
                href =
                  user.user_metadata?.role === "admin"
                    ? "/dashboard"
                    : "/employee-dashboard";
              }
              return (
                <Link
                  key={link.name}
                  href={href}
                  className="px-4 py-2 text-sm font-medium text-foreground hover:text-foreground/80 hover:bg-foreground/10 rounded-full transition-all duration-200"
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right Side: Theme Toggler and CTA */}
        <div className="flex items-center gap-3 pr-1">
          {/* Theme Toggler Placeholder */}
          <ModeToggle />

          {/* Vertical Divider */}
          <div className="h-6 w-px mx-2 bg-foreground/20" />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 pr-2 outline-none">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.user_metadata?.avatar_url} />
                    <AvatarFallback>
                      {user.user_metadata?.first_name
                        ? getInitials(
                            user.user_metadata.first_name +
                              " " +
                              (user.user_metadata.last_name || "")
                          )
                        : user.email?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">
                    {user.user_metadata?.full_name ||
                      user.user_metadata?.first_name ||
                      user.email?.split("@")[0]}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signout()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href="/login"
              className="cursor-pointer bg-foreground text-background px-5 py-2.5 rounded-full text-sm font-medium hover:bg-foreground/90 transition-colors"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
