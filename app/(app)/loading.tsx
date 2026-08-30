export default function Loading() {
  return (
    <div className="flex items-center gap-3 p-10">
      <span className="loading loading-spinner loading-md" />
      <span className="text-sm opacity-70">Running the results...</span>
    </div>
  );
}
