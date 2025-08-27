import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Camera,
  Sparkles,
  Wand2,
  Heart,
  Crown,
  Star,
  Zap,
  Palette,
  Filter,
  Play,
  Pause,
  RotateCcw,
  Download,
  Share2,
  Settings,
  Sliders,
  Eye,
  Hand,
  Scan,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  MoreHorizontal,
  Circle,
  Square,
  Triangle,
  Flame,
  Snowflake,
  Music,
  Gift
} from 'lucide-react';

interface ARTheme {
  id: string;
  name: string;
  description: string;
  category: 'wedding' | 'corporate' | 'birthday' | 'holiday' | 'graduation' | 'sports';
  premium: boolean;
  icon: React.ReactNode;
  color: string;
  overlays: AROverlay[];
  animations: ARAnimation[];
  sounds?: string[];
  particles?: ParticleSystem;
}

interface AROverlay {
  id: string;
  name: string;
  type: 'static' | 'animated' | 'interactive' | 'particle';
  position: 'foreground' | 'background' | 'object-bound';
  asset: string;
  scale: number;
  opacity: number;
  blendMode: string;
  tracking?: 'face' | 'hand' | 'ground' | 'object' | 'sky';
  duration?: number;
  loop?: boolean;
}

interface ARAnimation {
  id: string;
  name: string;
  target: string;
  type: 'float' | 'rotate' | 'scale' | 'fade' | 'trail' | 'sparkle';
  duration: number;
  easing: string;
  loop: boolean;
  trigger?: 'tap' | 'gesture' | 'voice' | 'automatic';
}

interface ParticleSystem {
  type: 'confetti' | 'sparkles' | 'hearts' | 'flowers' | 'fireworks' | 'snow' | 'bubbles';
  count: number;
  lifetime: number;
  physics: boolean;
  interactive: boolean;
}

interface ARThemeOverlaysProps {
  eventType?: 'wedding' | 'corporate' | 'birthday' | 'holiday' | 'graduation' | 'sports';
  isActive?: boolean;
  onThemeChange?: (theme: ARTheme) => void;
  onOverlayApplied?: (overlay: AROverlay) => void;
}

