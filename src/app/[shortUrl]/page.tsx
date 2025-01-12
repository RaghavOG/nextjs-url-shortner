/* eslint-disable @typescript-eslint/no-explicit-any */
// page.tsx
import PasswordProtectedForm from './PasswordProtectedForm'
import Url from "@/model/url"
import { RedirectComponent } from './RedirectComponent'

async function getUrlData(shortUrl: string) {
  const urlEntry = await Url.findOne({ shortUrl })
  
  if (!urlEntry) {
    throw new Error("Short URL not found")
  }

  if (urlEntry.expirationDate && new Date() > new Date(urlEntry.expirationDate)) {
    throw new Error("This link has expired")
  }

  return urlEntry
}

export default async function ShortUrlPage({ 
  params 
}: { 
  params: { shortUrl: string } 
}) {
  const shortUrl = (await Promise.resolve(params)).shortUrl

  try {
    const urlData = await getUrlData(shortUrl)

    // If URL is not password protected, return special component for client-side redirect
    if (!urlData.isPasswordProtected) {
      return (
        <RedirectComponent url={urlData.originalUrl} />
      )
    }

    // If we reach here, the URL is password protected
    return <PasswordProtectedForm shortUrl={shortUrl} />

  } catch (error: any) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center text-red-600">
            {error.message || 'An error occurred'}
          </h1>
        </div>
      </div>
    )
  }
}

