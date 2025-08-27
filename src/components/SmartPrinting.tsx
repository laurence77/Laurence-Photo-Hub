import React, { useState, useEffect } from 'react';
import { getImagePath } from '@/lib/utils';
import { Printer, Wifi, MapPin, Clock, Package, Star, Settings, Zap } from 'lucide-react';

interface PrintProvider {
  id: string;
  name: string;
  type: 'instant' | 'premium' | 'kiosk' | 'drone';
  location: {
    lat: number;
    lng: number;
    address: string;
    distance: number;
  };
  services: string[];
  pricing: {
    [format: string]: number;
  };
  rating: number;
  deliveryTime: number; // minutes
  status: 'online' | 'busy' | 'offline';
  capabilities: string[];
  specialties: string[];
}

interface PrintJob {
  id: string;
  photos: string[];
  format: string;
  quantity: number;
  provider: string;
  status: 'pending' | 'printing' | 'ready' | 'delivered' | 'cancelled';
  estimatedTime: number;
  totalCost: number;
  specialRequests?: string;
  deliveryAddress?: string;
  trackingCode?: string;
}

export function SmartPrinting() {
  const [nearbyProviders, setNearbyProviders] = useState<PrintProvider[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [currentJob, setCurrentJob] = useState<PrintJob | null>(null);
  const [printJobs, setPrintJobs] = useState<PrintJob[]>([]);
  const [selectedFormat, setSelectedFormat] = useState('4x6');
  const [quantity, setQuantity] = useState(1);
  const [deliveryOption, setDeliveryOption] = useState<'pickup' | 'delivery' | 'drone'>('pickup');
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    findNearbyProviders();
  }, []);

  const findNearbyProviders = async () => {
    setIsLocating(true);
    
    try {
      // Get user location
      const position = await getCurrentPosition();
      
      // Find nearby print providers
      const providers = await discoverPrintProviders(position.coords);
      setNearbyProviders(providers);
    } catch (error) {
      console.error('Failed to find providers:', error);
      // Use mock data if location fails
      setNearbyProviders(getMockProviders());
    } finally {
      setIsLocating(false);
    }
  };

  const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      });
    });
  };

  const discoverPrintProviders = async (coords: GeolocationCoordinates): Promise<PrintProvider[]> => {
    // In production, this would call real APIs like:
    // - CVS Photo API
    // - Walgreens Photo API  
    // - Local print shop APIs
    // - Drone delivery services
    
    return getMockProviders().map(provider => ({
      ...provider,
      location: {
        ...provider.location,
        distance: Math.random() * 5 + 0.5 // 0.5-5.5 miles
      }
    })).sort((a, b) => a.location.distance - b.location.distance);
  };

  const getMockProviders = (): PrintProvider[] => {
    return [
      {
        id: 'cvs-main',
        name: 'CVS Pharmacy',
        type: 'instant',
        location: {
          lat: 37.7749,
          lng: -122.4194,
          address: '123 Main St, San Francisco, CA',
          distance: 0.8
        },
        services: ['instant_print', 'photo_books', 'canvas', 'mugs'],
        pricing: {
          '4x6': 0.39,
          '5x7': 2.99,
          '8x10': 5.99,
          'canvas_8x10': 24.99
        },
        rating: 4.2,
        deliveryTime: 15,
        status: 'online',
        capabilities: ['same_day', 'pickup', 'mobile_app'],
        specialties: ['instant_prints', 'photo_gifts']
      },
      {
        id: 'walgreens-photo',
        name: 'Walgreens Photo',
        type: 'instant',
        location: {
          lat: 37.7849,
          lng: -122.4094,
          address: '456 Market St, San Francisco, CA',
          distance: 1.2
        },
        services: ['prints', 'photo_books', 'calendars', 'cards'],
        pricing: {
          '4x6': 0.33,
          '5x7': 2.49,
          '8x10': 4.99,
          'photo_book': 19.99
        },
        rating: 4.0,
        deliveryTime: 20,
        status: 'online',
        capabilities: ['1_hour_pickup', 'mobile_order', 'loyalty_rewards'],
        specialties: ['bulk_orders', 'professional_quality']
      },
      {
        id: 'premium-studio',
        name: 'Fine Art Photography Studio',
        type: 'premium',
        location: {
          lat: 37.7649,
          lng: -122.4394,
          address: '789 Art District, San Francisco, CA',
          distance: 2.1
        },
        services: ['fine_art_prints', 'canvas', 'metal_prints', 'framing'],
        pricing: {
          '8x10': 15.99,
          'canvas_16x20': 89.99,
          'metal_12x18': 125.99,
          'framing': 45.00
        },
        rating: 4.8,
        deliveryTime: 180, // 3 hours
        status: 'online',
        capabilities: ['archival_quality', 'color_calibrated', 'custom_sizing'],
        specialties: ['fine_art', 'gallery_quality', 'archival_materials']
      },
      {
        id: 'drone-prints',
        name: 'AirPrint Drone Delivery',
        type: 'drone',
        location: {
          lat: 37.7549,
          lng: -122.4494,
          address: 'Drone Hub, San Francisco, CA',
          distance: 3.5
        },
        services: ['instant_delivery', 'prints', 'polaroids'],
        pricing: {
          '4x6': 2.99, // Premium for drone delivery
          'polaroid': 4.99,
          'delivery_fee': 8.99
        },
        rating: 4.5,
        deliveryTime: 30,
        status: 'online',
        capabilities: ['drone_delivery', 'real_time_tracking', 'weather_dependent'],
        specialties: ['ultra_fast_delivery', 'event_services']
      },
      {
        id: 'kiosk-mall',
        name: 'Photo Kiosk - Shopping Mall',
        type: 'kiosk',
        location: {
          lat: 37.7449,
          lng: -122.4594,
          address: 'Westfield Mall, San Francisco, CA',
          distance: 4.2
        },
        services: ['self_service_printing', 'id_photos', 'passport_photos'],
        pricing: {
          '4x6': 0.25,
          'wallet_size': 1.99,
          'passport_photo': 12.99
        },
        rating: 3.8,
        deliveryTime: 5, // Immediate
        status: 'online',
        capabilities: ['24_7_access', 'credit_card', 'cash'],
        specialties: ['budget_friendly', 'self_service', 'id_photos']
      }
    ];
  };

  const createPrintJob = async (providerId: string) => {
    const provider = nearbyProviders.find(p => p.id === providerId);
    if (!provider || selectedPhotos.length === 0) return;

    const totalCost = calculateTotalCost(provider, selectedFormat, quantity);
    
    const newJob: PrintJob = {
      id: `job-${Date.now()}`,
      photos: [...selectedPhotos],
      format: selectedFormat,
      quantity,
      provider: providerId,
      status: 'pending',
      estimatedTime: provider.deliveryTime,
      totalCost,
      trackingCode: generateTrackingCode()
    };

    if (deliveryOption === 'delivery') {
      newJob.deliveryAddress = 'Current Location'; // Would use actual address
      newJob.totalCost += 5.99; // Delivery fee
    } else if (deliveryOption === 'drone') {
      newJob.deliveryAddress = 'GPS Coordinates';
      newJob.totalCost += provider.pricing.delivery_fee || 8.99;
    }

    setPrintJobs(prev => [newJob, ...prev]);
    setCurrentJob(newJob);
    
    // Simulate job processing
    simulateJobProgress(newJob.id);
    
    // Clear selection
    setSelectedPhotos([]);
  };

  const calculateTotalCost = (provider: PrintProvider, format: string, qty: number): number => {
    const unitPrice = provider.pricing[format] || 0;
    return unitPrice * qty;
  };

  const generateTrackingCode = (): string => {
    return Math.random().toString(36).substr(2, 9).toUpperCase();
  };

  const simulateJobProgress = (jobId: string) => {
    const stages = ['printing', 'ready', 'delivered'];
    let currentStage = 0;

    const updateJob = () => {
      if (currentStage < stages.length) {
        setPrintJobs(prev =>
          prev.map(job =>
            job.id === jobId
              ? { ...job, status: stages[currentStage] as any }
              : job
          )
        );

        if (jobId === currentJob?.id) {
          setCurrentJob(prev => prev ? { ...prev, status: stages[currentStage] as any } : null);
        }

        currentStage++;
        
        if (currentStage < stages.length) {
          setTimeout(updateJob, 30000); // 30 seconds between stages
        }
      }
    };

    setTimeout(updateJob, 5000); // Start after 5 seconds
  };

  const getProviderIcon = (type: string) => {
    switch (type) {
      case 'instant': return '⚡';
      case 'premium': return '🎨';
      case 'kiosk': return '🏪';
      case 'drone': return '🚁';
      default: return '🖨️';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-400 bg-green-500/20';
      case 'busy': return 'text-yellow-400 bg-yellow-500/20';
      case 'offline': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getJobStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-500/20';
      case 'printing': return 'text-blue-400 bg-blue-500/20';
      case 'ready': return 'text-green-400 bg-green-500/20';
      case 'delivered': return 'text-purple-400 bg-purple-500/20';
      case 'cancelled': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  // Mock photo selection
  const mockPhotos = [
    { id: '1', url: getImagePath('/uploads/wedding1.jpg'), title: 'Wedding Ceremony' },
    { id: '2', url: getImagePath('/uploads/wedding2.jpg'), title: 'First Dance' },
    { id: '3', url: getImagePath('/uploads/wedding3.jpg'), title: 'Family Portrait' },
    { id: '4', url: getImagePath('/uploads/wedding4.jpg'), title: 'Reception' }
  ];

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Smart Printing</h3>
        <div className="flex items-center space-x-3">
          <button
            onClick={findNearbyProviders}
            disabled={isLocating}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 text-blue-300 rounded-xl border border-blue-500/30 hover:bg-blue-500/30 transition-colors disabled:opacity-50"
          >
            <MapPin size={18} />
            <span>{isLocating ? 'Locating...' : 'Find Providers'}</span>
          </button>
        </div>
      </div>

      {/* Photo Selection */}
      <div className="space-y-4 mb-8">
        <h4 className="text-lg font-medium text-white">Select Photos to Print</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {mockPhotos.map((photo) => (
            <div
              key={photo.id}
              className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition-colors ${
                selectedPhotos.includes(photo.id)
                  ? 'border-blue-500'
                  : 'border-white/20 hover:border-white/40'
              }`}
              onClick={() => {
                setSelectedPhotos(prev =>
                  prev.includes(photo.id)
                    ? prev.filter(id => id !== photo.id)
                    : [...prev, photo.id]
                );
              }}
            >
              <div className="aspect-square bg-gray-800 flex items-center justify-center">
                <span className="text-4xl">📸</span>
              </div>
              {selectedPhotos.includes(photo.id) && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2">
                <p className="text-xs text-white truncate">{photo.title}</p>
              </div>
            </div>
          ))}
        </div>

        {selectedPhotos.length > 0 && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
            <p className="text-blue-300">
              {selectedPhotos.length} photo{selectedPhotos.length !== 1 ? 's' : ''} selected
            </p>
          </div>
        )}
      </div>

      {/* Print Options */}
      {selectedPhotos.length > 0 && (
        <div className="space-y-4 mb-8">
          <h4 className="text-lg font-medium text-white">Print Options</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Format</label>
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="w-full bg-white/10 rounded-xl px-3 py-2 text-white border border-white/20"
              >
                <option value="4x6">4x6 Standard</option>
                <option value="5x7">5x7 Medium</option>
                <option value="8x10">8x10 Large</option>
                <option value="canvas_8x10">8x10 Canvas</option>
                <option value="canvas_16x20">16x20 Canvas</option>
                <option value="metal_12x18">12x18 Metal Print</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">Quantity</label>
              <input
                type="number"
                min="1"
                max="100"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-full bg-white/10 rounded-xl px-3 py-2 text-white border border-white/20"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">Delivery</label>
              <select
                value={deliveryOption}
                onChange={(e) => setDeliveryOption(e.target.value as any)}
                className="w-full bg-white/10 rounded-xl px-3 py-2 text-white border border-white/20"
              >
                <option value="pickup">Store Pickup</option>
                <option value="delivery">Home Delivery</option>
                <option value="drone">Drone Delivery</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Print Providers */}
      <div className="space-y-4 mb-8">
        <h4 className="text-lg font-medium text-white">
          Nearby Print Providers ({nearbyProviders.length})
        </h4>
        
        {nearbyProviders.length === 0 && !isLocating ? (
          <div className="text-center py-8">
            <Printer className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-400">No print providers found</p>
            <button
              onClick={findNearbyProviders}
              className="mt-4 px-4 py-2 bg-blue-500/20 text-blue-300 rounded-xl hover:bg-blue-500/30 transition-colors"
            >
              Search Again
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {nearbyProviders.map((provider) => (
              <div
                key={provider.id}
                className="bg-black/20 rounded-xl p-4 border border-white/10"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{getProviderIcon(provider.type)}</div>
                    <div>
                      <h5 className="font-medium text-white">{provider.name}</h5>
                      <p className="text-sm text-gray-400">{provider.location.address}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-blue-300">
                          {provider.location.distance.toFixed(1)} miles
                        </span>
                        <div className="flex items-center space-x-1">
                          <Star size={14} className="text-yellow-400" />
                          <span className="text-sm text-white">{provider.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock size={14} className="text-green-400" />
                          <span className="text-sm text-white">{provider.deliveryTime} min</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(provider.status)}`}>
                      {provider.status}
                    </div>
                    {selectedPhotos.length > 0 && (
                      <p className="text-lg font-semibold text-white mt-2">
                        ${calculateTotalCost(provider, selectedFormat, quantity * selectedPhotos.length).toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {provider.specialties.slice(0, 3).map((specialty) => (
                    <span
                      key={specialty}
                      className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300"
                    >
                      {specialty.replace('_', ' ')}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    Popular: {provider.pricing['4x6'] ? `$${provider.pricing['4x6']} per 4x6` : 'Custom pricing'}
                  </div>
                  <button
                    onClick={() => createPrintJob(provider.id)}
                    disabled={selectedPhotos.length === 0 || provider.status === 'offline'}
                    className="px-4 py-2 bg-green-500/20 text-green-300 rounded-xl hover:bg-green-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deliveryOption === 'drone' ? 'Order Drone Delivery' : 'Print Here'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Current Job Status */}
      {currentJob && (
        <div className="space-y-4 mb-8">
          <h4 className="text-lg font-medium text-white">Current Print Job</h4>
          <div className="bg-black/20 rounded-xl p-4 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h5 className="font-medium text-white">Job #{currentJob.trackingCode}</h5>
                <p className="text-sm text-gray-400">
                  {currentJob.photos.length} photos • {currentJob.format} • Qty: {currentJob.quantity}
                </p>
              </div>
              <div className={`px-3 py-1 rounded-lg font-medium ${getJobStatusColor(currentJob.status)}`}>
                {currentJob.status}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <p className="text-sm text-gray-400">Provider</p>
                <p className="font-medium text-white">
                  {nearbyProviders.find(p => p.id === currentJob.provider)?.name}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400">Total Cost</p>
                <p className="font-medium text-white">${currentJob.totalCost.toFixed(2)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400">Estimated Time</p>
                <p className="font-medium text-white">{currentJob.estimatedTime} min</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400">Delivery</p>
                <p className="font-medium text-white capitalize">{deliveryOption}</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentJob.status === 'pending' ? 'w-1/4 bg-yellow-400' :
                  currentJob.status === 'printing' ? 'w-2/4 bg-blue-400' :
                  currentJob.status === 'ready' ? 'w-3/4 bg-green-400' :
                  currentJob.status === 'delivered' ? 'w-full bg-purple-400' :
                  'w-0 bg-gray-400'
                }`}
              />
            </div>

            <div className="flex justify-between text-sm text-gray-400">
              <span className={currentJob.status === 'pending' ? 'text-yellow-400' : ''}>Pending</span>
              <span className={currentJob.status === 'printing' ? 'text-blue-400' : ''}>Printing</span>
              <span className={currentJob.status === 'ready' ? 'text-green-400' : ''}>Ready</span>
              <span className={currentJob.status === 'delivered' ? 'text-purple-400' : ''}>Delivered</span>
            </div>
          </div>
        </div>
      )}

      {/* Job History */}
      {printJobs.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-white">Print History</h4>
          <div className="space-y-2">
            {printJobs.slice(0, 5).map((job) => (
              <div
                key={job.id}
                className="bg-black/20 rounded-xl p-3 border border-white/10 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-white">#{job.trackingCode}</p>
                  <p className="text-sm text-gray-400">
                    {job.photos.length} photos • ${job.totalCost.toFixed(2)}
                  </p>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-medium ${getJobStatusColor(job.status)}`}>
                  {job.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}