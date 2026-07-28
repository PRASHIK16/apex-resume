"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight, Shield, Zap, TrendingUp, Eye, PenTool, Users, ChevronRight,
} from "lucide-react";

const features = [
  {
    icon: Shield, title: "Rejection Risk Radar",
    description: "Uncover the hidden red flags causing silent rejections — and fix them before you apply.",
    color: "#EF4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)",
  },
  {
    icon: Zap, title: "ATS Score Engine",
    description: "See exactly how ATS systems score your resume with keyword analysis and format checks.",
    color: "#6366F1", bg: "rgba(99,102,241,0.08)", border: "rgba(99,102,241,0.2)",
  },
  {
    icon: TrendingUp, title: "Confidence Language Score",
    description: "Transform 'helped with' and 'was responsible for' into powerful ownership statements.",
    color: "#22C55E", bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.2)",
  },
  {
    icon: Eye, title: "7-Second Scan Simulation",
    description: "Watch how a recruiter actually sees your resume — what they notice and what they miss.",
    color: "#F59E0B", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)",
  },
  {
    icon: PenTool, title: "AI Bullet Rewriter",
    description: "Upgrade every weak bullet to a measurable, impactful achievement in one click.",
    color: "#8B5CF6", bg: "rgba(139,92,246,0.08)", border: "rgba(139,92,246,0.2)",
  },
  {
    icon: Users, title: "Peer Benchmarking",
    description: "Know exactly where you rank vs other candidates applying for the same role.",
    color: "#06B6D4", bg: "rgba(6,182,212,0.08)", border: "rgba(6,182,212,0.2)",
  },
];

const steps = [
  { step: "01", title: "Upload your resume", description: "Drop your PDF or DOCX. We parse every section, bullet, and detail instantly." },
  { step: "02", title: "AI analyzes everything", description: "50+ data points across 6 dimensions. ATS compatibility, language confidence, keyword gaps, and more." },
  { step: "03", title: "Optimize and get hired", description: "Get specific fixes, rewrite weak bullets, and watch your score climb in real time." },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white overflow-x-hidden">
      {/* NAV */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#0A0A0A]/90 backdrop-blur-md border-b border-white/8" : "bg-transparent"}`}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-semibold">apex</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-white/60 hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-white/60 hover:text-white transition-colors">How it works</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/sign-in" className="text-sm text-white/60 hover:text-white transition-colors px-3 py-1.5">Sign in</Link>
            <Link href="/sign-up" className="text-sm bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            AI-Powered Resume Intelligence
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-semibold tracking-tight leading-[1.1] mb-6">
            Don&apos;t just pass the ATS.
            <br />
            <span className="gradient-text">Make humans remember you.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload your resume, paste any job description, and get specific AI-powered feedback on exactly what&apos;s holding you back — and how to fix it in minutes.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
            <Link href="/sign-up" className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white px-6 py-3 rounded-xl font-medium text-base transition-all hover:scale-[1.02] active:scale-[0.98]">
              Analyze My Resume Free <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#how-it-works" className="flex items-center gap-2 text-white/60 hover:text-white border border-white/10 hover:border-white/20 px-6 py-3 rounded-xl font-medium text-base transition-all">
              See How It Works <ChevronRight className="w-4 h-4" />
            </a>
          </motion.div>

          {/* Score Card Preview */}
          <motion.div initial={{ opacity: 0, y: 40, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.7, delay: 0.4 }}
            className="relative mx-auto max-w-xl">
            <div className="rounded-2xl border border-white/10 bg-[#111111] p-6 text-left"
              style={{ boxShadow: "0 0 80px rgba(99,102,241,0.12), 0 20px 60px rgba(0,0,0,0.5)" }}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-xs text-white/40 mb-1">Resume Analysis Complete</p>
                  <p className="text-sm font-medium">software_engineer_resume.pdf</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-light tabular-nums">87</div>
                  <div className="text-xs text-white/40">/100</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2.5 mb-4">
                {[
                  { label: "ATS Score", value: 82, color: "#6366F1" },
                  { label: "Content Quality", value: 91, color: "#22C55E" },
                  { label: "Confidence", value: 74, color: "#F59E0B" },
                  { label: "Impact Score", value: 88, color: "#8B5CF6" },
                ].map((item) => (
                  <div key={item.label} className="bg-[#1A1A1A] rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-white/50">{item.label}</span>
                      <span className="text-xs font-medium">{item.value}</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${item.value}%` }}
                        transition={{ duration: 1, delay: 0.9, ease: "easeOut" }}
                        className="h-full rounded-full" style={{ backgroundColor: item.color }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-start gap-3 bg-red-500/8 border border-red-500/20 rounded-lg p-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-red-300 mb-0.5">Rejection Risk Detected</p>
                  <p className="text-xs text-white/40">7 bullets use passive language — replace &quot;Worked on&quot; with owned &amp; led</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-12 px-6 border-y border-white/5">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-6 text-center">
          {[
            { value: "50K+", label: "Resumes Analyzed" },
            { value: "+40 pts", label: "Avg Score Improvement" },
            { value: "3×", label: "Higher Interview Rate" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}>
              <div className="text-3xl font-semibold mb-1">{s.value}</div>
              <div className="text-sm text-white/40">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm text-indigo-400 font-medium mb-3">Features</p>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">Everything your resume needs to win</h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Apex doesn&apos;t just count keywords. It analyzes your resume the way both ATS systems and human recruiters actually do.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }}
                className="rounded-xl border p-5 transition-all duration-200 hover:-translate-y-0.5"
                style={{ background: f.bg, borderColor: f.border }}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-4"
                  style={{ background: f.bg, border: `1px solid ${f.border}` }}>
                  <f.icon className="w-5 h-5" style={{ color: f.color }} />
                </div>
                <h3 className="font-medium text-white mb-2">{f.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm text-indigo-400 font-medium mb-3">How it works</p>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">From upload to hired in minutes</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <motion.div key={s.step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.15 }} className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-indigo-400 font-mono text-sm">{s.step}</span>
                </div>
                <h3 className="font-medium text-white mb-2">{s.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{s.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-12">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">Ready to get the job?</h2>
            <p className="text-white/50 mb-8 text-lg">Join thousands of job seekers who optimized their way to more interviews.</p>
            <Link href="/sign-up" className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white px-8 py-3.5 rounded-xl font-medium text-base transition-all hover:scale-[1.02]">
              Analyze My Resume Free <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-white/30 text-sm mt-4">No credit card required · 3 free analyses per month</p>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-500 rounded-md flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold">apex</span>
          </div>
          <p className="text-sm text-white/30">Built for job seekers everywhere</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-sm text-white/40 hover:text-white/60 transition-colors">Privacy</Link>
            <Link href="/terms" className="text-sm text-white/40 hover:text-white/60 transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
