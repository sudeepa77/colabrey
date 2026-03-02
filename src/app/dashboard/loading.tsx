// app/dashboard/loading.tsx
export default function DashboardLoading() {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header Skeleton */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
        </header>
  
        {/* Main Content Skeleton */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {/* User Summary Skeleton */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 bg-gray-200 rounded-full animate-pulse" />
                <div className="flex-1 space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
                    <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
                    <div className="h-6 w-24 bg-gray-200 rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
  
            {/* Action Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-gray-200 rounded-lg h-32 animate-pulse"
                />
              ))}
            </div>
  
            {/* Two Column Layout Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                >
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-4 animate-pulse" />
                  <div className="space-y-4">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                          <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }