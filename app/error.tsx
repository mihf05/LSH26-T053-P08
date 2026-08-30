"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="alert alert-error flex-col items-start gap-2">
      <h2 className="font-semibold">Could not load the results</h2>
      <p className="text-sm">{error.message}</p>
      <button className="btn btn-sm" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
