import { apiRequest } from "./client";

export interface CreateAnalysisRequest {
  resume_id: string;
  jd_text?: string;
  jd_url?: string;
  company_name?: string;
  mode?: "kind" | "brutal";
}

export interface AnalysisStatus {
  status: "queued" | "processing" | "partial" | "complete" | "failed";
  processing_steps?: Array<{ step: string; status: string }>;
  estimated_remaining_seconds?: number;
}

export async function createAnalysis(data: CreateAnalysisRequest, token: string) {
  return apiRequest("/api/v1/analyses", {
    method: "POST",
    body: JSON.stringify(data),
    token,
  });
}

export async function getAnalysis(id: string, token: string) {
  return apiRequest(`/api/v1/analyses/${id}`, { token });
}

export async function getAnalysisStatus(id: string, token: string): Promise<AnalysisStatus> {
  return apiRequest(`/api/v1/analyses/${id}/status`, { token });
}

export async function getResumeAnalyses(resumeId: string, token: string) {
  return apiRequest(`/api/v1/analyses/by-resume/${resumeId}`, { token });
}
