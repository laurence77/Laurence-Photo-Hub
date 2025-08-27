import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Camera,
  Clock,
  MapPin,
  Heart,
  Eye,
  Download,
  Share2,
  Zap,
  Target,
  Activity,
  Calendar,
  Thermometer,
  Volume2,
  Signal,
  Gauge,
  Award,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Filter
} from 'lucide-react';

interface EventMetrics {
  eventId: string;
  eventName: string;
  eventType: string;
  date: Date;
  duration: number; // minutes
  guestCount: number;
  photosUploaded: number;
  totalViews: number;
  totalDownloads: number;
  totalShares: number;
  averageRating: number;
  engagementScore: number;
  heatmapData: HeatmapPoint[];
  peakActivity: { time: Date; intensity: number }[];
  guestSentiment: 'positive' | 'neutral' | 'negative';
  keyMoments: KeyMoment[];
}

interface HeatmapPoint {
  x: number;
  y: number;
  intensity: number;
  timestamp: Date;
  activity: 'photo_taken' | 'photo_viewed' | 'photo_shared' | 'guest_interaction';
}

interface KeyMoment {
  id: string;
  timestamp: Date;
  type: 'peak_activity' | 'viral_photo' | 'group_photo' | 'special_moment';
  description: string;
  metrics: {
    photos: number;
    engagement: number;
    views: number;
  };
}

interface LocationHeatmap {
  zone: string;
  activity: number;
  photos: number;
  engagement: number;
  coordinates: { x: number; y: number };
}

interface TimelineData {
  timestamp: Date;
  photos: number;
  views: number;
  engagement: number;
  guestActivity: number;
}

