export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4" />
        <div className="h-96 bg-gray-100 rounded" />
      </div>
    </div>
  );
}
