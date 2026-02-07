interface SizeSelectorProps {
  aspectRatio: string;
  imageSize: string;
  onAspectRatioChange: (value: string) => void;
  onImageSizeChange: (value: string) => void;
}

const ASPECT_RATIOS = ["1:1", "16:9", "9:16", "4:3", "3:4"];
const IMAGE_SIZES = ["1024x1024", "1536x1536", "2048x2048"];

function PillButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
        selected
          ? "bg-purple-600 text-white"
          : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
      }`}
    >
      {label}
    </button>
  );
}

export default function SizeSelector({
  aspectRatio,
  imageSize,
  onAspectRatioChange,
  onImageSizeChange,
}: SizeSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Aspect Ratio
        </label>
        <div className="flex flex-wrap gap-2">
          {ASPECT_RATIOS.map((ratio) => (
            <PillButton
              key={ratio}
              label={ratio}
              selected={aspectRatio === ratio}
              onClick={() => onAspectRatioChange(ratio)}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Image Size
        </label>
        <div className="flex flex-wrap gap-2">
          {IMAGE_SIZES.map((size) => (
            <PillButton
              key={size}
              label={size}
              selected={imageSize === size}
              onClick={() => onImageSizeChange(size)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
