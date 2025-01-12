'use client'

import { useState } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { LinkIcon, CopyIcon, CheckIcon, Loader2, Lock } from 'lucide-react'
import QRCodeGenerator from '@/components/QRCodeGenerator'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Highlight } from "@/components/ui/hero-highlight"
import { FlipWords } from '@/components/ui/FlipWords'
import { BackgroundBeamsWithCollision } from '@/components/ui/background-beams-with-collision'

export default function URLShortener() {
  const [originalUrl, setOriginalUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [message, setMessage] = useState('')
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [expirationDate, setExpirationDate] = useState<Date | undefined>(undefined)
  const [isPasswordProtected, setIsPasswordProtected] = useState(false)
  const [password, setPassword] = useState('')

  function formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await axios.post('/api/shorten/add', {
        originalUrl,
        shortUrl,
        expirationDate,
        isPasswordProtected,
        password: isPasswordProtected ? password : undefined
      })
      setMessage(`${process.env.NEXT_PUBLIC_BASE_URL}/${response.data.shortUrl}`)
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        setMessage(error.response.data?.error || 'An error occurred')
      } else {
        setMessage('An error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const list1 = ["Shrink", "Minify"]

  const resetForm = () => {
    setOriginalUrl('')
    setShortUrl('')
    setExpirationDate(undefined)
    setIsPasswordProtected(false)
    setPassword('')
    setMessage('')
  }

  return (
    <BackgroundBeamsWithCollision className="min-h-screen">
      <div className="min-h-screen text-white flex flex-col justify-between w-full relative">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-black/80" />
        
        {/* Animated Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 animate-gradient-xy" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/80" />

        <main className="w-full px-4 sm:px-6 py-8 flex-grow flex items-center overflow-x-hidden relative z-10">
          <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-8 lg:gap-12">
            {/* Left Content */}
            <div className="lg:w-1/2 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8 lg:mb-0"
              >
                <h1 className="mt-20 md:mt-4 text-4xl sm:text-5xl lg:text-7xl font-bold mb-4">Linking <Highlight>Link</Highlight></h1>
                <p className="text-xl sm:text-2xl text-neutral-400">
                  <FlipWords words={list1} duration={5000} /> Links, Maximize Your Reach
                </p>
              </motion.div>
              <div className="mt-8 space-y-4 hidden lg:block">
                <div className="flex items-center space-x-3">
                  <Lock size={24} className="text-indigo-400" />
                  <p className="text-lg text-neutral-300">Password-Protected Links</p>
                </div>
                <div className="flex items-center space-x-3">
                  <CalendarIcon size={24} className="text-indigo-400" />
                  <p className="text-lg text-neutral-300">Set Expiration Dates</p>
                </div>
                <div className="flex items-center space-x-3">
                  <LinkIcon size={24} className="text-indigo-400" />
                  <p className="text-lg text-neutral-300">Custom Short URLs</p>
                </div>
              </div>
            </div>

            {/* Right Content - Cards */}
            <div className="lg:w-1/2 w-full max-w-md relative">
              {!message ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="relative group"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-xy"></div>
                  <Card className="relative bg-black/90 border-neutral-800 backdrop-blur-sm">
                    <CardHeader className="px-4 sm:px-6">
                      <CardTitle className="text-2xl text-white font-semibold text-center">Shorten Your URL</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 sm:px-6 mt-1">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="relative">
                          <Input
                            type="url"
                            placeholder="Enter your long URL"
                            value={originalUrl}
                            onChange={(e) => setOriginalUrl(e.target.value)}
                            required
                            className="bg-neutral-900 text-neutral-100 border-neutral-700 focus:ring-2 focus:ring-indigo-500 pl-10"
                          />
                          <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
                        </div>
                        <div className="relative">
                          <Input
                            type="text"
                            placeholder="Custom short URL (optional)"
                            value={shortUrl}
                            onChange={(e) => setShortUrl(e.target.value)}
                            className="bg-neutral-900 text-neutral-100 border-neutral-700 focus:ring-2 focus:ring-indigo-500 pl-10"
                          />
                          <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="password-protection"
                            checked={isPasswordProtected}
                            onCheckedChange={setIsPasswordProtected}
                          />
                          <Label htmlFor="password-protection" className="text-neutral-300">Password Protection</Label>
                        </div>
                        {isPasswordProtected && (
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
                        )}
                        <div className="flex flex-col space-y-2">
                          <Label htmlFor="expiration-date" className="text-neutral-300">Expiration Date (Optional)</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !expirationDate && "text-neutral-400"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {expirationDate ? formatDate(expirationDate) : <span>Pick a date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={expirationDate}
                                onSelect={setExpirationDate}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <Button
                          type="submit"
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out transform hover:scale-105"
                          disabled={loading}
                        >
                          {loading ? (
                            <Loader2 className="animate-spin mr-2" size={18} />
                          ) : (
                            'Shorten URL'
                          )}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative group"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-xy"></div>
                  <Card className="relative bg-black/90 border-neutral-800 backdrop-blur-sm">
                    <CardContent className="flex flex-col items-center justify-center space-y-4 py-6 px-4 sm:px-6">
                    <p className="text-lg text-neutral-400 mb-2">Your shortened URL:</p>
                      <div className="flex items-center justify-center space-x-2 w-full">
                        <div className="w-full sm:max-w-[80%] break-all">
                          <Link
                            href={message}
                            className="text-lg sm:text-xl font-semibold text-indigo-400 hover:text-indigo-300 transition-colors duration-300"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {message}
                          </Link>
                        </div>
                        <Button
                          onClick={copyToClipboard}
                          variant="ghost"
                          size="icon"
                          className="text-neutral-400 hover:text-neutral-300 focus:ring-2 focus:ring-indigo-500"
                        >
                          {copied ? <CheckIcon size={20} /> : <CopyIcon size={20} />}
                        </Button>
                      </div>
                      <QRCodeGenerator url={message} />
                      <Button
                        onClick={resetForm}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out transform hover:scale-105"
                      >
                        Make Another
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          </div>
        </main>

        <footer className="bg-neutral-900/80 backdrop-blur-sm py-4 text-center w-full mt-8 relative z-10 mb-4 md:mb-0">
          <p className="text-neutral-400">Made with 🫶 by Raghav</p>
          <div className="mt-2 space-x-4">
            <Link href="https://linkedin.com/in/singlaraghav" className="text-indigo-400 hover:text-indigo-300">LinkedIn</Link>
            <Link href="mailto:04raghavsingla28@gmail.com" className="text-indigo-400 hover:text-indigo-300">Email</Link>
            <Link href="https://github.com/raghavog" className="text-indigo-400 hover:text-indigo-300">GitHub</Link>
          </div>
        </footer>
      </div>
    </BackgroundBeamsWithCollision>
  )
}