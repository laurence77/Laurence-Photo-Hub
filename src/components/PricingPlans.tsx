import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Check, 
  Star, 
  Crown, 
  Building, 
  Camera, 
  Users, 
  Upload, 
  Shield,
  Zap,
  Music,
  Palette,
  Globe,
  BarChart,
  Headphones,
  Award,
  Sparkles
} from 'lucide-react';

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
  };
  features: string[];
  limits: {
    events: string;
    storage: string;
    guests: string;
    photos: string;
  };
  popular?: boolean;
  icon: React.ReactNode;
  color: string;
  cta: string;
}

const PricingPlans = () => {
  const [isYearly, setIsYearly] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans: PricingPlan[] = [
    {
      id: 'free',
      name: 'Free',
      description: 'Perfect for small personal events',
      price: { monthly: 0, yearly: 0 },
      features: [
        'Up to 25 guests per event',
        '1GB storage included',
        'Basic photo sharing',
        'Standard compression',
        'Email support',
        'Basic reactions',
        '7-day content retention'
      ],
      limits: {
        events: '3 events/month',
        storage: '1GB total',
        guests: '25 per event',
        photos: '100 per event'
      },
      icon: <Camera className="h-6 w-6" />,
      color: 'text-gray-600',
      cta: 'Start Free'
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'For professional photographers and event planners',
      price: { monthly: 29, yearly: 290 },
      features: [
        'Unlimited guests per event',
        '100GB premium storage',
        'AI-powered auto-tagging',
        'Facial clustering (privacy-first)',
        'High-quality compression',
        'Real-time photo wall',
        'Custom branding',
        'Priority support',
        'Advanced analytics',
        '90-day content retention',
        'Slideshow with music',
        'Best moments AI curation'
      ],
      limits: {
        events: 'Unlimited',
        storage: '100GB',
        guests: 'Unlimited',
        photos: 'Unlimited'
      },
      popular: true,
      icon: <Star className="h-6 w-6" />,
      color: 'text-blue-600',
      cta: 'Go Pro'
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'For high-volume events and enterprises',
      price: { monthly: 99, yearly: 990 },
      features: [
        'Everything in Pro',
        '1TB enterprise storage',
        'White-label solution',
        'Custom domains',
        'Advanced API access',
        'Dedicated account manager',
        '24/7 phone support',
        'Enterprise-grade security',
        'Custom integrations',
        'Unlimited content retention',
        'Multi-brand management',
        'Advanced analytics dashboard'
      ],
      limits: {
        events: 'Unlimited',
        storage: '1TB',
        guests: 'Unlimited',
        photos: 'Unlimited'
      },
      icon: <Crown className="h-6 w-6" />,
      color: 'text-purple-600',
      cta: 'Contact Sales'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Custom solutions for large organizations',
      price: { monthly: 299, yearly: 2990 },
      features: [
        'Everything in Premium',
        'Unlimited storage',
        'On-premise deployment',
        'Custom development',
        'SLA guarantees',
        'Advanced compliance',
        'Multi-region hosting',
        'Custom training',
        'Dedicated infrastructure',
        'White-glove onboarding'
      ],
      limits: {
        events: 'Unlimited',
        storage: 'Unlimited',
        guests: 'Unlimited',
        photos: 'Unlimited'
      },
      icon: <Building className="h-6 w-6" />,
      color: 'text-emerald-600',
      cta: 'Contact Sales'
    }
  ];

  const addOns = [
    {
      name: 'Additional Storage',
      description: '10GB extra storage',
      price: 5,
      icon: <Upload className="h-4 w-4" />
    },
    {
      name: 'Premium Music Library',
      description: 'Licensed music for slideshows',
      price: 15,
      icon: <Music className="h-4 w-4" />
    },
    {
      name: 'Advanced Branding',
      description: 'Custom themes and logos',
      price: 25,
      icon: <Palette className="h-4 w-4" />
    },
    {
      name: 'Priority Support',
      description: '24/7 dedicated support',
      price: 35,
      icon: <Headphones className="h-4 w-4" />
    }
  ];

  const businessFeatures = [
    {
      title: 'Wedding Venues',
      description: 'White-label solution for wedding venues to offer premium photo sharing',
      icon: <Award className="h-8 w-8 text-pink-500" />,
      features: ['Custom branding', 'Venue analytics', 'Guest management']
    },
    {
      title: 'Corporate Events',
      description: 'Enterprise-grade photo sharing for conferences and corporate gatherings',
      icon: <Building className="h-8 w-8 text-blue-500" />,
      features: ['Brand compliance', 'Security controls', 'Analytics dashboard']
    },
    {
      title: 'Event Planners',
      description: 'Professional tools for event planning agencies and photographers',
      icon: <Users className="h-8 w-8 text-green-500" />,
      features: ['Multi-client management', 'Portfolio showcase', 'Client billing']
    }
  ];

  const getYearlyDiscount = (monthly: number, yearly: number) => {
    if (monthly === 0) return 0;
    return Math.round((1 - yearly / (monthly * 12)) * 100);
  };

  return (
    <div className="space-y-8">
      {/* Billing Toggle */}
      <div className="flex items-center justify-center space-x-4">
        <Label htmlFor="billing-toggle">Monthly</Label>
        <Switch
          id="billing-toggle"
          checked={isYearly}
          onCheckedChange={setIsYearly}
        />
        <Label htmlFor="billing-toggle">Yearly</Label>
        <Badge variant="secondary" className="ml-2 text-green-600">
          Save up to 17%
        </Badge>
      </div>

      {/* Main Pricing Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative transition-all duration-200 ${
              plan.popular ? 'ring-2 ring-blue-500 scale-105' : 'hover:shadow-lg'
            } ${selectedPlan === plan.id ? 'ring-2 ring-purple-500' : ''}`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-500 text-white px-4 py-1">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center pb-4">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4 ${plan.color}`}>
                {plan.icon}
              </div>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              
              <div className="mt-4">
                <div className="text-3xl font-bold">
                  ${isYearly ? plan.price.yearly : plan.price.monthly}
                  {plan.price.monthly > 0 && (
                    <span className="text-base font-normal text-muted-foreground">
                      /{isYearly ? 'year' : 'month'}
                    </span>
                  )}
                </div>
                {isYearly && plan.price.monthly > 0 && (
                  <div className="text-sm text-green-600">
                    {getYearlyDiscount(plan.price.monthly, plan.price.yearly)}% off
                  </div>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Limits */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Events:</span>
                  <span className="font-medium">{plan.limits.events}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Storage:</span>
                  <span className="font-medium">{plan.limits.storage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Guests:</span>
                  <span className="font-medium">{plan.limits.guests}</span>
                </div>
              </div>
              
              <Separator />
              
              {/* Features */}
              <div className="space-y-2">
                {plan.features.slice(0, 6).map((feature, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
                {plan.features.length > 6 && (
                  <div className="text-sm text-muted-foreground">
                    +{plan.features.length - 6} more features
                  </div>
                )}
              </div>
              
              <Button 
                className="w-full mt-6" 
                variant={plan.popular ? 'default' : 'outline'}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.cta}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add-ons */}
      <Card>
        <CardHeader>
          <CardTitle>Add-ons & Extras</CardTitle>
          <CardDescription>Enhance your plan with additional features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {addOns.map((addon, index) => (
              <div key={index} className="border rounded-lg p-4 text-center">
                <div className="flex justify-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    {addon.icon}
                  </div>
                </div>
                <h4 className="font-medium mb-2">{addon.name}</h4>
                <p className="text-sm text-muted-foreground mb-3">{addon.description}</p>
                <div className="text-lg font-bold">${addon.price}/month</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* B2B Solutions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Business Solutions
          </CardTitle>
          <CardDescription>
            White-label and enterprise solutions for venues, planners, and corporations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {businessFeatures.map((business, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="flex justify-center">
                  {business.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-2">{business.title}</h4>
                  <p className="text-muted-foreground text-sm mb-4">{business.description}</p>
                  <div className="space-y-1">
                    {business.features.map((feature, fIndex) => (
                      <div key={fIndex} className="flex items-center gap-2 justify-center text-sm">
                        <Check className="h-3 w-3 text-green-500" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Learn More
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <h4 className="font-medium">What happens to my photos after events expire?</h4>
              <p className="text-sm text-muted-foreground">Photos are automatically archived and can be downloaded. Premium plans include longer retention periods.</p>
            </div>
            <div>
              <h4 className="font-medium">Can I upgrade or downgrade my plan?</h4>
              <p className="text-sm text-muted-foreground">Yes, you can change your plan at any time. Changes take effect at the next billing cycle.</p>
            </div>
            <div>
              <h4 className="font-medium">Is there a limit on photo quality?</h4>
              <p className="text-sm text-muted-foreground">Free plans include standard compression. Pro plans and above include high-quality compression with minimal loss.</p>
            </div>
            <div>
              <h4 className="font-medium">Do you offer refunds?</h4>
              <p className="text-sm text-muted-foreground">We offer a 30-day money-back guarantee for all paid plans.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PricingPlans;