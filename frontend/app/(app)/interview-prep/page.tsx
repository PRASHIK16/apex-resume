"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic2, ChevronDown, ChevronUp, Lightbulb, Target, Brain, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const QUESTION_BANK: Record<string, { category: string; icon: typeof Brain; color: string; questions: string[] }[]> = {
  "Software Engineer": [
    {
      category: "Technical",
      icon: Brain,
      color: "text-indigo-400",
      questions: [
        "Walk me through how you would design a URL shortening service.",
        "Explain the difference between SQL and NoSQL databases. When would you use each?",
        "What is the time complexity of your most complex project algorithm?",
        "How do you ensure code quality in a team environment?",
        "Explain REST vs GraphQL — when would you choose one over the other?",
        "How would you optimize a slow database query?",
        "What is your approach to debugging a production issue at 2 AM?",
      ],
    },
    {
      category: "Behavioral",
      icon: Users,
      color: "text-green-400",
      questions: [
        "Tell me about a time you had to learn a new technology quickly under pressure.",
        "Describe a project where you disagreed with your team's technical decision. What did you do?",
        "Tell me about the most challenging bug you ever fixed.",
        "How do you prioritize tasks when everything seems urgent?",
        "Describe a time you mentored or helped a junior developer.",
      ],
    },
    {
      category: "Resume-Based",
      icon: Target,
      color: "text-amber-400",
      questions: [
        "Walk me through your most impactful project end-to-end.",
        "What is the largest scale system you have built? How many users?",
        "Tell me about a technical decision you regret and what you learned.",
        "How did you measure the impact of your work at your last role?",
        "What technologies are you most proud of mastering?",
      ],
    },
  ],
  "Business Analyst": [
    {
      category: "Analytical",
      icon: Brain,
      color: "text-indigo-400",
      questions: [
        "How would you analyze a 20% drop in user retention?",
        "Walk me through how you would build a business case for a new feature.",
        "How do you prioritize requirements when stakeholders disagree?",
        "Explain how you would define success metrics for a new product launch.",
        "How would you conduct a competitive analysis for our product?",
      ],
    },
    {
      category: "Behavioral",
      icon: Users,
      color: "text-green-400",
      questions: [
        "Tell me about a time you translated complex data into a clear business recommendation.",
        "Describe a situation where you influenced a decision without formal authority.",
        "Tell me about a project where requirements changed midway. How did you handle it?",
        "How do you handle stakeholders who have conflicting requirements?",
      ],
    },
    {
      category: "Resume-Based",
      icon: Target,
      color: "text-amber-400",
      questions: [
        "Describe the most impactful analysis you have ever done.",
        "Walk me through a process improvement you led.",
        "What tools do you use for data analysis and why?",
        "Tell me about a time your analysis directly influenced a major business decision.",
      ],
    },
  ],
  "Product Manager": [
    {
      category: "Product Sense",
      icon: Lightbulb,
      color: "text-purple-400",
      questions: [
        "How would you improve Google Maps for visually impaired users?",
        "Design a feature that increases LinkedIn premium subscriptions by 20%.",
        "How would you decide between two equally promising features?",
        "Walk me through how you define and track product metrics.",
        "How do you validate a product hypothesis with minimal resources?",
      ],
    },
    {
      category: "Behavioral",
      icon: Users,
      color: "text-green-400",
      questions: [
        "Tell me about a product decision you made that failed. What did you learn?",
        "How do you say no to a feature request from a senior stakeholder?",
        "Describe how you worked with engineering to ship a product on time.",
        "Tell me about a time you used data to change a product direction.",
      ],
    },
    {
      category: "Resume-Based",
      icon: Target,
      color: "text-amber-400",
      questions: [
        "What is the product you are most proud of shipping? What was your role?",
        "Tell me about a time you had to make a product decision with incomplete data.",
        "How did you measure the success of your most recent product feature?",
        "Walk me through your product roadmap planning process.",
      ],
    },
  ],
  "Frontend Developer": [
    {
      category: "Technical",
      icon: Brain,
      color: "text-indigo-400",
      questions: [
        "Explain the difference between controlled and uncontrolled components in React.",
        "How do you optimize a React application for performance?",
        "What is the virtual DOM and how does React use it?",
        "Explain CSS specificity and how you manage it in large projects.",
        "How do you handle state management in a large React application?",
        "What is your approach to making a web app accessible (a11y)?",
        "Explain how you would implement infinite scroll.",
      ],
    },
    {
      category: "Behavioral",
      icon: Users,
      color: "text-green-400",
      questions: [
        "Tell me about a time you improved the performance of a web application.",
        "Describe a challenging UI/UX problem you solved.",
        "How do you ensure cross-browser compatibility in your projects?",
        "Tell me about a time you had to refactor a large codebase.",
      ],
    },
    {
      category: "Resume-Based",
      icon: Target,
      color: "text-amber-400",
      questions: [
        "Walk me through the frontend architecture of your most complex project.",
        "What is the most creative UI you have ever built?",
        "How did you measure frontend performance on your last project?",
        "Tell me about your experience with design systems.",
      ],
    },
  ],
};

