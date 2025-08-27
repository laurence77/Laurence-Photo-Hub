import React, { useState, useEffect } from 'react';
import { Watch, Heart, Zap, Camera, Smile, Activity, Bluetooth, Settings } from 'lucide-react';

interface WearableDevice {
  id: string;
  name: string;
  type: 'apple_watch' | 'fitbit' | 'samsung_watch' | 'heart_rate_monitor' | 'smart_ring';
  status: 'connected' | 'disconnected' | 'syncing';
  battery?: number;
  capabilities: string[];
  lastSync?: Date;
}

interface BiometricTrigger {
  id: string;
  name: string;
  type: 'heart_rate' | 'stress' | 'activity' | 'gesture' | 'location';
  threshold: number;
  condition: 'above' | 'below' | 'spike' | 'sustained';
  duration: number; // in seconds
  enabled: boolean;
  action: 'capture_photo' | 'start_recording' | 'tag_moment' | 'notify_photographer';
  sensitivity: 'low' | 'medium' | 'high';
}

interface KeyMoment {
  id: string;
  timestamp: Date;
  trigger: string;
  biometricData: {
    heartRate?: number;
    stressLevel?: number;
    activity?: string;
  };
  photos: string[];
  confidence: number;
  context: string;
}

export function WearableTriggers() {
  const [connectedDevices, setConnectedDevices] = useState<WearableDevice[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [triggers, setTriggers] = useState<BiometricTrigger[]>([]);
  const [keyMoments, setKeyMoments] = useState<KeyMoment[]>([]);
  const [realTimeData, setRealTimeData] = useState<any>({});
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);

  useEffect(() => {
    initializeDefaultTriggers();
    scanForDevices();
    
    // Simulate real-time data updates
    const interval = setInterval(() => {
      updateRealTimeData();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const initializeDefaultTriggers = () => {
    const defaultTriggers: BiometricTrigger[] = [
      {
        id: 'heart-spike',
        name: 'Heart Rate Spike',
        type: 'heart_rate',
        threshold: 120,
        condition: 'spike',
        duration: 10,
        enabled: true,
        action: 'capture_photo',
        sensitivity: 'medium'
      },
      {
        id: 'excitement',
        name: 'High Excitement',
        type: 'heart_rate',
        threshold: 140,
        condition: 'sustained',
        duration: 30,
        enabled: true,
        action: 'start_recording',
        sensitivity: 'high'
      },
      {
        id: 'stress-peak',
        name: 'Stress Peak',
        type: 'stress',
        threshold: 80,
        condition: 'above',
        duration: 15,
        enabled: false,
        action: 'tag_moment',
        sensitivity: 'medium'
      },
      {
        id: 'dance-activity',
        name: 'Dance Detection',
        type: 'activity',
        threshold: 75,
        condition: 'above',
        duration: 20,
        enabled: true,
        action: 'notify_photographer',
        sensitivity: 'high'
      },
      {
        id: 'applause-gesture',
        name: 'Applause Gesture',
        type: 'gesture',
        threshold: 10,
        condition: 'spike',
        duration: 5,
        enabled: true,
        action: 'capture_photo',
        sensitivity: 'medium'
      }
    ];

    setTriggers(defaultTriggers);
  };

  const scanForDevices = async () => {
    setIsScanning(true);
    
    try {
      // Try to discover Bluetooth devices
      const devices = await discoverBluetoothDevices();
      
      // Simulate Web Bluetooth API for wearables
      const mockDevices: WearableDevice[] = [
        {
          id: 'apple-watch-1',
          name: 'Apple Watch Series 9',
          type: 'apple_watch',
          status: 'connected',
          battery: 78,
          capabilities: ['heart_rate', 'activity', 'gesture', 'location'],
          lastSync: new Date()
        },
        {
          id: 'fitbit-1',
          name: 'Fitbit Sense 2',
          type: 'fitbit',
          status: 'disconnected',
          battery: 45,
          capabilities: ['heart_rate', 'stress', 'activity'],
          lastSync: new Date(Date.now() - 3600000)
        },
        {
          id: 'samsung-watch-1',
          name: 'Galaxy Watch 6',
          type: 'samsung_watch',
          status: 'connected',
          battery: 92,
          capabilities: ['heart_rate', 'activity', 'gesture'],
          lastSync: new Date()
        },
        {
          id: 'oura-ring-1',
          name: 'Oura Ring Gen3',
          type: 'smart_ring',
          status: 'syncing',
          battery: 34,
          capabilities: ['heart_rate', 'stress', 'activity'],
          lastSync: new Date(Date.now() - 1800000)
        }
      ];

      setConnectedDevices(mockDevices);
    } catch (error) {
      console.error('Failed to scan for devices:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const discoverBluetoothDevices = async (): Promise<WearableDevice[]> => {
    if (!navigator.bluetooth) {
      console.warn('Web Bluetooth not supported');
      return [];
    }

    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [
          { services: ['heart_rate'] },
          { services: ['fitness_machine'] },
          { namePrefix: 'Apple Watch' },
          { namePrefix: 'Fitbit' },
          { namePrefix: 'Galaxy Watch' }
        ],
        optionalServices: ['battery_service', 'device_information']
      });

      // Convert to our device format
      return [{
        id: device.id,
        name: device.name || 'Unknown Device',
        type: 'heart_rate_monitor', // Default type
        status: 'connected',
        capabilities: ['heart_rate'],
        lastSync: new Date()
      }];
    } catch (error) {
      console.warn('Bluetooth discovery cancelled or failed:', error);
      return [];
    }
  };

  const connectToDevice = async (deviceId: string) => {
    const device = connectedDevices.find(d => d.id === deviceId);
    if (!device) return;

    try {
      // Simulate connection process
      setConnectedDevices(prev => 
        prev.map(d => 
          d.id === deviceId 
            ? { ...d, status: 'syncing' as const }
            : d
        )
      );

      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      setConnectedDevices(prev => 
        prev.map(d => 
          d.id === deviceId 
            ? { ...d, status: 'connected' as const, lastSync: new Date() }
            : d
        )
      );

      // Start monitoring this device
      startBiometricMonitoring(device);
    } catch (error) {
      console.error('Failed to connect to device:', error);
      setConnectedDevices(prev => 
        prev.map(d => 
          d.id === deviceId 
            ? { ...d, status: 'disconnected' as const }
            : d
        )
      );
    }
  };

  const startBiometricMonitoring = (device: WearableDevice) => {
    // Simulate real-time biometric data
    const interval = setInterval(() => {
      const mockData = generateMockBiometricData(device);
      setRealTimeData(prev => ({
        ...prev,
        [device.id]: mockData
      }));

      // Check triggers
      checkTriggers(device.id, mockData);
    }, 1000);

    // Store interval for cleanup
    // In a real app, you'd store this in a ref or state
  };

  const generateMockBiometricData = (device: WearableDevice) => {
    const baseHeartRate = 80;
    const time = Date.now();
    
    return {
      heartRate: baseHeartRate + Math.sin(time / 10000) * 20 + Math.random() * 10,
      stressLevel: 30 + Math.sin(time / 20000) * 40 + Math.random() * 20,
      activity: ['resting', 'walking', 'dancing', 'running'][Math.floor(Math.random() * 4)],
      timestamp: new Date()
    };
  };

  const updateRealTimeData = () => {
    connectedDevices
      .filter(d => d.status === 'connected')
      .forEach(device => {
        const mockData = generateMockBiometricData(device);
        setRealTimeData(prev => ({
          ...prev,
          [device.id]: mockData
        }));
        
        checkTriggers(device.id, mockData);
      });
  };

  const checkTriggers = (deviceId: string, data: any) => {
    const enabledTriggers = triggers.filter(t => t.enabled);
    
    enabledTriggers.forEach(trigger => {
      const shouldTrigger = evaluateTrigger(trigger, data);
      
      if (shouldTrigger) {
        executeTriggerAction(trigger, deviceId, data);
      }
    });
  };

  const evaluateTrigger = (trigger: BiometricTrigger, data: any): boolean => {
    let value = 0;
    
    switch (trigger.type) {
      case 'heart_rate':
        value = data.heartRate;
        break;
      case 'stress':
        value = data.stressLevel;
        break;
      case 'activity':
        // For activity, we'll simulate activity intensity
        value = data.activity === 'dancing' ? 80 : 
               data.activity === 'running' ? 90 : 
               data.activity === 'walking' ? 40 : 20;
        break;
      default:
        return false;
    }

    switch (trigger.condition) {
      case 'above':
        return value > trigger.threshold;
      case 'below':
        return value < trigger.threshold;
      case 'spike':
        // Simplified spike detection
        return value > trigger.threshold * 1.2;
      case 'sustained':
        // Simplified sustained condition
        return value > trigger.threshold;
      default:
        return false;
    }
  };

  const executeTriggerAction = (trigger: BiometricTrigger, deviceId: string, data: any) => {
    const keyMoment: KeyMoment = {
      id: `moment-${Date.now()}`,
      timestamp: new Date(),
      trigger: trigger.name,
      biometricData: {
        heartRate: data.heartRate,
        stressLevel: data.stressLevel,
        activity: data.activity
      },
      photos: [], // Would be populated with actual photo captures
      confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
      context: `${trigger.name} detected via ${connectedDevices.find(d => d.id === deviceId)?.name}`
    };

    setKeyMoments(prev => [keyMoment, ...prev.slice(0, 9)]); // Keep last 10 moments

    switch (trigger.action) {
      case 'capture_photo':
        capturePhoto(keyMoment);
        break;
      case 'start_recording':
        startRecording(keyMoment);
        break;
      case 'tag_moment':
        tagMoment(keyMoment);
        break;
      case 'notify_photographer':
        notifyPhotographer(keyMoment);
        break;
    }
  };

  const capturePhoto = (moment: KeyMoment) => {
    console.log('Auto-capturing photo for key moment:', moment.trigger);
    // In production, this would trigger camera capture
  };

  const startRecording = (moment: KeyMoment) => {
    console.log('Starting video recording for:', moment.trigger);
    // In production, this would start video recording
  };

  const tagMoment = (moment: KeyMoment) => {
    console.log('Tagging moment:', moment.trigger);
    // In production, this would add metadata tags
  };

  const notifyPhotographer = (moment: KeyMoment) => {
    console.log('Notifying photographer about:', moment.trigger);
    // In production, this would send push notification or alert
  };

  const toggleTrigger = (triggerId: string) => {
    setTriggers(prev =>
      prev.map(t =>
        t.id === triggerId ? { ...t, enabled: !t.enabled } : t
      )
    );
  };

  const updateTrigger = (triggerId: string, updates: Partial<BiometricTrigger>) => {
    setTriggers(prev =>
      prev.map(t =>
        t.id === triggerId ? { ...t, ...updates } : t
      )
    );
  };

  const getTriggerIcon = (type: string) => {
    switch (type) {
      case 'heart_rate': return <Heart size={16} className="text-red-400" />;
      case 'stress': return <Zap size={16} className="text-yellow-400" />;
      case 'activity': return <Activity size={16} className="text-green-400" />;
      case 'gesture': return <Smile size={16} className="text-blue-400" />;
      default: return <Watch size={16} className="text-gray-400" />;
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'apple_watch': return '⌚';
      case 'fitbit': return '⌚';
      case 'samsung_watch': return '⌚';
      case 'smart_ring': return '💍';
      case 'heart_rate_monitor': return '❤️';
      default: return '📱';
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Wearable Triggers</h3>
        <div className="flex items-center space-x-3">
          <button
            onClick={scanForDevices}
            disabled={isScanning}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 text-blue-300 rounded-xl border border-blue-500/30 hover:bg-blue-500/30 transition-colors disabled:opacity-50"
          >
            <Bluetooth size={18} />
            <span>{isScanning ? 'Scanning...' : 'Scan Devices'}</span>
          </button>
        </div>
      </div>

      {/* Connected Devices */}
      <div className="space-y-4 mb-8">
        <h4 className="text-lg font-medium text-white">Connected Devices</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {connectedDevices.map((device) => (
            <div
              key={device.id}
              className={`bg-black/20 rounded-xl p-4 border transition-colors ${
                device.status === 'connected' ? 'border-green-500/30' :
                device.status === 'syncing' ? 'border-yellow-500/30' :
                'border-red-500/30'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{getDeviceIcon(device.type)}</div>
                  <div>
                    <h5 className="font-medium text-white">{device.name}</h5>
                    <p className="text-sm text-gray-400 capitalize">
                      {device.type.replace('_', ' ')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`w-2 h-2 rounded-full mb-1 ${
                    device.status === 'connected' ? 'bg-green-400' :
                    device.status === 'syncing' ? 'bg-yellow-400 animate-pulse' :
                    'bg-red-400'
                  }`} />
                  {device.battery && (
                    <p className="text-xs text-gray-400">{device.battery}%</p>
                  )}
                </div>
              </div>

              {/* Real-time Data */}
              {device.status === 'connected' && realTimeData[device.id] && (
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="text-center p-2 bg-red-500/10 rounded-lg">
                    <p className="text-xs text-red-300">Heart Rate</p>
                    <p className="text-sm font-semibold text-white">
                      {Math.round(realTimeData[device.id].heartRate)} BPM
                    </p>
                  </div>
                  <div className="text-center p-2 bg-yellow-500/10 rounded-lg">
                    <p className="text-xs text-yellow-300">Stress</p>
                    <p className="text-sm font-semibold text-white">
                      {Math.round(realTimeData[device.id].stressLevel)}%
                    </p>
                  </div>
                  <div className="text-center p-2 bg-green-500/10 rounded-lg">
                    <p className="text-xs text-green-300">Activity</p>
                    <p className="text-sm font-semibold text-white capitalize">
                      {realTimeData[device.id].activity}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">
                  Last sync: {device.lastSync?.toLocaleTimeString()}
                </span>
                {device.status !== 'connected' && (
                  <button
                    onClick={() => connectToDevice(device.id)}
                    className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors"
                  >
                    Connect
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Biometric Triggers */}
      <div className="space-y-4 mb-8">
        <h4 className="text-lg font-medium text-white">Biometric Triggers</h4>
        <div className="space-y-3">
          {triggers.map((trigger) => (
            <div
              key={trigger.id}
              className={`bg-black/20 rounded-xl p-4 border transition-colors ${
                trigger.enabled ? 'border-green-500/30' : 'border-gray-500/30'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {getTriggerIcon(trigger.type)}
                  <div>
                    <h5 className="font-medium text-white">{trigger.name}</h5>
                    <p className="text-sm text-gray-400 capitalize">
                      {trigger.condition} {trigger.threshold} for {trigger.duration}s
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <select
                    value={trigger.sensitivity}
                    onChange={(e) => updateTrigger(trigger.id, { sensitivity: e.target.value as any })}
                    className="bg-white/10 rounded-lg px-2 py-1 text-sm text-white border border-white/20"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={trigger.enabled}
                      onChange={() => toggleTrigger(trigger.id)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs capitalize">
                  {trigger.action.replace('_', ' ')}
                </span>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <span className="text-gray-400">Threshold:</span>
                    <input
                      type="number"
                      value={trigger.threshold}
                      onChange={(e) => updateTrigger(trigger.id, { threshold: parseInt(e.target.value) })}
                      className="w-16 bg-white/10 rounded px-2 py-1 text-white text-xs"
                    />
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-gray-400">Duration:</span>
                    <input
                      type="number"
                      value={trigger.duration}
                      onChange={(e) => updateTrigger(trigger.id, { duration: parseInt(e.target.value) })}
                      className="w-16 bg-white/10 rounded px-2 py-1 text-white text-xs"
                    />
                    <span className="text-gray-400 text-xs">s</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Moments */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-white">Recent Key Moments</h4>
        {keyMoments.length === 0 ? (
          <div className="text-center py-8">
            <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-400">No key moments detected yet</p>
            <p className="text-sm text-gray-500">Connect a wearable device to start detecting emotional peaks</p>
          </div>
        ) : (
          <div className="space-y-3">
            {keyMoments.map((moment) => (
              <div
                key={moment.id}
                className="bg-black/20 rounded-xl p-4 border border-white/10"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                    <h5 className="font-medium text-white">{moment.trigger}</h5>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">{moment.timestamp.toLocaleTimeString()}</p>
                    <p className="text-xs text-green-300">{Math.round(moment.confidence * 100)}% confidence</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-2">
                  {moment.biometricData.heartRate && (
                    <div className="text-center">
                      <p className="text-xs text-red-300">Heart Rate</p>
                      <p className="text-sm font-semibold text-white">
                        {Math.round(moment.biometricData.heartRate)} BPM
                      </p>
                    </div>
                  )}
                  {moment.biometricData.stressLevel && (
                    <div className="text-center">
                      <p className="text-xs text-yellow-300">Stress</p>
                      <p className="text-sm font-semibold text-white">
                        {Math.round(moment.biometricData.stressLevel)}%
                      </p>
                    </div>
                  )}
                  {moment.biometricData.activity && (
                    <div className="text-center">
                      <p className="text-xs text-green-300">Activity</p>
                      <p className="text-sm font-semibold text-white capitalize">
                        {moment.biometricData.activity}
                      </p>
                    </div>
                  )}
                </div>
                
                <p className="text-xs text-gray-400">{moment.context}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}