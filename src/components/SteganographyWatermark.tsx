import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  Shield, 
  Eye,
  EyeOff,
  Fingerprint,
  Lock,
  Key,
  CheckCircle,
  AlertTriangle,
  Zap,
  Search,
  Download,
  Upload,
  Copy,
  Settings,
  Image,
  FileText,
  Layers,
  Palette,
  RefreshCw,
  Info,
  Camera,
  Globe
} from 'lucide-react';

interface WatermarkedPhoto {
  id: string;
  filename: string;
  originalUrl: string;
  watermarkedUrl: string;
  metadata: {
    owner: string;
    copyright: string;
    event: string;
    timestamp: Date;
    location?: string;
    camera?: string;
  };
  watermarkData: {
    method: 'lsb' | 'dct' | 'dwt';
    strength: number;
    payload: string;
    checksum: string;
  };
  verificationStatus: 'verified' | 'tampered' | 'unknown';
  extractedData?: string;
  lastVerified: Date;
}

interface WatermarkSettings {
  method: 'lsb' | 'dct' | 'dwt';
  strength: number;
  payload: string;
  includeMetadata: boolean;
  autoWatermark: boolean;
  batchProcessing: boolean;
}

const SteganographyWatermark = () => {
  const [photos, setPhotos] = useState<WatermarkedPhoto[]>([]);
  const [settings, setSettings] = useState<WatermarkSettings>({
    method: 'lsb',
    strength: 50,
    payload: '',
    includeMetadata: true,
    autoWatermark: true,
    batchProcessing: false
  });
  const [selectedPhoto, setSelectedPhoto] = useState<WatermarkedPhoto | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [verificationResult, setVerificationResult] = useState<string>('');
  const [selectedView, setSelectedView] = useState<'embed' | 'extract' | 'verify' | 'batch'>('embed');

  const mockPhotos: WatermarkedPhoto[] = [
    {
      id: '1',
      filename: 'wedding_ceremony.jpg',
      originalUrl: '/uploads/a0278ce1-b82d-4ed6-a186-14a9503ef65c.png',
      watermarkedUrl: '/uploads/a0278ce1-b82d-4ed6-a186-14a9503ef65c.png',
      metadata: {
        owner: 'Alex Rodriguez Photography',
        copyright: '© 2024 Alex Rodriguez. All rights reserved.',
        event: 'Sarah & Michael Wedding',
        timestamp: new Date('2024-08-15T16:30:00'),
        location: 'Garden Venue, San Francisco',
        camera: 'Canon EOS R5'
      },
      watermarkData: {
        method: 'dct',
        strength: 75,
        payload: 'OWNER:Alex Rodriguez|EVENT:Sarah & Michael Wedding|DATE:2024-08-15|ID:WED001',
        checksum: 'a1b2c3d4e5f6'
      },
      verificationStatus: 'verified',
      extractedData: 'OWNER:Alex Rodriguez|EVENT:Sarah & Michael Wedding|DATE:2024-08-15|ID:WED001',
      lastVerified: new Date(Date.now() - 300000)
    },
    {
      id: '2',
      filename: 'reception_dance.jpg',
      originalUrl: '/uploads/34a58283-8b82-48f9-88f4-2c88b069921d.png',
      watermarkedUrl: '/uploads/34a58283-8b82-48f9-88f4-2c88b069921d.png',
      metadata: {
        owner: 'Alex Rodriguez Photography',
        copyright: '© 2024 Alex Rodriguez. All rights reserved.',
        event: 'Sarah & Michael Wedding',
        timestamp: new Date('2024-08-15T20:15:00'),
        location: 'Reception Hall'
      },
      watermarkData: {
        method: 'lsb',
        strength: 60,
        payload: 'OWNER:Alex Rodriguez|EVENT:Sarah & Michael Wedding|DATE:2024-08-15|ID:WED002',
        checksum: 'f6e5d4c3b2a1'
      },
      verificationStatus: 'verified',
      extractedData: 'OWNER:Alex Rodriguez|EVENT:Sarah & Michael Wedding|DATE:2024-08-15|ID:WED002',
      lastVerified: new Date(Date.now() - 600000)
    },
    {
      id: '3',
      filename: 'group_photo.jpg',
      originalUrl: '/uploads/47f9a1d0-4458-400a-8fc0-79adf093cf18.png',
      watermarkedUrl: '/uploads/47f9a1d0-4458-400a-8fc0-79adf093cf18.png',
      metadata: {
        owner: 'Guest Photographer',
        copyright: '© 2024 Unknown. Rights disputed.',
        event: 'Sarah & Michael Wedding',
        timestamp: new Date('2024-08-15T19:00:00')
      },
      watermarkData: {
        method: 'dwt',
        strength: 40,
        payload: 'TAMPERED_DATA_DETECTED',
        checksum: 'invalid'
      },
      verificationStatus: 'tampered',
      lastVerified: new Date(Date.now() - 900000)
    }
  ];

  useEffect(() => {
    setPhotos(mockPhotos);
  }, []);

  const embedWatermark = async () => {
    if (!settings.payload.trim()) return;
    
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 3000));

    const newPhoto: WatermarkedPhoto = {
      id: Date.now().toString(),
      filename: 'new_watermarked.jpg',
      originalUrl: '/uploads/a0278ce1-b82d-4ed6-a186-14a9503ef65c.png',
      watermarkedUrl: '/uploads/a0278ce1-b82d-4ed6-a186-14a9503ef65c.png',
      metadata: {
        owner: 'Current User',
        copyright: '© 2024 Current User. All rights reserved.',
        event: 'Test Event',
        timestamp: new Date(),
        location: 'Test Location'
      },
      watermarkData: {
        method: settings.method,
        strength: settings.strength,
        payload: settings.payload,
        checksum: Math.random().toString(36).substring(2, 8)
      },
      verificationStatus: 'verified',
      extractedData: settings.payload,
      lastVerified: new Date()
    };

    setPhotos(prev => [newPhoto, ...prev]);
    setIsProcessing(false);
  };

  const extractWatermark = async (photo: WatermarkedPhoto) => {
    setIsExtracting(true);
    setSelectedPhoto(photo);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (photo.verificationStatus === 'verified') {
      setVerificationResult(photo.extractedData || 'No data extracted');
    } else {
      setVerificationResult('Watermark verification failed - photo may have been tampered with');
    }
    
    setIsExtracting(false);
  };

  const verifyIntegrity = async (photo: WatermarkedPhoto) => {
    setIsExtracting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Update verification status
    setPhotos(prev => prev.map(p => 
      p.id === photo.id 
        ? { ...p, lastVerified: new Date() }
        : p
    ));
    
    setVerificationResult(
      photo.verificationStatus === 'verified' 
        ? 'Photo integrity verified - watermark intact'
        : 'Photo integrity compromised - watermark damaged or removed'
    );
    
    setIsExtracting(false);
  };

  const getMethodDescription = (method: string) => {
    switch (method) {
      case 'lsb': return 'Least Significant Bit - Fast, good for photos with lots of detail';
      case 'dct': return 'Discrete Cosine Transform - Robust against compression';
      case 'dwt': return 'Discrete Wavelet Transform - Most secure, survives image editing';
      default: return '';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-green-600 bg-green-100 border-green-200';
      case 'tampered': return 'text-red-600 bg-red-100 border-red-200';
      case 'unknown': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="h-4 w-4" />;
      case 'tampered': return <AlertTriangle className="h-4 w-4" />;
      case 'unknown': return <Eye className="h-4 w-4" />;
      default: return <Eye className="h-4 w-4" />;
    }
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
      {/* Header */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fingerprint className="h-5 w-5 text-electric-blue" />
            Steganography Watermarking
          </CardTitle>
          <CardDescription>
            Invisible watermarks for photo ownership verification and tamper detection
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Main Interface */}
      <Tabs value={selectedView} onValueChange={(v) => setSelectedView(v as any)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="embed">Embed Watermark</TabsTrigger>
          <TabsTrigger value="extract">Extract & Verify</TabsTrigger>
          <TabsTrigger value="verify">Batch Verification</TabsTrigger>
          <TabsTrigger value="batch">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="embed" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lock className="h-5 w-5 text-electric-blue" />
                Embed Invisible Watermark
              </CardTitle>
              <CardDescription>
                Add copyright and ownership information invisibly into your photos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Steganography Method</Label>
                    <Select value={settings.method} onValueChange={(v) => setSettings(prev => ({ ...prev, method: v as any }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lsb">LSB - Least Significant Bit</SelectItem>
                        <SelectItem value="dct">DCT - Discrete Cosine Transform</SelectItem>
                        <SelectItem value="dwt">DWT - Discrete Wavelet Transform</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      {getMethodDescription(settings.method)}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Watermark Strength: {settings.strength}%</Label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={settings.strength}
                      onChange={(e) => setSettings(prev => ({ ...prev, strength: parseInt(e.target.value) }))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Subtle</span>
                      <span>Robust</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Include Metadata</Label>
                      <p className="text-sm text-muted-foreground">Add camera and location data</p>
                    </div>
                    <Switch 
                      checked={settings.includeMetadata} 
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, includeMetadata: checked }))} 
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Auto-watermark uploads</Label>
                      <p className="text-sm text-muted-foreground">Automatically protect new photos</p>
                    </div>
                    <Switch 
                      checked={settings.autoWatermark} 
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoWatermark: checked }))} 
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Watermark Payload</Label>
                    <Textarea
                      placeholder="Enter copyright info, ownership details, or identification data..."
                      value={settings.payload}
                      onChange={(e) => setSettings(prev => ({ ...prev, payload: e.target.value }))}
                      rows={4}
                    />
                    <p className="text-sm text-muted-foreground">
                      Max 500 characters. Will be embedded invisibly in the image.
                    </p>
                  </div>

                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      Suggested Format
                    </h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>OWNER:Your Name</p>
                      <p>COPYRIGHT:© 2024 Your Name</p>
                      <p>EVENT:Event Name</p>
                      <p>DATE:2024-08-26</p>
                      <p>ID:Unique_ID_123</p>
                    </div>
                  </div>

                  <Button 
                    onClick={embedWatermark}
                    disabled={isProcessing || !settings.payload.trim()}
                    className="w-full"
                    size="lg"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Embedding Watermark...
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Embed Watermark
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="extract" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Search className="h-5 w-5 text-electric-blue" />
                Extract & Verify Watermarks
              </CardTitle>
              <CardDescription>
                Detect and extract hidden watermarks from photos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-4">Select Photo to Analyze</h4>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {photos.map((photo) => (
                      <div
                        key={photo.id}
                        className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50"
                        onClick={() => extractWatermark(photo)}
                      >
                        <div className="w-12 h-12 bg-muted rounded overflow-hidden">
                          <img src={photo.watermarkedUrl} alt={photo.filename} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{photo.filename}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className={`${getStatusColor(photo.verificationStatus)} text-xs border`}>
                              {getStatusIcon(photo.verificationStatus)}
                              <span className="ml-1">{photo.verificationStatus}</span>
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {photo.watermarkData.method.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Search className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Extraction Results</h4>
                  
                  {isExtracting ? (
                    <div className="text-center py-12">
                      <RefreshCw className="h-8 w-8 mx-auto mb-4 animate-spin text-electric-blue" />
                      <p className="text-muted-foreground">Analyzing image for hidden watermarks...</p>
                    </div>
                  ) : verificationResult ? (
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <h5 className="font-medium mb-2">Extracted Data</h5>
                        <pre className="text-sm bg-muted/50 p-3 rounded whitespace-pre-wrap">
                          {verificationResult}
                        </pre>
                      </div>
                      
                      {selectedPhoto && (
                        <div className="space-y-3">
                          <h5 className="font-medium">Photo Metadata</h5>
                          <div className="grid grid-cols-1 gap-2 text-sm">
                            <div className="flex justify-between">
                              <span>Owner:</span>
                              <span>{selectedPhoto.metadata.owner}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Event:</span>
                              <span>{selectedPhoto.metadata.event}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Timestamp:</span>
                              <span>{formatDate(selectedPhoto.metadata.timestamp)}</span>
                            </div>
                            {selectedPhoto.metadata.location && (
                              <div className="flex justify-between">
                                <span>Location:</span>
                                <span>{selectedPhoto.metadata.location}</span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span>Last Verified:</span>
                              <span>{formatDate(selectedPhoto.lastVerified)}</span>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => verifyIntegrity(selectedPhoto)}
                            >
                              <Shield className="h-3 w-3 mr-1" />
                              Verify Integrity
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="h-3 w-3 mr-1" />
                              Export Report
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Eye className="h-8 w-8 mx-auto mb-4" />
                      <p>Select a photo to extract and verify its watermark</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verify" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-electric-blue" />
                Batch Verification
              </CardTitle>
              <CardDescription>
                Verify the integrity of multiple watermarked photos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {photos.map((photo) => (
                  <div key={photo.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-muted rounded overflow-hidden">
                        <img src={photo.watermarkedUrl} alt={photo.filename} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-medium">{photo.filename}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className={`${getStatusColor(photo.verificationStatus)} text-xs border`}>
                            {getStatusIcon(photo.verificationStatus)}
                            <span className="ml-1">{photo.verificationStatus}</span>
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {photo.metadata.owner}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Last verified: {formatDate(photo.lastVerified)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="text-right text-sm">
                        <p className="font-medium">Method: {photo.watermarkData.method.toUpperCase()}</p>
                        <p className="text-muted-foreground">Strength: {photo.watermarkData.strength}%</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => verifyIntegrity(photo)}
                        disabled={isExtracting}
                      >
                        {isExtracting ? (
                          <RefreshCw className="h-3 w-3 animate-spin" />
                        ) : (
                          <CheckCircle className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center pt-4">
                <Button size="lg">
                  <Shield className="h-4 w-4 mr-2" />
                  Verify All Photos
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="batch" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-5 w-5 text-electric-blue" />
                Watermarking Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Default Settings</h4>
                  
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label>Default Method</Label>
                      <Select value={settings.method} onValueChange={(v) => setSettings(prev => ({ ...prev, method: v as any }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lsb">LSB (Fast)</SelectItem>
                          <SelectItem value="dct">DCT (Robust)</SelectItem>
                          <SelectItem value="dwt">DWT (Secure)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Default Strength</Label>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={settings.strength}
                        onChange={(e) => setSettings(prev => ({ ...prev, strength: parseInt(e.target.value) }))}
                        className="w-full"
                      />
                      <div className="text-center text-sm text-muted-foreground">
                        {settings.strength}%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Automation</h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Auto-watermark uploads</Label>
                        <p className="text-sm text-muted-foreground">Automatically protect new photos</p>
                      </div>
                      <Switch 
                        checked={settings.autoWatermark} 
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoWatermark: checked }))} 
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Batch processing</Label>
                        <p className="text-sm text-muted-foreground">Process multiple photos at once</p>
                      </div>
                      <Switch 
                        checked={settings.batchProcessing} 
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, batchProcessing: checked }))} 
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Include metadata</Label>
                        <p className="text-sm text-muted-foreground">Embed EXIF data in watermarks</p>
                      </div>
                      <Switch 
                        checked={settings.includeMetadata} 
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, includeMetadata: checked }))} 
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-medium mb-4">Security Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-semibold mb-2 flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      LSB Method
                    </h5>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Fast embedding</li>
                      <li>• Large capacity</li>
                      <li>• Vulnerable to compression</li>
                      <li>• Best for sharing</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-semibold mb-2 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      DCT Method
                    </h5>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Compression resistant</li>
                      <li>• Medium capacity</li>
                      <li>• Balanced security</li>
                      <li>• JPEG friendly</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-semibold mb-2 flex items-center gap-2">
                      <Fingerprint className="h-4 w-4" />
                      DWT Method
                    </h5>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Highest security</li>
                      <li>• Editing resistant</li>
                      <li>• Lower capacity</li>
                      <li>• Professional grade</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Shield className="h-6 w-6 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold">{photos.filter(p => p.verificationStatus === 'verified').length}</p>
            <p className="text-xs text-muted-foreground">Verified</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-6 w-6 mx-auto mb-2 text-red-500" />
            <p className="text-2xl font-bold">{photos.filter(p => p.verificationStatus === 'tampered').length}</p>
            <p className="text-xs text-muted-foreground">Tampered</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Image className="h-6 w-6 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-bold">{photos.length}</p>
            <p className="text-xs text-muted-foreground">Total Photos</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Zap className="h-6 w-6 mx-auto mb-2 text-purple-500" />
            <p className="text-2xl font-bold">99.2%</p>
            <p className="text-xs text-muted-foreground">Detection Rate</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SteganographyWatermark;