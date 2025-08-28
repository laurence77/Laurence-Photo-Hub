/**
 * Flat Mode Toggle Component
 * Provides accessibility toggle between 3D and flat modes
 */

import React, { useState, useEffect } from 'react';
import { Box, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { get3D } from '@/scripts/3d-core';

interface FlatModeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'button' | 'switch' | 'icon';
  showLabel?: boolean;
  position?: 'fixed' | 'relative';
  fixedPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

const FlatModeToggle: React.FC<FlatModeToggleProps> = ({
  className,
  size = 'md',
  variant = 'button',
  showLabel = true,
  position = 'relative',
  fixedPosition = 'bottom-right'
}) => {
  const [is3DMode, setIs3DMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize state from DOM
  useEffect(() => {
    const currentMode = document.documentElement.dataset['3dMode'] || '3d';
    setIs3DMode(currentMode === '3d');

    // Listen for external mode changes
    const handleModeChange = (event: CustomEvent) => {
      setIs3DMode(event.detail.settings.mode === '3d');
    };

    document.addEventListener('3d-settings-changed', handleModeChange as EventListener);

    return () => {
      document.removeEventListener('3d-settings-changed', handleModeChange as EventListener);
    };
  }, []);

  // Handle toggle
  const handleToggle = async () => {
    setIsLoading(true);
    
    try {
      const core3D = get3D();
      if (core3D) {
        core3D.toggleMode();
        setIs3DMode(!is3DMode);
      } else {
        // Fallback: directly update DOM
        const newMode = is3DMode ? 'flat' : '3d';
        document.documentElement.dataset['3dMode'] = newMode;
        setIs3DMode(!is3DMode);
        
        // Save to localStorage
        try {
          const currentSettings = JSON.parse(localStorage.getItem('laurence-photo-hub-3d-settings') || '{}');
          localStorage.setItem('laurence-photo-hub-3d-settings', JSON.stringify({
            ...currentSettings,
            mode: newMode
          }));
        } catch (e) {
          console.warn('Failed to save 3D mode preference:', e);
        }
      }
    } catch (error) {
      console.error('Failed to toggle 3D mode:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Size variants
  const sizeClasses = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-base',
    lg: 'h-12 px-6 text-lg'
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  // Position classes for fixed positioning
  const positionClasses = position === 'fixed' ? {
    'top-left': 'fixed top-4 left-4 z-50',
    'top-right': 'fixed top-4 right-4 z-50',
    'bottom-left': 'fixed bottom-4 left-4 z-50',
    'bottom-right': 'fixed bottom-4 right-4 z-50'
  } : {};

  const baseClasses = cn(
    'transition-all duration-300 ease-spring',
    position === 'fixed' && positionClasses[fixedPosition],
    className
  );

  // Switch variant
  if (variant === 'switch') {
    return (
      <div className={cn('flex items-center gap-3', baseClasses)}>
        {showLabel && (
          <span className="text-sm font-medium text-muted-foreground">
            3D Effects
          </span>
        )}
        <button
          onClick={handleToggle}
          disabled={isLoading}
          className={cn(
            'relative inline-flex items-center rounded-full transition-colors',
            'w-11 h-6 bg-muted hover:bg-muted/80',
            is3DMode && 'bg-electric-bg',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
          )}
          role="switch"
          aria-checked={is3DMode}
          aria-label={`${is3DMode ? 'Disable' : 'Enable'} 3D effects`}
        >
          <span
            className={cn(
              'inline-block w-4 h-4 bg-background rounded-full transition-transform',
              'shadow-sm transform',
              is3DMode ? 'translate-x-6' : 'translate-x-1'
            )}
          />
        </button>
      </div>
    );
  }

  // Icon variant
  if (variant === 'icon') {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggle}
        disabled={isLoading}
        className={cn(
          baseClasses,
          'enhance-3d hover-lift rounded-full',
          !is3DMode && 'bg-muted'
        )}
        aria-label={`Switch to ${is3DMode ? 'flat' : '3D'} mode`}
        title={`Currently in ${is3DMode ? '3D' : 'flat'} mode`}
      >
        {is3DMode ? (
          <Box className={cn(iconSizeClasses[size], 'text-electric-accent')} />
        ) : (
          <Square className={cn(iconSizeClasses[size])} />
        )}
      </Button>
    );
  }

  // Button variant (default)
  return (
    <Button
      variant={is3DMode ? "default" : "outline"}
      size={size}
      onClick={handleToggle}
      disabled={isLoading}
      className={cn(
        baseClasses,
        sizeClasses[size],
        'enhance-3d hover-lift gap-2',
        is3DMode ? 'electric-bg text-white' : 'bg-muted'
      )}
      aria-label={`Switch to ${is3DMode ? 'flat' : '3D'} mode`}
    >
      {is3DMode ? (
        <Box className={iconSizeClasses[size]} />
      ) : (
        <Square className={iconSizeClasses[size]} />
      )}
      {showLabel && (
        <span>
          {is3DMode ? '3D Mode' : 'Flat Mode'}
        </span>
      )}
    </Button>
  );
};

export default FlatModeToggle;