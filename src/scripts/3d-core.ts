/**
 * Laurence Photo Hub - 3D Core Interactions
 * Pointer and scroll parallax with performance optimization
 */

interface ParallaxElement {
  element: HTMLElement;
  intensity: number;
  layer: number;
}

interface DeviceTiltData {
  x: number;
  y: number;
  z: number;
}

interface Settings3D {
  mode: '3d' | 'flat';
  motionEnabled: boolean;
  parallaxEnabled: boolean;
  deviceTiltEnabled: boolean;
  maxIntensity: number;
}

class Core3D {
  private elements: ParallaxElement[] = [];
  private settings: Settings3D;
  private isInitialized = false;
  private rafId: number | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private intersectionObserver: IntersectionObserver | null = null;

  // Mouse/pointer tracking
  private mouseX = 0;
  private mouseY = 0;
  private targetMouseX = 0;
  private targetMouseY = 0;
  
  // Device orientation tracking
  private deviceTilt: DeviceTiltData = { x: 0, y: 0, z: 0 };
  
  // Scroll tracking
  private scrollY = 0;
  private windowHeight = 0;

  constructor() {
    this.settings = this.loadSettings();
    this.windowHeight = window.innerHeight;
    
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.settings.motionEnabled = false;
      this.settings.parallaxEnabled = false;
      this.settings.deviceTiltEnabled = false;
    }
  }

  /**
   * Initialize the 3D system
   */
  public init(): void {
    if (this.isInitialized) return;

    this.updateSettingsFromDOM();
    this.setupEventListeners();
    this.scanForElements();
    this.setupObservers();
    this.startAnimationLoop();

    this.isInitialized = true;
    
    // Dispatch ready event
    document.dispatchEvent(new CustomEvent('3d-core-ready', {
      detail: { settings: this.settings }
    }));
  }

  /**
   * Destroy the 3D system and clean up
   */
  public destroy(): void {
    if (!this.isInitialized) return;

    this.removeEventListeners();
    this.stopAnimationLoop();
    
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }

    this.elements = [];
    this.isInitialized = false;
  }

  /**
   * Update settings and refresh
   */
  public updateSettings(newSettings: Partial<Settings3D>): void {
    this.settings = { ...this.settings, ...newSettings };
    this.saveSettings();
    this.applyModeToDOM();
    
    // Dispatch settings change event
    document.dispatchEvent(new CustomEvent('3d-settings-changed', {
      detail: { settings: this.settings }
    }));
  }

  /**
   * Toggle between 3D and flat mode
   */
  public toggleMode(): void {
    const newMode = this.settings.mode === '3d' ? 'flat' : '3d';
    this.updateSettings({ mode: newMode });
  }

  /**
   * Load settings from URL params, data attributes, or localStorage
   */
  private loadSettings(): Settings3D {
    const defaults: Settings3D = {
      mode: '3d',
      motionEnabled: true,
      parallaxEnabled: true,
      deviceTiltEnabled: true,
      maxIntensity: 1.0
    };

    // Check URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('3d-mode')) {
      defaults.mode = urlParams.get('3d-mode') === 'flat' ? 'flat' : '3d';
    }

    // Check data attributes on document element
    const docEl = document.documentElement;
    if (docEl.dataset['3dMode']) {
      defaults.mode = docEl.dataset['3dMode'] as '3d' | 'flat';
    }

    // Load from localStorage
    try {
      const saved = localStorage.getItem('laurence-photo-hub-3d-settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...defaults, ...parsed };
      }
    } catch (e) {
      console.warn('Failed to load 3D settings from localStorage:', e);
    }

    return defaults;
  }

  /**
   * Save settings to localStorage
   */
  private saveSettings(): void {
    try {
      localStorage.setItem('laurence-photo-hub-3d-settings', JSON.stringify(this.settings));
    } catch (e) {
      console.warn('Failed to save 3D settings:', e);
    }
  }

  /**
   * Update settings from DOM data attributes
   */
  private updateSettingsFromDOM(): void {
    const docEl = document.documentElement;
    
    if (docEl.dataset['3dMode']) {
      this.settings.mode = docEl.dataset['3dMode'] as '3d' | 'flat';
    }
    
    if (docEl.dataset['3dMotion'] === 'false') {
      this.settings.motionEnabled = false;
    }
    
    if (docEl.dataset['3dParallax'] === 'false') {
      this.settings.parallaxEnabled = false;
    }
    
    if (docEl.dataset['3dDeviceTilt'] === 'false') {
      this.settings.deviceTiltEnabled = false;
    }
    
    if (docEl.dataset['3dMaxIntensity']) {
      const intensity = parseFloat(docEl.dataset['3dMaxIntensity']);
      if (!isNaN(intensity)) {
        this.settings.maxIntensity = Math.max(0, Math.min(1, intensity));
      }
    }

    this.applyModeToDOM();
  }

  /**
   * Apply current mode to DOM
   */
  private applyModeToDOM(): void {
    document.documentElement.dataset['3dMode'] = this.settings.mode;
  }

  /**
   * Scan DOM for parallax elements
   */
  private scanForElements(): void {
    this.elements = [];
    
    // Find elements with data-parallax attribute
    const parallaxElements = document.querySelectorAll<HTMLElement>('[data-parallax]');
    parallaxElements.forEach(element => {
      const intensity = parseFloat(element.dataset.parallax || '0.1');
      const layer = parseInt(element.dataset.layer || '0');
      
      this.elements.push({
        element,
        intensity: Math.max(0, Math.min(1, intensity)) * this.settings.maxIntensity,
        layer
      });
    });

    // Find elements with layer data attributes
    const layerElements = document.querySelectorAll<HTMLElement>('[data-depth]');
    layerElements.forEach(element => {
      if (element.dataset.parallax) return; // Skip if already added
      
      const layer = parseInt(element.dataset.depth || '0');
      const intensity = layer * 0.02; // Automatic intensity based on layer
      
      this.elements.push({
        element,
        intensity: intensity * this.settings.maxIntensity,
        layer
      });
    });
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    // Mouse/pointer events
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.handleOrientationChange = this.handleOrientationChange.bind(this);
    
    document.addEventListener('mousemove', this.handleMouseMove, { passive: true });
    window.addEventListener('resize', this.handleResize, { passive: true });
    window.addEventListener('scroll', this.handleScroll, { passive: true });
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    
    // Device orientation (mobile)
    if (this.settings.deviceTiltEnabled && 'DeviceOrientationEvent' in window) {
      window.addEventListener('deviceorientation', this.handleOrientationChange, { passive: true });
    }
    
    // Media query for reduced motion changes
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', (e) => {
      this.updateSettings({
        motionEnabled: !e.matches,
        parallaxEnabled: !e.matches
      });
    });
  }

  /**
   * Remove event listeners
   */
  private removeEventListeners(): void {
    document.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('scroll', this.handleScroll);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    window.removeEventListener('deviceorientation', this.handleOrientationChange);
  }

  /**
   * Setup intersection and resize observers
   */
  private setupObservers(): void {
    // Intersection observer for performance optimization
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const element = entry.target as HTMLElement;
          element.dataset.inView = entry.isIntersecting.toString();
        });
      },
      {
        rootMargin: '50px',
        threshold: 0
      }
    );

    // Observe all parallax elements
    this.elements.forEach(({ element }) => {
      this.intersectionObserver!.observe(element);
    });

    // Resize observer for responsive adjustments
    this.resizeObserver = new ResizeObserver(() => {
      this.windowHeight = window.innerHeight;
    });
    
    this.resizeObserver.observe(document.documentElement);
  }

  /**
   * Handle mouse movement
   */
  private handleMouseMove(event: MouseEvent): void {
    if (!this.settings.parallaxEnabled || this.settings.mode === 'flat') return;

    this.targetMouseX = (event.clientX / window.innerWidth) * 2 - 1;
    this.targetMouseY = (event.clientY / window.innerHeight) * 2 - 1;
  }

  /**
   * Handle window resize
   */
  private handleResize(): void {
    this.windowHeight = window.innerHeight;
    this.scanForElements(); // Rescan for new elements
  }

  /**
   * Handle scroll
   */
  private handleScroll(): void {
    this.scrollY = window.pageYOffset;
  }

  /**
   * Handle visibility change (pause when tab is hidden)
   */
  private handleVisibilityChange(): void {
    if (document.hidden) {
      this.stopAnimationLoop();
    } else {
      this.startAnimationLoop();
    }
  }

  /**
   * Handle device orientation change
   */
  private handleOrientationChange(event: DeviceOrientationEvent): void {
    if (!this.settings.deviceTiltEnabled || this.settings.mode === 'flat') return;

    // Normalize device orientation values
    this.deviceTilt = {
      x: Math.max(-30, Math.min(30, event.beta || 0)) / 30, // Forward/backward tilt
      y: Math.max(-30, Math.min(30, event.gamma || 0)) / 30, // Left/right tilt
      z: Math.max(-90, Math.min(90, event.alpha || 0)) / 90  // Rotation
    };
  }

  /**
   * Start animation loop
   */
  private startAnimationLoop(): void {
    if (this.rafId !== null) return;

    const animate = () => {
      this.updateParallax();
      this.rafId = requestAnimationFrame(animate);
    };

    this.rafId = requestAnimationFrame(animate);
  }

  /**
   * Stop animation loop
   */
  private stopAnimationLoop(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  /**
   * Update parallax effects
   */
  private updateParallax(): void {
    if (!this.settings.motionEnabled || this.settings.mode === 'flat') return;

    // Smooth mouse tracking with easing
    const easing = 0.1;
    this.mouseX += (this.targetMouseX - this.mouseX) * easing;
    this.mouseY += (this.targetMouseY - this.mouseY) * easing;

    // Update each parallax element
    this.elements.forEach(({ element, intensity, layer }) => {
      // Skip if element is not in view
      if (element.dataset.inView !== 'true') return;

      // Calculate transforms
      let transformX = 0;
      let transformY = 0;
      let transformZ = 0;
      let rotateX = 0;
      let rotateY = 0;

      // Mouse parallax
      if (this.settings.parallaxEnabled) {
        const mouseMultiplier = intensity * 20; // Base multiplier
        transformX += this.mouseX * mouseMultiplier;
        transformY += this.mouseY * mouseMultiplier * -0.5; // Reduced Y movement
        
        // Rotation based on mouse position
        rotateX += this.mouseY * intensity * -2;
        rotateY += this.mouseX * intensity * 2;
      }

      // Device tilt parallax (mobile)
      if (this.settings.deviceTiltEnabled) {
        const tiltMultiplier = intensity * 10;
        transformX += this.deviceTilt.y * tiltMultiplier;
        transformY += this.deviceTilt.x * tiltMultiplier;
        rotateX += this.deviceTilt.x * intensity * -1;
        rotateY += this.deviceTilt.y * intensity * 1;
      }

      // Scroll parallax
      const elementRect = element.getBoundingClientRect();
      const elementCenter = elementRect.top + elementRect.height / 2;
      const screenCenter = this.windowHeight / 2;
      const scrollOffset = (screenCenter - elementCenter) / this.windowHeight;
      
      transformY += scrollOffset * intensity * 30; // Scroll parallax
      transformZ += layer * 2; // Layer-based depth

      // Clamp values to prevent extreme transforms
      transformX = Math.max(-50, Math.min(50, transformX));
      transformY = Math.max(-50, Math.min(50, transformY));
      transformZ = Math.max(-100, Math.min(100, transformZ));
      rotateX = Math.max(-6, Math.min(6, rotateX));
      rotateY = Math.max(-6, Math.min(6, rotateY));

      // Apply transform
      const transform = `
        translate3d(${transformX}px, ${transformY}px, ${transformZ}px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
      `.trim().replace(/\s+/g, ' ');

      element.style.transform = transform;
    });
  }
}

// Global instance
let core3DInstance: Core3D | null = null;

/**
 * Initialize 3D system
 */
export function init3D(): Core3D {
  if (!core3DInstance) {
    core3DInstance = new Core3D();
  }
  
  core3DInstance.init();
  return core3DInstance;
}

/**
 * Get current 3D instance
 */
export function get3D(): Core3D | null {
  return core3DInstance;
}

/**
 * Destroy 3D system
 */
export function destroy3D(): void {
  if (core3DInstance) {
    core3DInstance.destroy();
    core3DInstance = null;
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init3D);
} else {
  init3D();
}

// Export instance for global access
declare global {
  interface Window {
    Core3D: {
      init: typeof init3D;
      get: typeof get3D;
      destroy: typeof destroy3D;
    };
  }
}

window.Core3D = {
  init: init3D,
  get: get3D,
  destroy: destroy3D
};