import React, { useState, useRef } from 'react';
import { Upload, Play, Pause, RotateCcw, Download, Wand2, Image, Video } from 'lucide-react';

interface LivePhoto {
  id: string;
  stillImage: File;
  motionVideo: File;
  duration: number;
  thumbnail: string;
  metadata: {
    device?: string;
    timestamp?: Date;
    location?: { lat: number; lng: number };
    orientation?: number;
  };
}

interface MotionPhoto {
  id: string;
  combinedFile: File;
  stillOffset: number;
  videoOffset: number;
  duration: number;
  thumbnail: string;
  metadata: {
    device?: string;
    timestamp?: Date;
    location?: { lat: number; lng: number };
  };
}

export function LivePhotosImport() {
  const [livePhotos, setLivePhotos] = useState<LivePhoto[]>([]);
  const [motionPhotos, setMotionPhotos] = useState<MotionPhoto[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'live' | 'motion'>('live');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement }>({});

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    setIsProcessing(true);

    try {
      // Separate Live Photos and Motion Photos
      const livePhotoFiles = files.filter(file => 
        file.name.toLowerCase().includes('heic') || 
        file.name.toLowerCase().includes('mov') ||
        file.type === 'image/heif'
      );
      
      const motionPhotoFiles = files.filter(file =>
        file.name.toLowerCase().includes('mvimg') ||
        file.type === 'image/jpeg'
      );

      // Process Apple Live Photos
      if (livePhotoFiles.length > 0) {
        const processedLivePhotos = await processLivePhotos(livePhotoFiles);
        setLivePhotos(prev => [...prev, ...processedLivePhotos]);
      }

      // Process Google Motion Photos
      if (motionPhotoFiles.length > 0) {
        const processedMotionPhotos = await processMotionPhotos(motionPhotoFiles);
        setMotionPhotos(prev => [...prev, ...processedMotionPhotos]);
      }
    } catch (error) {
      console.error('Error processing photos:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const processLivePhotos = async (files: File[]): Promise<LivePhoto[]> => {
    const livePhotos: LivePhoto[] = [];
    
    // Group files by base name (Live Photos come as pairs: .HEIC + .MOV)
    const fileGroups: { [key: string]: { heic?: File; mov?: File } } = {};
    
    files.forEach(file => {
      const baseName = file.name.replace(/\.(heic|mov)$/i, '');
      if (!fileGroups[baseName]) {
        fileGroups[baseName] = {};
      }
      
      if (file.type.includes('image') || file.name.toLowerCase().endsWith('.heic')) {
        fileGroups[baseName].heic = file;
      } else if (file.type.includes('video') || file.name.toLowerCase().endsWith('.mov')) {
        fileGroups[baseName].mov = file;
      }
    });

    // Process each complete Live Photo pair
    for (const [baseName, group] of Object.entries(fileGroups)) {
      if (group.heic && group.mov) {
        const livePhoto = await createLivePhoto(baseName, group.heic, group.mov);
        livePhotos.push(livePhoto);
      }
    }

    return livePhotos;
  };

  const createLivePhoto = async (id: string, stillImage: File, motionVideo: File): Promise<LivePhoto> => {
    // Extract metadata from EXIF
    const metadata = await extractMetadata(stillImage);
    
    // Generate thumbnail
    const thumbnail = await generateThumbnail(stillImage);
    
    // Get video duration
    const duration = await getVideoDuration(motionVideo);

    return {
      id,
      stillImage,
      motionVideo,
      duration,
      thumbnail,
      metadata
    };
  };

  const processMotionPhotos = async (files: File[]): Promise<MotionPhoto[]> => {
    const motionPhotos: MotionPhoto[] = [];
    
    for (const file of files) {
      try {
        const motionPhoto = await extractMotionPhoto(file);
        motionPhotos.push(motionPhoto);
      } catch (error) {
        console.warn('Failed to process motion photo:', file.name, error);
      }
    }

    return motionPhotos;
  };

  const extractMotionPhoto = async (file: File): Promise<MotionPhoto> => {
    // Google Motion Photos embed video data in JPEG files
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    
    // Look for embedded MP4 data (starts with 'ftyp')
    let videoOffset = -1;
    const ftypSignature = [0x66, 0x74, 0x79, 0x70]; // 'ftyp'
    
    for (let i = 0; i < bytes.length - 4; i++) {
      if (bytes[i] === ftypSignature[0] &&
          bytes[i + 1] === ftypSignature[1] &&
          bytes[i + 2] === ftypSignature[2] &&
          bytes[i + 3] === ftypSignature[3]) {
        videoOffset = i - 4; // Include size bytes
        break;
      }
    }

    if (videoOffset === -1) {
      throw new Error('No embedded video found in motion photo');
    }

    // Find JPEG end marker (0xFF 0xD9)
    let stillOffset = -1;
    for (let i = 0; i < videoOffset; i++) {
      if (bytes[i] === 0xFF && bytes[i + 1] === 0xD9) {
        stillOffset = i + 2;
        break;
      }
    }

    const thumbnail = await generateThumbnail(file);
    const metadata = await extractMetadata(file);
    
    // Estimate duration from video data (simplified)
    const duration = 3; // Default duration for motion photos

    return {
      id: file.name,
      combinedFile: file,
      stillOffset,
      videoOffset,
      duration,
      thumbnail,
      metadata
    };
  };

  const extractMetadata = async (file: File): Promise<any> => {
    return new Promise((resolve) => {
      // Simplified metadata extraction
      // In production, use libraries like exif-js or piexifjs
      resolve({
        device: 'Unknown Device',
        timestamp: new Date(file.lastModified),
        orientation: 1
      });
    });
  };

  const generateThumbnail = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = 150;
        canvas.height = 150;
        ctx?.drawImage(img, 0, 0, 150, 150);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const getVideoDuration = async (videoFile: File): Promise<number> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.onloadedmetadata = () => {
        resolve(video.duration);
        URL.revokeObjectURL(video.src);
      };
      video.src = URL.createObjectURL(videoFile);
    });
  };

  const playLivePhoto = (id: string, type: 'live' | 'motion') => {
    if (playingId === id) {
      setPlayingId(null);
      return;
    }

    setPlayingId(id);
    
    if (type === 'live') {
      const livePhoto = livePhotos.find(p => p.id === id);
      if (livePhoto) {
        playLivePhotoAnimation(livePhoto);
      }
    } else {
      const motionPhoto = motionPhotos.find(p => p.id === id);
      if (motionPhoto) {
        playMotionPhotoAnimation(motionPhoto);
      }
    }
  };

  const playLivePhotoAnimation = async (livePhoto: LivePhoto) => {
    const videoElement = videoRefs.current[livePhoto.id];
    if (!videoElement) return;

    try {
      videoElement.src = URL.createObjectURL(livePhoto.motionVideo);
      await videoElement.play();
      
      videoElement.onended = () => {
        setPlayingId(null);
        URL.revokeObjectURL(videoElement.src);
      };
    } catch (error) {
      console.error('Failed to play Live Photo:', error);
      setPlayingId(null);
    }
  };

  const playMotionPhotoAnimation = async (motionPhoto: MotionPhoto) => {
    try {
      // Extract video portion from combined file
      const arrayBuffer = await motionPhoto.combinedFile.arrayBuffer();
      const videoBytes = arrayBuffer.slice(motionPhoto.videoOffset);
      const videoBlob = new Blob([videoBytes], { type: 'video/mp4' });
      
      const videoElement = videoRefs.current[motionPhoto.id];
      if (!videoElement) return;

      videoElement.src = URL.createObjectURL(videoBlob);
      await videoElement.play();
      
      videoElement.onended = () => {
        setPlayingId(null);
        URL.revokeObjectURL(videoElement.src);
      };
    } catch (error) {
      console.error('Failed to play Motion Photo:', error);
      setPlayingId(null);
    }
  };

  const exportAsGIF = async (photo: LivePhoto | MotionPhoto, type: 'live' | 'motion') => {
    setIsProcessing(true);
    
    try {
      // This would typically use a library like gif.js to create animated GIFs
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create download link
      const link = document.createElement('a');
      link.href = '#'; // Would be actual GIF blob URL
      link.download = `${photo.id}.gif`;
      // link.click();
      
      console.log('GIF export completed for:', photo.id);
    } catch (error) {
      console.error('Failed to export GIF:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const enhanceWithAI = async (photo: LivePhoto | MotionPhoto) => {
    setIsProcessing(true);
    
    try {
      // AI enhancement simulation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // In production, this would call AI APIs to:
      // - Stabilize video
      // - Enhance colors
      // - Remove noise
      // - Adjust timing
      
      console.log('AI enhancement completed for:', photo.id);
    } catch (error) {
      console.error('Failed to enhance photo:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Live Photos & Motion Photos</h3>
        <div className="flex items-center space-x-3">
          <div className="flex bg-white/10 rounded-xl p-1">
            <button
              onClick={() => setPreviewMode('live')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                previewMode === 'live'
                  ? 'bg-blue-500/30 text-blue-300'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Image size={16} className="inline mr-2" />
              Live Photos
            </button>
            <button
              onClick={() => setPreviewMode('motion')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                previewMode === 'motion'
                  ? 'bg-green-500/30 text-green-300'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Video size={16} className="inline mr-2" />
              Motion Photos
            </button>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 text-blue-300 rounded-xl border border-blue-500/30 hover:bg-blue-500/30 transition-colors disabled:opacity-50"
          >
            <Upload size={18} />
            <span>Import</span>
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".heic,.mov,.jpg,.jpeg"
        onChange={handleFileUpload}
        className="hidden"
      />

      {isProcessing && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-3 text-blue-300">
            <div className="w-6 h-6 border-2 border-blue-300 border-t-transparent rounded-full animate-spin" />
            <span>Processing photos...</span>
          </div>
        </div>
      )}

      {/* Live Photos Grid */}
      {previewMode === 'live' && livePhotos.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-white">Apple Live Photos ({livePhotos.length})</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {livePhotos.map((photo) => (
              <div key={photo.id} className="bg-black/20 rounded-xl overflow-hidden">
                <div className="relative">
                  <img
                    src={photo.thumbnail}
                    alt={photo.id}
                    className="w-full h-48 object-cover"
                  />
                  <video
                    ref={el => el && (videoRefs.current[photo.id] = el)}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity ${
                      playingId === photo.id ? 'opacity-100' : 'opacity-0'
                    }`}
                    muted
                    loop={false}
                  />
                  <button
                    onClick={() => playLivePhoto(photo.id, 'live')}
                    className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity"
                  >
                    {playingId === photo.id ? (
                      <Pause size={32} className="text-white" />
                    ) : (
                      <Play size={32} className="text-white" />
                    )}
                  </button>
                  <div className="absolute top-2 right-2 bg-black/60 rounded-lg px-2 py-1">
                    <span className="text-xs text-white">{photo.duration.toFixed(1)}s</span>
                  </div>
                </div>
                
                <div className="p-4">
                  <p className="text-sm font-medium text-white truncate">{photo.id}</p>
                  <p className="text-xs text-gray-400 mb-3">
                    {photo.metadata.device} • {photo.metadata.timestamp?.toLocaleDateString()}
                  </p>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => exportAsGIF(photo, 'live')}
                      className="flex-1 flex items-center justify-center space-x-1 py-2 bg-purple-500/20 text-purple-300 rounded-lg text-xs hover:bg-purple-500/30 transition-colors"
                    >
                      <Download size={14} />
                      <span>GIF</span>
                    </button>
                    <button
                      onClick={() => enhanceWithAI(photo)}
                      className="flex-1 flex items-center justify-center space-x-1 py-2 bg-orange-500/20 text-orange-300 rounded-lg text-xs hover:bg-orange-500/30 transition-colors"
                    >
                      <Wand2 size={14} />
                      <span>Enhance</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Motion Photos Grid */}
      {previewMode === 'motion' && motionPhotos.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-white">Google Motion Photos ({motionPhotos.length})</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {motionPhotos.map((photo) => (
              <div key={photo.id} className="bg-black/20 rounded-xl overflow-hidden">
                <div className="relative">
                  <img
                    src={photo.thumbnail}
                    alt={photo.id}
                    className="w-full h-48 object-cover"
                  />
                  <video
                    ref={el => el && (videoRefs.current[photo.id] = el)}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity ${
                      playingId === photo.id ? 'opacity-100' : 'opacity-0'
                    }`}
                    muted
                    loop={false}
                  />
                  <button
                    onClick={() => playLivePhoto(photo.id, 'motion')}
                    className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity"
                  >
                    {playingId === photo.id ? (
                      <Pause size={32} className="text-white" />
                    ) : (
                      <Play size={32} className="text-white" />
                    )}
                  </button>
                  <div className="absolute top-2 right-2 bg-black/60 rounded-lg px-2 py-1">
                    <span className="text-xs text-white">{photo.duration}s</span>
                  </div>
                </div>
                
                <div className="p-4">
                  <p className="text-sm font-medium text-white truncate">{photo.id}</p>
                  <p className="text-xs text-gray-400 mb-3">
                    {photo.metadata.device} • {photo.metadata.timestamp?.toLocaleDateString()}
                  </p>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => exportAsGIF(photo, 'motion')}
                      className="flex-1 flex items-center justify-center space-x-1 py-2 bg-purple-500/20 text-purple-300 rounded-lg text-xs hover:bg-purple-500/30 transition-colors"
                    >
                      <Download size={14} />
                      <span>GIF</span>
                    </button>
                    <button
                      onClick={() => enhanceWithAI(photo)}
                      className="flex-1 flex items-center justify-center space-x-1 py-2 bg-orange-500/20 text-orange-300 rounded-lg text-xs hover:bg-orange-500/30 transition-colors"
                    >
                      <Wand2 size={14} />
                      <span>Enhance</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {livePhotos.length === 0 && motionPhotos.length === 0 && !isProcessing && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Image size={32} className="text-blue-400" />
          </div>
          <h4 className="text-lg font-medium text-white mb-2">No Live Photos imported yet</h4>
          <p className="text-gray-400 mb-6">
            Import Apple Live Photos (.HEIC + .MOV) or Google Motion Photos (.JPG)
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-3 bg-blue-500/20 text-blue-300 rounded-xl border border-blue-500/30 hover:bg-blue-500/30 transition-colors"
          >
            Choose Files
          </button>
        </div>
      )}

      {/* Statistics */}
      {(livePhotos.length > 0 || motionPhotos.length > 0) && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-black/20 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-blue-400">{livePhotos.length}</p>
            <p className="text-sm text-gray-300">Live Photos</p>
          </div>
          <div className="bg-black/20 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-green-400">{motionPhotos.length}</p>
            <p className="text-sm text-gray-300">Motion Photos</p>
          </div>
          <div className="bg-black/20 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-purple-400">
              {(livePhotos.reduce((sum, p) => sum + p.duration, 0) + 
                motionPhotos.reduce((sum, p) => sum + p.duration, 0)).toFixed(1)}s
            </p>
            <p className="text-sm text-gray-300">Total Duration</p>
          </div>
          <div className="bg-black/20 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-orange-400">
              {((livePhotos.reduce((sum, p) => sum + p.stillImage.size + p.motionVideo.size, 0) +
                 motionPhotos.reduce((sum, p) => sum + p.combinedFile.size, 0)) / (1024 * 1024)).toFixed(1)}MB
            </p>
            <p className="text-sm text-gray-300">Total Size</p>
          </div>
        </div>
      )}
    </div>
  );
}