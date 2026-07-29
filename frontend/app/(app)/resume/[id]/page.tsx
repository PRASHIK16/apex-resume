"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowLeft, FileText, Zap, Calendar, HardDrive, CheckCircle2, XCircle, Clock, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Resume {
  id: string;
  original_filename: string;
  file_type: string;
  file_size_bytes: number;
  parse_status: string;
  created_at: string;
}

interface PastAnalysis {
  id: string;
  overall_score: number | null;
  status: string;
  created_at: string;
}

function ScorePill({ score }: { score: number }) {
  const color = score >= 85 ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
    : score >= 70 ? "text-lime-400 bg-lime-400/10 border-lime-400/20"
    : score >= 50 ? "text-amber-400 bg-amber-400/10 border-amber-400/20"
    : "text-red-400 bg-red-400/10 border-red-400/20";
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border", color)}>
      <TrendingUp className="w-3 h-3" /> {score}/100
    </span>
  );
}

export default function ResumeDetailPage({ params }: { params: { id: string } }) {
  const { getToken } = useAuth();
  const [resume, setResume] = useState<Resume | null>(null);
  const [analyses, setAnalyses] = useState<PastAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        const [rRes, aRes] = await Promise.all([
          fetch(`${apiUrl}/api/v1/resumes/${params.id}`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${apiUrl}/api/v1/analyses/by-resume/${params.id}`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        if (rRes.ok) setResume(await rRes.json());
        if (aRes.ok) {
          const aData = await aRes.json();
          setAnalyses(aData.analyses ?? []);
        }
      } catch {}
      finally { setLoading(false); }
    })();
  }, [params.id]);

  const formatBytes = (b?: number) => {
    if (!b) return "—";
    return b < 1024 * 1024 ? `${(b / 1024).toFixed(1)} KB` : `${(b / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="shimmer h-8 w-48 rounded-lg" />
        <div className="shimmer h-32 rounded-xl" />
        <div className="shimmer h-24 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link href="/resume" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Resumes
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white mb-1">
              {resume?.original_filename ?? "Resume Detail"}
            </h1>
            <p className="text-white/40 text-sm">View details and analysis history</p>
          </div>
          <Link href={`/resume/${params.id}/analyze`}
            className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors">
            <Zap className="w-4 h-4" /> Run Analysis
          </Link>
        </div>
      </div>

      {/* Resume Info */}
      <div className="rounded-xl border border-white/8 bg-[#111111] p-6 mb-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <FileText className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <p className="font-medium text-white">{resume?.original_filename ?? "resume"}</p>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs uppercase font-medium px-2 py-0.5 rounded bg-white/5 text-white/40">
                {resume?.file_type ?? "pdf"}
              </span>
              {resume?.parse_status === "complete" ? (
                <span className="text-xs text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Parsed successfully
                </span>
              ) : resume?.parse_status === "failed" ? (
                <span className="text-xs text-red-400 flex items-center gap-1">
                  <XCircle className="w-3 h-3" /> Parse failed
                </span>
              ) : (
                <span className="text-xs text-amber-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Processing
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: HardDrive, label: "File Size", value: formatBytes(resume?.file_size_bytes) },
            { icon: Calendar, label: "Uploaded", value: resume?.created_at ? new Date(resume.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—" },
            { icon: TrendingUp, label: "Analyses", value: `${analyses.length}` },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-[#1A1A1A] rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Icon className="w-3.5 h-3.5 text-white/30" />
                <span className="text-xs text-white/40">{label}</span>
              </div>
              <p className="text-sm font-medium text-white">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Analysis History */}
      <div className="rounded-xl border border-white/8 bg-[#111111] p-6">
        <h2 className="text-sm font-medium text-white mb-4">Analysis History</h2>
        {analyses.length === 0 ? (
          <div className="text-center py-8">
            <Zap className="w-8 h-8 text-white/20 mx-auto mb-3" />
            <p className="text-sm text-white/40 mb-1">No analyses yet</p>
            <p className="text-xs text-white/25 mb-4">Run your first analysis to get an ATS score</p>
            <Link href={`/resume/${params.id}/analyze`}
              className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors">
              <Zap className="w-4 h-4" /> Analyze Now →
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {analyses.map((a) => (
              <div key={a.id} className="flex items-center justify-between p-3 rounded-lg bg-[#1A1A1A] border border-white/5">
                <div className="flex items-center gap-3">
                  <div className={cn("w-2 h-2 rounded-full",
                    a.status === "complete" ? "bg-emerald-400" :
                    a.status === "failed" ? "bg-red-400" : "bg-amber-400"
                  )} />
                  <div>
                    <p className="text-xs text-white/60">
                      {new Date(a.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                    <p className="text-[10px] text-white/30 capitalize mt-0.5">{a.status}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {a.overall_score !== null && a.status === "complete" && (
                    <ScorePill score={a.overall_score} />
                  )}
                  {a.status === "complete" && (
                    <Link href={`/resume/${params.id}/analyze`}
                      className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                      Re-analyze →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}