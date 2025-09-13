import { fetchPlatforms } from "@/app/actions/platform-actions";
import { fetchReports } from "@/app/actions/report-actions";
import { PlatformList } from "@/components/platform";
import { getFilteredPlatforms, getFilteredReports } from "@/lib/data-utils";
import { ContentList } from "../content";

export default async function ContentSection() {
  // Server-side data fetching - most performant approach for static JSON data
  // This runs at build time or request time on the server, no client-side loading
  const { reports } = await fetchReports();

  const initialData = getFilteredReports({
    data: reports,
    page: 1,
    limit: 12, // Load more items initially for better UX
  });

  return (
    <section
      id="reports"
      className="bg-white py-16 transition-colors duration-300 dark:bg-gray-900"
    >
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
            Recent Reports
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            Browse through documented incidents with verified evidence and
            supporting materials.
          </p>
          <div className="bg-primary-red mx-auto mt-6 h-1 w-24"></div>
        </div>

        {/* Platform List - Pass server-side data directly */}
        <ContentList reports={initialData.reports} />
      </div>
    </section>
  );
}
