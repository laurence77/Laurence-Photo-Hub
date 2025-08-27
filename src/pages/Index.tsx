import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import FadeIn from '@/components/animations/FadeIn';
import { Camera, Share2, Shield, Smartphone, Users, Zap, Building, TrendingUp, Target, Twitter, Instagram, Facebook, Linkedin, Youtube, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import DarkModeToggle from '@/components/DarkModeToggle';
import SignInModal from '@/components/SignInModal';
import { updateSEOTags, SEO_CONFIGS } from '@/utils/seoUtils';
import { getImagePath } from '@/lib/utils';

const Index = () => {
  const navigate = useNavigate();
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  useEffect(() => {
    // Set SEO meta tags
    updateSEOTags(SEO_CONFIGS.home);
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const event = e as MouseEvent;
        const target = event.currentTarget as HTMLAnchorElement;
        const targetId = target.getAttribute('href')?.substring(1);
        if (!targetId) return;
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      });
    });
    
    return () => {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.removeEventListener('click', function () {
          // Cleanup
        });
      });
    };
  }, []);

  const scrollToSection = (id: string) => {
    if (id === 'home') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      const element = document.getElementById(id);
      if (element) {
        window.scrollTo({
          top: element.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    }
  };

  // Camera functionality
  const openCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });
      setStream(mediaStream);
      setIsCameraModalOpen(true);
      
      // Wait for video element to be ready
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      }, 100);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Could not access camera. Please make sure you have granted camera permissions.');
    }
  };

  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraModalOpen(false);
    setCapturedImage(null);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (context) {
        context.drawImage(video, 0, 0);
        const imageDataUrl = canvas.toDataURL('image/png');
        setCapturedImage(imageDataUrl);
        
        // Create download link
        const link = document.createElement('a');
        link.download = `photo-${Date.now()}.png`;
        link.href = imageDataUrl;
        link.click();
      }
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
  };

  // Navigation handlers for feature cards
  const handleFeatureClick = (featureType: string) => {
    switch (featureType) {
      case 'premium-capture':
        navigate('/features/capture');
        break;
      case 'smart-sharing':
        navigate('/features/sharing');
        break;
      case 'privacy-first':
        navigate('/features/privacy');
        break;
      case 'role-management':
        navigate('/features/roles');
        break;
      case 'real-time-feed':
        navigate('/features/feed');
        break;
      case 'multi-platform':
        navigate('/features/platforms');
        break;
      default:
        navigate('/features');
    }
  };

  // Navigation handlers for stats cards
  const handleStatsClick = (statsType: string) => {
    switch (statsType) {
      case 'events':
        navigate('/analytics/events');
        break;
      case 'uptime':
        navigate('/status');
        break;
      case 'photos':
        navigate('/analytics/photos');
        break;
      case 'security':
        navigate('/security');
        break;
      default:
        navigate('/analytics');
    }
  };

  // Navigation handlers for footer links
  const handleFooterClick = (linkType: string) => {
    switch (linkType) {
      case 'logo':
        navigate('/');
        break;
      case 'privacy':
        navigate('/legal/privacy');
        break;
      case 'terms':
        navigate('/legal/terms');
        break;
      case 'support':
        navigate('/support');
        break;
      default:
        navigate('/');
    }
  };

  // Social media handlers
  const handleSocialClick = (platform: string) => {
    const socialLinks = {
      twitter: 'https://twitter.com/LaurencePhotoHub',
      instagram: 'https://instagram.com/laurencephotohub',
      facebook: 'https://facebook.com/LaurencePhotoHub',
      linkedin: 'https://linkedin.com/company/laurence-photo-hub',
      youtube: 'https://youtube.com/@LaurencePhotoHub',
      github: 'https://github.com/laurence-photo-hub'
    };
    
    const url = socialLinks[platform as keyof typeof socialLinks];
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const features = [
    {
      id: "premium-capture",
      icon: <Camera className="w-8 h-8 electric-accent" />,
      title: "Premium Capture",
      description: "HEIC, ProRAW, HDR support with intelligent compression and perceptual deduplication for professional event photography."
    },
    {
      id: "smart-sharing",
      icon: <Share2 className="w-8 h-8 electric-accent" />,
      title: "Smart Sharing", 
      description: "AirDrop, WiFi Direct, Bluetooth LE, QR codes, and secure cloud exports with real-time synchronization."
    },
    {
      id: "privacy-first",
      icon: <Shield className="w-8 h-8 electric-accent" />,
      title: "Privacy First",
      description: "End-to-end encryption, organizer-controlled retention, and comprehensive audit logs for enterprise security."
    },
    {
      id: "role-management",
      icon: <Users className="w-8 h-8 electric-accent" />,
      title: "Role Management",
      description: "Granular permissions for organizers, photographers, and guests with intelligent content moderation."
    },
    {
      id: "real-time-feed",
      icon: <Zap className="w-8 h-8 electric-accent" />,
      title: "Real-time Feed",
      description: "Live photo wall with AI-powered highlights, slideshow mode, reactions, and threaded comments."
    },
    {
      id: "multi-platform",
      icon: <Smartphone className="w-8 h-8 electric-accent" />,
      title: "Multi-Platform",
      description: "Native iOS, Android apps plus responsive web interface with offline sync capabilities."
    }
  ];

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:to-black">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-panel py-4">
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <div className="text-xl font-serif font-medium tracking-tight text-gradient-electric">
            Laurence Photo Hub
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              type="button"
              className="text-sm font-medium text-gray-600 hover:electric-accent spring-smooth px-3 py-2 vision-pro-rounded"
              onClick={() => scrollToSection('home')}
              title="Go to Home section"
            >
              Home
            </button>
            <button 
              type="button"
              className="text-sm font-medium text-gray-600 hover:electric-accent spring-smooth px-3 py-2 vision-pro-rounded"
              onClick={() => scrollToSection('features')}
              title="View Features section"
            >
              Features
            </button>
            <button 
              type="button"
              className="text-sm font-medium text-gray-600 hover:electric-accent spring-smooth px-3 py-2 vision-pro-rounded"
              onClick={() => scrollToSection('about')}
              title="Learn more About us"
            >
              About
            </button>
            <button 
              type="button"
              className="text-sm font-medium text-gray-600 hover:electric-accent spring-smooth px-3 py-2 vision-pro-rounded"
              onClick={() => scrollToSection('gallery')}
              title="View Gallery section"
            >
              Gallery
            </button>
            <button 
              type="button"
              className="text-sm font-medium text-gray-600 hover:electric-accent spring-smooth px-3 py-2 vision-pro-rounded"
              onClick={() => navigate('/events')}
              title="Browse Public Events"
            >
              Public Events
            </button>
            <DarkModeToggle />
            <Button 
              variant="outline" 
              size="sm"
              className="ml-4 glass-button electric-border electric-accent hover:electric-bg hover:text-white"
              onClick={() => setIsSignInModalOpen(true)}
              title="Sign in to your account"
            >
              Sign In
            </Button>
          </div>
          
          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center space-x-4">
            <DarkModeToggle />
            <Button 
              variant="outline" 
              size="sm"
              className="border-white text-white hover:bg-white hover:text-black"
              onClick={() => setIsSignInModalOpen(true)}
              title="Sign in to your account"
            >
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden" id="home">
        <div className="absolute inset-0 z-0">
          <img 
            src={getImagePath('/uploads/a0278ce1-b82d-4ed6-a186-14a9503ef65c.png')} 
            alt="Event Photography" 
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error('Image failed to load:', (e.target as HTMLImageElement).src);
              (e.target as HTMLImageElement).src = getImagePath('/placeholder.svg');
            }}
            onLoad={() => console.log('Image loaded successfully')}
          />
          {/* <div className="absolute inset-0 bg-black/40"></div> */}
        </div>
        
        <div className="container mx-auto px-4 md:px-6 py-20 md:py-32 relative z-10 max-w-4xl">
          <div className="max-w-3xl mx-auto text-center glass-card hero-card p-12 m-8">
            <FadeIn delay={200}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium tracking-tight text-gradient-electric leading-tight mb-6 relative inline-block">
                Laurence Photo Hub
                <div className="camera-badge" onClick={openCamera} title="Open camera for photo capture">
                  <Camera className="w-5 h-5" />
                </div>
              </h1>
            </FadeIn>
            
            <FadeIn delay={300}>
              <p className="text-lg md:text-xl text-gray-600 mb-4">
                Premium event photography sharing redefined.
              </p>
              <p className="text-lg md:text-xl text-gray-600 mb-8">
                Secure, intelligent, and effortlessly elegant photo sharing for professionals.
              </p>
            </FadeIn>

            <FadeIn delay={400}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="electric-bg text-white hover:electric-glow text-lg px-8 vision-pro-rounded apple-spring"
                  onClick={() => scrollToSection('features')}
                  title="Explore all features"
                >
                  Explore Features
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="glass-button electric-border electric-accent hover:electric-bg hover:text-white text-lg px-8"
                  onClick={() => scrollToSection('about')}
                  title="Learn more about Laurence Photo Hub"
                >
                  Learn More
                </Button>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-gradient-to-br from-white to-blue-50/20 dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <FadeIn>
              <h2 className="text-3xl md:text-4xl font-serif mb-6 text-gradient-electric">Professional Features</h2>
            </FadeIn>
            
            <FadeIn delay={100}>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Built for photographers and event organizers who demand excellence in every moment shared.
              </p>
            </FadeIn>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <FadeIn key={index} delay={200 + index * 100}>
                <div 
                  className="glass-card p-6 text-center group cursor-pointer transition-transform hover:scale-105"
                  onClick={() => handleFeatureClick(feature.id)}
                  title={`View details for ${feature.title}`}
                >
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-serif font-medium mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 bg-gradient-to-br from-blue-50/10 to-purple-50/10 dark:bg-gray-800">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <FadeIn>
                  <h2 className="text-3xl md:text-4xl font-serif mb-6 text-gradient-electric">Our Vision</h2>
                </FadeIn>
                
                <FadeIn delay={100}>
                  <div className="mb-6">
                    <img 
                      src={getImagePath('/uploads/47f9a1d0-4458-400a-8fc0-79adf093cf18.png')}
                      alt="Professional Photography" 
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  </div>
                  <p className="text-lg leading-relaxed mb-6 text-muted-foreground">
                    We believe in transforming how memories are captured and shared. Our platform combines 
                    cutting-edge technology with intuitive design to create seamless experiences for 
                    professional photographers and their clients.
                  </p>
                </FadeIn>

                <FadeIn delay={200}>
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    From corporate events to intimate gatherings, Laurence Photo Hub ensures every 
                    moment is preserved with the highest quality and shared with complete security.
                  </p>
                </FadeIn>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FadeIn delay={300}>
                  <div 
                    className="glass-card stats-card p-6 text-center cursor-pointer transition-transform hover:scale-105"
                    onClick={() => handleStatsClick('events')}
                    title="View event analytics"
                  >
                    <Building className="w-8 h-8 text-orangery-600 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-foreground mb-1">500+</div>
                    <div className="text-sm text-muted-foreground">Events Powered</div>
                  </div>
                </FadeIn>
                
                <FadeIn delay={400}>
                  <div 
                    className="glass-card stats-card p-6 text-center cursor-pointer transition-transform hover:scale-105"
                    onClick={() => handleStatsClick('uptime')}
                    title="View uptime statistics"
                  >
                    <TrendingUp className="w-8 h-8 text-orangery-600 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-foreground mb-1">99.9%</div>
                    <div className="text-sm text-muted-foreground">Uptime</div>
                  </div>
                </FadeIn>
                
                <FadeIn delay={500}>
                  <div 
                    className="glass-card stats-card p-6 text-center cursor-pointer transition-transform hover:scale-105"
                    onClick={() => handleStatsClick('photos')}
                    title="View photo sharing analytics"
                  >
                    <Users className="w-8 h-8 text-orangery-600 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-foreground mb-1">50K+</div>
                    <div className="text-sm text-muted-foreground">Photos Shared</div>
                  </div>
                </FadeIn>
                
                <FadeIn delay={600}>
                  <div 
                    className="glass-card stats-card p-6 text-center cursor-pointer transition-transform hover:scale-105"
                    onClick={() => handleStatsClick('security')}
                    title="View security analytics"
                  >
                    <Target className="w-8 h-8 text-orangery-600 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-foreground mb-1">100%</div>
                    <div className="text-sm text-muted-foreground">Secure</div>
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="py-20 bg-gradient-to-br from-purple-50/10 to-blue-50/20 dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <FadeIn>
              <h2 className="text-3xl md:text-4xl font-serif text-center mb-12 text-gradient-electric">Experience Gallery</h2>
            </FadeIn>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FadeIn delay={100}>
                <div className="glass-card enhance-3d overflow-hidden">
                  <img 
                    src={getImagePath('/uploads/34a58283-8b82-48f9-88f4-2c88b069921d.png')}
                    alt="Event Photography" 
                    className="w-full h-64 object-cover gallery-image"
                    onError={(e) => {
                      console.error('Gallery image 1 failed to load:', (e.target as HTMLImageElement).src);
                      (e.target as HTMLImageElement).src = getImagePath('/placeholder.svg');
                    }}
                  />
                </div>
              </FadeIn>
              
              <FadeIn delay={200}>
                <div className="glass-card enhance-3d overflow-hidden">
                  <img 
                    src={getImagePath('/uploads/af28398b-9e23-4e2b-9de1-bda457e09fd8.png')}
                    alt="Professional Photos" 
                    className="w-full h-64 object-cover gallery-image"
                  />
                </div>
              </FadeIn>
              
              <FadeIn delay={300}>
                <div className="glass-card enhance-3d overflow-hidden">
                  <img 
                    src={getImagePath('/uploads/dabbf929-5dd0-4794-a011-fe43bf4b3418.png')}
                    alt="Sharing Platform" 
                    className="w-full h-64 object-cover gallery-image"
                  />
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-white to-blue-50/10 dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <FadeIn>
              <h2 className="text-3xl md:text-4xl font-serif mb-6 text-gradient-electric">Ready to Get Started?</h2>
            </FadeIn>
            
            <FadeIn delay={100}>
              <p className="text-lg leading-relaxed text-muted-foreground mb-8">
                Join professional photographers who trust Laurence Photo Hub for their premium event experiences.
              </p>
            </FadeIn>

            <FadeIn delay={200}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="electric-bg text-white hover:electric-glow text-lg px-8 vision-pro-rounded apple-spring"
                  onClick={() => window.open('mailto:contact@laurencephotohub.com?subject=Free Trial Request&body=Hi, I would like to start a free trial of Laurence Photo Hub.', '_blank')}
                >
                  Start Free Trial
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-8"
                  onClick={() => window.open('https://calendly.com/laurencephotohub/demo', '_blank')}
                >
                  Schedule Demo
                </Button>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col space-y-6">
            {/* Main Footer Content */}
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div 
                className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity enhance-3d"
                onClick={() => handleFooterClick('logo')}
                title="Go to homepage"
              >
                <Camera className="w-6 h-6 text-orangery-600" />
                <span className="font-serif font-medium">Laurence Photo Hub</span>
              </div>
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <button 
                  onClick={() => handleFooterClick('privacy')} 
                  className="hover:text-foreground transition-colors cursor-pointer enhance-3d"
                  title="View privacy policy"
                >
                  Privacy
                </button>
                <button 
                  onClick={() => handleFooterClick('terms')} 
                  className="hover:text-foreground transition-colors cursor-pointer enhance-3d"
                  title="View terms of service"
                >
                  Terms
                </button>
                <button 
                  onClick={() => handleFooterClick('support')} 
                  className="hover:text-foreground transition-colors cursor-pointer enhance-3d"
                  title="Get support"
                >
                  Support
                </button>
              </div>
            </div>

            {/* Social Media Section */}
            <div className="flex flex-col items-center space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="text-sm text-muted-foreground font-medium">Follow Us</div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleSocialClick('twitter')}
                  className="social-icon-btn p-2 rounded-full bg-white dark:bg-gray-700 shadow-md hover:shadow-lg transition-all enhance-3d"
                  aria-label="Follow us on Twitter"
                  title="Follow us on Twitter"
                >
                  <Twitter className="w-5 h-5 text-blue-400" />
                </button>
                <button
                  onClick={() => handleSocialClick('instagram')}
                  className="social-icon-btn p-2 rounded-full bg-white dark:bg-gray-700 shadow-md hover:shadow-lg transition-all enhance-3d"
                  aria-label="Follow us on Instagram"
                  title="Follow us on Instagram"
                >
                  <Instagram className="w-5 h-5 text-pink-500" />
                </button>
                <button
                  onClick={() => handleSocialClick('facebook')}
                  className="social-icon-btn p-2 rounded-full bg-white dark:bg-gray-700 shadow-md hover:shadow-lg transition-all enhance-3d"
                  aria-label="Follow us on Facebook"
                  title="Follow us on Facebook"
                >
                  <Facebook className="w-5 h-5 text-blue-600" />
                </button>
                <button
                  onClick={() => handleSocialClick('linkedin')}
                  className="social-icon-btn p-2 rounded-full bg-white dark:bg-gray-700 shadow-md hover:shadow-lg transition-all enhance-3d"
                  aria-label="Connect with us on LinkedIn"
                  title="Connect with us on LinkedIn"
                >
                  <Linkedin className="w-5 h-5 text-blue-700" />
                </button>
                <button
                  onClick={() => handleSocialClick('youtube')}
                  className="social-icon-btn p-2 rounded-full bg-white dark:bg-gray-700 shadow-md hover:shadow-lg transition-all enhance-3d"
                  aria-label="Subscribe to our YouTube channel"
                  title="Subscribe to our YouTube channel"
                >
                  <Youtube className="w-5 h-5 text-red-500" />
                </button>
                <button
                  onClick={() => handleSocialClick('github')}
                  className="social-icon-btn p-2 rounded-full bg-white dark:bg-gray-700 shadow-md hover:shadow-lg transition-all enhance-3d"
                  aria-label="View our GitHub"
                  title="View our GitHub"
                >
                  <Github className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </button>
              </div>
              
              {/* Social Handles Display */}
              <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
                <span>@LaurencePhotoHub</span>
                <span>•</span>
                <span>@laurencephotohub</span>
                <span>•</span>
                <span>/LaurencePhotoHub</span>
              </div>
            </div>

            {/* Copyright */}
            <div className="text-center text-xs text-muted-foreground border-t border-gray-200 dark:border-gray-700 pt-4">
              © 2025 Laurence Photo Hub. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
      
      <SignInModal 
        isOpen={isSignInModalOpen} 
        onClose={() => setIsSignInModalOpen(false)} 
      />

      {/* Camera Modal */}
      {isCameraModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 glass-card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gradient-electric">Camera</h2>
              <Button 
                variant="outline" 
                onClick={closeCamera}
                className="glass-button"
              >
                Close
              </Button>
            </div>
            
            <div className="relative">
              {!capturedImage ? (
                <div className="space-y-4">
                  <div className="relative bg-black rounded-lg overflow-hidden">
                    <video 
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-96 object-cover mirror-selfie"
                    />

                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-4 left-4 right-4 h-0.5 bg-white opacity-30"></div>
                      <div className="absolute bottom-4 left-4 right-4 h-0.5 bg-white opacity-30"></div>
                      <div className="absolute top-4 bottom-4 left-4 w-0.5 bg-white opacity-30"></div>
                      <div className="absolute top-4 bottom-4 right-4 w-0.5 bg-white opacity-30"></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center space-x-4">
                    <Button 
                      onClick={capturePhoto}
                      className="electric-bg text-white hover:electric-glow text-lg px-8 py-3 rounded-full"
                    >
                      <Camera className="w-5 h-5 mr-2" />
                      Capture Photo
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <img 
                      src={capturedImage} 
                      alt="Captured" 
                      className="w-full h-96 object-cover rounded-lg"
                    />
                  </div>
                  
                  <div className="flex justify-center space-x-4">
                    <Button 
                      onClick={retakePhoto}
                      variant="outline"
                      className="glass-button px-6 py-2"
                    >
                      Retake
                    </Button>
                    <Button 
                      onClick={closeCamera}
                      className="electric-bg text-white hover:electric-glow px-6 py-2"
                    >
                      Done
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            <canvas ref={canvasRef} className="hidden" />
          </div>
        </div>
      )}
    </main>
  );
};

export default Index;
