/* eslint-disable @typescript-eslint/no-explicit-any */
import PasswordProtectedForm from './PasswordProtectedForm'
import Url from "@/model/url"
import { RedirectComponent } from './RedirectComponent'
import { BackgroundBeamsWithCollision } from '@/components/ui/background-beams-with-collision'

interface Props {
  params: Promise<{ shortUrl: string }>;
}

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
}: Props) {
  const shortUrl = (await params).shortUrl

  try {
    const urlData = await getUrlData(shortUrl)

    // If URL is not password protected, return special component for client-side redirect
    if (!urlData.isPasswordProtected) {
      return (
        <RedirectComponent url={urlData.originalUrl} />
      )
    }

    // If we reach here, the URL is password protected
    return (
      <BackgroundBeamsWithCollision className="min-h-screen">
        <div className="bg-black min-h-screen text-white flex flex-col justify-center items-center w-full px-4 sm:px-6">
          <PasswordProtectedForm shortUrl={shortUrl} />
        </div>
      </BackgroundBeamsWithCollision>
    )

  } catch (error: any) {
    return (
      <BackgroundBeamsWithCollision className="min-h-screen">
        <div className="bg-black min-h-screen text-white flex flex-col justify-center items-center w-full px-4 sm:px-6">
          <div className="w-full max-w-md">
            <h1 className="text-2xl sm:text-3xl font-bold text-center text-red-500">
              {error.message || 'An error occurred'}
            </h1>
          </div>
        </div>
      </BackgroundBeamsWithCollision>
    )
  }
}
