/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { LinkIcon, CopyIcon, CheckIcon, Loader2, Lock, Share2 } from 'lucide-react'
import { QRCodeGenerator } from '@/components/QRCodeGenerator'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";


export default function Component() {
  const [originalUrl, setOriginalUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [message, setMessage] = useState('')
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [expirationDate, setExpirationDate] = useState<Date | undefined>(undefined)
  const [isPasswordProtected, setIsPasswordProtected] = useState(false)
  const [password, setPassword] = useState('')

  function formatDate(date: Date, formatString: string): string {
    const options: Record<string, any> = {};
  
    // Parsing the format string and assigning options for the `Intl.DateTimeFormat`
    if (formatString.includes('yyyy')) options.year = 'numeric';
    if (formatString.includes('MM')) options.month = '2-digit';
    if (formatString.includes('dd')) options.day = '2-digit';
    if (formatString.includes('HH')) options.hour = '2-digit';
    if (formatString.includes('mm')) options.minute = '2-digit';
    if (formatString.includes('ss')) options.second = '2-digit';
    
    const formatter = new Intl.DateTimeFormat('en-US', options);
    return formatter.format(date);
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
      setOriginalUrl('')
      setShortUrl('')
      setExpirationDate(undefined)
      setIsPasswordProtected(false)
      setPassword('')
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareOnSocialMedia = (platform: string) => {
    let url = ''
    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(message)}`
        break
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(message)}`
        break
      case 'linkedin':
        url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(message)}`
        break
    }
    window.open(url, '_blank')
  }

  return (
    <HeroHighlight >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold mb-2">Linking Link</h1>
        <p className="text-xl text-gray-400">Simplify your links with ease</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-md"
      >
        <Card className="bg-gray-300 border-gray-700">
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
              <div className="flex items-center space-x-2">
                <Switch
                  id="password-protection"
                  checked={isPasswordProtected}
                  onCheckedChange={setIsPasswordProtected}
                />
                <Label htmlFor="password-protection">Password Protection</Label>
              </div>
              {isPasswordProtected && (
                <div className="relative">
                  <Input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-gray-700 text-gray-100 border-gray-600 focus:ring-2 focus:ring-blue-500 pl-10"
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>
              )}
              <div className="flex flex-col space-y-2">
                <Label htmlFor="expiration-date">Expiration Date (Optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !expirationDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {expirationDate ? formatDate(expirationDate, "PPP") : <span>Pick a date</span>}
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
          className="mt-8 text-center w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-lg text-gray-400 mb-2">Your shortened URL:</p>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="flex flex-col items-center justify-center space-y-4 py-4">
              <div className="flex items-center space-x-2 w-full">
                <Link
                  href={message}
                  className="text-xl font-semibold text-blue-400 hover:text-blue-300 transition-colors duration-300 truncate max-w-[200px]"
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
              </div>
              <div className="flex space-x-2">
                <Button onClick={() => shareOnSocialMedia('twitter')} className="bg-blue-400 hover:bg-blue-500">
                  <Share2 className="mr-2" size={16} />
                  Twitter
                </Button>
                <Button onClick={() => shareOnSocialMedia('facebook')} className="bg-blue-600 hover:bg-blue-700">
                  <Share2 className="mr-2" size={16} />
                  Facebook
                </Button>
                <Button onClick={() => shareOnSocialMedia('linkedin')} className="bg-blue-800 hover:bg-blue-900">
                  <Share2 className="mr-2" size={16} />
                  LinkedIn
                </Button>
              </div>
              <QRCodeGenerator url={message} />
            </CardContent>
          </Card>
        </motion.div>
      )}
    </HeroHighlight>
  )
}

