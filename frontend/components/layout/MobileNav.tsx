"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Mic2, PenTool, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard",      icon: LayoutDashboard, label: "Home" },
  { href: "/resume",         icon: FileText,         label: "Resumes" },
  { href: "/interview-prep", icon: Mic2,             label: "Prep" },
  { href: "/cover-letter",   icon: PenTool,          label: "Letter" },
  { href: "/settings",       icon: Settings,         label: "Settings" },
];

export default function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0D0D0D]/95 backdrop-blur-md border-t border-white/8">
      <div className="flex items-center justify-around h-16 px-2">
        {nav.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link key={href} href={href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors min-w-0",
                active ? "text-indigo-400" : "text-white/30 hover:text-white/60"
              )}>
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}