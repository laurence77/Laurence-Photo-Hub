import { useState, useEffect } from 'react';
import { getImagePath } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Heart, 
  MessageCircle, 
  Share, 
  Play,
  Pause,
  Maximize,
  Users,
  Clock,
  Camera,
  Video,
  Sparkles,
  Eye,
  Monitor
} from 'lucide-react';

interface PhotoItem {
  id: string;
  type: 'photo' | 'video';
  url: string;
  thumbnail: string;
  uploadedBy: string;
  uploadedAt: Date;
  likes: number;
  comments: number;
  aiTags: string[];
  facesCount: number;
  isNew?: boolean;
}

const RealTimePhotoWall = () => {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'slideshow' | 'ar'>('grid');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Mock real-time photo data
  const mockPhotos: PhotoItem[] = [
    {
      id: '1',
      type: 'photo',
      url: getImagePath('/uploads/a0278ce1-b82d-4ed6-a186-14a9503ef65c.png'),
      thumbnail: getImagePath('/uploads/a0278ce1-b82d-4ed6-a186-14a9503ef65c.png'),
      uploadedBy: 'Sarah M.',
      uploadedAt: new Date(Date.now() - 5000),
      likes: 12,
      comments: 3,
      aiTags: ['wedding', 'couple', 'outdoor', 'sunset'],
      facesCount: 2,
      isNew: true
    },
    {
      id: '2',
      type: 'photo',
      url: getImagePath('/uploads/34a58283-8b82-48f9-88f4-2c88b069921d.png'),
      thumbnail: getImagePath('/uploads/34a58283-8b82-48f9-88f4-2c88b069921d.png'),
      uploadedBy: 'John D.',
      uploadedAt: new Date(Date.now() - 15000),
      likes: 8,
      comments: 1,
      aiTags: ['celebration', 'group', 'indoor'],
      facesCount: 5
    },
    {
      id: '3',
      type: 'video',
      url: getImagePath('/uploads/47f9a1d0-4458-400a-8fc0-79adf093cf18.png'),
      thumbnail: getImagePath('/uploads/47f9a1d0-4458-400a-8fc0-79adf093cf18.png'),
      uploadedBy: 'Emma K.',
      uploadedAt: new Date(Date.now() - 30000),
      likes: 15,
      comments: 7,
      aiTags: ['dance', 'music', 'party'],
      facesCount: 8
    },
    {
      id: '4',
      type: 'photo',
      url: getImagePath('/uploads/af28398b-9e23-4e2b-9de1-bda457e09fd8.png'),
      thumbnail: getImagePath('/uploads/af28398b-9e23-4e2b-9de1-bda457e09fd8.png'),
      uploadedBy: 'Mike R.',
      uploadedAt: new Date(Date.now() - 45000),
      likes: 6,
      comments: 2,
      aiTags: ['food', 'dinner', 'table'],
      facesCount: 4
    },
    {
      id: '5',
      type: 'photo',
      url: getImagePath('/uploads/dabbf929-5dd0-4794-a011-fe43bf4b3418.png'),
      thumbnail: getImagePath('/uploads/dabbf929-5dd0-4794-a011-fe43bf4b3418.png'),
      uploadedBy: 'Lisa T.',
      uploadedAt: new Date(Date.now() - 60000),
      likes: 20,
      comments: 12,
      aiTags: ['garden', 'flowers', 'nature'],
      facesCount: 1
    }
  ];

  useEffect(() => {
    // Initialize with mock data
    setPhotos(mockPhotos);

    // Simulate real-time updates
    const interval = setInterval(() => {
      const newPhoto: PhotoItem = {
        id: Date.now().toString(),
        type: Math.random() > 0.7 ? 'video' : 'photo',
        url: mockPhotos[Math.floor(Math.random() * mockPhotos.length)].url,
        thumbnail: mockPhotos[Math.floor(Math.random() * mockPhotos.length)].thumbnail,
        uploadedBy: ['Alex S.', 'Jamie P.', 'Taylor W.', 'Morgan L.'][Math.floor(Math.random() * 4)],
        uploadedAt: new Date(),
        likes: Math.floor(Math.random() * 25),
        comments: Math.floor(Math.random() * 10),
        aiTags: [
          ['party', 'fun', 'celebration'],
          ['beautiful', 'moment', 'joy'],
          ['friends', 'together', 'happy'],
          ['amazing', 'perfect', 'love']
        ][Math.floor(Math.random() * 4)],
        facesCount: Math.floor(Math.random() * 6) + 1,
        isNew: true
      };

      setPhotos(prev => {
        // Remove isNew flag from previous photos
        const updatedPhotos = prev.map(photo => ({ ...photo, isNew: false }));
        return [newPhoto, ...updatedPhotos].slice(0, 20); // Keep only latest 20
      });

      // Remove new flag after animation
      setTimeout(() => {
        setPhotos(prev => prev.map(photo => ({ ...photo, isNew: false })));
      }, 2000);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const handleLike = (photoId: string) => {
    setPhotos(prev => prev.map(photo => 
      photo.id === photoId 
        ? { ...photo, likes: photo.likes + 1 }
        : photo
    ));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  if (viewMode === 'slideshow') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => setViewMode('grid')}
            >
              Back to Grid
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setIsAutoPlay(!isAutoPlay)}
            >
              {isAutoPlay ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {isAutoPlay ? 'Pause' : 'Play'}
            </Button>
            <Button variant="outline" onClick={toggleFullscreen}>
              <Maximize className="h-4 w-4 mr-2" />
              Fullscreen
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              <Eye className="h-3 w-3 mr-1" />
              Slideshow Mode
            </Badge>
          </div>
        </div>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="aspect-video bg-black flex items-center justify-center">
              {photos.length > 0 && (
                <img 
                  src={photos[0].url} 
                  alt="Slideshow" 
                  className="max-w-full max-h-full object-contain"
                />
              )}
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{photos[0]?.uploadedBy.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{photos[0]?.uploadedBy}</p>
                    <p className="text-sm text-muted-foreground">{formatTimeAgo(photos[0]?.uploadedAt)}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {photos[0]?.aiTags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (viewMode === 'ar') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => setViewMode('grid')}
            >
              Exit AR Mode
            </Button>
          </div>
          <Badge variant="outline" className="text-orange-500">
            <Eye className="h-3 w-3 mr-1" />
            AR/VR Gallery Mode
          </Badge>
        </div>

        <Card>
          <CardContent className="p-12 text-center">
            <Eye className="h-16 w-16 mx-auto mb-6 text-orange-500" />
            <h3 className="text-2xl font-bold mb-4">AR/VR Gallery Mode</h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Experience photos in immersive 3D space with Apple Vision Pro style transitions. 
              Photos float around you in a virtual gallery environment.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="p-6 border rounded-lg">
                <Monitor className="h-8 w-8 mx-auto mb-3 text-blue-500" />
                <h4 className="font-semibold mb-2">Desktop VR</h4>
                <p className="text-sm text-muted-foreground">Full immersive experience with WebXR support</p>
              </div>
              <div className="p-6 border rounded-lg">
                <Eye className="h-8 w-8 mx-auto mb-3 text-purple-500" />
                <h4 className="font-semibold mb-2">Apple Vision Pro</h4>
                <p className="text-sm text-muted-foreground">Native spatial computing experience</p>
              </div>
            </div>
            <div className="mt-8">
              <Badge variant="secondary">Coming Soon - WebXR Integration</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Live Updates</span>
          </div>
          <Badge variant="outline">
            {photos.length} photos
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant={viewMode === 'grid' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            Grid
          </Button>
          <Button 
            variant={viewMode === 'slideshow' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('slideshow')}
          >
            <Play className="h-4 w-4 mr-2" />
            Slideshow
          </Button>
          <Button 
            variant={viewMode === 'ar' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('ar')}
          >
            <Eye className="h-4 w-4 mr-2" />
            AR/VR
          </Button>
        </div>
      </div>

      {/* Photo Wall Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {photos.map((photo, index) => (
          <Card 
            key={photo.id} 
            className={`group overflow-hidden transition-all duration-500 ${
              photo.isNew ? 'ring-2 ring-green-500 shadow-lg scale-105' : 'hover:shadow-lg hover:-translate-y-1'
            }`}
          >
            <CardContent className="p-0">
              <div className="relative aspect-square">
                <img 
                  src={photo.thumbnail} 
                  alt={`Photo by ${photo.uploadedBy}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {photo.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <Play className="h-12 w-12 text-white" />
                  </div>
                )}
                {photo.isNew && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-green-500 animate-pulse">
                      <Sparkles className="h-3 w-3 mr-1" />
                      New
                    </Badge>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                  <div className="flex items-center justify-between text-white text-sm">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {photo.uploadedBy.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{photo.uploadedBy}</span>
                    </div>
                    <span>{formatTimeAgo(photo.uploadedAt)}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-3 space-y-3">
                <div className="flex flex-wrap gap-1">
                  {photo.aiTags.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {photo.facesCount > 0 && (
                    <Badge variant="outline" className="text-xs">
                      <Users className="h-3 w-3 mr-1" />
                      {photo.facesCount}
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <button 
                      onClick={() => handleLike(photo.id)}
                      className="flex items-center gap-1 hover:text-red-500 transition-colors"
                    >
                      <Heart className="h-4 w-4" />
                      {photo.likes}
                    </button>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      {photo.comments}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Share className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {photos.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Camera className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No photos yet</h3>
            <p className="text-muted-foreground">
              Photos and videos will appear here in real-time as guests upload them.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RealTimePhotoWall;