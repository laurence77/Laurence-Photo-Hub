import { useState, useEffect, useRef } from 'react';
import { getImagePath } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Camera,
  Sphere,
  Wifi,
  Bluetooth,
  Usb,
  Download,
  Upload,
  Play,
  Pause,
  Square,
  RotateCcw,
  Settings,
  Eye,
  Move3D,
  Compass,
  Navigation,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Share2,
  Heart,
  Star,
  Clock,
  Battery,
  Signal,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Info,
  Monitor,
  Smartphone,
  Globe,
  MousePointer,
  Hand,
  MoreHorizontal,
  RefreshCw,
  Power,
  WifiOff
} from 'lucide-react';

interface Camera360Device {
  id: string;
  name: string;
  brand: 'Insta360' | 'GoPro' | 'Ricoh' | 'Samsung' | 'Other';
  model: string;
  connected: boolean;
  connectionType: 'wifi' | 'bluetooth' | 'usb' | 'app';
  batteryLevel: number;
  storageUsed: number;
  storageTotal: number;
  resolution: string;
  fps: number;
  features: string[];
  status: 'idle' | 'recording' | 'processing' | 'streaming';
  capabilities: {
    live360: boolean;
    timeShift: boolean;
    bulletTime: boolean;
    flowState: boolean;
    voiceControl: boolean;
    remoteControl: boolean;
  };
}

interface CaptureSession {
  id: string;
  name: string;
  startTime: string;
  duration: number;
  fileCount: number;
  totalSize: number;
  format: '360' | 'timelapse' | 'hyperlapse' | 'bullet-time';
  quality: '4K' | '5.7K' | '8K';
  status: 'recording' | 'completed' | 'processing' | 'failed';
  thumbnail?: string;
  preview360?: string;
}

interface Camera360CaptureProps {
  eventId?: string;
  onCaptureComplete?: (session: CaptureSession) => void;
  onDeviceConnected?: (device: Camera360Device) => void;
  autoUpload?: boolean;
}

