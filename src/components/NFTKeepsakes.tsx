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
  Gem, 
  Shield, 
  Sparkles, 
  Crown,
  Zap,
  Lock,
  Key,
  Eye,
  Share,
  Download,
  Star,
  Trophy,
  Gift,
  Heart,
  Camera,
  Calendar,
  Users,
  Clock,
  Wallet,
  CreditCard,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Copy,
  ExternalLink,
  Layers,
  Fingerprint,
  Globe,
  TrendingUp,
  Award,
  Coins,
  Image,
  Video,
  Music
} from 'lucide-react';

interface NFTKeepsake {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  eventName: string;
  eventDate: Date;
  edition: number;
  totalEditions: number;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';
  blockchain: 'Ethereum' | 'Polygon' | 'Solana';
  tokenId?: string;
  contractAddress?: string;
  ownerAddress: string;
  createdAt: Date;
  mintedAt?: Date;
  price?: number;
  currentValue?: number;
  attributes: {
    trait_type: string;
    value: string;
    rarity: number;
  }[];
  status: 'draft' | 'minting' | 'minted' | 'listed' | 'sold';
  unlockableContent?: {
    type: 'photo' | 'video' | 'audio';
    url: string;
    description: string;
  };
}

interface CollectionStats {
  totalKeepsakes: number;
  totalValue: number;
  averagePrice: number;
  rarityDistribution: Record<string, number>;
  popularEvents: string[];
  recentActivity: {
    type: 'mint' | 'sale' | 'transfer';
    keepsake: string;
    timestamp: Date;
    value?: number;
  }[];
}

