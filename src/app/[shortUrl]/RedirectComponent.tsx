// Client component for handling external redirects
'use client'
export function RedirectComponent({ url }: { url: string }) {
  if (typeof window !== 'undefined') {
    window.location.href = url
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Redirecting...</h1>
      </div>
    </div>
  )
}