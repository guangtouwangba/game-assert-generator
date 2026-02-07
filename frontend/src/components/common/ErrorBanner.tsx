interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-red-400">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="shrink-0 rounded-md bg-red-500/20 px-3 py-1.5 text-sm font-medium text-red-400 hover:bg-red-500/30 transition-colors cursor-pointer"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}