const EventIntelligence = () => {
  const [selectedEvent, setSelectedEvent] = useState('wedding_001');
  const [timeRange, setTimeRange] = useState('all');
  const [eventMetrics, setEventMetrics] = useState<EventMetrics | null>(null);
  const [locationHeatmap, setLocationHeatmap] = useState<LocationHeatmap[]>([]);
  const [timeline, setTimeline] = useState<TimelineData[]>([]);
  const [selectedView, setSelectedView] = useState<'overview' | 'heatmap' | 'timeline' | 'insights'>('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const mockEventMetrics: EventMetrics = {
    eventId: 'wedding_001',
    eventName: 'Sarah & Michael\'s Wedding',
    eventType: 'Wedding',
    date: new Date('2024-08-15T14:00:00'),
    duration: 480, // 8 hours
    guestCount: 156,
    photosUploaded: 1247,
    totalViews: 15690,
    totalDownloads: 3420,
    totalShares: 892,
    averageRating: 4.8,
    engagementScore: 94,
    heatmapData: [],
    peakActivity: [
      { time: new Date('2024-08-15T16:30:00'), intensity: 95 }, // Ceremony
      { time: new Date('2024-08-15T18:45:00'), intensity: 87 }, // Cocktail hour
      { time: new Date('2024-08-15T20:15:00'), intensity: 92 }, // First dance
      { time: new Date('2024-08-15T21:30:00'), intensity: 85 }  // Party time
    ],
    guestSentiment: 'positive',
    keyMoments: [
      {
        id: '1',
        timestamp: new Date('2024-08-15T16:30:00'),
        type: 'peak_activity',
        description: 'Ceremony Peak - First Kiss',
        metrics: { photos: 89, engagement: 95, views: 2340 }
      },
      {
        id: '2',
        timestamp: new Date('2024-08-15T17:45:00'),
        type: 'viral_photo',
        description: 'Group Photo Goes Viral',
        metrics: { photos: 1, engagement: 98, views: 5670 }
      },
      {
        id: '3',
        timestamp: new Date('2024-08-15T20:15:00'),
        type: 'special_moment',
        description: 'First Dance Magic',
        metrics: { photos: 156, engagement: 92, views: 3890 }
      }
    ]
  };

  const mockLocationHeatmap: LocationHeatmap[] = [
    { zone: 'Ceremony Area', activity: 95, photos: 387, engagement: 92, coordinates: { x: 40, y: 60 } },
    { zone: 'Reception Hall', activity: 88, photos: 456, engagement: 85, coordinates: { x: 70, y: 40 } },
    { zone: 'Dance Floor', activity: 92, photos: 234, engagement: 96, coordinates: { x: 75, y: 65 } },
    { zone: 'Photo Booth', activity: 76, photos: 123, engagement: 78, coordinates: { x: 20, y: 30 } },
    { zone: 'Garden Area', activity: 65, photos: 47, engagement: 82, coordinates: { x: 15, y: 80 } },
    { zone: 'Bar Area', activity: 58, photos: 89, engagement: 71, coordinates: { x: 85, y: 25 } }
  ];

  const mockTimeline: TimelineData[] = [
    { timestamp: new Date('2024-08-15T14:00:00'), photos: 12, views: 45, engagement: 65, guestActivity: 30 },
    { timestamp: new Date('2024-08-15T15:00:00'), photos: 34, views: 156, engagement: 72, guestActivity: 45 },
    { timestamp: new Date('2024-08-15T16:00:00'), photos: 89, views: 890, engagement: 85, guestActivity: 78 },
    { timestamp: new Date('2024-08-15T17:00:00'), photos: 156, views: 2340, engagement: 95, guestActivity: 92 },
    { timestamp: new Date('2024-08-15T18:00:00'), photos: 234, views: 1890, engagement: 87, guestActivity: 85 },
    { timestamp: new Date('2024-08-15T19:00:00'), photos: 198, views: 1456, engagement: 82, guestActivity: 88 },
    { timestamp: new Date('2024-08-15T20:00:00'), photos: 267, views: 2890, engagement: 92, guestActivity: 94 },
    { timestamp: new Date('2024-08-15T21:00:00'), photos: 189, views: 1234, engagement: 85, guestActivity: 89 },
    { timestamp: new Date('2024-08-15T22:00:00'), photos: 68, views: 567, engagement: 76, guestActivity: 65 }
  ];

  useEffect(() => {
    setEventMetrics(mockEventMetrics);
    setLocationHeatmap(mockLocationHeatmap);
    setTimeline(mockTimeline);
  }, []);

  const refreshData = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  const getEngagementColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 75) return 'text-yellow-600 bg-yellow-100';
    if (score >= 60) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getActivityIntensity = (intensity: number) => {
    const opacity = Math.min(intensity / 100, 1);
    return `rgba(59, 130, 246, ${opacity})`;
  };

  const getMomentIcon = (type: string) => {
    switch (type) {
      case 'peak_activity': return <Activity className="h-4 w-4" />;
      case 'viral_photo': return <TrendingUp className="h-4 w-4" />;
      case 'group_photo': return <Users className="h-4 w-4" />;
      case 'special_moment': return <Heart className="h-4 w-4" />;
      default: return <Camera className="h-4 w-4" />;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (!eventMetrics) return null;

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <Card className="glass-effect">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-electric-blue" />
                Event Intelligence Dashboard
              </CardTitle>
              <CardDescription>
                Real-time analytics and insights for your events
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wedding_001">Sarah & Michael's Wedding</SelectItem>
                  <SelectItem value="birthday_002">Emma's 30th Birthday</SelectItem>
                  <SelectItem value="corporate_003">TechCorp Annual Meeting</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="1h">Last Hour</SelectItem>
                  <SelectItem value="4h">Last 4 Hours</SelectItem>
                  <SelectItem value="24h">Last 24 Hours</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={refreshData} disabled={isRefreshing}>
                {isRefreshing ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-6 w-6 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-bold">{eventMetrics.guestCount}</p>
            <p className="text-xs text-muted-foreground">Guests</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Camera className="h-6 w-6 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold">{eventMetrics.photosUploaded.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Photos</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Eye className="h-6 w-6 mx-auto mb-2 text-purple-500" />
            <p className="text-2xl font-bold">{eventMetrics.totalViews.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Views</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Download className="h-6 w-6 mx-auto mb-2 text-orange-500" />
            <p className="text-2xl font-bold">{eventMetrics.totalDownloads.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Downloads</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Share2 className="h-6 w-6 mx-auto mb-2 text-pink-500" />
            <p className="text-2xl font-bold">{eventMetrics.totalShares}</p>
            <p className="text-xs text-muted-foreground">Shares</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Gauge className="h-6 w-6 mx-auto mb-2 text-emerald-500" />
            <p className="text-2xl font-bold">{eventMetrics.engagementScore}</p>
            <p className="text-xs text-muted-foreground">Engagement</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard */}
      <Tabs value={selectedView} onValueChange={(v) => setSelectedView(v as any)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="heatmap">Location Heatmap</TabsTrigger>
          <TabsTrigger value="timeline">Activity Timeline</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Event Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{eventMetrics.eventName}</CardTitle>
              <CardDescription>
                {eventMetrics.eventType} • {eventMetrics.date.toLocaleDateString()} • {formatDuration(eventMetrics.duration)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium">Event Performance</h4>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Engagement Score:</span>
                      <Badge className={`${getEngagementColor(eventMetrics.engagementScore)} text-xs`}>
                        {eventMetrics.engagementScore}%
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm">Average Rating:</span>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium">{eventMetrics.averageRating}</span>
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className={`text-xs ${i < Math.floor(eventMetrics.averageRating) ? 'text-yellow-500' : 'text-gray-300'}`}>
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm">Photos per Guest:</span>
                      <span className="text-sm font-medium">
                        {(eventMetrics.photosUploaded / eventMetrics.guestCount).toFixed(1)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm">Guest Sentiment:</span>
                      <Badge variant={eventMetrics.guestSentiment === 'positive' ? 'default' : 'secondary'} className="text-xs">
                        {eventMetrics.guestSentiment}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Peak Activity Moments</h4>
                  
                  <div className="space-y-2">
                    {eventMetrics.peakActivity.slice(0, 4).map((peak, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span>{formatTime(peak.time)}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-muted rounded-full h-2">
                            <div 
                              className="bg-electric-blue h-2 rounded-full" 
                              style={{ width: `${peak.intensity}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium w-8">{peak.intensity}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Sharing Statistics</h4>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>View Rate:</span>
                      <span className="font-medium">
                        {((eventMetrics.totalViews / eventMetrics.photosUploaded)).toFixed(1)}x per photo
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Download Rate:</span>
                      <span className="font-medium">
                        {((eventMetrics.totalDownloads / eventMetrics.totalViews) * 100).toFixed(1)}%
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Share Rate:</span>
                      <span className="font-medium">
                        {((eventMetrics.totalShares / eventMetrics.totalViews) * 100).toFixed(1)}%
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Viral Coefficient:</span>
                      <span className="font-medium text-green-600">2.3x</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Moments */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="h-5 w-5 text-electric-blue" />
                Key Moments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {eventMetrics.keyMoments.map((moment) => (
                  <div key={moment.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="p-2 bg-electric-blue/10 rounded-full text-electric-blue">
                      {getMomentIcon(moment.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium">{moment.description}</h4>
                        <span className="text-sm text-muted-foreground">
                          {formatTime(moment.timestamp)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{moment.metrics.photos} photos</span>
                        <span>{moment.metrics.views} views</span>
                        <span>{moment.metrics.engagement}% engagement</span>
                      </div>
                    </div>
                    
                    <Badge className={`${getEngagementColor(moment.metrics.engagement)} text-xs`}>
                      {moment.metrics.engagement}%
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="heatmap" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-electric-blue" />
                Location Activity Heatmap
              </CardTitle>
              <CardDescription>
                Photo activity and engagement by venue area
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Visual Heatmap */}
                <div className="space-y-4">
                  <h4 className="font-medium">Venue Layout</h4>
                  <div className="relative aspect-square bg-muted/20 rounded-lg border">
                    {locationHeatmap.map((zone, index) => (
                      <div
                        key={index}
                        className="absolute rounded-full border-2 border-white shadow-lg cursor-pointer transition-transform hover:scale-110"
                        style={{
                          left: `${zone.coordinates.x}%`,
                          top: `${zone.coordinates.y}%`,
                          width: `${Math.max(20, zone.activity / 2)}px`,
                          height: `${Math.max(20, zone.activity / 2)}px`,
                          backgroundColor: getActivityIntensity(zone.activity),
                          transform: 'translate(-50%, -50%)'
                        }}
                        title={`${zone.zone}: ${zone.activity}% activity`}
                      />
                    ))}
                    
                    {/* Legend */}
                    <div className="absolute bottom-4 left-4 bg-white/90 p-3 rounded-lg shadow">
                      <h5 className="text-sm font-medium mb-2">Activity Level</h5>
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getActivityIntensity(30) }} />
                        <span>Low</span>
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getActivityIntensity(70) }} />
                        <span>High</span>
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getActivityIntensity(100) }} />
                        <span>Peak</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Zone Statistics */}
                <div className="space-y-4">
                  <h4 className="font-medium">Zone Performance</h4>
                  <div className="space-y-3">
                    {locationHeatmap
                      .sort((a, b) => b.activity - a.activity)
                      .map((zone, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium">{zone.zone}</h5>
                          <Badge className={`${getEngagementColor(zone.activity)} text-xs`}>
                            #{index + 1}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-3 text-sm">
                          <div className="text-center">
                            <p className="font-bold text-lg">{zone.activity}%</p>
                            <p className="text-muted-foreground">Activity</p>
                          </div>
                          <div className="text-center">
                            <p className="font-bold text-lg">{zone.photos}</p>
                            <p className="text-muted-foreground">Photos</p>
                          </div>
                          <div className="text-center">
                            <p className="font-bold text-lg">{zone.engagement}%</p>
                            <p className="text-muted-foreground">Engagement</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-electric-blue" />
                Activity Timeline
              </CardTitle>
              <CardDescription>
                Real-time event activity throughout the day
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Timeline Chart */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Hourly Activity</h4>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded" />
                        <span>Photos</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded" />
                        <span>Views</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-purple-500 rounded" />
                        <span>Engagement</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {timeline.map((data, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                        <div className="w-16 text-sm font-medium">
                          {formatTime(data.timestamp)}
                        </div>
                        
                        <div className="flex-1 grid grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span>Photos</span>
                              <span>{data.photos}</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full" 
                                style={{ width: `${(data.photos / 300) * 100}%` }}
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span>Views</span>
                              <span>{data.views}</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full" 
                                style={{ width: `${(data.views / 3000) * 100}%` }}
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span>Engagement</span>
                              <span>{data.engagement}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className="bg-purple-500 h-2 rounded-full" 
                                style={{ width: `${data.engagement}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="h-5 w-5 text-electric-blue" />
                AI-Powered Insights
              </CardTitle>
              <CardDescription>
                Intelligent analysis and recommendations for your event
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Performance Insights</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-green-800">Exceptional Engagement</p>
                        <p className="text-sm text-green-600">
                          94% engagement score is 34% above average for wedding events
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <Target className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-800">Perfect Peak Timing</p>
                        <p className="text-sm text-blue-600">
                          Ceremony and first dance generated optimal photo activity
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-purple-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-purple-800">Viral Content Success</p>
                        <p className="text-sm text-purple-600">
                          Group photo achieved 5.7K views, 12x average viral coefficient
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Optimization Recommendations</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-yellow-800">Bar Area Underutilized</p>
                        <p className="text-sm text-yellow-600">
                          Consider adding photo opportunities near refreshment areas
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                      <Signal className="h-5 w-5 text-orange-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-orange-800">Evening Activity Drop</p>
                        <p className="text-sm text-orange-600">
                          Later activities could benefit from more interactive photo prompts
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-indigo-50 rounded-lg">
                      <Activity className="h-5 w-5 text-indigo-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-indigo-800">Share Rate Opportunity</p>
                        <p className="text-sm text-indigo-600">
                          5.7% share rate could improve with social media integration
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benchmarking */}
              <div className="mt-6 p-4 border rounded-lg bg-muted/30">
                <h4 className="font-medium mb-3">Industry Benchmarks</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <p className="font-bold text-lg text-green-600">+34%</p>
                    <p className="text-muted-foreground">Above avg engagement</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-lg text-blue-600">+28%</p>
                    <p className="text-muted-foreground">Above avg photos/guest</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-lg text-purple-600">2.3x</p>
                    <p className="text-muted-foreground">Viral coefficient</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-lg text-emerald-600">Top 5%</p>
                    <p className="text-muted-foreground">Overall performance</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EventIntelligence;