"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import ScoreReveal from "@/components/analysis/ScoreReveal";
import ScoreBreakdown from "@/components/analysis/ScoreBreakdown";
import RejectionRadar from "@/components/analysis/RejectionRadar";
import BulletAnalyzer from "@/components/analysis/BulletAnalyzer";
import AnalysisLoader from "@/components/analysis/AnalysisLoader";

interface AnalysisData {
  id: string;
  status: string;
  overall_score: number;
  ats_keyword_score: number;
  ats_format_score: number;
  content_quality_score: number;
  confidence_score: number;
  impact_score: number;
  readability_score: number;
  rejection_risks: Array<{
    riskTitle: string;
    specificText: string;
    whyItHurts: string;
    severity: "HIGH" | "MEDIUM" | "LOW";
    fix: string;
  }>;
  bullet_analyses: Array<{
    bulletId: string;
    original: string;
    confidenceScore: number;
    impactLevel: "HIGH" | "MEDIUM" | "LOW";
    hasQuantification: boolean;
    passivePhrases: string[];
  }>;
}

export default function AnalyzePageClient({ id }: { id: string }) {
  const { getToken } = useAuth();
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState("Starting analysis...");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

  useEffect(() => {
    startAnalysis();
  }, [id]);

  async function startAnalysis() {
    try {
      setLoading(true);
      setError("");
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");

      // Step 1: Create analysis
      setStatusMessage("Creating analysis job...");
      const createRes = await fetch(`${apiUrl}/api/v1/analyses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ resume_id: id, mode: "kind" }),
      });

      if (!createRes.ok) {
        const err = await createRes.json().catch(() => ({}));
        throw new Error(err?.detail ?? "Failed to start analysis");
      }

      const { analysis_id } = await createRes.json();

      // Step 2: Poll for completion
      setStatusMessage("Analyzing your resume...");
      let attempts = 0;
      const maxAttempts = 60;

      while (attempts < maxAttempts) {
        await new Promise((r) => setTimeout(r, 3000));
        attempts++;

        const statusRes = await fetch(
          `${apiUrl}/api/v1/analyses/${analysis_id}/status`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!statusRes.ok) continue;
        const statusData = await statusRes.json();

        if (statusData.status === "complete") {
          setStatusMessage("Fetching results...");
          const resultRes = await fetch(
            `${apiUrl}/api/v1/analyses/${analysis_id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const result = await resultRes.json();
          setAnalysis(result);
          setLoading(false);
          return;
        }

        if (statusData.status === "failed") {
          throw new Error("Analysis failed — please try again");
        }

        const messages = [
          "Reading your resume...",
          "Extracting sections and bullets...",
          "Running ATS compatibility checks...",
          "Scoring language confidence...",
          "Identifying rejection risks...",
          "Calculating overall score...",
        ];
        setStatusMessage(messages[attempts % messages.length]);
      }

      throw new Error("Analysis timed out — please try again");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Analysis failed");
      setLoading(false);
    }
  }

  if (loading) return <AnalysisLoader />;

  if (error) {
    return (
      <div className="max-w-5xl mx-auto">
        <Link
          href={`/resume/${id}`}
          className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Resume
        </Link>
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-8 text-center">
          <p className="text-red-400 font-medium mb-2">Analysis Failed</p>
          <p className="text-white/40 text-sm mb-4">{error}</p>
          <button
            onClick={startAnalysis}
            className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <Link
          href={`/resume/${id}`}
          className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Resume
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white mb-1">
              Analysis Results
            </h1>
            <p className="text-white/40 text-sm">
              AI-powered resume analysis · 6 dimensions scored
            </p>
          </div>
          <button
            onClick={startAnalysis}
            className="flex items-center gap-2 text-white/40 hover:text-white text-xs border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-lg transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Re-analyze
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        <div className="lg:col-span-1">
          <ScoreReveal score={analysis.overall_score ?? 0} />
        </div>
        <div className="lg:col-span-2">
          <ScoreBreakdown
            scores={{
              atsKeyword: analysis.ats_keyword_score ?? 0,
              atsFormat: analysis.ats_format_score ?? 0,
              contentQuality: analysis.content_quality_score ?? 0,
              confidence: analysis.confidence_score ?? 0,
              impact: analysis.impact_score ?? 0,
              readability: analysis.readability_score ?? 0,
            }}
          />
        </div>
      </div>

      {analysis.rejection_risks?.length > 0 && (
        <div className="mb-5">
          <RejectionRadar risks={analysis.rejection_risks} />
        </div>
      )}

      {analysis.bullet_analyses?.length > 0 && (
        <BulletAnalyzer
          bullets={analysis.bullet_analyses.map((b) => ({
            bulletId: b.bulletId,
            original: b.original,
            confidenceScore: b.confidenceScore,
            impactLevel: b.impactLevel,
            hasQuantification: b.hasQuantification,
            passivePhrases: b.passivePhrases,
          }))}
        />
      )}
    </div>
  );
}