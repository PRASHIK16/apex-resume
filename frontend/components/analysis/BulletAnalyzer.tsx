"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, ChevronDown, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Bullet {
  bulletId: string; original: string; confidenceScore: number;
  impactLevel: "HIGH" | "MEDIUM" | "LOW"; hasQuantification: boolean; passivePhrases: string[];
}

const impactConfig = {
  HIGH:   { icon: TrendingUp,   color: "text-green-400",  bg: "bg-green-400/10",  label: "High Impact" },
  MEDIUM: { icon: Minus,        color: "text-amber-400",  bg: "bg-amber-400/10",  label: "Medium Impact" },
  LOW:    { icon: TrendingDown, color: "text-red-400",    bg: "bg-red-400/10",    label: "Low Impact" },
};

export default function BulletAnalyzer({ bullets }: { bullets: Bullet[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="rounded-xl border border-white/8 bg-[#111111] p-5">
      <h3 className="text-sm font-medium text-white mb-1">Bullet Point Analysis</h3>
      <p className="text-xs text-white/40 mb-4">{bullets.length} bullets analyzed · click any to rewrite</p>
      <div className="space-y-2">
        {bullets.map((b) => {
          const imp = impactConfig[b.impactLevel];
          const isOpen = expanded === b.bulletId;
          return (
            <div key={b.bulletId} className={cn(
              "rounded-lg border transition-colors",
              b.impactLevel === "LOW" ? "border-red-500/15 bg-red-500/5" :
              b.impactLevel === "HIGH" ? "border-green-500/15 bg-green-500/5" :
              "border-white/8 bg-[#1A1A1A]"
            )}>
              <button onClick={() => setExpanded(isOpen ? null : b.bulletId)}
                className="w-full flex items-start gap-3 p-3 text-left">
                <span className={cn("mt-0.5 flex-shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded", imp.bg, imp.color)}>
                  {b.impactLevel}
                </span>
                <span className="flex-1 text-sm text-white/80 leading-relaxed">{b.original}</span>
                <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
                  <span className={cn("text-xs font-medium", imp.color)}>{b.confidenceScore}</span>
                  <ChevronDown className={cn("w-3.5 h-3.5 text-white/30 transition-transform", isOpen && "rotate-180")} />
                </div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                    className="overflow-hidden">
                    <div className="px-3 pb-3 pt-0 border-t border-white/5">
                      <div className="flex flex-wrap gap-2 mb-3 pt-3">
                        {b.passivePhrases.map((p) => (
                          <span key={p} className="text-xs px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-300">
                            &quot;{p}&quot; — passive
                          </span>
                        ))}
                        {!b.hasQuantification && (
                          <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300">
                            Missing quantification
                          </span>
                        )}
                      </div>
                      <button className="flex items-center gap-2 text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                        <Wand2 className="w-3.5 h-3.5" /> Rewrite with AI
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
