import { useModels } from "../../hooks/useModels";

interface ModelSelectorProps {
  value: string;
  onChange: (modelId: string, provider: "gemini" | "openrouter") => void;
}

export default function ModelSelector({ value, onChange }: ModelSelectorProps) {
  const { data, isLoading, isError } = useModels();

  const models = data?.models ?? [];

  const grouped = models.reduce<Record<string, typeof models>>((acc, m) => {
    const key = m.provider;
    if (!acc[key]) acc[key] = [];
    acc[key].push(m);
    return acc;
  }, {});

  const handleChange = (modelId: string) => {
    const model = models.find((m) => m.id === modelId);
    if (model) {
      onChange(model.id, model.provider as "gemini" | "openrouter");
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">Model</label>
      <select
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        disabled={isLoading}
        className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-gray-100 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40 disabled:opacity-50"
      >
        {isLoading && <option value="">Loading models...</option>}
        {isError && <option value="">Failed to load models</option>}
        {!isLoading && !value && (
          <option value="">Select a model</option>
        )}
        {Object.entries(grouped).map(([provider, providerModels]) => (
          <optgroup
            key={provider}
            label={provider === "gemini" ? "Gemini" : "OpenRouter"}
          >
            {providerModels.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}