const Camera360Capture = ({
  eventId = 'event-360',
  onCaptureComplete,
  onDeviceConnected,
  autoUpload = true
}: Camera360CaptureProps) => {
  const [connectedDevices, setConnectedDevices] = useState<Camera360Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<Camera360Device | null>(null);
  const [activeSessions, setActiveSessions] = useState<CaptureSession[]>([]);
  const [currentSession, setCurrentSession] = useState<CaptureSession | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [viewerMode, setViewerMode] = useState<'flat' | '360' | 'vr'>('360');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [livePreview, setLivePreview] = useState(false);
  const [captureSettings, setCaptureSettings] = useState({
    resolution: '5.7K',
    fps: 30,
    format: '360' as '360' | 'timelapse' | 'hyperlapse' | 'bullet-time',
    stabilization: true,
    hdr: false,
    intervalMode: false,
    interval: 2
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mock 360 camera devices
  const mockDevices: Camera360Device[] = [
    {
      id: 'insta360-x3',
      name: 'Insta360 X3',
      brand: 'Insta360',
      model: 'X3',
      connected: true,
      connectionType: 'wifi',
      batteryLevel: 85,
      storageUsed: 32,
      storageTotal: 128,
      resolution: '5.7K',
      fps: 30,
      features: ['FlowState Stabilization', 'TimeShift', 'Bullet Time', 'Voice Control'],
      status: 'idle',
      capabilities: {
        live360: true,
        timeShift: true,
        bulletTime: true,
        flowState: true,
        voiceControl: true,
        remoteControl: true
      }
    },
    {
      id: 'gopro-max',
      name: 'GoPro MAX',
      brand: 'GoPro',
      model: 'MAX',
      connected: false,
      connectionType: 'wifi',
      batteryLevel: 67,
      storageUsed: 45,
      storageTotal: 64,
      resolution: '5.6K',
      fps: 30,
      features: ['HyperSmooth', '360 Timelapse', 'LiveBurst', 'Voice Control'],
      status: 'idle',
      capabilities: {
        live360: true,
        timeShift: false,
        bulletTime: false,
        flowState: false,
        voiceControl: true,
        remoteControl: true
      }
    },
    {
      id: 'insta360-one-rs',
      name: 'Insta360 ONE RS',
      brand: 'Insta360',
      model: 'ONE RS',
      connected: true,
      connectionType: 'bluetooth',
      batteryLevel: 92,
      storageUsed: 18,
      storageTotal: 256,
      resolution: '6K',
      fps: 30,
      features: ['FlowState', 'Active HDR', 'Invisible Selfie Stick', 'AI Editing'],
      status: 'idle',
      capabilities: {
        live360: true,
        timeShift: true,
        bulletTime: true,
        flowState: true,
        voiceControl: false,
        remoteControl: true
      }
    }
  ];

  // Initialize connected devices
  useEffect(() => {
    const connectedDevicesList = mockDevices.filter(device => device.connected);
    setConnectedDevices(connectedDevicesList);
    if (connectedDevicesList.length > 0) {
      setSelectedDevice(connectedDevicesList[0]);
      onDeviceConnected?.(connectedDevicesList[0]);
    }
  }, [onDeviceConnected]);

  // Recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Scan for devices
  const scanForDevices = async () => {
    setIsScanning(true);
    
    // Simulate device scanning
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const newDevice: Camera360Device = {
      id: 'ricoh-theta-z1',
      name: 'Ricoh Theta Z1',
      brand: 'Ricoh',
      model: 'Theta Z1',
      connected: true,
      connectionType: 'wifi',
      batteryLevel: 74,
      storageUsed: 28,
      storageTotal: 51,
      resolution: '6.7K',
      fps: 30,
      features: ['RAW+', 'High-res Mode', 'Interval Shooting', 'Remote Control'],
      status: 'idle',
      capabilities: {
        live360: true,
        timeShift: false,
        bulletTime: false,
        flowState: false,
        voiceControl: false,
        remoteControl: true
      }
    };

    setConnectedDevices(prev => [...prev, newDevice]);
    setIsScanning(false);
  };

  // Start 360 recording
  const startRecording = async () => {
    if (!selectedDevice) return;

    const session: CaptureSession = {
      id: `session_${Date.now()}`,
      name: `360 Capture ${new Date().toLocaleTimeString()}`,
      startTime: new Date().toISOString(),
      duration: 0,
      fileCount: 0,
      totalSize: 0,
      format: captureSettings.format,
      quality: captureSettings.resolution as '4K' | '5.7K' | '8K',
      status: 'recording',
      thumbnail: getImagePath('/uploads/a0278ce1-b82d-4ed6-a186-14a9503ef65c.png')
    };

    setCurrentSession(session);
    setActiveSessions(prev => [...prev, session]);
    setIsRecording(true);
    
    // Update device status
    setSelectedDevice(prev => prev ? { ...prev, status: 'recording' } : null);
  };

  // Stop recording
  const stopRecording = async () => {
    if (!currentSession || !selectedDevice) return;

    setIsRecording(false);
    setIsProcessing(true);
    setProcessingProgress(0);

    // Simulate processing
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setProcessingProgress(i);
    }

    const completedSession: CaptureSession = {
      ...currentSession,
      duration: recordingTime,
      fileCount: 1,
      totalSize: Math.random() * 2000 + 500, // MB
      status: 'completed',
      preview360: getImagePath('/uploads/360-preview.jpg')
    };

    setActiveSessions(prev => 
      prev.map(s => s.id === currentSession.id ? completedSession : s)
    );
    
    setCurrentSession(null);
    setIsProcessing(false);
    setSelectedDevice(prev => prev ? { ...prev, status: 'idle' } : null);
    
    onCaptureComplete?.(completedSession);
  };

  // Connect to device
  const connectDevice = async (device: Camera360Device) => {
    // Simulate connection process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const updatedDevice = { ...device, connected: true };
    setConnectedDevices(prev => 
      prev.map(d => d.id === device.id ? updatedDevice : d)
    );
    setSelectedDevice(updatedDevice);
    onDeviceConnected?.(updatedDevice);
  };

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (mb: number) => {
    return mb > 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${mb.toFixed(0)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* 360° Camera Control */}
      <div className="glass-card relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/10 via-green-50/10 to-blue-50/10 opacity-30"></div>
        
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-2 text-gradient-electric">
            <Sphere className="h-6 w-6 electric-accent" />
            360° Camera Capture
            <Badge variant="secondary" className="electric-border">Live Control</Badge>
          </CardTitle>
          <CardDescription>
            Connect and control Insta360, GoPro, and other 360° cameras for immersive event capture
          </CardDescription>
        </CardHeader>

        <CardContent className="relative space-y-6">
          <Tabs defaultValue="devices" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="devices">Devices</TabsTrigger>
              <TabsTrigger value="capture">Capture</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="sessions">Sessions</TabsTrigger>
            </TabsList>

            {/* Device Management */}
            <TabsContent value="devices" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gradient-electric">Connected Cameras</h3>
                <Button
                  onClick={scanForDevices}
                  disabled={isScanning}
                  size="sm"
                  className="glass-button electric-border electric-accent hover:electric-bg hover:text-white"
                >
                  {isScanning ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Wifi className="h-4 w-4 mr-2" />
                  )}
                  {isScanning ? 'Scanning...' : 'Scan Devices'}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockDevices.map((device) => (
                  <div
                    key={device.id}
                    className={`glass-card p-4 cursor-pointer transition-all hover:scale-105 ${
                      selectedDevice?.id === device.id ? 'ring-2 ring-electric-accent' : ''
                    } ${!device.connected ? 'opacity-60' : ''}`}
                    onClick={() => device.connected ? setSelectedDevice(device) : connectDevice(device)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          device.brand === 'Insta360' ? 'bg-red-100 text-red-600' :
                          device.brand === 'GoPro' ? 'bg-blue-100 text-blue-600' :
                          device.brand === 'Ricoh' ? 'bg-purple-100 text-purple-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          <Camera className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{device.name}</h4>
                          <p className="text-xs text-gray-600">{device.model}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant={device.connected ? 'default' : 'secondary'} className="text-xs">
                          {device.connected ? 'Connected' : 'Available'}
                        </Badge>
                        <div className="flex items-center gap-1">
                          {device.connectionType === 'wifi' && <Wifi className="h-3 w-3 text-blue-500" />}
                          {device.connectionType === 'bluetooth' && <Bluetooth className="h-3 w-3 text-blue-500" />}
                          {device.connectionType === 'usb' && <Usb className="h-3 w-3 text-green-500" />}
                        </div>
                      </div>
                    </div>

                    {device.connected && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1">
                            <Battery className="h-3 w-3" />
                            <span>{device.batteryLevel}%</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Signal className="h-3 w-3" />
                            <span>{device.resolution}@{device.fps}fps</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {device.status}
                          </Badge>
                        </div>
                        
                        <div className="text-xs text-gray-600">
                          Storage: {formatFileSize(device.storageUsed)} / {formatFileSize(device.storageTotal)}
                        </div>
                        
                        <Progress value={(device.storageUsed / device.storageTotal) * 100} className="h-1" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Capture Controls */}
            <TabsContent value="capture" className="space-y-4">
              {selectedDevice ? (
                <div className="space-y-4">
                  {/* Device Status */}
                  <div className="glass-panel p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="font-medium">{selectedDevice.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {selectedDevice.resolution}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Battery className="h-4 w-4" />
                          <span>{selectedDevice.batteryLevel}%</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Monitor className="h-4 w-4" />
                          <span>{formatFileSize(selectedDevice.storageTotal - selectedDevice.storageUsed)} free</span>
                        </div>
                      </div>
                    </div>

                    {/* Capture Settings */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="text-xs font-medium text-gray-600">Resolution</label>
                        <select 
                          className="w-full mt-1 p-2 text-sm border rounded vision-pro-rounded"
                          value={captureSettings.resolution}
                          onChange={(e) => setCaptureSettings(prev => ({ ...prev, resolution: e.target.value }))}
                        >
                          <option value="4K">4K</option>
                          <option value="5.7K">5.7K</option>
                          <option value="6K">6K</option>
                          <option value="8K">8K</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="text-xs font-medium text-gray-600">Format</label>
                        <select 
                          className="w-full mt-1 p-2 text-sm border rounded vision-pro-rounded"
                          value={captureSettings.format}
                          onChange={(e) => setCaptureSettings(prev => ({ ...prev, format: e.target.value as any }))}
                        >
                          <option value="360">360° Video</option>
                          <option value="timelapse">360° Timelapse</option>
                          <option value="hyperlapse">Hyperlapse</option>
                          <option value="bullet-time">Bullet Time</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="text-xs font-medium text-gray-600">FPS</label>
                        <select 
                          className="w-full mt-1 p-2 text-sm border rounded vision-pro-rounded"
                          value={captureSettings.fps}
                          onChange={(e) => setCaptureSettings(prev => ({ ...prev, fps: Number(e.target.value) }))}
                        >
                          <option value={24}>24 FPS</option>
                          <option value={30}>30 FPS</option>
                          <option value={60}>60 FPS</option>
                          <option value={120}>120 FPS</option>
                        </select>
                      </div>
                      
                      <div className="flex items-center gap-2 pt-6">
                        <input 
                          type="checkbox" 
                          id="stabilization"
                          checked={captureSettings.stabilization}
                          onChange={(e) => setCaptureSettings(prev => ({ ...prev, stabilization: e.target.checked }))}
                        />
                        <label htmlFor="stabilization" className="text-xs font-medium">FlowState</label>
                      </div>
                    </div>
                  </div>

                  {/* Recording Controls */}
                  <div className="text-center space-y-4">
                    {isRecording && (
                      <div className="space-y-2">
                        <div className="text-3xl font-mono text-red-500">
                          {formatTime(recordingTime)}
                        </div>
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          Recording in {captureSettings.resolution}
                        </div>
                      </div>
                    )}

                    {isProcessing && (
                      <div className="space-y-2">
                        <div className="text-lg font-medium text-gradient-electric">
                          Processing 360° Video
                        </div>
                        <Progress value={processingProgress} className="h-2" />
                        <div className="text-sm text-gray-600">
                          {processingProgress}% complete
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-center gap-4">
                      {!isRecording ? (
                        <Button
                          onClick={startRecording}
                          disabled={isProcessing || !selectedDevice}
                          className="electric-bg text-white hover:electric-glow vision-pro-rounded w-16 h-16 rounded-full"
                        >
                          <Camera className="h-8 w-8" />
                        </Button>
                      ) : (
                        <Button
                          onClick={stopRecording}
                          className="bg-red-500 hover:bg-red-600 text-white vision-pro-rounded w-16 h-16 rounded-full"
                        >
                          <Square className="h-8 w-8" />
                        </Button>
                      )}
                      
                      <Button
                        variant="outline"
                        onClick={() => setLivePreview(!livePreview)}
                        disabled={isRecording || isProcessing}
                        className="glass-button electric-border"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        {livePreview ? 'Stop' : 'Start'} Preview
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Camera className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No Camera Selected</h3>
                  <p className="text-gray-500">Connect a 360° camera to start recording</p>
                </div>
              )}
            </TabsContent>

            {/* 360° Preview */}
            <TabsContent value="preview" className="space-y-4">
              <div className="glass-panel p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gradient-electric">360° Live Preview</h3>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant={viewerMode === 'flat' ? 'default' : 'outline'}
                      onClick={() => setViewerMode('flat')}
                      className="text-xs"
                    >
                      <Monitor className="h-3 w-3 mr-1" />
                      Flat
                    </Button>
                    <Button
                      size="sm"
                      variant={viewerMode === '360' ? 'default' : 'outline'}
                      onClick={() => setViewerMode('360')}
                      className="text-xs"
                    >
                      <Sphere className="h-3 w-3 mr-1" />
                      360°
                    </Button>
                    <Button
                      size="sm"
                      variant={viewerMode === 'vr' ? 'default' : 'outline'}
                      onClick={() => setViewerMode('vr')}
                      className="text-xs"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      VR
                    </Button>
                  </div>
                </div>

                {livePreview || currentSession ? (
                  <div className="relative bg-black vision-pro-rounded overflow-hidden" style={{ height: '400px' }}>
                    {/* 360° Preview Simulation */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-black flex items-center justify-center">
                      <div className="text-center text-white">
                        <Sphere className="h-16 w-16 mx-auto mb-4 animate-spin" />
                        <h4 className="text-lg font-medium mb-2">360° {isRecording ? 'Recording' : 'Preview'}</h4>
                        <p className="text-sm opacity-80">
                          {viewerMode === 'flat' && 'Flattened equirectangular view'}
                          {viewerMode === '360' && 'Interactive 360° sphere view'}
                          {viewerMode === 'vr' && 'VR stereo view mode'}
                        </p>
                        {isRecording && (
                          <div className="mt-4 flex items-center justify-center gap-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="font-mono">{formatTime(recordingTime)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 360° Navigation Controls */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="bg-black/50 border-white/30 text-white">
                          <MousePointer className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" className="bg-black/50 border-white/30 text-white">
                          <Hand className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" className="bg-black/50 border-white/30 text-white">
                          <Move3D className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="bg-black/50 border-white/30 text-white">
                          <Download className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" className="bg-black/50 border-white/30 text-white">
                          <Share2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-96 bg-gray-100 vision-pro-rounded flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <Eye className="h-12 w-12 mx-auto mb-3" />
                      <p>Start live preview or begin recording to see 360° view</p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Recording Sessions */}
            <TabsContent value="sessions" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gradient-electric">Capture Sessions</h3>
                <Badge variant="secondary" className="electric-border">
                  {activeSessions.length} sessions
                </Badge>
              </div>

              {activeSessions.length > 0 ? (
                <div className="space-y-3">
                  {activeSessions.map((session) => (
                    <div key={session.id} className="glass-card p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {session.thumbnail && (
                            <img
                              src={session.thumbnail}
                              alt={session.name}
                              className="w-16 h-16 object-cover vision-pro-rounded"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = getImagePath('/placeholder.svg');
                              }}
                            />
                          )}
                          <div>
                            <h4 className="font-medium text-sm mb-1">{session.name}</h4>
                            <div className="flex items-center gap-4 text-xs text-gray-600">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {session.status === 'recording' ? formatTime(recordingTime) : formatTime(session.duration)}
                              </div>
                              <div className="flex items-center gap-1">
                                <Monitor className="h-3 w-3" />
                                {session.quality}
                              </div>
                              <div className="flex items-center gap-1">
                                <Sphere className="h-3 w-3" />
                                {session.format}
                              </div>
                              {session.totalSize > 0 && (
                                <div className="flex items-center gap-1">
                                  <Download className="h-3 w-3" />
                                  {formatFileSize(session.totalSize)}
                                </div>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(session.startTime).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={session.status === 'completed' ? 'default' : session.status === 'recording' ? 'secondary' : 'outline'}
                            className="text-xs"
                          >
                            {session.status === 'recording' && <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-1" />}
                            {session.status}
                          </Badge>
                          
                          {session.status === 'completed' && (
                            <div className="flex items-center gap-1">
                              <Button size="sm" variant="outline" className="glass-button">
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline" className="glass-button">
                                <Download className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline" className="glass-button">
                                <Share2 className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Sphere className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No Recording Sessions</h3>
                  <p className="text-gray-500">Start your first 360° capture to see sessions here</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </div>

      {/* Camera Brand Support */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Camera className="h-6 w-6 text-red-600" />
          </div>
          <h4 className="font-medium text-gradient-electric mb-2">Insta360</h4>
          <p className="text-sm text-gray-600 mb-3">
            X3, ONE RS, ONE X2, GO 3 with FlowState stabilization and TimeShift
          </p>
          <Badge variant="secondary" className="text-xs">Full Support</Badge>
        </div>
        
        <div className="glass-card p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sphere className="h-6 w-6 text-blue-600" />
          </div>
          <h4 className="font-medium text-gradient-electric mb-2">GoPro</h4>
          <p className="text-sm text-gray-600 mb-3">
            MAX, Fusion, Hero11/12 with HyperSmooth and LiveBurst features
          </p>
          <Badge variant="secondary" className="text-xs">Full Support</Badge>
        </div>
        
        <div className="glass-card p-6 text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Globe className="h-6 w-6 text-purple-600" />
          </div>
          <h4 className="font-medium text-gradient-electric mb-2">Other Brands</h4>
          <p className="text-sm text-gray-600 mb-3">
            Ricoh Theta, Samsung Gear, Kandao QooCam with standard controls
          </p>
          <Badge variant="outline" className="text-xs">Basic Support</Badge>
        </div>
      </div>
    </div>
  );
};

export default Camera360Capture;