const ARThemeOverlays = ({
  eventType = 'wedding',
  isActive = false,
  onThemeChange,
  onOverlayApplied
}: ARThemeOverlaysProps) => {
  const [selectedTheme, setSelectedTheme] = useState<ARTheme | null>(null);
  const [activeOverlays, setActiveOverlays] = useState<AROverlay[]>([]);
  const [isARActive, setIsARActive] = useState(isActive);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [trackingMode, setTrackingMode] = useState<'face' | 'hand' | 'ground' | 'sky'>('ground');
  const [filterIntensity, setFilterIntensity] = useState(100);
  const [showParticles, setShowParticles] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Predefined AR Themes for different event types
  const arThemes: ARTheme[] = [
    {
      id: 'romantic-wedding',
      name: 'Romantic Wedding',
      description: 'Ethereal wedding ring trails, floating rose petals, and golden sparkles',
      category: 'wedding',
      premium: false,
      icon: <Heart className="h-4 w-4" />,
      color: 'text-pink-600',
      overlays: [
        {
          id: 'ring-trails',
          name: 'Wedding Ring Trails',
          type: 'interactive',
          position: 'foreground',
          asset: '/ar-assets/ring-trail.glb',
          scale: 1.0,
          opacity: 0.8,
          blendMode: 'screen',
          tracking: 'hand',
          duration: 3000,
          loop: true
        },
        {
          id: 'rose-petals',
          name: 'Floating Rose Petals',
          type: 'particle',
          position: 'background',
          asset: '/ar-assets/rose-petals.png',
          scale: 0.5,
          opacity: 0.7,
          blendMode: 'multiply',
          tracking: 'ground',
          loop: true
        }
      ],
      animations: [
        {
          id: 'sparkle-burst',
          name: 'Sparkle Burst',
          target: 'ring-trails',
          type: 'sparkle',
          duration: 2000,
          easing: 'ease-out',
          loop: true,
          trigger: 'tap'
        }
      ],
      sounds: ['wedding-bells.mp3', 'romantic-melody.mp3'],
      particles: {
        type: 'sparkles',
        count: 50,
        lifetime: 5000,
        physics: true,
        interactive: false
      }
    },
    {
      id: 'luxury-wedding',
      name: 'Luxury Wedding',
      description: 'Golden crowns, diamond sparkles, and elegant champagne bubbles',
      category: 'wedding',
      premium: true,
      icon: <Crown className="h-4 w-4" />,
      color: 'text-yellow-600',
      overlays: [
        {
          id: 'golden-crown',
          name: 'Golden Crown',
          type: 'animated',
          position: 'foreground',
          asset: '/ar-assets/golden-crown.glb',
          scale: 1.2,
          opacity: 0.9,
          blendMode: 'screen',
          tracking: 'face',
          duration: 0,
          loop: true
        },
        {
          id: 'champagne-bubbles',
          name: 'Champagne Bubbles',
          type: 'particle',
          position: 'background',
          asset: '/ar-assets/bubbles.png',
          scale: 0.3,
          opacity: 0.6,
          blendMode: 'screen',
          tracking: 'ground',
          loop: true
        }
      ],
      animations: [
        {
          id: 'crown-glow',
          name: 'Crown Glow',
          target: 'golden-crown',
          type: 'fade',
          duration: 3000,
          easing: 'ease-in-out',
          loop: true,
          trigger: 'automatic'
        }
      ],
      particles: {
        type: 'sparkles',
        count: 100,
        lifetime: 8000,
        physics: true,
        interactive: true
      }
    },
    {
      id: 'corporate-professional',
      name: 'Corporate Professional',
      description: 'Floating company logos, sleek geometric patterns, and brand holograms',
      category: 'corporate',
      premium: true,
      icon: <Zap className="h-4 w-4" />,
      color: 'text-blue-600',
      overlays: [
        {
          id: 'logo-hologram',
          name: 'Brand Logo Hologram',
          type: 'animated',
          position: 'foreground',
          asset: '/ar-assets/logo-hologram.glb',
          scale: 1.5,
          opacity: 0.8,
          blendMode: 'screen',
          tracking: 'ground',
          duration: 0,
          loop: true
        },
        {
          id: 'data-particles',
          name: 'Data Visualization',
          type: 'interactive',
          position: 'background',
          asset: '/ar-assets/data-viz.glb',
          scale: 0.8,
          opacity: 0.7,
          blendMode: 'multiply',
          tracking: 'object',
          loop: true
        }
      ],
      animations: [
        {
          id: 'logo-rotate',
          name: 'Logo Rotation',
          target: 'logo-hologram',
          type: 'rotate',
          duration: 10000,
          easing: 'linear',
          loop: true,
          trigger: 'automatic'
        }
      ],
      particles: {
        type: 'sparkles',
        count: 30,
        lifetime: 6000,
        physics: false,
        interactive: true
      }
    },
    {
      id: 'birthday-celebration',
      name: 'Birthday Celebration',
      description: 'Colorful balloons, birthday confetti, and animated cake sparklers',
      category: 'birthday',
      premium: false,
      icon: <Gift className="h-4 w-4" />,
      color: 'text-purple-600',
      overlays: [
        {
          id: 'floating-balloons',
          name: 'Floating Balloons',
          type: 'animated',
          position: 'background',
          asset: '/ar-assets/balloons.glb',
          scale: 1.0,
          opacity: 0.8,
          blendMode: 'normal',
          tracking: 'sky',
          duration: 0,
          loop: true
        },
        {
          id: 'confetti-burst',
          name: 'Confetti Burst',
          type: 'particle',
          position: 'foreground',
          asset: '/ar-assets/confetti.png',
          scale: 0.6,
          opacity: 0.9,
          blendMode: 'screen',
          tracking: 'ground',
          duration: 5000,
          loop: false
        }
      ],
      animations: [
        {
          id: 'balloon-float',
          name: 'Balloon Float',
          target: 'floating-balloons',
          type: 'float',
          duration: 8000,
          easing: 'ease-in-out',
          loop: true,
          trigger: 'automatic'
        }
      ],
      particles: {
        type: 'confetti',
        count: 200,
        lifetime: 10000,
        physics: true,
        interactive: false
      }
    }
  ];

  // Filter themes by event type
  const availableThemes = arThemes.filter(theme => theme.category === eventType);

  // Initialize AR camera
  const initializeAR = async () => {
    setIsLoading(true);
    setLoadingProgress(0);

    try {
      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: audioEnabled
      });

      setCameraStream(stream);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Simulate AR initialization steps
      const steps = [
        'Initializing camera...',
        'Loading AR models...',
        'Calibrating tracking...',
        'Preparing overlays...',
        'Ready for AR!'
      ];

      for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setLoadingProgress((i + 1) * 20);
      }

      setIsARActive(true);
      setIsLoading(false);

    } catch (error) {
      console.error('AR initialization failed:', error);
      setIsLoading(false);
      alert('Camera access is required for AR theme overlays.');
    }
  };

  // Apply AR theme
  const applyTheme = (theme: ARTheme) => {
    setSelectedTheme(theme);
    setActiveOverlays(theme.overlays);
    onThemeChange?.(theme);

    // Simulate applying overlays
    theme.overlays.forEach(overlay => {
      setTimeout(() => {
        onOverlayApplied?.(overlay);
      }, 500);
    });
  };

  // Stop AR session
  const stopAR = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsARActive(false);
    setSelectedTheme(null);
    setActiveOverlays([]);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  return (
    <div className="space-y-6">
      {/* AR Theme Overlays */}
      <div className="glass-card relative">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-50/10 via-purple-50/10 to-blue-50/10 opacity-30"></div>
        
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-2 text-gradient-electric">
            <Wand2 className="h-6 w-6 electric-accent" />
            AR Theme Overlays
            <Badge variant="secondary" className="electric-border">Live Filters</Badge>
          </CardTitle>
          <CardDescription>
            Transform your event photos with magical AR overlays that match your celebration theme
          </CardDescription>
        </CardHeader>

        <CardContent className="relative space-y-6">
          {/* Loading State */}
          {isLoading && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 text-lg font-medium text-gradient-electric mb-4">
                  <div className="animate-spin w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full"></div>
                  Initializing AR Overlays
                </div>
              </div>
              <Progress value={loadingProgress} className="h-3" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Camera className="h-4 w-4 text-pink-500" />
                  <span>Camera Access</span>
                </div>
                <div className="flex items-center gap-2">
                  <Scan className="h-4 w-4 text-purple-500" />
                  <span>AR Tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-blue-500" />
                  <span>Theme Assets</span>
                </div>
              </div>
            </div>
          )}

          {/* AR Active State */}
          {isARActive && !isLoading ? (
            <div className="space-y-4">
              <Alert>
                <Wand2 className="h-4 w-4" />
                <AlertDescription>
                  <strong>AR Overlays Active!</strong><br />
                  Point your camera at the scene. Tap and gesture to interact with magical overlay effects.
                </AlertDescription>
              </Alert>

              {/* AR Camera View */}
              <div className="relative bg-black vision-pro-rounded overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-96 object-cover"
                />
                
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  style={{ mixBlendMode: 'screen' }}
                />

                {/* AR Overlay Simulation */}
                {selectedTheme && (
                  <div className="absolute inset-0 pointer-events-none">
                    {selectedTheme.id === 'romantic-wedding' && (
                      <>
                        {/* Floating sparkles */}
                        <div className="absolute top-10 left-10 w-8 h-8 bg-pink-300 rounded-full opacity-70 animate-bounce"></div>
                        <div className="absolute top-20 right-16 w-6 h-6 bg-yellow-300 rounded-full opacity-60 animate-pulse"></div>
                        <div className="absolute bottom-20 left-20 w-10 h-10 bg-pink-200 rounded-full opacity-50 animate-ping"></div>
                        
                        {/* Ring trail effect */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <div className="w-32 h-32 border-4 border-yellow-400 rounded-full opacity-60 animate-spin"></div>
                        </div>
                      </>
                    )}

                    {selectedTheme.id === 'luxury-wedding' && (
                      <>
                        {/* Golden crown */}
                        <div className="absolute top-16 left-1/2 transform -translate-x-1/2">
                          <Crown className="h-16 w-16 text-yellow-400 animate-pulse" />
                        </div>
                        
                        {/* Champagne bubbles */}
                        <div className="absolute bottom-10 left-10 w-4 h-4 bg-white rounded-full opacity-80 animate-bounce"></div>
                        <div className="absolute bottom-16 right-12 w-3 h-3 bg-blue-100 rounded-full opacity-70 animate-bounce" style={{ animationDelay: '0.5s' }}></div>
                        <div className="absolute bottom-24 left-16 w-5 h-5 bg-white rounded-full opacity-60 animate-bounce" style={{ animationDelay: '1s' }}></div>
                      </>
                    )}

                    {selectedTheme.id === 'corporate-professional' && (
                      <>
                        {/* Holographic logo */}
                        <div className="absolute top-1/3 right-10">
                          <div className="p-4 bg-blue-500 bg-opacity-20 border border-blue-400 vision-pro-rounded">
                            <Zap className="h-12 w-12 text-blue-400 animate-pulse" />
                          </div>
                        </div>
                        
                        {/* Data visualization */}
                        <div className="absolute bottom-20 left-10 flex space-x-1">
                          <div className="w-2 h-8 bg-blue-400 animate-pulse"></div>
                          <div className="w-2 h-12 bg-blue-500 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-6 bg-blue-300 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      </>
                    )}

                    {selectedTheme.id === 'birthday-celebration' && (
                      <>
                        {/* Floating balloons */}
                        <div className="absolute top-10 left-10">
                          <Circle className="h-8 w-8 text-red-400 animate-bounce" />
                        </div>
                        <div className="absolute top-12 left-20">
                          <Circle className="h-6 w-6 text-blue-400 animate-bounce" style={{ animationDelay: '0.3s' }} />
                        </div>
                        <div className="absolute top-8 left-32">
                          <Circle className="h-7 w-7 text-green-400 animate-bounce" style={{ animationDelay: '0.6s' }} />
                        </div>
                        
                        {/* Confetti */}
                        <div className="absolute top-20 right-20 w-3 h-6 bg-yellow-400 animate-bounce"></div>
                        <div className="absolute top-32 right-16 w-2 h-4 bg-pink-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        <div className="absolute top-28 right-28 w-4 h-3 bg-blue-400 animate-bounce" style={{ animationDelay: '0.8s' }}></div>
                      </>
                    )}
                  </div>
                )}

                {/* AR Controls Overlay */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-black/50 border-white/30 text-white hover:bg-black/70"
                    onClick={() => setShowParticles(!showParticles)}
                  >
                    <Sparkles className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-black/50 border-white/30 text-white hover:bg-black/70"
                    onClick={() => setAudioEnabled(!audioEnabled)}
                  >
                    {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  </Button>
                </div>

                {/* Theme Info */}
                {selectedTheme && (
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="glass-panel px-4 py-2 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-sm">{selectedTheme.name}</h4>
                          <p className="text-xs opacity-80">{activeOverlays.length} overlays active</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {selectedTheme.premium && (
                            <Badge variant="secondary" className="text-xs bg-yellow-500/20 text-yellow-300 border-yellow-400/30">
                              Premium
                            </Badge>
                          )}
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-xs">Live</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* AR Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setTrackingMode(trackingMode === 'face' ? 'hand' : trackingMode === 'hand' ? 'ground' : trackingMode === 'ground' ? 'sky' : 'face')}
                    className="glass-button electric-border"
                  >
                    <Hand className="h-4 w-4 mr-2" />
                    {trackingMode}
                  </Button>
                  
                  <div className="flex items-center gap-2">
                    <Sliders className="h-4 w-4 text-gray-600" />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={filterIntensity}
                      onChange={(e) => setFilterIntensity(Number(e.target.value))}
                      className="w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-sm text-gray-600">{filterIntensity}%</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="glass-button">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="glass-button">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button size="sm" onClick={stopAR} className="glass-button electric-border electric-accent hover:electric-bg hover:text-white">
                    Stop AR
                  </Button>
                </div>
              </div>
            </div>
          ) : !isLoading ? (
            <div className="space-y-6">
              {/* Theme Selection */}
              <div>
                <h3 className="text-lg font-medium mb-4 text-gradient-electric">
                  {eventType.charAt(0).toUpperCase() + eventType.slice(1)} Themes
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableThemes.map((theme) => (
                    <div
                      key={theme.id}
                      className={`glass-card p-4 cursor-pointer transition-all hover:scale-105 ${
                        selectedTheme?.id === theme.id ? 'ring-2 ring-electric-accent' : ''
                      }`}
                      onClick={() => applyTheme(theme)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full bg-gray-100 ${theme.color}`}>
                          {theme.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm">{theme.name}</h4>
                            {theme.premium && (
                              <Badge variant="secondary" className="text-xs electric-border">
                                <Crown className="h-2 w-2 mr-1" />
                                Premium
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mb-2">{theme.description}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>{theme.overlays.length} overlays</span>
                            <span>•</span>
                            <span>{theme.animations.length} animations</span>
                            {theme.sounds && (
                              <>
                                <span>•</span>
                                <span>Audio effects</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Start AR Button */}
              <div className="text-center">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-pink-100 flex items-center justify-center mb-4">
                  <Wand2 className="h-10 w-10 text-pink-600" />
                </div>
                <h3 className="text-xl font-semibold text-gradient-electric mb-2">AR Theme Overlays</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                  Transform your event with magical AR overlays that bring your celebration theme to life in real-time.
                </p>
                
                <Button 
                  onClick={initializeAR}
                  disabled={isLoading || !selectedTheme}
                  className="electric-bg text-white hover:electric-glow vision-pro-rounded"
                >
                  <Wand2 className="h-4 w-4 mr-2" />
                  Start AR Experience
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </div>

      {/* Feature Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 text-center">
          <Heart className="h-8 w-8 electric-accent mx-auto mb-4" />
          <h4 className="font-medium text-gradient-electric mb-2">Wedding Magic</h4>
          <p className="text-sm text-gray-600">
            Ring trails, rose petals, and golden sparkles that follow your movements
          </p>
        </div>
        
        <div className="glass-card p-6 text-center">
          <Zap className="h-8 w-8 electric-accent mx-auto mb-4" />
          <h4 className="font-medium text-gradient-electric mb-2">Brand Holograms</h4>
          <p className="text-sm text-gray-600">
            Corporate logos and data visualizations floating in 3D space
          </p>
        </div>
        
        <div className="glass-card p-6 text-center">
          <Gift className="h-8 w-8 electric-accent mx-auto mb-4" />
          <h4 className="font-medium text-gradient-electric mb-2">Party Effects</h4>
          <p className="text-sm text-gray-600">
            Confetti bursts, floating balloons, and celebration particles
          </p>
        </div>
      </div>

      {/* AR Capabilities */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-medium mb-4 text-gradient-electric">AR Capabilities</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <Hand className="h-4 w-4" />
              Hand Tracking
            </h4>
            <ul className="space-y-1 text-gray-600 text-xs">
              <li>• Gesture recognition</li>
              <li>• Interactive overlays</li>
              <li>• Touch effects</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Face Detection
            </h4>
            <ul className="space-y-1 text-gray-600 text-xs">
              <li>• Face-bound effects</li>
              <li>• Crown placement</li>
              <li>• Expression triggers</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <Scan className="h-4 w-4" />
              Surface Tracking
            </h4>
            <ul className="space-y-1 text-gray-600 text-xs">
              <li>• Ground plane detection</li>
              <li>• Object placement</li>
              <li>• Stable anchoring</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Particle Systems
            </h4>
            <ul className="space-y-1 text-gray-600 text-xs">
              <li>• Physics simulation</li>
              <li>• Interactive particles</li>
              <li>• Environmental effects</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ARThemeOverlays;