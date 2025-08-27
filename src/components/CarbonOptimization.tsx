import { useState, useEffect } from 'react';
import { Leaf, Zap, Cloud, Server, Globe, BarChart3, Settings, Award, Clock, Sparkles, TrendingDown, Activity, Brain, Lightbulb } from 'lucide-react';

interface CarbonMetrics {
  totalEmissions: number; // kg CO2
  storageEmissions: number;
  transferEmissions: number;
  computeEmissions: number;
  offsetCredits: number;
  efficiency: number; // 0-100 score
  gridCarbonIntensity: number; // Real-time grid data
  renewablePercentage: number;
  carbonReduction: number; // vs baseline
  predictedEmissions: number; // Next 30 days
}

interface GreenProvider {
  id: string;
  name: string;
  type: 'storage' | 'cdn' | 'compute';
  location: string;
  renewableEnergy: number; // percentage
  carbonIntensity: number; // gCO2/kWh
  pricing: number;
  certifications: string[];
  availability: number;
}

interface OptimizationRule {
  id: string;
  name: string;
  type: 'storage_tier' | 'geographic_routing' | 'compression' | 'cdn_selection' | 'compute_scheduling' | 'ai_optimization';
  enabled: boolean;
  priority: 'low' | 'medium' | 'high';
  description: string;
  carbonSaving: number; // percentage
  costImpact: number; // percentage change
  automationLevel: 'manual' | 'assisted' | 'fully_automated';
  triggers: string[];
  conditions: { [key: string]: any };
}

