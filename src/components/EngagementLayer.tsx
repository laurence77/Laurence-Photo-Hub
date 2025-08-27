import { useState, useEffect } from 'react';
import { getImagePath } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Heart, 
  Smile, 
  Star, 
  Sparkles, 
  Music, 
  Play,
  Pause,
  Volume2,
  VolumeX,
  Download,
  Share,
  Wand2,
  Trophy,
  Camera,
  Users,
  Clock,
  Zap
} from 'lucide-react';

interface Reaction {
  emoji: string;
  count: number;
  users: string[];
  hasReacted: boolean;
}

interface PhotoEngagement {
  id: string;
  reactions: Record<string, Reaction>;
  totalReactions: number;
  isFeatured: boolean;
  aiScore: number;
}

const EngagementLayer = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [isRecapPlaying, setIsRecapPlaying] = useState(false);
  const [recapProgress, setRecapProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [engagementData, setEngagementData] = useState<Record<string, PhotoEngagement>>({});
  const [bestMomentsReel, setBestMomentsReel] = useState<any[]>([]);
  const [isGeneratingReel, setIsGeneratingReel] = useState(false);

  // Haptic feedback function
  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [50]
      };
      navigator.vibrate(patterns[type]);
    }
  };

  // Emoji reactions with haptic feedback
  const emojiReactions = [
    { emoji: '❤️', name: 'love', haptic: 'medium' as const },
    { emoji: '😍', name: 'amazing', haptic: 'light' as const },
    { emoji: '🤩', name: 'stunning', haptic: 'medium' as const },
    { emoji: '🔥', name: 'fire', haptic: 'heavy' as const },
    { emoji: '👏', name: 'applause', haptic: 'light' as const },
    { emoji: '✨', name: 'magic', haptic: 'light' as const },
    { emoji: '💫', name: 'perfect', haptic: 'medium' as const }
  ];

  // Initialize mock engagement data
  useEffect(() => {
    const mockData: Record<string, PhotoEngagement> = {
      '1': {
        id: '1',
        reactions: {
          '❤️': { emoji: '❤️', count: 15, users: ['Sarah', 'John', 'Emma'], hasReacted: true },
          '😍': { emoji: '😍', count: 8, users: ['Mike', 'Lisa'], hasReacted: false },
          '🔥': { emoji: '🔥', count: 12, users: ['Alex', 'Taylor'], hasReacted: false }
        },
        totalReactions: 35,
        isFeatured: true,
        aiScore: 95
      },
      '2': {
        id: '2',
        reactions: {
          '❤️': { emoji: '❤️', count: 22, users: ['Jake', 'Amy'], hasReacted: false },
          '🤩': { emoji: '🤩', count: 18, users: ['Chris', 'Sam'], hasReacted: true },
          '✨': { emoji: '✨', count: 9, users: ['Jordan'], hasReacted: false }
        },
        totalReactions: 49,
        isFeatured: true,
        aiScore: 92
      }
    };
    setEngagementData(mockData);
  }, []);

  // Generate best moments reel with AI curation
  const generateBestMomentsReel = async () => {
    setIsGeneratingReel(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const reel = [
      {
        id: '1',
        type: 'photo',
        url: getImagePath('/uploads/a0278ce1-b82d-4ed6-a186-14a9503ef65c.png'),
        duration: 3,
        aiScore: 95,
        engagement: 35,
        reason: 'Perfect lighting and composition',
        music: 'Gentle Piano Melody'
      },
      {
        id: '2',
        type: 'photo',
        url: getImagePath('/uploads/34a58283-8b82-48f9-88f4-2c88b069921d.png'),
        duration: 4,
        aiScore: 92,
        engagement: 49,
        reason: 'High emotional engagement',
        music: 'Uplifting Strings'
      },
      {
        id: '3',
        type: 'photo',
        url: getImagePath('/uploads/47f9a1d0-4458-400a-8fc0-79adf093cf18.png'),
        duration: 3,
        aiScore: 88,
        engagement: 28,
        reason: 'Great group shot with genuine smiles',
        music: 'Celebration Theme'
      }
    ];
    
    setBestMomentsReel(reel);
    setIsGeneratingReel(false);
    triggerHaptic('heavy');
  };

  const handleReaction = (photoId: string, emoji: string, hapticType: 'light' | 'medium' | 'heavy') => {
    triggerHaptic(hapticType);
    
    setEngagementData(prev => {
      const photo = prev[photoId];
      if (!photo) return prev;
      
      const reaction = photo.reactions[emoji];
      const newReaction = {
        emoji,
        count: reaction ? (reaction.hasReacted ? reaction.count - 1 : reaction.count + 1) : 1,
        users: reaction?.users || [],
        hasReacted: reaction ? !reaction.hasReacted : true
      };
      
      return {
        ...prev,
        [photoId]: {
          ...photo,
          reactions: {
            ...photo.reactions,
            [emoji]: newReaction
          },
          totalReactions: Object.values({
            ...photo.reactions,
            [emoji]: newReaction
          }).reduce((sum, r) => sum + r.count, 0)
        }
      };
    });
  };

  const playSlideShowRecap = () => {
    if (bestMomentsReel.length === 0) {
      generateBestMomentsReel();
      return;
    }
    
    setIsRecapPlaying(!isRecapPlaying);
    triggerHaptic('medium');
    
    if (!isRecapPlaying) {
      // Simulate slideshow progress
      const interval = setInterval(() => {
        setRecapProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsRecapPlaying(false);
            return 0;
          }
          return prev + 2;
        });
      }, 200);
    } else {
      setRecapProgress(0);
    }
  };

  return (
    <div className="space-y-6">
      {/* Engagement Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            Event Engagement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500">❤️ 127</div>
              <p className="text-sm text-muted-foreground">Total Reactions</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">👥 85</div>
              <p className="text-sm text-muted-foreground">Active Guests</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">📸 234</div>
              <p className="text-sm text-muted-foreground">Photos Shared</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">⭐ 96%</div>
              <p className="text-sm text-muted-foreground">Happiness Score</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Photo Reactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Photo Reactions
            <Badge variant="secondary" className="ml-2">Apple-style Haptics</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(engagementData).map(([photoId, data]) => (
            <div key={photoId} className="border rounded-lg p-4">
              <div className="flex items-start gap-4">
                <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden">
                  <img 
                    src={`/uploads/${photoId === '1' ? 'a0278ce1-b82d-4ed6-a186-14a9503ef65c' : '34a58283-8b82-48f9-88f4-2c88b069921d'}.png`}
                    alt="Event photo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    {data.isFeatured && (
                      <Badge variant="secondary" className="text-yellow-600">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    <Badge variant="outline">
                      AI Score: {data.aiScore}/100
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {emojiReactions.map((reaction) => {
                      const reactionData = data.reactions[reaction.emoji];
                      const hasReacted = reactionData?.hasReacted || false;
                      const count = reactionData?.count || 0;
                      
                      return (
                        <Button
                          key={reaction.emoji}
                          variant={hasReacted ? 'default' : 'outline'}
                          size="sm"
                          className={`transition-all duration-200 ${
                            hasReacted ? 'scale-110 shadow-lg' : 'hover:scale-105'
                          }`}
                          onClick={() => handleReaction(photoId, reaction.emoji, reaction.haptic)}
                        >
                          <span className="text-lg mr-1">{reaction.emoji}</span>
                          {count > 0 && count}
                        </Button>
                      );
                    })}
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    {data.totalReactions} total reactions
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* AI Best Moments Reel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-purple-500" />
            AI-Curated Best Moments
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button 
              onClick={generateBestMomentsReel}
              disabled={isGeneratingReel}
              className="flex items-center gap-2"
            >
              {isGeneratingReel ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4" />
                  Generate Reel
                </>
              )}
            </Button>
            
            {bestMomentsReel.length > 0 && (
              <Button 
                variant="outline" 
                onClick={playSlideShowRecap}
                className="flex items-center gap-2"
              >
                {isRecapPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isRecapPlaying ? 'Pause' : 'Play'} Slideshow
              </Button>
            )}
          </div>

          {isRecapPlaying && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Playing best moments...</span>
                <span>{Math.round(recapProgress)}%</span>
              </div>
              <Progress value={recapProgress} />
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                <Badge variant="secondary">
                  <Music className="h-3 w-3 mr-1" />
                  Auto-mixed soundtrack
                </Badge>
              </div>
            </div>
          )}

          {bestMomentsReel.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium">Curated Highlights ({bestMomentsReel.length} moments)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bestMomentsReel.map((moment) => (
                  <Card key={moment.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="relative aspect-square">
                        <img 
                          src={moment.url} 
                          alt="Best moment" 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-purple-500">
                            <Trophy className="h-3 w-3 mr-1" />
                            {moment.aiScore}
                          </Badge>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                          <p className="text-white text-xs mb-1">{moment.reason}</p>
                          <div className="flex items-center justify-between text-white text-xs">
                            <span>{moment.engagement} reactions</span>
                            <span>{moment.duration}s</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="flex gap-3">
                <Button className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download Reel
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Share className="h-4 w-4" />
                  Share Highlights
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Real-time Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-500" />
            Live Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { user: 'Sarah M.', action: 'reacted ❤️ to', target: 'couple photo', time: '2s ago' },
              { user: 'John D.', action: 'uploaded', target: '3 new photos', time: '1m ago' },
              { user: 'Emma K.', action: 'reacted 🔥 to', target: 'dance video', time: '2m ago' },
              { user: 'Mike R.', action: 'commented on', target: 'group photo', time: '3m ago' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{activity.user.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-sm">
                  <span className="font-medium">{activity.user}</span>
                  <span className="text-muted-foreground"> {activity.action} </span>
                  <span className="font-medium">{activity.target}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EngagementLayer;