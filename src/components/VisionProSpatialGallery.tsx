import { useState, useEffect, useRef } from 'react';
import { getImagePath } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Glasses,
  Eye,
  Move3D,
  Layers3,
  Sparkles,
  Hand,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  Navigation,
  Compass,
  Camera,
  Download,
  Share2,
  Heart,
  Users,
  Clock,
  MapPin,
  Zap,
  Settings,
  Info,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  MousePointer
} from 'lucide-react';

interface SpatialPhoto {
  id: string;
  url: string;
  title: string;
  description?: string;
  timestamp: string;
  location?: string;
  photographer?: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
  rotation: {
    x: number;
    y: number;
    z: number;
  };
  scale: number;
  depth: number;
  interactions: {
    likes: number;
    views: number;
    comments: number;
  };
  spatialData?: {
    boundingBox: {
      width: number;
      height: number;
      depth: number;
    };
    anchorPoint: string;
    occlusion: boolean;
    shadows: boolean;
  };
}

interface VisionProCapabilities {
  visionOS: boolean;
  spatialComputing: boolean;
  eyeTracking: boolean;
  handTracking: boolean;
  passthrough: boolean;
  immersiveSpace: boolean;
  sharedSpace: boolean;
  windowedApp: boolean;
  deviceModel: string;
}

interface SpatialGalleryProps {
  eventId?: string;
  photos?: SpatialPhoto[];
  eventTitle?: string;
  autoPlay?: boolean;
  immersiveMode?: boolean;
  onPhotoSelect?: (photo: SpatialPhoto) => void;
  onModeChange?: (mode: 'windowed' | 'immersive' | 'shared') => void;
}

