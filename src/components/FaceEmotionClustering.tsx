import { useState, useEffect } from 'react';
import { getImagePath } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  Brain, 
  Heart, 
  Smile, 
  Frown, 
  Meh,
  Surprise,
  Eye,
  Zap,
  Shield,
  Settings,
  Camera,
  Sparkles,
  TrendingUp,
  BarChart3,
  Filter,
  Search,
  Download,
  Share,
  Lock,
  UserPlus,
  Clock,
  Calendar,
  MapPin
} from 'lucide-react';

interface DetectedFace {
  id: string;
  personId?: string;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  confidence: number;
  emotions: {
    joy: number;
    sadness: number;
    anger: number;
    surprise: number;
    fear: number;
    neutral: number;
  };
  attributes: {
    age: number;
    gender: string;
    expression: string;
    glasses: boolean;
    hat: boolean;
  };
}

interface PhotoWithFaces {
  id: string;
  url: string;
  timestamp: Date;
  faces: DetectedFace[];
  location?: string;
  event: string;
  dominantEmotion: string;
}

interface PersonCluster {
  id: string;
  name?: string;
  pseudonym: string;
  faceCount: number;
  photoCount: number;
  averageEmotion: string;
  emotionHistory: {
    emotion: string;
    intensity: number;
    timestamp: Date;
  }[];
  firstSeen: Date;
  lastSeen: Date;
  representative: string; // URL to representative face
  isVerified: boolean;
}

interface EmotionCluster {
  emotion: string;
  intensity: 'low' | 'medium' | 'high';
  photoCount: number;
  timeDistribution: {
    hour: number;
    count: number;
  }[];
  locationDistribution: {
    location: string;
    count: number;
  }[];
  photos: PhotoWithFaces[];
}

