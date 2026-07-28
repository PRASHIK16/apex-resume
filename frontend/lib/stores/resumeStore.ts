import { create } from "zustand";

interface ResumeStore {
  selectedResumeId: string | null;
  analysisMode: "kind" | "brutal";
  activeSection: string | null;
  setSelectedResume: (id: string | null) => void;
  setAnalysisMode: (mode: "kind" | "brutal") => void;
  setActiveSection: (section: string | null) => void;
}

export const useResumeStore = create<ResumeStore>((set) => ({
  selectedResumeId: null,
  analysisMode: "kind",
  activeSection: null,
  setSelectedResume: (id) => set({ selectedResumeId: id }),
  setAnalysisMode: (mode) => set({ analysisMode: mode }),
  setActiveSection: (section) => set({ activeSection: section }),
}));
