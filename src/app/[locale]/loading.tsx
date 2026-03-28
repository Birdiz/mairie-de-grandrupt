export default function Loading() {
  return (
    <div className="flex flex-1 items-center justify-center py-24" aria-label="Chargement…">
      <div
        className="border-muted border-t-primary h-8 w-8 animate-spin rounded-full border-4"
        role="status"
        aria-hidden="true"
      />
    </div>
  );
}
