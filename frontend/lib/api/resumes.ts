import { apiRequest } from "./client";

export interface ResumeUploadResponse {
  resume_id: string;
  file_name: string;
  parse_status: string;
  created_at: string;
}

export interface Resume {
  id: string;
  original_filename: string;
  file_type: string;
  parse_status: "pending" | "complete" | "failed";
  current_version: number;
  created_at: string;
  updated_at: string;
}

export async function uploadResume(file: File, token: string): Promise<ResumeUploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/api/v1/resumes/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!res.ok) throw new Error("Upload failed");
  return res.json();
}

export async function getResumes(token: string): Promise<{ resumes: Resume[]; total: number }> {
  return apiRequest("/api/v1/resumes", { token });
}

export async function getResume(id: string, token: string): Promise<Resume> {
  return apiRequest(`/api/v1/resumes/${id}`, { token });
}

export async function deleteResume(id: string, token: string): Promise<void> {
  return apiRequest(`/api/v1/resumes/${id}`, { method: "DELETE", token });
}
