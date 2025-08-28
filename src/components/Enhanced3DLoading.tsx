/**
 * Enhanced 3D Loading Component
 * Provides elegant loading states that respect 3D/flat mode preferences
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface Enhanced3DLoadingProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'pulse' | 'skeleton';
  message?: string;
  showMessage?: boolean;
}

const Enhanced3DLoading: React.FC<Enhanced3DLoadingProps> = ({
  className,
  size = 'md',
  variant = 'spinner',
  message = 'Loading…',
  showMessage = true
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  };

  const containerSizes = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  if (variant === 'spinner') {
    return (
      <div className={cn(
        'flex flex-col items-center justify-center min-h-[200px]',
        'scene transform-gpu',
        containerSizes[size],
        className
      )}>
        <div className={cn(
          'relative enhance-3d',
          'layer',
          sizeClasses[size]
        )} data-depth="1">
          <div 
            className={cn(
              'absolute inset-0 rounded-full border-2 border-electric-accent opacity-20',
              'animate-spin'
            )}
            style={{
              borderTopColor: 'var(--electric-blue)',
              animationDuration: '1s'
            }}
          />
          <div 
            className={cn(
              'absolute inset-1 rounded-full border-2 border-electric-accent opacity-40',
              'animate-spin'
            )}
            style={{
              borderRightColor: 'var(--electric-blue)',
              animationDuration: '1.5s',
              animationDirection: 'reverse'
            }}
          />
          <div 
            className={cn(
              'absolute inset-2 rounded-full border-2 border-electric-accent',
              'animate-spin'
            )}
            style={{
              borderBottomColor: 'var(--electric-blue)',
              animationDuration: '0.8s'
            }}
          />
        </div>
        
        {showMessage && (
          <div className={cn(
            'mt-4 text-sm font-medium text-muted-foreground',
            'layer animate-pulse',
            'enhance-3d'
          )} data-depth="0">
            {message}
          </div>
        )}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={cn(
        'flex flex-col items-center justify-center min-h-[200px]',
        'scene transform-gpu',
        containerSizes[size],
        className
      )}>
        <div className={cn(
          'relative enhance-3d layer',
          sizeClasses[size]
        )} data-depth="1">
          <div className="absolute inset-0 rounded-full bg-electric-accent opacity-60 animate-ping" />
          <div className="absolute inset-1 rounded-full bg-electric-accent opacity-80 animate-ping animation-delay-200" />
          <div className="absolute inset-2 rounded-full bg-electric-accent animate-ping animation-delay-400" />
        </div>
        
        {showMessage && (
          <div className={cn(
            'mt-4 text-sm font-medium text-muted-foreground',
            'layer animate-pulse',
            'enhance-3d'
          )} data-depth="0">
            {message}
          </div>
        )}
      </div>
    );
  }

  if (variant === 'skeleton') {
    return (
      <div className={cn(
        'scene transform-gpu',
        'animate-pulse',
        containerSizes[size],
        className
      )}>
        <div className="space-y-4">
          <div className="layer enhance-3d" data-depth="1">
            <div className="h-4 bg-muted rounded-lg shadow-float" />
          </div>
          <div className="space-y-3 layer" data-depth="2">
            <div className="grid grid-cols-3 gap-4">
              <div className="h-2 bg-muted rounded col-span-2 enhance-3d shadow-float" />
              <div className="h-2 bg-muted rounded col-span-1 enhance-3d shadow-float" />
            </div>
            <div className="h-2 bg-muted rounded enhance-3d shadow-float" />
          </div>
        </div>
        
        {showMessage && (
          <div className={cn(
            'mt-6 text-center text-sm font-medium text-muted-foreground',
            'layer enhance-3d'
          )} data-depth="0">
            {message}
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default Enhanced3DLoading;