'use client'

import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { BackgroundBeamsWithCollision } from '@/components/ui/background-beams-with-collision'

export function RedirectComponent({ url }: { url: string }) {
  useEffect(() => {
    window.location.href = url
  }, [url])
  
  return (
    <BackgroundBeamsWithCollision className="min-h-screen">
      <div className="bg-black min-h-screen text-white flex flex-col justify-center items-center w-full px-4 sm:px-6">
        <div className="w-full max-w-md text-center">
          <Loader2 className="animate-spin mx-auto mb-4" size={48} />
          <h1 className="text-2xl sm:text-3xl font-bold">Redirecting...</h1>
          <p className="mt-2 text-neutral-400">You will be redirected to your destination shortly.</p>
        </div>
      </div>
    </BackgroundBeamsWithCollision>
  )
}

