import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  Users, 
  DollarSign, 
  Share2, 
  TrendingUp,
  Gift,
  Copy,
  CheckCircle,
  Crown,
  Star,
  Zap,
  Trophy,
  Target,
  Eye,
  Calendar,
  Link,
  Mail,
  MessageSquare,
  Smartphone,
  RefreshCw,
  Award,
  Coins,
  BarChart3
} from 'lucide-react';

interface Referral {
  id: string;
  referrerName: string;
  refereeName: string;
  status: 'pending' | 'converted' | 'rewarded';
  signupDate: Date;
  conversionDate?: Date;
  tier: 'basic' | 'pro' | 'enterprise';
  commission: number;
  bonusEarned: number;
  channel: 'link' | 'email' | 'social' | 'qr';
}

interface ReferralTier {
  name: string;
  minReferrals: number;
  commissionRate: number;
  bonusMultiplier: number;
  perks: string[];
  color: string;
}

interface ReferralStats {
  totalReferrals: number;
  convertedReferrals: number;
  totalEarnings: number;
  currentTier: string;
  conversionRate: number;
  averageCommission: number;
  monthlyEarnings: number;
  nextTierProgress: number;
}

interface CampaignTemplate {
  id: string;
  name: string;
  description: string;
  medium: 'email' | 'social' | 'sms' | 'whatsapp';
  conversionRate: number;
  template: string;
}

