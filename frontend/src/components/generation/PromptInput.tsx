import { useState } from "react";

interface PromptInputProps {
  prompt: string;
  negativePrompt: string;
  onPromptChange: (value: string) => void;
  onNegativePromptChange: (value: string) => void;
}

export default function PromptInput({
  prompt,
  negativePrompt,
  onPromptChange,
  onNegativePromptChange,
}: PromptInputProps) {
  const [showNegative, setShowNegative] = useState(false);

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-300">
        Prompt
      </label>
      <textarea
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
        placeholder="Describe the game asset you want to generate..."
        rows={4}
        className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-gray-100 placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40 resize-none"
      />

      <button
        type="button"
        onClick={() => setShowNegative(!showNegative)}
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-200 transition-colors"
      >
        <svg
          className={`h-4 w-4 transition-transform ${showNegative ? "rotate-90" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        Negative prompt
      </button>

      {showNegative && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-400">
            Negative Prompt
          </label>
          <textarea
            value={negativePrompt}
            onChange={(e) => onNegativePromptChange(e.target.value)}
            placeholder="What to avoid in the generated image..."
            rows={2}
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-gray-100 placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40 resize-none"
          />
        </div>
      )}
    </div>
  );
}
