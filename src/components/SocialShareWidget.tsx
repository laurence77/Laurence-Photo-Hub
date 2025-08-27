import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Share2, 
  Link2, 
  Facebook, 
  Twitter, 
  MessageCircle,
  Mail,
  QrCode,
  Download,
  Copy,
  Check,
  Instagram,
  Send
} from 'lucide-react';

interface SocialShareProps {
  url: string;
  title: string;
  description: string;
  imageUrl?: string;
  hashtags?: string[];
  showStats?: boolean;
  shares?: number;
  views?: number;
}

const SocialShareWidget = ({ 
  url, 
  title, 
  description, 
  imageUrl, 
  hashtags = [], 
  showStats = false,
  shares = 0,
  views = 0 
}: SocialShareProps) => {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);
  const encodedImage = encodeURIComponent(imageUrl || '');
  const hashtagString = hashtags.map(tag => `#${tag}`).join(' ');

  const shareLinks = [
    {
      name: 'Facebook',
      icon: <Facebook className="h-4 w-4" />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
      color: 'bg-blue-600 hover:bg-blue-700',
      popular: true
    },
    {
      name: 'Twitter',
      icon: <Twitter className="h-4 w-4" />,
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&hashtags=${hashtags.join(',')}`,
      color: 'bg-sky-500 hover:bg-sky-600',
      popular: true
    },
    {
      name: 'Instagram Story',
      icon: <Instagram className="h-4 w-4" />,
      url: `https://www.instagram.com/create/story/?background_asset_id=${encodedImage}`,
      color: 'bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
      popular: false
    },
    {
      name: 'WhatsApp',
      icon: <MessageCircle className="h-4 w-4" />,
      url: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      color: 'bg-green-500 hover:bg-green-600',
      popular: true
    },
    {
      name: 'Email',
      icon: <Mail className="h-4 w-4" />,
      url: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
      color: 'bg-gray-600 hover:bg-gray-700',
      popular: false
    },
    {
      name: 'Telegram',
      icon: <Send className="h-4 w-4" />,
      url: `https://telegram.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      color: 'bg-blue-500 hover:bg-blue-600',
      popular: false
    }
  ];

  const popularLinks = shareLinks.filter(link => link.popular);
  const otherLinks = shareLinks.filter(link => !link.popular);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    }
  };

  const generateQRCode = () => {
    // In production, use a QR code library or service
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedUrl}`;
    
    const qrWindow = window.open('', '_blank', 'width=250,height=250');
    if (qrWindow) {
      qrWindow.document.write(`
        <html>
          <head><title>QR Code - ${title}</title></head>
          <body style="margin: 0; padding: 20px; text-align: center; font-family: Arial, sans-serif;">
            <h3>Scan to view event</h3>
            <img src="${qrUrl}" alt="QR Code" style="margin: 10px 0;" />
            <p style="font-size: 12px; color: #666; margin: 10px 0;">${url}</p>
            <button onclick="window.print()" style="padding: 8px 16px; background: #0099ff; color: white; border: none; border-radius: 4px; cursor: pointer;">Print QR Code</button>
          </body>
        </html>
      `);
    }
  };

  const downloadImage = async () => {
    if (!imageUrl) return;
    
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error('Failed to download image:', err);
    }
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Share2 className="h-5 w-5 electric-accent" />
          <h3 className="font-medium text-gradient-electric">Share This Event</h3>
        </div>
        
        {showStats && (shares > 0 || views > 0) && (
          <div className="flex items-center gap-4 text-sm text-gray-600">
            {shares > 0 && (
              <div className="flex items-center gap-1">
                <Share2 className="h-3 w-3" />
                <span>{shares} shares</span>
              </div>
            )}
            {views > 0 && (
              <div className="flex items-center gap-1">
                <Share2 className="h-3 w-3" />
                <span>{views} views</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Native Share (Mobile) */}
      {navigator.share && (
        <Button
          onClick={handleNativeShare}
          className="w-full mb-4 electric-bg text-white hover:electric-glow vision-pro-rounded"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share Event
        </Button>
      )}

      {/* Popular Social Media */}
      <div className="space-y-3 mb-4">
        <p className="text-sm font-medium text-gray-600">Quick Share</p>
        <div className="grid grid-cols-2 gap-3">
          {popularLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${link.color} text-white px-4 py-3 vision-pro-rounded text-sm font-medium flex items-center justify-center gap-2 transition-colors apple-spring`}
            >
              {link.icon}
              {link.name}
            </a>
          ))}
        </div>
      </div>

      {/* Copy Link */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 flex">
          <input
            type="text"
            value={url}
            readOnly
            className="flex-1 px-3 py-2 border border-gray-200 vision-pro-rounded rounded-r-none bg-gray-50 text-sm text-gray-600 font-mono"
          />
          <Button
            onClick={handleCopyLink}
            variant="outline"
            className={`border-l-0 rounded-l-none vision-pro-rounded ${
              copied ? 'electric-bg text-white' : 'glass-button electric-border electric-accent hover:electric-bg hover:text-white'
            }`}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Additional Options */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="glass-button electric-border electric-accent hover:electric-bg hover:text-white"
        >
          {isExpanded ? 'Less Options' : 'More Options'}
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={generateQRCode}
            className="glass-button electric-border electric-accent hover:electric-bg hover:text-white"
            title="Generate QR Code"
          >
            <QrCode className="h-4 w-4" />
          </Button>
          
          {imageUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={downloadImage}
              className="glass-button electric-border electric-accent hover:electric-bg hover:text-white"
              title="Download Image"
            >
              <Download className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Expanded Options */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
          <p className="text-sm font-medium text-gray-600">More Platforms</p>
          
          <div className="grid grid-cols-1 gap-2">
            {otherLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${link.color} text-white px-4 py-2 vision-pro-rounded text-sm font-medium flex items-center gap-2 transition-colors apple-spring`}
              >
                {link.icon}
                Share on {link.name}
              </a>
            ))}
          </div>

          {/* Hashtags */}
          {hashtags.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-600 mb-2">Suggested Hashtags</p>
              <div className="flex flex-wrap gap-2">
                {hashtags.map((tag) => (
                  <Badge key={tag} variant="outline" className="electric-border text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Embed Code */}
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-600 mb-2">Embed on Website</p>
            <div className="relative">
              <textarea
                readOnly
                value={`<iframe src="${url}?embed=true" width="100%" height="600" frameborder="0"></iframe>`}
                className="w-full h-16 px-3 py-2 border border-gray-200 vision-pro-rounded bg-gray-50 text-xs text-gray-600 font-mono resize-none"
              />
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2 glass-button electric-border electric-accent hover:electric-bg hover:text-white"
                onClick={() => {
                  const embedCode = `<iframe src="${url}?embed=true" width="100%" height="600" frameborder="0"></iframe>`;
                  navigator.clipboard.writeText(embedCode);
                }}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Share Analytics Tracking */}
      <script>
        {`
          // Track social share clicks
          document.querySelectorAll('a[href*="facebook.com"], a[href*="twitter.com"], a[href*="whatsapp"]').forEach(link => {
            link.addEventListener('click', () => {
              // Analytics tracking
              console.log('Social share clicked:', link.href);
              // gtag('event', 'share', { method: platform, content_type: 'event', item_id: eventId });
            });
          });
        `}
      </script>
    </div>
  );
};

export default SocialShareWidget;