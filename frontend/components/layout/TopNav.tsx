"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, Zap } from "lucide-react";

const titles: Record<string, string> = {
  "/dashboard":      "Dashboard",
  "/resume":         "My Resumes",
  "/resume/upload":  "Upload Resume",
  "/interview-prep": "Interview Prep",
  "/cover-letter":   "Cover Letter",
  "/settings":       "Settings",
};

export default function TopNav() {
  const pathname = usePathname();
  const title = Object.entries(titles).find(([k]) => pathname.startsWith(k))?.[1] ?? "Apex Resume";

  return (
    <header className="h-16 flex items-center px-6 border-b border-white/8 bg-[#0A0A0A] flex-shrink-0">
      {/* Mobile logo */}
      <div className="flex md:hidden items-center gap-2 mr-4">
        <div className="w-6 h-6 bg-indigo-500 rounded-md flex items-center justify-center">
          <Zap className="w-3.5 h-3.5 text-white" />
        </div>
      </div>

      <h1 className="text-base font-medium text-white">{title}</h1>
    </header>
  );
}
