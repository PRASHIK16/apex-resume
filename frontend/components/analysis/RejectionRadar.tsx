"use client";

import { motion } from "framer-motion";
import { AlertTriangle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface Risk {
  riskTitle: string; specificText: string;
  whyItHurts: string; severity: "HIGH" | "MEDIUM" | "LOW"; fix: string;
}

const severityMap = {
  HIGH:   { icon: AlertTriangle, color: "text-red-400",    bg: "bg-red-500/8",    border: "border-red-500/20",    badge: "bg-red-500/15 text-red-300" },
  MEDIUM: { icon: AlertCircle,   color: "text-amber-400",  bg: "bg-amber-500/8",  border: "border-amber-500/20",  badge: "bg-amber-500/15 text-amber-300" },
  LOW:    { icon: Info,          color: "text-blue-400",   bg: "bg-blue-500/8",   border: "border-blue-500/20",   badge: "bg-blue-500/15 text-blue-300" },
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
          const s = severityMap[risk.severity];
          return (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className={cn("rounded-lg border p-4", s.bg, s.border)}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <s.icon className={cn("w-4 h-4 flex-shrink-0", s.color)} />
                  <span className="text-sm font-medium text-white">{risk.riskTitle}</span>
                </div>
                <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0", s.badge)}>
                  {risk.severity}
                </span>
              </div>
              <p className="text-xs text-white/50 mb-1 pl-6 font-mono">&quot;{risk.specificText}&quot;</p>
              <p className="text-xs text-white/40 pl-6 mb-2">{risk.whyItHurts}</p>
              <div className="pl-6 pt-2 border-t border-white/5">
                <p className="text-xs text-white/60"><span className="font-medium text-white/80">Fix:</span> {risk.fix}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
