export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-48 mb-4" />
        <div className="h-24 bg-gray-100 rounded mb-8" />
        <div className="h-64 bg-gray-100 rounded" />
      </div>
    </div>
  );
}
