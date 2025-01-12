/* eslint-disable @typescript-eslint/no-explicit-any */
// PasswordProtectedForm.tsx
'use client'

import { useState } from 'react'
import axios from 'axios'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function PasswordProtectedForm({ shortUrl }: { shortUrl: string }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      console.log('Submitting password for shortUrl:', shortUrl);
      
      const response = await axios.post(`/api/shorturl/${shortUrl}`, { 
        password,
      });

      console.log('Response received:', response.data);

      if (response.data.originalUrl) {
        window.location.href = response.data.originalUrl;
      } else {
        setError('Invalid response from server');
      }
    } catch (error: any) {
      console.error('Error details:', error.response?.data);
      setError(error.response?.data?.error || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Enter Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="text-red-600 text-center mb-4">
                {error}
              </div>
            )}
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'Submit'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}