import { useState } from "react";
import { useHistory, useDeleteGeneration } from "../../hooks/useHistory";
import HistoryFilters from "./HistoryFilters";
import HistoryCard from "./HistoryCard";
import Pagination from "./Pagination";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorBanner from "../common/ErrorBanner";

export default function HistoryGallery() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ search: "", provider: "" });

  const { data, isLoading, error, refetch } = useHistory({
    page,
    page_size: 12,
    search: filters.search || undefined,
    provider: filters.provider || undefined,
  });

  const deleteMutation = useDeleteGeneration();

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-100">
          Generation History
        </h2>
      </div>

      <HistoryFilters filters={filters} onChange={handleFilterChange} />

      {isLoading && <LoadingSpinner size="lg" />}

      {error && (
        <ErrorBanner
          message={error instanceof Error ? error.message : "Failed to load history"}
          onRetry={() => refetch()}
        />
      )}

      {data && data.items.length === 0 && (
        <div className="py-16 text-center text-gray-500">
          No generations found
        </div>
      )}

      {data && data.items.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.items.map((generation) => (
              <HistoryCard
                key={generation.id}
                generation={generation}
                onDelete={(id) => deleteMutation.mutate(id)}
              />
            ))}
          </div>

          <Pagination
            page={data.page}
            totalPages={data.total_pages}
            onChange={setPage}
          />
        </>
      )}
    </div>
  );
}
