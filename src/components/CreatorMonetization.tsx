import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Camera, 
  DollarSign, 
  TrendingUp, 
  Users,
  Star,
  Heart,
  Eye,
  Download,
  Share,
  Award,
  Target,
  Wallet,
  CreditCard,
  Gift,
  Zap,
  Crown,
  Coffee,
  Coins,
  BarChart3,
  Calendar,
  Clock,
  ArrowUp,
  ArrowDown,
  Plus,
  Settings,
  Image,
  Video,
  Smartphone,
  Monitor,
  Printer,
  FileImage,
  ShoppingCart,
  MessageCircle,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  PaypalIcon,
  Banknote
} from 'lucide-react';

interface Photographer {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  specialties: string[];
  rating: number;
  totalEarnings: number;
  monthlyEarnings: number;
  totalPhotos: number;
  totalDownloads: number;
  followers: number;
  joinedDate: Date;
  verified: boolean;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  commissionRate: number;
}

interface PhotoLicense {
  id: string;
  photoId: string;
  photoUrl: string;
  title: string;
  licenseType: 'Personal' | 'Commercial' | 'Extended' | 'Exclusive';
  price: number;
  description: string;
  usage: string[];
  restrictions: string[];
  duration: string;
  resolution: string;
}

interface Commission {
  id: string;
  clientName: string;
  eventType: string;
  date: Date;
  hours: number;
  rate: number;
  total: number;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'paid';
  description: string;
  deliverables: string[];
  location: string;
}

interface Tip {
  id: string;
  from: string;
  amount: number;
  message: string;
  timestamp: Date;
  photoId?: string;
}

interface EarningsStats {
  today: number;
  thisWeek: number;
  thisMonth: number;
  thisYear: number;
  totalLifetime: number;
  commissions: number;
  licensing: number;
  tips: number;
  subscriptions: number;
}