const SmartReferrals = () => {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [referralCode, setReferralCode] = useState('SARAH2024');
  const [selectedCampaign, setSelectedCampaign] = useState('personal');
  const [autoShare, setAutoShare] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedText, setCopiedText] = useState('');

  const referralTiers: ReferralTier[] = [
    {
      name: 'Bronze',
      minReferrals: 0,
      commissionRate: 0.15,
      bonusMultiplier: 1.0,
      perks: ['15% commission', 'Basic dashboard', 'Email support'],
      color: 'text-orange-600 bg-orange-100'
    },
    {
      name: 'Silver',
      minReferrals: 5,
      commissionRate: 0.20,
      bonusMultiplier: 1.25,
      perks: ['20% commission', 'Advanced analytics', 'Priority support', '25% bonus multiplier'],
      color: 'text-gray-600 bg-gray-100'
    },
    {
      name: 'Gold',
      minReferrals: 15,
      commissionRate: 0.25,
      bonusMultiplier: 1.5,
      perks: ['25% commission', 'Custom campaigns', 'Dedicated support', '50% bonus multiplier'],
      color: 'text-yellow-600 bg-yellow-100'
    },
    {
      name: 'Platinum',
      minReferrals: 50,
      commissionRate: 0.30,
      bonusMultiplier: 2.0,
      perks: ['30% commission', 'White-label options', '24/7 support', '2x bonus multiplier', 'Revenue sharing'],
      color: 'text-purple-600 bg-purple-100'
    }
  ];

  const campaignTemplates: CampaignTemplate[] = [
    {
      id: 'personal',
      name: 'Personal Recommendation',
      description: 'Warm, personal message to friends and family',
      medium: 'email',
      conversionRate: 35,
      template: "Hey {name}! I've been using this amazing photo sharing platform for my events - you'd love it for {event_type}! Use my code {referral_code} and we both get rewards! 📸✨"
    },
    {
      id: 'social_media',
      name: 'Social Media Post',
      description: 'Engaging post for social platforms',
      medium: 'social',
      conversionRate: 12,
      template: "Just discovered the perfect solution for sharing event photos! 🎉 Professional features, beautiful galleries, and happy guests. Try it with code {referral_code} 👆 #EventPhotography #PhotoSharing"
    },
    {
      id: 'professional',
      name: 'Professional Network',
      description: 'Business-focused message for professional contacts',
      medium: 'email',
      conversionRate: 28,
      template: "Hi {name}, I wanted to share a platform that's revolutionized how I handle event photography and client galleries. The ROI has been fantastic. Interested in checking it out? Code: {referral_code}"
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Message',
      description: 'Quick personal message for WhatsApp',
      medium: 'whatsapp',
      conversionRate: 45,
      template: "Hey! Check out this photo sharing app I'm using - it's incredible for events! Use {referral_code} and we both get bonuses 🎁"
    }
  ];

  const mockReferrals: Referral[] = [
    {
      id: '1',
      referrerName: 'Sarah Mitchell',
      refereeName: 'Emma Johnson',
      status: 'rewarded',
      signupDate: new Date('2024-08-01'),
      conversionDate: new Date('2024-08-03'),
      tier: 'pro',
      commission: 45.99,
      bonusEarned: 25,
      channel: 'email'
    },
    {
      id: '2',
      referrerName: 'Sarah Mitchell',
      refereeName: 'Michael Chen',
      status: 'converted',
      signupDate: new Date('2024-08-10'),
      conversionDate: new Date('2024-08-12'),
      tier: 'basic',
      commission: 15.99,
      bonusEarned: 15,
      channel: 'social'
    },
    {
      id: '3',
      referrerName: 'Sarah Mitchell',
      refereeName: 'Jennifer Lopez',
      status: 'pending',
      signupDate: new Date('2024-08-20'),
      tier: 'pro',
      commission: 0,
      bonusEarned: 0,
      channel: 'whatsapp'
    },
    {
      id: '4',
      referrerName: 'Sarah Mitchell',
      refereeName: 'David Wilson',
      status: 'rewarded',
      signupDate: new Date('2024-07-15'),
      conversionDate: new Date('2024-07-18'),
      tier: 'enterprise',
      commission: 149.99,
      bonusEarned: 50,
      channel: 'link'
    }
  ];

  const mockStats: ReferralStats = {
    totalReferrals: 12,
    convertedReferrals: 8,
    totalEarnings: 487.50,
    currentTier: 'Silver',
    conversionRate: 66.7,
    averageCommission: 52.85,
    monthlyEarnings: 156.20,
    nextTierProgress: 60 // 9 out of 15 for Gold
  };

  useEffect(() => {
    setReferrals(mockReferrals);
    setStats(mockStats);
  }, []);

  const generateReferralLink = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    setReferralCode(`${newCode}24`);
    setIsGenerating(false);
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(''), 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'rewarded': return 'text-green-600 bg-green-100 border-green-200';
      case 'converted': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'pending': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'social': return <Share2 className="h-4 w-4" />;
      case 'whatsapp': return <MessageSquare className="h-4 w-4" />;
      case 'link': return <Link className="h-4 w-4" />;
      case 'qr': return <Smartphone className="h-4 w-4" />;
      default: return <Share2 className="h-4 w-4" />;
    }
  };

  const getCurrentTier = () => {
    return referralTiers.find(t => t.name === stats?.currentTier) || referralTiers[0];
  };

  const getNextTier = () => {
    const currentIndex = referralTiers.findIndex(t => t.name === stats?.currentTier);
    return currentIndex < referralTiers.length - 1 ? referralTiers[currentIndex + 1] : null;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-electric-blue" />
              Smart Referrals
            </CardTitle>
            <CardDescription>
              Earn rewards by sharing with your network
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Current Tier:</span>
                <Badge className={`${getCurrentTier().color} border`}>
                  <Crown className="h-3 w-3 mr-1" />
                  {stats.currentTier}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span>Total Earnings:</span>
                <span className="text-xl font-bold text-green-600">${stats.totalEarnings}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span>This Month:</span>
                <span className="font-semibold">${stats.monthlyEarnings}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span>Conversion Rate:</span>
                <span className="font-semibold">{stats.conversionRate}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <Target className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                <p className="text-2xl font-bold">{stats.totalReferrals}</p>
                <p className="text-xs text-muted-foreground">Total Referrals</p>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <CheckCircle className="h-6 w-6 mx-auto mb-2 text-green-500" />
                <p className="text-2xl font-bold">{stats.convertedReferrals}</p>
                <p className="text-xs text-muted-foreground">Converted</p>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <DollarSign className="h-6 w-6 mx-auto mb-2 text-emerald-500" />
                <p className="text-2xl font-bold">${stats.averageCommission}</p>
                <p className="text-xs text-muted-foreground">Avg Commission</p>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <TrendingUp className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                <p className="text-2xl font-bold">{getCurrentTier().commissionRate * 100}%</p>
                <p className="text-xs text-muted-foreground">Commission Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tier Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-electric-blue" />
            Tier Progress
          </CardTitle>
          <CardDescription>
            {getNextTier() ? `${15 - stats.totalReferrals} more referrals to reach ${getNextTier()!.name}` : 'Maximum tier achieved!'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {getNextTier() && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Progress to {getNextTier()!.name}</span>
                  <span>{stats.totalReferrals}/{getNextTier()!.minReferrals}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-electric-blue h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${(stats.totalReferrals / getNextTier()!.minReferrals) * 100}%` }}
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {referralTiers.map((tier, index) => (
                <div key={tier.name} className={`p-4 border rounded-lg ${tier.name === stats.currentTier ? 'ring-2 ring-electric-blue bg-blue-50' : ''}`}>
                  <div className="text-center mb-3">
                    <Badge className={`${tier.color} border mb-2`}>
                      {tier.name}
                    </Badge>
                    <p className="text-sm text-muted-foreground">{tier.minReferrals}+ referrals</p>
                  </div>
                  
                  <div className="space-y-1 text-xs">
                    {tier.perks.slice(0, 2).map((perk, i) => (
                      <div key={i} className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span>{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referral Tools */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-electric-blue" />
            Referral Tools
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Your Referral Code</Label>
                <div className="flex gap-2">
                  <Input value={referralCode} readOnly className="font-mono" />
                  <Button 
                    variant="outline"
                    onClick={() => copyToClipboard(referralCode, 'code')}
                  >
                    {copiedText === 'code' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={generateReferralLink}
                    disabled={isGenerating}
                  >
                    {isGenerating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Referral Link</Label>
                <div className="flex gap-2">
                  <Input 
                    value={`https://hub.com/join?ref=${referralCode}`} 
                    readOnly 
                    className="font-mono text-sm"
                  />
                  <Button 
                    variant="outline"
                    onClick={() => copyToClipboard(`https://hub.com/join?ref=${referralCode}`, 'link')}
                  >
                    {copiedText === 'link' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Auto-share after events</Label>
                  <p className="text-sm text-muted-foreground">Automatically suggest referrals to satisfied guests</p>
                </div>
                <Switch checked={autoShare} onCheckedChange={setAutoShare} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Campaign Template</Label>
                <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {campaignTemplates.map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{template.name}</span>
                          <Badge variant="secondary" className="ml-2 text-xs">
                            {template.conversionRate}% CVR
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="p-3 bg-muted/30 rounded border">
                <p className="text-sm">
                  {campaignTemplates.find(t => t.id === selectedCampaign)?.template.replace('{referral_code}', referralCode)}
                </p>
              </div>

              <Button 
                className="w-full"
                onClick={() => copyToClipboard(
                  campaignTemplates.find(t => t.id === selectedCampaign)?.template.replace('{referral_code}', referralCode) || '', 
                  'template'
                )}
              >
                {copiedText === 'template' ? <CheckCircle className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                Copy Message Template
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referral History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-electric-blue" />
            Referral History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {referrals.map((referral) => (
              <div key={referral.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${getStatusColor(referral.status)}`}>
                    {getChannelIcon(referral.channel)}
                  </div>
                  <div>
                    <p className="font-medium">{referral.refereeName}</p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>Signed up {formatDate(referral.signupDate)}</span>
                      <Badge variant="secondary" className="text-xs">{referral.tier}</Badge>
                      {referral.conversionDate && (
                        <span>• Converted {formatDate(referral.conversionDate)}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className={`${getStatusColor(referral.status)} text-xs border`}>
                      {referral.status}
                    </Badge>
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold text-green-600">
                      ${referral.commission + referral.bonusEarned}
                    </span>
                    {referral.commission > 0 && (
                      <span className="text-muted-foreground ml-1">earned</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Campaign Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Channel Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { channel: 'WhatsApp', rate: 45, count: 3 },
                { channel: 'Email', rate: 35, count: 4 },
                { channel: 'Direct Link', rate: 28, count: 3 },
                { channel: 'Social Media', rate: 12, count: 2 }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center gap-2">
                    {getChannelIcon(item.channel.toLowerCase())}
                    <span className="font-medium">{item.channel}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{item.rate}%</p>
                    <p className="text-sm text-muted-foreground">{item.count} referrals</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Earnings Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Commission Earnings:</span>
                <span className="font-semibold text-blue-600">${(stats.totalEarnings * 0.8).toFixed(2)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span>Bonus Rewards:</span>
                <span className="font-semibold text-green-600">${(stats.totalEarnings * 0.2).toFixed(2)}</span>
              </div>
              
              <div className="flex items-center justify-between border-t pt-2">
                <span className="font-medium">Total Earned:</span>
                <span className="text-xl font-bold text-emerald-600">${stats.totalEarnings}</span>
              </div>
              
              <div className="text-center pt-4">
                <Button className="w-full">
                  <Coins className="h-4 w-4 mr-2" />
                  Request Payout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tips */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Zap className="h-5 w-5 text-electric-blue mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-medium mb-2">Referral Success Tips</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Personal recommendations convert 3x better than generic links</li>
                <li>• Share right after successful events when satisfaction is highest</li>
                <li>• WhatsApp and personal messages have the highest conversion rates</li>
                <li>• Target users who regularly host events (weddings, parties, corporate)</li>
                <li>• Mention specific benefits relevant to their event type</li>
                <li>• Follow up with pending referrals after 1 week</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartReferrals;