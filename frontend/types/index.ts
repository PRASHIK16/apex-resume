// ── User ────────────────────────────────────────
export interface User {
  id: string;
  clerkId: string;
  email: string;
  fullName: string | null;
  plan: "free" | "pro" | "team";
  creditsRemaining: number;
  analysesThisMonth: number;
  createdAt: string;
}

// ── Resume ───────────────────────────────────────
export interface Resume {
  id: string;
  userId: string;
  fileUrl: string;
  originalFilename: string;
  fileType: "pdf" | "docx";
  parsedSections: ParsedResume | null;
  parseStatus: "pending" | "complete" | "failed";
  currentVersion: number;
  createdAt: string;
}

export interface ParsedResume {
  contact: Contact;
  summary: string | null;
  experience: Experience[];
  education: Education[];
  skills: Skills;
  certifications: Certification[];
  projects: Project[];
  awards: Award[];
  employmentGaps: EmploymentGap[];
}

export interface Contact {
  name: string;
  email: string;
  phone: string | null;
  location: string | null;
  linkedin: string | null;
  github: string | null;
  website: string | null;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string | null;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  bullets: string[];
}

export interface Education {
  degree: string;
  institution: string;
  graduationYear: string | null;
  gpa: string | null;
}

export interface Skills {
  technical: string[];
  soft: string[];
  tools: string[];
  languages: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  year: string | null;
}

export interface Project {
  name: string;
  description: string;
  techStack: string[];
}

export interface Award {
  name: string;
  organization: string;
  year: string | null;
}

export interface EmploymentGap {
  start: string;
  end: string;
  months: number;
}

// ── Analysis ─────────────────────────────────────
export interface Analysis {
  id: string;
  resumeId: string;
  status: "queued" | "processing" | "partial" | "complete" | "failed";
  mode: "kind" | "brutal";
  overallScore: number | null;
  atsKeywordScore: number | null;
  atsFormatScore: number | null;
  contentQualityScore: number | null;
  confidenceScore: number | null;
  impactScore: number | null;
  readabilityScore: number | null;
  peerPercentile: number | null;
  rejectionRisks: RejectionRisk[];
  bulletAnalyses: BulletAnalysis[];
  missingKeywords: MissingKeyword[];
  matchedKeywords: string[];
  priorityFixes: PriorityFix[];
  createdAt: string;
  completedAt: string | null;
}

export interface RejectionRisk {
  riskTitle: string;
  specificText: string;
  whyItHurts: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
  fix: string;
}

export interface BulletAnalysis {
  bulletId: string;
  original: string;
  confidenceScore: number;
  impactLevel: "HIGH" | "MEDIUM" | "LOW";
  hasQuantification: boolean;
  passivePhrases: string[];
  rewrites?: BulletRewrite[];
}

export interface BulletRewrite {
  text: string;
  confidenceScore: number;
  explanation: string;
  atsKeywordsAdded: string[];
}

export interface MissingKeyword {
  keyword: string;
  importance: "required" | "nice_to_have";
  whereToAdd: string;
}

export interface PriorityFix {
  title: string;
  description: string;
  impact: "HIGH" | "MEDIUM" | "LOW";
  category: string;
}
