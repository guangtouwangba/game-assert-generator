interface Filters {
  search: string;
  provider: string;
}

interface HistoryFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export default function HistoryFilters({
  filters,
  onChange,
}: HistoryFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <input
        type="text"
        placeholder="Search prompts..."
        value={filters.search}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
        className="flex-1 rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-gray-100 placeholder-gray-500 outline-none focus:border-purple-500 transition-colors"
      />
      <select
        value={filters.provider}
        onChange={(e) => onChange({ ...filters, provider: e.target.value })}
        className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-gray-100 outline-none focus:border-purple-500 transition-colors cursor-pointer"
      >
        <option value="">All Providers</option>
        <option value="gemini">Gemini</option>
        <option value="openrouter">OpenRouter</option>
      </select>
    </div>
  );
}
