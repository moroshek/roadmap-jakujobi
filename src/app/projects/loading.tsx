export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6" />
        <div className="h-10 bg-gray-200 rounded w-full mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-48 bg-gray-100 rounded" />
          <div className="h-48 bg-gray-100 rounded" />
          <div className="h-48 bg-gray-100 rounded" />
        </div>
      </div>
    </div>
  );
}
