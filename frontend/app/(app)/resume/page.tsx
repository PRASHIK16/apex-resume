import Link from "next/link";
import { Upload, ArrowRight } from "lucide-react";

export default function ResumesPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-1">My Resumes</h1>
          <p className="text-white/40 text-sm">All your resume versions in one place</p>
        </div>
        <Link href="/resume/upload"
          className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">
          <Upload className="w-4 h-4" /> Upload New
        </Link>
      </div>

      <div className="rounded-2xl border border-dashed border-white/10 bg-[#0D0D0D] p-16 text-center">
        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5">
          <Upload className="w-7 h-7 text-white/40" />
        </div>
        <h3 className="text-base font-medium text-white mb-2">No resumes yet</h3>
        <p className="text-white/40 text-sm mb-6">Upload your first resume to get started with AI analysis.</p>
        <Link href="/resume/upload"
          className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors">
          Upload your first resume <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
