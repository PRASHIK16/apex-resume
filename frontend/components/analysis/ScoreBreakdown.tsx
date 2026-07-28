"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Scores {
  atsKeyword: number; atsFormat: number; contentQuality: number;
  confidence: number; impact: number; readability: number;
}

const items = [
  { key: "atsKeyword",     label: "ATS Keywords",    color: "#6366F1" },
  { key: "atsFormat",      label: "ATS Format",      color: "#8B5CF6" },
  { key: "contentQuality", label: "Content Quality", color: "#22C55E" },
  { key: "confidence",     label: "Confidence",      color: "#F59E0B" },
  { key: "impact",         label: "Impact",          color: "#EC4899" },
  { key: "readability",    label: "Readability",     color: "#06B6D4" },
] as const;

function badge(score: number) {
  if (score >= 85) return "text-green-400 bg-green-400/10";
  if (score >= 70) return "text-lime-400 bg-lime-400/10";
  if (score >= 50) return "text-amber-400 bg-amber-400/10";
  return "text-red-400 bg-red-400/10";
}

export default function ScoreBreakdown({ scores }: { scores: Scores }) {
  return (
    <div className="rounded-xl border border-white/8 bg-[#111111] p-5 h-full">
      <h3 className="text-sm font-medium text-white mb-4">Score Breakdown</h3>
      <div className="grid grid-cols-2 gap-3">
        {items.map(({ key, label, color }, i) => {
          const val = scores[key];
          return (
            <motion.div key={key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              className="bg-[#1A1A1A] rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-white/50">{label}</span>
                <span className={cn("text-xs font-medium px-1.5 py-0.5 rounded", badge(val))}>{val}</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div className="h-full rounded-full" style={{ backgroundColor: color }}
                  initial={{ width: 0 }} animate={{ width: `${val}%` }}
                  transition={{ duration: 0.8, delay: 0.3 + i * 0.06, ease: "easeOut" }} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
