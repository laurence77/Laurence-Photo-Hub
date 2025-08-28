# 3D Enhancement Migration Plan

## Phase 1: Systematic Layer Implementation

### Hero Section Multi-Layer Depth
```
Layer 0 (Background): Hero image/ThreeBackground 
Layer 1 (Mid-ground): Decorative elements, floating graphics
Layer 2 (Foreground): Main content card (glass-card hero-card)
Layer 3 (UI Elements): Call-to-action buttons, camera badge
Layer 4 (Navigation): Floating navbar
```

### DOM Structure Updates

#### Before:
```html
<section className="hero-section">
  <div className="hero-content">
    <h1>Title</h1>
    <p>Description</p>
    <button>CTA</button>
  </div>
</section>
```

#### After:
```html
<section className="scene scene-far hero-section" data-parallax="0.1">
  <!-- Layer 0: Background -->
  <ThreeBackground effect="particles" theme="electric" />
  
  <!-- Layer 1: Decorative elements -->
  <div className="layer" data-depth="1" data-parallax="0.2">
    {/* Floating design elements */}
  </div>
  
  <!-- Layer 2: Main content -->
  <div className="layer card-3d-electric" data-depth="2">
    <div className="glass-card hero-card">
      <h1 className="layer" data-depth="3">Title</h1>
      <p className="layer" data-depth="2">Description</p>
    </div>
  </div>
  
  <!-- Layer 3: Interactive elements -->
  <div className="layer" data-depth="3">
    <button className="btn-3d electric-bg">CTA</button>
  </div>
</section>
```

## Phase 2: Component-Specific Implementations

### Navigation Bar (Floating 3D)
- Add `nav-3d` class to navigation elements
- Use `data-depth="4"` for navbar container
- Apply `shadow-layered-md` for floating effect

### Feature Cards
- Convert to `card-3d-electric` class
- Add `tilt-hover-md` for interaction
- Use `shadow-layered-lg` for depth

### Gallery Grid
- Apply `gallery-3d` to container
- Use `gallery-item-3d` for individual images
- Implement staggered animation delays

### Modal/Dialog Components
- Use `data-depth="5"` for maximum elevation
- Apply `shadow-layered-xl` for popup effects
- Add `glass-3d` for enhanced depth perception

## Phase 3: Performance Integration

### Automatic Initialization
Your `3d-core.ts` already auto-initializes. Ensure components use:
- `data-parallax="intensity"` for parallax effects
- `data-depth="layer"` for systematic layering
- `data-in-view` optimization is already handled

### Conditional Loading
```typescript
// Three.js background loads only in advanced mode
const shouldLoadAdvanced = !document.hidden && 
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
  document.documentElement.dataset['3dMode'] !== 'flat';
```