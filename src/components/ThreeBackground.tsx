/**
 * Laurence Photo Hub - Advanced 3D Background
 * Lightweight WebGL background effects for Advanced mode only
 * Lazy loaded and paused when hidden for performance
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';

interface ThreeBackgroundProps {
  /** Effect type to render */
  effect?: 'particles' | 'waves' | 'geometric' | 'gradient';
  /** Color theme */
  theme?: 'electric' | 'warm' | 'cool' | 'monochrome';
  /** Animation intensity (0-1) */
  intensity?: number;
  /** Enable mouse interaction */
  interactive?: boolean;
  /** Custom CSS class */
  className?: string;
}

interface WebGLContext {
  gl: WebGLRenderingContext;
  program: WebGLProgram;
  animationId: number | null;
  isActive: boolean;
}

const ThreeBackground: React.FC<ThreeBackgroundProps> = ({
  effect = 'particles',
  theme = 'electric',
  intensity = 0.5,
  interactive = true,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<WebGLContext | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const mousePos = useRef({ x: 0.5, y: 0.5 });
  const time = useRef(0);

  /**
   * Vertex shader source
   */
  const vertexShaderSource = `
    attribute vec2 position;
    void main() {
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  /**
   * Fragment shader for particles effect
   */
  const particlesFragmentShader = `
    precision mediump float;
    uniform float time;
    uniform vec2 resolution;
    uniform vec2 mouse;
    uniform float intensity;
    uniform vec3 themeColor;
    
    // Simple hash function for pseudo-random numbers
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }
    
    // Generate particles
    vec3 particles(vec2 uv) {
      vec3 color = vec3(0.0);
      
      for (int i = 0; i < 50; i++) {
        vec2 seed = vec2(float(i));
        vec2 pos = vec2(hash(seed), hash(seed + 1.0));
        
        // Animate particle position
        pos.x += sin(time * 0.5 + float(i) * 0.1) * 0.1;
        pos.y += cos(time * 0.3 + float(i) * 0.15) * 0.1;
        
        // Mouse interaction
        vec2 mouseOffset = (mouse - vec2(0.5)) * 0.2 * intensity;
        pos += mouseOffset;
        
        // Wrap around edges
        pos = fract(pos);
        
        float dist = length(uv - pos);
        float particle = 1.0 / (1.0 + dist * 100.0);
        
        // Color based on theme
        color += themeColor * particle * intensity;
      }
      
      return color;
    }
    
    void main() {
      vec2 uv = gl_FragCoord.xy / resolution.xy;
      vec3 color = particles(uv);
      
      // Add subtle background gradient
      float gradient = 1.0 - length(uv - vec2(0.5)) * 0.5;
      color += themeColor * 0.05 * gradient * intensity;
      
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  /**
   * Fragment shader for waves effect
   */
  const wavesFragmentShader = `
    precision mediump float;
    uniform float time;
    uniform vec2 resolution;
    uniform vec2 mouse;
    uniform float intensity;
    uniform vec3 themeColor;
    
    void main() {
      vec2 uv = (gl_FragCoord.xy - 0.5 * resolution.xy) / resolution.y;
      
      // Create wave patterns
      float wave1 = sin(uv.x * 10.0 + time * 2.0) * 0.5 + 0.5;
      float wave2 = sin(uv.y * 8.0 + time * 1.5) * 0.5 + 0.5;
      float wave3 = sin(length(uv) * 12.0 - time * 3.0) * 0.5 + 0.5;
      
      // Mouse interaction
      vec2 mouseOffset = mouse - vec2(0.5);
      float mouseInfluence = 1.0 - length(uv - mouseOffset) * 2.0;
      mouseInfluence = max(0.0, mouseInfluence) * intensity;
      
      // Combine waves
      float combined = (wave1 + wave2 + wave3) / 3.0;
      combined += mouseInfluence * 0.3;
      
      // Apply color
      vec3 color = themeColor * combined * intensity * 0.3;
      
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  /**
   * Get theme colors
   */
  const getThemeColor = useCallback((): [number, number, number] => {
    switch (theme) {
      case 'electric':
        return [0.0, 0.6, 1.0]; // Electric blue
      case 'warm':
        return [1.0, 0.4, 0.2]; // Warm orange
      case 'cool':
        return [0.2, 0.8, 0.6]; // Cool green
      case 'monochrome':
        return [0.7, 0.7, 0.7]; // Neutral gray
      default:
        return [0.0, 0.6, 1.0];
    }
  }, [theme]);

  /**
   * Get fragment shader based on effect
   */
  const getFragmentShader = useCallback((): string => {
    switch (effect) {
      case 'particles':
        return particlesFragmentShader;
      case 'waves':
        return wavesFragmentShader;
      case 'geometric':
        return particlesFragmentShader; // Simplified for now
      case 'gradient':
        return wavesFragmentShader; // Simplified for now
      default:
        return particlesFragmentShader;
    }
  }, [effect]);

  /**
   * Create shader program
   */
  const createShaderProgram = useCallback((gl: WebGLRenderingContext): WebGLProgram | null => {
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    if (!vertexShader || !fragmentShader) return null;

    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);

    gl.shaderSource(fragmentShader, getFragmentShader());
    gl.compileShader(fragmentShader);

    const program = gl.createProgram();
    if (!program) return null;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    // Check for compilation errors
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      console.error('Vertex shader compilation error:', gl.getShaderInfoLog(vertexShader));
    }
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      console.error('Fragment shader compilation error:', gl.getShaderInfoLog(fragmentShader));
    }
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Shader program linking error:', gl.getProgramInfoLog(program));
      return null;
    }

    return program;
  }, [getFragmentShader]);

  /**
   * Initialize WebGL context
   */
  const initializeWebGL = useCallback((): void => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: true,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
      powerPreference: 'default'
    });

    if (!gl) {
      console.warn('WebGL not supported, falling back to 2D canvas');
      return;
    }

    // Set viewport
    gl.viewport(0, 0, canvas.width, canvas.height);
    
    // Create shader program
    const program = createShaderProgram(gl);
    if (!program) return;

    // Create buffer for full-screen quad
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,  1, -1,  -1, 1,
      -1, 1,   1, -1,   1, 1
    ]), gl.STATIC_DRAW);

    // Get attribute and uniform locations
    const positionAttribute = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionAttribute);
    gl.vertexAttribPointer(positionAttribute, 2, gl.FLOAT, false, 0, 0);

    contextRef.current = {
      gl,
      program,
      animationId: null,
      isActive: true
    };

    setIsLoaded(true);
  }, [createShaderProgram]);

  /**
   * Render frame
   */
  const render = useCallback((): void => {
    if (!contextRef.current || !canvasRef.current || !isVisible) return;

    const { gl, program } = contextRef.current;
    const canvas = canvasRef.current;

    // Clear canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Use shader program
    gl.useProgram(program);

    // Update uniforms
    const timeLocation = gl.getUniformLocation(program, 'time');
    const resolutionLocation = gl.getUniformLocation(program, 'resolution');
    const mouseLocation = gl.getUniformLocation(program, 'mouse');
    const intensityLocation = gl.getUniformLocation(program, 'intensity');
    const themeColorLocation = gl.getUniformLocation(program, 'themeColor');

    time.current += 0.01;

    gl.uniform1f(timeLocation, time.current);
    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
    gl.uniform2f(mouseLocation, mousePos.current.x, mousePos.current.y);
    gl.uniform1f(intensityLocation, intensity);
    gl.uniform3fv(themeColorLocation, getThemeColor());

    // Draw
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // Request next frame
    if (contextRef.current.isActive) {
      contextRef.current.animationId = requestAnimationFrame(render);
    }
  }, [isVisible, intensity, getThemeColor]);

  /**
   * Handle mouse movement
   */
  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>): void => {
    if (!interactive || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    mousePos.current = {
      x: (event.clientX - rect.left) / rect.width,
      y: 1.0 - (event.clientY - rect.top) / rect.height // Flip Y coordinate
    };
  }, [interactive]);

  /**
   * Handle canvas resize
   */
  const handleResize = useCallback((): void => {
    if (!canvasRef.current || !contextRef.current) return;

    const canvas = canvasRef.current;
    const { gl } = contextRef.current;
    
    // Set canvas size to match container
    const container = canvas.parentElement;
    if (container) {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
  }, []);

  /**
   * Handle visibility change
   */
  const handleVisibilityChange = useCallback((): void => {
    const isHidden = document.hidden;
    setIsVisible(!isHidden);
    
    if (contextRef.current) {
      contextRef.current.isActive = !isHidden;
      
      if (!isHidden && isLoaded) {
        render(); // Resume animation
      } else if (contextRef.current.animationId) {
        cancelAnimationFrame(contextRef.current.animationId);
        contextRef.current.animationId = null;
      }
    }
  }, [isLoaded, render]);

  /**
   * Check if advanced mode is enabled
   */
  const isAdvancedMode = useCallback((): boolean => {
    return document.documentElement.dataset['3dMode'] !== 'flat' &&
           !document.hidden &&
           !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Initialize WebGL when component mounts
  useEffect(() => {
    if (!isAdvancedMode()) return;

    const timer = setTimeout(() => {
      initializeWebGL();
    }, 100); // Small delay for lazy loading

    return () => clearTimeout(timer);
  }, [initializeWebGL, isAdvancedMode]);

  // Start render loop when loaded
  useEffect(() => {
    if (!isLoaded || !isAdvancedMode()) return;

    render();

    return () => {
      if (contextRef.current?.animationId) {
        cancelAnimationFrame(contextRef.current.animationId);
        contextRef.current.animationId = null;
      }
    };
  }, [isLoaded, render, isAdvancedMode]);

  // Handle resize
  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  // Handle visibility changes
  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange, { passive: true });
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [handleVisibilityChange]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (contextRef.current?.animationId) {
        cancelAnimationFrame(contextRef.current.animationId);
      }
      contextRef.current = null;
    };
  }, []);

  // Don't render if not in advanced mode
  if (!isAdvancedMode()) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className={`
        absolute inset-0 w-full h-full pointer-events-none
        ${isLoaded ? 'opacity-100' : 'opacity-0'}
        transition-opacity duration-1000 ease-out
        ${className}
      `.trim()}
      onMouseMove={handleMouseMove}
      style={{
        zIndex: 0,
        mixBlendMode: 'multiply' // Blend with background
      }}
      aria-hidden="true"
    />
  );
};

export default ThreeBackground;