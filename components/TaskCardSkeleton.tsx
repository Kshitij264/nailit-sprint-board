export default function TaskCardSkeleton() {
  return (
    <div className="bg-gray-700 rounded-lg p-4 shadow-md animate-pulse">
      <div className="h-6 bg-gray-600 rounded w-3/4 mb-3"></div>
      <div className="h-4 bg-gray-600 rounded w-full mb-4"></div>
      <div className="h-4 bg-gray-600 rounded w-1/2 mb-4"></div>
      <div className="h-5 bg-gray-600 rounded-full w-16"></div>
    </div>
  );
}