"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Mic2, PenTool, Settings, Zap } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard",       icon: LayoutDashboard, label: "Dashboard" },
  { href: "/resume",          icon: FileText,         label: "My Resumes" },
  { href: "/interview-prep",  icon: Mic2,             label: "Interview Prep" },
  { href: "/cover-letter",    icon: PenTool,          label: "Cover Letter" },
  { href: "/settings",        icon: Settings,         label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-56 h-screen flex-col bg-[#0D0D0D] border-r border-white/8 flex-shrink-0">
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-white/8">
        <div className="w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center mr-2.5">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <span className="text-base font-semibold text-white">apex</span>
        <span className="ml-2 text-[10px] text-indigo-400/70 border border-indigo-500/30 rounded px-1.5 py-0.5 font-medium">
          BETA
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {nav.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link key={href} href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                active
                  ? "bg-white/8 text-white font-medium"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              )}>
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Free tier banner */}
      <div className="mx-3 mb-3 p-3 rounded-lg bg-indigo-500/8 border border-indigo-500/20">
        <p className="text-xs font-medium text-indigo-300 mb-1">Free Plan</p>
        <p className="text-xs text-white/40 mb-2">3 analyses remaining</p>
        <Link href="/settings/billing" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
          Upgrade to Pro →
        </Link>
      </div>

      {/* User */}
      <div className="p-4 border-t border-white/8 flex items-center gap-3">
        <UserButton afterSignOutUrl="/" />
        <span className="text-xs text-white/40">Account</span>
      </div>
    </aside>
  );
}
