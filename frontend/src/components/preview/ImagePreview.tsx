import { useState } from "react";
import type { Generation } from "../../types";

interface ImagePreviewProps {
  generation: Generation | null;
}

export default function ImagePreview({ generation }: ImagePreviewProps) {
  const [fullView, setFullView] = useState(false);

  if (!generation || !generation.output_image_path) return null;

  const filename = generation.output_image_path.split("/").pop();
  const imageUrl = `/api/images/outputs/${filename}`;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = filename || "generated-image.png";
    link.click();
  };

  return (
    <>
      <div className="space-y-3 rounded-lg border border-gray-700 bg-gray-800/50 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-300">
            Generated Image
          </h3>
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-1.5 rounded-md bg-gray-700 px-3 py-1.5 text-xs font-medium text-gray-300 hover:bg-gray-600 transition-colors"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </button>
        </div>

        <button
          type="button"
          onClick={() => setFullView(true)}
          className="block w-full overflow-hidden rounded-lg"
        >
          <img
            src={imageUrl}
            alt={generation.prompt}
            className="w-full rounded-lg object-contain transition-opacity hover:opacity-90"
          />
        </button>

        <div className="space-y-1 text-xs text-gray-500">
          <p>
            <span className="text-gray-400">Model:</span> {generation.model}
          </p>
          <p>
            <span className="text-gray-400">Provider:</span>{" "}
            {generation.provider}
          </p>
          <p className="truncate">
            <span className="text-gray-400">Prompt:</span> {generation.prompt}
          </p>
          {generation.aspect_ratio && (
            <p>
              <span className="text-gray-400">Aspect Ratio:</span>{" "}
              {generation.aspect_ratio}
            </p>
          )}
          {generation.image_size && (
            <p>
              <span className="text-gray-400">Size:</span>{" "}
              {generation.image_size}
            </p>
          )}
        </div>
      </div>

      {fullView && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setFullView(false)}
        >
          <div className="relative max-h-[90vh] max-w-[90vw]">
            <img
              src={imageUrl}
              alt={generation.prompt}
              className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
            />
            <button
              type="button"
              onClick={() => setFullView(false)}
              className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
