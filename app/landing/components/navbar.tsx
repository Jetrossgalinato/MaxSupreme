import { links } from "../helpers";
import { ModeToggle } from "./toggleButton";
import Image from "next/image";
import Link from "next/link";
import { User } from "@supabase/supabase-js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
            {links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-foreground hover:text-foreground/80 hover:bg-foreground/10 rounded-full transition-all duration-200"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>

        {/* Right Side: Theme Toggler and CTA */}
        <div className="flex items-center gap-3 pr-1">
          {/* Theme Toggler Placeholder */}
          <ModeToggle />

          {/* Vertical Divider */}
          <div className="h-6 w-px mx-2 bg-foreground/20" />

          {user ? (
            <div className="flex items-center gap-2 pr-2">
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
            </div>
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
