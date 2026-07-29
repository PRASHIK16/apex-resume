"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowRight, Upload, FileText, TrendingUp, Zap, Clock } from "lucide-react";

interface Resume {
  id: string;
  original_filename: string;
  file_type: string;
  parse_status: string;
  created_at: string;
}

export default function DashboardPage() {
  const { getToken } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        const res = await fetch(`${apiUrl}/api/v1/resumes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setResumes(data.resumes ?? []);
        }
      } catch {}
      finally { setLoading(false); }
    })();
  }, []);

  const recent = resumes.slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white mb-1">Dashboard</h1>
        <p className="text-white/40 text-sm">Your resume optimization hub</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="rounded-xl border border-white/8 bg-[#111111] p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <FileText className="w-4 h-4 text-indigo-400" />
            </div>
            <span className="text-sm text-white/50">Total Resumes</span>
          </div>
          <p className="text-3xl font-semibold text-white">{loading ? "—" : resumes.length}</p>
        </div>

        <Link href="/resume/upload"
          className="group rounded-xl border border-white/8 bg-[#111111] p-5 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all cursor-pointer">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <Upload className="w-4 h-4 text-indigo-400" />
            </div>
            <span className="text-sm text-white/50">Upload Resume</span>
          </div>
          <p className="text-sm font-medium text-indigo-400 group-hover:text-indigo-300 flex items-center gap-1">
            Upload new <ArrowRight className="w-3.5 h-3.5" />
          </p>
        </Link>

        <Link href="/interview-prep"
          className="group rounded-xl border border-white/8 bg-[#111111] p-5 hover:border-white/16 transition-all cursor-pointer">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <span className="text-sm text-white/50">Interview Prep</span>
          </div>
          <p className="text-sm font-medium text-white/60 group-hover:text-white flex items-center gap-1">
            Practice now <ArrowRight className="w-3.5 h-3.5" />
          </p>
        </Link>
      </div>

      {/* Recent Resumes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-medium text-white">Recent Resumes</h2>
          {resumes.length > 0 && (
            <Link href="/resume" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
              View all →
            </Link>
          )}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1,2].map(i => <div key={i} className="shimmer rounded-xl h-16" />)}
          </div>
        ) : recent.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-[#0D0D0D] p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-4">
              <Upload className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-sm font-medium text-white mb-1">Upload your first resume</h3>
            <p className="text-white/40 text-xs mb-4">Get AI-powered ATS analysis and specific improvement tips.</p>
            <Link href="/resume/upload"
              className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">
              Upload Resume <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recent.map(r => (
              <div key={r.id} className="flex items-center justify-between p-4 rounded-xl border border-white/8 bg-[#111111] hover:border-white/16 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{r.original_filename ?? `resume.${r.file_type}`}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-white/30" />
                      <span className="text-xs text-white/30">
                        {new Date(r.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </span>
                    </div>
                  </div>
                </div>
                <Link href={`/resume/${r.id}/analyze`}
                  className="flex items-center gap-2 bg-indigo-500/10 hover:bg-indigo-500 border border-indigo-500/20 hover:border-indigo-500 text-indigo-400 hover:text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all">
                  <Zap className="w-3.5 h-3.5" /> Analyze
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}