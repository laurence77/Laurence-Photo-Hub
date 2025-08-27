import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

interface VoiceNavigationProps {
  photos: Array<{
    id: string;
    url: string;
    title?: string;
    tags?: string[];
    album?: string;
    date?: Date;
  }>;
  onNavigate?: (photoId: string) => void;
  onCommand?: (command: string, params?: any) => void;
}

export function VoiceNavigation({ photos, onNavigate, onCommand }: VoiceNavigationProps) {
  const [isListening, setIsListening] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [lastCommand, setLastCommand] = useState('');

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 3;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const lastResult = event.results[event.results.length - 1];
      const transcript = lastResult[0].transcript.toLowerCase().trim();
      const confidence = lastResult[0].confidence;
      
      setTranscript(transcript);
      setConfidence(confidence);
      
      if (confidence > 0.6) {
        processVoiceCommand(transcript);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      if (isEnabled) {
        setTimeout(() => recognition.start(), 1000);
      }
    };

    recognitionRef.current = recognition;
    synthRef.current = window.speechSynthesis;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isEnabled]);

  const processVoiceCommand = (command: string) => {
    setLastCommand(command);
    
    // Navigation commands
    if (command.includes('next') || command.includes('forward')) {
      navigateNext();
      speak('Moving to next photo');
    }
    else if (command.includes('previous') || command.includes('back') || command.includes('last')) {
      navigatePrevious();
      speak('Moving to previous photo');
    }
    else if (command.includes('first') || command.includes('beginning')) {
      navigateToIndex(0);
      speak('Going to first photo');
    }
    else if (command.includes('last') || command.includes('end')) {
      navigateToIndex(photos.length - 1);
      speak('Going to last photo');
    }
    
    // Album/collection navigation
    else if (command.includes('show me') && command.includes('wedding')) {
      filterAndNavigate('wedding');
    }
    else if (command.includes('show me') && command.includes('birthday')) {
      filterAndNavigate('birthday');
    }
    else if (command.includes('show me') && command.includes('vacation')) {
      filterAndNavigate('vacation');
    }
    else if (command.includes('show me') && command.includes('family')) {
      filterAndNavigate('family');
    }
    
    // Numeric navigation
    else if (command.includes('go to photo')) {
      const match = command.match(/(\d+)/);
      if (match) {
        const photoNum = parseInt(match[1]) - 1;
        if (photoNum >= 0 && photoNum < photos.length) {
          navigateToIndex(photoNum);
          speak(`Going to photo ${match[1]}`);
        }
      }
    }
    
    // Search commands
    else if (command.includes('find') || command.includes('search for')) {
      const searchTerm = command.replace(/find|search for/g, '').trim();
      searchPhotos(searchTerm);
    }
    
    // Playback commands
    else if (command.includes('start slideshow') || command.includes('play slideshow')) {
      onCommand?.('startSlideshow');
      speak('Starting slideshow');
    }
    else if (command.includes('stop slideshow') || command.includes('pause slideshow')) {
      onCommand?.('stopSlideshow');
      speak('Stopping slideshow');
    }
    
    // Information commands
    else if (command.includes('photo details') || command.includes('tell me about')) {
      const currentPhoto = photos[currentPhotoIndex];
      if (currentPhoto) {
        const details = `This is ${currentPhoto.title || 'an untitled photo'}${
          currentPhoto.album ? ` from the ${currentPhoto.album} album` : ''
        }${currentPhoto.date ? ` taken on ${currentPhoto.date.toDateString()}` : ''}`;
        speak(details);
      }
    }
    
    // Help command
    else if (command.includes('help') || command.includes('commands')) {
      speak('Available commands: next, previous, first, last, show me wedding photos, go to photo number, find photos, start slideshow, photo details, and more');
    }
    
    else {
      speak("I didn't understand that command. Say 'help' for available commands.");
    }
  };

  const navigateNext = () => {
    const nextIndex = Math.min(currentPhotoIndex + 1, photos.length - 1);
    navigateToIndex(nextIndex);
  };

  const navigatePrevious = () => {
    const prevIndex = Math.max(currentPhotoIndex - 1, 0);
    navigateToIndex(prevIndex);
  };

  const navigateToIndex = (index: number) => {
    if (index >= 0 && index < photos.length) {
      setCurrentPhotoIndex(index);
      onNavigate?.(photos[index].id);
    }
  };

  const filterAndNavigate = (filter: string) => {
    const filteredPhotos = photos.filter(photo => 
      photo.title?.toLowerCase().includes(filter) ||
      photo.album?.toLowerCase().includes(filter) ||
      photo.tags?.some(tag => tag.toLowerCase().includes(filter))
    );
    
    if (filteredPhotos.length > 0) {
      const photoIndex = photos.findIndex(p => p.id === filteredPhotos[0].id);
      navigateToIndex(photoIndex);
      speak(`Found ${filteredPhotos.length} ${filter} photos. Showing first one.`);
    } else {
      speak(`No ${filter} photos found.`);
    }
  };

  const searchPhotos = (searchTerm: string) => {
    const results = photos.filter(photo =>
      photo.title?.toLowerCase().includes(searchTerm) ||
      photo.tags?.some(tag => tag.toLowerCase().includes(searchTerm)) ||
      photo.album?.toLowerCase().includes(searchTerm)
    );
    
    if (results.length > 0) {
      const photoIndex = photos.findIndex(p => p.id === results[0].id);
      navigateToIndex(photoIndex);
      speak(`Found ${results.length} photos matching ${searchTerm}. Showing first result.`);
    } else {
      speak(`No photos found matching ${searchTerm}.`);
    }
  };

  const speak = (text: string) => {
    if (!voiceEnabled || !synthRef.current) return;
    
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    synthRef.current.speak(utterance);
  };

  const toggleListening = () => {
    if (isEnabled) {
      setIsEnabled(false);
      recognitionRef.current?.stop();
    } else {
      setIsEnabled(true);
      recognitionRef.current?.start();
    }
  };

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
    if (voiceEnabled) {
      synthRef.current?.cancel();
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Voice Navigation</h3>
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleVoice}
            className={`p-2 rounded-xl transition-colors ${
              voiceEnabled 
                ? 'bg-blue-500/20 text-blue-400' 
                : 'bg-gray-500/20 text-gray-400'
            }`}
          >
            {voiceEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
          <button
            onClick={toggleListening}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-colors ${
              isEnabled
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'bg-green-500/20 text-green-400 border border-green-500/30'
            }`}
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            <span>{isEnabled ? 'Stop Listening' : 'Start Listening'}</span>
          </button>
        </div>
      </div>

      {isEnabled && (
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${
              isListening ? 'bg-red-400 animate-pulse' : 'bg-gray-400'
            }`} />
            <span className="text-sm text-gray-300">
              {isListening ? 'Listening...' : 'Ready to listen'}
            </span>
          </div>

          {transcript && (
            <div className="bg-black/20 rounded-xl p-4">
              <p className="text-sm text-gray-400 mb-1">Last heard:</p>
              <p className="text-white">{transcript}</p>
              <div className="mt-2 bg-gray-700 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${confidence * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Confidence: {Math.round(confidence * 100)}%
              </p>
            </div>
          )}

          {lastCommand && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
              <p className="text-sm text-green-400 mb-1">Command executed:</p>
              <p className="text-white">{lastCommand}</p>
            </div>
          )}
        </div>
      )}

      <div className="mt-6 space-y-3">
        <h4 className="text-sm font-medium text-gray-300">Voice Commands:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-400">
          <div className="space-y-1">
            <p>"Next photo" / "Previous photo"</p>
            <p>"Go to photo 5"</p>
            <p>"Show me wedding photos"</p>
            <p>"Find sunset photos"</p>
          </div>
          <div className="space-y-1">
            <p>"Start slideshow"</p>
            <p>"Photo details"</p>
            <p>"First photo" / "Last photo"</p>
            <p>"Help" for more commands</p>
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        Photo {currentPhotoIndex + 1} of {photos.length}
      </div>
    </div>
  );
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}