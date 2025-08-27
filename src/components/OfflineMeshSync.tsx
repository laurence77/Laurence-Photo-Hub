import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Wifi, 
  WifiOff, 
  Zap, 
  Users, 
  Share2,
  Download,
  Upload,
  Smartphone,
  Radio,
  Globe,
  ShieldCheck,
  Timer,
  HardDrive,
  Signal,
  Bluetooth,
  Eye,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Settings,
  Play,
  Pause,
  BarChart3,
  Network,
  Layers
} from 'lucide-react';

interface MeshNode {
  id: string;
  name: string;
  deviceType: 'phone' | 'tablet' | 'laptop' | 'camera';
  status: 'online' | 'offline' | 'syncing';
  distance: number;
  signal: number;
  lastSeen: Date;
  photosShared: number;
  photosReceived: number;
  batteryLevel?: number;
  syncProgress?: number;
}

interface SyncedPhoto {
  id: string;
  filename: string;
  size: number;
  thumbnail: string;
  fromNode: string;
  syncedAt: Date;
  status: 'pending' | 'downloading' | 'completed' | 'failed';
  progress: number;
  priority: 'low' | 'normal' | 'high';
}

interface MeshStats {
  nodesConnected: number;
  totalDataTransferred: number;
  photosShared: number;
  averageSpeed: number;
  uptime: number;
  rangeCoverage: number;
}

