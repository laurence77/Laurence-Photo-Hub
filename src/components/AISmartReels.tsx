import { useState, useEffect, useRef } from 'react';
import { getImagePath } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { 
  Music, 
  Video, 
  Brain, 
  Wand2,
  Play,
  Pause,
  Download,
  Share,
  Volume2,
  VolumeX,
  Clock,
  Sparkles,
  Heart,
  Zap,
  Eye,
  Settings,
  Shuffle,
  SkipForward,
  SkipBack,
  Film,
  Camera
} from 'lucide-react';

interface MediaAsset {
  id: string;
  type: 'photo' | 'video';
  url: string;
  timestamp: number;
  emotions: string[];
  energy: number;
  faces: number;
  duration?: number;
  quality: number;
}

interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  genre: string;
  tempo: number;
  energy: number;
  duration: number;
  url: string;
}

interface GeneratedReel {
  id: string;
  title: string;
  duration: number;
  music: MusicTrack;
  segments: {
    asset: MediaAsset;
    startTime: number;
    duration: number;
    transition: string;
    effects: string[];
  }[];
  style: string;
  createdAt: Date;
}

const AISmartReels = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedReels, setGeneratedReels] = useState<GeneratedReel[]>([]);
  const [selectedAssets, setSelectedAssets] = useState<MediaAsset[]>([]);
  const [reelStyle, setReelStyle] = useState('cinematic');
  const [reelDuration, setReelDuration] = useState([60]);
  const [musicSync, setMusicSync] = useState(true);
  const [emotionWeighting, setEmotionWeighting] = useState(true);
  const [faceDetection, setFaceDetection] = useState(true);
  const [autoColorGrading, setAutoColorGrading] = useState(true);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Mock data for demonstration
  const mockAssets: MediaAsset[] = [
    {
      id: '1',
      type: 'photo',
      url: getImagePath('/uploads/a0278ce1-b82d-4ed6-a186-14a9503ef65c.png'),
      timestamp: Date.now() - 3600000,
      emotions: ['joy', 'love', 'excitement'],
      energy: 8.5,
      faces: 2,
      quality: 9.2
    },
    {
      id: '2',
      type: 'video',
      url: getImagePath('/uploads/34a58283-8b82-48f9-88f4-2c88b069921d.png'),
      timestamp: Date.now() - 3000000,
      emotions: ['celebration', 'happiness'],
      energy: 9.1,
      faces: 5,
      duration: 12,
      quality: 8.8
    },
    {
      id: '3',
      type: 'photo',
      url: getImagePath('/uploads/47f9a1d0-4458-400a-8fc0-79adf093cf18.png'),
      timestamp: Date.now() - 1800000,
      emotions: ['peaceful', 'serene'],
      energy: 6.2,
      faces: 1,
      quality: 9.5
    },
    {
      id: '4',
      type: 'video',
      url: getImagePath('/uploads/af28398b-9e23-4e2b-9de1-bda457e09fd8.png'),
      timestamp: Date.now() - 900000,
      emotions: ['fun', 'energetic', 'playful'],
      energy: 9.8,
      faces: 8,
      duration: 8,
      quality: 8.5
    }
  ];

  const musicTracks: MusicTrack[] = [
    {
      id: '1',
      title: 'Wedding Dreams',
      artist: 'AI Composer',
      genre: 'Romantic',
      tempo: 120,
      energy: 7.5,
      duration: 180,
      url: '/music/wedding-dreams.mp3'
    },
    {
      id: '2',
      title: 'Epic Celebration',
      artist: 'AI Composer',
      genre: 'Uplifting',
      tempo: 140,
      energy: 9.2,
      duration: 200,
      url: '/music/epic-celebration.mp3'
    },
    {
      id: '3',
      title: 'Peaceful Moments',
      artist: 'AI Composer',
      genre: 'Ambient',
      tempo: 80,
      energy: 5.8,
      duration: 240,
      url: '/music/peaceful-moments.mp3'
    }
  ];

  useEffect(() => {
    setSelectedAssets(mockAssets);
  }, []);

  const generateSmartReel = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    // Simulate AI reel generation process
    const steps = [
      { name: 'Analyzing media assets...', duration: 2000 },
      { name: 'Detecting emotions and energy...', duration: 1500 },
      { name: 'Selecting optimal music...', duration: 1000 },
      { name: 'Synchronizing beats with transitions...', duration: 2500 },
      { name: 'Applying AI color grading...', duration: 1500 },
      { name: 'Generating smooth transitions...', duration: 2000 },
      { name: 'Finalizing reel compilation...', duration: 1500 }
    ];

    let totalProgress = 0;
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      await new Promise(resolve => setTimeout(resolve, step.duration));
      totalProgress = ((i + 1) / steps.length) * 100;
      setGenerationProgress(totalProgress);
    }

    // Generate mock reel
    const selectedMusic = musicTracks[Math.floor(Math.random() * musicTracks.length)];
    const targetDuration = reelDuration[0];
    
    // Create segments based on music tempo and energy
    const segments = selectedAssets.slice(0, Math.min(selectedAssets.length, 8)).map((asset, index) => {
      const segmentDuration = targetDuration / selectedAssets.length;
      const beatSync = musicSync ? selectedMusic.tempo / 60 : 1;
      
      return {
        asset,
        startTime: index * segmentDuration,
        duration: segmentDuration,
        transition: ['fade', 'slide', 'zoom', 'spin'][Math.floor(Math.random() * 4)],
        effects: emotionWeighting 
          ? asset.emotions.map(emotion => `${emotion}-filter`)
          : ['natural']
      };
    });

    const newReel: GeneratedReel = {
      id: Date.now().toString(),
      title: `${reelStyle} Reel - ${new Date().toLocaleDateString()}`,
      duration: targetDuration,
      music: selectedMusic,
      segments,
      style: reelStyle,
      createdAt: new Date()
    };

    setGeneratedReels(prev => [newReel, ...prev]);
    setIsGenerating(false);
    setGenerationProgress(100);

    // Reset progress after a delay
    setTimeout(() => setGenerationProgress(0), 3000);
  };

  const playReel = (reelId: string) => {
    if (currentlyPlaying === reelId) {
      setCurrentlyPlaying(null);
      if (videoRef.current) {
        videoRef.current.pause();
      }
    } else {
      setCurrentlyPlaying(reelId);
      if (videoRef.current) {
        videoRef.current.play();
      }
    }
  };

  const downloadReel = (reel: GeneratedReel) => {
    // Simulate download
    const blob = new Blob(['Mock reel data'], { type: 'video/mp4' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reel.title.replace(/\s+/g, '-').toLowerCase()}.mp4`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* AI Configuration */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-electric-blue" />
            AI Smart Reels Generator
          </CardTitle>
          <CardDescription>
            Automatically create cinematic highlight reels synchronized to music beats using AI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Reel Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Film className="h-4 w-4" />
                Reel Configuration
              </h4>
              
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>Reel Style</Label>
                  <Select value={reelStyle} onValueChange={setReelStyle}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cinematic">Cinematic</SelectItem>
                      <SelectItem value="dynamic">Dynamic</SelectItem>
                      <SelectItem value="romantic">Romantic</SelectItem>
                      <SelectItem value="energetic">Energetic</SelectItem>
                      <SelectItem value="peaceful">Peaceful</SelectItem>
                      <SelectItem value="documentary">Documentary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Duration: {reelDuration[0]}s</Label>
                  <Slider
                    value={reelDuration}
                    onValueChange={setReelDuration}
                    min={15}
                    max={300}
                    step={15}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>15s</span>
                    <span>5min</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Settings className="h-4 w-4" />
                AI Features
              </h4>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Music Synchronization</Label>
                    <p className="text-sm text-muted-foreground">Sync transitions to music beats</p>
                  </div>
                  <Switch checked={musicSync} onCheckedChange={setMusicSync} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Emotion Weighting</Label>
                    <p className="text-sm text-muted-foreground">Prioritize high-emotion moments</p>
                  </div>
                  <Switch checked={emotionWeighting} onCheckedChange={setEmotionWeighting} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Face Detection Priority</Label>
                    <p className="text-sm text-muted-foreground">Focus on photos with people</p>
                  </div>
                  <Switch checked={faceDetection} onCheckedChange={setFaceDetection} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Auto Color Grading</Label>
                    <p className="text-sm text-muted-foreground">AI-enhanced color correction</p>
                  </div>
                  <Switch checked={autoColorGrading} onCheckedChange={setAutoColorGrading} />
                </div>
              </div>
            </div>
          </div>

          {/* Media Selection */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Selected Media ({selectedAssets.length} assets)
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {selectedAssets.slice(0, 12).map((asset) => (
                <div key={asset.id} className="relative aspect-square rounded-lg overflow-hidden border">
                  <img
                    src={asset.url}
                    alt="Selected media"
                    className="w-full h-full object-cover"
                  />
                  {asset.type === 'video' && (
                    <div className="absolute top-2 right-2">
                      <Video className="h-4 w-4 text-white drop-shadow-lg" />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                    <div className="flex items-center justify-between text-white text-xs">
                      <Badge variant="secondary" className="text-xs px-1">
                        {asset.energy.toFixed(1)}
                      </Badge>
                      {asset.faces > 0 && (
                        <Badge variant="outline" className="text-xs px-1">
                          {asset.faces}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {selectedAssets.length > 12 && (
                <div className="aspect-square rounded-lg border border-dashed border-muted-foreground/50 flex items-center justify-center text-muted-foreground">
                  <span className="text-sm">+{selectedAssets.length - 12} more</span>
                </div>
              )}
            </div>
          </div>

          {/* Generate Button */}
          <div className="text-center">
            <Button 
              onClick={generateSmartReel}
              disabled={isGenerating || selectedAssets.length === 0}
              size="lg"
              className="min-w-[200px]"
            >
              {isGenerating ? (
                <>
                  <Wand2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Smart Reel
                </>
              )}
            </Button>
            
            {isGenerating && (
              <div className="mt-4 space-y-2">
                <Progress value={generationProgress} className="w-full max-w-md mx-auto" />
                <p className="text-sm text-muted-foreground">
                  Processing {selectedAssets.length} assets with AI analysis...
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Generated Reels */}
      {generatedReels.length > 0 && (
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Film className="h-5 w-5 text-electric-blue" />
              Generated Reels
            </CardTitle>
            <CardDescription>
              AI-generated highlight reels synchronized to music
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {generatedReels.map((reel) => (
                <div key={reel.id} className="border rounded-lg overflow-hidden">
                  {/* Reel Preview */}
                  <div className="aspect-video bg-black relative">
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      poster={reel.segments[0]?.asset.url}
                      muted={isMuted}
                    >
                      <source src="/videos/sample-reel.mp4" type="video/mp4" />
                    </video>
                    
                    {/* Play Overlay */}
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <Button
                        onClick={() => playReel(reel.id)}
                        size="lg"
                        className="rounded-full w-16 h-16 p-0"
                      >
                        {currentlyPlaying === reel.id ? (
                          <Pause className="h-8 w-8" />
                        ) : (
                          <Play className="h-8 w-8 ml-1" />
                        )}
                      </Button>
                    </div>

                    {/* Controls Overlay */}
                    <div className="absolute bottom-4 right-4 flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setIsMuted(!isMuted)}
                      >
                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  {/* Reel Info */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{reel.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatDuration(reel.duration)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Music className="h-4 w-4" />
                            {reel.music.title}
                          </div>
                          <div className="flex items-center gap-1">
                            <Film className="h-4 w-4" />
                            {reel.segments.length} clips
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="capitalize">
                          {reel.style}
                        </Badge>
                      </div>
                    </div>

                    {/* Music Info */}
                    <div className="bg-muted/30 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-electric-blue to-purple-600 rounded-lg flex items-center justify-center">
                            <Music className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium">{reel.music.title}</p>
                            <p className="text-sm text-muted-foreground">{reel.music.artist} • {reel.music.genre}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{reel.music.tempo} BPM</p>
                          <p className="text-sm text-muted-foreground">Energy: {reel.music.energy}/10</p>
                        </div>
                      </div>
                    </div>

                    {/* Segments Preview */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Segments</h4>
                      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                        {reel.segments.map((segment, index) => (
                          <div key={index} className="relative aspect-square rounded overflow-hidden border">
                            <img
                              src={segment.asset.url}
                              alt={`Segment ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-1">
                              <div className="text-white text-xs text-center">
                                {formatDuration(segment.duration)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Heart className="h-4 w-4 mr-2" />
                          Like
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Shuffle className="h-4 w-4 mr-2" />
                          Regenerate
                        </Button>
                        <Button 
                          onClick={() => downloadReel(reel)}
                          size="sm"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Zap className="h-5 w-5 text-electric-blue mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-medium mb-2">Pro Tips for Better AI Reels</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Mix photos and videos for dynamic storytelling</li>
                <li>• Include high-energy moments for better music synchronization</li>
                <li>• Select assets with clear subjects and good lighting</li>
                <li>• Enable emotion weighting to capture the best moments</li>
                <li>• Use face detection priority for people-focused events</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AISmartReels;