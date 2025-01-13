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
      <div className="min-h-screen text-white flex flex-col justify-center items-center w-full relative px-4">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-black/80" />
        
        {/* Animated Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 animate-gradient-xy" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/80" />

        <div className="relative group z-10">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 animate-gradient-xy"></div>
          <div className="relative bg-black/90 backdrop-blur-sm rounded-lg p-8 w-full max-w-md">
            <div className="text-center">
              <Loader2 className="animate-spin mx-auto mb-6 text-indigo-400" size={48} />
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 inline-block text-transparent bg-clip-text">
                Redirecting...
              </h1>
              <p className="mt-4 text-neutral-400">
                You will be redirected to your destination shortly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </BackgroundBeamsWithCollision>
  )
}