const OfflineMeshSync = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [meshNodes, setMeshNodes] = useState<MeshNode[]>([]);
  const [syncedPhotos, setSyncedPhotos] = useState<SyncedPhoto[]>([]);
  const [meshStats, setMeshStats] = useState<MeshStats | null>(null);
  const [syncProtocol, setSyncProtocol] = useState('bluetooth');
  const [autoSync, setAutoSync] = useState(true);
  const [highPriorityOnly, setHighPriorityOnly] = useState(false);
  const [maxRange, setMaxRange] = useState('50m');
  const [isScanning, setIsScanning] = useState(false);

  const mockNodes: MeshNode[] = [
    {
      id: '1',
      name: 'Sarah\'s iPhone',
      deviceType: 'phone',
      status: 'online',
      distance: 15,
      signal: 85,
      lastSeen: new Date(Date.now() - 30000),
      photosShared: 24,
      photosReceived: 18,
      batteryLevel: 67,
      syncProgress: 0
    },
    {
      id: '2',
      name: 'Michael\'s Camera',
      deviceType: 'camera',
      status: 'syncing',
      distance: 8,
      signal: 92,
      lastSeen: new Date(Date.now() - 5000),
      photosShared: 156,
      photosReceived: 0,
      syncProgress: 34
    },
    {
      id: '3',
      name: 'Guest iPad Pro',
      deviceType: 'tablet',
      status: 'online',
      distance: 22,
      signal: 78,
      lastSeen: new Date(Date.now() - 120000),
      photosShared: 8,
      photosReceived: 45,
      batteryLevel: 89
    },
    {
      id: '4',
      name: 'Photographer Laptop',
      deviceType: 'laptop',
      status: 'offline',
      distance: 45,
      signal: 23,
      lastSeen: new Date(Date.now() - 600000),
      photosShared: 67,
      photosReceived: 12
    }
  ];

  const mockPhotos: SyncedPhoto[] = [
    {
      id: '1',
      filename: 'ceremony_kiss.jpg',
      size: 2456789,
      thumbnail: '/uploads/a0278ce1-b82d-4ed6-a186-14a9503ef65c.png',
      fromNode: 'Michael\'s Camera',
      syncedAt: new Date(Date.now() - 180000),
      status: 'completed',
      progress: 100,
      priority: 'high'
    },
    {
      id: '2',
      filename: 'group_celebration.jpg',
      size: 1987654,
      thumbnail: '/uploads/34a58283-8b82-48f9-88f4-2c88b069921d.png',
      fromNode: 'Sarah\'s iPhone',
      syncedAt: new Date(Date.now() - 300000),
      status: 'downloading',
      progress: 67,
      priority: 'normal'
    },
    {
      id: '3',
      filename: 'dance_floor_fun.mp4',
      size: 45678901,
      thumbnail: '/uploads/47f9a1d0-4458-400a-8fc0-79adf093cf18.png',
      fromNode: 'Guest iPad Pro',
      syncedAt: new Date(Date.now() - 120000),
      status: 'pending',
      progress: 0,
      priority: 'low'
    }
  ];

  const mockStats: MeshStats = {
    nodesConnected: 3,
    totalDataTransferred: 1.2,
    photosShared: 156,
    averageSpeed: 2.4,
    uptime: 45,
    rangeCoverage: 85
  };

  useEffect(() => {
    if (isEnabled) {
      setMeshNodes(mockNodes);
      setSyncedPhotos(mockPhotos);
      setMeshStats(mockStats);
      
      // Simulate real-time updates
      const interval = setInterval(() => {
        setMeshNodes(prev => prev.map(node => ({
          ...node,
          signal: Math.max(20, Math.min(100, node.signal + (Math.random() - 0.5) * 10)),
          lastSeen: node.status === 'online' ? new Date() : node.lastSeen
        })));
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isEnabled]);

  const startScanning = async () => {
    setIsScanning(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsScanning(false);
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'phone': return <Smartphone className="h-4 w-4" />;
      case 'tablet': return <Smartphone className="h-4 w-4" />;
      case 'laptop': return <Radio className="h-4 w-4" />;
      case 'camera': return <Radio className="h-4 w-4" />;
      default: return <Radio className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-600 bg-green-100';
      case 'syncing': return 'text-blue-600 bg-blue-100';
      case 'offline': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'normal': return 'text-blue-600 bg-blue-100';
      case 'low': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  const formatTime = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card className="glass-effect">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5 text-electric-blue" />
                Offline Mesh Sync
              </CardTitle>
              <CardDescription>
                Peer-to-peer photo sharing without internet connectivity
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className={isEnabled ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-700'}>
                {isEnabled ? <Wifi className="h-3 w-3 mr-1" /> : <WifiOff className="h-3 w-3 mr-1" />}
                {isEnabled ? 'Active' : 'Inactive'}
              </Badge>
              <Switch checked={isEnabled} onCheckedChange={setIsEnabled} />
            </div>
          </div>
        </CardHeader>
        
        {isEnabled && (
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Sync Protocol</Label>
                <Select value={syncProtocol} onValueChange={setSyncProtocol}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bluetooth">Bluetooth LE</SelectItem>
                    <SelectItem value="wifi-direct">WiFi Direct</SelectItem>
                    <SelectItem value="mesh">Mesh Network</SelectItem>
                    <SelectItem value="hybrid">Hybrid Mode</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Max Range</Label>
                <Select value={maxRange} onValueChange={setMaxRange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10m">10 meters</SelectItem>
                    <SelectItem value="50m">50 meters</SelectItem>
                    <SelectItem value="100m">100 meters</SelectItem>
                    <SelectItem value="unlimited">Unlimited</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Button onClick={startScanning} disabled={isScanning} className="w-full mt-6">
                  {isScanning ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Scan for Devices
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Auto-sync new photos</Label>
                  <p className="text-sm text-muted-foreground">Automatically sync when new photos are detected</p>
                </div>
                <Switch checked={autoSync} onCheckedChange={setAutoSync} />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>High priority only</Label>
                  <p className="text-sm text-muted-foreground">Only sync high priority photos</p>
                </div>
                <Switch checked={highPriorityOnly} onCheckedChange={setHighPriorityOnly} />
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {isEnabled && meshStats && (
        <>
          {/* Network Stats */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                <p className="text-2xl font-bold">{meshStats.nodesConnected}</p>
                <p className="text-xs text-muted-foreground">Connected</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <HardDrive className="h-6 w-6 mx-auto mb-2 text-green-500" />
                <p className="text-2xl font-bold">{meshStats.totalDataTransferred}GB</p>
                <p className="text-xs text-muted-foreground">Transferred</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Share2 className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                <p className="text-2xl font-bold">{meshStats.photosShared}</p>
                <p className="text-xs text-muted-foreground">Photos Shared</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Zap className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
                <p className="text-2xl font-bold">{meshStats.averageSpeed}</p>
                <p className="text-xs text-muted-foreground">MB/s Avg</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Timer className="h-6 w-6 mx-auto mb-2 text-orange-500" />
                <p className="text-2xl font-bold">{meshStats.uptime}m</p>
                <p className="text-xs text-muted-foreground">Uptime</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Signal className="h-6 w-6 mx-auto mb-2 text-red-500" />
                <p className="text-2xl font-bold">{meshStats.rangeCoverage}%</p>
                <p className="text-xs text-muted-foreground">Coverage</p>
              </CardContent>
            </Card>
          </div>

          {/* Connected Devices */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Radio className="h-5 w-5 text-electric-blue" />
                Connected Devices ({meshNodes.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {meshNodes.map((node) => (
                  <div key={node.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${getStatusColor(node.status)}`}>
                        {getDeviceIcon(node.deviceType)}
                      </div>
                      <div>
                        <p className="font-medium">{node.name}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{node.distance}m away</span>
                          <span>Signal: {node.signal}%</span>
                          <span>{formatTime(node.lastSeen)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className={`${getStatusColor(node.status)} text-xs`}>
                          {node.status}
                        </Badge>
                        {node.batteryLevel && (
                          <Badge variant="secondary" className="text-xs">
                            {node.batteryLevel}%
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <div className="flex gap-4">
                          <span>↑{node.photosShared}</span>
                          <span>↓{node.photosReceived}</span>
                        </div>
                      </div>
                      {node.syncProgress !== undefined && node.syncProgress > 0 && (
                        <Progress value={node.syncProgress} className="w-20 h-2 mt-2" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Synced Photos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5 text-electric-blue" />
                Recent Syncs ({syncedPhotos.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {syncedPhotos.map((photo) => (
                  <div key={photo.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img src={photo.thumbnail} alt={photo.filename} className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium">{photo.filename}</p>
                        <Badge variant="outline" className={`${getPriorityColor(photo.priority)} text-xs`}>
                          {photo.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        From {photo.fromNode} • {formatBytes(photo.size)} • {formatTime(photo.syncedAt)}
                      </p>
                      
                      {photo.status === 'downloading' && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span>Downloading...</span>
                            <span>{photo.progress}%</span>
                          </div>
                          <Progress value={photo.progress} className="h-2" />
                        </div>
                      )}
                      
                      {photo.status === 'completed' && (
                        <div className="flex items-center gap-1 text-green-600 text-xs">
                          <CheckCircle className="h-3 w-3" />
                          <span>Synced successfully</span>
                        </div>
                      )}
                      
                      {photo.status === 'failed' && (
                        <div className="flex items-center gap-1 text-red-600 text-xs">
                          <AlertCircle className="h-3 w-3" />
                          <span>Sync failed</span>
                        </div>
                      )}
                      
                      {photo.status === 'pending' && (
                        <div className="flex items-center gap-1 text-yellow-600 text-xs">
                          <Timer className="h-3 w-3" />
                          <span>Waiting to sync</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3" />
                      </Button>
                      {photo.status === 'completed' && (
                        <Button variant="outline" size="sm">
                          <Download className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Advanced Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-electric-blue" />
                Advanced Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Network Configuration</h4>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Encryption</Label>
                      <p className="text-sm text-muted-foreground">End-to-end encryption for all transfers</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Relay Mode</Label>
                      <p className="text-sm text-muted-foreground">Use other devices as relay points</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Background Sync</Label>
                      <p className="text-sm text-muted-foreground">Continue syncing when app is backgrounded</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Performance</h4>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Battery Optimization</Label>
                      <p className="text-sm text-muted-foreground">Reduce power consumption</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Bandwidth Limiting</Label>
                      <p className="text-sm text-muted-foreground">Limit transfer speed to preserve battery</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Quality Adaptation</Label>
                      <p className="text-sm text-muted-foreground">Reduce quality for faster transfers</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Protocol Information */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-electric-blue mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-medium mb-2">How Mesh Sync Works</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Uses Bluetooth LE and WiFi Direct for device discovery</li>
                    <li>• Creates encrypted peer-to-peer connections</li>
                    <li>• Automatically routes through intermediate devices if needed</li>
                    <li>• Prioritizes high-quality photos and important moments</li>
                    <li>• Works completely offline - no internet required</li>
                    <li>• Resumes interrupted transfers automatically</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default OfflineMeshSync;