import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getHistory, deleteGeneration, type HistoryParams } from "../api/history";

export function useHistory(params: HistoryParams = {}) {
  return useQuery({
    queryKey: ["history", params],
    queryFn: () => getHistory(params),
  });
}

export function useDeleteGeneration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteGeneration(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });
}
