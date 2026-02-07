import type { SpriteConfig } from "../../types";
import SpriteSheetConfig from "./SpriteSheetConfig";

interface OptionsPanelProps {
  transparentBg: boolean;
  onTransparentBgChange: (value: boolean) => void;
  isSpriteSheet: boolean;
  onIsSpriteSheetChange: (value: boolean) => void;
  spriteConfig: SpriteConfig;
  onSpriteConfigChange: (config: SpriteConfig) => void;
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between cursor-pointer">
      <span className="text-sm font-medium text-gray-300">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors ${
          checked ? "bg-purple-600" : "bg-gray-700"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </label>
  );
}

export default function OptionsPanel({
  transparentBg,
  onTransparentBgChange,
  isSpriteSheet,
  onIsSpriteSheetChange,
  spriteConfig,
  onSpriteConfigChange,
}: OptionsPanelProps) {
  return (
    <div className="space-y-4">
      <Toggle
        label="Transparent Background"
        checked={transparentBg}
        onChange={onTransparentBgChange}
      />
      <Toggle
        label="Sprite Sheet Mode"
        checked={isSpriteSheet}
        onChange={onIsSpriteSheetChange}
      />
      {isSpriteSheet && (
        <SpriteSheetConfig
          value={spriteConfig}
          onChange={onSpriteConfigChange}
        />
      )}
    </div>
  );
}
