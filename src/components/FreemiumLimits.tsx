import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  Zap, 
  Upload, 
  Users, 
  Calendar,
  Crown,
  Star,
  Clock,
  Shield
} from 'lucide-react';

interface UsageStats {
  events: {
    used: number;
    limit: number;
    resetDate: string;
  };
  storage: {
    used: number;
    limit: number; // in GB
  };
  guests: {
    used: number;
    limit: number;
  };
  features: {
    hasAI: boolean;
    hasAdvancedCompression: boolean;
    hasCustomBranding: boolean;
    hasAnalytics: boolean;
  };
}

interface FreemiumLimitsProps {
  userPlan?: 'free' | 'pro' | 'premium' | 'enterprise';
  onUpgrade?: () => void;
}

const FreemiumLimits = ({ userPlan = 'free', onUpgrade }: FreemiumLimitsProps) => {
  // Mock usage data - in real app this would come from API
  const freeUsage: UsageStats = {
    events: { used: 2, limit: 3, resetDate: '2024-09-26' },
    storage: { used: 0.8, limit: 1 },
    guests: { used: 45, limit: 75 }, // across all events
    features: {
      hasAI: false,
      hasAdvancedCompression: false,
      hasCustomBranding: false,
      hasAnalytics: false
    }
  };

  const proUsage: UsageStats = {
    events: { used: 12, limit: -1, resetDate: '' }, // -1 means unlimited
    storage: { used: 23.5, limit: 100 },
    guests: { used: 350, limit: -1 },
    features: {
      hasAI: true,
      hasAdvancedCompression: true,
      hasCustomBranding: true,
      hasAnalytics: true
    }
  };

  const currentUsage = userPlan === 'free' ? freeUsage : proUsage;

  const getUsageColor = (used: number, limit: number) => {
    if (limit === -1) return 'text-green-600'; // unlimited
    const percentage = (used / limit) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getProgressColor = (used: number, limit: number) => {
    if (limit === -1) return ''; // unlimited
    const percentage = (used / limit) * 100;
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return '';
  };

  const formatStorage = (gb: number) => {
    if (gb < 1) return `${(gb * 1024).toFixed(0)} MB`;
    return `${gb.toFixed(1)} GB`;
  };

  const limitedFeatures = [
    {
      name: 'AI Auto-tagging',
      available: currentUsage.features.hasAI,
      icon: <Zap className="h-4 w-4" />,
      description: 'Automatically tag people and objects'
    },
    {
      name: 'Advanced Compression',
      available: currentUsage.features.hasAdvancedCompression,
      icon: <Upload className="h-4 w-4" />,
      description: 'High-quality compression with minimal loss'
    },
    {
      name: 'Custom Branding',
      available: currentUsage.features.hasCustomBranding,
      icon: <Shield className="h-4 w-4" />,
      description: 'Add your logo and custom colors'
    },
    {
      name: 'Analytics Dashboard',
      available: currentUsage.features.hasAnalytics,
      icon: <Star className="h-4 w-4" />,
      description: 'Detailed engagement and usage stats'
    }
  ];

  if (userPlan !== 'free') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            {userPlan.charAt(0).toUpperCase() + userPlan.slice(1)} Plan
          </CardTitle>
          <CardDescription>
            You have access to all premium features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Storage Used</span>
                <span className="text-sm text-muted-foreground">
                  {formatStorage(currentUsage.storage.used)} / {formatStorage(currentUsage.storage.limit)}
                </span>
              </div>
              <Progress 
                value={(currentUsage.storage.used / currentUsage.storage.limit) * 100} 
                className="h-2"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-green-600">
                <Zap className="h-3 w-3 mr-1" />
                All Features Unlocked
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Usage Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Free Plan Usage
            </span>
            <Button onClick={onUpgrade} size="sm">
              <Crown className="h-4 w-4 mr-2" />
              Upgrade
            </Button>
          </CardTitle>
          <CardDescription>
            Track your usage and see what's available with premium plans
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Events Usage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">Events this month</span>
              </div>
              <span className={`text-sm font-medium ${getUsageColor(currentUsage.events.used, currentUsage.events.limit)}`}>
                {currentUsage.events.used} / {currentUsage.events.limit}
              </span>
            </div>
            <Progress 
              value={(currentUsage.events.used / currentUsage.events.limit) * 100} 
              className={`h-2 ${getProgressColor(currentUsage.events.used, currentUsage.events.limit)}`}
            />
            {currentUsage.events.used >= currentUsage.events.limit - 1 && (
              <p className="text-xs text-yellow-600">
                Only {currentUsage.events.limit - currentUsage.events.used} events remaining this month
              </p>
            )}
          </div>

          {/* Storage Usage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                <span className="font-medium">Storage</span>
              </div>
              <span className={`text-sm font-medium ${getUsageColor(currentUsage.storage.used, currentUsage.storage.limit)}`}>
                {formatStorage(currentUsage.storage.used)} / {formatStorage(currentUsage.storage.limit)}
              </span>
            </div>
            <Progress 
              value={(currentUsage.storage.used / currentUsage.storage.limit) * 100} 
              className={`h-2 ${getProgressColor(currentUsage.storage.used, currentUsage.storage.limit)}`}
            />
          </div>

          {/* Guest Usage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="font-medium">Total guests (all events)</span>
              </div>
              <span className={`text-sm font-medium ${getUsageColor(currentUsage.guests.used, currentUsage.guests.limit)}`}>
                {currentUsage.guests.used} / {currentUsage.guests.limit}
              </span>
            </div>
            <Progress 
              value={(currentUsage.guests.used / currentUsage.guests.limit) * 100} 
              className={`h-2 ${getProgressColor(currentUsage.guests.used, currentUsage.guests.limit)}`}
            />
          </div>
        </CardContent>
      </Card>

      {/* Feature Limitations */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Access</CardTitle>
          <CardDescription>
            Premium features available with paid plans
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {limitedFeatures.map((feature, index) => (
              <div key={index} className={`flex items-start gap-3 p-3 border rounded-lg ${
                feature.available ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
              }`}>
                <div className={`p-1 rounded ${
                  feature.available ? 'text-green-600 bg-green-100' : 'text-gray-400 bg-gray-200'
                }`}>
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">{feature.name}</h4>
                    <Badge 
                      variant={feature.available ? 'secondary' : 'outline'} 
                      className={feature.available ? 'text-green-600' : 'text-gray-500'}
                    >
                      {feature.available ? 'Available' : 'Pro Only'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Prompt */}
      <Alert>
        <Zap className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <div>
            <strong>Ready to unlock all features?</strong> Upgrade to Pro for unlimited events, 100GB storage, and AI-powered features.
          </div>
          <Button onClick={onUpgrade} size="sm" className="ml-4">
            Upgrade Now
          </Button>
        </AlertDescription>
      </Alert>

      {/* Content Retention Warning */}
      <Alert>
        <Clock className="h-4 w-4" />
        <AlertDescription>
          <strong>Free plan limitation:</strong> Your photos will be automatically deleted after 7 days. 
          Upgrade to Pro for 90-day retention or Premium for unlimited storage.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default FreemiumLimits;