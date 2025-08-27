import React, { useState, useEffect } from 'react';
import { 
  Music, 
  Users, 
  Camera, 
  Share2, 
  MapPin, 
  Clock, 
  Zap, 
  Globe, 
  Shield, 
  TrendingUp,
  Smartphone,
  Wifi,
  QrCode,
  Heart,
  Eye,
  Star,
  Settings,
  Volume2,
  Radio,
  Megaphone
} from 'lucide-react';

interface FestivalEvent {
  id: string;
  name: string;
  type: 'music_festival' | 'food_festival' | 'art_festival' | 'cultural_festival' | 'sports_festival';
  startDate: Date;
  endDate: Date;
  location: {
    name: string;
    coordinates: { lat: number; lng: number };
    venue: string;
  };
  expectedAttendees: number;
  stages: Stage[];
  features: FestivalFeature[];
  socialSettings: SocialSettings;
  broadcastMode: boolean;
  publicAccess: boolean;
}

interface Stage {
  id: string;
  name: string;
  type: 'main' | 'secondary' | 'acoustic' | 'workshop' | 'food' | 'art';
  capacity: number;
  schedule: StageEvent[];
  liveStream: boolean;
  photoWall: boolean;
}

interface StageEvent {
  id: string;
  name: string;
  performer: string;
  startTime: Date;
  endTime: Date;
  genre?: string;
  description: string;
}

interface FestivalFeature {
  id: string;
  name: string;
  type: 'live_streaming' | 'social_wall' | 'crowd_sourcing' | 'real_time_highlights' | 'qr_sharing';
  enabled: boolean;
  settings: { [key: string]: any };
}

interface SocialSettings {
  hashtagRequired: boolean;
  mainHashtag: string;
  additionalHashtags: string[];
  moderationLevel: 'strict' | 'moderate' | 'open';
  autoApproval: boolean;
  influencerMode: boolean;
  geotagging: boolean;
}

