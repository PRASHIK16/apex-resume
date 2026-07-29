"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { Upload, FileText, Zap, Trash2, Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Resume {
  id: string;
  original_filename: string;
  file_type: string;
  parse_status: string;
  created_at: string;
}

function ResumeCard({ resume, onDelete }: { resume: Resume; onDelete: (id: string) => void }) {
  const [deleting, setDeleting] = useState(false);
  const { getToken } = useAuth();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

  const statusConfig = {
    complete: { icon: CheckCircle2, color: "text-green-400", bg: "bg-green-400/10", label: "Parsed" },
    pending:  { icon: Loader2,      color: "text-amber-400", bg: "bg-amber-400/10", label: "Processing" },
    failed:   { icon: XCircle,      color: "text-red-400",   bg: "bg-red-400/10",   label: "Failed" },
  };
  const s = statusConfig[resume.parse_status as keyof typeof statusConfig] ?? statusConfig.pending;

  async function handleDelete() {
    if (!confirm("Delete this resume?")) return;
    setDeleting(true);
    try {
      const token = await getToken();
      await fetch(`${apiUrl}/api/v1/resumes/${resume.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      onDelete(resume.id);
    } catch { setDeleting(false); }
  }

  const name = resume.original_filename ?? `resume.${resume.file_type}`;
  const date = new Date(resume.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="group rounded-xl border border-white/8 bg-[#111111] p-5 hover:border-white/16 transition-all">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-white truncate max-w-[200px]">{name}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <Clock className="w-3 h-3 text-white/30" />
              <span className="text-xs text-white/30">{date}</span>
            </div>
          </div>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-all"
        >
          {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className={cn("inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full font-medium", s.bg, s.color)}>
          <s.icon className={cn("w-3 h-3", resume.parse_status === "pending" && "animate-spin")} />
          {s.label}
        </span>
        <span className="text-xs px-2 py-1 rounded-full bg-white/5 text-white/40 uppercase font-medium">
          {resume.file_type}
        </span>
      </div>

      <div className="flex gap-2">
        <Link href={`/resume/${resume.id}/analyze`}
          className="flex-1 flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors">
          <Zap className="w-3.5 h-3.5" /> Analyze
        </Link>
        <Link href={`/resume/${resume.id}`}
          className="flex items-center justify-center gap-2 border border-white/10 hover:border-white/20 text-white/60 hover:text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors">
          View
        </Link>
      </div>
    </div>
  );
}

export default function ResumesPage() {
  const { getToken } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

  useEffect(() => { fetchResumes(); }, []);

  async function fetchResumes() {
    try {
      const token = await getToken();
      const res = await fetch(`${apiUrl}/api/v1/resumes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setResumes(data.resumes ?? []);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-1">My Resumes</h1>
          <p className="text-white/40 text-sm">{resumes.length} resume{resumes.length !== 1 ? "s" : ""} uploaded</p>
        </div>
        <Link href="/resume/upload"
          className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">
          <Upload className="w-4 h-4" /> Upload New
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => (
            <div key={i} className="rounded-xl border border-white/8 bg-[#111111] p-5 h-44">
              <div className="shimmer rounded-lg h-10 w-10 mb-4" />
              <div className="shimmer rounded h-4 w-3/4 mb-2" />
              <div className="shimmer rounded h-3 w-1/2 mb-4" />
              <div className="shimmer rounded-lg h-8 w-full" />
            </div>
          ))}
        </div>
      ) : resumes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-[#0D0D0D] p-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-5">
            <Upload className="w-7 h-7 text-indigo-400" />
          </div>
          <h3 className="text-base font-medium text-white mb-2">No resumes yet</h3>
          <p className="text-white/40 text-sm mb-6">Upload your first resume to get an AI-powered analysis.</p>
          <Link href="/resume/upload"
            className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors">
            Upload Resume
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resumes.map(r => (
            <ResumeCard key={r.id} resume={r} onDelete={id => setResumes(prev => prev.filter(r => r.id !== id))} />
          ))}
        </div>
      )}
    </div>
  );
}