/*
|-----------------------------------------
| setting up shared MCQ feedback and pagination
|-----------------------------------------
*/

export function mcqApiError(error: unknown) {
  if (error && typeof error === "object" && "data" in error) {
    const data = error.data;
    if (data && typeof data === "object" && "error" in data && typeof data.error === "string") return data.error;
  }
  return "Could not load examination data. Please try again.";
}
export function McqError({ error, retry }: { error: unknown; retry: () => void }) {
  return (
    <div className="my-4 rounded-sm bg-red-50 p-3 text-sm text-red-700" role="alert">
      {mcqApiError(error)}{" "}
      <button className="ml-2 underline" onClick={retry} type="button">
        Retry
      </button>
    </div>
  );
}
export function McqPagination({
  page,
  total,
  pageSize,
  onChange,
}: {
  page: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
}) {
  if (total <= pageSize && page === 1) return null;
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-stone-600">
      <span>
        Page {page} of {Math.max(1, Math.ceil(total / pageSize))} · {total} total
      </span>
      <div className="flex gap-2">
        <button className="secondary-button" disabled={page <= 1} onClick={() => onChange(page - 1)} type="button">
          Previous
        </button>
        <button
          className="secondary-button"
          disabled={page * pageSize >= total}
          onClick={() => onChange(page + 1)}
          type="button"
        >
          Next
        </button>
      </div>
    </div>
  );
}
