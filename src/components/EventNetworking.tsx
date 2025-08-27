import React, { useState, useEffect } from 'react';
import { Users, Share2, Calendar, MapPin, Heart, MessageSquare, Star, Network, TrendingUp, Brain, Zap, Target, ChevronRight } from 'lucide-react';

interface Event {
  id: string;
  name: string;
  type: 'wedding' | 'birthday' | 'corporate' | 'festival' | 'graduation';
  date: Date;
  location: string;
  attendeeCount: number;
  photoCount: number;
  tags: string[];
  organizer: string;
  privacy: 'public' | 'private' | 'network';
  similarities: string[];
  connectionScore: number;
}

interface NetworkConnection {
  id: string;
  sourceEvent: string;
  targetEvent: string;
  connectionType: 'attendee_overlap' | 'venue_similarity' | 'theme_match' | 'photographer_shared';
  strength: number; // 0-1
  mutualAttendees: number;
  sharedPhotos: number;
  tags: string[];
}

interface CrossPollinationSuggestion {
  id: string;
  type: 'guest_invitation' | 'vendor_recommendation' | 'photo_sharing' | 'event_collaboration' | 'sponsor_matching' | 'location_sharing';
  sourceEvent: string;
  targetEvents: string[];
  description: string;
  potential: 'high' | 'medium' | 'low';
  expectedEngagement: number;
  privacy: 'respect' | 'suggest' | 'auto';
  aiScore: number;
  benefitType: 'mutual' | 'one_way' | 'network_wide';
  timeline: 'immediate' | 'short_term' | 'long_term';
}

