/**
 * Enhanced 3D Card Component
 * Integrates with existing 3D system for systematic depth effects
 */

import React, { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface Enhanced3DCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Depth layer (0-5) */
  depth?: 0 | 1 | 2 | 3 | 4 | 5;
  /** Hover effect intensity */
  hoverIntensity?: 'subtle' | 'medium' | 'strong';
  /** Enable tilt-on-hover */
  enableTilt?: boolean;
  /** Enable press depth effect */
  enablePress?: boolean;
  /** Parallax intensity (0-1) */
  parallax?: number;
  /** Electric glow effect */
  electric?: boolean;
  /** Glass morphism level */
  glass?: 'subtle' | 'medium' | 'strong';
  /** Shadow intensity */
  shadow?: 'sm' | 'md' | 'lg' | 'xl';
  /** Custom 3D transform */
  transform3d?: string;
  /** Disable 3D effects (accessibility) */
  flat?: boolean;
}

const Enhanced3DCard = forwardRef<HTMLDivElement, Enhanced3DCardProps>(({
  className,
  depth = 2,
  hoverIntensity = 'medium',
  enableTilt = true,
  enablePress = false,
  parallax,
  electric = false,
  glass = 'medium',
  shadow = 'md',
  transform3d,
  flat = false,
  style,
  children,
  ...props
}, ref) => {
  // Generate class names based on props
  const classes = cn(
    // Base 3D classes
    'scene transform-gpu gpu-boost',
    
    // Depth layer
    !flat && `layer`,
    
    // Hover effects
    !flat && enableTilt && {
      'tilt-hover': hoverIntensity === 'subtle',
      'tilt-hover-md': hoverIntensity === 'medium',
      'tilt-hover-lg': hoverIntensity === 'strong'
    },
    
    // Press effects
    !flat && enablePress && 'press-depth',
    
    // Card styling
    electric ? 'card-3d-electric' : 'card-3d',
    
    // Glass morphism
    glass === 'subtle' && 'glass-light',
    glass === 'medium' && 'glass-medium',
    glass === 'strong' && 'glass-heavy',
    
    // Shadows
    electric && {
      'shadow-electric-sm': shadow === 'sm',
      'shadow-electric-md': shadow === 'md',
      'shadow-electric-lg': shadow === 'lg'
    },
    !electric && {
      'shadow-layered-sm': shadow === 'sm',
      'shadow-layered-md': shadow === 'md', 
      'shadow-layered-lg': shadow === 'lg',
      'shadow-layered-xl': shadow === 'xl'
    },
    
    // Additional glass card styling
    'glass-card',
    
    // User classes
    className
  );

  // Generate data attributes for 3D system
  const dataAttributes = {
    'data-depth': flat ? undefined : depth.toString(),
    'data-parallax': flat || !parallax ? undefined : parallax.toString(),
    'data-3d-card': 'true',
    ...(props as any)
  };

  // Combine styles
  const combinedStyle = {
    ...style,
    ...(transform3d && !flat && {
      transform: transform3d
    })
  };

  return (
    <div
      ref={ref}
      className={classes}
      style={combinedStyle}
      {...dataAttributes}
    >
      {children}
    </div>
  );
});

Enhanced3DCard.displayName = 'Enhanced3DCard';

export default Enhanced3DCard;