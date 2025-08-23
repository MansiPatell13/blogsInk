export default function AboutLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="h-16 w-16 bg-gray-200 rounded mx-auto mb-6 animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded w-64 mx-auto mb-6 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-full max-w-3xl mx-auto animate-pulse"></div>
          </div>
          <div className="space-y-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white p-8 rounded-lg shadow animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
