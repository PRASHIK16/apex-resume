import Link from "next/link";
import { ArrowLeft, Zap } from "lucide-react";

export default async function ResumeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link href="/resume" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Resumes
        </Link>
        <h1 className="text-2xl font-semibold text-white mb-2">Resume Detail</h1>
        <p className="text-white/40 text-sm">Resume ID: {params.id}</p>
      </div>

      <div className="flex gap-3 mb-8">
        <Link href={`/resume/${params.id}/analyze`}
          className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors">
          <Zap className="w-4 h-4" /> Run AI Analysis
        </Link>
      </div>

      <div className="rounded-xl border border-white/8 bg-[#111111] p-8 text-center">
        <p className="text-white/40 text-sm">Resume preview will appear here once your backend is connected.</p>
      </div>
    </div>
  );
}
