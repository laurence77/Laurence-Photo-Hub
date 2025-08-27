import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Handshake, 
  Crown, 
  Shield, 
  Palette, 
  Settings, 
  TrendingUp, 
  Users, 
  DollarSign,
  Globe,
  Zap,
  Star,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowRight,
  Package,
  Target,
  Award,
  BarChart3
} from 'lucide-react';

interface Partner {
  id: string;
  name: string;
  type: 'enterprise' | 'agency' | 'venue' | 'vendor' | 'platform';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'enterprise';
  status: 'active' | 'pending' | 'suspended' | 'trial';
  joinDate: Date;
  customization: PartnerCustomization;
  analytics: PartnerAnalytics;
  billing: BillingInfo;
  features: PartnerFeature[];
  brand: BrandSettings;
  performance: PerformanceMetrics;
}

interface PartnerCustomization {
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  customDomain: string;
  whiteLabeled: boolean;
  customEmailDomain: string;
  brandName: string;
  customCSS: string;
  mobileAppBranding: boolean;
}

interface PartnerAnalytics {
  totalEvents: number;
  totalUsers: number;
  monthlyRevenue: number;
  growthRate: number;
  customerSatisfaction: number;
  retentionRate: number;
}

interface BillingInfo {
  plan: string;
  monthlyFee: number;
  revenueShare: number;
  nextBilling: Date;
  totalPaid: number;
  commissionEarned: number;
}

interface PartnerFeature {
  id: string;
  name: string;
  category: 'branding' | 'analytics' | 'integration' | 'support' | 'advanced';
  enabled: boolean;
  tierRequired: string;
  description: string;
  cost: number;
}

interface BrandSettings {
  showPoweredBy: boolean;
  customFooter: string;
  customEmailSignature: string;
  cobranding: boolean;
  partnerLogo: string;
}

interface PerformanceMetrics {
  eventSuccessRate: number;
  averageEventSize: number;
  customerAcquisitionCost: number;
  lifetimeValue: number;
  monthlyActiveUsers: number;
  conversionRate: number;
}

interface Partnership {
  id: string;
  type: 'referral' | 'reseller' | 'integration' | 'white_label' | 'enterprise';
  terms: PartnershipTerms;
  requirements: string[];
  benefits: string[];
  status: 'draft' | 'active' | 'pending_approval' | 'expired';
}

interface PartnershipTerms {
  commissionRate: number;
  minimumCommitment: number;
  exclusivity: boolean;
  territoryRestrictions: string[];
  supportLevel: 'basic' | 'premium' | 'dedicated';
  marketingSupport: boolean;
}

