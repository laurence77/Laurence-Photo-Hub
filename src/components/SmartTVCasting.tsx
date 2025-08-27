// TypeScript global declarations for Chrome Cast and Presentation API
declare global {
  interface Window {
    chrome?: unknown;
    cast?: unknown;
  }
  // Chrome Cast types (minimal, for TS compliance)
  // Use unknown for globals, or import types from @types/chromecast-caf-receiver if available
  var chrome: unknown;
  var cast: unknown;
  interface Navigator {
    presentation?: Presentation;
  }
  interface Presentation {
    defaultRequest?: {
      start: () => Promise<unknown>;
    };
  }
}

import React, { useState, useEffect } from 'react';
import { getImagePath } from '@/lib/utils';
import { Tv, Cast, Play, Pause, SkipBack, SkipForward, Volume2, Settings, Wifi, QrCode } from 'lucide-react';

interface CastDevice {
  id: string;
  name: string;
  type: 'chromecast' | 'airplay' | 'miracast' | 'smart_tv';
  status: 'available' | 'connected' | 'busy';
  capabilities: string[];
  resolution: string;
  location?: string;
}

interface MediaItem {
  id: string;
  type: 'photo' | 'video' | 'slideshow';
  url: string;
  title: string;
  duration?: number;
  metadata?: Record<string, unknown>;
}

