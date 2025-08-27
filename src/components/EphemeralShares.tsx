import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  QrCode, 
  Timer, 
  Share2, 
  Eye,
  Copy,
  Trash2,
  Clock,
  Shield,
  Users,
  Download,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Zap,
  Link,
  Calendar,
  Lock,
  Unlock,
  MapPin,
  Smartphone,
  Globe
} from 'lucide-react';

interface EphemeralShare {
  id: string;
  title: string;
  type: 'album' | 'single' | 'collection';
  qrCode: string;
  shareUrl: string;
  createdAt: Date;
  expiresAt: Date;
  viewCount: number;
  downloadCount: number;
  maxViews?: number;
  maxDownloads?: number;
  status: 'active' | 'expired' | 'revoked';
  passwordProtected: boolean;
  locationRestricted: boolean;
  allowedRegions?: string[];
  photosCount: number;
  lastAccessed?: Date;
  accessLog: {
    timestamp: Date;
    userAgent: string;
    location: string;
    action: 'view' | 'download';
  }[];
}

interface ShareSettings {
  duration: string;
  maxViews?: number;
  maxDownloads?: number;
  passwordProtected: boolean;
  password?: string;
  locationRestricted: boolean;
  allowedRegions: string[];
  allowDownloads: boolean;
  watermarkPhotos: boolean;
  trackAnalytics: boolean;
}

