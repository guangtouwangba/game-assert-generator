import { useQuery } from "@tanstack/react-query";
import { getModels } from "../api/models";

export function useModels() {
  return useQuery({
    queryKey: ["models"],
    queryFn: getModels,
    staleTime: 5 * 60 * 1000,
  });
}
