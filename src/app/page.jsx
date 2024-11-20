'use client'

import { useState } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { LinkIcon, CopyIcon, CheckIcon, Loader2 } from 'lucide-react'

export default function Component() {
  const [originalUrl, setOriginalUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [message, setMessage] = useState('')
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await axios.post('/api/shorten/add', { originalUrl, shortUrl })
      setMessage(`${process.env.NEXT_PUBLIC_BASE_URL}/${response.data.shortUrl}`)
      setOriginalUrl('')
      setShortUrl('')
    } catch (error) {
      setMessage((error).response?.data?.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 to-indigo-400 text-gray-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold mb-2">URL Shortener</h1>
        <p className="text-xl text-gray-400">Simplify your links with ease</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-md"
      >
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl text-white font-semibold text-center">Shorten Your URL</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Input
                  type="url"
                  placeholder="Enter your long URL"
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                  required
                  className="bg-gray-700 text-gray-100 border-gray-600 focus:ring-2 focus:ring-blue-500 pl-10"
                />
                <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Custom short URL (optional)"
                  value={shortUrl}
                  onChange={(e) => setShortUrl(e.target.value)}
                  className="bg-gray-700 text-gray-100 border-gray-600 focus:ring-2 focus:ring-blue-500 pl-10"
                />
                <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              onClick={handleSubmit}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out transform hover:scale-105"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="animate-spin mr-2" size={18} />
              ) : (
                'Shorten URL'
              )}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
      
      {message && (
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-lg text-gray-400 mb-2">Your shortened URL:</p>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="flex items-center justify-center space-x-2 py-4">
              <Link
                href={message}
                className="text-xl font-semibold text-blue-400 hover:text-blue-300 transition-colors duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                {message}
              </Link>
              <Button
                onClick={copyToClipboard}
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-gray-300 focus:ring-2 focus:ring-blue-500"
              >
                {copied ? <CheckIcon size={20} /> : <CopyIcon size={20} />}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