const CreatorMonetization = () => {
  const [photographer, setPhotographer] = useState<Photographer | null>(null);
  const [licenses, setLicenses] = useState<PhotoLicense[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [tips, setTips] = useState<Tip[]>([]);
  const [earnings, setEarnings] = useState<EarningsStats | null>(null);
  const [selectedView, setSelectedView] = useState<'dashboard' | 'portfolio' | 'commissions' | 'licensing' | 'tips' | 'settings'>('dashboard');
  const [isCreatingLicense, setIsCreatingLicense] = useState(false);
  const [portfolioUploading, setPortfolioUploading] = useState(false);

  // New license form state
  const [newLicense, setNewLicense] = useState({
    title: '',
    licenseType: 'Personal' as const,
    price: 25,
    description: '',
    usage: [] as string[],
    restrictions: [] as string[],
    duration: '1 year',
    resolution: '4K'
  });

  // Mock data
  const mockPhotographer: Photographer = {
    id: '1',
    name: 'Alex Rodriguez',
    avatar: '/uploads/photographer-avatar.jpg',
    bio: 'Professional event photographer specializing in weddings, corporate events, and celebrations. 8+ years experience capturing life\'s precious moments.',
    specialties: ['Wedding Photography', 'Corporate Events', 'Portrait Sessions', 'Event Documentation'],
    rating: 4.9,
    totalEarnings: 45650,
    monthlyEarnings: 3200,
    totalPhotos: 1247,
    totalDownloads: 8934,
    followers: 2834,
    joinedDate: new Date('2022-03-15'),
    verified: true,
    tier: 'Gold',
    commissionRate: 15
  };

  const mockLicenses: PhotoLicense[] = [
    {
      id: '1',
      photoId: 'photo_1',
      photoUrl: '/uploads/a0278ce1-b82d-4ed6-a186-14a9503ef65c.png',
      title: 'Wedding Ceremony Moment',
      licenseType: 'Commercial',
      price: 150,
      description: 'Beautiful wedding ceremony capture perfect for wedding industry marketing',
      usage: ['Marketing Materials', 'Website Usage', 'Social Media', 'Print Advertising'],
      restrictions: ['No resale', 'Credit photographer', 'Max 2 years usage'],
      duration: '2 years',
      resolution: '6K RAW'
    },
    {
      id: '2',
      photoId: 'photo_2',
      photoUrl: '/uploads/34a58283-8b82-48f9-88f4-2c88b069921d.png',
      title: 'Corporate Event Networking',
      licenseType: 'Extended',
      price: 75,
      description: 'Professional networking event photo ideal for business presentations',
      usage: ['Presentations', 'Reports', 'Internal Communications'],
      restrictions: ['Company use only', 'No external distribution'],
      duration: '1 year',
      resolution: '4K'
    }
  ];

  const mockCommissions: Commission[] = [
    {
      id: '1',
      clientName: 'Sarah & Michael',
      eventType: 'Wedding Photography',
      date: new Date('2024-09-15'),
      hours: 8,
      rate: 200,
      total: 1600,
      status: 'accepted',
      description: 'Full wedding day coverage including ceremony, reception, and portraits',
      deliverables: ['400+ edited photos', 'Online gallery', 'USB drive', 'Print release'],
      location: 'Garden Venue, San Francisco'
    },
    {
      id: '2',
      clientName: 'TechCorp Inc.',
      eventType: 'Corporate Event',
      date: new Date('2024-08-28'),
      hours: 4,
      rate: 150,
      total: 600,
      status: 'completed',
      description: 'Annual company meeting and team building event documentation',
      deliverables: ['200+ photos', 'Same-day editing', 'Digital delivery'],
      location: 'Downtown Conference Center'
    }
  ];

  const mockTips: Tip[] = [
    {
      id: '1',
      from: 'Jennifer K.',
      amount: 25,
      message: 'Amazing photos from our wedding! Thank you so much! 💕',
      timestamp: new Date(Date.now() - 3600000),
      photoId: 'photo_1'
    },
    {
      id: '2',
      from: 'Mark S.',
      amount: 15,
      message: 'Great work on the corporate event shots!',
      timestamp: new Date(Date.now() - 7200000)
    }
  ];

  const mockEarnings: EarningsStats = {
    today: 125,
    thisWeek: 850,
    thisMonth: 3200,
    thisYear: 28400,
    totalLifetime: 45650,
    commissions: 32000,
    licensing: 8900,
    tips: 2100,
    subscriptions: 2650
  };

  useEffect(() => {
    setPhotographer(mockPhotographer);
    setLicenses(mockLicenses);
    setCommissions(mockCommissions);
    setTips(mockTips);
    setEarnings(mockEarnings);
  }, []);

  const createLicense = async () => {
    setIsCreatingLicense(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));

    const createdLicense: PhotoLicense = {
      id: Date.now().toString(),
      photoId: `photo_${Date.now()}`,
      photoUrl: '/uploads/a0278ce1-b82d-4ed6-a186-14a9503ef65c.png',
      title: newLicense.title,
      licenseType: newLicense.licenseType,
      price: newLicense.price,
      description: newLicense.description,
      usage: newLicense.usage,
      restrictions: newLicense.restrictions,
      duration: newLicense.duration,
      resolution: newLicense.resolution
    };

    setLicenses(prev => [createdLicense, ...prev]);
    setIsCreatingLicense(false);
    
    // Reset form
    setNewLicense({
      title: '',
      licenseType: 'Personal',
      price: 25,
      description: '',
      usage: [],
      restrictions: [],
      duration: '1 year',
      resolution: '4K'
    });
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Bronze': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'Silver': return 'text-gray-600 bg-gray-100 border-gray-200';
      case 'Gold': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'Platinum': return 'text-purple-600 bg-purple-100 border-purple-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'Bronze': return <Award className="h-4 w-4" />;
      case 'Silver': return <Star className="h-4 w-4" />;
      case 'Gold': return <Crown className="h-4 w-4" />;
      case 'Platinum': return <Zap className="h-4 w-4" />;
      default: return <Award className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'accepted': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'in_progress': return 'text-purple-600 bg-purple-100 border-purple-200';
      case 'completed': return 'text-green-600 bg-green-100 border-green-200';
      case 'paid': return 'text-emerald-600 bg-emerald-100 border-emerald-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getLicenseColor = (type: string) => {
    switch (type) {
      case 'Personal': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'Commercial': return 'text-green-600 bg-green-100 border-green-200';
      case 'Extended': return 'text-purple-600 bg-purple-100 border-purple-200';
      case 'Exclusive': return 'text-orange-600 bg-orange-100 border-orange-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  if (!photographer || !earnings) return null;

  return (
    <div className="space-y-6">
      {/* Photographer Profile Header */}
      <Card className="glass-effect">
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-muted flex-shrink-0">
              <img 
                src={photographer.avatar} 
                alt={photographer.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = `data:image/svg+xml;base64,${btoa(`
                    <svg width="96" height="96" xmlns="http://www.w3.org/2000/svg">
                      <rect width="96" height="96" fill="#f3f4f6"/>
                      <text x="48" y="48" font-family="Arial" font-size="32" fill="#6b7280" text-anchor="middle" dominant-baseline="middle">
                        ${photographer.name.charAt(0)}
                      </text>
                    </svg>
                  `)}`;
                }}
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold">{photographer.name}</h1>
                {photographer.verified && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
                <Badge variant="outline" className={`${getTierColor(photographer.tier)} border`}>
                  {getTierIcon(photographer.tier)}
                  <span className="ml-1">{photographer.tier}</span>
                </Badge>
              </div>
              
              <p className="text-muted-foreground mb-4 max-w-2xl">{photographer.bio}</p>
              
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">{photographer.rating}</span>
                  <span className="text-muted-foreground">rating</span>
                </div>
                <div className="flex items-center gap-1">
                  <Camera className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">{photographer.totalPhotos}</span>
                  <span className="text-muted-foreground">photos</span>
                </div>
                <div className="flex items-center gap-1">
                  <Download className="h-4 w-4 text-green-500" />
                  <span className="font-medium">{photographer.totalDownloads}</span>
                  <span className="text-muted-foreground">downloads</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-purple-500" />
                  <span className="font-medium">{photographer.followers}</span>
                  <span className="text-muted-foreground">followers</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-emerald-500" />
                  <span className="font-medium">{formatCurrency(photographer.totalEarnings)}</span>
                  <span className="text-muted-foreground">total earned</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Interface */}
      <Tabs value={selectedView} onValueChange={(v) => setSelectedView(v as any)}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="commissions">Commissions</TabsTrigger>
          <TabsTrigger value="licensing">Licensing</TabsTrigger>
          <TabsTrigger value="tips">Tips & Support</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Earnings Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Today</span>
                </div>
                <p className="text-2xl font-bold">{formatCurrency(earnings.today)}</p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <ArrowUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600">+12%</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">This Week</span>
                </div>
                <p className="text-2xl font-bold">{formatCurrency(earnings.thisWeek)}</p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <ArrowUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600">+8%</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">This Month</span>
                </div>
                <p className="text-2xl font-bold">{formatCurrency(earnings.thisMonth)}</p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <ArrowUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600">+15%</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium">This Year</span>
                </div>
                <p className="text-2xl font-bold">{formatCurrency(earnings.thisYear)}</p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <ArrowUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600">+23%</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm font-medium">Lifetime</span>
                </div>
                <p className="text-2xl font-bold">{formatCurrency(earnings.totalLifetime)}</p>
                <Badge variant="secondary" className="mt-1">
                  All time
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-electric-blue" />
                Revenue Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <Camera className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <p className="font-semibold">Commissions</p>
                  <p className="text-2xl font-bold text-blue-600">{formatCurrency(earnings.commissions)}</p>
                  <p className="text-sm text-muted-foreground">70% of total</p>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <FileImage className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <p className="font-semibold">Licensing</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(earnings.licensing)}</p>
                  <p className="text-sm text-muted-foreground">20% of total</p>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <Heart className="h-8 w-8 mx-auto mb-2 text-pink-500" />
                  <p className="font-semibold">Tips</p>
                  <p className="text-2xl font-bold text-pink-600">{formatCurrency(earnings.tips)}</p>
                  <p className="text-sm text-muted-foreground">5% of total</p>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <Crown className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                  <p className="font-semibold">Subscriptions</p>
                  <p className="text-2xl font-bold text-purple-600">{formatCurrency(earnings.subscriptions)}</p>
                  <p className="text-sm text-muted-foreground">5% of total</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Commissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {commissions.slice(0, 3).map((commission) => (
                    <div key={commission.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{commission.clientName}</p>
                        <p className="text-sm text-muted-foreground">{commission.eventType}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(commission.total)}</p>
                        <Badge variant="outline" className={`${getStatusColor(commission.status)} text-xs`}>
                          {commission.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tips.slice(0, 3).map((tip) => (
                    <div key={tip.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      <Gift className="h-5 w-5 text-pink-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium">{tip.from}</p>
                          <p className="font-semibold text-green-600">{formatCurrency(tip.amount)}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">{tip.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-electric-blue" />
                  Portfolio Management
                </CardTitle>
                <Button onClick={() => setPortfolioUploading(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Photos
                </Button>
              </div>
              <CardDescription>
                Showcase your best work and manage your professional portfolio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Camera className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Build Your Portfolio</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Upload your best photos to attract clients and showcase your unique style
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <div className="p-4 border rounded-lg">
                    <Image className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <h4 className="font-medium">High-Quality Images</h4>
                    <p className="text-sm text-muted-foreground">Upload RAW, JPEG, PNG</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <Star className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                    <h4 className="font-medium">Featured Work</h4>
                    <p className="text-sm text-muted-foreground">Highlight your best shots</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <h4 className="font-medium">Analytics</h4>
                    <p className="text-sm text-muted-foreground">Track views and downloads</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commissions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-electric-blue" />
                  Commission Requests
                </CardTitle>
                <Badge variant="outline">
                  {commissions.filter(c => c.status === 'pending').length} pending
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {commissions.map((commission) => (
                  <Card key={commission.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{commission.clientName}</h3>
                          <p className="text-muted-foreground">{commission.eventType}</p>
                        </div>
                        <Badge variant="outline" className={`${getStatusColor(commission.status)} border`}>
                          {commission.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <p className="mb-4">{commission.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">{formatDate(commission.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{commission.hours} hours</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-emerald-500" />
                          <span className="text-sm">{formatCurrency(commission.rate)}/hour</span>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Deliverables:</h4>
                        <div className="flex flex-wrap gap-2">
                          {commission.deliverables.map((item, index) => (
                            <Badge key={index} variant="secondary">{item}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-bold">Total: {formatCurrency(commission.total)}</p>
                        {commission.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button variant="outline">Decline</Button>
                            <Button>Accept Commission</Button>
                          </div>
                        )}
                        {commission.status === 'completed' && (
                          <Button>
                            <Download className="h-4 w-4 mr-2" />
                            Deliver Files
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="licensing" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileImage className="h-5 w-5 text-electric-blue" />
                  Photo Licensing
                </CardTitle>
                <Button onClick={() => setIsCreatingLicense(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create License
                </Button>
              </div>
              <CardDescription>
                License your photos for commercial and personal use
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {licenses.map((license) => (
                  <Card key={license.id} className="overflow-hidden">
                    <div className="aspect-video">
                      <img
                        src={license.photoUrl}
                        alt={license.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold truncate">{license.title}</h3>
                        <Badge variant="outline" className={`${getLicenseColor(license.licenseType)} border text-xs`}>
                          {license.licenseType}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {license.description}
                      </p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium">Duration:</span> {license.duration}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium">Resolution:</span> {license.resolution}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-bold">{formatCurrency(license.price)}</p>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm">
                            <ShoppingCart className="h-3 w-3 mr-1" />
                            Buy
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Create License Modal */}
          {isCreatingLicense && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <CardHeader>
                  <CardTitle>Create Photo License</CardTitle>
                  <CardDescription>
                    Set up licensing terms for your photos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Photo Title</Label>
                      <Input
                        placeholder="e.g., Wedding Ceremony Moment"
                        value={newLicense.title}
                        onChange={(e) => setNewLicense(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>License Type</Label>
                      <Select value={newLicense.licenseType} onValueChange={(v) => setNewLicense(prev => ({ ...prev, licenseType: v as any }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Personal">Personal Use</SelectItem>
                          <SelectItem value="Commercial">Commercial Use</SelectItem>
                          <SelectItem value="Extended">Extended License</SelectItem>
                          <SelectItem value="Exclusive">Exclusive Rights</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      placeholder="Describe the photo and its potential uses..."
                      value={newLicense.description}
                      onChange={(e) => setNewLicense(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Price (USD)</Label>
                      <Input
                        type="number"
                        min="1"
                        value={newLicense.price}
                        onChange={(e) => setNewLicense(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Duration</Label>
                      <Select value={newLicense.duration} onValueChange={(v) => setNewLicense(prev => ({ ...prev, duration: v }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1 year">1 Year</SelectItem>
                          <SelectItem value="2 years">2 Years</SelectItem>
                          <SelectItem value="5 years">5 Years</SelectItem>
                          <SelectItem value="Unlimited">Unlimited</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Resolution</Label>
                      <Select value={newLicense.resolution} onValueChange={(v) => setNewLicense(prev => ({ ...prev, resolution: v }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="HD">HD (1080p)</SelectItem>
                          <SelectItem value="4K">4K</SelectItem>
                          <SelectItem value="6K RAW">6K RAW</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setIsCreatingLicense(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      className="flex-1"
                      onClick={createLicense}
                      disabled={!newLicense.title || !newLicense.description}
                    >
                      Create License
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="tips" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-electric-blue" />
                Tips & Support
              </CardTitle>
              <CardDescription>
                Receive appreciation from clients and fans
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">Recent Tips</h3>
                  <div className="space-y-4">
                    {tips.map((tip) => (
                      <div key={tip.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium">{tip.from}</p>
                          <p className="font-bold text-green-600">{formatCurrency(tip.amount)}</p>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{tip.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {tip.timestamp.toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-4">Tip Settings</h3>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Enable Tips</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Allow clients to tip you for excellent service
                      </p>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Suggested Tip Amounts</h4>
                      <div className="flex gap-2 mb-3">
                        <Badge variant="outline">$5</Badge>
                        <Badge variant="outline">$10</Badge>
                        <Badge variant="outline">$25</Badge>
                        <Badge variant="outline">$50</Badge>
                        <Badge variant="outline">Custom</Badge>
                      </div>
                      <Button variant="outline" size="sm">
                        <Settings className="h-3 w-3 mr-1" />
                        Customize
                      </Button>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Coffee Support</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        "Buy me a coffee" style micro-donations
                      </p>
                      <Button variant="outline" size="sm">
                        <Coffee className="h-3 w-3 mr-1" />
                        Set up Coffee Tips
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-electric-blue" />
                Creator Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Payment Settings</h3>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Payout Method</h4>
                    <Select defaultValue="paypal">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paypal">PayPal</SelectItem>
                        <SelectItem value="stripe">Bank Transfer (Stripe)</SelectItem>
                        <SelectItem value="crypto">Cryptocurrency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Commission Rate</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Current rate: {photographer.commissionRate}%
                    </p>
                    <Badge variant="secondary">Based on your {photographer.tier} tier</Badge>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold">Profile Settings</h3>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Availability Status</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Available for new commissions</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Auto-Accept Tips</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Automatically accept tips under $25</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Public Portfolio</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Show portfolio publicly</span>
                      <Switch defaultChecked />
                    </div>
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

export default CreatorMonetization;