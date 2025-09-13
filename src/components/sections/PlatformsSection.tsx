import { fetchPlatforms } from "@/app/actions/platform-actions";
import { PlatformList } from "@/components/platform";
import { getFilteredPlatforms } from "@/lib/data-utils";

export default async function PlatformsSection() {
  // Server-side data fetching - most performant approach for static JSON data
  // This runs at build time or request time on the server, no client-side loading
  const { platforms } = await fetchPlatforms();

  const initialData = getFilteredPlatforms({
    data: platforms,
    page: 1,
    limit: 12, // Load more items initially for better UX
  });

  return (
    <section
      id="platforms"
      className="bg-gray-50 py-16 transition-colors duration-300 dark:bg-gray-800"
    >
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="text-primary-black mb-4 text-3xl font-bold sm:text-4xl dark:text-white">
            Reported Platforms
          </h2>
          <p className="text-primary-black-light mx-auto max-w-2xl text-lg dark:text-gray-300">
            Browse documented incidents across various digital platforms with
            verified evidence and detailed reports.
          </p>
          <div className="bg-primary-red mx-auto mt-6 h-1 w-24"></div>
        </div>

        {/* Platform List - Pass server-side data directly */}
        <PlatformList
          platforms={initialData.platforms}
          platformTypes={initialData.platformTypes}
          totalCount={initialData.total}
          showLoadMore={initialData.pagination.hasMore}
        />
      </div>
    </section>
  );
}
