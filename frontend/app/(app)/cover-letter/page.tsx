"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PenTool, Copy, Check, Download, Wand2 } from "lucide-react";

const TEMPLATES = {
  "Software Engineer": `Dear Hiring Manager,

I am excited to apply for the {role} position at {company}. With my background in full-stack development and a proven track record of building scalable web applications, I am confident I would be a strong addition to your engineering team.

In my recent projects, I have developed end-to-end solutions using React, Node.js, and cloud platforms, delivering measurable impact — including a {achievement}. I thrive in fast-paced environments and enjoy solving complex technical challenges collaboratively.

What particularly draws me to {company} is your focus on {company_focus}. I am eager to contribute to your mission while continuing to grow as an engineer.

I would welcome the opportunity to discuss how my skills and experience align with your team's needs.

Best regards,
{your_name}`,

  "Business Analyst": `Dear Hiring Manager,

I am writing to express my strong interest in the {role} position at {company}. With my analytical background and experience in translating complex data into actionable business insights, I believe I can contribute meaningfully to your team.

Throughout my work, I have consistently delivered {achievement}, leveraging data analysis and stakeholder communication to drive informed decisions. I am skilled at bridging the gap between business requirements and technical implementation.

{company}'s approach to {company_focus} aligns perfectly with my professional goals, and I would be thrilled to bring my expertise to your organization.

I look forward to the opportunity to further discuss my qualifications.

Sincerely,
{your_name}`,

  "Product Manager": `Dear Hiring Manager,

I am applying for the {role} role at {company} with genuine enthusiasm. My experience in product development, combined with a strong focus on user-centric design and data-driven decision making, makes me well-suited for this opportunity.

I have a track record of {achievement} — from defining product vision to executing cross-functional roadmaps. I excel at understanding user needs, aligning stakeholders, and shipping products that deliver real value.

I am particularly excited about {company} because of your work in {company_focus}. I would love to help drive your product strategy forward.

Thank you for your consideration.

Warm regards,
{your_name}`,
};

export default function CoverLetterPage() {
  const [role, setRole] = useState("Software Engineer");
  const [fields, setFields] = useState({
    role: "",
    company: "",
    achievement: "",
    company_focus: "",
    your_name: "",
  });
  const [generated, setGenerated] = useState("");
  const [copied, setCopied] = useState(false);

  function generate() {
    let template = TEMPLATES[role as keyof typeof TEMPLATES] ?? TEMPLATES["Software Engineer"];
    Object.entries(fields).forEach(([key, val]) => {
      template = template.replaceAll(`{${key}}`, val || `[${key.replace(/_/g, " ")}]`);
    });
    setGenerated(template);
  }

  async function copy() {
    await navigator.clipboard.writeText(generated);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function download() {
    const blob = new Blob([generated], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cover_letter_${fields.company || "company"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white mb-1">Cover Letter Generator</h1>
        <p className="text-white/40 text-sm">Generate a professional cover letter in seconds</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-5">
          <div>
            <label className="text-xs text-white/50 font-medium uppercase tracking-wide mb-2 block">Target Role Type</label>
            <div className="flex flex-wrap gap-2">
              {Object.keys(TEMPLATES).map(r => (
                <button key={r} onClick={() => setRole(r)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                    role === r ? "bg-indigo-500 text-white" : "bg-white/5 text-white/50 hover:text-white border border-white/8"
                  }`}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          {[
            { key: "your_name", label: "Your Name", placeholder: "Prashik Dongre" },
            { key: "role", label: "Job Title", placeholder: "Software Engineer" },
            { key: "company", label: "Company Name", placeholder: "Google" },
            { key: "achievement", label: "Key Achievement", placeholder: "built a platform serving 10K+ users" },
            { key: "company_focus", label: "What Excites You About Them", placeholder: "AI-first product development" },
          ].map(f => (
            <div key={f.key}>
              <label className="text-xs text-white/50 font-medium uppercase tracking-wide mb-1.5 block">{f.label}</label>
              <input
                value={fields[f.key as keyof typeof fields]}
                onChange={e => setFields(prev => ({ ...prev, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="w-full bg-[#111111] border border-white/8 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/40 transition-colors"
              />
            </div>
          ))}

          <button onClick={generate}
            className="w-full flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-3 rounded-lg font-medium text-sm transition-colors">
            <Wand2 className="w-4 h-4" /> Generate Cover Letter
          </button>
        </div>

        {/* Output */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-white/50 font-medium uppercase tracking-wide">Generated Letter</label>
            {generated && (
              <div className="flex gap-2">
                <button onClick={copy}
                  className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white px-2 py-1 rounded transition-colors">
                  {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
                <button onClick={download}
                  className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white px-2 py-1 rounded transition-colors">
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
              </div>
            )}
          </div>
          <textarea
            value={generated}
            onChange={e => setGenerated(e.target.value)}
            placeholder="Your cover letter will appear here after clicking Generate..."
            className="w-full h-[500px] bg-[#111111] border border-white/8 rounded-xl p-4 text-sm text-white/80 placeholder-white/20 focus:outline-none focus:border-indigo-500/30 resize-none leading-relaxed transition-colors"
          />
          {generated && (
            <p className="text-xs text-white/30 mt-2">
              You can edit the letter directly in the text box above.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}