import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Camera, Upload, Share2, Users, Settings, LogOut, Plus, Image, Folder, Calendar, QrCode, Link, Eye, MapPin, Monitor, Heart, CreditCard } from 'lucide-react';
import DarkModeToggle from '@/components/DarkModeToggle';
import CreateEventModal from '@/components/CreateEventModal';
import AdvancedPhotoUpload from '@/components/AdvancedPhotoUpload';
import RealTimePhotoWall from '@/components/RealTimePhotoWall';
import EngagementLayer from '@/components/EngagementLayer';
import PricingPlans from '@/components/PricingPlans';
import FreemiumLimits from '@/components/FreemiumLimits';
import { useNavigate } from 'react-router-dom';

const Account = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);
  const [userPlan] = useState<'free' | 'pro' | 'premium' | 'enterprise'>('pro'); // Mock Pro plan

  const handleSignOut = () => {
    // TODO: Implement actual sign out logic
    navigate('/');
  };

  const recentPhotos = [
    { id: 1, name: 'Wedding_2024_01.jpg', size: '2.4 MB', date: '2024-08-25' },
    { id: 2, name: 'Corporate_Event.jpg', size: '1.8 MB', date: '2024-08-24' },
    { id: 3, name: 'Birthday_Party.jpg', size: '3.1 MB', date: '2024-08-23' },
  ];

  const albums = [
    { id: 1, name: 'Summer Wedding 2024', photos: 156, thumbnail: '/uploads/a0278ce1-b82d-4ed6-a186-14a9503ef65c.png' },
    { id: 2, name: 'Corporate Retreat', photos: 89, thumbnail: '/uploads/34a58283-8b82-48f9-88f4-2c88b069921d.png' },
    { id: 3, name: 'Family Portraits', photos: 34, thumbnail: '/uploads/47f9a1d0-4458-400a-8fc0-79adf093cf18.png' },
  ];

  const events = [
    { 
      id: 1, 
      name: 'Sarah & John Wedding', 
      date: '2024-09-15', 
      location: 'Riverside Gardens',
      status: 'active',
      guests: 85,
      photos: 234,
      type: 'wedding',
      isPublic: false,
      accessLink: 'laurencephotohub.com/event/abc123'
    },
    { 
      id: 2, 
      name: 'Tech Conference 2024', 
      date: '2024-08-28', 
      location: 'Downtown Convention Center',
      status: 'completed',
      guests: 150,
      photos: 89,
      type: 'corporate',
      isPublic: true,
      accessLink: 'laurencephotohub.com/event/def456'
    },
    { 
      id: 3, 
      name: 'Emma\'s 25th Birthday', 
      date: '2024-09-30', 
      location: 'Central Park',
      status: 'upcoming',
      guests: 25,
      photos: 0,
      type: 'birthday',
      isPublic: false,
      accessLink: 'laurencephotohub.com/event/ghi789'
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-serif font-semibold">Laurence Photo Hub</h1>
            <Badge variant="secondary" className={
              userPlan === 'free' ? 'text-gray-600' :
              userPlan === 'pro' ? 'text-blue-600' :
              userPlan === 'premium' ? 'text-purple-600' : 'text-emerald-600'
            }>
              {userPlan.charAt(0).toUpperCase() + userPlan.slice(1)}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-4">
            <DarkModeToggle />
            <Avatar className="h-8 w-8">
              <AvatarFallback>L</AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-6">
        <div className="grid gap-6 md:grid-cols-4">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <nav className="space-y-2">
              <Button
                variant={activeTab === 'dashboard' ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('dashboard')}
              >
                <Camera className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <Button
                variant={activeTab === 'events' ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('events')}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Events
              </Button>
              <Button
                variant={activeTab === 'albums' ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('albums')}
              >
                <Folder className="h-4 w-4 mr-2" />
                Albums
              </Button>
              <Button
                variant={activeTab === 'uploads' ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('uploads')}
              >
                <Upload className="h-4 w-4 mr-2" />
                Uploads
              </Button>
              <Button
                variant={activeTab === 'photo-wall' ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('photo-wall')}
              >
                <Monitor className="h-4 w-4 mr-2" />
                Live Photo Wall
              </Button>
              <Button
                variant={activeTab === 'engagement' ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('engagement')}
              >
                <Heart className="h-4 w-4 mr-2" />
                Engagement
              </Button>
              <Button
                variant={activeTab === 'pricing' ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('pricing')}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Plans & Pricing
              </Button>
              <Button
                variant={activeTab === 'settings' ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('settings')}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Welcome back, Laurence!</h2>
                  <p className="text-muted-foreground">Here's what's happening with your photo hub.</p>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Photos</CardTitle>
                      <Image className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">1,234</div>
                      <p className="text-xs text-muted-foreground">+12% from last month</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Albums</CardTitle>
                      <Folder className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">23</div>
                      <p className="text-xs text-muted-foreground">+3 this week</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Shared Links</CardTitle>
                      <Share2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">89</div>
                      <p className="text-xs text-muted-foreground">Active this month</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Photos</CardTitle>
                    <CardDescription>Your latest uploads</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentPhotos.map((photo) => (
                        <div key={photo.id} className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center">
                            <Image className="h-4 w-4" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium">{photo.name}</p>
                            <p className="text-xs text-muted-foreground">{photo.size} • {photo.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Usage & Plan Status */}
                <FreemiumLimits 
                  userPlan={userPlan} 
                  onUpgrade={() => setActiveTab('pricing')} 
                />
              </div>
            )}

            {activeTab === 'events' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight">Events</h2>
                    <p className="text-muted-foreground">Create and manage photo sharing events</p>
                  </div>
                  <Button onClick={() => setIsCreateEventModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Event
                  </Button>
                </div>

                {/* Event Stats */}
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active Events</CardTitle>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{events.filter(e => e.status === 'active').length}</div>
                      <p className="text-xs text-muted-foreground">Currently running</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Guests</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{events.reduce((sum, e) => sum + e.guests, 0)}</div>
                      <p className="text-xs text-muted-foreground">Across all events</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Photos Shared</CardTitle>
                      <Image className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{events.reduce((sum, e) => sum + e.photos, 0)}</div>
                      <p className="text-xs text-muted-foreground">Total event photos</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Events List */}
                <div className="grid gap-4">
                  {events.map((event) => (
                    <Card key={event.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h3 className="text-lg font-semibold">{event.name}</h3>
                              <Badge variant={
                                event.status === 'active' ? 'default' :
                                event.status === 'completed' ? 'secondary' : 'outline'
                              }>
                                {event.status}
                              </Badge>
                              {event.isPublic && (
                                <Badge variant="outline">
                                  <Eye className="h-3 w-3 mr-1" />
                                  Public
                                </Badge>
                              )}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {new Date(event.date).toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                {event.location}
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                {event.guests} guests
                              </div>
                              <div className="flex items-center gap-2">
                                <Image className="h-4 w-4" />
                                {event.photos} photos
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 ml-4">
                            <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(event.accessLink)}>
                              <Link className="h-4 w-4 mr-2" />
                              Copy Link
                            </Button>
                            <Button variant="outline" size="sm">
                              <QrCode className="h-4 w-4 mr-2" />
                              QR Code
                            </Button>
                            <Button variant="outline" size="sm">
                              Manage
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'albums' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight">Albums</h2>
                    <p className="text-muted-foreground">Organize your photos into collections</p>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Album
                  </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {albums.map((album) => (
                    <Card key={album.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="aspect-video bg-muted rounded-md mb-4 overflow-hidden">
                          <img 
                            src={album.thumbnail} 
                            alt={album.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h3 className="font-medium">{album.name}</h3>
                        <p className="text-sm text-muted-foreground">{album.photos} photos</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'uploads' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Advanced Upload</h2>
                  <p className="text-muted-foreground">Upload photos and videos with AI enhancement and privacy controls</p>
                </div>
                <AdvancedPhotoUpload />
              </div>
            )}

            {activeTab === 'photo-wall' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Live Photo Wall</h2>
                  <p className="text-muted-foreground">Real-time feed of event photos with AR/VR viewing options</p>
                </div>
                <RealTimePhotoWall />
              </div>
            )}

            {activeTab === 'engagement' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Engagement & Reactions</h2>
                  <p className="text-muted-foreground">Interactive features, AI curation, and slideshow recaps</p>
                </div>
                <EngagementLayer />
              </div>
            )}

            {activeTab === 'pricing' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Plans & Pricing</h2>
                  <p className="text-muted-foreground">Choose the perfect plan for your photo sharing needs</p>
                </div>
                <PricingPlans />
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
                  <p className="text-muted-foreground">Manage your account and privacy preferences</p>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>Update your profile details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <p className="text-sm text-muted-foreground">laurence@laurence</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Plan</label>
                      <p className="text-sm text-muted-foreground">Pro Plan - Unlimited uploads</p>
                    </div>
                    <Button variant="outline">Edit Profile</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      Privacy & Security
                    </CardTitle>
                    <CardDescription>
                      Advanced privacy controls and encryption settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <label className="text-sm font-medium">End-to-End Encryption</label>
                          <p className="text-sm text-muted-foreground">All uploads are encrypted before leaving your device</p>
                        </div>
                        <Badge variant="secondary" className="text-green-600">
                          <Eye className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <label className="text-sm font-medium">AI Processing</label>
                          <p className="text-sm text-muted-foreground">Enable facial clustering and auto-tagging (privacy-first)</p>
                        </div>
                        <Badge variant="secondary" className="text-blue-600">
                          Enabled
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <label className="text-sm font-medium">Download Permissions</label>
                          <p className="text-sm text-muted-foreground">Default permission level for event guests</p>
                        </div>
                        <Badge variant="outline">
                          Organizer Only
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <label className="text-sm font-medium">Auto-Expire Content</label>
                          <p className="text-sm text-muted-foreground">Automatically delete content after specified time</p>
                        </div>
                        <Badge variant="outline">
                          30 days
                        </Badge>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-3">Data Export & Deletion</h4>
                      <div className="flex gap-3">
                        <Button variant="outline" size="sm">
                          Export My Data
                        </Button>
                        <Button variant="outline" size="sm">
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Choose how you want to be notified</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">New photo uploads</label>
                        <Badge variant="secondary">Email + Push</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Event invitations</label>
                        <Badge variant="secondary">Email</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Weekly summary</label>
                        <Badge variant="outline">Disabled</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <CreateEventModal 
        isOpen={isCreateEventModalOpen} 
        onClose={() => setIsCreateEventModalOpen(false)} 
      />
    </div>
  );
};

export default Account;