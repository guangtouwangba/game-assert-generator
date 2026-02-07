interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-5 w-5 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-12 w-12 border-3",
};

export default function LoadingSpinner({ size = "md" }: LoadingSpinnerProps) {
  return (
    <div className="flex items-center justify-center p-8">
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-purple-500 border-t-transparent`}
      />
    </div>
  );
}
