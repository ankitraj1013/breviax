export default function NewsCardSkeleton() {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 shadow-md border border-gray-200 dark:border-zinc-800 animate-pulse">
      <div className="w-full h-56 bg-gray-300 dark:bg-zinc-700 rounded-xl mb-4"></div>
      <div className="h-3 w-24 bg-gray-300 dark:bg-zinc-700 rounded mb-3"></div>
      <div className="h-5 w-full bg-gray-300 dark:bg-zinc-700 rounded mb-2"></div>
      <div className="h-5 w-3/4 bg-gray-300 dark:bg-zinc-700 rounded mb-3"></div>
      <div className="h-4 w-full bg-gray-200 dark:bg-zinc-800 rounded"></div>
    </div>
  );
}
