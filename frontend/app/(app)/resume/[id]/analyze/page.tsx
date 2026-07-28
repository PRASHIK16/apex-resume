"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ScoreReveal from "@/components/analysis/ScoreReveal";
import ScoreBreakdown from "@/components/analysis/ScoreBreakdown";
import RejectionRadar from "@/components/analysis/RejectionRadar";
import BulletAnalyzer from "@/components/analysis/BulletAnalyzer";
import AnalysisLoader from "@/components/analysis/AnalysisLoader";

// Mock data for UI development — replace with real API call
const MOCK_ANALYSIS = {
  overallScore: 74,
  atsKeywordScore: 71,
  atsFormatScore: 88,
  contentQualityScore: 76,
  confidenceScore: 61,
  impactScore: 68,
  readabilityScore: 82,
  rejectionRisks: [
    {
      riskTitle: "Passive language throughout",
      specificText: "Worked on developing the payment infrastructure",
      whyItHurts: "Passive phrasing signals lack of ownership to senior reviewers",
      severity: "HIGH" as const,
      fix: "Replace 'Worked on' with 'Architected' or 'Built and owned'",
    },
    {
      riskTitle: "Missing quantification",
      specificText: "Improved team performance",
      whyItHurts: "Vague impact claims are ignored — recruiters want numbers",
      severity: "HIGH" as const,
      fix: "Add metrics: 'Improved team velocity by 34%' or 'Reduced deploy time by 45 minutes'",
    },
    {
      riskTitle: "No LinkedIn URL in contact section",
      specificText: "Contact section",
      whyItHurts: "Recruiters verify candidates on LinkedIn — missing it raises doubt",
      severity: "MEDIUM" as const,
      fix: "Add your LinkedIn profile URL to the contact section header",
    },
  ],
  bulletAnalyses: [
    {
      bulletId: "b1", original: "Worked on developing the payment infrastructure",
      confidenceScore: 22, impactLevel: "LOW" as const, hasQuantification: false,
      passivePhrases: ["Worked on"],
    },
    {
      bulletId: "b2", original: "Led migration of monolith to microservices for 500K user product",
      confidenceScore: 91, impactLevel: "HIGH" as const, hasQuantification: true,
      passivePhrases: [],
    },
    {
      bulletId: "b3", original: "Helped with onboarding new team members",
      confidenceScore: 18, impactLevel: "LOW" as const, hasQuantification: false,
      passivePhrases: ["Helped with"],
    },
  ],
};

export default async function AnalyzePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [loading, setLoading] = useState(false);
  const analysis = MOCK_ANALYSIS;

  if (loading) return <AnalysisLoader />;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <Link href={`/resume/${params.id}`} className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Resume
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white mb-1">Analysis Results</h1>
            <p className="text-white/40 text-sm">AI-powered resume analysis · 6 dimensions scored</p>
          </div>
        </div>
      </div>

      {/* Score Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        <div className="lg:col-span-1">
          <ScoreReveal score={analysis.overallScore} />
        </div>
        <div className="lg:col-span-2">
          <ScoreBreakdown
            scores={{
              atsKeyword: analysis.atsKeywordScore,
              atsFormat: analysis.atsFormatScore,
              contentQuality: analysis.contentQualityScore,
              confidence: analysis.confidenceScore,
              impact: analysis.impactScore,
              readability: analysis.readabilityScore,
            }}
          />
        </div>
      </div>

      {/* Rejection Radar */}
      <div className="mb-5">
        <RejectionRadar risks={analysis.rejectionRisks} />
      </div>

      {/* Bullet Analyzer */}
      <BulletAnalyzer bullets={analysis.bulletAnalyses} />
    </div>
  );
}
