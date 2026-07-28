"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const steps = [
  "Reading your resume...",
  "Extracting sections and bullets...",
  "Running ATS compatibility checks...",
  "Scoring language confidence...",
  "Identifying rejection risks...",
  "Comparing against peer resumes...",
  "Generating recommendations...",
];

export default function AnalysisLoader() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => (s + 1) % steps.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="relative w-16 h-16 mb-6">
        <div className="absolute inset-0 rounded-full border-2 border-white/5" />
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-indigo-500 border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, ease: "linear", repeat: Infinity }}
        />
      </div>
      <h3 className="text-base font-medium text-white mb-2">Analyzing your resume</h3>
      <motion.p key={step} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }} className="text-sm text-white/40">
        {steps[step]}
      </motion.p>
    </div>
  );
}
