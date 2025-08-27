import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { updateSEOTags, SEO_CONFIGS, insertStructuredData, trackPageView } from '@/utils/seoUtils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar,
  MapPin,
  Camera,
  Heart,
  Eye,
  Users,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
  Clock,
  Star,
  TrendingUp
} from 'lucide-react';

interface PublicEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  organizer: {
    name: string;
    verified: boolean;
  };
  thumbnail: string;
  stats: {
    photos: number;
    reactions: number;
    views: number;
  };
  tags: string[];
  featured: boolean;
  type: 'wedding' | 'corporate' | 'birthday' | 'graduation' | 'anniversary' | 'other';
}

const PublicEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<PublicEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  // Mock data - in production, this would come from API
  useEffect(() => {
    const mockEvents: PublicEvent[] = [
      {
        id: 'sarah-john-wedding',
        title: "Sarah & John's Wedding Celebration",
        description: "A magical evening celebrating love at Riverside Gardens in Napa Valley",
        date: '2024-09-15',
        location: 'Napa Valley, CA',
        organizer: {
          name: 'Laurence Photography',
          verified: true
        },
        thumbnail: '/uploads/a0278ce1-b82d-4ed6-a186-14a9503ef65c.png',
        stats: {
          photos: 234,
          reactions: 492,
          views: 1247
        },
        tags: ['wedding', 'napa-valley', 'outdoor', 'romantic'],
        featured: true,
        type: 'wedding'
      },
      {
        id: 'tech-summit-2024',
        title: 'Innovation Tech Summit 2024',
        description: 'Leading tech innovators gathering for groundbreaking discussions',
        date: '2024-09-10',
        location: 'San Francisco, CA',
        organizer: {
          name: 'Corporate Events Pro',
          verified: true
        },
        thumbnail: '/uploads/34a58283-8b82-48f9-88f4-2c88b069921d.png',
        stats: {
          photos: 156,
          reactions: 278,
          views: 892
        },
        tags: ['corporate', 'technology', 'networking', 'professional'],
        featured: false,
        type: 'corporate'
      },
      {
        id: 'emma-graduation',
        title: "Emma's Harvard Graduation",
        description: 'Celebrating academic excellence and new beginnings',
        date: '2024-09-08',
        location: 'Cambridge, MA',
        organizer: {
          name: 'Family Moments',
          verified: false
        },
        thumbnail: '/uploads/47f9a1d0-4458-400a-8fc0-79adf093cf18.png',
        stats: {
          photos: 89,
          reactions: 156,
          views: 523
        },
        tags: ['graduation', 'family', 'celebration', 'academic'],
        featured: false,
        type: 'graduation'
      },
      {
        id: 'golden-anniversary',
        title: 'Robert & Mary - 50 Years Together',
        description: 'Golden anniversary celebration with family and friends',
        date: '2024-09-05',
        location: 'Portland, OR',
        organizer: {
          name: 'Anniversary Celebrations',
          verified: true
        },
        thumbnail: '/uploads/af28398b-9e23-4e2b-9de1-bda457e09fd8.png',
        stats: {
          photos: 112,
          reactions: 234,
          views: 698
        },
        tags: ['anniversary', 'family', 'milestone', 'celebration'],
        featured: false,
        type: 'anniversary'
      }
    ];

    setTimeout(() => {
      setEvents(mockEvents);
      setLoading(false);
    }, 800);

    // Set SEO meta tags using utilities
    updateSEOTags(SEO_CONFIGS.publicEvents);
    
    // Track page view
    trackPageView('/events', 'Public Event Recaps');
    
    // Add structured data for the event list
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Public Event Recaps",
      "description": "Beautiful public event photography recaps",
      "url": window.location.href,
      "numberOfItems": mockEvents.length,
      "itemListElement": mockEvents.map((event, index) => ({
        "@type": "Event",
        "position": index + 1,
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
        "image": event.thumbnail,
        "url": `${window.location.origin}/recap/${event.id}`
      }))
    };
    
    insertStructuredData(structuredData, 'events-list-structured-data');
  }, []);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = selectedFilter === 'all' || event.type === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const featuredEvent = events.find(event => event.featured);
  const regularEvents = filteredEvents.filter(event => !event.featured);

  const eventTypes = [
    { value: 'all', label: 'All Events', icon: Sparkles },
    { value: 'wedding', label: 'Weddings', icon: Heart },
    { value: 'corporate', label: 'Corporate', icon: Users },
    { value: 'graduation', label: 'Graduations', icon: Star },
    { value: 'anniversary', label: 'Anniversaries', icon: Calendar }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading public events...</p>
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
              Laurence Photo Hub
            </Button>
            
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/account')}
                className="glass-button electric-border electric-accent hover:electric-bg hover:text-white"
              >
                Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-6xl font-serif font-medium mb-6 text-gradient-electric leading-tight">
            Public Event Recaps
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover stunning event photography and get inspired by beautiful celebrations 
            shared by our community of professional photographers and event organizers.
          </p>

          {/* Search and Filter */}
          <div className="glass-card p-6 max-w-4xl mx-auto mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events, locations, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 glass-focus vision-pro-rounded border border-gray-200 focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto">
                {eventTypes.map((type) => (
                  <Button
                    key={type.value}
                    variant={selectedFilter === type.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedFilter(type.value)}
                    className={selectedFilter === type.value ? 
                      'electric-bg text-white vision-pro-rounded' : 
                      'glass-button electric-border electric-accent hover:electric-bg hover:text-white vision-pro-rounded'
                    }
                  >
                    <type.icon className="h-4 w-4 mr-2" />
                    {type.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Featured Event */}
        {featuredEvent && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="h-5 w-5 electric-accent" />
              <h2 className="text-2xl font-serif font-medium text-gradient-electric">Featured Event</h2>
            </div>

            <Link to={`/recap/${featuredEvent.id}`} className="group block">
              <div className="glass-card p-0 overflow-hidden group-hover:scale-[1.02] transition-transform duration-300">
                <div className="grid lg:grid-cols-2 gap-0">
                  <div className="relative h-96 lg:h-auto">
                    <img
                      src={featuredEvent.thumbnail}
                      alt={featuredEvent.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className="electric-bg text-white">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    </div>
                  </div>

                  <div className="p-8 flex flex-col justify-center">
                    <div className="mb-4">
                      <Badge variant="outline" className="electric-border mb-3">
                        {featuredEvent.type}
                      </Badge>
                      <h3 className="text-3xl font-serif font-medium mb-4 text-gradient-electric group-hover:text-blue-600 transition-colors">
                        {featuredEvent.title}
                      </h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {featuredEvent.description}
                      </p>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-gray-600">
                        <Calendar className="h-4 w-4 electric-accent" />
                        <span>{new Date(featuredEvent.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <MapPin className="h-4 w-4 electric-accent" />
                        <span>{featuredEvent.location}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <Camera className="h-4 w-4 electric-accent" />
                        <span>by {featuredEvent.organizer.name}</span>
                        {featuredEvent.organizer.verified && (
                          <Badge variant="secondary" className="text-xs">Verified</Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Camera className="h-4 w-4" />
                          <span>{featuredEvent.stats.photos}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          <span>{featuredEvent.stats.reactions}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span>{featuredEvent.stats.views}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center text-blue-600 group-hover:text-blue-700 transition-colors">
                      <span className="font-medium mr-2">View Event Recap</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Event Grid */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-serif font-medium text-gradient-electric">Recent Events</h2>
            <p className="text-gray-600">{filteredEvents.length} events found</p>
          </div>

          {regularEvents.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium mb-2 text-gray-600">No events found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularEvents.map((event) => (
                <Link key={event.id} to={`/recap/${event.id}`} className="group">
                  <div className="glass-card p-0 overflow-hidden group-hover:scale-105 transition-transform duration-200">
                    <div className="relative">
                      <img
                        src={event.thumbnail}
                        alt={event.title}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                      <div className="absolute top-3 right-3">
                        <Badge variant="secondary" className="text-xs">
                          {event.type}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-lg font-medium mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {event.description}
                      </p>

                      <div className="space-y-2 mb-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3" />
                          <span>{event.location}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Camera className="h-3 w-3" />
                            <span>{event.stats.photos}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            <span>{event.stats.reactions}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            <span>{event.stats.views}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="glass-card p-8 text-center">
          <h2 className="text-3xl font-serif font-medium mb-4 text-gradient-electric">
            Share Your Event Story
          </h2>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Create beautiful, shareable event recaps that will be discovered and loved by others. 
            Join our community of event storytellers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/')}
              className="electric-bg text-white hover:electric-glow vision-pro-rounded apple-spring"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Start Creating
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/account')}
              className="glass-button electric-border electric-accent hover:electric-bg hover:text-white"
            >
              View Dashboard
            </Button>
          </div>
        </div>
      </div>

      {/* Structured Data for SEO */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": "Public Event Recaps",
          "description": "Beautiful public event photography recaps from weddings, corporate events, and celebrations",
          "url": window.location.href,
          "numberOfItems": events.length,
          "itemListElement": events.map((event, index) => ({
            "@type": "Event",
            "position": index + 1,
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
            "image": event.thumbnail,
            "url": `${window.location.origin}/recap/${event.id}`
          }))
        })}
      </script>
    </div>
  );
};

export default PublicEvents;