"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

type State = "idle" | "uploading" | "success" | "error";

export default function UploadDropzone() {
  const [state, setState] = useState<State>("idle");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const [progress, setProgress] = useState(0);
  const router = useRouter();
  const { getToken } = useAuth();

  const onDrop = useCallback(
    async (accepted: File[]) => {
      if (!accepted.length) return;
      const f = accepted[0];
      setFile(f);
      setState("uploading");
      setError("");
      setProgress(0);

      try {
        const token = await getToken();
        if (!token) throw new Error("Not authenticated");

        // Progress simulation while uploading
        const progressInterval = setInterval(() => {
          setProgress((p) => Math.min(p + 10, 85));
        }, 200);

        const formData = new FormData();
        formData.append("file", f);

        const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
        const res = await fetch(`${apiUrl}/api/v1/resumes/upload`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        clearInterval(progressInterval);

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body?.detail ?? "Upload failed");
        }

        const data = await res.json();
        setProgress(100);
        setState("success");

        // Redirect to resume detail page after short delay
        setTimeout(() => {
          router.push(`/resume/${data.resume_id}`);
        }, 1500);
      } catch (err: unknown) {
        setState("error");
        setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
      }
    },
    [getToken, router]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    disabled: state === "uploading" || state === "success",
  });

  const formatBytes = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const reset = () => {
    setState("idle");
    setFile(null);
    setError("");
    setProgress(0);
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "relative rounded-2xl border-2 border-dashed p-12 text-center cursor-pointer transition-all duration-200",
          isDragActive
            ? "border-indigo-500 bg-indigo-500/5"
            : state === "success"
            ? "border-green-500/40 bg-green-500/5 cursor-default"
            : state === "error"
            ? "border-red-500/40 bg-red-500/5 cursor-pointer"
            : "border-white/10 bg-[#0D0D0D] hover:border-white/20 hover:bg-[#111111]"
        )}
      >
        <input {...getInputProps()} />

        <AnimatePresence mode="wait">
          {state === "idle" && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors",
                isDragActive
                  ? "bg-indigo-500/20 border border-indigo-500/40"
                  : "bg-white/5 border border-white/10"
              )}>
                <Upload className={cn("w-7 h-7", isDragActive ? "text-indigo-400" : "text-white/40")} />
              </div>
              <p className="text-base font-medium text-white mb-2">
                {isDragActive ? "Drop it here" : "Drop your resume here"}
              </p>
              <p className="text-sm text-white/40 mb-4">or click to browse</p>
              <div className="flex items-center justify-center gap-3 text-xs text-white/30">
                <span className="px-2 py-1 rounded bg-white/5 border border-white/8">PDF</span>
                <span className="px-2 py-1 rounded bg-white/5 border border-white/8">DOCX</span>
                <span>Up to 10MB</span>
              </div>
            </motion.div>
          )}

          {state === "uploading" && (
            <motion.div key="uploading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-7 h-7 text-indigo-400" />
              </div>
              <p className="text-base font-medium text-white mb-1">{file?.name}</p>
              <p className="text-sm text-white/40 mb-5">{file ? formatBytes(file.size) : ""}</p>
              <div className="w-48 mx-auto h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-indigo-500 rounded-full"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-xs text-white/30 mt-3">
                {progress < 90 ? "Uploading..." : "Parsing your resume..."}
              </p>
            </motion.div>
          )}

          {state === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-7 h-7 text-green-400" />
              </div>
              <p className="text-base font-medium text-white mb-1">Upload complete!</p>
              <p className="text-sm text-white/40">Redirecting to your resume...</p>
            </motion.div>
          )}

          {state === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-7 h-7 text-red-400" />
              </div>
              <p className="text-base font-medium text-white mb-1">Upload failed</p>
              <p className="text-sm text-white/40 mb-4">{error}</p>
              <button
                onClick={(e) => { e.stopPropagation(); reset(); }}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
              >
                Try again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {fileRejections.length > 0 && (
        <div className="flex items-start gap-3 p-3 rounded-lg bg-red-500/8 border border-red-500/20">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-300">File not accepted</p>
            <p className="text-xs text-white/50 mt-0.5">
              {fileRejections[0]?.errors[0]?.message ?? "Please upload a PDF or DOCX file under 10MB"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}