const EphemeralShares = () => {
  const [shares, setShares] = useState<EphemeralShare[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedShare, setSelectedShare] = useState<EphemeralShare | null>(null);
  const [shareSettings, setShareSettings] = useState<ShareSettings>({
    duration: '24h',
    passwordProtected: false,
    locationRestricted: false,
    allowedRegions: [],
    allowDownloads: true,
    watermarkPhotos: false,
    trackAnalytics: true
  });
  const [newShareTitle, setNewShareTitle] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const mockShares: EphemeralShare[] = [
    {
      id: '1',
      title: 'Wedding Ceremony Photos',
      type: 'album',
      qrCode: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmZiIvPjxyZWN0IHg9IjIwIiB5PSIyMCIgd2lkdGg9IjE2MCIgaGVpZ2h0PSIxNjAiIGZpbGw9IiMwMDAiLz48L3N2Zz4=',
      shareUrl: 'https://share.hub/x7k9m2',
      createdAt: new Date(Date.now() - 7200000),
      expiresAt: new Date(Date.now() + 86400000),
      viewCount: 47,
      downloadCount: 12,
      maxViews: 100,
      status: 'active',
      passwordProtected: true,
      locationRestricted: false,
      photosCount: 156,
      lastAccessed: new Date(Date.now() - 300000),
      accessLog: [
        { timestamp: new Date(Date.now() - 300000), userAgent: 'iPhone Safari', location: 'San Francisco, CA', action: 'view' },
        { timestamp: new Date(Date.now() - 600000), userAgent: 'Chrome Desktop', location: 'New York, NY', action: 'download' }
      ]
    },
    {
      id: '2',
      title: 'Reception Highlights',
      type: 'collection',
      qrCode: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmZiIvPjxyZWN0IHg9IjMwIiB5PSIzMCIgd2lkdGg9IjE0MCIgaGVpZ2h0PSIxNDAiIGZpbGw9IiMwMDAiLz48L3N2Zz4=',
      shareUrl: 'https://share.hub/p3n8q5',
      createdAt: new Date(Date.now() - 3600000),
      expiresAt: new Date(Date.now() + 172800000),
      viewCount: 23,
      downloadCount: 8,
      status: 'active',
      passwordProtected: false,
      locationRestricted: true,
      allowedRegions: ['US', 'CA'],
      photosCount: 89,
      lastAccessed: new Date(Date.now() - 900000),
      accessLog: [
        { timestamp: new Date(Date.now() - 900000), userAgent: 'Android Chrome', location: 'Los Angeles, CA', action: 'view' }
      ]
    },
    {
      id: '3',
      title: 'Behind the Scenes',
      type: 'single',
      qrCode: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmZiIvPjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjE4MCIgaGVpZ2h0PSIxODAiIGZpbGw9IiMwMDAiLz48L3N2Zz4=',
      shareUrl: 'https://share.hub/m7r2k9',
      createdAt: new Date(Date.now() - 86400000),
      expiresAt: new Date(Date.now() - 3600000),
      viewCount: 156,
      downloadCount: 45,
      maxViews: 200,
      maxDownloads: 50,
      status: 'expired',
      passwordProtected: false,
      locationRestricted: false,
      photosCount: 34,
      accessLog: []
    }
  ];

  useEffect(() => {
    setShares(mockShares);
    
    // Auto-refresh status every 30 seconds
    const interval = setInterval(() => {
      setShares(prev => prev.map(share => {
        const now = new Date();
        if (share.expiresAt < now && share.status === 'active') {
          return { ...share, status: 'expired' as const };
        }
        return share;
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const createEphemeralShare = async () => {
    if (!newShareTitle.trim()) return;
    
    setIsCreating(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    const durationMap: Record<string, number> = {
      '1h': 3600000,
      '6h': 21600000,
      '24h': 86400000,
      '7d': 604800000,
      '30d': 2592000000
    };

    const newShare: EphemeralShare = {
      id: Date.now().toString(),
      title: newShareTitle,
      type: 'album',
      qrCode: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmZiIvPjxyZWN0IHg9IjIwIiB5PSIyMCIgd2lkdGg9IjE2MCIgaGVpZ2h0PSIxNjAiIGZpbGw9IiMwMDAiLz48L3N2Zz4=',
      shareUrl: `https://share.hub/${Math.random().toString(36).substring(2, 8)}`,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + durationMap[shareSettings.duration]),
      viewCount: 0,
      downloadCount: 0,
      maxViews: shareSettings.maxViews,
      maxDownloads: shareSettings.maxDownloads,
      status: 'active',
      passwordProtected: shareSettings.passwordProtected,
      locationRestricted: shareSettings.locationRestricted,
      allowedRegions: shareSettings.allowedRegions,
      photosCount: Math.floor(Math.random() * 100) + 20,
      accessLog: []
    };

    setShares(prev => [newShare, ...prev]);
    setIsCreating(false);
    setNewShareTitle('');
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const revokeShare = (shareId: string) => {
    setShares(prev => prev.map(share => 
      share.id === shareId ? { ...share, status: 'revoked' as const } : share
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100 border-green-200';
      case 'expired': return 'text-red-600 bg-red-100 border-red-200';
      case 'revoked': return 'text-gray-600 bg-gray-100 border-gray-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'expired': return <Clock className="h-4 w-4" />;
      case 'revoked': return <AlertCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const formatTimeRemaining = (expiresAt: Date) => {
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="space-y-6">
      {/* Header & Create */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-electric-blue" />
            Ephemeral Shares
          </CardTitle>
          <CardDescription>
            Create temporary QR code shares with automatic expiration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Share Title</Label>
                <Input
                  placeholder="e.g., Wedding Reception Photos"
                  value={newShareTitle}
                  onChange={(e) => setNewShareTitle(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <Select value={shareSettings.duration} onValueChange={(v) => setShareSettings(prev => ({ ...prev, duration: v }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1h">1 Hour</SelectItem>
                      <SelectItem value="6h">6 Hours</SelectItem>
                      <SelectItem value="24h">24 Hours</SelectItem>
                      <SelectItem value="7d">7 Days</SelectItem>
                      <SelectItem value="30d">30 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Max Views</Label>
                  <Input
                    type="number"
                    placeholder="Unlimited"
                    value={shareSettings.maxViews || ''}
                    onChange={(e) => setShareSettings(prev => ({ 
                      ...prev, 
                      maxViews: e.target.value ? parseInt(e.target.value) : undefined 
                    }))}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Password Protection</Label>
                  <p className="text-sm text-muted-foreground">Require password to access</p>
                </div>
                <Switch 
                  checked={shareSettings.passwordProtected} 
                  onCheckedChange={(checked) => setShareSettings(prev => ({ ...prev, passwordProtected: checked }))} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Location Restriction</Label>
                  <p className="text-sm text-muted-foreground">Limit access by region</p>
                </div>
                <Switch 
                  checked={shareSettings.locationRestricted} 
                  onCheckedChange={(checked) => setShareSettings(prev => ({ ...prev, locationRestricted: checked }))} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Allow Downloads</Label>
                  <p className="text-sm text-muted-foreground">Let users download photos</p>
                </div>
                <Switch 
                  checked={shareSettings.allowDownloads} 
                  onCheckedChange={(checked) => setShareSettings(prev => ({ ...prev, allowDownloads: checked }))} 
                />
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <Button 
              onClick={createEphemeralShare}
              disabled={isCreating || !newShareTitle.trim()}
              size="lg"
              className="min-w-[200px]"
            >
              {isCreating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <QrCode className="h-4 w-4 mr-2" />
                  Create Ephemeral Share
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Shares */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5 text-electric-blue" />
            Your Ephemeral Shares ({shares.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {shares.map((share) => (
              <Card key={share.id} className="border">
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    {/* QR Code */}
                    <div className="w-24 h-24 bg-white p-2 rounded-lg border flex-shrink-0">
                      <img src={share.qrCode} alt="QR Code" className="w-full h-full" />
                    </div>
                    
                    {/* Share Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold">{share.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span>Created {formatDate(share.createdAt)}</span>
                            <span>{share.photosCount} photos</span>
                            {share.lastAccessed && (
                              <span>Last accessed {formatDate(share.lastAccessed)}</span>
                            )}
                          </div>
                        </div>
                        <Badge variant="outline" className={`${getStatusColor(share.status)} border text-xs`}>
                          {getStatusIcon(share.status)}
                          <span className="ml-1 capitalize">{share.status}</span>
                        </Badge>
                      </div>
                      
                      {/* Share URL */}
                      <div className="flex items-center gap-2 mb-4 p-3 bg-muted/30 rounded-lg">
                        <Link className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <code className="text-sm flex-1 font-mono">{share.shareUrl}</code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(share.shareUrl, share.id)}
                        >
                          {copiedId === share.id ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                      
                      {/* Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center p-3 border rounded-lg">
                          <Eye className="h-4 w-4 mx-auto mb-1 text-blue-500" />
                          <p className="text-lg font-bold">{share.viewCount}</p>
                          <p className="text-xs text-muted-foreground">Views</p>
                          {share.maxViews && (
                            <p className="text-xs text-muted-foreground">/ {share.maxViews}</p>
                          )}
                        </div>
                        
                        <div className="text-center p-3 border rounded-lg">
                          <Download className="h-4 w-4 mx-auto mb-1 text-green-500" />
                          <p className="text-lg font-bold">{share.downloadCount}</p>
                          <p className="text-xs text-muted-foreground">Downloads</p>
                          {share.maxDownloads && (
                            <p className="text-xs text-muted-foreground">/ {share.maxDownloads}</p>
                          )}
                        </div>
                        
                        <div className="text-center p-3 border rounded-lg">
                          <Timer className="h-4 w-4 mx-auto mb-1 text-orange-500" />
                          <p className="text-lg font-bold">{formatTimeRemaining(share.expiresAt)}</p>
                          <p className="text-xs text-muted-foreground">Remaining</p>
                        </div>
                        
                        <div className="text-center p-3 border rounded-lg">
                          <Users className="h-4 w-4 mx-auto mb-1 text-purple-500" />
                          <p className="text-lg font-bold">{share.accessLog.length}</p>
                          <p className="text-xs text-muted-foreground">Unique Users</p>
                        </div>
                      </div>
                      
                      {/* Security Features */}
                      <div className="flex items-center gap-4 mb-4">
                        {share.passwordProtected && (
                          <Badge variant="secondary" className="text-xs">
                            <Lock className="h-3 w-3 mr-1" />
                            Password Protected
                          </Badge>
                        )}
                        {share.locationRestricted && (
                          <Badge variant="secondary" className="text-xs">
                            <MapPin className="h-3 w-3 mr-1" />
                            Region Locked
                          </Badge>
                        )}
                        <Badge variant="secondary" className="text-xs">
                          <Shield className="h-3 w-3 mr-1" />
                          Encrypted
                        </Badge>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedShare(share)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View Analytics
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => copyToClipboard(share.shareUrl, `url-${share.id}`)}
                        >
                          {copiedId === `url-${share.id}` ? 'Copied!' : 'Copy Link'}
                        </Button>
                        {share.status === 'active' && (
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => revokeShare(share.id)}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Revoke
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analytics Modal */}
      {selectedShare && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Analytics: {selectedShare.title}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setSelectedShare(null)}>
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Access Log */}
              <div>
                <h4 className="font-medium mb-3">Recent Access Log</h4>
                <div className="space-y-2">
                  {selectedShare.accessLog.length > 0 ? (
                    selectedShare.accessLog.slice(0, 10).map((log, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg text-sm">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${log.action === 'view' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                            {log.action === 'view' ? <Eye className="h-3 w-3" /> : <Download className="h-3 w-3" />}
                          </div>
                          <div>
                            <p className="font-medium capitalize">{log.action}</p>
                            <p className="text-muted-foreground">{log.userAgent}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{log.location}</p>
                          <p className="text-muted-foreground">{formatDate(log.timestamp)}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-8">No access logs yet</p>
                  )}
                </div>
              </div>
              
              {/* Share Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium">Share Settings</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Created:</span>
                      <span>{formatDate(selectedShare.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Expires:</span>
                      <span>{formatDate(selectedShare.expiresAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <Badge variant="outline" className={`${getStatusColor(selectedShare.status)} text-xs`}>
                        {selectedShare.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium">Security</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Password:</span>
                      <span>{selectedShare.passwordProtected ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Location Lock:</span>
                      <span>{selectedShare.locationRestricted ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Encryption:</span>
                      <span>End-to-end</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Info Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-electric-blue mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-medium mb-2">Ephemeral Share Security</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• QR codes and links automatically expire after set duration</li>
                <li>• Optional password protection and geographic restrictions</li>
                <li>• Complete access logging with device and location tracking</li>
                <li>• Photos can include dynamic watermarks for protection</li>
                <li>• All shares use end-to-end encryption in transit</li>
                <li>• Immediate revocation capability for active shares</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EphemeralShares;