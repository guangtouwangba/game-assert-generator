import { useState, useRef, useEffect } from "react";
import type { Generation } from "../../types";

interface SpriteSheetPreviewProps {
  generation: Generation | null;
}

export default function SpriteSheetPreview({
  generation,
}: SpriteSheetPreviewProps) {
  const [fullView, setFullView] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const config = generation?.sprite_config;

  useEffect(() => {
    if (!showGrid || !config || !canvasRef.current || !imgRef.current) return;

    const img = imgRef.current;
    const canvas = canvasRef.current;

    const drawGrid = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "rgba(168, 85, 247, 0.6)";
      ctx.lineWidth = 2;

      const cellW = canvas.width / config.cols;
      const cellH = canvas.height / config.rows;

      // Draw vertical lines
      for (let i = 1; i < config.cols; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellW, 0);
        ctx.lineTo(i * cellW, canvas.height);
        ctx.stroke();
      }

      // Draw horizontal lines
      for (let i = 1; i < config.rows; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * cellH);
        ctx.lineTo(canvas.width, i * cellH);
        ctx.stroke();
      }

      // Number the frames
      ctx.fillStyle = "rgba(168, 85, 247, 0.8)";
      ctx.font = `${Math.max(12, cellW * 0.1)}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      let frame = 1;
      for (let r = 0; r < config.rows && frame <= config.frame_count; r++) {
        for (let c = 0; c < config.cols && frame <= config.frame_count; c++) {
          ctx.fillText(
            String(frame),
            c * cellW + cellW / 2,
            r * cellH + cellH / 2
          );
          frame++;
        }
      }
    };

    if (img.complete) {
      drawGrid();
    } else {
      img.addEventListener("load", drawGrid);
      return () => img.removeEventListener("load", drawGrid);
    }
  }, [showGrid, config, generation]);

  if (!generation || !generation.output_image_path || !config) return null;

  const filename = generation.output_image_path.split("/").pop();
  const imageUrl = `/api/images/outputs/${filename}`;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = filename || "sprite-sheet.png";
    link.click();
  };

  return (
    <>
      <div className="space-y-3 rounded-lg border border-gray-700 bg-gray-800/50 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-300">Sprite Sheet</h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowGrid(!showGrid)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                showGrid
                  ? "bg-purple-600/20 text-purple-400"
                  : "bg-gray-700 text-gray-400 hover:bg-gray-600"
              }`}
            >
              Grid
            </button>
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
        </div>

        <button
          type="button"
          onClick={() => setFullView(true)}
          className="relative block w-full overflow-hidden rounded-lg"
        >
          <img
            ref={imgRef}
            src={imageUrl}
            alt={generation.prompt}
            className="w-full rounded-lg object-contain"
          />
          {showGrid && (
            <canvas
              ref={canvasRef}
              className="absolute inset-0 h-full w-full rounded-lg"
            />
          )}
        </button>

        <div className="space-y-1 text-xs text-gray-500">
          <p>
            <span className="text-gray-400">Model:</span> {generation.model}
          </p>
          <p>
            <span className="text-gray-400">Layout:</span> {config.rows}x
            {config.cols} ({config.frame_count} frames)
          </p>
          <p className="truncate">
            <span className="text-gray-400">Prompt:</span> {generation.prompt}
          </p>
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
