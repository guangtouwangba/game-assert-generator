import type { SpriteConfig } from "../../types";

interface SpriteSheetConfigProps {
  value: SpriteConfig;
  onChange: (config: SpriteConfig) => void;
}

function NumberField({
  label,
  value,
  onChange,
  min = 1,
  max = 32,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-gray-400">
        {label}
      </label>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || min)}
        className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-100 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
      />
    </div>
  );
}

export default function SpriteSheetConfig({
  value,
  onChange,
}: SpriteSheetConfigProps) {
  const update = (field: keyof SpriteConfig, v: number) => {
    onChange({ ...value, [field]: v });
  };

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4 space-y-3">
      <p className="text-sm font-medium text-gray-300">Sprite Sheet Layout</p>
      <div className="grid grid-cols-3 gap-3">
        <NumberField
          label="Rows"
          value={value.rows}
          onChange={(v) => update("rows", v)}
        />
        <NumberField
          label="Columns"
          value={value.cols}
          onChange={(v) => update("cols", v)}
        />
        <NumberField
          label="Frame Count"
          value={value.frame_count}
          onChange={(v) => update("frame_count", v)}
        />
      </div>
    </div>
  );
}
