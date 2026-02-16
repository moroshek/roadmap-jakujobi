export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mb-4" />
        <div className="h-64 bg-gray-100 rounded w-96" />
      </div>
    </div>
  );
}
