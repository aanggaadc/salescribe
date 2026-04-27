"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Sparkles, LogOut } from "lucide-react";

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 glass-dark border-b border-obsidian-700/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/dashboard" className="font-display font-bold text-lg tracking-tight">
          <span className="text-white">Sale</span>
          <span className="gradient-text">Scribe</span>
        </Link>

        {/* Menu */}
        <div className="flex items-center gap-1">
          
          {/* Generate */}
          <Link
            href="/dashboard"
            className={`btn-ghost flex items-center gap-2 text-sm ${
              pathname === "/dashboard" ? "text-volt-300 bg-volt-400/5" : ""
            }`}
          >
            <Sparkles size={18} />
            <span className="hidden sm:inline">Generate</span>
          </Link>

          {/* My Pages */}
          <Link
            href="/dashboard/pages"
            className={`btn-ghost flex items-center gap-2 text-sm ${
              pathname === "/dashboard/pages" ? "text-volt-300 bg-volt-400/5" : ""
            }`}
          >
            <FileText size={18} />
            <span className="hidden sm:inline">My Pages</span>
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          
          {/* Email (hide mobile) */}
          <span className="text-obsidian-400 text-sm font-mono hidden sm:block">
            {session?.user?.email}
          </span>

          {/* Sign Out */}
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="btn-ghost flex items-center gap-2 text-sm text-obsidian-300"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>
    </nav>
  );
}