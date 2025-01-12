'use client'

import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Button } from '@/components/ui/button'
import { DownloadIcon } from 'lucide-react'

interface QRCodeGeneratorProps {
  url: string
}

export function QRCodeGenerator({ url }: QRCodeGeneratorProps) {
  const [showQR, setShowQR] = useState(false)

  const downloadQRCode = () => {
    const canvas = document.getElementById('qr-code') as HTMLCanvasElement
    const pngUrl = canvas
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream')
    const downloadLink = document.createElement('a')
    downloadLink.href = pngUrl
    downloadLink.download = 'qr-code.png'
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
  }

  return (
    <div className="mt-4">
      <Button
        onClick={() => setShowQR(!showQR)}
        className="mb-2 bg-purple-600 hover:bg-purple-700"
      >
        {showQR ? 'Hide QR Code' : 'Show QR Code'}
      </Button>
      {showQR && (
        <div className="flex flex-col items-center">
          <QRCodeSVG id="qr-code" value={url} size={128} level="H" />
          <Button
            onClick={downloadQRCode}
            className="mt-2 bg-green-600 hover:bg-green-700"
          >
            <DownloadIcon className="mr-2" size={16} />
            Download QR Code
          </Button>
        </div>
      )}
    </div>
  )
}

