# 3D Integration Guide & Performance Checklist

## Quick Integration Steps

### 1. Import Enhanced CSS Files
Add to your `src/main.tsx` or main entry point:

```typescript
// After existing imports
import './styles/3d-tokens.css';      // ✅ Already exists
import './styles/3d-core.css';        // ✅ Already exists  
import './styles/tailwind-3d-utilities.css'; // 🆕 New utilities
```

### 2. Initialize Enhanced Systems
Add to your main App component:

```typescript
import { useEffect } from 'react';
import { init3D } from './scripts/3d-core';           // ✅ Already exists
import { initEnhancedParallax } from './scripts/enhanced-parallax'; // 🆕 Enhanced system

export default function App() {
  useEffect(() => {
    // Systems auto-initialize, but you can force init if needed
    init3D();
    initEnhancedParallax();
  }, []);
  
  return (
    // Your app content
  );
}
```

### 3. Add FlatModeToggle to Layout
```typescript
import FlatModeToggle from './components/FlatModeToggle';

// Add anywhere in your layout
<FlatModeToggle 
  position="fixed" 
  fixedPosition="bottom-right" 
  variant="icon"
/>
```

### 4. Update Components with 3D Classes

#### Before (Current):
```jsx
<div className="glass-card p-6">
  <h3>Feature Title</h3>
  <p>Description</p>
</div>
```

#### After (Enhanced):
```jsx
<Enhanced3DCard
  depth={2}
  hoverIntensity="medium"
  enableTilt={true}
  parallax={0.1}
  electric={false}
  glass="medium"
  shadow="md"
  className="p-6"
>
  <h3>Feature Title</h3>
  <p>Description</p>
</Enhanced3DCard>
```

## Component Migration Examples

### Hero Section Upgrade
```jsx
// Replace your hero section with this structure
<section className="scene scene-far relative min-h-screen" id="home">
  {/* Layer 0: Background */}
  <ThreeBackground effect="particles" theme="electric" intensity={0.6} />
  
  {/* Layer 2: Main content */}
  <div className="layer" data-depth="2">
    <Enhanced3DCard
      depth={2}
      hoverIntensity="medium" 
      electric={true}
      className="hero-card"
    >
      <h1 className="layer" data-depth="3">Your Title</h1>
      <p className="layer" data-depth="2">Your description</p>
      <div className="layer" data-depth="3">
        <Button className="btn-3d electric-bg">CTA Button</Button>
      </div>
    </Enhanced3DCard>
  </div>
</section>
```

### Navigation Enhancement
```jsx
// Add to your existing header
<header className="scene fixed top-0 layer" data-depth="4">
  <div className="glass-panel nav-3d py-4">
    {/* Your existing nav content with added classes */}
    <nav className="flex items-center gap-6">
      {navItems.map(item => (
        <button className="nav-3d text-sm px-3 py-2 focus-3d">
          {item.label}
        </button>
      ))}
    </nav>
  </div>
</header>
```

### Gallery Grid Enhancement
```jsx
<div className="gallery-3d grid md:grid-cols-2 lg:grid-cols-3 gap-6">
  {images.map((image, index) => (
    <Enhanced3DCard
      key={index}
      depth={1}
      hoverIntensity="medium"
      parallax={0.06 + index * 0.01}
      className="gallery-item-3d overflow-hidden"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <img 
        src={image.src}
        className="gallery-image"
        data-pointer-parallax={`${0.02 + index * 0.01}`}
      />
    </Enhanced3DCard>
  ))}
</div>
```

## Data Attributes for 3D System

Your existing `3d-core.ts` automatically scans for these attributes:

- `data-depth="0-5"` - Layer depth (automatic parallax)
- `data-parallax="0.1"` - Custom parallax intensity
- `data-pointer-parallax="0.05"` - Pointer-based parallax
- `data-scroll-parallax="0.5"` - Scroll-based parallax
- `data-scroll-direction="vertical|horizontal|both"` - Scroll direction
- `data-3d-mode="flat"` - Force flat mode for element

