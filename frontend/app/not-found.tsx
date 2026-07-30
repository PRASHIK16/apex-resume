import Link from "next/link";
import { Zap, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center px-6 text-center">
      <div className="w-14 h-14 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <Zap className="w-7 h-7 text-indigo-400" />
      </div>
      <p className="text-indigo-400 text-sm font-medium mb-3">404</p>
      <h1 className="text-3xl font-semibold text-white mb-3">Page not found</h1>
      <p className="text-white/40 text-sm mb-8 max-w-sm">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex gap-3">
        <Link href="/dashboard"
          className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">
          Go to Dashboard
        </Link>
        <Link href="/"
          className="flex items-center gap-2 border border-white/10 hover:border-white/20 text-white/60 hover:text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" /> Home
        </Link>
      </div>
    </div>
  );
}