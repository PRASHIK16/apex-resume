"use client";

import { motion } from "framer-motion";
import { AlertTriangle, AlertCircle, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface Risk {
  riskTitle: string; specificText: string;
  whyItHurts: string; severity: "HIGH" | "MEDIUM" | "LOW"; fix: string;
}

// Professional SaaS severity palette — traffic light logic, fully distinct
const severityMap = {
  HIGH: {
    icon: AlertTriangle,
    color: "text-red-400",
    bg: "bg-red-500/8",
    border: "border-red-500/25",
    badge: "bg-red-500/20 text-red-300 border border-red-500/30",
    fixBorder: "border-red-500/10",
    label: "HIGH",
  },
  MEDIUM: {
    icon: AlertCircle,
    color: "text-orange-400",
    bg: "bg-orange-500/8",
    border: "border-orange-500/25",
    badge: "bg-orange-500/20 text-orange-300 border border-orange-500/30",
    fixBorder: "border-orange-500/10",
    label: "MEDIUM",
  },
  LOW: {
    icon: Lightbulb,
    color: "text-emerald-400",
    bg: "bg-emerald-500/8",
    border: "border-emerald-500/25",
    badge: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
    fixBorder: "border-emerald-500/10",
    label: "LOW",
  },
};

export default function RejectionRadar({ risks }: { risks: Risk[] }) {
  if (!risks.length) return null;

  return (
    <div className="rounded-xl border border-white/8 bg-[#111111] p-5">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-4 h-4 text-red-400" />
        <h3 className="text-sm font-medium text-white">Rejection Risk Radar</h3>
        <span className="ml-auto text-xs text-white/30">{risks.length} risks found</span>
      </div>

      <div className="space-y-3">
        {risks.map((risk, i) => {
          const s = severityMap[risk.severity] ?? severityMap.LOW;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
              className={cn("rounded-lg border p-4", s.bg, s.border)}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <s.icon className={cn("w-4 h-4 flex-shrink-0", s.color)} />
                  <span className="text-sm font-medium text-white">{risk.riskTitle}</span>
                </div>
                <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 tracking-wide", s.badge)}>
                  {s.label}
                </span>
              </div>

              <p className="text-xs text-white/50 mb-1 pl-6 font-mono leading-relaxed">
                &quot;{risk.specificText}&quot;
              </p>
              <p className="text-xs text-white/40 pl-6 mb-2">{risk.whyItHurts}</p>

              <div className={cn("pl-6 pt-2 border-t", s.fixBorder)}>
                <p className="text-xs text-white/60">
                  <span className="font-medium text-white/80">Fix:</span> {risk.fix}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}