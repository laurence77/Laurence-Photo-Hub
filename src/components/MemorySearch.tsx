import { useState, useEffect, useRef } from 'react';
import { getImagePath } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Brain, 
  Sparkles, 
  Camera,
  Calendar,
  MapPin,
  Users,
  Heart,
  Clock,
  Filter,
  Mic,
  MicOff,
  Loader2,
  History,
  Star,
  Eye,
  Share,
  Download,
  Zap,
  TrendingUp,
  Image,
  Video,
  Smile,
  Sun,
  Moon,
  CloudRain,
  Palette,
  Music,
  Coffee,
  Gift,
  Cake,
  Flower2,
  Car,
  Home,
  Building,
  TreePine
} from 'lucide-react';

interface SearchResult {
  id: string;
  type: 'photo' | 'video';
  url: string;
  thumbnail: string;
  filename: string;
  timestamp: Date;
  location?: string;
  people: string[];
  objects: string[];
  emotions: string[];
  activities: string[];
  colors: string[];
  weather?: string;
  timeOfDay: string;
  relevanceScore: number;
  matchedTerms: string[];
  context: string;
}

interface SearchQuery {
  text: string;
  timestamp: Date;
  resultsCount: number;
  category: string;
}

interface SearchSuggestion {
  text: string;
  category: string;
  icon: JSX.Element;
  popularity: number;
}

const MemorySearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchQuery[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Mock search results
  const mockResults: SearchResult[] = [
    {
      id: '1',
      type: 'photo',
      url: getImagePath('/uploads/a0278ce1-b82d-4ed6-a186-14a9503ef65c.png'),
      thumbnail: getImagePath('/uploads/a0278ce1-b82d-4ed6-a186-14a9503ef65c.png'),
      filename: 'wedding_ceremony_kiss.jpg',
      timestamp: new Date('2024-08-15T16:30:00'),
      location: 'Garden Venue, San Francisco',
      people: ['Sarah', 'Michael', 'Wedding Party'],
      objects: ['wedding dress', 'bouquet', 'flowers', 'arch', 'rings'],
      emotions: ['joy', 'love', 'excitement', 'happiness'],
      activities: ['kissing', 'ceremony', 'celebrating'],
      colors: ['white', 'pink', 'green', 'gold'],
      weather: 'sunny',
      timeOfDay: 'afternoon',
      relevanceScore: 0.95,
      matchedTerms: ['wedding', 'Sarah', 'kiss', 'ceremony'],
      context: 'The magical first kiss as newlyweds during the wedding ceremony'
    },
    {
      id: '2',
      type: 'video',
      url: getImagePath('/uploads/34a58283-8b82-48f9-88f4-2c88b069921d.png'),
      thumbnail: getImagePath('/uploads/34a58283-8b82-48f9-88f4-2c88b069921d.png'),
      filename: 'first_dance_video.mp4',
      timestamp: new Date('2024-08-15T20:15:00'),
      location: 'Reception Hall',
      people: ['Sarah', 'Michael'],
      objects: ['dance floor', 'lights', 'music', 'guests'],
      emotions: ['romantic', 'joy', 'peaceful'],
      activities: ['dancing', 'spinning', 'laughing'],
      colors: ['gold', 'amber', 'warm'],
      weather: 'clear',
      timeOfDay: 'evening',
      relevanceScore: 0.88,
      matchedTerms: ['dance', 'Sarah', 'romantic'],
      context: 'First dance as married couple under romantic lighting'
    },
    {
      id: '3',
      type: 'photo',
      url: getImagePath('/uploads/47f9a1d0-4458-400a-8fc0-79adf093cf18.png'),
      thumbnail: getImagePath('/uploads/47f9a1d0-4458-400a-8fc0-79adf093cf18.png'),
      filename: 'sunset_group_photo.jpg',
      timestamp: new Date('2024-08-15T19:45:00'),
      location: 'Terrace Overlooking Bay',
      people: ['Sarah', 'Michael', 'Family', 'Friends'],
      objects: ['sunset', 'city skyline', 'champagne', 'group'],
      emotions: ['happiness', 'celebration', 'gratitude'],
      activities: ['posing', 'toasting', 'celebrating'],
      colors: ['orange', 'purple', 'gold', 'pink'],
      weather: 'clear',
      timeOfDay: 'sunset',
      relevanceScore: 0.82,
      matchedTerms: ['sunset', 'group', 'celebration'],
      context: 'Golden hour group photo with stunning sunset backdrop'
    }
  ];

  const mockSuggestions: SearchSuggestion[] = [
    { text: 'photos of Sarah laughing', category: 'people', icon: <Smile className="h-4 w-4" />, popularity: 95 },
    { text: 'sunset moments', category: 'time', icon: <Sun className="h-4 w-4" />, popularity: 88 },
    { text: 'wedding ceremony photos', category: 'events', icon: <Heart className="h-4 w-4" />, popularity: 92 },
    { text: 'dancing videos', category: 'activities', icon: <Music className="h-4 w-4" />, popularity: 76 },
    { text: 'group photos with family', category: 'people', icon: <Users className="h-4 w-4" />, popularity: 84 },
    { text: 'outdoor celebrations', category: 'location', icon: <TreePine className="h-4 w-4" />, popularity: 71 },
    { text: 'romantic moments', category: 'emotions', icon: <Heart className="h-4 w-4" />, popularity: 89 },
    { text: 'golden hour photography', category: 'time', icon: <Camera className="h-4 w-4" />, popularity: 78 }
  ];

  const mockHistory: SearchQuery[] = [
    { text: 'photos of Sarah smiling', timestamp: new Date(Date.now() - 3600000), resultsCount: 24, category: 'people' },
    { text: 'wedding ceremony moments', timestamp: new Date(Date.now() - 7200000), resultsCount: 18, category: 'events' },
    { text: 'sunset photos from last month', timestamp: new Date(Date.now() - 86400000), resultsCount: 12, category: 'time' },
    { text: 'dancing videos', timestamp: new Date(Date.now() - 172800000), resultsCount: 8, category: 'activities' }
  ];

  useEffect(() => {
    setSuggestions(mockSuggestions);
    setSearchHistory(mockHistory);
  }, []);

  const handleSearch = async (query: string = searchQuery) => {
    if (!query.trim()) return;

    setIsSearching(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Filter results based on query relevance
    const filteredResults = mockResults.filter(result => {
      const searchTerms = query.toLowerCase().split(' ');
      return searchTerms.some(term => 
        result.people.some(person => person.toLowerCase().includes(term)) ||
        result.objects.some(object => object.toLowerCase().includes(term)) ||
        result.emotions.some(emotion => emotion.toLowerCase().includes(term)) ||
        result.activities.some(activity => activity.toLowerCase().includes(term)) ||
        result.context.toLowerCase().includes(term) ||
        result.filename.toLowerCase().includes(term)
      );
    });

    // Add to search history
    const newHistoryItem: SearchQuery = {
      text: query,
      timestamp: new Date(),
      resultsCount: filteredResults.length,
      category: determineCategory(query)
    };

    setSearchHistory(prev => [newHistoryItem, ...prev.slice(0, 9)]);
    setSearchResults(filteredResults);
    setIsSearching(false);
  };

  const determineCategory = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes('photo') || lowerQuery.includes('image')) return 'media';
    if (lowerQuery.includes('video') || lowerQuery.includes('clip')) return 'media';
    if (lowerQuery.includes('people') || lowerQuery.includes('person') || lowerQuery.match(/\b(sarah|michael|john|mary)\b/)) return 'people';
    if (lowerQuery.includes('sunset') || lowerQuery.includes('morning') || lowerQuery.includes('evening')) return 'time';
    if (lowerQuery.includes('wedding') || lowerQuery.includes('party') || lowerQuery.includes('celebration')) return 'events';
    if (lowerQuery.includes('happy') || lowerQuery.includes('sad') || lowerQuery.includes('romantic')) return 'emotions';
    if (lowerQuery.includes('dance') || lowerQuery.includes('eating') || lowerQuery.includes('walking')) return 'activities';
    return 'general';
  };

  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      handleSearch(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
      alert('Voice recognition error occurred');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'people': return <Users className="h-4 w-4" />;
      case 'time': return <Clock className="h-4 w-4" />;
      case 'events': return <Calendar className="h-4 w-4" />;
      case 'emotions': return <Heart className="h-4 w-4" />;
      case 'activities': return <Zap className="h-4 w-4" />;
      case 'location': return <MapPin className="h-4 w-4" />;
      case 'media': return <Camera className="h-4 w-4" />;
      default: return <Search className="h-4 w-4" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const getRelevanceColor = (score: number) => {
    if (score >= 0.9) return 'bg-green-100 text-green-800 border-green-200';
    if (score >= 0.7) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="space-y-6">
      {/* Search Interface */}
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-electric-blue" />
            Memory Search
          </CardTitle>
          <CardDescription>
            Search your photos naturally with AI-powered understanding
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Main Search Bar */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                ref={searchInputRef}
                placeholder="Search naturally... 'photos of Sarah laughing at the wedding' or 'sunset moments from last summer'"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 pr-4 h-12 text-lg"
              />
            </div>
            <Button
              onClick={() => handleVoiceSearch()}
              variant="outline"
              size="lg"
              className={`px-4 ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : ''}`}
            >
              {isListening ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </Button>
            <Button onClick={() => handleSearch()} size="lg" disabled={isSearching || !searchQuery.trim()}>
              {isSearching ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Filters and Options */}
          <div className="flex items-center gap-4 flex-wrap">
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Media</SelectItem>
                <SelectItem value="photos">Photos Only</SelectItem>
                <SelectItem value="videos">Videos Only</SelectItem>
                <SelectItem value="people">With People</SelectItem>
                <SelectItem value="recent">Recent</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="people">People Count</SelectItem>
                <SelectItem value="location">Location</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                Grid
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                List
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Interface Tabs */}
      <Tabs defaultValue="suggestions" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="suggestions">Smart Suggestions</TabsTrigger>
          <TabsTrigger value="results">Search Results</TabsTrigger>
          <TabsTrigger value="history">Search History</TabsTrigger>
        </TabsList>

        <TabsContent value="suggestions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-electric-blue" />
                Intelligent Suggestions
              </CardTitle>
              <CardDescription>
                Popular searches tailored to your photo collection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {suggestions
                  .sort((a, b) => b.popularity - a.popularity)
                  .map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto p-4 justify-start text-left hover:bg-muted/50"
                    onClick={() => {
                      setSearchQuery(suggestion.text);
                      handleSearch(suggestion.text);
                    }}
                  >
                    <div className="flex items-center gap-3 w-full">
                      {suggestion.icon}
                      <div className="flex-1">
                        <p className="font-medium">{suggestion.text}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {getCategoryIcon(suggestion.category)}
                            <span className="ml-1">{suggestion.category}</span>
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            {suggestion.popularity}%
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          {searchResults.length > 0 ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Search Results ({searchResults.length})
                  </CardTitle>
                  <Badge variant="outline">
                    Found in {Math.random() * 2 + 0.5}s
                  </Badge>
                </div>
                <CardDescription>
                  Results for "{searchQuery}"
                </CardDescription>
              </CardHeader>
              <CardContent>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {searchResults.map((result) => (
                      <Card key={result.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="aspect-square relative">
                          <img
                            src={result.thumbnail}
                            alt={result.filename}
                            className="w-full h-full object-cover"
                          />
                          {result.type === 'video' && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                              <Video className="h-8 w-8 text-white" />
                            </div>
                          )}
                          <div className="absolute top-2 right-2">
                            <Badge variant="outline" className={`${getRelevanceColor(result.relevanceScore)} text-xs`}>
                              {(result.relevanceScore * 100).toFixed(0)}% match
                            </Badge>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium truncate mb-2">{result.filename}</h3>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {result.context}
                          </p>
                          
                          <div className="space-y-2">
                            <div className="flex flex-wrap gap-1">
                              {result.matchedTerms.slice(0, 3).map((term, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {term}
                                </Badge>
                              ))}
                            </div>
                            
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatTimeAgo(result.timestamp)}
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {result.people.length}
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2 mt-3">
                            <Button variant="outline" size="sm" className="flex-1">
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              <Share className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {searchResults.map((result) => (
                      <Card key={result.id}>
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={result.thumbnail}
                                alt={result.filename}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="font-medium">{result.filename}</h3>
                                <Badge variant="outline" className={`${getRelevanceColor(result.relevanceScore)} text-xs`}>
                                  {(result.relevanceScore * 100).toFixed(0)}% match
                                </Badge>
                              </div>
                              
                              <p className="text-sm text-muted-foreground mb-3">
                                {result.context}
                              </p>
                              
                              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {result.timestamp.toLocaleDateString()}
                                </div>
                                {result.location && (
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {result.location}
                                  </div>
                                )}
                                <div className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {result.people.length} people
                                </div>
                              </div>
                              
                              <div className="flex flex-wrap gap-1 mb-3">
                                {result.matchedTerms.map((term, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {term}
                                  </Badge>
                                ))}
                              </div>
                              
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  <Eye className="h-3 w-3 mr-1" />
                                  View
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Share className="h-3 w-3 mr-1" />
                                  Share
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Download className="h-3 w-3 mr-1" />
                                  Download
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : searchQuery && !isSearching ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Search className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No Results Found</h3>
                <p className="text-muted-foreground mb-6">
                  Try different keywords or browse our smart suggestions
                </p>
                <Button onClick={() => setSearchQuery('')} variant="outline">
                  Clear Search
                </Button>
              </CardContent>
            </Card>
          ) : null}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <History className="h-5 w-5 text-electric-blue" />
                Recent Searches
              </CardTitle>
              <CardDescription>
                Your previous memory searches
              </CardDescription>
            </CardHeader>
            <CardContent>
              {searchHistory.length > 0 ? (
                <div className="space-y-2">
                  {searchHistory.map((query, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => {
                        setSearchQuery(query.text);
                        handleSearch(query.text);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        {getCategoryIcon(query.category)}
                        <div>
                          <p className="font-medium">{query.text}</p>
                          <p className="text-sm text-muted-foreground">
                            {query.resultsCount} results • {formatTimeAgo(query.timestamp)}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {query.category}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <History className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No search history yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MemorySearch;