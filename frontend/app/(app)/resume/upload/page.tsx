"use client";

import UploadDropzone from "@/components/resume/UploadDropzone";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function UploadPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-semibold text-white mb-2">Upload Resume</h1>
        <p className="text-white/40 text-sm">We support PDF and DOCX formats up to 10MB.</p>
      </div>
      <UploadDropzone />
    </div>
  );
}
