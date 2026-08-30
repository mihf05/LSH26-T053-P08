export default function Loading() {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-3 p-10">
      <span className="loading loading-spinner loading-md" />
      <span className="text-sm opacity-70">Calculating results...</span>
    </div>
  );
}
