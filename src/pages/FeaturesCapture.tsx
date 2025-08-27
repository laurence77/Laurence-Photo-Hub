import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { 
  Camera, 
  Video, 
  Smartphone, 
  Aperture, 
  Zap, 
  Timer, 
  Grid3X3, 
  Focus,
  Palette,
  Settings,
  ImageIcon,
  PlayCircle,
  Pause,
  Square,
  RotateCcw,
  Download,
  Share2,
  Eye,
  Sparkles,
  ScanLine
} from 'lucide-react';
import { getImagePath } from '@/lib/utils';

interface CaptureMode {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  features: string[];
  isActive: boolean;
}

interface CameraSettings {
  resolution: string;
  quality: number;
  flashMode: 'auto' | 'on' | 'off';
  timerDelay: number;
  gridLines: boolean;
  liveFilters: boolean;
  autoFocus: boolean;
  stabilization: boolean;
}

export default function FeaturesCapture() {
  const [activeMode, setActiveMode] = useState('photo');
  const [isCapturing, setIsCapturing] = useState(false);
  const [settings, setSettings] = useState<CameraSettings>({
    resolution: '4K',
    quality: 90,
    flashMode: 'auto',
    timerDelay: 0,
    gridLines: true,
    liveFilters: false,
    autoFocus: true,
    stabilization: true
  });

  const captureModes: CaptureMode[] = [
    {
      id: 'photo',
      name: 'Photo',
      icon: <Camera className="h-6 w-6" />,
      description: 'High-quality photo capture with advanced settings',
      features: ['HDR Support', 'Portrait Mode', 'Night Mode', 'Macro'],
      isActive: true
    },
    {
      id: 'video',
      name: 'Video',
      icon: <Video className="h-6 w-6" />,
      description: 'Professional video recording with stabilization',
      features: ['4K Recording', 'Slow Motion', 'Time Lapse', 'Live Streaming'],
      isActive: true
    },
    {
      id: 'live',
      name: 'Live Photos',
      icon: <PlayCircle className="h-6 w-6" />,
      description: 'Capture moments with motion and sound',
      features: ['3-Second Clips', 'Auto Enhancement', 'Loop Creation'],
      isActive: false
    },
    {
      id: 'panorama',
      name: 'Panorama',
      icon: <ScanLine className="h-6 w-6" />,
      description: 'Wide-angle panoramic shots',
      features: ['360° Capture', 'Auto Stitching', 'Vertical Pano'],
      isActive: false
    }
  ];

  const recentCaptures = [
    {
      id: '1',
      type: 'photo',
      thumbnail: getImagePath('/uploads/a0278ce1-b82d-4ed6-a186-14a9503ef65c.png'),
      timestamp: '2 minutes ago',
      size: '12.4 MB'
    },
    {
      id: '2',
      type: 'video',
      thumbnail: getImagePath('/uploads/34a58283-8b82-48f9-88f4-2c88b069921d.png'),
      timestamp: '5 minutes ago',
      size: '45.2 MB'
    },
    {
      id: '3',
      type: 'photo',
      thumbnail: getImagePath('/uploads/47f9a1d0-4458-400a-8fc0-79adf093cf18.png'),
      timestamp: '12 minutes ago',
      size: '8.7 MB'
    }
  ];

  const handleCapture = () => {
    setIsCapturing(true);
    setTimeout(() => setIsCapturing(false), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg">
              <Camera className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Smart Capture
              </h1>
              <p className="text-gray-600 mt-1">
                Professional photography tools with AI-powered features
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Camera Interface */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle>Camera View</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                      Live
                    </Badge>
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {/* Camera Viewport */}
                <div className="relative aspect-video bg-gray-900 overflow-hidden">
                  <img
                    src={getImagePath('/uploads/a0278ce1-b82d-4ed6-a186-14a9503ef65c.png')}
                    alt="Camera view"
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Grid Lines */}
                  {settings.gridLines && (
                    <div className="absolute inset-0">
                      <div className="w-full h-full grid grid-cols-3 grid-rows-3">
                        {Array.from({ length: 9 }).map((_, i) => (
                          <div key={i} className="border border-white/20"></div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Focus Indicator */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-16 h-16 border-2 border-white rounded-lg animate-pulse"></div>
                  </div>

                  {/* Capture Button */}
                  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                    <Button
                      size="lg"
                      className={`w-16 h-16 rounded-full ${
                        isCapturing 
                          ? 'bg-red-600 hover:bg-red-700 scale-90' 
                          : 'bg-white hover:bg-gray-100 text-gray-900'
                      } transition-all duration-300`}
                      onClick={handleCapture}
                    >
                      {isCapturing ? (
                        <Square className="h-6 w-6" />
                      ) : activeMode === 'video' ? (
                        <Video className="h-6 w-6" />
                      ) : (
                        <Camera className="h-6 w-6" />
                      )}
                    </Button>
                  </div>

                  {/* Mode Selector */}
                  <div className="absolute bottom-8 left-8">
                    <div className="flex flex-col gap-2">
                      {captureModes.slice(0, 2).map((mode) => (
                        <Button
                          key={mode.id}
                          size="sm"
                          variant={activeMode === mode.id ? "default" : "outline"}
                          className="bg-black/50 border-white/20"
                          onClick={() => setActiveMode(mode.id)}
                        >
                          {mode.icon}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Settings Panel */}
                  <div className="absolute top-4 right-4 bg-black/50 rounded-lg p-2">
                    <div className="flex flex-col gap-2 text-white">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        <span className="text-sm">{settings.flashMode}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Aperture className="h-4 w-4" />
                        <span className="text-sm">{settings.resolution}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="p-4 bg-gray-50 border-t">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Button size="sm" variant="outline">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Flip
                      </Button>
                      <Button size="sm" variant="outline">
                        <Timer className="h-4 w-4 mr-2" />
                        Timer
                      </Button>
                      <Button size="sm" variant="outline">
                        <Palette className="h-4 w-4 mr-2" />
                        Filters
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Capture Modes */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Capture Modes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {captureModes.map((mode) => (
                  <Card key={mode.id} className={`cursor-pointer transition-all duration-300 ${
                    mode.isActive ? 'ring-2 ring-blue-500' : 'opacity-75 hover:opacity-100'
                  }`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
                            {mode.icon}
                          </div>
                          <div>
                            <CardTitle className="text-base">{mode.name}</CardTitle>
                            <CardDescription className="text-sm">
                              {mode.description}
                            </CardDescription>
                          </div>
                        </div>
                        <Switch checked={mode.isActive} />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex flex-wrap gap-1">
                        {mode.features.map((feature) => (
                          <Badge key={feature} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Settings & Recent Captures */}
          <div className="space-y-6">
            {/* Camera Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Quality</label>
                  <div className="mt-2">
                    <Slider
                      value={[settings.quality]}
                      onValueChange={(value) => setSettings({...settings, quality: value[0]})}
                      max={100}
                      step={10}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Low</span>
                      <span>High</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Grid Lines</label>
                    <Switch
                      checked={settings.gridLines}
                      onCheckedChange={(checked) => setSettings({...settings, gridLines: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Auto Focus</label>
                    <Switch
                      checked={settings.autoFocus}
                      onCheckedChange={(checked) => setSettings({...settings, autoFocus: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Stabilization</label>
                    <Switch
                      checked={settings.stabilization}
                      onCheckedChange={(checked) => setSettings({...settings, stabilization: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Live Filters</label>
                    <Switch
                      checked={settings.liveFilters}
                      onCheckedChange={(checked) => setSettings({...settings, liveFilters: checked})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Captures */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Recent Captures
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentCaptures.map((capture) => (
                    <div key={capture.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                      <img
                        src={capture.thumbnail}
                        alt="Recent capture"
                        className="w-12 h-12 rounded-lg object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = getImagePath('/placeholder.svg');
                        }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {capture.type === 'video' ? (
                            <Video className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Camera className="h-4 w-4 text-gray-600" />
                          )}
                          <span className="text-sm font-medium capitalize">{capture.type}</span>
                        </div>
                        <div className="text-xs text-gray-600">
                          {capture.timestamp} • {capture.size}
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4" variant="outline">
                  View All Captures
                </Button>
              </CardContent>
            </Card>

            {/* AI Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  AI Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Focus className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium">Smart Focus</span>
                    </div>
                    <p className="text-xs text-gray-600">
                      AI automatically detects and focuses on subjects
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Palette className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Scene Enhancement</span>
                    </div>
                    <p className="text-xs text-gray-600">
                      Automatically adjusts settings for optimal results
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}