const NFTKeepsakes = () => {
  const [keepsakes, setKeepsakes] = useState<NFTKeepsake[]>([]);
  const [collectionStats, setCollectionStats] = useState<CollectionStats | null>(null);
  const [selectedView, setSelectedView] = useState<'gallery' | 'create' | 'marketplace' | 'stats'>('gallery');
  const [isCreating, setIsCreating] = useState(false);
  const [creationProgress, setCreationProgress] = useState(0);
  const [selectedKeepsake, setSelectedKeepsake] = useState<NFTKeepsake | null>(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  
  // Creation form state
  const [newKeepsake, setNewKeepsake] = useState({
    title: '',
    description: '',
    eventName: '',
    rarity: 'Common' as const,
    blockchain: 'Polygon' as const,
    totalEditions: 100,
    price: 0.1,
    includeUnlockableContent: false,
    unlockableDescription: ''
  });

  // Mock NFT keepsakes
  const mockKeepsakes: NFTKeepsake[] = [
    {
      id: '1',
      title: 'Wedding Ceremony First Kiss',
      description: 'A magical moment captured forever - the first kiss as newlyweds under golden sunset light.',
      imageUrl: '/uploads/a0278ce1-b82d-4ed6-a186-14a9503ef65c.png',
      eventName: 'Sarah & Michael\'s Wedding',
      eventDate: new Date('2024-08-15'),
      edition: 1,
      totalEditions: 50,
      rarity: 'Legendary',
      blockchain: 'Ethereum',
      tokenId: '0x1a2b3c4d5e6f',
      contractAddress: '0x742d35Cc6635C0532925a3b8D59C06Dd04f4b5E8',
      ownerAddress: '0x8ba1f109551bD432803012645Hac136c',
      createdAt: new Date('2024-08-16'),
      mintedAt: new Date('2024-08-16T10:30:00'),
      price: 0.25,
      currentValue: 0.45,
      attributes: [
        { trait_type: 'Event Type', value: 'Wedding', rarity: 15 },
        { trait_type: 'Time of Day', value: 'Golden Hour', rarity: 25 },
        { trait_type: 'Emotion', value: 'Pure Joy', rarity: 8 },
        { trait_type: 'Location', value: 'Garden Venue', rarity: 35 },
        { trait_type: 'Special Moment', value: 'First Kiss', rarity: 5 }
      ],
      status: 'minted',
      unlockableContent: {
        type: 'video',
        url: '/videos/ceremony-full.mp4',
        description: 'Full 4K video of the ceremony with professional audio'
      }
    },
    {
      id: '2',
      title: 'Golden Hour Group Celebration',
      description: 'Friends and family celebrating together as the sun sets over the bay.',
      imageUrl: '/uploads/34a58283-8b82-48f9-88f4-2c88b069921d.png',
      eventName: 'Sarah & Michael\'s Wedding',
      eventDate: new Date('2024-08-15'),
      edition: 12,
      totalEditions: 100,
      rarity: 'Rare',
      blockchain: 'Polygon',
      tokenId: '0x2b3c4d5e6f7a',
      contractAddress: '0x742d35Cc6635C0532925a3b8D59C06Dd04f4b5E8',
      ownerAddress: '0x8ba1f109551bD432803012645Hac136c',
      createdAt: new Date('2024-08-16'),
      mintedAt: new Date('2024-08-16T14:20:00'),
      price: 0.08,
      currentValue: 0.12,
      attributes: [
        { trait_type: 'Event Type', value: 'Wedding', rarity: 15 },
        { trait_type: 'Group Size', value: 'Large Group', rarity: 40 },
        { trait_type: 'Time of Day', value: 'Golden Hour', rarity: 25 },
        { trait_type: 'Setting', value: 'Outdoor', rarity: 60 }
      ],
      status: 'minted'
    },
    {
      id: '3',
      title: 'First Dance Under Stars',
      description: 'An intimate first dance moment with city lights twinkling in the background.',
      imageUrl: '/uploads/47f9a1d0-4458-400a-8fc0-79adf093cf18.png',
      eventName: 'Sarah & Michael\'s Wedding',
      eventDate: new Date('2024-08-15'),
      edition: 3,
      totalEditions: 25,
      rarity: 'Epic',
      blockchain: 'Ethereum',
      ownerAddress: '0x8ba1f109551bD432803012645Hac136c',
      createdAt: new Date('2024-08-16'),
      price: 0.15,
      currentValue: 0.28,
      attributes: [
        { trait_type: 'Event Type', value: 'Wedding', rarity: 15 },
        { trait_type: 'Moment Type', value: 'First Dance', rarity: 10 },
        { trait_type: 'Time of Day', value: 'Evening', rarity: 45 },
        { trait_type: 'Atmosphere', value: 'Romantic', rarity: 20 }
      ],
      status: 'minting'
    }
  ];

  const mockStats: CollectionStats = {
    totalKeepsakes: 156,
    totalValue: 24.8,
    averagePrice: 0.159,
    rarityDistribution: {
      'Common': 78,
      'Rare': 45,
      'Epic': 23,
      'Legendary': 8,
      'Mythic': 2
    },
    popularEvents: ['Weddings', 'Birthdays', 'Graduations', 'Anniversaries'],
    recentActivity: [
      { type: 'mint', keepsake: 'Wedding Ceremony First Kiss', timestamp: new Date(Date.now() - 3600000), value: 0.25 },
      { type: 'sale', keepsake: 'Birthday Surprise Moment', timestamp: new Date(Date.now() - 7200000), value: 0.18 },
      { type: 'mint', keepsake: 'Graduation Walk', timestamp: new Date(Date.now() - 10800000), value: 0.12 }
    ]
  };

  useEffect(() => {
    setKeepsakes(mockKeepsakes);
    setCollectionStats(mockStats);
    
    // Simulate wallet connection
    setWalletAddress('0x8ba1f109551bD432803012645Hac136c');
    setWalletConnected(true);
  }, []);

  const createNFTKeepsake = async () => {
    setIsCreating(true);
    setCreationProgress(0);

    const steps = [
      { name: 'Preparing digital asset...', duration: 1500 },
      { name: 'Generating metadata...', duration: 1200 },
      { name: 'Creating smart contract...', duration: 2000 },
      { name: 'Uploading to IPFS...', duration: 1800 },
      { name: 'Minting NFT on blockchain...', duration: 3000 },
      { name: 'Finalizing keepsake...', duration: 800 }
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, steps[i].duration));
      setCreationProgress(((i + 1) / steps.length) * 100);
    }

    // Create new NFT keepsake
    const createdKeepsake: NFTKeepsake = {
      id: Date.now().toString(),
      title: newKeepsake.title,
      description: newKeepsake.description,
      imageUrl: '/uploads/a0278ce1-b82d-4ed6-a186-14a9503ef65c.png', // Mock image
      eventName: newKeepsake.eventName,
      eventDate: new Date(),
      edition: 1,
      totalEditions: newKeepsake.totalEditions,
      rarity: newKeepsake.rarity,
      blockchain: newKeepsake.blockchain,
      tokenId: `0x${Math.random().toString(16).substr(2, 12)}`,
      contractAddress: '0x742d35Cc6635C0532925a3b8D59C06Dd04f4b5E8',
      ownerAddress: walletAddress,
      createdAt: new Date(),
      mintedAt: new Date(),
      price: newKeepsake.price,
      currentValue: newKeepsake.price,
      attributes: [
        { trait_type: 'Creator', value: 'Event Host', rarity: 100 },
        { trait_type: 'Edition', value: `${1}/${newKeepsake.totalEditions}`, rarity: (1 / newKeepsake.totalEditions) * 100 }
      ],
      status: 'minted',
      unlockableContent: newKeepsake.includeUnlockableContent ? {
        type: 'photo',
        url: '/uploads/unlockable-content.jpg',
        description: newKeepsake.unlockableDescription
      } : undefined
    };

    setKeepsakes(prev => [createdKeepsake, ...prev]);
    setIsCreating(false);
    
    // Reset form
    setNewKeepsake({
      title: '',
      description: '',
      eventName: '',
      rarity: 'Common',
      blockchain: 'Polygon',
      totalEditions: 100,
      price: 0.1,
      includeUnlockableContent: false,
      unlockableDescription: ''
    });

    setTimeout(() => setCreationProgress(0), 2000);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common': return 'text-gray-600 bg-gray-100 border-gray-200';
      case 'Rare': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'Epic': return 'text-purple-600 bg-purple-100 border-purple-200';
      case 'Legendary': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'Mythic': return 'text-pink-600 bg-pink-100 border-pink-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'Common': return <Gem className="h-4 w-4" />;
      case 'Rare': return <Star className="h-4 w-4" />;
      case 'Epic': return <Crown className="h-4 w-4" />;
      case 'Legendary': return <Trophy className="h-4 w-4" />;
      case 'Mythic': return <Sparkles className="h-4 w-4" />;
      default: return <Gem className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Eye className="h-4 w-4 text-gray-500" />;
      case 'minting': return <Zap className="h-4 w-4 text-yellow-500 animate-pulse" />;
      case 'minted': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'listed': return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case 'sold': return <Award className="h-4 w-4 text-purple-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="space-y-6">
      {/* Header with Wallet Connection */}
      <Card className="glass-effect">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Gem className="h-5 w-5 text-electric-blue" />
                NFT Event Keepsakes
              </CardTitle>
              <CardDescription>
                Create and collect blockchain-verified digital memories from your special events
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              {walletConnected ? (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Connected
                  </Badge>
                  <Button variant="outline" size="sm">
                    <Wallet className="h-4 w-4 mr-2" />
                    {formatAddress(walletAddress)}
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setWalletConnected(true)}>
                  <Wallet className="h-4 w-4 mr-2" />
                  Connect Wallet
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Interface */}
      <Tabs value={selectedView} onValueChange={(v) => setSelectedView(v as any)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="gallery">My Collection</TabsTrigger>
          <TabsTrigger value="create">Create Keepsake</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="stats">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="gallery" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-electric-blue" />
                Your NFT Keepsakes ({keepsakes.length})
              </CardTitle>
              <CardDescription>
                Digital memories from your most precious moments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {keepsakes.map((keepsake) => (
                  <Card key={keepsake.id} className="overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                        onClick={() => setSelectedKeepsake(keepsake)}>
                    <div className="aspect-square relative">
                      <img
                        src={keepsake.imageUrl}
                        alt={keepsake.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2">
                        <Badge variant="outline" className={`${getRarityColor(keepsake.rarity)} border text-xs`}>
                          {getRarityIcon(keepsake.rarity)}
                          <span className="ml-1">{keepsake.rarity}</span>
                        </Badge>
                      </div>
                      <div className="absolute top-2 right-2">
                        <Badge variant="outline" className="bg-black/20 text-white border-white/20 text-xs">
                          #{keepsake.edition}/{keepsake.totalEditions}
                        </Badge>
                      </div>
                      <div className="absolute bottom-2 right-2">
                        {getStatusIcon(keepsake.status)}
                      </div>
                      {keepsake.unlockableContent && (
                        <div className="absolute bottom-2 left-2">
                          <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-200 text-xs">
                            <Lock className="h-3 w-3 mr-1" />
                            Unlockable
                          </Badge>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold truncate mb-1">{keepsake.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{keepsake.eventName}</p>
                      
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="secondary" className="text-xs">
                          {keepsake.blockchain}
                        </Badge>
                        {keepsake.currentValue && (
                          <span className="font-medium text-sm">
                            Ξ {keepsake.currentValue}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{keepsake.eventDate.toLocaleDateString()}</span>
                        <span className="capitalize">{keepsake.status}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-electric-blue" />
                Create New Keepsake
              </CardTitle>
              <CardDescription>
                Transform your special moments into unique digital collectibles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Keepsake Title</Label>
                    <Input
                      placeholder="e.g., Wedding First Kiss, Birthday Surprise..."
                      value={newKeepsake.title}
                      onChange={(e) => setNewKeepsake(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      placeholder="Describe this special moment and what makes it unique..."
                      value={newKeepsake.description}
                      onChange={(e) => setNewKeepsake(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Event Name</Label>
                    <Input
                      placeholder="e.g., Sarah & Michael's Wedding"
                      value={newKeepsake.eventName}
                      onChange={(e) => setNewKeepsake(prev => ({ ...prev, eventName: e.target.value }))}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Rarity</Label>
                      <Select value={newKeepsake.rarity} onValueChange={(v) => setNewKeepsake(prev => ({ ...prev, rarity: v as any }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Common">Common</SelectItem>
                          <SelectItem value="Rare">Rare</SelectItem>
                          <SelectItem value="Epic">Epic</SelectItem>
                          <SelectItem value="Legendary">Legendary</SelectItem>
                          <SelectItem value="Mythic">Mythic</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Blockchain</Label>
                      <Select value={newKeepsake.blockchain} onValueChange={(v) => setNewKeepsake(prev => ({ ...prev, blockchain: v as any }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Ethereum">Ethereum</SelectItem>
                          <SelectItem value="Polygon">Polygon (Low fees)</SelectItem>
                          <SelectItem value="Solana">Solana</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Total Editions</Label>
                      <Input
                        type="number"
                        min="1"
                        max="10000"
                        value={newKeepsake.totalEditions}
                        onChange={(e) => setNewKeepsake(prev => ({ ...prev, totalEditions: parseInt(e.target.value) || 1 }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Price (ETH)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={newKeepsake.price}
                        onChange={(e) => setNewKeepsake(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Unlockable Content</Label>
                        <p className="text-sm text-muted-foreground">Include exclusive content for owners</p>
                      </div>
                      <Switch 
                        checked={newKeepsake.includeUnlockableContent} 
                        onCheckedChange={(checked) => setNewKeepsake(prev => ({ ...prev, includeUnlockableContent: checked }))} 
                      />
                    </div>

                    {newKeepsake.includeUnlockableContent && (
                      <div className="space-y-2">
                        <Label>Unlockable Description</Label>
                        <Textarea
                          placeholder="Describe the exclusive content (high-res photos, videos, audio, etc.)"
                          value={newKeepsake.unlockableDescription}
                          onChange={(e) => setNewKeepsake(prev => ({ ...prev, unlockableDescription: e.target.value }))}
                          rows={2}
                        />
                      </div>
                    )}
                  </div>

                  <div className="border rounded-lg p-4 bg-muted/30">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Estimated Costs
                    </h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Minting Fee:</span>
                        <span>~$2.50</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Gas Fee (Polygon):</span>
                        <span>~$0.01</span>
                      </div>
                      <div className="flex justify-between font-medium border-t pt-1">
                        <span>Total:</span>
                        <span>~$2.51</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Button 
                  onClick={createNFTKeepsake}
                  disabled={isCreating || !newKeepsake.title || !newKeepsake.eventName || !walletConnected}
                  size="lg"
                  className="min-w-[200px]"
                >
                  {isCreating ? (
                    <>
                      <Zap className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Gem className="h-4 w-4 mr-2" />
                      Create Keepsake
                    </>
                  )}
                </Button>
                
                {isCreating && (
                  <div className="mt-4 space-y-2">
                    <Progress value={creationProgress} className="w-full max-w-md mx-auto" />
                    <p className="text-sm text-muted-foreground">
                      Minting your unique digital keepsake on the blockchain...
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketplace" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-electric-blue" />
                Keepsake Marketplace
              </CardTitle>
              <CardDescription>
                Discover and trade unique event memories from the community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Globe className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Marketplace Coming Soon</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Trade your event keepsakes, discover rare moments, and build your collection with other memory collectors.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <div className="p-4 border rounded-lg">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <h4 className="font-medium">Trading</h4>
                    <p className="text-sm text-muted-foreground">Buy and sell keepsakes</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                    <h4 className="font-medium">Auctions</h4>
                    <p className="text-sm text-muted-foreground">Bid on rare moments</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <Users className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <h4 className="font-medium">Community</h4>
                    <p className="text-sm text-muted-foreground">Connect with collectors</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          {collectionStats && (
            <>
              {/* Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6 text-center">
                    <Gem className="h-8 w-8 mx-auto mb-2 text-electric-blue" />
                    <p className="text-2xl font-bold">{collectionStats.totalKeepsakes}</p>
                    <p className="text-sm text-muted-foreground">Total Keepsakes</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <Coins className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                    <p className="text-2xl font-bold">Ξ {collectionStats.totalValue}</p>
                    <p className="text-sm text-muted-foreground">Collection Value</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <p className="text-2xl font-bold">Ξ {collectionStats.averagePrice}</p>
                    <p className="text-sm text-muted-foreground">Average Price</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <Star className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                    <p className="text-2xl font-bold">{collectionStats.rarityDistribution.Legendary + collectionStats.rarityDistribution.Mythic}</p>
                    <p className="text-sm text-muted-foreground">Rare Items</p>
                  </CardContent>
                </Card>
              </div>

              {/* Rarity Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Rarity Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(collectionStats.rarityDistribution).map(([rarity, count]) => (
                      <div key={rarity} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={`${getRarityColor(rarity)} border`}>
                            {getRarityIcon(rarity)}
                            <span className="ml-1">{rarity}</span>
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{count}</span>
                          <div className="w-32 bg-muted rounded-full h-2">
                            <div 
                              className="bg-electric-blue h-2 rounded-full" 
                              style={{ width: `${(count / collectionStats.totalKeepsakes) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {((count / collectionStats.totalKeepsakes) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {collectionStats.recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${
                            activity.type === 'mint' ? 'bg-green-100 text-green-600' :
                            activity.type === 'sale' ? 'bg-blue-100 text-blue-600' :
                            'bg-purple-100 text-purple-600'
                          }`}>
                            {activity.type === 'mint' ? <Zap className="h-4 w-4" /> :
                             activity.type === 'sale' ? <TrendingUp className="h-4 w-4" /> :
                             <ArrowRight className="h-4 w-4" />}
                          </div>
                          <div>
                            <p className="font-medium capitalize">{activity.type}</p>
                            <p className="text-sm text-muted-foreground">{activity.keepsake}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          {activity.value && (
                            <p className="font-medium">Ξ {activity.value}</p>
                          )}
                          <p className="text-sm text-muted-foreground">
                            {activity.timestamp.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Keepsake Detail Modal */}
      {selectedKeepsake && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
             onClick={() => setSelectedKeepsake(null)}>
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Image */}
                <div className="aspect-square rounded-lg overflow-hidden">
                  <img
                    src={selectedKeepsake.imageUrl}
                    alt={selectedKeepsake.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">{selectedKeepsake.title}</h2>
                      <p className="text-muted-foreground">{selectedKeepsake.eventName}</p>
                    </div>
                    <Badge variant="outline" className={`${getRarityColor(selectedKeepsake.rarity)} border`}>
                      {getRarityIcon(selectedKeepsake.rarity)}
                      <span className="ml-1">{selectedKeepsake.rarity}</span>
                    </Badge>
                  </div>

                  <p className="text-lg">{selectedKeepsake.description}</p>

                  {/* Properties */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Properties</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Edition:</span>
                          <span>#{selectedKeepsake.edition}/{selectedKeepsake.totalEditions}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Blockchain:</span>
                          <span>{selectedKeepsake.blockchain}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Status:</span>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(selectedKeepsake.status)}
                            <span className="capitalize">{selectedKeepsake.status}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Value</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Original Price:</span>
                          <span>Ξ {selectedKeepsake.price}</span>
                        </div>
                        {selectedKeepsake.currentValue && (
                          <div className="flex justify-between text-sm">
                            <span>Current Value:</span>
                            <span>Ξ {selectedKeepsake.currentValue}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm">
                          <span>Created:</span>
                          <span>{selectedKeepsake.createdAt.toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Attributes */}
                  <div>
                    <h4 className="font-medium mb-2">Attributes</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedKeepsake.attributes.map((attr, index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <p className="text-sm font-medium">{attr.trait_type}</p>
                          <p className="text-lg">{attr.value}</p>
                          <p className="text-xs text-muted-foreground">{attr.rarity}% have this trait</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contract Details */}
                  {selectedKeepsake.tokenId && (
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Blockchain Details
                      </h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center justify-between">
                          <span>Token ID:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono">{formatAddress(selectedKeepsake.tokenId)}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(selectedKeepsake.tokenId!)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Contract:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono">{formatAddress(selectedKeepsake.contractAddress!)}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(selectedKeepsake.contractAddress!)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button className="flex-1">
                      <Share className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View on OpenSea
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default NFTKeepsakes;