export function CarbonOptimization() {
  const [metrics, setMetrics] = useState<CarbonMetrics>({
    totalEmissions: 0,
    storageEmissions: 0,
    transferEmissions: 0,
    computeEmissions: 0,
    offsetCredits: 0,
    efficiency: 0,
    gridCarbonIntensity: 0,
    renewablePercentage: 0,
    carbonReduction: 0,
    predictedEmissions: 0
  });

  const [greenProviders, setGreenProviders] = useState<GreenProvider[]>([]);
  const [optimizationRules, setOptimizationRules] = useState<OptimizationRule[]>([]);
  const [carbonBudget, setCarbonBudget] = useState(100); // kg CO2 per month
  const [autoOptimize, setAutoOptimize] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'day' | 'week' | 'month'>('month');
  const [carbonAwareness, setCarbonAwareness] = useState<'low' | 'medium' | 'high'>('medium');
  const [realTimeOptimization, setRealTimeOptimization] = useState(true);
  const [predictiveMode, setPredictiveMode] = useState(false);
  const [aiAssistance, setAiAssistance] = useState(true);

  useEffect(() => {
    initializeProviders();
    initializeOptimizationRules();
    loadCarbonMetrics();
    
    const interval = setInterval(() => {
      updateRealTimeMetrics();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [selectedTimeframe]);

  const initializeProviders = () => {
    const providers: GreenProvider[] = [
      {
        id: 'aws-green',
        name: 'AWS (Oregon)',
        type: 'storage',
        location: 'Oregon, USA',
        renewableEnergy: 95,
        carbonIntensity: 55, // gCO2/kWh
        pricing: 0.023,
        certifications: ['Carbon Neutral', 'Renewable Energy Certificate'],
        availability: 99.99
      },
      {
        id: 'gcp-green',
        name: 'Google Cloud (Quebec)',
        type: 'storage',
        location: 'Quebec, Canada',
        renewableEnergy: 100,
        carbonIntensity: 12,
        pricing: 0.020,
        certifications: ['Carbon Neutral', 'ISO 14001', '100% Renewable'],
        availability: 99.95
      },
      {
        id: 'azure-green',
        name: 'Azure (Sweden)',
        type: 'storage',
        location: 'Sweden',
        renewableEnergy: 100,
        carbonIntensity: 8,
        pricing: 0.025,
        certifications: ['Carbon Negative', 'Nordic Green Energy'],
        availability: 99.98
      },
      {
        id: 'cloudflare-green',
        name: 'Cloudflare R2',
        type: 'cdn',
        location: 'Global Network',
        renewableEnergy: 100,
        carbonIntensity: 15,
        pricing: 0.015,
        certifications: ['RE100', 'Carbon Neutral Network'],
        availability: 99.999
      },
      {
        id: 'fastly-green',
        name: 'Fastly (Iceland)',
        type: 'cdn',
        location: 'Iceland',
        renewableEnergy: 100,
        carbonIntensity: 5,
        pricing: 0.018,
        certifications: ['100% Renewable', 'Green Web Foundation'],
        availability: 99.97
      }
    ];

    setGreenProviders(providers);
  };

  const initializeOptimizationRules = () => {
    const rules: OptimizationRule[] = [
      {
        id: 'intelligent-tiering',
        name: 'Intelligent Storage Tiering',
        type: 'storage_tier',
        enabled: true,
        priority: 'high',
        description: 'Automatically move rarely accessed photos to cold storage',
        carbonSaving: 40,
        costImpact: -60,
        automationLevel: 'fully_automated',
        triggers: ['access_pattern', 'storage_cost'],
        conditions: { accessThreshold: 30, costSavingMin: 50 }
      },
      {
        id: 'geographic-optimization',
        name: 'Geographic Routing',
        type: 'geographic_routing',
        enabled: true,
        priority: 'high',
        description: 'Route requests to nearest green data centers',
        carbonSaving: 25,
        costImpact: -10,
        automationLevel: 'fully_automated',
        triggers: ['location_data', 'green_availability'],
        conditions: { maxLatency: 100, greenPreference: true }
      },
      {
        id: 'smart-compression',
        name: 'AI-Powered Compression',
        type: 'compression',
        enabled: true,
        priority: 'medium',
        description: 'Compress images based on viewing context and device',
        carbonSaving: 30,
        costImpact: -20,
        automationLevel: 'assisted',
        triggers: ['device_type', 'bandwidth'],
        conditions: { qualityThreshold: 85, compressionRatio: 0.7 }
      },
      {
        id: 'green-cdn-selection',
        name: 'Green CDN Selection',
        type: 'cdn_selection',
        enabled: true,
        priority: 'medium',
        description: 'Prefer CDN providers with 100% renewable energy',
        carbonSaving: 20,
        costImpact: 5,
        automationLevel: 'fully_automated',
        triggers: ['cdn_availability', 'renewable_status'],
        conditions: { renewableMin: 90, performanceDelta: 10 }
      },
      {
        id: 'off-peak-processing',
        name: 'Off-Peak Processing',
        type: 'compute_scheduling',
        enabled: false,
        priority: 'low',
        description: 'Schedule heavy processing during low carbon grid periods',
        carbonSaving: 15,
        costImpact: -5,
        automationLevel: 'assisted',
        triggers: ['high_grid_intensity', 'off_peak_hours'],
        conditions: { gridIntensityThreshold: 500, peakHoursAvoid: true }
      },
      {
        id: 'ai-carbon-prediction',
        name: 'AI Carbon Prediction',
        type: 'ai_optimization',
        enabled: true,
        priority: 'high',
        description: 'Use AI to predict and optimize carbon usage patterns',
        carbonSaving: 35,
        costImpact: 2,
        automationLevel: 'fully_automated',
        triggers: ['usage_pattern_change', 'grid_forecast'],
        conditions: { confidenceThreshold: 85, forecastHours: 24 }
      },
      {
        id: 'renewable-grid-sync',
        name: 'Renewable Grid Synchronization',
        type: 'compute_scheduling',
        enabled: true,
        priority: 'high',
        description: 'Sync workloads with renewable energy availability',
        carbonSaving: 45,
        costImpact: -8,
        automationLevel: 'fully_automated',
        triggers: ['renewable_forecast', 'workload_queue'],
        conditions: { renewableThreshold: 70, delayTolerance: 4 }
      }
    ];

    setOptimizationRules(rules);
  };

  const loadCarbonMetrics = async () => {
    // Simulate loading carbon metrics with enhanced data
    const mockMetrics: CarbonMetrics = {
      totalEmissions: 45.2,
      storageEmissions: 18.5,
      transferEmissions: 20.1,
      computeEmissions: 6.6,
      offsetCredits: 12.5,
      efficiency: 78,
      gridCarbonIntensity: 420, // gCO2/kWh current grid intensity
      renewablePercentage: 85,
      carbonReduction: 32, // 32% reduction vs baseline
      predictedEmissions: 48.7 // Predicted for next 30 days
    };

    setMetrics(mockMetrics);
  };

  const updateRealTimeMetrics = () => {
    setMetrics(prev => ({
      ...prev,
      totalEmissions: prev.totalEmissions + (Math.random() - 0.5) * 0.1,
      efficiency: Math.max(0, Math.min(100, prev.efficiency + (Math.random() - 0.5) * 2))
    }));
  };

  const calculateCarbonIntensity = () => {
    const totalStorage = 1000; // GB
    return (metrics.totalEmissions / totalStorage).toFixed(3);
  };

  const getBudgetStatus = () => {
    const used = (metrics.totalEmissions / carbonBudget) * 100;
    return {
      percentage: Math.min(100, used),
      status: used < 70 ? 'good' : used < 90 ? 'warning' : 'critical'
    };
  };

  const toggleOptimizationRule = (ruleId: string) => {
    setOptimizationRules(prev =>
      prev.map(rule =>
        rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
      )
    );
  };

  const getProviderScore = (provider: GreenProvider) => {
    // Calculate composite green score
    const renewableScore = provider.renewableEnergy;
    const carbonScore = Math.max(0, 100 - (provider.carbonIntensity / 10));
    const costScore = Math.max(0, 100 - (provider.pricing * 1000));
    
    return ((renewableScore * 0.4) + (carbonScore * 0.4) + (costScore * 0.2));
  };

  const getRuleIcon = (type: string) => {
    switch (type) {
      case 'storage_tier': return <Server size={16} className="text-blue-400" />;
      case 'geographic_routing': return <Globe size={16} className="text-green-400" />;
      case 'compression': return <Zap size={16} className="text-yellow-400" />;
      case 'cdn_selection': return <Cloud size={16} className="text-purple-400" />;
      case 'compute_scheduling': return <Clock size={16} className="text-orange-400" />;
      case 'ai_optimization': return <Sparkles size={16} className="text-pink-400" />;
      default: return <Settings size={16} className="text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const budgetStatus = getBudgetStatus();

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
          <Leaf className="text-green-400" />
          <span>Carbon Optimization</span>
        </h3>
        <div className="flex items-center space-x-3">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value as any)}
            className="bg-white/10 rounded-xl px-3 py-2 text-white border border-white/20"
            aria-label="Select timeframe for carbon metrics"
          >
            <option value="day">Daily</option>
            <option value="week">Weekly</option>
            <option value="month">Monthly</option>
          </select>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={autoOptimize}
              onChange={(e) => setAutoOptimize(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
            <span className="ml-2 text-sm text-gray-300">Auto-optimize</span>
          </label>
          <select
            value={carbonAwareness}
            onChange={(e) => setCarbonAwareness(e.target.value as any)}
            className="bg-white/10 rounded-xl px-3 py-2 text-white border border-white/20"
            aria-label="Select carbon awareness level"
          >
            <option value="low">Low Awareness</option>
            <option value="medium">Medium Awareness</option>
            <option value="high">High Awareness</option>
          </select>
        </div>
      </div>

      {/* Carbon Metrics Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-black/20 rounded-xl p-4 text-center">
          <Leaf className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{metrics.totalEmissions.toFixed(1)}</p>
          <p className="text-sm text-gray-300">kg CO₂ {selectedTimeframe}</p>
        </div>

        <div className="bg-black/20 rounded-xl p-4 text-center">
          <BarChart3 className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{metrics.efficiency}</p>
          <p className="text-sm text-gray-300">Efficiency Score</p>
        </div>

        <div className="bg-black/20 rounded-xl p-4 text-center">
          <Award className="w-8 h-8 text-purple-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{metrics.offsetCredits.toFixed(1)}</p>
          <p className="text-sm text-gray-300">Carbon Credits</p>
        </div>

        <div className="bg-black/20 rounded-xl p-4 text-center">
          <TrendingDown className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{metrics.carbonReduction}</p>
          <p className="text-sm text-gray-300">% Reduction</p>
        </div>
      </div>

      {/* Carbon Budget */}
      <div className="bg-black/20 rounded-xl p-4 mb-8">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-lg font-medium text-white">Carbon Budget</h4>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={carbonBudget}
              onChange={(e) => setCarbonBudget(parseInt(e.target.value) || 100)}
              className="w-20 bg-white/10 rounded px-2 py-1 text-white text-sm"
              aria-label="Carbon budget in kg CO2 per month"
            />
            <span className="text-sm text-gray-300">kg CO₂/month</span>
          </div>
        </div>

        <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
          <div 
            className={`h-4 rounded-full transition-all duration-500 ${
              budgetStatus.status === 'good' ? 'bg-green-500' :
              budgetStatus.status === 'warning' ? 'bg-yellow-500' :
              'bg-red-500'
            }`}
            data-width={budgetStatus.percentage}
            style={{
              width: `${Math.min(100, Math.max(0, budgetStatus.percentage))}%`,
            }}
          />
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-300">
            Used: {metrics.totalEmissions.toFixed(1)} kg CO₂
          </span>
          <span className="text-gray-300">
            Remaining: {(carbonBudget - metrics.totalEmissions).toFixed(1)} kg CO₂
          </span>
        </div>
      </div>

      {/* Real-time Carbon Intelligence */}
      <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Brain className="text-green-400" />
            <h4 className="text-lg font-medium text-white">AI Carbon Intelligence</h4>
          </div>
          <div className="flex items-center space-x-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={aiAssistance}
                onChange={(e) => setAiAssistance(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
              <span className="ml-2 text-sm text-gray-300">AI Enabled</span>
            </label>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-black/20 rounded-xl p-4 text-center">
            <Activity className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <p className="text-lg font-bold text-white">{metrics.gridCarbonIntensity}</p>
            <p className="text-xs text-gray-300">gCO₂/kWh Grid</p>
          </div>
          <div className="bg-black/20 rounded-xl p-4 text-center">
            <Leaf className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <p className="text-lg font-bold text-white">{metrics.renewablePercentage}%</p>
            <p className="text-xs text-gray-300">Renewable</p>
          </div>
          <div className="bg-black/20 rounded-xl p-4 text-center">
            <TrendingDown className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <p className="text-lg font-bold text-white">{metrics.predictedEmissions.toFixed(1)}</p>
            <p className="text-xs text-gray-300">Predicted kg CO₂</p>
          </div>
          <div className="bg-black/20 rounded-xl p-4 text-center">
            <Lightbulb className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <p className="text-lg font-bold text-white">{optimizationRules.filter(r => r.enabled).length}</p>
            <p className="text-xs text-gray-300">Active Rules</p>
          </div>
        </div>
        
        {aiAssistance && (
          <div className="mt-4 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
            <div className="flex items-start space-x-2">
              <Sparkles className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-green-300 font-medium">AI Recommendation</p>
                <p className="text-xs text-gray-300 mt-1">
                  Grid carbon intensity is currently high. Consider delaying non-urgent processing for 2-3 hours to reduce emissions by ~15%.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Emissions Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Server size={18} className="text-blue-400" />
            <span className="text-blue-300 font-medium">Storage</span>
          </div>
          <p className="text-2xl font-bold text-white">{metrics.storageEmissions.toFixed(1)}</p>
          <p className="text-sm text-gray-400">kg CO₂ ({((metrics.storageEmissions / metrics.totalEmissions) * 100).toFixed(0)}%)</p>
        </div>

        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Globe size={18} className="text-green-400" />
            <span className="text-green-300 font-medium">Transfer</span>
          </div>
          <p className="text-2xl font-bold text-white">{metrics.transferEmissions.toFixed(1)}</p>
          <p className="text-sm text-gray-400">kg CO₂ ({((metrics.transferEmissions / metrics.totalEmissions) * 100).toFixed(0)}%)</p>
        </div>

        <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Zap size={18} className="text-orange-400" />
            <span className="text-orange-300 font-medium">Compute</span>
          </div>
          <p className="text-2xl font-bold text-white">{metrics.computeEmissions.toFixed(1)}</p>
          <p className="text-sm text-gray-400">kg CO₂ ({((metrics.computeEmissions / metrics.totalEmissions) * 100).toFixed(0)}%)</p>
        </div>
      </div>

      {/* Green Providers */}
      <div className="space-y-4 mb-8">
        <h4 className="text-lg font-medium text-white">Green Infrastructure Providers</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {greenProviders.slice(0, 4).map((provider) => (
            <div key={provider.id} className="bg-black/20 rounded-xl p-4 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h5 className="font-medium text-white">{provider.name}</h5>
                  <p className="text-sm text-gray-400">{provider.location}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-400">
                    {getProviderScore(provider).toFixed(0)}
                  </div>
                  <div className="text-xs text-gray-400">Green Score</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="text-center">
                  <p className="text-sm text-green-300">Renewable Energy</p>
                  <p className="font-semibold text-white">{provider.renewableEnergy}%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-yellow-300">Carbon Intensity</p>
                  <p className="font-semibold text-white">{provider.carbonIntensity} gCO₂/kWh</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {provider.certifications.slice(0, 2).map((cert) => (
                  <span key={cert} className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs">
                    {cert}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">${provider.pricing}/GB</span>
                <span className="text-green-400">{provider.availability}% uptime</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Optimization Rules */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-white">Optimization Rules</h4>
        <div className="space-y-3">
          {optimizationRules.map((rule) => (
            <div key={rule.id} className="bg-black/20 rounded-xl p-4 border border-white/10">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {getRuleIcon(rule.type)}
                  <div>
                    <h5 className="font-medium text-white">{rule.name}</h5>
                    <p className="text-sm text-gray-400">{rule.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(rule.priority)}`}>
                    {rule.priority}
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rule.enabled}
                      onChange={() => toggleOptimizationRule(rule.id)}
                      className="sr-only peer"
                      aria-label={`Toggle ${rule.name} optimization rule`}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="flex items-center space-x-2">
                  <Leaf size={16} className="text-green-400" />
                  <span className="text-sm text-gray-300">Carbon saving:</span>
                  <span className="text-sm font-medium text-green-300">{rule.carbonSaving}%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded bg-blue-400" />
                  <span className="text-sm text-gray-300">Cost impact:</span>
                  <span className={`text-sm font-medium ${rule.costImpact < 0 ? 'text-green-300' : 'text-red-300'}`}>
                    {rule.costImpact > 0 ? '+' : ''}{rule.costImpact}%
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-2">
                  <span>Automation:</span>
                  <span className={`px-2 py-1 rounded ${
                    rule.automationLevel === 'fully_automated' ? 'bg-green-500/20 text-green-300' :
                    rule.automationLevel === 'assisted' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-gray-500/20 text-gray-300'
                  }`}>
                    {rule.automationLevel.replace('_', ' ')}
                  </span>
                </div>
                {rule.triggers && rule.triggers.length > 0 && (
                  <div className="flex items-center space-x-1">
                    <Clock size={12} />
                    <span>{rule.triggers.length} trigger{rule.triggers.length !== 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Carbon Offset Purchase */}
      <div className="mt-8 bg-green-500/10 border border-green-500/20 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Award className="text-green-400" />
            <h4 className="text-lg font-medium text-white">Carbon Offset Credits</h4>
          </div>
          <button type="button" className="px-4 py-2 bg-green-500/20 text-green-300 rounded-xl hover:bg-green-500/30 transition-colors">
            Purchase Offsets
          </button>
        </div>
        <p className="text-sm text-gray-400 mb-2">
          Offset your remaining carbon footprint with verified carbon removal projects.
        </p>
        <div className="flex items-center justify-between text-sm">
          <span className="text-green-300">
            Remaining emissions: {(metrics.totalEmissions - metrics.offsetCredits).toFixed(1)} kg CO₂
          </span>
          <span className="text-green-300">
            Estimated cost: ${((metrics.totalEmissions - metrics.offsetCredits) * 0.02).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}