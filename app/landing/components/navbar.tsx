import { links } from "../helpers";
import { ModeToggle } from "./toggleButton";
import Image from "next/image";

export default function Navbar() {
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

          <button className="cursor-pointer bg-foreground text-background px-5 py-2.5 rounded-full text-sm font-medium hover:bg-foreground/90 transition-colors">
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}