export function PublicFestivalMode() {
  const [currentEvent, setCurrentEvent] = useState<FestivalEvent | null>(null);
  const [festivalStats, setFestivalStats] = useState({
    totalPhotos: 0,
    activeUsers: 0,
    socialShares: 0,
    liveViewers: 0,
    hashtagReach: 0
  });
  const [activeMode, setActiveMode] = useState<'setup' | 'live' | 'post_event'>('setup');
  const [crowdSourcedContent, setCrowdSourcedContent] = useState<any[]>([]);
  const [broadcastSettings, setBroadcastSettings] = useState({
    enableLiveStream: true,
    enableSocialWall: true,
    enableCrowdPhotos: true,
    contentModeration: 'moderate' as 'strict' | 'moderate' | 'open',
    maxUploadsPerUser: 50,
    autoHighlights: true
  });

  useEffect(() => {
    initializeFestivalEvent();
    
    if (activeMode === 'live') {
      const interval = setInterval(() => {
        updateRealTimeStats();
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [activeMode]);

  const initializeFestivalEvent = () => {
    const mockEvent: FestivalEvent = {
      id: 'summer-music-fest-2024',
      name: 'Summer Music Festival 2024',
      type: 'music_festival',
      startDate: new Date('2024-07-15T10:00:00'),
      endDate: new Date('2024-07-17T23:00:00'),
      location: {
        name: 'Golden Gate Park',
        coordinates: { lat: 37.7694, lng: -122.4862 },
        venue: 'Main Meadow & Surrounding Stages'
      },
      expectedAttendees: 50000,
      stages: [
        {
          id: 'main-stage',
          name: 'Main Stage',
          type: 'main',
          capacity: 15000,
          schedule: [
            {
              id: 'headliner-1',
              name: 'Summer Vibes Concert',
              performer: 'The Electric Waves',
              startTime: new Date('2024-07-15T20:00:00'),
              endTime: new Date('2024-07-15T22:00:00'),
              genre: 'Electronic',
              description: 'High-energy electronic music set'
            }
          ],
          liveStream: true,
          photoWall: true
        },
        {
          id: 'acoustic-stage',
          name: 'Acoustic Garden',
          type: 'acoustic',
          capacity: 3000,
          schedule: [
            {
              id: 'acoustic-1',
              name: 'Sunset Acoustic Session',
              performer: 'Sarah & The Storytellers',
              startTime: new Date('2024-07-15T18:00:00'),
              endTime: new Date('2024-07-15T19:30:00'),
              genre: 'Folk',
              description: 'Intimate acoustic performance'
            }
          ],
          liveStream: false,
          photoWall: true
        }
      ],
      features: [
        {
          id: 'live-stream',
          name: 'Multi-Stage Live Streaming',
          type: 'live_streaming',
          enabled: true,
          settings: { quality: '4K', maxViewers: 100000 }
        },
        {
          id: 'social-wall',
          name: 'Festival Social Wall',
          type: 'social_wall',
          enabled: true,
          settings: { autoRefresh: 10, maxPosts: 50 }
        },
        {
          id: 'crowd-photos',
          name: 'Crowd-Sourced Photography',
          type: 'crowd_sourcing',
          enabled: true,
          settings: { maxUploads: 10, requireHashtag: true }
        }
      ],
      socialSettings: {
        hashtagRequired: true,
        mainHashtag: '#SummerMusicFest2024',
        additionalHashtags: ['#LiveMusic', '#Festival', '#SanFrancisco'],
        moderationLevel: 'moderate',
        autoApproval: false,
        influencerMode: true,
        geotagging: true
      },
      broadcastMode: true,
      publicAccess: true
    };

    setCurrentEvent(mockEvent);
    
    // Initialize stats based on mode
    if (activeMode === 'live') {
      setFestivalStats({
        totalPhotos: 1247,
        activeUsers: 892,
        socialShares: 3456,
        liveViewers: 15678,
        hashtagReach: 89234
      });
    }
  };

  const updateRealTimeStats = () => {
    setFestivalStats(prev => ({
      totalPhotos: prev.totalPhotos + Math.floor(Math.random() * 15) + 5,
      activeUsers: prev.activeUsers + Math.floor(Math.random() * 10) - 5,
      socialShares: prev.socialShares + Math.floor(Math.random() * 20) + 10,
      liveViewers: prev.liveViewers + Math.floor(Math.random() * 100) - 50,
      hashtagReach: prev.hashtagReach + Math.floor(Math.random() * 200) + 50
    }));
  };

  const getStageIcon = (type: string) => {
    switch (type) {
      case 'main': return '🎤';
      case 'acoustic': return '🎸';
      case 'food': return '🍕';
      case 'art': return '🎨';
      case 'workshop': return '🛠️';
      default: return '🎵';
    }
  };

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'setup': return 'bg-blue-500/20 text-blue-300';
      case 'live': return 'bg-red-500/20 text-red-300';
      case 'post_event': return 'bg-green-500/20 text-green-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const toggleFeature = (featureId: string) => {
    if (!currentEvent) return;
    
    const updatedFeatures = currentEvent.features.map(feature =>
      feature.id === featureId ? { ...feature, enabled: !feature.enabled } : feature
    );
    
    setCurrentEvent({ ...currentEvent, features: updatedFeatures });
  };

  const activateLiveMode = () => {
    setActiveMode('live');
    if (currentEvent) {
      setCurrentEvent({ ...currentEvent, broadcastMode: true });
    }
  };

  if (!currentEvent) return null;

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
          <Music className="text-purple-400" />
          <span>Public Festival Mode</span>
        </h3>
        <div className="flex items-center space-x-3">
          <div className={`px-3 py-1 rounded-xl text-sm font-medium ${getModeColor(activeMode)}`}>
            {activeMode.replace('_', ' ').toUpperCase()}
          </div>
          {activeMode === 'setup' && (
            <button
              onClick={activateLiveMode}
              className="px-4 py-2 bg-red-500/20 text-red-300 rounded-xl hover:bg-red-500/30 transition-colors flex items-center space-x-2"
            >
              <Radio className="w-4 h-4" />
              <span>Go Live</span>
            </button>
          )}
        </div>
      </div>

      {/* Festival Overview */}
      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6 mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h4 className="text-2xl font-bold text-white mb-2">{currentEvent.name}</h4>
            <div className="flex items-center space-x-4 text-gray-300">
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{currentEvent.location.name}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{currentEvent.expectedAttendees.toLocaleString()} expected</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{currentEvent.startDate.toLocaleDateString()} - {currentEvent.endDate.toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <div className="text-4xl">{currentEvent.type === 'music_festival' ? '🎵' : '🎪'}</div>
        </div>

        {/* Live Stats */}
        {activeMode === 'live' && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-black/20 rounded-xl p-4 text-center">
              <Camera className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <p className="text-lg font-bold text-white">{festivalStats.totalPhotos.toLocaleString()}</p>
              <p className="text-xs text-gray-300">Photos</p>
            </div>
            <div className="bg-black/20 rounded-xl p-4 text-center">
              <Users className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <p className="text-lg font-bold text-white">{festivalStats.activeUsers.toLocaleString()}</p>
              <p className="text-xs text-gray-300">Active Users</p>
            </div>
            <div className="bg-black/20 rounded-xl p-4 text-center">
              <Share2 className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <p className="text-lg font-bold text-white">{festivalStats.socialShares.toLocaleString()}</p>
              <p className="text-xs text-gray-300">Shares</p>
            </div>
            <div className="bg-black/20 rounded-xl p-4 text-center">
              <Eye className="w-6 h-6 text-red-400 mx-auto mb-2" />
              <p className="text-lg font-bold text-white">{festivalStats.liveViewers.toLocaleString()}</p>
              <p className="text-xs text-gray-300">Live Viewers</p>
            </div>
            <div className="bg-black/20 rounded-xl p-4 text-center">
              <TrendingUp className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <p className="text-lg font-bold text-white">{festivalStats.hashtagReach.toLocaleString()}</p>
              <p className="text-xs text-gray-300">Hashtag Reach</p>
            </div>
          </div>
        )}
      </div>

      {/* Festival Features */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Stages */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-white flex items-center space-x-2">
            <Settings className="text-blue-400" />
            <span>Festival Stages</span>
          </h4>
          <div className="space-y-3">
            {currentEvent.stages.map((stage) => (
              <div key={stage.id} className="bg-black/20 rounded-xl p-4 border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getStageIcon(stage.type)}</span>
                    <div>
                      <h5 className="font-medium text-white">{stage.name}</h5>
                      <p className="text-sm text-gray-400">Capacity: {stage.capacity.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {stage.liveStream && (
                      <div className="flex items-center space-x-1 px-2 py-1 bg-red-500/20 text-red-300 rounded text-xs">
                        <Radio className="w-3 h-3" />
                        <span>Live</span>
                      </div>
                    )}
                    {stage.photoWall && (
                      <div className="flex items-center space-x-1 px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">
                        <Camera className="w-3 h-3" />
                        <span>Photos</span>
                      </div>
                    )}
                  </div>
                </div>

                {stage.schedule.length > 0 && (
                  <div className="border-t border-white/10 pt-3">
                    <p className="text-xs text-gray-400 mb-2">Current/Next Event:</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-white">{stage.schedule[0].name}</p>
                        <p className="text-xs text-gray-400">{stage.schedule[0].performer}</p>
                      </div>
                      <div className="text-xs text-gray-400">
                        {stage.schedule[0].startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Festival Features */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-white flex items-center space-x-2">
            <Zap className="text-yellow-400" />
            <span>Festival Features</span>
          </h4>
          <div className="space-y-3">
            {currentEvent.features.map((feature) => (
              <div key={feature.id} className="bg-black/20 rounded-xl p-4 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {feature.type === 'live_streaming' && <Radio className="w-4 h-4 text-red-400" />}
                    {feature.type === 'social_wall' && <Globe className="w-4 h-4 text-blue-400" />}
                    {feature.type === 'crowd_sourcing' && <Users className="w-4 h-4 text-green-400" />}
                    {feature.type === 'real_time_highlights' && <Star className="w-4 h-4 text-yellow-400" />}
                    {feature.type === 'qr_sharing' && <QrCode className="w-4 h-4 text-purple-400" />}
                    <h5 className="font-medium text-white">{feature.name}</h5>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={feature.enabled}
                      onChange={() => toggleFeature(feature.id)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="text-xs text-gray-400">
                  {Object.entries(feature.settings).map(([key, value]) => (
                    <span key={key} className="mr-3">
                      {key}: {String(value)}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Social Settings */}
      <div className="bg-gradient-to-r from-blue-500/10 to-green-500/10 border border-blue-500/20 rounded-xl p-6 mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <Megaphone className="text-blue-400" />
          <h4 className="text-lg font-medium text-white">Social & Broadcasting Settings</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Main Hashtag</span>
              <span className="text-sm font-medium text-blue-300">{currentEvent.socialSettings.mainHashtag}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Moderation Level</span>
              <span className={`px-2 py-1 rounded text-xs ${
                currentEvent.socialSettings.moderationLevel === 'strict' ? 'bg-red-500/20 text-red-300' :
                currentEvent.socialSettings.moderationLevel === 'moderate' ? 'bg-yellow-500/20 text-yellow-300' :
                'bg-green-500/20 text-green-300'
              }`}>
                {currentEvent.socialSettings.moderationLevel}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Auto Approval</span>
              <div className={`w-3 h-3 rounded-full ${currentEvent.socialSettings.autoApproval ? 'bg-green-400' : 'bg-gray-400'}`} />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Geotagging</span>
              <div className={`w-3 h-3 rounded-full ${currentEvent.socialSettings.geotagging ? 'bg-green-400' : 'bg-gray-400'}`} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Influencer Mode</span>
              <div className={`w-3 h-3 rounded-full ${currentEvent.socialSettings.influencerMode ? 'bg-green-400' : 'bg-gray-400'}`} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Public Access</span>
              <div className={`w-3 h-3 rounded-full ${currentEvent.publicAccess ? 'bg-green-400' : 'bg-gray-400'}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button className="flex items-center justify-center space-x-2 p-4 bg-blue-500/20 text-blue-300 rounded-xl hover:bg-blue-500/30 transition-colors">
          <QrCode className="w-4 h-4" />
          <span>Share QR Code</span>
        </button>
        
        <button className="flex items-center justify-center space-x-2 p-4 bg-green-500/20 text-green-300 rounded-xl hover:bg-green-500/30 transition-colors">
          <Wifi className="w-4 h-4" />
          <span>WiFi Setup</span>
        </button>
        
        <button className="flex items-center justify-center space-x-2 p-4 bg-purple-500/20 text-purple-300 rounded-xl hover:bg-purple-500/30 transition-colors">
          <Smartphone className="w-4 h-4" />
          <span>Mobile App</span>
        </button>
        
        <button className="flex items-center justify-center space-x-2 p-4 bg-yellow-500/20 text-yellow-300 rounded-xl hover:bg-yellow-500/30 transition-colors">
          <Volume2 className="w-4 h-4" />
          <span>Announcements</span>
        </button>
      </div>

      {activeMode === 'live' && (
        <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse" />
            <span className="text-red-300 font-medium">Festival is LIVE</span>
          </div>
          <p className="text-sm text-gray-300 mt-1">
            Real-time monitoring active. All festival features are broadcasting to {festivalStats.liveViewers.toLocaleString()} viewers.
          </p>
        </div>
      )}
    </div>
  );
}