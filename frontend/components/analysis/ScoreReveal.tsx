"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

function getColor(score: number) {
  if (score >= 85) return { text: "text-green-400", ring: "#22C55E", label: "Excellent" };
  if (score >= 70) return { text: "text-lime-400",  ring: "#84CC16", label: "Good" };
  if (score >= 50) return { text: "text-amber-400", ring: "#F59E0B", label: "Needs Work" };
  return { text: "text-red-400", ring: "#EF4444", label: "Critical" };
}

export default function ScoreReveal({ score }: { score: number }) {
  const [displayed, setDisplayed] = useState(0);
  const { text, ring, label } = getColor(score);
  const circumference = 2 * Math.PI * 54;

  useEffect(() => {
    const start = Date.now();
    const duration = 1800;
    const raf = requestAnimationFrame(function tick() {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(eased * score));
      if (progress < 1) requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(raf);
  }, [score]);

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="rounded-xl border border-white/8 bg-[#111111] p-6 flex flex-col items-center justify-center h-full min-h-[180px]">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
          <motion.circle cx="60" cy="60" r="54" fill="none" stroke={ring} strokeWidth="8"
            strokeLinecap="round" strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - (circumference * score) / 100 }}
            transition={{ duration: 1.8, ease: "easeOut", delay: 0.2 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("text-3xl font-light tabular-nums", text)}>{displayed}</span>
          <span className="text-xs text-white/30">/100</span>
        </div>
      </div>
      <div className="mt-3 text-center">
        <p className={cn("text-sm font-medium", text)}>{label}</p>
        <p className="text-xs text-white/30 mt-0.5">Overall Score</p>
      </div>
    </motion.div>
  );
}
