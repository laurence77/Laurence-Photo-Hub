import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Globe, 
  DollarSign, 
  TrendingUp, 
  MapPin,
  Users,
  Calendar,
  BarChart3,
  Target,
  Zap,
  CreditCard,
  Coins,
  TrendingDown,
  Eye,
  RefreshCw,
  Settings,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface PricingTier {
  id: string;
  name: string;
  basePrice: number;
  currency: string;
  features: string[];
  popular?: boolean;
}

interface RegionPricing {
  region: string;
  country: string;
  currency: string;
  symbol: string;
  basePrice: number;
  adjustedPrice: number;
  adjustmentFactor: number;
  purchasingPower: number;
  competitorPrice?: number;
  demandLevel: 'low' | 'medium' | 'high';
  seasonality: number;
  userCount: number;
  conversionRate: number;
}

interface PricingMetrics {
  totalRevenue: number;
  averagePrice: number;
  conversionRate: number;
  regionPerformance: {
    best: string;
    worst: string;
  };
  recentAdjustments: number;
  priceElasticity: number;
}

const AdaptivePricing = () => {
  const [regionPricing, setRegionPricing] = useState<RegionPricing[]>([]);
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedTier, setSelectedTier] = useState('pro');
  const [metrics, setMetrics] = useState<PricingMetrics | null>(null);
  const [autoAdjustment, setAutoAdjustment] = useState(true);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const pricingTiers: PricingTier[] = [
    {
      id: 'basic',
      name: 'Basic',
      basePrice: 9.99,
      currency: 'USD',
      features: ['5 Events', '100 Photos/Event', 'Basic Sharing', 'Email Support']
    },
    {
      id: 'pro',
      name: 'Pro',
      basePrice: 29.99,
      currency: 'USD',
      features: ['Unlimited Events', '1000 Photos/Event', 'Advanced Features', 'Priority Support'],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      basePrice: 99.99,
      currency: 'USD',
      features: ['Custom Branding', 'API Access', 'Advanced Analytics', 'Dedicated Support']
    }
  ];

  const mockRegionPricing: RegionPricing[] = [
    {
      region: 'North America',
      country: 'United States',
      currency: 'USD',
      symbol: '$',
      basePrice: 29.99,
      adjustedPrice: 29.99,
      adjustmentFactor: 1.0,
      purchasingPower: 1.0,
      competitorPrice: 34.99,
      demandLevel: 'high',
      seasonality: 1.15,
      userCount: 12450,
      conversionRate: 8.5
    },
    {
      region: 'Europe',
      country: 'Germany',
      currency: 'EUR',
      symbol: '€',
      basePrice: 29.99,
      adjustedPrice: 24.99,
      adjustmentFactor: 0.83,
      purchasingPower: 0.85,
      competitorPrice: 27.99,
      demandLevel: 'medium',
      seasonality: 1.05,
      userCount: 8920,
      conversionRate: 6.8
    },
    {
      region: 'Asia Pacific',
      country: 'India',
      currency: 'INR',
      symbol: '₹',
      basePrice: 29.99,
      adjustedPrice: 1299,
      adjustmentFactor: 0.52,
      purchasingPower: 0.35,
      competitorPrice: 1599,
      demandLevel: 'high',
      seasonality: 0.95,
      userCount: 15670,
      conversionRate: 12.3
    },
    {
      region: 'Latin America',
      country: 'Brazil',
      currency: 'BRL',
      symbol: 'R$',
      basePrice: 29.99,
      adjustedPrice: 89.90,
      adjustmentFactor: 0.65,
      purchasingPower: 0.45,
      competitorPrice: 119.90,
      demandLevel: 'medium',
      seasonality: 1.08,
      userCount: 5430,
      conversionRate: 7.2
    },
    {
      region: 'Asia Pacific',
      country: 'Japan',
      currency: 'JPY',
      symbol: '¥',
      basePrice: 29.99,
      adjustedPrice: 3200,
      adjustmentFactor: 0.78,
      purchasingPower: 0.82,
      competitorPrice: 3800,
      demandLevel: 'low',
      seasonality: 0.92,
      userCount: 3210,
      conversionRate: 4.1
    },
    {
      region: 'Africa',
      country: 'South Africa',
      currency: 'ZAR',
      symbol: 'R',
      basePrice: 29.99,
      adjustedPrice: 299,
      adjustmentFactor: 0.42,
      purchasingPower: 0.28,
      competitorPrice: 399,
      demandLevel: 'medium',
      seasonality: 1.12,
      userCount: 1890,
      conversionRate: 9.8
    }
  ];

  const mockMetrics: PricingMetrics = {
    totalRevenue: 847320,
    averagePrice: 24.85,
    conversionRate: 8.2,
    regionPerformance: {
      best: 'India',
      worst: 'Japan'
    },
    recentAdjustments: 5,
    priceElasticity: -1.2
  };

  useEffect(() => {
    setRegionPricing(mockRegionPricing);
    setMetrics(mockMetrics);

    // Simulate real-time price updates
    const interval = setInterval(() => {
      setRegionPricing(prev => prev.map(region => ({
        ...region,
        conversionRate: Math.max(1, region.conversionRate + (Math.random() - 0.5) * 0.5),
        seasonality: Math.max(0.8, Math.min(1.3, region.seasonality + (Math.random() - 0.5) * 0.02))
      })));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const optimizePricing = async () => {
    setIsOptimizing(true);
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Simulate price optimization
    setRegionPricing(prev => prev.map(region => {
      const demandMultiplier = region.demandLevel === 'high' ? 1.1 : region.demandLevel === 'low' ? 0.9 : 1.0;
      const newAdjustment = region.adjustmentFactor * demandMultiplier * region.seasonality;
      
      return {
        ...region,
        adjustmentFactor: Math.max(0.3, Math.min(1.5, newAdjustment)),
        adjustedPrice: region.currency === 'USD' 
          ? region.basePrice * newAdjustment
          : region.currency === 'EUR'
          ? region.basePrice * newAdjustment
          : region.currency === 'INR'
          ? Math.round(region.basePrice * newAdjustment * 83)
          : region.currency === 'BRL'
          ? Math.round(region.basePrice * newAdjustment * 5.2)
          : region.currency === 'JPY' 
          ? Math.round(region.basePrice * newAdjustment * 150)
          : Math.round(region.basePrice * newAdjustment * 18)
      };
    }));

    setIsOptimizing(false);
  };

  const getDemandColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getAdjustmentColor = (factor: number) => {
    if (factor > 1.0) return 'text-red-600';
    if (factor < 0.8) return 'text-green-600';
    return 'text-blue-600';
  };

  const formatPrice = (price: number, currency: string, symbol: string) => {
    if (currency === 'JPY' || currency === 'INR' || currency === 'ZAR' || currency === 'BRL') {
      return `${symbol}${Math.round(price).toLocaleString()}`;
    }
    return `${symbol}${price.toFixed(2)}`;
  };

  const filteredRegions = selectedRegion === 'all' 
    ? regionPricing 
    : regionPricing.filter(r => r.region === selectedRegion);

  if (!metrics) return null;

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <Card className="glass-effect">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-electric-blue" />
                Adaptive Global Pricing
              </CardTitle>
              <CardDescription>
                AI-powered pricing optimization by region and demand
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Label>Auto-adjustment</Label>
                <Switch checked={autoAdjustment} onCheckedChange={setAutoAdjustment} />
              </div>
              <Button onClick={optimizePricing} disabled={isOptimizing}>
                {isOptimizing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Optimizing...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Optimize Pricing
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Global Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="h-6 w-6 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold">${metrics.totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Revenue</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-6 w-6 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-bold">${metrics.averagePrice}</p>
            <p className="text-xs text-muted-foreground">Avg Price</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-6 w-6 mx-auto mb-2 text-purple-500" />
            <p className="text-2xl font-bold">{metrics.conversionRate}%</p>
            <p className="text-xs text-muted-foreground">Conversion</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <BarChart3 className="h-6 w-6 mx-auto mb-2 text-orange-500" />
            <p className="text-2xl font-bold">{metrics.priceElasticity}</p>
            <p className="text-xs text-muted-foreground">Elasticity</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-6 w-6 mx-auto mb-2 text-emerald-500" />
            <p className="text-2xl font-bold">{metrics.regionPerformance.best}</p>
            <p className="text-xs text-muted-foreground">Best Region</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Settings className="h-6 w-6 mx-auto mb-2 text-pink-500" />
            <p className="text-2xl font-bold">{metrics.recentAdjustments}</p>
            <p className="text-xs text-muted-foreground">Adjustments</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Select value={selectedRegion} onValueChange={setSelectedRegion}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Regions</SelectItem>
            <SelectItem value="North America">North America</SelectItem>
            <SelectItem value="Europe">Europe</SelectItem>
            <SelectItem value="Asia Pacific">Asia Pacific</SelectItem>
            <SelectItem value="Latin America">Latin America</SelectItem>
            <SelectItem value="Africa">Africa</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedTier} onValueChange={setSelectedTier}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pricingTiers.map(tier => (
              <SelectItem key={tier.id} value={tier.id}>
                {tier.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Regional Pricing Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-electric-blue" />
            Regional Pricing Analysis
          </CardTitle>
          <CardDescription>
            Pricing optimization by purchasing power and local demand
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredRegions.map((region, index) => (
              <div key={index} className="p-6 border rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">{region.country}</h3>
                      <p className="text-sm text-muted-foreground">{region.region}</p>
                    </div>
                    <Badge variant="outline" className={`${getDemandColor(region.demandLevel)} text-xs`}>
                      {region.demandLevel} demand
                    </Badge>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-2xl font-bold">
                      {formatPrice(region.adjustedPrice, region.currency, region.symbol)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Base: {formatPrice(region.basePrice, 'USD', '$')}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                  <div className="text-center p-3 bg-muted/30 rounded">
                    <p className="font-medium">Adjustment</p>
                    <p className={`text-lg font-bold ${getAdjustmentColor(region.adjustmentFactor)}`}>
                      {((region.adjustmentFactor - 1) * 100).toFixed(0)}%
                    </p>
                  </div>
                  
                  <div className="text-center p-3 bg-muted/30 rounded">
                    <p className="font-medium">Purchasing Power</p>
                    <p className="text-lg font-bold">{(region.purchasingPower * 100).toFixed(0)}%</p>
                  </div>
                  
                  <div className="text-center p-3 bg-muted/30 rounded">
                    <p className="font-medium">Seasonality</p>
                    <p className="text-lg font-bold">×{region.seasonality.toFixed(2)}</p>
                  </div>
                  
                  <div className="text-center p-3 bg-muted/30 rounded">
                    <p className="font-medium">Users</p>
                    <p className="text-lg font-bold">{region.userCount.toLocaleString()}</p>
                  </div>
                  
                  <div className="text-center p-3 bg-muted/30 rounded">
                    <p className="font-medium">Conversion</p>
                    <p className="text-lg font-bold text-green-600">{region.conversionRate.toFixed(1)}%</p>
                  </div>
                  
                  <div className="text-center p-3 bg-muted/30 rounded">
                    <p className="font-medium">vs Competition</p>
                    <p className="text-lg font-bold">
                      {region.competitorPrice && 
                        formatPrice(region.competitorPrice, region.currency, region.symbol)
                      }
                    </p>
                  </div>
                </div>

                {region.competitorPrice && (
                  <div className="mt-4 flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium">Competitive Advantage</p>
                      <p className="text-sm text-muted-foreground">
                        {region.adjustedPrice < region.competitorPrice ? 'Lower than' : 'Higher than'} competitor pricing
                      </p>
                    </div>
                    <Badge variant={region.adjustedPrice < region.competitorPrice ? 'default' : 'secondary'}>
                      {region.adjustedPrice < region.competitorPrice ? (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      )}
                      {Math.abs(((region.adjustedPrice - region.competitorPrice) / region.competitorPrice) * 100).toFixed(0)}%
                    </Badge>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pricing Tiers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-electric-blue" />
            Pricing Tiers
          </CardTitle>
          <CardDescription>
            Base pricing structure adapted globally
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingTiers.map((tier) => (
              <Card key={tier.id} className={`${tier.popular ? 'ring-2 ring-electric-blue' : ''}`}>
                <CardContent className="p-6">
                  {tier.popular && (
                    <Badge className="mb-4 bg-electric-blue">Most Popular</Badge>
                  )}
                  
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold">{tier.name}</h3>
                    <div className="mt-2">
                      <span className="text-3xl font-bold">${tier.basePrice}</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Base USD price</p>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    {tier.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button className="w-full" variant={tier.popular ? 'default' : 'outline'}>
                    Choose {tier.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-electric-blue" />
            AI Pricing Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Optimization Opportunities</h4>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-800">Increase India Pricing</p>
                    <p className="text-sm text-green-600">High demand allows 15% price increase</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-800">Monitor Japan Market</p>
                    <p className="text-sm text-yellow-600">Low conversion may need price adjustment</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <Eye className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-800">Seasonal Adjustment</p>
                    <p className="text-sm text-blue-600">US market showing 15% seasonal increase</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Market Intelligence</h4>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between p-2 border rounded">
                  <span>Price Elasticity:</span>
                  <span className="font-medium">-1.2 (elastic)</span>
                </div>
                
                <div className="flex justify-between p-2 border rounded">
                  <span>Best Converting Region:</span>
                  <span className="font-medium text-green-600">India (12.3%)</span>
                </div>
                
                <div className="flex justify-between p-2 border rounded">
                  <span>Highest Revenue:</span>
                  <span className="font-medium text-blue-600">United States</span>
                </div>
                
                <div className="flex justify-between p-2 border rounded">
                  <span>Most Price Sensitive:</span>
                  <span className="font-medium text-orange-600">Brazil</span>
                </div>
                
                <div className="flex justify-between p-2 border rounded">
                  <span>Growth Opportunity:</span>
                  <span className="font-medium text-purple-600">Africa (+25%)</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-electric-blue" />
            Pricing Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Automation Settings</h4>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Auto Price Adjustment</Label>
                    <p className="text-sm text-muted-foreground">AI-driven price optimization</p>
                  </div>
                  <Switch checked={autoAdjustment} onCheckedChange={setAutoAdjustment} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Competitive Monitoring</Label>
                    <p className="text-sm text-muted-foreground">Track competitor pricing</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Seasonal Adjustments</Label>
                    <p className="text-sm text-muted-foreground">Adapt to seasonal demand</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Adjustment Limits</h4>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span>Maximum Increase:</span>
                  <Badge variant="outline">+50%</Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span>Maximum Decrease:</span>
                  <Badge variant="outline">-70%</Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span>Update Frequency:</span>
                  <Badge variant="outline">Daily</Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span>Confidence Threshold:</span>
                  <Badge variant="outline">85%</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdaptivePricing;