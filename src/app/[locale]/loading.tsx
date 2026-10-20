export default function Loading() {
  return (
    <div className="flex flex-1 items-center justify-center py-24" aria-label="Chargement…">
      <div
        className="border-border border-t-primary h-10 w-10 rounded-full border-4 motion-safe:animate-spin"
        role="status"
        aria-hidden="true"
      />
    </div>
  );
}
