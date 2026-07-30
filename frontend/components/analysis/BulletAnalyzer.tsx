"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, ChevronDown, Wand2, Loader2, Copy, Check } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

interface Bullet {
  bulletId: string; original: string; confidenceScore: number;
  impactLevel: "HIGH" | "MEDIUM" | "LOW"; hasQuantification: boolean; passivePhrases: string[];
}

interface Rewrite {
  text: string;
  confidence_score: number;
  explanation: string;
  ats_keywords_added: string[];
}

const impactConfig = {
  HIGH:   { icon: TrendingUp,   color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-500/15", label: "High Impact" },
  MEDIUM: { icon: Minus,        color: "text-amber-400",   bg: "bg-amber-400/10",   border: "border-amber-500/15",  label: "Medium Impact" },
  LOW:    { icon: TrendingDown, color: "text-red-400",     bg: "bg-red-400/10",     border: "border-red-500/15",    label: "Low Impact" },
};

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? "text-emerald-400" : score >= 60 ? "text-amber-400" : "text-red-400";
  return <span className={cn("text-xs font-medium tabular-nums", color)}>{score}</span>;
}

function RewriteCard({ rewrite, index }: { rewrite: Rewrite; index: number }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(rewrite.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.08 }}
      className="bg-indigo-500/5 border border-indigo-500/15 rounded-lg p-3"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-[10px] font-medium text-indigo-400 uppercase tracking-wide">
          Option {index + 1}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-white/30">Score: {rewrite.confidence_score}</span>
          <button onClick={copy}
            className="flex items-center gap-1 text-[10px] text-white/40 hover:text-indigo-300 transition-colors">
            {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
      <p className="text-xs text-white/80 leading-relaxed mb-2">{rewrite.text}</p>
      <p className="text-[10px] text-white/40 italic">{rewrite.explanation}</p>
      {rewrite.ats_keywords_added?.length > 0 && (
        <div className="flex gap-1 mt-2">
          {rewrite.ats_keywords_added.map(k => (
            <span key={k} className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400">+{k}</span>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default function BulletAnalyzer({ bullets }: { bullets: Bullet[] }) {
  const { getToken } = useAuth();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [rewrites, setRewrites] = useState<Record<string, Rewrite[]>>({});
  const [rewriting, setRewriting] = useState<Record<string, boolean>>({});
  const [rewriteError, setRewriteError] = useState<Record<string, string>>({});

  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

  async function handleRewrite(bulletId: string, bulletText: string) {
    if (rewrites[bulletId]) return; // already fetched
    setRewriting(prev => ({ ...prev, [bulletId]: true }));
    setRewriteError(prev => ({ ...prev, [bulletId]: "" }));

    try {
      const token = await getToken();
      const res = await fetch(`${apiUrl}/api/v1/ai/rewrite-bullet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bullet_text: bulletText, mode: "kind" }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.detail ?? "Rewrite failed");
      }

      const data = await res.json();
      setRewrites(prev => ({ ...prev, [bulletId]: data.rewrites }));
    } catch (e: unknown) {
      setRewriteError(prev => ({
        ...prev,
        [bulletId]: e instanceof Error ? e.message : "Rewrite failed",
      }));
    } finally {
      setRewriting(prev => ({ ...prev, [bulletId]: false }));
    }
  }

  return (
    <div className="rounded-xl border border-white/8 bg-[#111111] p-5">
      <h3 className="text-sm font-medium text-white mb-1">Bullet Point Analysis</h3>
      <p className="text-xs text-white/40 mb-4">
        {bullets.length} bullets analyzed · expand any to get AI rewrites
      </p>

      <div className="space-y-2">
        {bullets.map((b) => {
          const imp = impactConfig[b.impactLevel];
          const isOpen = expanded === b.bulletId;
          const bulletRewrites = rewrites[b.bulletId];
          const isRewriting = rewriting[b.bulletId];
          const error = rewriteError[b.bulletId];

          return (
            <div key={b.bulletId}
              className={cn("rounded-lg border transition-all", imp.border,
                b.impactLevel === "LOW" ? "bg-red-500/3" :
                b.impactLevel === "HIGH" ? "bg-emerald-500/3" : "bg-[#1A1A1A]"
              )}>
              {/* Header row */}
              <button
                onClick={() => setExpanded(isOpen ? null : b.bulletId)}
                className="w-full flex items-start gap-3 p-3 text-left hover:bg-white/2 transition-colors rounded-lg"
              >
                <span className={cn("mt-0.5 flex-shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded", imp.bg, imp.color)}>
                  {b.impactLevel}
                </span>
                <span className="flex-1 text-sm text-white/80 leading-relaxed">{b.original}</span>
                <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
                  <ScoreBadge score={b.confidenceScore} />
                  <ChevronDown className={cn("w-3.5 h-3.5 text-white/30 transition-transform duration-200", isOpen && "rotate-180")} />
                </div>
              </button>

              {/* Expanded */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 pb-3 border-t border-white/5">
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 my-3">
                        {b.passivePhrases.map((p) => (
                          <span key={p} className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-300">
                            &quot;{p}&quot; passive
                          </span>
                        ))}
                        {!b.hasQuantification && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300">
                            No metrics
                          </span>
                        )}
                      </div>

                      {/* Rewrite button */}
                      {!bulletRewrites && (
                        <button
                          onClick={() => handleRewrite(b.bulletId, b.original)}
                          disabled={isRewriting}
                          className="flex items-center gap-2 text-xs bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-400 hover:text-indigo-300 px-3 py-1.5 rounded-lg font-medium transition-all disabled:opacity-50"
                        >
                          {isRewriting ? (
                            <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Rewriting...</>
                          ) : (
                            <><Wand2 className="w-3.5 h-3.5" /> Rewrite with AI</>
                          )}
                        </button>
                      )}

                      {/* Error */}
                      {error && (
                        <p className="text-xs text-red-400 mt-2">{error}</p>
                      )}

                      {/* Rewrites */}
                      {bulletRewrites && bulletRewrites.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-medium text-white/60">AI Rewrites</p>
                            <button
                              onClick={() => {
                                setRewrites(prev => { const n = {...prev}; delete n[b.bulletId]; return n; });
                              }}
                              className="text-[10px] text-white/30 hover:text-white/60 transition-colors"
                            >
                              refresh
                            </button>
                          </div>
                          {bulletRewrites.map((r, i) => (
                            <RewriteCard key={i} rewrite={r} index={i} />
                          ))}
                        </div>
                      )}
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