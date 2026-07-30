"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { User, Mail, Calendar, Shield, BarChart2, FileText, Zap } from "lucide-react";

interface UserStats {
  plan: string;
  credits_remaining: number;
  analyses_this_month: number;
}

export default function SettingsPage() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        const res = await fetch(`${apiUrl}/api/v1/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) setStats(await res.json());
      } catch {}
    })();
  }, []);

  if (!isLoaded) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        {[1,2,3].map(i => <div key={i} className="shimmer rounded-xl h-24" />)}
      </div>
    );
  }

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
    : "—";

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white mb-1">Settings</h1>
        <p className="text-white/40 text-sm">Manage your account and preferences</p>
      </div>

      {/* Profile */}
      <section className="rounded-xl border border-white/8 bg-[#111111] p-6 mb-5">
        <h2 className="text-sm font-medium text-white/60 uppercase tracking-wide mb-4">Profile</h2>
        <div className="flex items-center gap-4 mb-6">
          {user?.imageUrl ? (
            <img src={user.imageUrl} alt="avatar" className="w-14 h-14 rounded-full border border-white/10" />
          ) : (
            <div className="w-14 h-14 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
              <User className="w-7 h-7 text-indigo-400" />
            </div>
          )}
          <div>
            <p className="text-base font-medium text-white">
              {user?.fullName ?? user?.firstName ?? "User"}
            </p>
            <p className="text-sm text-white/40">
              {user?.primaryEmailAddress?.emailAddress ?? "—"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: Mail, label: "Email", value: user?.primaryEmailAddress?.emailAddress ?? "—" },
            { icon: Calendar, label: "Member since", value: joinDate },
            { icon: Shield, label: "Auth provider", value: user?.externalAccounts?.[0]?.provider ?? "Email" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-[#1A1A1A] rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Icon className="w-3.5 h-3.5 text-white/30" />
                <span className="text-xs text-white/40">{label}</span>
              </div>
              <p className="text-sm text-white truncate">{value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Plan & Usage */}
      <section className="rounded-xl border border-white/8 bg-[#111111] p-6 mb-5">
        <h2 className="text-sm font-medium text-white/60 uppercase tracking-wide mb-4">Plan & Usage</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          {[
            {
              icon: Zap,
              label: "Current Plan",
              value: stats?.plan ? stats.plan.charAt(0).toUpperCase() + stats.plan.slice(1) : "Free",
              color: "text-indigo-400",
            },
            {
              icon: BarChart2,
              label: "Analyses This Month",
              value: stats?.analyses_this_month?.toString() ?? "—",
              color: "text-white",
            },
            {
              icon: FileText,
              label: "Credits Remaining",
              value: stats?.credits_remaining?.toString() ?? "∞",
              color: "text-emerald-400",
            },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-[#1A1A1A] rounded-lg p-4 text-center">
              <Icon className="w-5 h-5 text-white/30 mx-auto mb-2" />
              <p className={`text-2xl font-semibold mb-1 ${color}`}>{value}</p>
              <p className="text-xs text-white/40">{label}</p>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-300 mb-0.5">Free Plan</p>
              <p className="text-xs text-white/40">Unlimited resume uploads and ATS analyses</p>
            </div>
            <span className="text-xs text-indigo-400 border border-indigo-500/30 px-2 py-1 rounded-lg">
              Pro coming soon
            </span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="rounded-xl border border-white/8 bg-[#111111] p-6">
        <h2 className="text-sm font-medium text-white/60 uppercase tracking-wide mb-4">What&apos;s Included</h2>
        <div className="space-y-2">
          {[
            "Unlimited resume uploads",
            "Full ATS score analysis (6 dimensions)",
            "Rejection Risk Radar",
            "Bullet Point Analyzer",
            "AI Bullet Rewriter",
            "Interview Prep question bank",
            "Cover Letter Generator",
          ].map((feature) => (
            <div key={feature} className="flex items-center gap-3 py-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
              <span className="text-sm text-white/70">{feature}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}