const VisionProSpatialGallery = ({
  eventId = 'wedding-celebration',
  photos = [],
  eventTitle = 'Wedding Celebration',
  autoPlay = false,
  immersiveMode = false,
  onPhotoSelect,
  onModeChange
}: SpatialGalleryProps) => {
  const [visionCapabilities, setVisionCapabilities] = useState<VisionProCapabilities | null>(null);
  const [isImmersive, setIsImmersive] = useState(immersiveMode);
  const [currentMode, setCurrentMode] = useState<'windowed' | 'immersive' | 'shared'>('windowed');
  const [selectedPhoto, setSelectedPhoto] = useState<SpatialPhoto | null>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [spatialPosition, setSpatialPosition] = useState({ x: 0, y: 0, z: -2 });
  const [userGaze, setUserGaze] = useState({ x: 0, y: 0 });
  const [handGestures, setHandGestures] = useState<string[]>([]);
  
  const spatialRef = useRef<HTMLDivElement>(null);
  const immersiveRef = useRef<HTMLDivElement>(null);

  // Mock spatial photos if none provided
  const defaultSpatialPhotos: SpatialPhoto[] = [
    {
      id: '1',
      url: getImagePath('/uploads/a0278ce1-b82d-4ed6-a186-14a9503ef65c.png'),
      title: 'First Kiss',
      description: 'The magical moment of their first kiss as husband and wife',
      timestamp: '2024-09-15T18:30:00Z',
      location: 'Altar, Riverside Gardens',
      photographer: 'Laurence Photography',
      position: { x: 0, y: 0, z: -1.5 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: 1.2,
      depth: 0.1,
      interactions: { likes: 47, views: 234, comments: 12 },
      spatialData: {
        boundingBox: { width: 1.6, height: 1.2, depth: 0.1 },
        anchorPoint: 'center',
        occlusion: true,
        shadows: true
      }
    },
    {
      id: '2',
      url: getImagePath('/uploads/34a58283-8b82-48f9-88f4-2c88b069921d.png'),
      title: 'Golden Hour Portraits',
      description: 'Romantic portraits during the golden hour in the vineyard',
      timestamp: '2024-09-15T17:45:00Z',
      location: 'Vineyard, Napa Valley',
      photographer: 'Laurence Photography',
      position: { x: -2, y: 0.5, z: -2 },
      rotation: { x: 0, y: 15, z: 0 },
      scale: 1.0,
      depth: 0.08,
      interactions: { likes: 38, views: 189, comments: 8 },
      spatialData: {
        boundingBox: { width: 1.4, height: 1.0, depth: 0.08 },
        anchorPoint: 'bottom-center',
        occlusion: true,
        shadows: false
      }
    },
    {
      id: '3',
      url: getImagePath('/uploads/47f9a1d0-4458-400a-8fc0-79adf093cf18.png'),
      title: 'Dancing Under Stars',
      description: 'The couple\'s first dance under the starlit sky',
      timestamp: '2024-09-15T21:15:00Z',
      location: 'Reception Hall, Riverside Gardens',
      photographer: 'Laurence Photography',
      position: { x: 2, y: -0.3, z: -1.8 },
      rotation: { x: 0, y: -10, z: 0 },
      scale: 1.1,
      depth: 0.12,
      interactions: { likes: 52, views: 298, comments: 15 },
      spatialData: {
        boundingBox: { width: 1.5, height: 1.1, depth: 0.12 },
        anchorPoint: 'center',
        occlusion: true,
        shadows: true
      }
    },
    {
      id: '4',
      url: getImagePath('/uploads/af28398b-9e23-4e2b-9de1-bda457e09fd8.png'),
      title: 'Joy with Family',
      description: 'Celebration and laughter with beloved family members',
      timestamp: '2024-09-15T19:20:00Z',
      location: 'Garden Terrace, Riverside Gardens',
      photographer: 'Laurence Photography',
      position: { x: 0, y: 1.2, z: -2.5 },
      rotation: { x: -5, y: 0, z: 0 },
      scale: 0.9,
      depth: 0.06,
      interactions: { likes: 41, views: 167, comments: 9 },
      spatialData: {
        boundingBox: { width: 1.3, height: 0.9, depth: 0.06 },
        anchorPoint: 'top-center',
        occlusion: false,
        shadows: true
      }
    }
  ];

  const displayPhotos = photos.length > 0 ? photos : defaultSpatialPhotos;

  // Detect Apple Vision Pro capabilities
  useEffect(() => {
    const detectVisionPro = async () => {
      const capabilities: VisionProCapabilities = {
        visionOS: false,
        spatialComputing: false,
        eyeTracking: false,
        handTracking: false,
        passthrough: false,
        immersiveSpace: false,
        sharedSpace: false,
        windowedApp: false,
        deviceModel: 'Unknown'
      };

      // Check for visionOS user agent
      const userAgent = navigator.userAgent.toLowerCase();
      if (userAgent.includes('visionos') || userAgent.includes('vision pro')) {
        capabilities.visionOS = true;
        capabilities.deviceModel = 'Apple Vision Pro';
      }

      // Check for WebXR with spatial features
      if ('xr' in navigator) {
        try {
          const xr = (navigator as any).xr;
          
          // Check for immersive-ar with hand tracking
          const immersiveAR = await xr.isSessionSupported('immersive-ar');
          if (immersiveAR) {
            capabilities.spatialComputing = true;
            capabilities.immersiveSpace = true;
            capabilities.passthrough = true;
          }

          // Check for shared spaces
          const inline = await xr.isSessionSupported('inline');
          if (inline) {
            capabilities.windowedApp = true;
            capabilities.sharedSpace = true;
          }
        } catch (error) {
          console.warn('WebXR detection failed:', error);
        }
      }

      // Mock hand tracking and eye tracking for demonstration
      if (capabilities.visionOS) {
        capabilities.handTracking = true;
        capabilities.eyeTracking = true;
      }

      setVisionCapabilities(capabilities);
    };

    detectVisionPro();
  }, []);

  // Initialize spatial gallery
  const initializeSpatialGallery = async (mode: 'windowed' | 'immersive' | 'shared') => {
    setIsLoading(true);
    setLoadingProgress(0);

    try {
      const loadingSteps = [
        'Initializing spatial computing...',
        'Loading 3D photo models...',
        'Calibrating depth perception...',
        'Setting up hand tracking...',
        'Enabling eye tracking...',
        'Creating immersive space...'
      ];

      for (let i = 0; i < loadingSteps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 600));
        setLoadingProgress((i + 1) * (100 / loadingSteps.length));
      }

      setCurrentMode(mode);
      setIsImmersive(mode === 'immersive');
      setIsLoading(false);
      onModeChange?.(mode);

      // In production, this would initialize the actual visionOS spatial computing APIs
      /*
      if (visionCapabilities?.visionOS) {
        const spatial = await window.SpatialComputing?.initialize({
          mode: mode,
          handTracking: true,
          eyeTracking: true,
          passthrough: mode === 'immersive'
        });
      }
      */

    } catch (error) {
      console.error('Spatial gallery initialization failed:', error);
      setIsLoading(false);
    }
  };

  // Handle photo selection with spatial interaction
  const handlePhotoSelect = (photo: SpatialPhoto) => {
    setSelectedPhoto(photo);
    onPhotoSelect?.(photo);
    
    // Simulate spatial focus with smooth transition
    setSpatialPosition({
      x: photo.position.x,
      y: photo.position.y,
      z: photo.position.z + 0.5
    });
  };

  // Simulate eye tracking
  useEffect(() => {
    if (!visionCapabilities?.eyeTracking || !isImmersive) return;

    const handleEyeTracking = (event: MouseEvent) => {
      const rect = spatialRef.current?.getBoundingClientRect();
      if (rect) {
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        setUserGaze({ x, y });
      }
    };

    document.addEventListener('mousemove', handleEyeTracking);
    return () => document.removeEventListener('mousemove', handleEyeTracking);
  }, [isImmersive, visionCapabilities?.eyeTracking]);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || !isImmersive) return;

    const interval = setInterval(() => {
      const currentIndex = selectedPhoto 
        ? displayPhotos.findIndex(p => p.id === selectedPhoto.id)
        : 0;
      const nextIndex = (currentIndex + 1) % displayPhotos.length;
      handlePhotoSelect(displayPhotos[nextIndex]);
    }, 8000);

    return () => clearInterval(interval);
  }, [isPlaying, isImmersive, selectedPhoto, displayPhotos]);

  const exitSpatialMode = () => {
    setIsImmersive(false);
    setCurrentMode('windowed');
    setSelectedPhoto(null);
    setSpatialPosition({ x: 0, y: 0, z: -2 });
  };

  return (
    <div className="space-y-6">
      {/* Vision Pro Spatial Gallery */}
      <div className="glass-card relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-50/10 via-blue-50/10 to-indigo-50/10 opacity-30"></div>
        
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-2 text-gradient-electric">
            <Glasses className="h-6 w-6 electric-accent" />
            Vision Pro Spatial Gallery
            <Badge variant="secondary" className="electric-border">visionOS</Badge>
          </CardTitle>
          <CardDescription>
            Walk through event photos in 3D space using Apple Vision Pro's spatial computing capabilities
          </CardDescription>
        </CardHeader>

        <CardContent className="relative space-y-6">
          {/* Vision Pro Capabilities */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className={`p-4 border rounded-lg ${
              visionCapabilities?.visionOS 
                ? 'border-purple-200 bg-purple-50 dark:bg-purple-950 dark:border-purple-800' 
                : 'border-gray-200 bg-gray-50 dark:bg-gray-900'
            }`}>
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-full ${
                  visionCapabilities?.visionOS ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  <Glasses className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">visionOS</h4>
                  <Badge variant={visionCapabilities?.visionOS ? 'default' : 'secondary'} className="text-xs">
                    {visionCapabilities?.visionOS ? 'Detected' : 'Not Available'}
                  </Badge>
                </div>
              </div>
            </div>

            <div className={`p-4 border rounded-lg ${
              visionCapabilities?.handTracking 
                ? 'border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800' 
                : 'border-gray-200 bg-gray-50 dark:bg-gray-900'
            }`}>
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-full ${
                  visionCapabilities?.handTracking ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  <Hand className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Hand Tracking</h4>
                  <Badge variant={visionCapabilities?.handTracking ? 'default' : 'secondary'} className="text-xs">
                    {visionCapabilities?.handTracking ? 'Active' : 'Unavailable'}
                  </Badge>
                </div>
              </div>
            </div>

            <div className={`p-4 border rounded-lg ${
              visionCapabilities?.eyeTracking 
                ? 'border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800' 
                : 'border-gray-200 bg-gray-50 dark:bg-gray-900'
            }`}>
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-full ${
                  visionCapabilities?.eyeTracking ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  <Eye className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Eye Tracking</h4>
                  <Badge variant={visionCapabilities?.eyeTracking ? 'default' : 'secondary'} className="text-xs">
                    {visionCapabilities?.eyeTracking ? 'Calibrated' : 'Unavailable'}
                  </Badge>
                </div>
              </div>
            </div>

            <div className={`p-4 border rounded-lg ${
              visionCapabilities?.spatialComputing 
                ? 'border-indigo-200 bg-indigo-50 dark:bg-indigo-950 dark:border-indigo-800' 
                : 'border-gray-200 bg-gray-50 dark:bg-gray-900'
            }`}>
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-full ${
                  visionCapabilities?.spatialComputing ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  <Layers3 className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Spatial Computing</h4>
                  <Badge variant={visionCapabilities?.spatialComputing ? 'default' : 'secondary'} className="text-xs">
                    {visionCapabilities?.spatialComputing ? 'Ready' : 'Unavailable'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 text-lg font-medium text-gradient-electric mb-4">
                  <div className="animate-spin w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full"></div>
                  Initializing Spatial Gallery
                </div>
              </div>
              <Progress value={loadingProgress} className="h-3" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Layers3 className="h-4 w-4 text-purple-500" />
                  <span>3D Positioning</span>
                </div>
                <div className="flex items-center gap-2">
                  <Hand className="h-4 w-4 text-blue-500" />
                  <span>Hand Tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-green-500" />
                  <span>Eye Calibration</span>
                </div>
              </div>
            </div>
          )}

          {/* Spatial Gallery Interface */}
          {isImmersive && !isLoading ? (
            <div ref={immersiveRef} className="space-y-4">
              <Alert>
                <Layers3 className="h-4 w-4" />
                <AlertDescription>
                  <strong>Spatial Gallery Active!</strong><br />
                  Use hand gestures to interact with photos floating in 3D space. Look around to explore the event memories.
                </AlertDescription>
              </Alert>

              {/* 3D Spatial View */}
              <div 
                ref={spatialRef}
                className="relative bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 vision-pro-rounded overflow-hidden"
                style={{ height: '500px', perspective: '1000px' }}
              >
                {/* Spatial Photos */}
                {displayPhotos.map((photo, index) => (
                  <div
                    key={photo.id}
                    className={`absolute cursor-pointer transition-all duration-700 hover:scale-110 ${
                      selectedPhoto?.id === photo.id ? 'ring-4 ring-electric-accent scale-110' : ''
                    }`}
                    style={{
                      transform: `translate3d(${(photo.position.x * 100) + 250}px, ${(photo.position.y * -50) + 200}px, ${photo.position.z * 100}px) 
                                 rotateX(${photo.rotation.x}deg) rotateY(${photo.rotation.y}deg) rotateZ(${photo.rotation.z}deg) 
                                 scale(${photo.scale})`,
                      transformStyle: 'preserve-3d',
                      width: `${photo.spatialData?.boundingBox.width ? photo.spatialData.boundingBox.width * 120 : 180}px`,
                      height: `${photo.spatialData?.boundingBox.height ? photo.spatialData.boundingBox.height * 120 : 120}px`,
                      boxShadow: photo.spatialData?.shadows ? '0 20px 40px rgba(0,0,0,0.3)' : 'none'
                    }}
                    onClick={() => handlePhotoSelect(photo)}
                  >
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="w-full h-full object-cover vision-pro-rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = getImagePath('/placeholder.svg');
                      }}
                    />
                    
                    {/* Spatial Info Overlay */}
                    <div className="absolute -bottom-8 left-0 right-0 text-white text-center text-xs opacity-80">
                      <div className="glass-panel px-2 py-1">
                        {photo.title}
                      </div>
                    </div>

                    {/* Interaction Indicators */}
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Badge variant="secondary" className="text-xs bg-black/50 text-white border-white/20">
                        <Heart className="h-2 w-2 mr-1" />
                        {photo.interactions.likes}
                      </Badge>
                    </div>
                  </div>
                ))}

                {/* Eye Tracking Indicator */}
                {visionCapabilities?.eyeTracking && (
                  <div
                    className="absolute w-4 h-4 bg-green-400 rounded-full opacity-60 pointer-events-none transition-all duration-150"
                    style={{
                      left: `${(userGaze.x + 1) * 50}%`,
                      top: `${(-userGaze.y + 1) * 50}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  />
                )}

                {/* Navigation Compass */}
                <div className="absolute top-4 left-4 glass-panel p-3">
                  <Compass className="h-6 w-6 text-white" />
                  <div className="text-xs text-white mt-1">
                    X: {spatialPosition.x.toFixed(1)}<br/>
                    Y: {spatialPosition.y.toFixed(1)}<br/>
                    Z: {spatialPosition.z.toFixed(1)}
                  </div>
                </div>
              </div>

              {/* Spatial Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="glass-button electric-border"
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsMuted(!isMuted)}
                    className="glass-button electric-border"
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSpatialPosition({ x: 0, y: 0, z: -2 })}
                    className="glass-button electric-border"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  {selectedPhoto && (
                    <Badge variant="secondary" className="electric-border">
                      {selectedPhoto.title}
                    </Badge>
                  )}
                  
                  <Button
                    size="sm"
                    onClick={exitSpatialMode}
                    className="glass-button electric-border electric-accent hover:electric-bg hover:text-white"
                  >
                    Exit Spatial Mode
                  </Button>
                </div>
              </div>

              {/* Selected Photo Details */}
              {selectedPhoto && (
                <div className="glass-card p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-gradient-electric mb-1">{selectedPhoto.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{selectedPhoto.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(selectedPhoto.timestamp).toLocaleTimeString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {selectedPhoto.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Camera className="h-3 w-3" />
                          {selectedPhoto.photographer}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="glass-button">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="glass-button">
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="glass-button">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : !isLoading ? (
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-purple-100 flex items-center justify-center mb-4">
                <Layers3 className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gradient-electric">Spatial Photo Gallery</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Experience event photos in true 3D space. Walk around, reach out, and interact with memories 
                as if they were floating in your room.
              </p>

              {/* Mode Selection */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => initializeSpatialGallery('windowed')}
                  disabled={isLoading}
                  className="electric-bg text-white hover:electric-glow vision-pro-rounded"
                >
                  <Minimize2 className="h-4 w-4 mr-2" />
                  Windowed Mode
                </Button>
                
                <Button 
                  onClick={() => initializeSpatialGallery('immersive')}
                  disabled={isLoading || !visionCapabilities?.spatialComputing}
                  className="glass-button electric-border electric-accent hover:electric-bg hover:text-white"
                >
                  <Maximize2 className="h-4 w-4 mr-2" />
                  Immersive Mode
                </Button>
                
                <Button 
                  onClick={() => initializeSpatialGallery('shared')}
                  disabled={isLoading || !visionCapabilities?.sharedSpace}
                  variant="outline"
                  className="glass-button electric-border electric-accent hover:electric-bg hover:text-white"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Shared Space
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </div>

      {/* Compatibility Information */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-medium mb-4 text-gradient-electric">visionOS Compatibility</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <Glasses className="h-4 w-4" />
              Apple Vision Pro
            </h4>
            <ul className="space-y-1 text-gray-600 text-xs">
              <li>• visionOS 1.0+</li>
              <li>• Spatial Computing APIs</li>
              <li>• Hand & Eye Tracking</li>
              <li>• Immersive Spaces</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <Navigation className="h-4 w-4" />
              Interaction Methods
            </h4>
            <ul className="space-y-1 text-gray-600 text-xs">
              <li>• Direct hand manipulation</li>
              <li>• Eye gaze selection</li>
              <li>• Voice commands</li>
              <li>• Air tap gestures</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Spatial Features
            </h4>
            <ul className="space-y-1 text-gray-600 text-xs">
              <li>• 3D photo positioning</li>
              <li>• Depth-based occlusion</li>
              <li>• Realistic shadows</li>
              <li>• Spatial audio sync</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisionProSpatialGallery;