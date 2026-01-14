import { links } from "../helpers";

export default function Navbar() {
  return (
    <nav className="fixed top-6 inset-x-0 z-50 flex justify-center px-6">
      <div className="flex items-center gap-3 bg-white/70 backdrop-blur-md px-3 py-2 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-black/5">
        {/* Logo/Home Link */}
        <div className="h-8 w-8 bg-zinc-900 rounded-full flex items-center justify-center text-white text-xs font-bold ml-1">
          M
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-1">
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

        {/* Simple Action Button */}
        <button className="bg-zinc-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-zinc-800 transition-colors ml-2">
          Get Started
        </button>
      </div>
    </nav>
  );
}