## CSS Class Reference

### Core 3D Classes (Already Available)
- `scene` - Enable 3D perspective container
- `layer` - 3D layer with automatic transform-style  
- `tilt-hover`, `tilt-hover-md`, `tilt-hover-lg` - Hover tilt effects
- `card-3d`, `card-3d-electric` - 3D card effects
- `btn-3d` - 3D button effects
- `nav-3d` - 3D navigation effects
- `shadow-layered-sm/md/lg/xl` - Layered shadow system
- `glass-3d` - Glass morphism with 3D lighting

### New Tailwind Utilities
- `depth-0` to `depth-5` - Layer depth presets
- `hover-lift`, `hover-lift-md` - Lift on hover
- `hover-tilt`, `hover-tilt-md` - Tilt on hover  
- `press-down`, `press-down-md` - Press depth effects
- `shadow-float`, `shadow-electric` - Shadow combinations
- `glass-subtle/medium/strong` - Glass morphism levels
- `motion-spring/smooth/snappy` - Animation presets
- `gpu-boost` - GPU acceleration helpers

## Performance Checklist

### ✅ Performance Optimizations (Already Implemented)
- [x] GPU acceleration with `transform3d()` and `translateZ(0)`
- [x] Intersection Observer for viewport culling
- [x] `will-change: transform` on 3D elements
- [x] RequestAnimationFrame for smooth animations
- [x] Visibility API to pause when hidden
- [x] Smooth easing with optimized timing functions
- [x] Transform clamping to prevent extreme values
- [x] Automatic cleanup on component unmount

### ✅ Accessibility Features (Already Implemented)
- [x] `prefers-reduced-motion` support
- [x] Flat mode toggle for accessibility
- [x] High contrast mode adjustments
- [x] Focus-visible indicators with 3D depth
- [x] ARIA labels and screen reader support
- [x] Keyboard navigation preserved

### ✅ Browser Compatibility (Already Implemented)  
- [x] WebGL feature detection with fallback
- [x] CSS `backdrop-filter` fallback
- [x] Mobile-optimized transform ranges
- [x] Cross-browser perspective handling
- [x] Safari-specific WebKit prefixes

## Monitoring & Debugging

### Performance Monitoring
```javascript
// Add to console to monitor 3D performance
const observer = new PerformanceObserver((list) => {
  list.getEntries().forEach(entry => {
    if (entry.name.includes('3d') || entry.name.includes('transform')) {
      console.log(`3D Performance: ${entry.name} took ${entry.duration}ms`);
    }
  });
});
observer.observe({entryTypes: ['measure']});
```

### Debug 3D System
```javascript
// Check 3D system status
console.log('3D Core:', window.Core3D?.get());
console.log('3D Mode:', document.documentElement.dataset['3dMode']);
console.log('Reduced Motion:', window.matchMedia('(prefers-reduced-motion: reduce)').matches);
```

## Bundle Size Impact

**Estimated additions:**
- Enhanced CSS utilities: ~3KB gzipped
- Enhanced parallax system: ~2KB gzipped  
- React components: ~4KB gzipped
- **Total added:** ~9KB gzipped

Your existing 3D system is already comprehensive and optimized!

## Troubleshooting

### Common Issues
1. **3D effects not working**: Check `data-3d-mode` attribute isn't set to "flat"
2. **Performance issues**: Ensure GPU acceleration classes are applied
3. **Mobile performance**: Mobile ranges automatically reduced via CSS media queries
4. **Accessibility complaints**: Flat mode toggle should be easily accessible

### Browser Developer Tools
- Use Chrome DevTools > Rendering > "Highlight layers" to see 3D layers
- Monitor FPS with Performance tab
- Check GPU usage in Chrome DevTools > More Tools > Task Manager