export function WhiteLabelPartnerships() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'partners' | 'programs' | 'analytics'>('overview');
  const [partnershipStats, setPartnershipStats] = useState({
    totalPartners: 0,
    monthlyRevenue: 0,
    averageGrowth: 0,
    topPerformers: 0
  });

  useEffect(() => {
    initializePartnershipData();
  }, []);

  const initializePartnershipData = () => {
    const mockPartners: Partner[] = [
      {
        id: 'enterprise-corp-001',
        name: 'EventPro Corporate',
        type: 'enterprise',
        tier: 'platinum',
        status: 'active',
        joinDate: new Date('2023-08-15'),
        customization: {
          logo: '/partner-logos/eventpro.png',
          primaryColor: '#1E40AF',
          secondaryColor: '#3B82F6',
          customDomain: 'events.eventpro.com',
          whiteLabeled: true,
          customEmailDomain: 'eventpro.com',
          brandName: 'EventPro Photo Hub',
          customCSS: '/* Custom styles */',
          mobileAppBranding: true
        },
        analytics: {
          totalEvents: 1247,
          totalUsers: 15680,
          monthlyRevenue: 45000,
          growthRate: 23.5,
          customerSatisfaction: 4.8,
          retentionRate: 92.3
        },
        billing: {
          plan: 'Enterprise Platinum',
          monthlyFee: 2500,
          revenueShare: 15,
          nextBilling: new Date('2024-10-15'),
          totalPaid: 30000,
          commissionEarned: 125000
        },
        features: [
          {
            id: 'white-label',
            name: 'Complete White Label',
            category: 'branding',
            enabled: true,
            tierRequired: 'gold',
            description: 'Remove all Laurence Photo Hub branding',
            cost: 500
          },
          {
            id: 'custom-domain',
            name: 'Custom Domain',
            category: 'branding',
            enabled: true,
            tierRequired: 'silver',
            description: 'Use your own domain name',
            cost: 200
          },
          {
            id: 'advanced-analytics',
            name: 'Advanced Analytics',
            category: 'analytics',
            enabled: true,
            tierRequired: 'gold',
            description: 'Detailed performance insights',
            cost: 300
          }
        ],
        brand: {
          showPoweredBy: false,
          customFooter: '© 2024 EventPro Corporate. All rights reserved.',
          customEmailSignature: 'Powered by EventPro Photography Solutions',
          cobranding: false,
          partnerLogo: '/partner-logos/eventpro-small.png'
        },
        performance: {
          eventSuccessRate: 98.7,
          averageEventSize: 125,
          customerAcquisitionCost: 45,
          lifetimeValue: 2300,
          monthlyActiveUsers: 3400,
          conversionRate: 15.6
        }
      },
      {
        id: 'photography-studio-002',
        name: 'Creative Lens Studios',
        type: 'agency',
        tier: 'gold',
        status: 'active',
        joinDate: new Date('2024-01-20'),
        customization: {
          logo: '/partner-logos/creativelens.png',
          primaryColor: '#7C3AED',
          secondaryColor: '#A855F7',
          customDomain: 'photos.creativelens.com',
          whiteLabeled: true,
          customEmailDomain: 'creativelens.com',
          brandName: 'Creative Lens Photo Sharing',
          customCSS: '/* Purple theme styles */',
          mobileAppBranding: false
        },
        analytics: {
          totalEvents: 456,
          totalUsers: 5670,
          monthlyRevenue: 12000,
          growthRate: 31.2,
          customerSatisfaction: 4.6,
          retentionRate: 87.5
        },
        billing: {
          plan: 'Gold Agency',
          monthlyFee: 750,
          revenueShare: 20,
          nextBilling: new Date('2024-10-20'),
          totalPaid: 6750,
          commissionEarned: 25000
        },
        features: [
          {
            id: 'custom-domain',
            name: 'Custom Domain',
            category: 'branding',
            enabled: true,
            tierRequired: 'silver',
            description: 'Use your own domain name',
            cost: 200
          },
          {
            id: 'client-portal',
            name: 'Client Portal',
            category: 'advanced',
            enabled: true,
            tierRequired: 'gold',
            description: 'Dedicated client management portal',
            cost: 400
          }
        ],
        brand: {
          showPoweredBy: true,
          customFooter: 'Professional Photography by Creative Lens Studios',
          customEmailSignature: 'Creative Lens Studios - Capturing Your Moments',
          cobranding: true,
          partnerLogo: '/partner-logos/creativelens-small.png'
        },
        performance: {
          eventSuccessRate: 95.4,
          averageEventSize: 85,
          customerAcquisitionCost: 65,
          lifetimeValue: 1800,
          monthlyActiveUsers: 1200,
          conversionRate: 18.3
        }
      },
      {
        id: 'venue-partner-003',
        name: 'Grand Valley Resort',
        type: 'venue',
        tier: 'silver',
        status: 'trial',
        joinDate: new Date('2024-09-01'),
        customization: {
          logo: '/partner-logos/grandvalley.png',
          primaryColor: '#059669',
          secondaryColor: '#10B981',
          customDomain: 'events.grandvalley.com',
          whiteLabeled: false,
          customEmailDomain: 'grandvalley.com',
          brandName: 'Grand Valley Event Photos',
          customCSS: '',
          mobileAppBranding: false
        },
        analytics: {
          totalEvents: 23,
          totalUsers: 890,
          monthlyRevenue: 2400,
          growthRate: 125.8,
          customerSatisfaction: 4.9,
          retentionRate: 100
        },
        billing: {
          plan: 'Silver Venue (Trial)',
          monthlyFee: 0,
          revenueShare: 25,
          nextBilling: new Date('2024-10-01'),
          totalPaid: 0,
          commissionEarned: 1200
        },
        features: [
          {
            id: 'venue-integration',
            name: 'Venue Integration',
            category: 'integration',
            enabled: true,
            tierRequired: 'silver',
            description: 'Seamless venue management integration',
            cost: 250
          }
        ],
        brand: {
          showPoweredBy: true,
          customFooter: 'Grand Valley Resort - Where Memories are Made',
          customEmailSignature: 'Grand Valley Resort Events Team',
          cobranding: true,
          partnerLogo: '/partner-logos/grandvalley-small.png'
        },
        performance: {
          eventSuccessRate: 100,
          averageEventSize: 180,
          customerAcquisitionCost: 120,
          lifetimeValue: 3200,
          monthlyActiveUsers: 280,
          conversionRate: 22.1
        }
      }
    ];

    const mockPartnerships: Partnership[] = [
      {
        id: 'enterprise-program',
        type: 'enterprise',
        terms: {
          commissionRate: 15,
          minimumCommitment: 25000,
          exclusivity: false,
          territoryRestrictions: [],
          supportLevel: 'dedicated',
          marketingSupport: true
        },
        requirements: [
          'Minimum $25K monthly commitment',
          'Dedicated account manager',
          'White-label certification',
          'Technical integration capability'
        ],
        benefits: [
          '15% commission on all revenue',
          'Priority feature development',
          'Co-marketing opportunities',
          'Custom integrations',
          'Dedicated support team'
        ],
        status: 'active'
      },
      {
        id: 'agency-reseller',
        type: 'reseller',
        terms: {
          commissionRate: 20,
          minimumCommitment: 5000,
          exclusivity: false,
          territoryRestrictions: ['North America'],
          supportLevel: 'premium',
          marketingSupport: true
        },
        requirements: [
          'Photography or event planning experience',
          'Minimum $5K monthly commitment',
          'Marketing certification',
          'Customer service capability'
        ],
        benefits: [
          '20% commission on all sales',
          'Marketing materials provided',
          'Training and certification',
          'Lead sharing program',
          'Co-branded materials'
        ],
        status: 'active'
      }
    ];

    setPartners(mockPartners);
    setPartnerships(mockPartnerships);
    
    setPartnershipStats({
      totalPartners: mockPartners.length,
      monthlyRevenue: mockPartners.reduce((sum, p) => sum + p.analytics.monthlyRevenue, 0),
      averageGrowth: mockPartners.reduce((sum, p) => sum + p.analytics.growthRate, 0) / mockPartners.length,
      topPerformers: mockPartners.filter(p => p.performance.eventSuccessRate > 95).length
    });
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'text-orange-400 bg-orange-500/20';
      case 'silver': return 'text-gray-300 bg-gray-500/20';
      case 'gold': return 'text-yellow-400 bg-yellow-500/20';
      case 'platinum': return 'text-purple-400 bg-purple-500/20';
      case 'enterprise': return 'text-blue-400 bg-blue-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-500/20';
      case 'trial': return 'text-blue-400 bg-blue-500/20';
      case 'pending': return 'text-yellow-400 bg-yellow-500/20';
      case 'suspended': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'enterprise': return <Building2 className="w-4 h-4" />;
      case 'agency': return <Users className="w-4 h-4" />;
      case 'venue': return <Globe className="w-4 h-4" />;
      case 'vendor': return <Package className="w-4 h-4" />;
      case 'platform': return <Zap className="w-4 h-4" />;
      default: return <Handshake className="w-4 h-4" />;
    }
  };

  const selectedPartnerData = partners.find(p => p.id === selectedPartner);

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
          <Handshake className="text-blue-400" />
          <span>White-Label Partnerships</span>
        </h3>
        <div className="flex items-center space-x-3">
          <div className="flex bg-white/10 rounded-xl p-1">
            {['overview', 'partners', 'programs', 'analytics'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                  activeTab === tab
                    ? 'bg-blue-500/30 text-blue-300'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Partnership Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-black/20 rounded-xl p-4 text-center">
              <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{partnershipStats.totalPartners}</p>
              <p className="text-sm text-gray-300">Active Partners</p>
            </div>
            <div className="bg-black/20 rounded-xl p-4 text-center">
              <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">${(partnershipStats.monthlyRevenue / 1000).toFixed(0)}K</p>
              <p className="text-sm text-gray-300">Monthly Revenue</p>
            </div>
            <div className="bg-black/20 rounded-xl p-4 text-center">
              <TrendingUp className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{partnershipStats.averageGrowth.toFixed(1)}%</p>
              <p className="text-sm text-gray-300">Avg Growth</p>
            </div>
            <div className="bg-black/20 rounded-xl p-4 text-center">
              <Star className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{partnershipStats.topPerformers}</p>
              <p className="text-sm text-gray-300">Top Performers</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6">
            <h4 className="text-lg font-medium text-white mb-4 flex items-center space-x-2">
              <Clock className="text-blue-400" />
              <span>Recent Partnership Activity</span>
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <div>
                    <p className="text-sm text-white">Grand Valley Resort started trial</p>
                    <p className="text-xs text-gray-400">2 days ago</p>
                  </div>
                </div>
                <span className="text-xs text-green-300">New Partner</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  <div>
                    <p className="text-sm text-white">EventPro Corporate upgraded to Platinum</p>
                    <p className="text-xs text-gray-400">1 week ago</p>
                  </div>
                </div>
                <span className="text-xs text-purple-300">Upgrade</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Award className="w-4 h-4 text-yellow-400" />
                  <div>
                    <p className="text-sm text-white">Creative Lens Studios reached Gold tier</p>
                    <p className="text-xs text-gray-400">2 weeks ago</p>
                  </div>
                </div>
                <span className="text-xs text-yellow-300">Milestone</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Partners Tab */}
      {activeTab === 'partners' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Partners List */}
            <div className="lg:col-span-2 space-y-4">
              {partners.map((partner) => (
                <div
                  key={partner.id}
                  className={`bg-black/20 rounded-xl p-4 border cursor-pointer transition-colors ${
                    selectedPartner === partner.id
                      ? 'border-blue-500/50 bg-blue-500/10'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                  onClick={() => setSelectedPartner(partner.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                        {getTypeIcon(partner.type)}
                      </div>
                      <div>
                        <h5 className="font-medium text-white">{partner.name}</h5>
                        <p className="text-sm text-gray-400 capitalize">{partner.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getTierColor(partner.tier)}`}>
                        {partner.tier}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(partner.status)}`}>
                        {partner.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div className="text-center">
                      <p className="text-lg font-bold text-white">{partner.analytics.totalEvents}</p>
                      <p className="text-xs text-gray-400">Events</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-white">{(partner.analytics.monthlyRevenue / 1000).toFixed(0)}K</p>
                      <p className="text-xs text-gray-400">Revenue</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-white">{partner.analytics.growthRate.toFixed(1)}%</p>
                      <p className="text-xs text-gray-400">Growth</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Joined {partner.joinDate.toLocaleDateString()}</span>
                    <div className="flex items-center space-x-1">
                      <ArrowRight className="w-3 h-3" />
                      <span>View Details</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Partner Details */}
            <div className="space-y-4">
              {selectedPartnerData ? (
                <>
                  <div className="bg-black/20 rounded-xl p-4 border border-white/10">
                    <h5 className="font-medium text-white mb-4">Partner Details</h5>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Plan</span>
                        <span className="text-sm text-white">{selectedPartnerData.billing.plan}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Monthly Fee</span>
                        <span className="text-sm text-green-300">${selectedPartnerData.billing.monthlyFee}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Revenue Share</span>
                        <span className="text-sm text-blue-300">{selectedPartnerData.billing.revenueShare}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Total Paid</span>
                        <span className="text-sm text-white">${selectedPartnerData.billing.totalPaid.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/20 rounded-xl p-4 border border-white/10">
                    <h5 className="font-medium text-white mb-4">Performance</h5>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Success Rate</span>
                        <span className="text-sm text-green-300">{selectedPartnerData.performance.eventSuccessRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Avg Event Size</span>
                        <span className="text-sm text-white">{selectedPartnerData.performance.averageEventSize}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Conversion</span>
                        <span className="text-sm text-blue-300">{selectedPartnerData.performance.conversionRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Retention</span>
                        <span className="text-sm text-purple-300">{selectedPartnerData.analytics.retentionRate}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/20 rounded-xl p-4 border border-white/10">
                    <h5 className="font-medium text-white mb-4">Branding</h5>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">White Label</span>
                        <div className={`w-3 h-3 rounded-full ${selectedPartnerData.customization.whiteLabeled ? 'bg-green-400' : 'bg-gray-400'}`} />
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Custom Domain</span>
                        <span className="text-sm text-blue-300 truncate ml-2">{selectedPartnerData.customization.customDomain}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Mobile Branding</span>
                        <div className={`w-3 h-3 rounded-full ${selectedPartnerData.customization.mobileAppBranding ? 'bg-green-400' : 'bg-gray-400'}`} />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-black/20 rounded-xl p-8 border border-white/10 text-center">
                  <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">Select a partner to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Programs Tab */}
      {activeTab === 'programs' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {partnerships.map((partnership) => (
              <div key={partnership.id} className="bg-black/20 rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="font-medium text-white capitalize">{partnership.type} Program</h5>
                  <span className={`px-3 py-1 rounded-xl text-sm ${getStatusColor(partnership.status)}`}>
                    {partnership.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-green-500/10 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-400 mx-auto mb-1" />
                    <p className="text-lg font-bold text-white">{partnership.terms.commissionRate}%</p>
                    <p className="text-xs text-gray-400">Commission</p>
                  </div>
                  <div className="text-center p-3 bg-blue-500/10 rounded-lg">
                    <Target className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                    <p className="text-lg font-bold text-white">${(partnership.terms.minimumCommitment / 1000)}K</p>
                    <p className="text-xs text-gray-400">Min Commitment</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h6 className="text-sm font-medium text-white mb-2">Requirements</h6>
                    <ul className="space-y-1">
                      {partnership.requirements.slice(0, 3).map((req, index) => (
                        <li key={index} className="flex items-center space-x-2 text-xs text-gray-400">
                          <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h6 className="text-sm font-medium text-white mb-2">Benefits</h6>
                    <ul className="space-y-1">
                      {partnership.benefits.slice(0, 3).map((benefit, index) => (
                        <li key={index} className="flex items-center space-x-2 text-xs text-gray-400">
                          <Star className="w-3 h-3 text-yellow-400 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10">
                  <button className="w-full px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors">
                    View Program Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Crown className="text-yellow-400" />
              <h4 className="text-lg font-medium text-white">Create New Partnership Program</h4>
            </div>
            <p className="text-gray-300 mb-4">
              Design custom partnership programs tailored to your business needs and target markets.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 bg-black/20 rounded-xl text-center hover:bg-black/30 transition-colors">
                <Building2 className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-white">Enterprise</p>
                <p className="text-xs text-gray-400">Large corporations</p>
              </button>
              <button className="p-4 bg-black/20 rounded-xl text-center hover:bg-black/30 transition-colors">
                <Users className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-white">Reseller</p>
                <p className="text-xs text-gray-400">Photography agencies</p>
              </button>
              <button className="p-4 bg-black/20 rounded-xl text-center hover:bg-black/30 transition-colors">
                <Globe className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-white">Integration</p>
                <p className="text-xs text-gray-400">Platform partners</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-black/20 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <BarChart3 className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-400">Total Revenue</span>
              </div>
              <p className="text-2xl font-bold text-white">${(partnershipStats.monthlyRevenue / 1000).toFixed(0)}K</p>
              <p className="text-xs text-green-300">+23.5% from last month</p>
            </div>

            <div className="bg-black/20 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-400">Growth Rate</span>
              </div>
              <p className="text-2xl font-bold text-white">{partnershipStats.averageGrowth.toFixed(1)}%</p>
              <p className="text-xs text-blue-300">Average across partners</p>
            </div>

            <div className="bg-black/20 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Award className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-gray-400">Top Tier Partners</span>
              </div>
              <p className="text-2xl font-bold text-white">{partners.filter(p => p.tier === 'platinum' || p.tier === 'enterprise').length}</p>
              <p className="text-xs text-purple-300">High-value partnerships</p>
            </div>

            <div className="bg-black/20 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Star className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-gray-400">Satisfaction</span>
              </div>
              <p className="text-2xl font-bold text-white">4.7</p>
              <p className="text-xs text-green-300">Average rating</p>
            </div>
          </div>

          <div className="bg-black/20 rounded-xl p-6 border border-white/10">
            <h4 className="text-lg font-medium text-white mb-4">Partnership Performance</h4>
            <div className="space-y-4">
              {partners.map((partner) => (
                <div key={partner.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                      {getTypeIcon(partner.type)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{partner.name}</p>
                      <p className="text-xs text-gray-400">{partner.type} • {partner.tier}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="text-center">
                      <p className="font-medium text-white">{partner.analytics.totalEvents}</p>
                      <p className="text-xs text-gray-400">Events</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-green-300">${(partner.analytics.monthlyRevenue / 1000).toFixed(0)}K</p>
                      <p className="text-xs text-gray-400">Revenue</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-blue-300">{partner.analytics.growthRate.toFixed(1)}%</p>
                      <p className="text-xs text-gray-400">Growth</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-yellow-300">{partner.performance.eventSuccessRate}%</p>
                      <p className="text-xs text-gray-400">Success</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}