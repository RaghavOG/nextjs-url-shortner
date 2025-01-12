/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import axios from 'axios'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Lock } from 'lucide-react'

export default function PasswordProtectedForm({ shortUrl }: { shortUrl: string }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      console.log('Submitting password for shortUrl:', shortUrl)
      
      const response = await axios.post(`/api/shorturl/${shortUrl}`, { 
        password,
      })

      console.log('Response received:', response.data)

      if (response.data.originalUrl) {
        window.location.href = response.data.originalUrl
      } else {
        setError('Invalid response from server')
      }
    } catch (error: any) {
      console.error('Error details:', error.response?.data)
      setError(error.response?.data?.error || 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="bg-black border-neutral-800 w-full max-w-md">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-2xl text-white font-semibold text-center">Enter Password</CardTitle>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-red-500 text-center mb-4">
              {error}
            </div>
          )}
          <div className="relative">
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-neutral-900 text-neutral-100 border-neutral-700 focus:ring-2 focus:ring-indigo-500 pl-10"
            />
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
          </div>
          <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out transform hover:scale-105"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={18} />
                Submitting...
              </>
            ) : (
              'Submit'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

