"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers array with ellipses if needed
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between py-3 px-1 no-print">
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-base-content/75">
        <span>
          Showing <strong className="text-base-content">{startItem}</strong> to{" "}
          <strong className="text-base-content">{endItem}</strong> of{" "}
          <strong className="text-base-content">{totalItems}</strong> entries
        </span>

        {onPageSizeChange && (
          <div className="flex items-center gap-1.5">
            <span className="opacity-75">Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="select select-xs select-bordered rounded-md text-xs font-mono"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 self-center sm:self-auto">
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="btn btn-xs rounded-md border border-base-300 bg-base-100 disabled:opacity-40"
          aria-label="Previous Page"
        >
          &larr; Prev
        </button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((p, idx) =>
            typeof p === "number" ? (
              <button
                key={idx}
                type="button"
                onClick={() => onPageChange(p)}
                className={`btn btn-xs rounded-md min-w-[1.75rem] font-mono ${
                  currentPage === p
                    ? "btn-primary shadow-xs"
                    : "btn-ghost border border-base-200"
                }`}
              >
                {p}
              </button>
            ) : (
              <span key={idx} className="px-1 text-xs opacity-50 font-mono">
                {p}
              </span>
            )
          )}
        </div>

        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="btn btn-xs rounded-md border border-base-300 bg-base-100 disabled:opacity-40"
          aria-label="Next Page"
        >
          Next &rarr;
        </button>
      </div>
    </div>
  );
}
