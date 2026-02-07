import { useState } from "react";
import { useGenerate, useGenerateSpriteSheet } from "../../hooks/useGenerate";
import type {
  Generation,
  GenerateRequest,
  SpriteSheetRequest,
  SpriteConfig,
} from "../../types";
import PromptInput from "./PromptInput";
import ModelSelector from "./ModelSelector";
import SizeSelector from "./SizeSelector";
import OptionsPanel from "./OptionsPanel";
import ReferenceImageUpload from "./ReferenceImageUpload";
import ImagePreview from "../preview/ImagePreview";
import SpriteSheetPreview from "../preview/SpriteSheetPreview";

export default function GenerationForm() {
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [model, setModel] = useState("");
  const [provider, setProvider] = useState<"gemini" | "openrouter">("gemini");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [imageSize, setImageSize] = useState("1024x1024");
  const [transparentBg, setTransparentBg] = useState(false);
  const [isSpriteSheet, setIsSpriteSheet] = useState(false);
  const [spriteConfig, setSpriteConfig] = useState<SpriteConfig>({
    rows: 4,
    cols: 4,
    frame_count: 16,
  });
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [result, setResult] = useState<Generation | null>(null);

  const generateMutation = useGenerate();
  const spriteSheetMutation = useGenerateSpriteSheet();

  const isLoading =
    generateMutation.isPending || spriteSheetMutation.isPending;
  const canSubmit = prompt.trim() !== "" && model !== "" && !isLoading;

  const handleModelChange = (
    modelId: string,
    modelProvider: "gemini" | "openrouter"
  ) => {
    setModel(modelId);
    setProvider(modelProvider);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    const baseRequest: GenerateRequest = {
      prompt: prompt.trim(),
      model,
      provider,
      aspect_ratio: aspectRatio,
      image_size: imageSize,
      transparent_bg: transparentBg,
      ...(negativePrompt.trim() && {
        negative_prompt: negativePrompt.trim(),
      }),
      ...(referenceImage && { reference_image_b64: referenceImage }),
    };

    if (isSpriteSheet) {
      const req: SpriteSheetRequest = {
        ...baseRequest,
        is_sprite_sheet: true,
        sprite_config: spriteConfig,
      };
      spriteSheetMutation.mutate(req, {
        onSuccess: (data) => setResult(data),
      });
    } else {
      generateMutation.mutate(baseRequest, {
        onSuccess: (data) => setResult(data),
      });
    }
  };

  const error = generateMutation.error || spriteSheetMutation.error;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form onSubmit={handleSubmit} className="space-y-6">
        <PromptInput
          prompt={prompt}
          negativePrompt={negativePrompt}
          onPromptChange={setPrompt}
          onNegativePromptChange={setNegativePrompt}
        />

        <ModelSelector value={model} onChange={handleModelChange} />

        <SizeSelector
          aspectRatio={aspectRatio}
          imageSize={imageSize}
          onAspectRatioChange={setAspectRatio}
          onImageSizeChange={setImageSize}
        />

        <OptionsPanel
          transparentBg={transparentBg}
          onTransparentBgChange={setTransparentBg}
          isSpriteSheet={isSpriteSheet}
          onIsSpriteSheetChange={setIsSpriteSheet}
          spriteConfig={spriteConfig}
          onSpriteConfigChange={setSpriteConfig}
        />

        <ReferenceImageUpload
          value={referenceImage}
          onChange={setReferenceImage}
        />

        {error && (
          <div className="rounded-lg border border-red-800 bg-red-900/30 px-4 py-3 text-sm text-red-400">
            {error instanceof Error
              ? error.message
              : "Generation failed. Please try again."}
          </div>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full rounded-lg bg-purple-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="h-4 w-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Generating...
            </span>
          ) : isSpriteSheet ? (
            "Generate Sprite Sheet"
          ) : (
            "Generate Image"
          )}
        </button>
      </form>

      <div className="flex items-start">
        {result ? (
          result.is_sprite_sheet && result.sprite_config ? (
            <SpriteSheetPreview generation={result} />
          ) : (
            <ImagePreview generation={result} />
          )
        ) : (
          <div className="flex w-full items-center justify-center rounded-lg border border-dashed border-gray-700 bg-gray-800/30 py-32">
            <p className="text-sm text-gray-500">
              Generated image will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
