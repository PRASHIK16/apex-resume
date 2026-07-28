import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { ArrowRight, Upload, FileText, TrendingUp } from "lucide-react";

export default async function DashboardPage() {
  const { userId } = await auth();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white mb-1">Dashboard</h1>
        <p className="text-white/40 text-sm">Your resume optimization hub</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link href="/resume/upload"
          className="group flex items-center gap-4 p-5 rounded-xl border border-white/8 bg-[#111111] hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
            <Upload className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <p className="font-medium text-white text-sm">Upload Resume</p>
            <p className="text-xs text-white/40">PDF or DOCX</p>
          </div>
          <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-indigo-400 ml-auto transition-colors" />
        </Link>

        <Link href="/resume"
          className="group flex items-center gap-4 p-5 rounded-xl border border-white/8 bg-[#111111] hover:border-white/16 transition-all">
          <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-white/60" />
          </div>
          <div>
            <p className="font-medium text-white text-sm">My Resumes</p>
            <p className="text-xs text-white/40">View and manage</p>
          </div>
          <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white/60 ml-auto transition-colors" />
        </Link>

        <div className="flex items-center gap-4 p-5 rounded-xl border border-white/8 bg-[#111111]">
          <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <p className="font-medium text-white text-sm">Score Progress</p>
            <p className="text-xs text-white/40">No data yet</p>
          </div>
        </div>
      </div>

      {/* Empty state */}
      <div className="rounded-2xl border border-dashed border-white/10 bg-[#0D0D0D] p-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-5">
          <Upload className="w-8 h-8 text-indigo-400" />
        </div>
        <h3 className="text-lg font-medium text-white mb-2">Upload your first resume</h3>
        <p className="text-white/40 text-sm max-w-sm mx-auto mb-6">
          Get your AI-powered analysis with ATS score, rejection risks, and specific improvement recommendations.
        </p>
        <Link href="/resume/upload"
          className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors">
          Upload Resume <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