const FaceEmotionClustering = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [personClusters, setPersonClusters] = useState<PersonCluster[]>([]);
  const [emotionClusters, setEmotionClusters] = useState<EmotionCluster[]>([]);
  const [photos, setPhotos] = useState<PhotoWithFaces[]>([]);
  const [privacyMode, setPrivacyMode] = useState(true);
  const [clusteringAccuracy, setClusteringAccuracy] = useState('balanced');
  const [emotionSensitivity, setEmotionSensitivity] = useState('medium');
  const [autoNaming, setAutoNaming] = useState(false);
  const [selectedView, setSelectedView] = useState<'people' | 'emotions' | 'timeline'>('people');
  const [selectedPerson, setSelectedPerson] = useState<PersonCluster | null>(null);

  // Mock data
  const mockPhotos: PhotoWithFaces[] = [
    {
      id: '1',
      url: getImagePath('/uploads/a0278ce1-b82d-4ed6-a186-14a9503ef65c.png'),
      timestamp: new Date(Date.now() - 3600000),
      event: 'Wedding Reception',
      location: 'Garden Venue',
      dominantEmotion: 'joy',
      faces: [
        {
          id: 'f1',
          personId: 'p1',
          boundingBox: { x: 120, y: 80, width: 150, height: 180 },
          confidence: 0.92,
          emotions: { joy: 0.85, sadness: 0.02, anger: 0.01, surprise: 0.08, fear: 0.01, neutral: 0.03 },
          attributes: { age: 28, gender: 'female', expression: 'smiling', glasses: false, hat: false }
        },
        {
          id: 'f2',
          personId: 'p2',
          boundingBox: { x: 300, y: 90, width: 140, height: 170 },
          confidence: 0.88,
          emotions: { joy: 0.78, sadness: 0.03, anger: 0.02, surprise: 0.12, fear: 0.02, neutral: 0.03 },
          attributes: { age: 32, gender: 'male', expression: 'laughing', glasses: true, hat: false }
        }
      ]
    },
    {
      id: '2',
      url: getImagePath('/uploads/34a58283-8b82-48f9-88f4-2c88b069921d.png'),
      timestamp: new Date(Date.now() - 7200000),
      event: 'Reception Dance',
      location: 'Dance Floor',
      dominantEmotion: 'excitement',
      faces: [
        {
          id: 'f3',
          personId: 'p1',
          boundingBox: { x: 180, y: 120, width: 160, height: 190 },
          confidence: 0.89,
          emotions: { joy: 0.92, sadness: 0.01, anger: 0.01, surprise: 0.04, fear: 0.01, neutral: 0.01 },
          attributes: { age: 28, gender: 'female', expression: 'ecstatic', glasses: false, hat: false }
        }
      ]
    }
  ];

  const mockPersonClusters: PersonCluster[] = [
    {
      id: 'p1',
      name: 'Sarah (Bride)',
      pseudonym: 'Person A',
      faceCount: 15,
      photoCount: 12,
      averageEmotion: 'joy',
      emotionHistory: [
        { emotion: 'joy', intensity: 0.85, timestamp: new Date(Date.now() - 3600000) },
        { emotion: 'joy', intensity: 0.92, timestamp: new Date(Date.now() - 7200000) },
        { emotion: 'surprise', intensity: 0.78, timestamp: new Date(Date.now() - 10800000) }
      ],
      firstSeen: new Date(Date.now() - 14400000),
      lastSeen: new Date(Date.now() - 1800000),
      representative: getImagePath('/uploads/a0278ce1-b82d-4ed6-a186-14a9503ef65c.png'),
      isVerified: true
    },
    {
      id: 'p2',
      pseudonym: 'Person B',
      faceCount: 12,
      photoCount: 8,
      averageEmotion: 'joy',
      emotionHistory: [
        { emotion: 'joy', intensity: 0.78, timestamp: new Date(Date.now() - 3600000) },
        { emotion: 'surprise', intensity: 0.65, timestamp: new Date(Date.now() - 9000000) }
      ],
      firstSeen: new Date(Date.now() - 12600000),
      lastSeen: new Date(Date.now() - 2400000),
      representative: getImagePath('/uploads/34a58283-8b82-48f9-88f4-2c88b069921d.png'),
      isVerified: false
    },
    {
      id: 'p3',
      pseudonym: 'Person C',
      faceCount: 8,
      photoCount: 6,
      averageEmotion: 'neutral',
      emotionHistory: [
        { emotion: 'neutral', intensity: 0.82, timestamp: new Date(Date.now() - 5400000) },
        { emotion: 'joy', intensity: 0.45, timestamp: new Date(Date.now() - 8100000) }
      ],
      firstSeen: new Date(Date.now() - 10800000),
      lastSeen: new Date(Date.now() - 3000000),
      representative: getImagePath('/uploads/47f9a1d0-4458-400a-8fc0-79adf093cf18.png'),
      isVerified: false
    }
  ];

  const mockEmotionClusters: EmotionCluster[] = [
    {
      emotion: 'joy',
      intensity: 'high',
      photoCount: 24,
      timeDistribution: [
        { hour: 14, count: 3 },
        { hour: 15, count: 8 },
        { hour: 16, count: 13 }
      ],
      locationDistribution: [
        { location: 'Dance Floor', count: 15 },
        { location: 'Garden Venue', count: 9 }
      ],
      photos: mockPhotos.filter(p => p.dominantEmotion === 'joy')
    },
    {
      emotion: 'surprise',
      intensity: 'medium',
      photoCount: 8,
      timeDistribution: [
        { hour: 13, count: 2 },
        { hour: 17, count: 6 }
      ],
      locationDistribution: [
        { location: 'Ceremony', count: 5 },
        { location: 'Reception', count: 3 }
      ],
      photos: []
    },
    {
      emotion: 'neutral',
      intensity: 'low',
      photoCount: 12,
      timeDistribution: [
        { hour: 12, count: 4 },
        { hour: 18, count: 8 }
      ],
      locationDistribution: [
        { location: 'Preparation', count: 7 },
        { location: 'After Party', count: 5 }
      ],
      photos: []
    }
  ];

  useEffect(() => {
    setPhotos(mockPhotos);
    setPersonClusters(mockPersonClusters);
    setEmotionClusters(mockEmotionClusters);
  }, []);

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);

    const steps = [
      { name: 'Detecting faces in photos...', duration: 2000 },
      { name: 'Extracting facial features...', duration: 2500 },
      { name: 'Analyzing emotions and expressions...', duration: 2000 },
      { name: 'Clustering similar faces...', duration: 3000 },
      { name: 'Building emotion profiles...', duration: 1500 },
      { name: 'Creating timeline analysis...', duration: 1000 }
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, steps[i].duration));
      setAnalysisProgress(((i + 1) / steps.length) * 100);
    }

    setIsAnalyzing(false);
    setTimeout(() => setAnalysisProgress(0), 2000);
  };

  const getEmotionIcon = (emotion: string) => {
    switch (emotion) {
      case 'joy': return <Smile className="h-4 w-4 text-green-500" />;
      case 'sadness': return <Frown className="h-4 w-4 text-blue-500" />;
      case 'surprise': return <Surprise className="h-4 w-4 text-yellow-500" />;
      case 'neutral': return <Meh className="h-4 w-4 text-gray-500" />;
      default: return <Heart className="h-4 w-4 text-pink-500" />;
    }
  };

  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
      case 'joy': return 'bg-green-100 text-green-800 border-green-200';
      case 'sadness': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'surprise': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'neutral': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-pink-100 text-pink-800 border-pink-200';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Configuration */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-electric-blue" />
            Face & Emotion Clustering
          </CardTitle>
          <CardDescription>
            AI-powered face recognition and emotion analysis with privacy-first clustering
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Privacy Settings */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Privacy & Security
              </h4>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Privacy Mode</Label>
                    <p className="text-sm text-muted-foreground">Use pseudonyms instead of real names</p>
                  </div>
                  <Switch checked={privacyMode} onCheckedChange={setPrivacyMode} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Auto-naming</Label>
                    <p className="text-sm text-muted-foreground">Suggest names based on context</p>
                  </div>
                  <Switch checked={autoNaming} onCheckedChange={setAutoNaming} />
                </div>

                <div className="space-y-2">
                  <Label>Clustering Accuracy</Label>
                  <Select value={clusteringAccuracy} onValueChange={setClusteringAccuracy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conservative">Conservative (fewer false positives)</SelectItem>
                      <SelectItem value="balanced">Balanced (recommended)</SelectItem>
                      <SelectItem value="aggressive">Aggressive (more clusters)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Analysis Settings */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Analysis Settings
              </h4>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Emotion Sensitivity</Label>
                  <Select value={emotionSensitivity} onValueChange={setEmotionSensitivity}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (only strong emotions)</SelectItem>
                      <SelectItem value="medium">Medium (balanced)</SelectItem>
                      <SelectItem value="high">High (subtle emotions)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="text-center">
                  <Button 
                    onClick={runAnalysis}
                    disabled={isAnalyzing}
                    size="lg"
                  >
                    {isAnalyzing ? (
                      <>
                        <Brain className="h-4 w-4 mr-2 animate-pulse" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        Run Analysis
                      </>
                    )}
                  </Button>
                  
                  {isAnalyzing && (
                    <div className="mt-4 space-y-2">
                      <Progress value={analysisProgress} />
                      <p className="text-sm text-muted-foreground">
                        Processing {photos.length} photos with facial recognition AI...
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-electric-blue" />
            Analysis Results
          </CardTitle>
          <CardDescription>
            Face clusters and emotion analysis from your event photos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedView} onValueChange={(v) => setSelectedView(v as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="people">People Clusters</TabsTrigger>
              <TabsTrigger value="emotions">Emotion Analysis</TabsTrigger>
              <TabsTrigger value="timeline">Timeline View</TabsTrigger>
            </TabsList>

            <TabsContent value="people" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {personClusters.map((person) => (
                  <Card key={person.id} className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => setSelectedPerson(person)}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={person.representative} alt={person.pseudonym} />
                          <AvatarFallback>{person.pseudonym.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">
                              {privacyMode ? person.pseudonym : (person.name || person.pseudonym)}
                            </h3>
                            {person.isVerified && (
                              <Badge variant="secondary" className="text-xs">
                                <Eye className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {person.faceCount} faces in {person.photoCount} photos
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Average Emotion:</span>
                          <div className="flex items-center gap-1">
                            {getEmotionIcon(person.averageEmotion)}
                            <Badge variant="outline" className={`text-xs ${getEmotionColor(person.averageEmotion)}`}>
                              {person.averageEmotion}
                            </Badge>
                          </div>
                        </div>

                        <div className="text-xs text-muted-foreground">
                          <div className="flex items-center justify-between">
                            <span>First seen:</span>
                            <span>{formatTimeAgo(person.firstSeen)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Last seen:</span>
                            <span>{formatTimeAgo(person.lastSeen)}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-3">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="h-3 w-3 mr-1" />
                            View Photos
                          </Button>
                          <Button variant="outline" size="sm">
                            <UserPlus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="emotions" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {emotionClusters.map((cluster) => (
                  <Card key={cluster.emotion}>
                    <CardContent className="p-6">
                      <div className="text-center mb-4">
                        <div className="flex justify-center mb-2">
                          {getEmotionIcon(cluster.emotion)}
                        </div>
                        <h3 className="font-medium capitalize text-lg">{cluster.emotion}</h3>
                        <Badge variant="outline" className={`mt-1 ${getEmotionColor(cluster.emotion)}`}>
                          {cluster.intensity} intensity
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        <div className="text-center">
                          <p className="text-2xl font-bold">{cluster.photoCount}</p>
                          <p className="text-sm text-muted-foreground">Photos</p>
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-sm font-medium flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Peak Times
                          </h4>
                          {cluster.timeDistribution.slice(0, 2).map((time) => (
                            <div key={time.hour} className="flex justify-between text-sm">
                              <span>{time.hour}:00</span>
                              <span>{time.count} photos</span>
                            </div>
                          ))}
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-sm font-medium flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Top Locations
                          </h4>
                          {cluster.locationDistribution.slice(0, 2).map((location) => (
                            <div key={location.location} className="flex justify-between text-sm">
                              <span>{location.location}</span>
                              <span>{location.count}</span>
                            </div>
                          ))}
                        </div>

                        <div className="pt-2">
                          <Button variant="outline" size="sm" className="w-full">
                            <Search className="h-3 w-3 mr-1" />
                            View All Photos
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 text-electric-blue" />
                    <h3 className="text-xl font-semibold mb-2">Emotion Timeline Analysis</h3>
                    <p className="text-muted-foreground">
                      Track how emotions changed throughout your event
                    </p>
                  </div>

                  {/* Mock timeline visualization */}
                  <div className="space-y-4">
                    {[
                      { time: '12:00', emotion: 'neutral', intensity: 0.6, count: 4 },
                      { time: '14:00', emotion: 'joy', intensity: 0.8, count: 12 },
                      { time: '16:00', emotion: 'joy', intensity: 0.95, count: 18 },
                      { time: '18:00', emotion: 'surprise', intensity: 0.7, count: 8 },
                      { time: '20:00', emotion: 'joy', intensity: 0.85, count: 15 }
                    ].map((point, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                        <div className="w-16 text-sm font-medium text-center">
                          {point.time}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {getEmotionIcon(point.emotion)}
                            <span className="capitalize">{point.emotion}</span>
                            <Badge variant="outline" className="ml-auto">
                              {point.count} photos
                            </Badge>
                          </div>
                          <Progress value={point.intensity * 100} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 text-center">
                    <Badge variant="secondary">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Peak Joy at 16:00 (95% intensity)
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Privacy Notice */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Lock className="h-5 w-5 text-electric-blue mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-medium mb-2">Privacy & Data Protection</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• All facial recognition processing happens locally on your device</li>
                <li>• Face clusters use mathematical embeddings, not actual photos</li>
                <li>• No personal data is stored or transmitted to external servers</li>
                <li>• You can delete all clustering data at any time</li>
                <li>• Pseudonyms protect individual privacy by default</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FaceEmotionClustering;