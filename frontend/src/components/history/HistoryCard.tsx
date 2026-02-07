import { useState } from "react";
import type { Generation } from "../../types";
import ConfirmDialog from "../common/ConfirmDialog";

interface HistoryCardProps {
  generation: Generation;
  onDelete: (id: string) => void;
}

const statusColors: Record<string, string> = {
  completed: "bg-green-500/20 text-green-400",
  generating: "bg-yellow-500/20 text-yellow-400",
  pending: "bg-blue-500/20 text-blue-400",
  failed: "bg-red-500/20 text-red-400",
};

export default function HistoryCard({
  generation,
  onDelete,
}: HistoryCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  const thumbnailUrl = generation.thumbnail_path
    ? `/api/images/outputs/${generation.thumbnail_path.split("/").pop()}`
    : null;

  const fullImageUrl = generation.output_image_path
    ? `/api/images/outputs/${generation.output_image_path.split("/").pop()}`
    : null;

  const filename = generation.output_image_path?.split("/").pop() ?? "image.png";

  const formattedDate = new Date(generation.created_at).toLocaleDateString(
    undefined,
    { month: "short", day: "numeric", year: "numeric" }
  );

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!fullImageUrl) return;
    const link = document.createElement("a");
    link.href = fullImageUrl;
    link.download = filename;
    link.click();
  };

  return (
    <>
      <div
        onClick={() => generation.status === "completed" && setDetailOpen(true)}
        className={`group overflow-hidden rounded-xl border border-gray-700 bg-gray-800 transition-colors hover:border-purple-500/50 ${generation.status === "completed" ? "cursor-pointer" : ""}`}
      >
        <div className="relative aspect-square bg-gray-900">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={generation.prompt}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-600">
              No image
            </div>
          )}
          {/* Hover overlay with view & download */}
          {generation.status === "completed" && fullImageUrl && (
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="rounded-md bg-purple-600 px-3 py-1.5 text-xs font-medium text-white">
                View
              </span>
              <button
                onClick={handleDownload}
                className="rounded-md bg-gray-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-600 cursor-pointer"
              >
                Download
              </button>
            </div>
          )}
        </div>
        <div className="p-4">
          <p className="line-clamp-2 text-sm text-gray-200">
            {generation.prompt}
          </p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-gray-500">{generation.model}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[generation.status] ?? "bg-gray-500/20 text-gray-400"}`}
            >
              {generation.status}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-gray-500">{formattedDate}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setConfirmOpen(true);
              }}
              className="rounded-md px-2 py-1 text-xs text-red-400 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-500/10 cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {detailOpen && fullImageUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setDetailOpen(false)}
        >
          <div
            className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-gray-700 bg-gray-800 md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            <div className="flex flex-1 items-center justify-center bg-gray-900 p-4">
              <img
                src={fullImageUrl}
                alt={generation.prompt}
                className="max-h-[70vh] max-w-full rounded-lg object-contain"
              />
            </div>

            {/* Info Panel */}
            <div className="flex w-full flex-col gap-4 overflow-y-auto p-6 md:w-80">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-100">Details</h3>
                <button
                  onClick={() => setDetailOpen(false)}
                  className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 hover:bg-gray-700 hover:text-gray-200 cursor-pointer"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-medium text-gray-400">Prompt</span>
                  <p className="mt-1 text-gray-200">{generation.prompt}</p>
                </div>
                {generation.negative_prompt && (
                  <div>
                    <span className="font-medium text-gray-400">Negative Prompt</span>
                    <p className="mt-1 text-gray-200">{generation.negative_prompt}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="font-medium text-gray-400">Model</span>
                    <p className="mt-1 text-gray-200">{generation.model}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-400">Provider</span>
                    <p className="mt-1 text-gray-200 capitalize">{generation.provider}</p>
                  </div>
                  {generation.aspect_ratio && (
                    <div>
                      <span className="font-medium text-gray-400">Aspect Ratio</span>
                      <p className="mt-1 text-gray-200">{generation.aspect_ratio}</p>
                    </div>
                  )}
                  {generation.image_size && (
                    <div>
                      <span className="font-medium text-gray-400">Size</span>
                      <p className="mt-1 text-gray-200">{generation.image_size}</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-3">
                  {generation.transparent_bg && (
                    <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-purple-400">
                      Transparent
                    </span>
                  )}
                  {generation.is_sprite_sheet && (
                    <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-blue-400">
                      Sprite Sheet
                    </span>
                  )}
                </div>
                {generation.is_sprite_sheet && generation.sprite_config && (
                  <div>
                    <span className="font-medium text-gray-400">Sprite Config</span>
                    <p className="mt-1 text-gray-200">
                      {generation.sprite_config.cols}x{generation.sprite_config.rows} ({generation.sprite_config.frame_count} frames)
                    </p>
                  </div>
                )}
                <div>
                  <span className="font-medium text-gray-400">Created</span>
                  <p className="mt-1 text-gray-200">
                    {new Date(generation.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              <button
                onClick={handleDownload}
                className="mt-auto flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-purple-500 cursor-pointer"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Image
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Generation"
        message="Are you sure you want to delete this generation? This action cannot be undone."
        onConfirm={() => {
          setConfirmOpen(false);
          onDelete(generation.id);
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
