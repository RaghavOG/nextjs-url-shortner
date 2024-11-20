'use client';

import { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function HomePage() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [message, setMessage] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('/api/shorten/add', { originalUrl, shortUrl });
      setMessage(`Short URL created: ${process.env.NEXT_PUBLIC_BASE_URL}/${response.data.shortUrl}`);
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-8">URL Shortener</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-lg p-6 bg-gray-800 rounded-lg shadow-lg">
        <Input
          type="url"
          placeholder="Original URL"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          required
          className="bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-blue-500"
        />
        <Input
          type="text"
          placeholder="Custom Short URL"
          value={shortUrl}
          onChange={(e) => setShortUrl(e.target.value)}
          required
          className="bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-blue-500"
        />
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white focus:ring-2 focus:ring-blue-500">
          Shorten
        </Button>
      </form>
      
      {message && (
        <div className="mt-6 text-center">
          <p className="text-lg text-gray-300">{message}</p>
          {message.includes(process.env.NEXT_PUBLIC_BASE_URL) && (
            <a
              href={message.replace('Short URL created: ', '')}
              className="text-blue-400 hover:underline mt-2 block"
              target="_blank"
              rel="noopener noreferrer"
            >
              Click here to visit the shortened URL
            </a>
          )}
        </div>
      )}
    </div>
  );
}
