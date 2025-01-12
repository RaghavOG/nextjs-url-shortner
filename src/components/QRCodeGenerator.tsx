import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { DownloadIcon } from 'lucide-react';

interface QRCodeGeneratorProps {
  url: string;
}

export default function QRCodeGenerator({ url }: QRCodeGeneratorProps) {
  const [showQR, setShowQR] = useState(false);

  const downloadQRCode = () => {
    // Create a temporary SVG element
    const svg = document.getElementById('qr-code');
    if (!svg) return;

    // Create a canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();

    // Set up image load handler
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      // Convert to PNG and download
      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = 'qr-code.png';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };

    // Create a blob URL from the SVG
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    img.src = svgUrl;
  };

  return (
    <div className="mt-4 flex flex-col items-center w-full">
      <Button
        onClick={() => setShowQR(!showQR)}
        className="mb-2 bg-purple-600 hover:bg-purple-700"
      >
        {showQR ? 'Hide QR Code' : 'Show QR Code'}
      </Button>
      {showQR && (
        <div className="flex flex-col items-center justify-center w-full">
          <div className="p-4 bg-white rounded-lg">
            <QRCodeSVG 
              id="qr-code" 
              value={url} 
              size={128} 
              level="H"
              includeMargin={true}
            />
          </div>
          <Button
            onClick={downloadQRCode}
            className="mt-4 bg-green-600 hover:bg-green-700"
          >
            <DownloadIcon className="mr-2 h-4 w-4" />
            Download QR Code
          </Button>
        </div>
      )}
    </div>
  );
}