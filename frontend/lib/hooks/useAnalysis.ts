import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { getAnalysis, getAnalysisStatus } from "../api/analyses";

export function useAnalysis(id: string) {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ["analysis", id],
    queryFn: async () => {
      const token = await getToken();
      return getAnalysis(id, token!);
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useAnalysisPolling(id: string, enabled: boolean) {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ["analysis-status", id],
    queryFn: async () => {
      const token = await getToken();
      return getAnalysisStatus(id, token!);
    },
    enabled,
    refetchInterval: (query) => {
      const data = query.state.data;
      return data?.status === "complete" || data?.status === "failed" ? false : 3000;
    },
  });
}