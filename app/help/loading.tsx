export default function HelpLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="h-12 w-12 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto mb-8 animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded w-80 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                <div className="space-y-2">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="h-4 bg-gray-200 rounded w-full"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
