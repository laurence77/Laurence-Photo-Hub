import React, { useState, useEffect, useRef } from 'react';
import { Hand, Eye, RotateCcw, ZoomIn, ZoomOut, Move, Play, Pause } from 'lucide-react';

interface GestureNavigationProps {
  photos: Array<{
    id: string;
    url: string;
    title?: string;
  }>;
  onNavigate?: (photoId: string) => void;
  onZoom?: (scale: number) => void;
  onRotate?: (degrees: number) => void;
  onCommand?: (command: string, params?: any) => void;
  isVRMode?: boolean;
}

interface HandGesture {
  type: 'swipe' | 'pinch' | 'rotate' | 'point' | 'fist' | 'palm' | 'thumbsUp';
  confidence: number;
  position?: { x: number; y: number };
  scale?: number;
  rotation?: number;
}

export function GestureNavigation({ 
  photos, 
  onNavigate, 
  onZoom, 
  onRotate, 
  onCommand,
  isVRMode = false 
}: GestureNavigationProps) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [currentGesture, setCurrentGesture] = useState<HandGesture | null>(null);
  const [gestureHistory, setGestureHistory] = useState<HandGesture[]>([]);
  const [eyeTracking, setEyeTracking] = useState(false);
  const [gazePosition, setGazePosition] = useState({ x: 0, y: 0 });
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotationAngle, setRotationAngle] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const lastGestureRef = useRef<HandGesture | null>(null);
  const gestureTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isEnabled) {
      initializeCamera();
      if (isVRMode) {
        initializeVRGestures();
      }
    } else {
      cleanup();
    }

    return () => cleanup();
  }, [isEnabled, isVRMode]);

  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user'
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        startGestureDetection();
      }
    } catch (error) {
      console.error('Failed to access camera:', error);
    }
  };

  const initializeVRGestures = async () => {
    if ('xr' in navigator) {
      try {
        // @ts-ignore - WebXR types
        const session = await navigator.xr.requestSession('immersive-vr', {
          requiredFeatures: ['hand-tracking']
        });
        
        session.addEventListener('inputsourceschange', handleXRInputChange);
        startXRFrameLoop(session);
      } catch (error) {
        console.warn('WebXR hand tracking not available:', error);
      }
    }
  };

  const startGestureDetection = () => {
    const detectGestures = () => {
      if (!videoRef.current || !canvasRef.current) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const gesture = processImageForGestures(imageData);
      
      if (gesture) {
        handleGesture(gesture);
      }

      animationRef.current = requestAnimationFrame(detectGestures);
    };

    detectGestures();
  };

  const processImageForGestures = (imageData: ImageData): HandGesture | null => {
    // Simplified gesture recognition - in production, use TensorFlow.js or MediaPipe
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;

    // Detect hand regions using basic color analysis
    let handPixels = 0;
    let handCenterX = 0;
    let handCenterY = 0;
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Simple skin detection
      if (r > 95 && g > 40 && b > 20 && 
          Math.max(r, g, b) - Math.min(r, g, b) > 15 &&
          Math.abs(r - g) > 15 && r > g && r > b) {
        handPixels++;
        const pixelIndex = i / 4;
        handCenterX += pixelIndex % width;
        handCenterY += Math.floor(pixelIndex / width);
      }
    }

    if (handPixels < 100) return null; // Not enough hand pixels

    handCenterX /= handPixels;
    handCenterY /= handPixels;

    // Analyze gesture based on hand position and movement
    const gesture = analyzeHandGesture(handCenterX, handCenterY, handPixels);
    return gesture;
  };

  const analyzeHandGesture = (x: number, y: number, pixelCount: number): HandGesture | null => {
    const lastGesture = lastGestureRef.current;
    const currentTime = Date.now();
    
    // Swipe detection
    if (lastGesture && lastGesture.position) {
      const deltaX = x - lastGesture.position.x;
      const deltaY = y - lastGesture.position.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      if (distance > 100) { // Minimum swipe distance
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          return {
            type: 'swipe',
            confidence: Math.min(distance / 200, 1),
            position: { x, y }
          };
        }
      }
    }

    // Pinch detection (based on hand size change)
    if (lastGesture && Math.abs(pixelCount - (lastGesture.scale || pixelCount)) > 50) {
      const scaleChange = pixelCount / (lastGesture.scale || pixelCount);
      return {
        type: 'pinch',
        confidence: 0.8,
        position: { x, y },
        scale: scaleChange
      };
    }

    // Point gesture (small concentrated area)
    if (pixelCount < 200) {
      return {
        type: 'point',
        confidence: 0.7,
        position: { x, y }
      };
    }

    // Palm gesture (large spread area)
    if (pixelCount > 800) {
      return {
        type: 'palm',
        confidence: 0.8,
        position: { x, y }
      };
    }

    return {
      type: 'fist',
      confidence: 0.6,
      position: { x, y },
      scale: pixelCount
    };
  };

  const handleXRInputChange = (event: any) => {
    // Handle WebXR hand tracking input
    const session = event.session;
    const inputSources = session.inputSources;
    
    for (const inputSource of inputSources) {
      if (inputSource.hand) {
        processXRHandGesture(inputSource.hand);
      }
    }
  };

  const startXRFrameLoop = (session: any) => {
    const frameLoop = (time: number, frame: any) => {
      const inputSources = session.inputSources;
      
      for (const inputSource of inputSources) {
        if (inputSource.hand) {
          const handGesture = processXRHandGesture(inputSource.hand);
          if (handGesture) {
            handleGesture(handGesture);
          }
        }
      }
      
      session.requestAnimationFrame(frameLoop);
    };
    
    session.requestAnimationFrame(frameLoop);
  };

  const processXRHandGesture = (hand: any): HandGesture | null => {
    // Process WebXR hand tracking data
    const joints = hand.joints;
    const indexTip = joints['index-finger-tip'];
    const thumbTip = joints['thumb-tip'];
    const wrist = joints['wrist'];
    
    if (!indexTip || !thumbTip || !wrist) return null;

    // Calculate pinch distance
    const pinchDistance = Math.sqrt(
      Math.pow(indexTip.transform.position.x - thumbTip.transform.position.x, 2) +
      Math.pow(indexTip.transform.position.y - thumbTip.transform.position.y, 2) +
      Math.pow(indexTip.transform.position.z - thumbTip.transform.position.z, 2)
    );

    if (pinchDistance < 0.03) { // 3cm threshold
      return {
        type: 'pinch',
        confidence: 0.9,
        position: {
          x: indexTip.transform.position.x,
          y: indexTip.transform.position.y
        }
      };
    }

    // Pointing gesture
    if (indexTip.transform.position.y > wrist.transform.position.y + 0.1) {
      return {
        type: 'point',
        confidence: 0.8,
        position: {
          x: indexTip.transform.position.x,
          y: indexTip.transform.position.y
        }
      };
    }

    return null;
  };

  const handleGesture = (gesture: HandGesture) => {
    setCurrentGesture(gesture);
    setGestureHistory(prev => [...prev.slice(-9), gesture]);
    
    // Clear gesture timeout
    if (gestureTimeoutRef.current) {
      clearTimeout(gestureTimeoutRef.current);
    }

    // Execute gesture command
    switch (gesture.type) {
      case 'swipe':
        if (gesture.position && lastGestureRef.current?.position) {
          const deltaX = gesture.position.x - lastGestureRef.current.position.x;
          if (deltaX > 50) {
            navigatePrevious();
          } else if (deltaX < -50) {
            navigateNext();
          }
        }
        break;
        
      case 'pinch':
        if (gesture.scale) {
          const newZoom = Math.max(0.5, Math.min(3, zoomLevel * gesture.scale));
          setZoomLevel(newZoom);
          onZoom?.(newZoom);
        }
        break;
        
      case 'rotate':
        if (gesture.rotation) {
          const newRotation = (rotationAngle + gesture.rotation) % 360;
          setRotationAngle(newRotation);
          onRotate?.(newRotation);
        }
        break;
        
      case 'point':
        // Eye tracking calibration or selection
        if (eyeTracking && gesture.position) {
          setGazePosition(gesture.position);
        }
        break;
        
      case 'palm':
        // Stop/pause command
        onCommand?.('pause');
        break;
        
      case 'thumbsUp':
        // Start slideshow
        onCommand?.('startSlideshow');
        break;
        
      case 'fist':
        // Reset view
        setZoomLevel(1);
        setRotationAngle(0);
        onZoom?.(1);
        onRotate?.(0);
        break;
    }

    lastGestureRef.current = gesture;
    
    // Clear gesture after 2 seconds
    gestureTimeoutRef.current = setTimeout(() => {
      setCurrentGesture(null);
    }, 2000);
  };

  const navigateNext = () => {
    const nextIndex = Math.min(currentPhotoIndex + 1, photos.length - 1);
    setCurrentPhotoIndex(nextIndex);
    onNavigate?.(photos[nextIndex].id);
  };

  const navigatePrevious = () => {
    const prevIndex = Math.max(currentPhotoIndex - 1, 0);
    setCurrentPhotoIndex(prevIndex);
    onNavigate?.(photos[prevIndex].id);
  };

  const cleanup = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    if (gestureTimeoutRef.current) {
      clearTimeout(gestureTimeoutRef.current);
    }
  };

  const toggleGestureControl = () => {
    setIsEnabled(!isEnabled);
  };

  const toggleEyeTracking = () => {
    setEyeTracking(!eyeTracking);
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Gesture Navigation</h3>
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleEyeTracking}
            className={`p-2 rounded-xl transition-colors ${
              eyeTracking 
                ? 'bg-purple-500/20 text-purple-400' 
                : 'bg-gray-500/20 text-gray-400'
            }`}
            title="Toggle Eye Tracking"
          >
            <Eye size={20} />
          </button>
          <button
            onClick={toggleGestureControl}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-colors ${
              isEnabled
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
            }`}
          >
            <Hand size={18} />
            <span>{isEnabled ? 'Stop Gestures' : 'Start Gestures'}</span>
          </button>
        </div>
      </div>

      {isEnabled && (
        <div className="space-y-6">
          {/* Camera Feed (Hidden in VR mode) */}
          {!isVRMode && (
            <div className="relative">
              <video
                ref={videoRef}
                className="w-full h-48 object-cover rounded-xl bg-black/20"
                muted
                playsInline
              />
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full opacity-0"
              />
              {currentGesture && (
                <div className="absolute top-4 left-4 bg-black/60 rounded-lg px-3 py-2">
                  <p className="text-white text-sm font-medium capitalize">
                    {currentGesture.type}
                  </p>
                  <p className="text-gray-300 text-xs">
                    {Math.round(currentGesture.confidence * 100)}% confident
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Current Status */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-black/20 rounded-xl p-4 text-center">
              <ZoomIn className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <p className="text-sm text-gray-300">Zoom</p>
              <p className="text-lg font-semibold text-white">{zoomLevel.toFixed(1)}x</p>
            </div>
            <div className="bg-black/20 rounded-xl p-4 text-center">
              <RotateCcw className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <p className="text-sm text-gray-300">Rotation</p>
              <p className="text-lg font-semibold text-white">{rotationAngle}°</p>
            </div>
            <div className="bg-black/20 rounded-xl p-4 text-center">
              <Move className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <p className="text-sm text-gray-300">Photo</p>
              <p className="text-lg font-semibold text-white">{currentPhotoIndex + 1}/{photos.length}</p>
            </div>
            <div className="bg-black/20 rounded-xl p-4 text-center">
              <Hand className="w-6 h-6 text-orange-400 mx-auto mb-2" />
              <p className="text-sm text-gray-300">Gesture</p>
              <p className="text-lg font-semibold text-white capitalize">
                {currentGesture?.type || 'None'}
              </p>
            </div>
          </div>

          {/* Gesture History */}
          {gestureHistory.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-300">Recent Gestures:</h4>
              <div className="flex space-x-2 overflow-x-auto">
                {gestureHistory.map((gesture, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 bg-black/20 rounded-lg px-3 py-2"
                  >
                    <p className="text-xs text-white capitalize">{gesture.type}</p>
                    <p className="text-xs text-gray-400">
                      {Math.round(gesture.confidence * 100)}%
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Gesture Guide */}
      <div className="mt-6 space-y-3">
        <h4 className="text-sm font-medium text-gray-300">Gesture Commands:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-400">
          <div className="space-y-1">
            <p>👉 <strong>Point:</strong> Select/calibrate</p>
            <p>👍 <strong>Thumbs up:</strong> Start slideshow</p>
            <p>✋ <strong>Palm:</strong> Pause/stop</p>
          </div>
          <div className="space-y-1">
            <p>👆 <strong>Swipe:</strong> Navigate photos</p>
            <p>🤏 <strong>Pinch:</strong> Zoom in/out</p>
            <p>✊ <strong>Fist:</strong> Reset view</p>
          </div>
        </div>
      </div>

      {isVRMode && (
        <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl">
          <p className="text-sm text-purple-300">
            <strong>VR Mode Active:</strong> Using WebXR hand tracking for precise gesture recognition.
          </p>
        </div>
      )}
    </div>
  );
}