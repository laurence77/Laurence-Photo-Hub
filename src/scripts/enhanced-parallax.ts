/**
 * Enhanced Parallax System - Extends existing 3d-core.ts
 * Adds smooth pointer tracking and enhanced scroll parallax
 */

import { get3D } from './3d-core';

interface PointerTracker {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  smoothing: number;
}

interface ScrollParallaxElement {
  element: HTMLElement;
  speed: number;
  direction: 'vertical' | 'horizontal' | 'both';
  offset: number;
}

class EnhancedParallax {
  private pointer: PointerTracker;
  private scrollElements: ScrollParallaxElement[] = [];
  private rafId: number | null = null;
  private isActive = false;

  constructor() {
    this.pointer = {
      x: 0.5,
      y: 0.5,
      targetX: 0.5,
      targetY: 0.5,
      smoothing: 0.08 // Smooth easing factor
    };
  }

  /**
   * Initialize enhanced parallax system
   */
  public init(): void {
    if (this.isActive) return;

    this.setupEventListeners();
    this.scanScrollElements();
    this.startLoop();
    this.isActive = true;

    console.log('Enhanced Parallax initialized');
  }

  /**
   * Destroy and cleanup
   */
  public destroy(): void {
    if (!this.isActive) return;

    this.removeEventListeners();
    this.stopLoop();
    this.scrollElements = [];
    this.isActive = false;
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    this.handlePointerMove = this.handlePointerMove.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);

    // Use pointermove for better touch/pen support
    document.addEventListener('pointermove', this.handlePointerMove, { passive: true });
    window.addEventListener('resize', this.handleResize, { passive: true });
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  }

  /**
   * Remove event listeners
   */
  private removeEventListeners(): void {
    document.removeEventListener('pointermove', this.handlePointerMove);
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
  }

  /**
   * Handle pointer movement with improved smoothing
   */
  private handlePointerMove(event: PointerEvent): void {
    const rect = document.documentElement.getBoundingClientRect();
    
    // Normalize coordinates (0-1)
    this.pointer.targetX = Math.max(0, Math.min(1, event.clientX / rect.width));
    this.pointer.targetY = Math.max(0, Math.min(1, event.clientY / rect.height));
  }

  /**
   * Handle window resize
   */
  private handleResize(): void {
    this.scanScrollElements();
  }

  /**
   * Handle visibility change
   */
  private handleVisibilityChange(): void {
    if (document.hidden) {
      this.stopLoop();
    } else {
      this.startLoop();
    }
  }

  /**
   * Scan for scroll parallax elements
   */
  private scanScrollElements(): void {
    this.scrollElements = [];
    
    const elements = document.querySelectorAll<HTMLElement>('[data-scroll-parallax]');
    elements.forEach(element => {
      const speed = parseFloat(element.dataset.scrollParallax || '0.5');
      const direction = (element.dataset.scrollDirection as 'vertical' | 'horizontal' | 'both') || 'vertical';
      
      this.scrollElements.push({
        element,
        speed: Math.max(-2, Math.min(2, speed)), // Clamp speed
        direction,
        offset: 0
      });
    });
  }

  /**
   * Start animation loop
   */
  private startLoop(): void {
    if (this.rafId !== null) return;

    const animate = () => {
      this.updatePointer();
      this.updateScrollParallax();
      this.rafId = requestAnimationFrame(animate);
    };

    this.rafId = requestAnimationFrame(animate);
  }

  /**
   * Stop animation loop
   */
  private stopLoop(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  /**
   * Update pointer with smooth easing
   */
  private updatePointer(): void {
    // Smooth interpolation
    this.pointer.x += (this.pointer.targetX - this.pointer.x) * this.pointer.smoothing;
    this.pointer.y += (this.pointer.targetY - this.pointer.y) * this.pointer.smoothing;

    // Update CSS custom properties for use in CSS animations
    document.documentElement.style.setProperty('--pointer-x', this.pointer.x.toString());
    document.documentElement.style.setProperty('--pointer-y', this.pointer.y.toString());

    // Update elements with pointer parallax
    this.updatePointerParallax();
  }

  /**
   * Update pointer-based parallax effects
   */
  private updatePointerParallax(): void {
    const elements = document.querySelectorAll<HTMLElement>('[data-pointer-parallax]');
    
    elements.forEach(element => {
      const intensity = parseFloat(element.dataset.pointerParallax || '0.1');
      const reverse = element.dataset.pointerReverse === 'true';
      
      // Calculate offset from center (range: -0.5 to 0.5)
      const offsetX = (this.pointer.x - 0.5) * (reverse ? -1 : 1);
      const offsetY = (this.pointer.y - 0.5) * (reverse ? -1 : 1);
      
      // Apply transform with intensity scaling
      const translateX = offsetX * intensity * 50; // Scale to pixels
      const translateY = offsetY * intensity * 50;
      
      element.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
    });
  }

  /**
   * Update scroll-based parallax
   */
  private updateScrollParallax(): void {
    const scrollY = window.pageYOffset;
    const scrollX = window.pageXOffset;
    
    this.scrollElements.forEach(({ element, speed, direction }) => {
      let transformX = 0;
      let transformY = 0;
      
      if (direction === 'vertical' || direction === 'both') {
        transformY = scrollY * speed;
      }
      
      if (direction === 'horizontal' || direction === 'both') {
        transformX = scrollX * speed;
      }
      
      element.style.transform = `translate3d(${transformX}px, ${transformY}px, 0)`;
    });
  }

  /**
   * Get current pointer position (normalized 0-1)
   */
  public getPointer(): { x: number; y: number } {
    return {
      x: this.pointer.x,
      y: this.pointer.y
    };
  }

  /**
   * Set pointer smoothing factor
   */
  public setSmoothing(smoothing: number): void {
    this.pointer.smoothing = Math.max(0.01, Math.min(1, smoothing));
  }
}

// Global instance
let enhancedParallaxInstance: EnhancedParallax | null = null;

/**
 * Initialize enhanced parallax system
 */
export function initEnhancedParallax(): EnhancedParallax {
  if (!enhancedParallaxInstance) {
    enhancedParallaxInstance = new EnhancedParallax();
  }
  
  enhancedParallaxInstance.init();
  return enhancedParallaxInstance;
}

/**
 * Get enhanced parallax instance
 */
export function getEnhancedParallax(): EnhancedParallax | null {
  return enhancedParallaxInstance;
}

/**
 * Destroy enhanced parallax
 */
export function destroyEnhancedParallax(): void {
  if (enhancedParallaxInstance) {
    enhancedParallaxInstance.destroy();
    enhancedParallaxInstance = null;
  }
}

// Auto-initialize after core 3D system
document.addEventListener('3d-core-ready', () => {
  initEnhancedParallax();
});

// Fallback initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initEnhancedParallax);
} else {
  setTimeout(initEnhancedParallax, 100);
}