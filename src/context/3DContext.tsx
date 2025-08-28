/**
 * 3D Context - Global 3D system management
 * Provides centralized control over 3D effects across the application
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { get3D } from '../scripts/3d-core';
import { getEnhancedParallax } from '../scripts/enhanced-parallax';

interface Settings3D {
  mode: '3d' | 'flat';
  motionEnabled: boolean;
  parallaxEnabled: boolean;
  deviceTiltEnabled: boolean;
  maxIntensity: number;
  advancedEffects: boolean;
}

interface Context3D {
  settings: Settings3D;
  updateSettings: (newSettings: Partial<Settings3D>) => void;
  toggleMode: () => void;
  isReady: boolean;
  deviceCapabilities: {
    supportsWebGL: boolean;
    supportsBackdropFilter: boolean;
    isMobile: boolean;
    prefersReducedMotion: boolean;
  };
}

const ThreeDContext = createContext<Context3D | undefined>(undefined);

export const ThreeDProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const [settings, setSettings] = useState<Settings3D>({
    mode: '3d',
    motionEnabled: true,
    parallaxEnabled: true,
    deviceTiltEnabled: true,
    maxIntensity: 1.0,
    advancedEffects: true
  });

  // Detect device capabilities
  const [deviceCapabilities] = useState(() => {
    const canvas = document.createElement('canvas');
    const supportsWebGL = !!(
      canvas.getContext('webgl') || 
      canvas.getContext('experimental-webgl')
    );

    const supportsBackdropFilter = CSS.supports('backdrop-filter', 'blur(10px)') ||
                                   CSS.supports('-webkit-backdrop-filter', 'blur(10px)');

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    return {
      supportsWebGL,
      supportsBackdropFilter,
      isMobile,
      prefersReducedMotion
    };
  });

  // Initialize settings from various sources
  useEffect(() => {
    const loadSettings = () => {
      try {
        // Priority order: URL params > localStorage > device capabilities
        const urlParams = new URLSearchParams(window.location.search);
        const saved = localStorage.getItem('laurence-photo-hub-3d-settings');
        const savedSettings = saved ? JSON.parse(saved) : {};

        const initialSettings: Settings3D = {
          mode: urlParams.get('3d-mode') === 'flat' ? 'flat' : '3d',
          motionEnabled: !deviceCapabilities.prefersReducedMotion,
          parallaxEnabled: !deviceCapabilities.prefersReducedMotion && !deviceCapabilities.isMobile,
          deviceTiltEnabled: deviceCapabilities.isMobile,
          maxIntensity: deviceCapabilities.isMobile ? 0.7 : 1.0,
          advancedEffects: deviceCapabilities.supportsWebGL && !deviceCapabilities.isMobile,
          ...savedSettings
        };

        // Override with URL params if present
        if (urlParams.has('3d-motion')) {
          initialSettings.motionEnabled = urlParams.get('3d-motion') !== 'false';
        }

        setSettings(initialSettings);
        
        // Apply to DOM
        document.documentElement.dataset['3dMode'] = initialSettings.mode;
        
      } catch (error) {
        console.warn('Failed to load 3D settings:', error);
      }
    };

    loadSettings();
  }, [deviceCapabilities]);

  // Listen for 3D core ready event
  useEffect(() => {
    const handleCoreReady = () => {
      setIsReady(true);
    };

    const handleSettingsChanged = (event: CustomEvent) => {
      setSettings(event.detail.settings);
    };

    document.addEventListener('3d-core-ready', handleCoreReady);
    document.addEventListener('3d-settings-changed', handleSettingsChanged as EventListener);

    return () => {
      document.removeEventListener('3d-core-ready', handleCoreReady);
      document.removeEventListener('3d-settings-changed', handleSettingsChanged as EventListener);
    };
  }, []);

  // Update settings
  const updateSettings = useCallback((newSettings: Partial<Settings3D>) => {
    setSettings(prevSettings => {
      const updatedSettings = { ...prevSettings, ...newSettings };
      
      // Save to localStorage
      try {
        localStorage.setItem('laurence-photo-hub-3d-settings', JSON.stringify(updatedSettings));
      } catch (error) {
        console.warn('Failed to save 3D settings:', error);
      }
      
      // Update DOM
      document.documentElement.dataset['3dMode'] = updatedSettings.mode;
      
      // Update 3D core system
      const core3D = get3D();
      if (core3D) {
        core3D.updateSettings(updatedSettings);
      }
      
      return updatedSettings;
    });
  }, []);

  // Toggle between 3D and flat mode
  const toggleMode = useCallback(() => {
    updateSettings({
      mode: settings.mode === '3d' ? 'flat' : '3d'
    });
  }, [settings.mode, updateSettings]);

  // Monitor reduced motion preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleMotionChange = (e: MediaQueryListEvent) => {
      updateSettings({
        motionEnabled: !e.matches,
        parallaxEnabled: !e.matches && settings.parallaxEnabled
      });
    };

    mediaQuery.addEventListener('change', handleMotionChange);
    return () => mediaQuery.removeEventListener('change', handleMotionChange);
  }, [updateSettings, settings.parallaxEnabled]);

  const contextValue: Context3D = {
    settings,
    updateSettings,
    toggleMode,
    isReady,
    deviceCapabilities
  };

  return (
    <ThreeDContext.Provider value={contextValue}>
      {children}
    </ThreeDContext.Provider>
  );
};

// Custom hook to use 3D context
export const use3D = (): Context3D => {
  const context = useContext(ThreeDContext);
  if (context === undefined) {
    throw new Error('use3D must be used within a ThreeDProvider');
  }
  return context;
};

// Higher-order component for 3D-aware components
export const with3D = <P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P & { threeDContext?: Context3D }> => {
  return (props: P & { threeDContext?: Context3D }) => {
    const threeDContext = use3D();
    return <Component {...props} threeDContext={threeDContext} />;
  };
};

export default ThreeDContext;