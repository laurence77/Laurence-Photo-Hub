import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Glasses,
  Smartphone,
  Camera,
  Play,
  Pause,
  RotateCcw,
  Maximize,
  Volume2,
  VolumeX,
  Settings,
  Download,
  Share2,
  Heart,
  BookOpen,
  Sparkles,
  Zap,
  Eye,
  Monitor,
  Headphones,
  Hand,
  Move3D,
  Scan,
  QrCode,
  Wifi,
  Battery,
  Signal
} from 'lucide-react';

interface ARVRProps {
  eventId?: string;
  photos?: string[];
  eventTitle?: string;
  onExperienceStart?: () => void;
  onExperienceEnd?: () => void;
}

interface VRCapabilities {
  webXRSupported: boolean;
  vrDisplays: number;
  arSupported: boolean;
  deviceType: 'mobile' | 'desktop' | 'vr' | 'unknown';
  sensors: {
    gyroscope: boolean;
    accelerometer: boolean;
    magnetometer: boolean;
    deviceOrientation: boolean;
  };
}

const ARVRExperience = ({ 
  eventId = 'sample-event', 
  photos = [],
  eventTitle = 'Wedding Celebration',
  onExperienceStart,
  onExperienceEnd 
}: ARVRProps) => {
  const [vrCapabilities, setVRCapabilities] = useState<VRCapabilities | null>(null);
  const [isVRActive, setIsVRActive] = useState(false);
  const [isARActive, setIsARActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [is360Mode, setIs360Mode] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [memoryBookOpen, setMemoryBookOpen] = useState(false);
  
  const vrRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mock photos if none provided
  const defaultPhotos = [
    '/uploads/a0278ce1-b82d-4ed6-a186-14a9503ef65c.png',
    '/uploads/34a58283-8b82-48f9-88f4-2c88b069921d.png',
    '/uploads/47f9a1d0-4458-400a-8fc0-79adf093cf18.png',
    '/uploads/af28398b-9e23-4e2b-9de1-bda457e09fd8.png'
  ];
  
  const displayPhotos = photos.length > 0 ? photos : defaultPhotos;

  // Detect VR/AR capabilities
  useEffect(() => {
    const detectCapabilities = async () => {
      const capabilities: VRCapabilities = {
        webXRSupported: false,
        vrDisplays: 0,
        arSupported: false,
        deviceType: 'unknown',
        sensors: {
          gyroscope: false,
          accelerometer: false,
          magnetometer: false,
          deviceOrientation: false
        }
      };

      // Check for WebXR support
      if ('xr' in navigator) {
        try {
          const xr = (navigator as any).xr;
          capabilities.webXRSupported = true;
          
          // Check VR support
          const vrSupported = await xr.isSessionSupported('immersive-vr');
          if (vrSupported) {
            capabilities.vrDisplays = 1;
          }
          
          // Check AR support
          const arSupported = await xr.isSessionSupported('immersive-ar');
          capabilities.arSupported = arSupported;
        } catch (error) {
          console.warn('WebXR detection failed:', error);
        }
      }

      // Detect device type
      const userAgent = navigator.userAgent.toLowerCase();
      if (/mobile|android|iphone|ipad/.test(userAgent)) {
        capabilities.deviceType = 'mobile';
      } else if (/oculus|vive|index|quest/.test(userAgent)) {
        capabilities.deviceType = 'vr';
      } else {
        capabilities.deviceType = 'desktop';
      }

      // Check sensor support
      if ('DeviceOrientationEvent' in window) {
        capabilities.sensors.deviceOrientation = true;
      }
      
      if ('Gyroscope' in window) {
        capabilities.sensors.gyroscope = true;
      }
      
      if ('Accelerometer' in window) {
        capabilities.sensors.accelerometer = true;
      }

      setVRCapabilities(capabilities);
    };

    detectCapabilities();
  }, []);

  // VR Experience Launcher
  const startVRExperience = async () => {
    if (!vrCapabilities?.webXRSupported) {
      alert('VR not supported on this device. Try using a VR headset or mobile device.');
      return;
    }

    setIsLoading(true);
    setLoadingProgress(0);
    
    try {
      // Simulate loading VR assets
      const loadingSteps = [
        'Initializing VR runtime...',
        'Loading 3D models...',
        'Preparing photo spheres...',
        'Calibrating audio...',
        'Starting immersive experience...'
      ];

      for (let i = 0; i < loadingSteps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setLoadingProgress((i + 1) * 20);
      }

      // In a real implementation, this would initialize WebXR
      /*
      const xr = (navigator as any).xr;
      const session = await xr.requestSession('immersive-vr', {
        requiredFeatures: ['local-floor'],
        optionalFeatures: ['hand-tracking', 'layers']
      });
      */

      setIsVRActive(true);
      setIsLoading(false);
      onExperienceStart?.();

      // Auto-advance through photos in VR mode
      const interval = setInterval(() => {
        setCurrentPhoto(prev => (prev + 1) % displayPhotos.length);
      }, 5000);

      // Cleanup after 30 seconds for demo
      setTimeout(() => {
        clearInterval(interval);
        endVRExperience();
      }, 30000);

    } catch (error) {
      console.error('VR initialization failed:', error);
      setIsLoading(false);
      alert('Failed to start VR experience. Please check your VR device connection.');
    }
  };

  const endVRExperience = () => {
    setIsVRActive(false);
    setLoadingProgress(0);
    onExperienceEnd?.();
  };

  // AR Memory Book Experience
  const startARMemoryBook = async () => {
    if (!vrCapabilities?.arSupported && vrCapabilities?.deviceType !== 'mobile') {
      alert('AR Memory Book requires a mobile device with camera access.');
      return;
    }

    setIsLoading(true);
    setLoadingProgress(0);

    try {
      // Request camera permissions
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }
      });
      
      // Simulate AR initialization
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setLoadingProgress(i);
      }

      setIsARActive(true);
      setIsLoading(false);
      setMemoryBookOpen(true);

      // Clean up camera stream for demo
      stream.getTracks().forEach(track => track.stop());

    } catch (error) {
      console.error('AR initialization failed:', error);
      setIsLoading(false);
      alert('Camera access is required for AR Memory Book experience.');
    }
  };

  const endARExperience = () => {
    setIsARActive(false);
    setMemoryBookOpen(false);
    setLoadingProgress(0);
  };

  const toggle360Mode = () => {
    setIs360Mode(!is360Mode);
  };

  const nextPhoto = () => {
    setCurrentPhoto((prev) => (prev + 1) % displayPhotos.length);
  };

  const prevPhoto = () => {
    setCurrentPhoto((prev) => (prev - 1 + displayPhotos.length) % displayPhotos.length);
  };

  return (
    <div className="space-y-6">
      {/* VR Wedding Experience */}
      <div className="glass-card relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-50/10 via-blue-50/10 to-purple-50/10 opacity-30"></div>
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-2 text-gradient-electric">
            <Glasses className="h-6 w-6 electric-accent" />
            VR Wedding Experience
            <Badge variant="secondary" className="electric-border">WebXR</Badge>
          </CardTitle>
          <CardDescription>
            Immersive virtual reality wedding experience with 360° photo galleries and spatial audio
          </CardDescription>
        </CardHeader>
        
        <CardContent className="relative space-y-6">
          {/* VR Capabilities Check */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 border rounded-lg ${
              vrCapabilities?.webXRSupported 
                ? 'border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800' 
                : 'border-gray-200 bg-gray-50 dark:bg-gray-900'
            }`}>
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-full ${
                  vrCapabilities?.webXRSupported ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  <Glasses className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">WebXR Support</h4>
                  <Badge variant={vrCapabilities?.webXRSupported ? 'default' : 'secondary'} className="text-xs">
                    {vrCapabilities?.webXRSupported ? 'Available' : 'Not Available'}
                  </Badge>
                </div>
              </div>
            </div>

            <div className={`p-4 border rounded-lg ${
              vrCapabilities?.sensors.deviceOrientation 
                ? 'border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800' 
                : 'border-gray-200 bg-gray-50 dark:bg-gray-900'
            }`}>
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-full ${
                  vrCapabilities?.sensors.deviceOrientation ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  <Move3D className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Motion Sensors</h4>
                  <Badge variant={vrCapabilities?.sensors.deviceOrientation ? 'default' : 'secondary'} className="text-xs">
                    {vrCapabilities?.sensors.deviceOrientation ? 'Available' : 'Not Available'}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                  <Monitor className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Device Type</h4>
                  <Badge variant="secondary" className="text-xs capitalize">
                    {vrCapabilities?.deviceType || 'Detecting...'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* VR Loading */}
          {isLoading && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 text-lg font-medium text-gradient-electric mb-4">
                  <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                  Preparing VR Experience
                </div>
              </div>
              <Progress value={loadingProgress} className="h-3" />
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Wifi className="h-4 w-4 text-green-500" />
                  <span>WebXR Connected</span>
                </div>
                <div className="flex items-center gap-2">
                  <Signal className="h-4 w-4 text-green-500" />
                  <span>Tracking Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <Battery className="h-4 w-4 text-green-500" />
                  <span>Headset Ready</span>
                </div>
              </div>
            </div>
          )}

          {/* VR Experience Controls */}
          {isVRActive ? (
            <div className="space-y-4">
              <Alert>
                <Glasses className="h-4 w-4" />
                <AlertDescription>
                  <strong>VR Experience Active!</strong><br />
                  You are now in immersive VR mode. Use your headset controls to navigate through the wedding memories.
                </AlertDescription>
              </Alert>

              {/* VR Photo Viewer */}
              <div className="relative vision-pro-rounded overflow-hidden">
                <img
                  src={displayPhotos[currentPhoto]}
                  alt={`VR Wedding Memory ${currentPhoto + 1}`}
                  className="w-full h-96 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent">
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Badge className="electric-bg">
                          <Eye className="h-3 w-3 mr-1" />
                          VR Active
                        </Badge>
                        <Badge variant="outline" className="border-white text-white">
                          {currentPhoto + 1} / {displayPhotos.length}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white text-white hover:bg-white hover:text-black"
                          onClick={() => setIsMuted(!isMuted)}
                        >
                          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white text-white hover:bg-white hover:text-black"
                          onClick={toggle360Mode}
                        >
                          <Move3D className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-center space-x-2">
                      {displayPhotos.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentPhoto ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <Button onClick={endVRExperience} variant="outline" className="glass-button">
                  Exit VR
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-purple-100 flex items-center justify-center mb-4">
                <Glasses className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gradient-electric">Immersive VR Wedding Experience</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Step into a virtual reality experience where you can relive the wedding moments in stunning 360° detail with spatial audio.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={startVRExperience}
                  disabled={isLoading}
                  className="electric-bg text-white hover:electric-glow vision-pro-rounded"
                >
                  <Glasses className="h-4 w-4 mr-2" />
                  Enter VR Experience
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => setIs360Mode(true)}
                  className="glass-button electric-border electric-accent hover:electric-bg hover:text-white"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  360° Preview
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </div>

      {/* AR Memory Book */}
      <div className="glass-card relative">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-50/10 via-purple-50/10 to-blue-50/10 opacity-30"></div>
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-2 text-gradient-electric">
            <BookOpen className="h-6 w-6 electric-accent" />
            AR Memory Book
            <Badge variant="secondary" className="electric-border">Camera AR</Badge>
          </CardTitle>
          <CardDescription>
            Interactive augmented reality memory book that brings wedding photos to life in your physical space
          </CardDescription>
        </CardHeader>
        
        <CardContent className="relative space-y-6">
          {/* AR Experience */}
          {isARActive && memoryBookOpen ? (
            <div className="space-y-4">
              <Alert>
                <Scan className="h-4 w-4" />
                <AlertDescription>
                  <strong>AR Memory Book Active!</strong><br />
                  Point your camera at any flat surface to place and interact with 3D wedding memories.
                </AlertDescription>
              </Alert>

              {/* AR Camera View Simulation */}
              <div className="relative bg-black vision-pro-rounded overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 flex items-center justify-center">
                  <div className="text-center text-white space-y-4">
                    <div className="w-16 h-16 mx-auto border-2 border-white rounded-full flex items-center justify-center animate-pulse">
                      <Camera className="h-8 w-8" />
                    </div>
                    <p className="text-sm">Point camera at a flat surface</p>
                    <div className="flex items-center justify-center gap-2 text-xs">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      Tracking surface...
                    </div>
                  </div>
                </div>

                {/* AR Overlay Elements */}
                <div className="absolute inset-4 pointer-events-none">
                  {/* Scanning Grid */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent animate-pulse"></div>
                  
                  {/* AR Photo Preview */}
                  <div className="absolute bottom-4 left-4 w-24 h-16 bg-white/90 rounded-lg p-1">
                    <img
                      src={displayPhotos[0]}
                      alt="AR Memory"
                      className="w-full h-full object-cover rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  </div>

                  {/* AR Controls */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <Button size="sm" variant="outline" className="bg-white/10 border-white/20 text-white">
                      <Hand className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="bg-white/10 border-white/20 text-white">
                      <Maximize className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button size="sm" variant="outline" className="glass-button">
                  <Camera className="h-4 w-4 mr-2" />
                  Capture
                </Button>
                <Button size="sm" variant="outline" className="glass-button">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share AR
                </Button>
                <Button size="sm" variant="outline" className="glass-button">
                  <Heart className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={endARExperience} className="glass-button">
                  Exit AR
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-pink-100 flex items-center justify-center mb-4">
                <BookOpen className="h-10 w-10 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gradient-electric">Interactive AR Memory Book</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Transform your physical space into an interactive wedding memory gallery. Place 3D photos, videos, and moments around you.
              </p>

              {/* AR Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                <div className="p-4 border rounded-lg bg-white/50">
                  <Sparkles className="h-6 w-6 electric-accent mb-2 mx-auto" />
                  <h4 className="font-medium text-sm mb-1">3D Photo Galleries</h4>
                  <p className="text-xs text-gray-600">Photos float in your space with depth and interaction</p>
                </div>
                
                <div className="p-4 border rounded-lg bg-white/50">
                  <Zap className="h-6 w-6 electric-accent mb-2 mx-auto" />
                  <h4 className="font-medium text-sm mb-1">Touch Interactions</h4>
                  <p className="text-xs text-gray-600">Tap photos to see details, swipe to browse memories</p>
                </div>
                
                <div className="p-4 border rounded-lg bg-white/50">
                  <Headphones className="h-6 w-6 electric-accent mb-2 mx-auto" />
                  <h4 className="font-medium text-sm mb-1">Spatial Audio</h4>
                  <p className="text-xs text-gray-600">Hear wedding vows and music positioned in 3D space</p>
                </div>
                
                <div className="p-4 border rounded-lg bg-white/50">
                  <QrCode className="h-6 w-6 electric-accent mb-2 mx-auto" />
                  <h4 className="font-medium text-sm mb-1">Shared Experiences</h4>
                  <p className="text-xs text-gray-600">Multiple people can view the same AR content</p>
                </div>
              </div>

              <Button 
                onClick={startARMemoryBook}
                disabled={isLoading}
                className="electric-bg text-white hover:electric-glow vision-pro-rounded"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Open AR Memory Book
              </Button>
            </div>
          )}
        </CardContent>
      </div>

      {/* Device Compatibility */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-medium mb-4 text-gradient-electric">Device Compatibility</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              Mobile Devices
            </h4>
            <ul className="space-y-1 text-gray-600 text-xs">
              <li>• iPhone 12+ (iOS 14+)</li>
              <li>• Android 8+ with ARCore</li>
              <li>• Safari, Chrome, Edge</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <Glasses className="h-4 w-4" />
              VR Headsets
            </h4>
            <ul className="space-y-1 text-gray-600 text-xs">
              <li>• Meta Quest 2/3/Pro</li>
              <li>• HTC Vive/Index</li>
              <li>• PlayStation VR2</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              Desktop
            </h4>
            <ul className="space-y-1 text-gray-600 text-xs">
              <li>• Chrome 90+ (WebXR)</li>
              <li>• Firefox 98+ (WebXR)</li>
              <li>• Windows Mixed Reality</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ARVRExperience;