export function EventNetworking() {
  const [connectedEvents, setConnectedEvents] = useState<Event[]>([]);
  const [networkConnections, setNetworkConnections] = useState<NetworkConnection[]>([]);
  const [suggestions, setSuggestions] = useState<CrossPollinationSuggestion[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [networkView, setNetworkView] = useState<'graph' | 'list'>('list');
  const [filterType, setFilterType] = useState<string>('all');
  const [privacyMode, setPrivacyMode] = useState<'strict' | 'balanced' | 'open'>('balanced');
  const [aiRecommendations, setAiRecommendations] = useState(true);
  const [networkGrowth, setNetworkGrowth] = useState({ weeklyGrowth: 12, monthlyConnections: 45, strongConnections: 8 });
  const [collaborationMode, setCollaborationMode] = useState<'passive' | 'active' | 'proactive'>('active');

  useEffect(() => {
    initializeEventNetwork();
  }, []);

  const initializeEventNetwork = () => {
    const mockEvents: Event[] = [
      {
        id: 'wedding-2024-001',
        name: 'Sarah & Michael Wedding',
        type: 'wedding',
        date: new Date('2024-09-15'),
        location: 'Napa Valley, CA',
        attendeeCount: 120,
        photoCount: 850,
        tags: ['outdoor', 'vineyard', 'elegant', 'sunset'],
        organizer: 'Sarah Johnson',
        privacy: 'network',
        similarities: ['vineyard', 'sunset ceremony', 'outdoor reception'],
        connectionScore: 0.85
      },
      {
        id: 'wedding-2024-002',
        name: 'Emma & David Wedding',
        type: 'wedding',
        date: new Date('2024-10-02'),
        location: 'Sonoma County, CA',
        attendeeCount: 95,
        photoCount: 720,
        tags: ['vineyard', 'rustic', 'outdoor', 'fall'],
        organizer: 'Emma Chen',
        privacy: 'network',
        similarities: ['vineyard', 'outdoor ceremony', 'wine country'],
        connectionScore: 0.92
      },
      {
        id: 'corp-2024-003',
        name: 'TechCorp Annual Gala',
        type: 'corporate',
        date: new Date('2024-11-12'),
        location: 'San Francisco, CA',
        attendeeCount: 300,
        photoCount: 450,
        tags: ['formal', 'networking', 'awards', 'tech'],
        organizer: 'TechCorp Events',
        privacy: 'public',
        similarities: ['formal attire', 'networking focus', 'awards ceremony'],
        connectionScore: 0.65
      },
      {
        id: 'birthday-2024-004',
        name: "Jessica's 30th Birthday",
        type: 'birthday',
        date: new Date('2024-08-25'),
        location: 'Los Angeles, CA',
        attendeeCount: 45,
        photoCount: 320,
        tags: ['party', 'rooftop', 'celebration', 'friends'],
        organizer: 'Jessica Martinez',
        privacy: 'private',
        similarities: ['rooftop venue', 'milestone birthday', 'intimate gathering'],
        connectionScore: 0.58
      },
      {
        id: 'festival-2024-005',
        name: 'Bay Area Music Festival',
        type: 'festival',
        date: new Date('2024-07-20'),
        location: 'Golden Gate Park, SF',
        attendeeCount: 2500,
        photoCount: 1200,
        tags: ['music', 'outdoor', 'festival', 'community'],
        organizer: 'Bay Area Events',
        privacy: 'public',
        similarities: ['outdoor venue', 'large gathering', 'music focus'],
        connectionScore: 0.73
      }
    ];

    const mockConnections: NetworkConnection[] = [
      {
        id: 'conn-001',
        sourceEvent: 'wedding-2024-001',
        targetEvent: 'wedding-2024-002',
        connectionType: 'venue_similarity',
        strength: 0.92,
        mutualAttendees: 8,
        sharedPhotos: 12,
        tags: ['vineyard', 'wine country', 'outdoor']
      },
      {
        id: 'conn-002',
        sourceEvent: 'wedding-2024-001',
        targetEvent: 'corp-2024-003',
        connectionType: 'attendee_overlap',
        strength: 0.45,
        mutualAttendees: 15,
        sharedPhotos: 0,
        tags: ['professionals', 'Bay Area']
      },
      {
        id: 'conn-003',
        sourceEvent: 'corp-2024-003',
        targetEvent: 'festival-2024-005',
        connectionType: 'photographer_shared',
        strength: 0.38,
        mutualAttendees: 0,
        sharedPhotos: 0,
        tags: ['professional photography', 'Bay Area']
      }
    ];

    const mockSuggestions: CrossPollinationSuggestion[] = [
      {
        id: 'sugg-001',
        type: 'vendor_recommendation',
        sourceEvent: 'wedding-2024-001',
        targetEvents: ['wedding-2024-002'],
        description: 'Share vineyard venue and catering recommendations',
        potential: 'high',
        expectedEngagement: 85,
        privacy: 'suggest',
        aiScore: 0.89,
        benefitType: 'mutual',
        timeline: 'immediate'
      },
      {
        id: 'sugg-002',
        type: 'photo_sharing',
        sourceEvent: 'wedding-2024-001',
        targetEvents: ['wedding-2024-002'],
        description: 'Cross-share sunset ceremony photos for inspiration',
        potential: 'medium',
        expectedEngagement: 70,
        privacy: 'respect',
        aiScore: 0.85,
        benefitType: 'mutual',
        timeline: 'immediate'
      },
      {
        id: 'sugg-003',
        type: 'guest_invitation',
        sourceEvent: 'corp-2024-003',
        targetEvents: ['festival-2024-005'],
        description: 'Invite tech professionals to community music events',
        potential: 'medium',
        expectedEngagement: 55,
        privacy: 'suggest',
        aiScore: 0.78,
        benefitType: 'mutual',
        timeline: 'short_term'
      },
      {
        id: 'sugg-004',
        type: 'sponsor_matching',
        sourceEvent: 'wedding-2024-001',
        targetEvents: ['wedding-2024-002'],
        description: 'Share premium wedding sponsors and vendors network',
        potential: 'high',
        expectedEngagement: 90,
        privacy: 'suggest',
        aiScore: 0.92,
        benefitType: 'mutual',
        timeline: 'immediate'
      },
      {
        id: 'sugg-005',
        type: 'location_sharing',
        sourceEvent: 'festival-2024-005',
        targetEvents: ['corp-2024-003'],
        description: 'Golden Gate Park venue available for corporate retreats',
        potential: 'medium',
        expectedEngagement: 65,
        privacy: 'auto',
        aiScore: 0.71,
        benefitType: 'one_way',
        timeline: 'long_term'
      }
    ];

    setConnectedEvents(mockEvents);
    setNetworkConnections(mockConnections);
    setSuggestions(mockSuggestions);
  };

  const getConnectionStrengthColor = (strength: number) => {
    if (strength >= 0.8) return 'text-green-400 bg-green-500/20';
    if (strength >= 0.6) return 'text-yellow-400 bg-yellow-500/20';
    if (strength >= 0.4) return 'text-orange-400 bg-orange-500/20';
    return 'text-red-400 bg-red-500/20';
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'wedding': return '💒';
      case 'birthday': return '🎂';
      case 'corporate': return '🏢';
      case 'festival': return '🎪';
      case 'graduation': return '🎓';
      default: return '🎉';
    }
  };

  const getConnectionTypeLabel = (type: string) => {
    switch (type) {
      case 'attendee_overlap': return 'Shared Attendees';
      case 'venue_similarity': return 'Similar Venue';
      case 'theme_match': return 'Theme Match';
      case 'photographer_shared': return 'Same Photographer';
      default: return 'Other Connection';
    }
  };

  const getPotentialColor = (potential: string) => {
    switch (potential) {
      case 'high': return 'text-green-400 bg-green-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-gray-400 bg-gray-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const applyCrossPollinationSuggestion = (suggestionId: string) => {
    const suggestion = suggestions.find(s => s.id === suggestionId);
    if (!suggestion) return;

    // Simulate applying the suggestion
    console.log('Applying cross-pollination suggestion:', suggestion.description);
    
    // Remove applied suggestion
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
    
    // In production, this would:
    // - Send invitations/recommendations
    // - Create shared photo albums
    // - Generate networking opportunities
    // - Track engagement metrics
  };

  const dismissSuggestion = (suggestionId: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
  };

  const getConnectedEventsForEvent = (eventId: string) => {
    const connections = networkConnections.filter(
      conn => conn.sourceEvent === eventId || conn.targetEvent === eventId
    );
    
    return connections.map(conn => {
      const connectedEventId = conn.sourceEvent === eventId ? conn.targetEvent : conn.sourceEvent;
      const event = connectedEvents.find(e => e.id === connectedEventId);
      return { ...event, connection: conn };
    }).filter(Boolean);
  };

  const filteredEvents = connectedEvents.filter(event => {
    if (filterType === 'all') return true;
    return event.type === filterType;
  });

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
          <Network className="text-purple-400" />
          <span>Event Cross-Pollination</span>
        </h3>
        <div className="flex items-center space-x-3">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-white/10 rounded-xl px-3 py-2 text-white border border-white/20"
            aria-label="Filter events by type"
          >
            <option value="all">All Events</option>
            <option value="wedding">Weddings</option>
            <option value="corporate">Corporate</option>
            <option value="birthday">Birthdays</option>
            <option value="festival">Festivals</option>
          </select>
          <select
            value={privacyMode}
            onChange={(e) => setPrivacyMode(e.target.value as any)}
            className="bg-white/10 rounded-xl px-3 py-2 text-white border border-white/20"
            aria-label="Select privacy mode for networking"
          >
            <option value="strict">Strict Privacy</option>
            <option value="balanced">Balanced</option>
            <option value="open">Open Network</option>
          </select>
        </div>
      </div>

      {/* AI-Powered Network Intelligence */}
      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Brain className="text-purple-400" />
            <h4 className="text-lg font-medium text-white">Network Intelligence</h4>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={collaborationMode}
              onChange={(e) => setCollaborationMode(e.target.value as any)}
              className="bg-white/10 rounded-xl px-3 py-2 text-white border border-white/20 text-sm"
              aria-label="Select collaboration mode"
            >
              <option value="passive">Passive</option>
              <option value="active">Active</option>
              <option value="proactive">Proactive</option>
            </select>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={aiRecommendations}
                onChange={(e) => setAiRecommendations(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
              <span className="ml-2 text-sm text-gray-300">AI Insights</span>
            </label>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-black/20 rounded-xl p-4 text-center">
            <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <p className="text-lg font-bold text-white">{networkGrowth.weeklyGrowth}%</p>
            <p className="text-xs text-gray-300">Weekly Growth</p>
          </div>
          <div className="bg-black/20 rounded-xl p-4 text-center">
            <Network className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <p className="text-lg font-bold text-white">{networkGrowth.monthlyConnections}</p>
            <p className="text-xs text-gray-300">New Connections</p>
          </div>
          <div className="bg-black/20 rounded-xl p-4 text-center">
            <Target className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <p className="text-lg font-bold text-white">{networkGrowth.strongConnections}</p>
            <p className="text-xs text-gray-300">Strong Links</p>
          </div>
          <div className="bg-black/20 rounded-xl p-4 text-center">
            <Zap className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <p className="text-lg font-bold text-white">{suggestions.filter(s => s.aiScore > 0.8).length}</p>
            <p className="text-xs text-gray-300">High-Value Ops</p>
          </div>
        </div>
        
        {aiRecommendations && collaborationMode === 'proactive' && (
          <div className="mt-4 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
            <div className="flex items-start space-x-2">
              <Brain className="w-4 h-4 text-purple-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-purple-300 font-medium">Proactive Network Opportunity</p>
                <p className="text-xs text-gray-300 mt-1">
                  Your network shows strong potential for vendor collaboration. Consider hosting a joint vendor showcase to strengthen connections by 25%.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Network Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-black/20 rounded-xl p-4 text-center">
          <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{connectedEvents.length}</p>
          <p className="text-sm text-gray-300">Connected Events</p>
        </div>

        <div className="bg-black/20 rounded-xl p-4 text-center">
          <Share2 className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{networkConnections.length}</p>
          <p className="text-sm text-gray-300">Network Links</p>
        </div>

        <div className="bg-black/20 rounded-xl p-4 text-center">
          <Heart className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">
            {networkConnections.reduce((sum, conn) => sum + conn.mutualAttendees, 0)}
          </p>
          <p className="text-sm text-gray-300">Shared Attendees</p>
        </div>

        <div className="bg-black/20 rounded-xl p-4 text-center">
          <MessageSquare className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{suggestions.length}</p>
          <p className="text-sm text-gray-300">Opportunities</p>
        </div>
      </div>

      {/* Cross-Pollination Suggestions */}
      {suggestions.length > 0 && (
        <div className="space-y-4 mb-8">
          <h4 className="text-lg font-medium text-white">Cross-Pollination Opportunities</h4>
          <div className="space-y-3">
            {suggestions.map((suggestion) => {
              const sourceEvent = connectedEvents.find(e => e.id === suggestion.sourceEvent);
              return (
                <div
                  key={suggestion.id}
                  className="bg-black/20 rounded-xl p-4 border border-white/10"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{getEventIcon(sourceEvent?.type || '')}</div>
                      <div>
                        <h5 className="font-medium text-white capitalize">
                          {suggestion.type.replace('_', ' ')}
                        </h5>
                        <p className="text-sm text-gray-400">{suggestion.description}</p>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${getPotentialColor(suggestion.potential)}`}>
                      {suggestion.potential} potential
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-300">From:</span>
                        <span className="text-sm text-white">{sourceEvent?.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-300">AI Score:</span>
                        <div className={`px-2 py-1 rounded text-xs ${
                          suggestion.aiScore > 0.8 ? 'bg-green-500/20 text-green-300' :
                          suggestion.aiScore > 0.6 ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-gray-500/20 text-gray-300'
                        }`}>
                          {Math.round(suggestion.aiScore * 100)}%
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-300">Engagement:</span>
                        <span className="text-sm text-blue-300">{suggestion.expectedEngagement}%</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-300">Timeline:</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          suggestion.timeline === 'immediate' ? 'bg-red-500/20 text-red-300' :
                          suggestion.timeline === 'short_term' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-green-500/20 text-green-300'
                        }`}>
                          {suggestion.timeline.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => dismissSuggestion(suggestion.id)}
                        className="px-3 py-1 bg-gray-500/20 text-gray-300 rounded-lg text-sm hover:bg-gray-500/30 transition-colors"
                      >
                        Dismiss
                      </button>
                      <button
                        type="button"
                        onClick={() => applyCrossPollinationSuggestion(suggestion.id)}
                        className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-sm hover:bg-purple-500/30 transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-3">
                      <span>Privacy: {suggestion.privacy}</span>
                      <span>•</span>
                      <span>Affects {suggestion.targetEvents.length} event(s)</span>
                      <span>•</span>
                      <span className={`${
                        suggestion.benefitType === 'mutual' ? 'text-green-400' :
                        suggestion.benefitType === 'network_wide' ? 'text-blue-400' :
                        'text-yellow-400'
                      }`}>
                        {suggestion.benefitType.replace('_', ' ')} benefit
                      </span>
                    </div>
                    {suggestion.aiScore > 0.8 && (
                      <div className="flex items-center space-x-1 text-purple-400">
                        <Zap className="w-3 h-3" />
                        <span>High Impact</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Event Network */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-medium text-white">Event Network</h4>
          <div className="flex bg-white/10 rounded-xl p-1">
            <button
              type="button"
              onClick={() => setNetworkView('list')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                networkView === 'list'
                  ? 'bg-blue-500/30 text-blue-300'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              List View
            </button>
            <button
              type="button"
              onClick={() => setNetworkView('graph')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                networkView === 'graph'
                  ? 'bg-blue-500/30 text-blue-300'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Graph View
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className={`bg-black/20 rounded-xl p-4 border transition-colors cursor-pointer ${
                selectedEvent === event.id 
                  ? 'border-purple-500/50 bg-purple-500/10' 
                  : 'border-white/10 hover:border-white/20'
              }`}
              onClick={() => setSelectedEvent(selectedEvent === event.id ? null : event.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{getEventIcon(event.type)}</div>
                  <div>
                    <h5 className="font-medium text-white">{event.name}</h5>
                    <p className="text-sm text-gray-400">{event.location}</p>
                    <p className="text-xs text-gray-500">
                      {event.date.toLocaleDateString()} • {event.attendeeCount} attendees
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`px-2 py-1 rounded text-xs font-medium ${getConnectionStrengthColor(event.connectionScore)}`}>
                    {Math.round(event.connectionScore * 100)}% match
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{event.photoCount} photos</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {event.tags.slice(0, 4).map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300">
                    {tag}
                  </span>
                ))}
              </div>

              {selectedEvent === event.id && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <h6 className="text-sm font-medium text-white mb-2">Connected Events:</h6>
                  <div className="space-y-2">
                    {getConnectedEventsForEvent(event.id).map((connectedEvent: any) => (
                      <div key={connectedEvent.id} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="text-sm">{getEventIcon(connectedEvent.type)}</div>
                          <div>
                            <p className="text-sm text-white">{connectedEvent.name}</p>
                            <p className="text-xs text-gray-400">
                              {getConnectionTypeLabel(connectedEvent.connection.connectionType)}
                            </p>
                          </div>
                        </div>
                        <div className={`px-2 py-1 rounded text-xs ${getConnectionStrengthColor(connectedEvent.connection.strength)}`}>
                          {Math.round(connectedEvent.connection.strength * 100)}%
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 text-xs text-gray-500">
                    Similarities: {event.similarities.join(', ')}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Privacy Controls */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Users className="text-blue-400" />
          <h4 className="text-lg font-medium text-white">Privacy & Networking Settings</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="allowVendorSharing"
              defaultChecked={privacyMode !== 'strict'}
              className="rounded"
            />
            <label htmlFor="allowVendorSharing" className="text-sm text-gray-300">
              Allow vendor recommendations
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="allowGuestConnections"
              defaultChecked={privacyMode === 'open'}
              className="rounded"
            />
            <label htmlFor="allowGuestConnections" className="text-sm text-gray-300">
              Enable guest connections
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="allowPhotoSharing"
              defaultChecked={privacyMode !== 'strict'}
              className="rounded"
            />
            <label htmlFor="allowPhotoSharing" className="text-sm text-gray-300">
              Allow photo inspiration sharing
            </label>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          Current mode: {privacyMode.charAt(0).toUpperCase() + privacyMode.slice(1)} - 
          {privacyMode === 'strict' ? ' No cross-event sharing' :
           privacyMode === 'balanced' ? ' Selective sharing with consent' :
           ' Open networking and sharing'}
        </p>
      </div>
    </div>
  );
}