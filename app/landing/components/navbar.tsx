import { links } from "../helpers";
import { ModeToggle } from "./toggleButton";

export default function Navbar() {
  return (
    <nav className="fixed top-6 inset-x-0 z-50 flex justify-center px-6">
      <div className="flex items-center justify-between w-full max-w-6xl bg-white/70 backdrop-blur-md p-2 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-black/5">
        {/* Left Side: Logo and Nav Links */}
        <div className="flex items-center gap-6">
          <div className="h-9 w-9 bg-zinc-900 rounded-full flex items-center justify-center text-white text-xs font-bold ml-1 flex-shrink-0">
            M
          </div>

          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/50 rounded-full transition-all duration-200"
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

          <button className="bg-zinc-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-zinc-800 transition-colors">
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}