const TIPS = [
  "Use the STAR method: Situation, Task, Action, Result.",
  "Always quantify your impact with numbers when possible.",
  "Prepare 3-4 strong stories that can answer multiple behavioral questions.",
  "Research the company's tech stack before the interview.",
  "Ask clarifying questions before answering product/system design questions.",
  "Practice saying your answers out loud — it sounds different than thinking them.",
];

function QuestionItem({ question, index }: { question: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/8 rounded-lg overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-white/3 transition-colors">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-white/30 w-5 flex-shrink-0">{String(index + 1).padStart(2, "0")}</span>
          <span className="text-sm text-white/80">{question}</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-white/30 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-white/30 flex-shrink-0" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
            transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="px-4 pb-4 pt-0 border-t border-white/5">
              <p className="text-xs text-white/40 mt-3 mb-2 font-medium">STAR Framework hint:</p>
              <div className="grid grid-cols-2 gap-2">
                {["Situation: Set the context", "Task: What was your role?", "Action: What did you do?", "Result: What was the impact?"].map(s => (
                  <div key={s} className="bg-white/3 rounded p-2">
                    <p className="text-xs text-white/50">{s}</p>
                  </div>
                ))}
              </div>
              <textarea
                className="mt-3 w-full bg-[#1A1A1A] border border-white/8 rounded-lg p-3 text-sm text-white placeholder-white/20 resize-none focus:outline-none focus:border-indigo-500/40"
                rows={3}
                placeholder="Type your answer here to practice..."
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function InterviewPrepPage() {
  const [selectedRole, setSelectedRole] = useState("Software Engineer");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = QUESTION_BANK[selectedRole] ?? [];
  const totalQuestions = categories.reduce((sum, c) => sum + c.questions.length, 0);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white mb-1">Interview Prep</h1>
        <p className="text-white/40 text-sm">Practice common questions for your target role</p>
      </div>

      {/* Role Selector */}
      <div className="mb-8">
        <p className="text-xs text-white/40 mb-3 font-medium uppercase tracking-wide">Select Target Role</p>
        <div className="flex flex-wrap gap-2">
          {Object.keys(QUESTION_BANK).map(role => (
            <button key={role} onClick={() => { setSelectedRole(role); setActiveCategory(null); }}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                selectedRole === role
                  ? "bg-indigo-500 text-white"
                  : "bg-white/5 text-white/60 hover:text-white hover:bg-white/8 border border-white/8"
              )}>
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="rounded-xl border border-white/8 bg-[#111111] p-4 text-center">
          <p className="text-2xl font-semibold text-white">{totalQuestions}</p>
          <p className="text-xs text-white/40 mt-1">Total Questions</p>
        </div>
        <div className="rounded-xl border border-white/8 bg-[#111111] p-4 text-center">
          <p className="text-2xl font-semibold text-white">{categories.length}</p>
          <p className="text-xs text-white/40 mt-1">Categories</p>
        </div>
        <div className="rounded-xl border border-white/8 bg-[#111111] p-4 text-center">
          <p className="text-2xl font-semibold text-white">~45</p>
          <p className="text-xs text-white/40 mt-1">Min to Practice</p>
        </div>
      </div>

      {/* Tips */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <p className="text-sm font-medium text-amber-300">Pro Tips</p>
        </div>
        <ul className="space-y-1.5">
          {TIPS.map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-white/50">
              <span className="text-amber-400/60 mt-0.5">•</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* Questions by Category */}
      <div className="space-y-4">
        {categories.map(cat => (
          <div key={cat.category} className="rounded-xl border border-white/8 bg-[#111111] overflow-hidden">
            <button
              onClick={() => setActiveCategory(activeCategory === cat.category ? null : cat.category)}
              className="w-full flex items-center justify-between p-5 hover:bg-white/3 transition-colors">
              <div className="flex items-center gap-3">
                <cat.icon className={cn("w-5 h-5", cat.color)} />
                <span className="font-medium text-white">{cat.category}</span>
                <span className="text-xs text-white/30 bg-white/5 px-2 py-0.5 rounded-full">
                  {cat.questions.length} questions
                </span>
              </div>
              {activeCategory === cat.category
                ? <ChevronUp className="w-4 h-4 text-white/30" />
                : <ChevronDown className="w-4 h-4 text-white/30" />}
            </button>
            <AnimatePresence>
              {activeCategory === cat.category && (
                <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
                  transition={{ duration: 0.25 }} className="overflow-hidden">
                  <div className="px-5 pb-5 pt-0 border-t border-white/5 space-y-2">
                    {cat.questions.map((q, i) => (
                      <QuestionItem key={i} question={q} index={i} />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}