export function SmartTVCasting() {
  const [availableDevices, setAvailableDevices] = useState<CastDevice[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<CastDevice | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [currentMedia, setCurrentMedia] = useState<MediaItem | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(50);
  const [slideshowSettings, setSlideshowSettings] = useState<{
    interval: number;
    transition: string;
    showMetadata: boolean;
    loop: boolean;
  }>({
    interval: 5,
    transition: 'fade',
    showMetadata: true,
    loop: true
  });
  const [castQuality, setCastQuality] = useState<'auto' | '720p' | '1080p' | '4k'>('auto');

  useEffect(() => {
    initializeCasting();
    return () => cleanup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initializeCasting = async (): Promise<void> => {
    // Initialize different casting protocols
    await Promise.all([
      initializeChromecast(),
      initializeAirPlay(),
      initializeMiracast(),
      discoverSmartTVs()
    ]);
  };

  const initializeChromecast = async (): Promise<void> => {
    if ('chrome' in window && window.chrome?.cast) {
      try {
        const context = cast.framework.CastContext.getInstance();
        context.setOptions({
          receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
          autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
        });

        // Use unknown for cast, and cast event handler to (evt: Event) => void
        context.addEventListener(
          ((window.cast as any)?.framework?.CastContextEventType?.SESSION_STATE_CHANGED ?? 'SESSION_STATE_CHANGED'),
          (evt: Event) => handleChromecastSessionChange(evt as { sessionState: string })
        );
        
        // Discover Chromecast devices
        const session = context.getCurrentSession();
        if (session) {
          const device: CastDevice = {
            id: session.getSessionId(),
            name: session.getCastDevice().friendlyName,
            type: 'chromecast',
            status: 'connected',
            capabilities: ['video', 'audio', 'photos'],
            resolution: '1080p'
          };
          setConnectedDevice(device);
        }
      } catch (error) {
        console.warn('Chromecast not available:', error);
      }
    }
  };

  const initializeAirPlay = async (): Promise<void> => {
    // AirPlay detection for Safari/iOS
    if ('WebKitPlaybackTargetAvailabilityEvent' in window) {
      try {
        const devices = await discoverAirPlayDevices();
        setAvailableDevices(prev => [...prev, ...devices]);
      } catch (error) {
        console.warn('AirPlay not available:', error);
      }
    }
  };

  const initializeMiracast = async (): Promise<void> => {
    // Miracast/DLNA discovery
    if ('presentation' in navigator && navigator.presentation.defaultRequest) {
      try {
        const devices = await discoverMiracastDevices();
        setAvailableDevices(prev => [...prev, ...devices]);
      } catch (error) {
        console.warn('Miracast not available:', error);
      }
    }
  };

  const discoverSmartTVs = async (): Promise<void> => {
    // Discover smart TVs via network scanning
    try {
      const devices = await scanNetworkForTVs();
      setAvailableDevices(prev => [...prev, ...devices]);
    } catch (error) {
      console.warn('Smart TV discovery failed:', error);
    }
  };

  const scanNetworkForTVs = async (): Promise<CastDevice[]> => {
    // Simulate network scanning for smart TVs
    // In production, this would use SSDP, mDNS, or WebRTC for device discovery
    const mockDevices: CastDevice[] = [
      {
        id: 'samsung-tv-1',
        name: 'Samsung Smart TV (Living Room)',
        type: 'smart_tv',
        status: 'available',
        capabilities: ['video', 'audio', 'photos', 'slideshow'],
        resolution: '4k',
        location: 'Living Room'
      },
      {
        id: 'lg-tv-1',
        name: 'LG OLED TV (Bedroom)',
        type: 'smart_tv',
        status: 'available',
        capabilities: ['video', 'audio', 'photos'],
        resolution: '4k',
        location: 'Bedroom'
      },
      {
        id: 'sony-tv-1',
        name: 'Sony Android TV (Office)',
        type: 'smart_tv',
        status: 'busy',
        capabilities: ['video', 'audio', 'photos', 'slideshow'],
        resolution: '1080p',
        location: 'Office'
      }
    ];

    return mockDevices;
  };

  const discoverAirPlayDevices = async (): Promise<CastDevice[]> => {
    // Mock AirPlay devices
    return [
      {
        id: 'apple-tv-1',
        name: 'Apple TV (Living Room)',
        type: 'airplay',
        status: 'available',
        capabilities: ['video', 'audio', 'photos', 'slideshow'],
        resolution: '4k'
      }
    ];
  };

  const discoverMiracastDevices = async (): Promise<CastDevice[]> => {
    // Mock Miracast devices
    return [
      {
        id: 'miracast-1',
        name: 'Wireless Display Adapter',
        type: 'miracast',
        status: 'available',
        capabilities: ['screen_mirror', 'video', 'photos'],
        resolution: '1080p'
      }
    ];
  };

  const handleChromecastSessionChange = (event: { sessionState: string }) => {
    const session = event.sessionState;
    if (session === cast.framework.SessionState.SESSION_STARTED) {
      const castSession = cast.framework.CastContext.getInstance().getCurrentSession();
      if (castSession) {
        const device: CastDevice = {
          id: castSession.getSessionId(),
          name: castSession.getCastDevice().friendlyName,
          type: 'chromecast',
          status: 'connected',
          capabilities: ['video', 'audio', 'photos'],
          resolution: '1080p'
        };
        setConnectedDevice(device);
      }
    } else if (session === cast.framework.SessionState.SESSION_ENDED) {
      setConnectedDevice(null);
      setCurrentMedia(null);
      setIsPlaying(false);
    }
  };

  const scanForDevices = async (): Promise<void> => {
    setIsScanning(true);
    try {
      await initializeCasting();
    } finally {
      setIsScanning(false);
    }
  };

  const connectToDevice = async (device: CastDevice): Promise<void> => {
    if (device.status === 'busy') return;

    try {
      switch (device.type) {
        case 'chromecast': {
          await connectToChromecast(device);
          break;
        }
        case 'airplay': {
          await connectToAirPlay(device);
          break;
        }
        case 'smart_tv': {
          await connectToSmartTV(device);
          break;
        }
        case 'miracast': {
          await connectToMiracast(device);
          break;
        }
      }
      setConnectedDevice({ ...device, status: 'connected' });
    } catch (error) {
      console.error('Failed to connect to device:', error);
    }
  };

  const connectToChromecast = async (device: CastDevice): Promise<void> => {
    if ('chrome' in window && window.chrome?.cast) {
      const context = cast.framework.CastContext.getInstance();
      await context.requestSession();
    }
  };

  const connectToAirPlay = async (device: CastDevice): Promise<void> => {
    // AirPlay connection logic
    console.log('Connecting to AirPlay device:', device.name);
  };

  const connectToSmartTV = async (device: CastDevice): Promise<void> => {
    // Smart TV connection (could use WebSocket, REST API, or proprietary protocol)
    console.log('Connecting to Smart TV:', device.name);
  };

  const connectToMiracast = async (device: CastDevice): Promise<void> => {
    // Miracast connection
    if (navigator.presentation?.defaultRequest) {
      try {
        const connection = await navigator.presentation.defaultRequest.start();
        console.log('Connected to Miracast device:', device.name);
      } catch (error) {
        throw new Error('Failed to start Miracast session');
      }
    }
  };

  const castMedia = async (media: MediaItem): Promise<void> => {
    if (!connectedDevice) return;

    try {
      switch (connectedDevice.type) {
        case 'chromecast':
          await castToChromecast(media);
          break;
        case 'airplay':
          await castToAirPlay(media);
          break;
        case 'smart_tv':
          await castToSmartTV(media);
          break;
        case 'miracast':
          await castToMiracast(media);
          break;
      }
      
      setCurrentMedia(media);
      setIsPlaying(true);
    } catch (error) {
      console.error('Failed to cast media:', error);
    }
  };

  const castToChromecast = async (media: MediaItem): Promise<void> => {
    const context = (window as any).cast.framework.CastContext.getInstance();
    const session = context.getCurrentSession();
    if (session) {
      const mediaInfo = new (window as any).chrome.cast.media.MediaInfo(media.url, media.type === 'video' ? 'video/mp4' : 'image/jpeg');
      mediaInfo.metadata = new (window as any).chrome.cast.media.GenericMediaMetadata();
      mediaInfo.metadata.title = media.title;
      const request = new (window as any).chrome.cast.media.LoadRequest(mediaInfo);
      await session.loadMedia(request);
    }
  };

  const castToAirPlay = async (media: MediaItem): Promise<void> => {
    // AirPlay casting implementation
    console.log('Casting to AirPlay:', media.title);
  };

  const castToSmartTV = async (media: MediaItem): Promise<void> => {
    // Smart TV casting implementation
    console.log('Casting to Smart TV:', media.title);
  };

  const castToMiracast = async (media: MediaItem): Promise<void> => {
    // Miracast casting implementation
    console.log('Casting to Miracast:', media.title);
  };

  const startSlideshow = async (photos: MediaItem[]): Promise<void> => {
    if (!connectedDevice) return;

    const slideshow: MediaItem = {
      id: 'slideshow-' + Date.now(),
      type: 'slideshow',
      url: '',
      title: `Photo Slideshow (${photos.length} photos)`,
      metadata: {
        photos,
        settings: slideshowSettings
      }
    };

    await castMedia(slideshow);
  };

  const controlPlayback = async (action: 'play' | 'pause' | 'stop' | 'next' | 'previous'): Promise<void> => {
    if (!connectedDevice || !currentMedia) return;

    try {
      switch (connectedDevice.type) {
        case 'chromecast': {
          await controlChromecastPlayback(action);
          break;
        }
        default: {
          // Handle other device types
          break;
        }
      }
      if (action === 'play') setIsPlaying(true);
      if (action === 'pause' || action === 'stop') setIsPlaying(false);
    } catch (error) {
      console.error('Playback control failed:', error);
    }
  };

  const controlChromecastPlayback = async (action: string): Promise<void> => {
    const context = (window as any).cast.framework.CastContext.getInstance();
    const session = context.getCurrentSession();
    if (session) {
      const media = session.getMediaSession();
      if (media) {
        switch (action) {
          case 'play':
            await media.play(new (window as any).chrome.cast.media.PlayRequest());
            break;
          case 'pause':
            await media.pause(new (window as any).chrome.cast.media.PauseRequest());
            break;
          case 'stop':
            await media.stop(new (window as any).chrome.cast.media.StopRequest());
            break;
        }
      }
    }
  };

  const adjustVolume = async (newVolume: number): Promise<void> => {
    if (!connectedDevice) return;

    setVolume(newVolume);
    try {
      switch (connectedDevice.type) {
        case 'chromecast': {
          const context = (window.cast as any)?.framework?.CastContext.getInstance();
          const session = context?.getCurrentSession();
          if (session) {
            const volumeRequest = new (window.chrome as any).cast.VolumeRequest();
            volumeRequest.level = newVolume / 100;
            await session.setVolume(volumeRequest);
          }
          break;
        }
        default: {
          // Handle other device types
          break;
        }
      }
    } catch (error) {
      console.error('Volume control failed:', error);
    }
  };

  const disconnect = async (): Promise<void> => {
    if (!connectedDevice) return;

    try {
      switch (connectedDevice.type) {
        case 'chromecast': {
          const context = (window as any).cast.framework.CastContext.getInstance();
          const session = context.getCurrentSession();
          if (session) {
            await session.endSession(true);
          }
          break;
        }
        default: {
          // Handle other device types
          break;
        }
      }
      setConnectedDevice(null);
      setCurrentMedia(null);
      setIsPlaying(false);
    } catch (error) {
      console.error('Disconnect failed:', error);
    }
  };

  const generateQRCode = (): string => {
    // Generate QR code for easy mobile connection
    const qrData = {
      type: 'cast_session',
      deviceId: connectedDevice?.id,
      sessionId: Date.now().toString()
    };
    return JSON.stringify(qrData);
  };

  const cleanup = (): void => {
    // Cleanup event listeners and sessions
    if (connectedDevice) {
      disconnect();
    }
  };

  // Mock photos for demo
  const mockPhotos: MediaItem[] = [
    { id: '1', type: 'photo', url: getImagePath('/uploads/photo1.jpg'), title: 'Wedding Ceremony' },
    { id: '2', type: 'photo', url: getImagePath('/uploads/photo2.jpg'), title: 'Reception Dance' },
    { id: '3', type: 'photo', url: getImagePath('/uploads/photo3.jpg'), title: 'Family Portrait' }
  ];

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Smart TV Casting</h3>
        <div className="flex items-center space-x-3">
          <button
            onClick={scanForDevices}
            disabled={isScanning}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 text-blue-300 rounded-xl border border-blue-500/30 hover:bg-blue-500/30 transition-colors disabled:opacity-50"
          >
            <Wifi size={18} />
            <span>{isScanning ? 'Scanning...' : 'Scan Devices'}</span>
          </button>
        </div>
      </div>

      {/* Device Selection */}
      {!connectedDevice && (
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-white">Available Devices</h4>
          
          {availableDevices.length === 0 && !isScanning ? (
            <div className="text-center py-8">
              <Tv className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-400">No casting devices found</p>
              <button
                onClick={scanForDevices}
                className="mt-4 px-4 py-2 bg-blue-500/20 text-blue-300 rounded-xl hover:bg-blue-500/30 transition-colors"
              >
                Scan for Devices
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableDevices.map((device) => (
                <div
                  key={device.id}
                  className={`bg-black/20 rounded-xl p-4 border transition-colors cursor-pointer ${
                    device.status === 'busy' 
                      ? 'border-red-500/30 opacity-60 cursor-not-allowed' 
                      : 'border-white/20 hover:border-blue-500/50'
                  }`}
                  onClick={() => device.status !== 'busy' && connectToDevice(device)}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      device.type === 'chromecast' ? 'bg-orange-500/20' :
                      device.type === 'airplay' ? 'bg-blue-500/20' :
                      device.type === 'smart_tv' ? 'bg-purple-500/20' :
                      'bg-gray-500/20'
                    }`}>
                      <Cast size={24} className={
                        device.type === 'chromecast' ? 'text-orange-400' :
                        device.type === 'airplay' ? 'text-blue-400' :
                        device.type === 'smart_tv' ? 'text-purple-400' :
                        'text-gray-400'
                      } />
                    </div>
                    <div>
                      <h5 className="font-medium text-white">{device.name}</h5>
                      <p className="text-sm text-gray-400 capitalize">
                        {device.type.replace('_', ' ')} • {device.resolution}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {device.capabilities.map((cap) => (
                        <span
                          key={cap}
                          className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300"
                        >
                          {cap}
                        </span>
                      ))}
                    </div>
                    <div className={`w-2 h-2 rounded-full ${
                      device.status === 'available' ? 'bg-green-400' :
                      device.status === 'busy' ? 'bg-red-400' :
                      'bg-blue-400'
                    }`} />
                  </div>
                  
                  {device.location && (
                    <p className="text-xs text-gray-500 mt-2">{device.location}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Connected Device Controls */}
      {connectedDevice && (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-green-500/10 rounded-xl border border-green-500/20">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              <div>
                <p className="font-medium text-white">Connected to {connectedDevice.name}</p>
                <p className="text-sm text-green-300">{connectedDevice.resolution} • {connectedDevice.type}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {/* Generate QR code for mobile control */}}
                className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                title="Show QR code for mobile control"
                aria-label="Show QR code for mobile control"
              >
                <QrCode size={18} className="text-gray-300" />
              </button>
              <button
                onClick={disconnect}
                className="px-3 py-1 bg-red-500/20 text-red-300 rounded-lg text-sm hover:bg-red-500/30 transition-colors"
              >
                Disconnect
              </button>
            </div>
          </div>

          {/* Media Controls */}
          <div className="bg-black/20 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-white">Media Controls</h4>
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-300">Quality:</label>
                <select
                  value={castQuality}
                  onChange={(e) => setCastQuality(e.target.value as 'auto' | '720p' | '1080p' | '4k')}
                  className="bg-white/10 rounded-lg px-2 py-1 text-sm text-white border border-white/20"
                  title="Select casting quality"
                  aria-label="Casting quality"
                >
                  <option value="auto">Auto</option>
                  <option value="720p">720p</option>
                  <option value="1080p">1080p</option>
                  <option value="4k">4K</option>
                </select>
              </div>
            </div>

            {currentMedia ? (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="font-medium text-white">{currentMedia.title}</p>
                  <p className="text-sm text-gray-400 capitalize">Now playing • {currentMedia.type}</p>
                </div>

                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={() => controlPlayback('previous')}
                    className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                    title="Previous"
                    aria-label="Previous"
                  >
                    <SkipBack size={20} className="text-white" />
                  </button>
                  <button
                    onClick={() => controlPlayback(isPlaying ? 'pause' : 'play')}
                    className="p-3 bg-blue-500/20 rounded-xl hover:bg-blue-500/30 transition-colors"
                    title={isPlaying ? 'Pause' : 'Play'}
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? (
                      <Pause size={24} className="text-blue-300" />
                    ) : (
                      <Play size={24} className="text-blue-300" />
                    )}
                  </button>
                  <button
                    onClick={() => controlPlayback('next')}
                    className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                    title="Next"
                    aria-label="Next"
                  >
                    <SkipForward size={20} className="text-white" />
                  </button>
                </div>

                <div className="flex items-center space-x-3">
                  <Volume2 size={16} className="text-gray-300" />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => adjustVolume(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-white/10 rounded-lg appearance-none slider"
                    title="Adjust volume"
                    aria-label="Volume slider"
                  />
                  <span className="text-sm text-gray-300 w-10">{volume}%</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-400 mb-4">No media playing</p>
                <button
                  onClick={() => startSlideshow(mockPhotos)}
                  className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-xl hover:bg-purple-500/30 transition-colors"
                >
                  Start Photo Slideshow
                </button>
              </div>
            )}
          </div>

          {/* Slideshow Settings */}
          <div className="bg-black/20 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-4">
              <Settings size={18} className="text-gray-300" />
              <h4 className="font-medium text-white">Slideshow Settings</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Interval (seconds)</label>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={slideshowSettings.interval}
                  onChange={(e) => setSlideshowSettings(prev => ({ ...prev, interval: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none slider"
                  title="Slideshow interval in seconds"
                  aria-label="Slideshow interval"
                />
                <div className="text-sm text-gray-400 mt-1">{slideshowSettings.interval}s per photo</div>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Transition</label>
                <select
                  value={slideshowSettings.transition}
                  onChange={(e) => setSlideshowSettings(prev => ({ ...prev, transition: e.target.value }))}
                  className="w-full bg-white/10 rounded-lg px-3 py-2 text-white border border-white/20"
                  title="Select slideshow transition style"
                  aria-label="Slideshow transition"
                >
                  <option value="fade">Fade</option>
                  <option value="slide">Slide</option>
                  <option value="zoom">Zoom</option>
                  <option value="none">None</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showMetadata"
                  checked={slideshowSettings.showMetadata}
                  onChange={(e) => setSlideshowSettings(prev => ({ ...prev, showMetadata: e.target.checked }))}
                  className="rounded"
                  title="Show photo details in slideshow"
                  aria-label="Show photo details"
                />
                <label htmlFor="showMetadata" className="text-sm text-gray-300">Show photo details</label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="loop"
                  checked={slideshowSettings.loop}
                  onChange={(e) => setSlideshowSettings(prev => ({ ...prev, loop: e.target.checked }))}
                  className="rounded"
                  title="Loop slideshow"
                  aria-label="Loop slideshow"
                />
                <label htmlFor="loop" className="text-sm text-gray-300">Loop slideshow</label>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {mockPhotos.map((photo) => (
              <button
                key={photo.id}
                onClick={() => castMedia(photo)}
                className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-left"
              >
                <div className="text-sm font-medium text-white truncate">{photo.title}</div>
                <div className="text-xs text-gray-400 capitalize">{photo.type}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}