import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { getResumes, deleteResume } from "../api/resumes";

export function useResumes() {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ["resumes"],
    queryFn: async () => {
      const token = await getToken();
      return getResumes(token!);
    },
    staleTime: 1000 * 60 * 2,
  });
}

export function useDeleteResume() {
  const { getToken } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken();
      return deleteResume(id, token!);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["resumes"] }),
  });
}
