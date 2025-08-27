import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { updateSEOTags, SEO_CONFIGS, generateEventStructuredData, insertStructuredData, trackPageView } from '@/utils/seoUtils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar,
  MapPin,
  Users,
  Camera,
  Heart,
  Share2,
  Download,
  ExternalLink,
  Star,
  Clock,
  Eye,
  Sparkles,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';

interface EventRecapData {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  organizer: {
    name: string;
    avatar?: string;
  };
  stats: {
    totalPhotos: number;
    totalGuests: number;
    totalReactions: number;
    viewCount: number;
  };
  highlights: {
    id: string;
    url: string;
    caption?: string;
    reactions: number;
    timestamp: string;
  }[];
  slideshow?: {
    photos: string[];
    music?: string;
    duration: number;
  };
  tags: string[];
  isPublic: boolean;
  seoData: {
    metaTitle: string;
    metaDescription: string;
    ogImage: string;
    canonicalUrl: string;
  };
}

const EventRecap = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventRecapData | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock data - in real implementation, this would fetch from API
  useEffect(() => {
    const mockEventData: EventRecapData = {
      id: eventId || 'sample',
      title: "Sarah & John's Wedding Celebration",
      description: "A magical evening celebrating the union of Sarah and John at Riverside Gardens. An unforgettable night filled with love, laughter, and beautiful moments captured forever.",
      date: "2024-09-15",
      location: "Riverside Gardens, Napa Valley",
      organizer: {
        name: "Laurence Photography",
        avatar: "/uploads/photographer-avatar.jpg"
      },
      stats: {
        totalPhotos: 234,
        totalGuests: 85,
        totalReactions: 492,
        viewCount: 1247
      },
      highlights: [
        {
          id: "1",
          url: "/uploads/a0278ce1-b82d-4ed6-a186-14a9503ef65c.png",
          caption: "The magical first kiss as husband and wife",
          reactions: 47,
          timestamp: "2024-09-15T18:30:00Z"
        },
        {
          id: "2", 
          url: "/uploads/34a58283-8b82-48f9-88f4-2c88b069921d.png",
          caption: "Golden hour portraits in the vineyard",
          reactions: 38,
          timestamp: "2024-09-15T17:45:00Z"
        },
        {
          id: "3",
          url: "/uploads/47f9a1d0-4458-400a-8fc0-79adf093cf18.png", 
          caption: "Dancing under the stars",
          reactions: 52,
          timestamp: "2024-09-15T21:15:00Z"
        },
        {
          id: "4",
          url: "/uploads/af28398b-9e23-4e2b-9de1-bda457e09fd8.png",
          caption: "Joy and celebration with loved ones",
          reactions: 41,
          timestamp: "2024-09-15T19:20:00Z"
        }
      ],
      slideshow: {
        photos: [
          "/uploads/a0278ce1-b82d-4ed6-a186-14a9503ef65c.png",
          "/uploads/34a58283-8b82-48f9-88f4-2c88b069921d.png",
          "/uploads/47f9a1d0-4458-400a-8fc0-79adf093cf18.png",
          "/uploads/af28398b-9e23-4e2b-9de1-bda457e09fd8.png"
        ],
        music: "romantic-ballad.mp3",
        duration: 3000
      },
      tags: [
        "wedding", "napa-valley", "outdoor-wedding", "golden-hour", 
        "romantic", "vineyard-wedding", "celebration", "love-story"
      ],
      isPublic: true,
      seoData: {
        metaTitle: "Sarah & John's Wedding - Beautiful Napa Valley Wedding Photos | Laurence Photo Hub",
        metaDescription: "Experience the magical wedding celebration of Sarah & John at Riverside Gardens. View stunning wedding photos, highlights, and memories from their special day in Napa Valley.",
        ogImage: "/uploads/a0278ce1-b82d-4ed6-a186-14a9503ef65c.png",
        canonicalUrl: `https://laurencephotohub.com/recap/${eventId}`
      }
    };

    // Simulate API call
    setTimeout(() => {
      setEvent(mockEventData);
      setLoading(false);
    }, 1000);

    // Update SEO meta tags using utility
    if (mockEventData) {
      const eventSEOData = {
        id: mockEventData.id,
        title: mockEventData.title,
        description: mockEventData.description,
        date: mockEventData.date,
        location: mockEventData.location,
        organizer: mockEventData.organizer.name,
        images: mockEventData.highlights.map(h => h.url),
        tags: mockEventData.tags,
        url: mockEventData.seoData.canonicalUrl
      };

      updateSEOTags(SEO_CONFIGS.eventRecap(eventSEOData));
      
      // Add structured data
      const structuredData = generateEventStructuredData(eventSEOData);
      insertStructuredData(structuredData, 'event-structured-data');
      
      // Track page view
      trackPageView(`/recap/${eventId}`, mockEventData.title);
    }
  }, [eventId]);

  // Auto-play slideshow
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && event?.slideshow) {
      interval = setInterval(() => {
        setCurrentSlide(prev => 
          prev === (event.slideshow!.photos.length - 1) ? 0 : prev + 1
        );
      }, event.slideshow.duration);
    }
    return () => clearInterval(interval);
  }, [isPlaying, event?.slideshow]);

  const handleShare = async () => {
    const shareData = {
      title: event?.title,
      text: event?.description,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const nextSlide = () => {
    if (event?.slideshow) {
      setCurrentSlide(prev => 
        prev === (event.slideshow!.photos.length - 1) ? 0 : prev + 1
      );
    }
  };

  const prevSlide = () => {
    if (event?.slideshow) {
      setCurrentSlide(prev => 
        prev === 0 ? (event.slideshow!.photos.length - 1) : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event recap...</p>
        </div>
      </div>
    );
  }

  if (!event || !event.isPublic) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 flex items-center justify-center">
        <div className="glass-card p-8 text-center max-w-md">
          <h1 className="text-2xl font-serif font-medium mb-4 text-gradient-electric">Event Not Found</h1>
          <p className="text-gray-600 mb-6">This event recap is not available or has been made private.</p>
          <Button onClick={() => navigate('/')} className="electric-bg text-white hover:electric-glow vision-pro-rounded">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20">
      {/* Header */}
      <header className="glass-panel sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="glass-button electric-accent hover:electric-bg hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Hub
            </Button>
            
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={handleShare}
                className="glass-button electric-border electric-accent hover:electric-bg hover:text-white"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <div className="glass-card p-8 mb-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary" className="electric-border">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Public Recap
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Eye className="h-3 w-3 mr-1" />
                  {event.stats.viewCount} views
                </Badge>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-serif font-medium mb-4 text-gradient-electric leading-tight">
                {event.title}
              </h1>
              
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                {event.description}
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar className="h-5 w-5 electric-accent" />
                  <span>{new Date(event.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin className="h-5 w-5 electric-accent" />
                  <span>{event.location}</span>
                </div>
                
                <div className="flex items-center gap-3 text-gray-600">
                  <Camera className="h-5 w-5 electric-accent" />
                  <span>by {event.organizer.name}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold electric-accent">{event.stats.totalPhotos}</div>
                  <div className="text-sm text-gray-600">Photos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold electric-accent">{event.stats.totalGuests}</div>
                  <div className="text-sm text-gray-600">Guests</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold electric-accent">{event.stats.totalReactions}</div>
                  <div className="text-sm text-gray-600">Reactions</div>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="relative">
              <div className="glass-card overflow-hidden">
                <img
                  src={event.highlights[0]?.url}
                  alt="Event highlight"
                  className="w-full h-96 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Slideshow */}
        {event.slideshow && (
          <div className="glass-card p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif font-medium text-gradient-electric">Photo Slideshow</h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="glass-button electric-border"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="relative overflow-hidden vision-pro-rounded">
                <img
                  src={event.slideshow.photos[currentSlide]}
                  alt={`Slide ${currentSlide + 1}`}
                  className="w-full h-96 object-cover transition-all duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />
                
                {/* Navigation arrows */}
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 glass-button p-2 electric-accent hover:electric-bg hover:text-white"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 glass-button p-2 electric-accent hover:electric-bg hover:text-white"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                {/* Slide indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {event.slideshow.photos.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentSlide ? 'electric-bg' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Highlight Gallery */}
        <div className="glass-card p-6 mb-8">
          <h2 className="text-2xl font-serif font-medium mb-6 text-gradient-electric">Event Highlights</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {event.highlights.map((highlight, index) => (
              <div key={highlight.id} className="glass-card overflow-hidden group">
                <div className="relative">
                  <img
                    src={highlight.url}
                    alt={highlight.caption}
                    className="w-full h-64 object-cover transition-transform group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4" />
                          <span className="text-sm">{highlight.reactions}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm">
                            {new Date(highlight.timestamp).toLocaleTimeString('en-US', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {highlight.caption && (
                  <div className="p-4">
                    <p className="text-gray-600 text-sm">{highlight.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tags and SEO */}
        <div className="glass-card p-6 mb-8">
          <h3 className="text-lg font-medium mb-4 text-gradient-electric">Event Tags</h3>
          <div className="flex flex-wrap gap-2">
            {event.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="electric-border">
                #{tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="glass-card p-8 text-center">
          <h2 className="text-3xl font-serif font-medium mb-4 text-gradient-electric">
            Create Your Own Event Recap
          </h2>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Capture and share your special moments with beautiful, SEO-optimized event recaps 
            that your guests will treasure forever.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/')}
              className="electric-bg text-white hover:electric-glow vision-pro-rounded apple-spring"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Start Free Trial
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/pricing')}
              className="glass-button electric-border electric-accent hover:electric-bg hover:text-white"
            >
              View Plans
            </Button>
          </div>
        </div>
      </div>

      {/* Structured Data for SEO */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Event",
          "name": event.title,
          "description": event.description,
          "startDate": event.date,
          "location": {
            "@type": "Place",
            "name": event.location
          },
          "organizer": {
            "@type": "Organization",
            "name": event.organizer.name
          },
          "image": event.highlights.map(h => h.url),
          "url": window.location.href
        })}
      </script>
    </div>
  );
};

export default EventRecap;