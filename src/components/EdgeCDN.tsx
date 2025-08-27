import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Globe, 
  Zap, 
  BarChart3, 
  MapPin,
  Clock,
  HardDrive,
  TrendingUp,
  Shield,
  Layers,
  Radio,
  Gauge,
  Target,
  Server,
  Image,
  RefreshCw,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface CDNNode {
  id: string;
  location: string;
  region: string;
  status: 'active' | 'maintenance' | 'offline';
  latency: number;
  bandwidth: number;
  storage: number;
  requests: number;
  hitRate: number;
  coordinates: [number, number];
}

interface CDNMetrics {
  totalRequests: number;
  globalLatency: number;
  hitRate: number;
  bandwidth: number;
  dataTransferred: number;
  costSavings: number;
  uptime: number;
  regions: number;
}

interface MediaAsset {
  id: string;
  filename: string;
  size: number;
  type: 'image' | 'video';
  cached: boolean;
  regions: string[];
  requests: number;
  lastAccessed: Date;
  loadTime: number;
}

const EdgeCDN = () => {
  const [cdnNodes, setCdnNodes] = useState<CDNNode[]>([]);
  const [metrics, setMetrics] = useState<CDNMetrics | null>(null);
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [isOptimizing, setIsOptimizing] = useState(false);

  const mockNodes: CDNNode[] = [
    {
      id: '1',
      location: 'San Francisco, CA',
      region: 'US-West',
      status: 'active',
      latency: 45,
      bandwidth: 95.8,
      storage: 78.2,
      requests: 12456,
      hitRate: 94.2,
      coordinates: [-122.4194, 37.7749]
    },
    {
      id: '2',
      location: 'New York, NY',
      region: 'US-East',
      status: 'active',
      latency: 52,
      bandwidth: 89.3,
      storage: 82.7,
      requests: 15789,
      hitRate: 91.8,
      coordinates: [-74.0060, 40.7128]
    },
    {
      id: '3',
      location: 'London, UK',
      region: 'Europe',
      status: 'active',
      latency: 38,
      bandwidth: 92.1,
      storage: 65.4,
      requests: 8934,
      hitRate: 96.1,
      coordinates: [-0.1276, 51.5074]
    },
    {
      id: '4',
      location: 'Tokyo, Japan',
      region: 'Asia-Pacific',
      status: 'active',
      latency: 67,
      bandwidth: 88.7,
      storage: 71.9,
      requests: 11234,
      hitRate: 89.3,
      coordinates: [139.6917, 35.6895]
    },
    {
      id: '5',
      location: 'Sydney, Australia',
      region: 'Asia-Pacific',
      status: 'maintenance',
      latency: 89,
      bandwidth: 76.4,
      storage: 58.2,
      requests: 3421,
      hitRate: 85.7,
      coordinates: [151.2093, -33.8688]
    },
    {
      id: '6',
      location: 'São Paulo, Brazil',
      region: 'South America',
      status: 'active',
      latency: 78,
      bandwidth: 84.2,
      storage: 69.8,
      requests: 6789,
      hitRate: 87.4,
      coordinates: [-46.6333, -23.5505]
    }
  ];

  const mockMetrics: CDNMetrics = {
    totalRequests: 58623,
    globalLatency: 58,
    hitRate: 91.2,
    bandwidth: 87.4,
    dataTransferred: 2.4,
    costSavings: 34.8,
    uptime: 99.97,
    regions: 6
  };

  const mockAssets: MediaAsset[] = [
    {
      id: '1',
      filename: 'wedding_ceremony_4k.jpg',
      size: 8.4,
      type: 'image',
      cached: true,
      regions: ['US-West', 'US-East', 'Europe'],
      requests: 2341,
      lastAccessed: new Date(Date.now() - 300000),
      loadTime: 450
    },
    {
      id: '2',
      filename: 'reception_highlights.mp4',
      size: 125.7,
      type: 'video',
      cached: true,
      regions: ['US-West', 'Europe', 'Asia-Pacific'],
      requests: 1876,
      lastAccessed: new Date(Date.now() - 600000),
      loadTime: 1200
    },
    {
      id: '3',
      filename: 'group_photo_hdr.jpg',
      size: 12.1,
      type: 'image',
      cached: false,
      regions: ['US-East'],
      requests: 987,
      lastAccessed: new Date(Date.now() - 1800000),
      loadTime: 2300
    }
  ];

  useEffect(() => {
    setCdnNodes(mockNodes);
    setMetrics(mockMetrics);
    setAssets(mockAssets);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setCdnNodes(prev => prev.map(node => ({
        ...node,
        latency: Math.max(20, Math.min(150, node.latency + (Math.random() - 0.5) * 10)),
        bandwidth: Math.max(60, Math.min(100, node.bandwidth + (Math.random() - 0.5) * 5)),
        requests: node.requests + Math.floor(Math.random() * 10)
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const optimizeDistribution = async () => {
    setIsOptimizing(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsOptimizing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'maintenance': return 'text-yellow-600 bg-yellow-100';
      case 'offline': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getLatencyColor = (latency: number) => {
    if (latency < 50) return 'text-green-600';
    if (latency < 100) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatBytes = (mb: number) => {
    if (mb < 1024) return `${mb.toFixed(1)} MB`;
    return `${(mb / 1024).toFixed(1)} GB`;
  };

  const formatTime = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    return `${Math.floor(minutes / 60)}h ago`;
  };

  if (!metrics) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="glass-effect">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-electric-blue" />
                Global Edge CDN
              </CardTitle>
              <CardDescription>
                Ultra-fast media delivery with intelligent edge caching
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-green-50 text-green-700">
                <CheckCircle className="h-3 w-3 mr-1" />
                {metrics.uptime}% Uptime
              </Badge>
              <Button onClick={optimizeDistribution} disabled={isOptimizing}>
                {isOptimizing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Optimizing...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Optimize
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Global Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <BarChart3 className="h-6 w-6 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-bold">{metrics.totalRequests.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Requests</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold">{metrics.globalLatency}ms</p>
            <p className="text-xs text-muted-foreground">Avg Latency</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-6 w-6 mx-auto mb-2 text-purple-500" />
            <p className="text-2xl font-bold">{metrics.hitRate}%</p>
            <p className="text-xs text-muted-foreground">Hit Rate</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Gauge className="h-6 w-6 mx-auto mb-2 text-orange-500" />
            <p className="text-2xl font-bold">{metrics.bandwidth}%</p>
            <p className="text-xs text-muted-foreground">Bandwidth</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <HardDrive className="h-6 w-6 mx-auto mb-2 text-indigo-500" />
            <p className="text-2xl font-bold">{metrics.dataTransferred}TB</p>
            <p className="text-xs text-muted-foreground">Data Served</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-6 w-6 mx-auto mb-2 text-emerald-500" />
            <p className="text-2xl font-bold">${metrics.costSavings}K</p>
            <p className="text-xs text-muted-foreground">Cost Savings</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Globe className="h-6 w-6 mx-auto mb-2 text-pink-500" />
            <p className="text-2xl font-bold">{metrics.regions}</p>
            <p className="text-xs text-muted-foreground">Regions</p>
          </CardContent>
        </Card>
      </div>

      {/* CDN Nodes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5 text-electric-blue" />
              Edge Nodes ({cdnNodes.length})
            </CardTitle>
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="US-West">US West</SelectItem>
                <SelectItem value="US-East">US East</SelectItem>
                <SelectItem value="Europe">Europe</SelectItem>
                <SelectItem value="Asia-Pacific">Asia Pacific</SelectItem>
                <SelectItem value="South America">South America</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cdnNodes
              .filter(node => selectedRegion === 'all' || node.region === selectedRegion)
              .map((node) => (
              <div key={node.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${getStatusColor(node.status)}`}>
                      <Radio className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">{node.location}</p>
                      <p className="text-sm text-muted-foreground">{node.region}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`${getStatusColor(node.status)} text-xs`}>
                      {node.status}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {node.requests.toLocaleString()} req/h
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Latency</p>
                    <p className={`font-semibold ${getLatencyColor(node.latency)}`}>
                      {node.latency}ms
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Bandwidth</p>
                    <p className="font-semibold">{node.bandwidth}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Storage</p>
                    <p className="font-semibold">{node.storage}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Hit Rate</p>
                    <p className="font-semibold text-green-600">{node.hitRate}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Requests</p>
                    <p className="font-semibold">{node.requests.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cached Assets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-electric-blue" />
            Cached Media Assets
          </CardTitle>
          <CardDescription>
            Most frequently accessed content across edge nodes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assets.map((asset) => (
              <div key={asset.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${asset.type === 'image' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                    <Image className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">{asset.filename}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{formatBytes(asset.size)}</span>
                      <span>{asset.requests.toLocaleString()} requests</span>
                      <span>{formatTime(asset.lastAccessed)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={asset.cached ? 'default' : 'secondary'} className="text-xs">
                      {asset.cached ? 'Cached' : 'Origin Only'}
                    </Badge>
                    <Badge variant="outline" className={`text-xs ${getLatencyColor(asset.loadTime)}`}>
                      {asset.loadTime}ms
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    {asset.regions.map((region, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {region}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Performance Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 text-green-600 rounded-full">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">Excellent Global Coverage</p>
                <p className="text-sm text-muted-foreground">
                  91.2% cache hit rate with sub-60ms average latency worldwide
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
                <Target className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">Optimal Resource Distribution</p>
                <p className="text-sm text-muted-foreground">
                  High-demand content cached in 3+ regions for redundancy
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-full">
                <Shield className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">Intelligent Prefetching</p>
                <p className="text-sm text-muted-foreground">
                  AI predicts and preloads content based on user behavior
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Optimization Opportunities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-yellow-100 text-yellow-600 rounded-full">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">Sydney Node Maintenance</p>
                <p className="text-sm text-muted-foreground">
                  Reduced performance in Asia-Pacific region during maintenance
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-100 text-orange-600 rounded-full">
                <HardDrive className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">Storage Optimization</p>
                <p className="text-sm text-muted-foreground">
                  Some nodes approaching 80% storage capacity
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="p-2 bg-indigo-100 text-indigo-600 rounded-full">
                <MapPin className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">Expand African Coverage</p>
                <p className="text-sm text-muted-foreground">
                  Consider adding edge nodes in Africa for global reach
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge className="h-5 w-5 text-electric-blue" />
            CDN Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">Caching Rules</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Images (.jpg, .png):</span>
                  <span className="text-muted-foreground">30 days</span>
                </div>
                <div className="flex justify-between">
                  <span>Videos (.mp4, .mov):</span>
                  <span className="text-muted-foreground">7 days</span>
                </div>
                <div className="flex justify-between">
                  <span>Thumbnails:</span>
                  <span className="text-muted-foreground">90 days</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Compression</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>WebP conversion:</span>
                  <Badge variant="secondary" className="text-xs">Enabled</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Progressive JPEG:</span>
                  <Badge variant="secondary" className="text-xs">Enabled</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Video transcoding:</span>
                  <Badge variant="secondary" className="text-xs">Auto</Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Security</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>HTTPS only:</span>
                  <Badge variant="secondary" className="text-xs">Enforced</Badge>
                </div>
                <div className="flex justify-between">
                  <span>DDoS protection:</span>
                  <Badge variant="secondary" className="text-xs">Active</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Access control:</span>
                  <Badge variant="secondary" className="text-xs">Event-based</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EdgeCDN;