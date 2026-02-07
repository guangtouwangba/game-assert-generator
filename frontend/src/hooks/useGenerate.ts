import { useMutation, useQueryClient } from "@tanstack/react-query";
import { generateImage, generateSpriteSheet } from "../api/generate";
import type { GenerateRequest, SpriteSheetRequest } from "../types";

export function useGenerate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (req: GenerateRequest) => generateImage(req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });
}

export function useGenerateSpriteSheet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (req: SpriteSheetRequest) => generateSpriteSheet(req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });
}
