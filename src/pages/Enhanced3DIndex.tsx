/**
 * Enhanced 3D Index Page
 * Demonstrates systematic integration of all 3D effects
 * This shows how to upgrade your existing Index.tsx
 */

import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import FadeIn from '@/components/animations/FadeIn';
import { Camera, Share2, Shield, Smartphone, Users, Zap, Building, TrendingUp, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import DarkModeToggle from '@/components/DarkModeToggle';
import SignInModal from '@/components/SignInModal';
import ThreeBackground from '@/components/ThreeBackground';
import Enhanced3DCard from '@/components/Enhanced3DCard';
import FlatModeToggle from '@/components/FlatModeToggle';
import { updateSEOTags, SEO_CONFIGS } from '@/utils/seoUtils';
import { getImagePath } from '@/lib/utils';

const Enhanced3DIndex = () => {
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
    
    // Smooth scroll for anchor links
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
      {/* Fixed Flat Mode Toggle */}
      <FlatModeToggle 
        position="fixed" 
        fixedPosition="bottom-right" 
        variant="icon"
        size="md"
      />

      {/* Header - Layer 4 (Navigation) */}
      <header className="scene fixed top-0 left-0 right-0 z-50 layer" data-depth="4">
        <div className="glass-panel nav-3d py-4">
          <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
            <div className="text-xl font-serif font-medium tracking-tight text-gradient-electric enhance-3d">
              Laurence Photo Hub
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {['home', 'features', 'about', 'gallery'].map((section) => (
                <button 
                  key={section}
                  type="button"
                  className="text-sm font-medium text-gray-600 hover:electric-accent motion-spring nav-3d px-3 py-2 vision-pro-rounded focus-3d"
                  onClick={() => scrollToSection(section)}
                  title={`Go to ${section} section`}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
              ))}
              <button 
                type="button"
                className="text-sm font-medium text-gray-600 hover:electric-accent motion-spring nav-3d px-3 py-2 vision-pro-rounded"
                onClick={() => navigate('/events')}
                title="Browse Public Events"
              >
                Public Events
              </button>
              <DarkModeToggle />
              <Button 
                variant="outline" 
                size="sm"
                className="ml-4 btn-3d glass-button electric-border electric-accent hover:electric-bg hover:text-white"
                onClick={() => setIsSignInModalOpen(true)}
                title="Sign in to your account"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Multi-Layer Depth */}
      <section className="scene scene-far relative min-h-screen flex items-center overflow-hidden" id="home">
        {/* Layer 0: Advanced Background Effects */}
        <div className="absolute inset-0 layer" data-depth="0">
          <ThreeBackground 
            effect="particles" 
            theme="electric" 
            intensity={0.6}
            interactive={true}
            className="opacity-30"
          />
          <img 
            src={getImagePath('/uploads/a0278ce1-b82d-4ed6-a186-14a9503ef65c.png')} 
            alt="Event Photography" 
            className="w-full h-full object-cover"
            data-scroll-parallax="0.2"
          />
        </div>

        {/* Layer 1: Decorative Elements */}
        <div className="absolute inset-0 layer" data-depth="1" data-pointer-parallax="0.05">
          {/* Floating design elements could go here */}
        </div>
        
        {/* Layer 2: Main Content */}
        <div className="container mx-auto px-4 md:px-6 py-20 md:py-32 relative z-10 max-w-4xl">
          <Enhanced3DCard
            depth={2}
            hoverIntensity="medium"
            enableTilt={true}
            parallax={0.1}
            electric={true}
            glass="medium"
            shadow="lg"
            className="max-w-3xl mx-auto text-center p-12 m-8"
          >
            <FadeIn delay={200}>
              <div className="layer" data-depth="3">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium tracking-tight text-gradient-electric leading-tight mb-6 relative inline-block">
                  Laurence Photo Hub
                  {/* Layer 3: Interactive Elements */}
                  <div 
                    className="camera-badge layer" 
                    data-depth="3"
                    title="Open camera for photo capture"
                  >
                    <Camera className="w-5 h-5" />
                  </div>
                </h1>
              </div>
            </FadeIn>
            
            <FadeIn delay={300}>
              <div className="layer" data-depth="2" data-pointer-parallax="0.03">
                <p className="text-lg md:text-xl text-gray-600 mb-4">
                  Premium event photography sharing redefined.
                </p>
                <p className="text-lg md:text-xl text-gray-600 mb-8">
                  Secure, intelligent, and effortlessly elegant photo sharing for professionals.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={400}>
              <div className="layer flex flex-col sm:flex-row gap-4 justify-center" data-depth="3">
                <Button 
                  size="lg" 
                  className="btn-3d electric-bg text-white hover:electric-glow text-lg px-8 vision-pro-rounded motion-spring"
                  onClick={() => scrollToSection('features')}
                  title="Explore all features"
                >
                  Explore Features
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="btn-3d glass-button electric-border electric-accent hover:electric-bg hover:text-white text-lg px-8"
                  onClick={() => scrollToSection('about')}
                  title="Learn more about Laurence Photo Hub"
                >
                  Learn More
                </Button>
              </div>
            </FadeIn>
          </Enhanced3DCard>
        </div>
      </section>

      {/* Features Section - Systematic 3D Grid */}
      <section id="features" className="scene py-20 bg-gradient-to-br from-white to-blue-50/20 dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-16 layer" data-depth="1">
            <FadeIn>
              <h2 className="text-3xl md:text-4xl font-serif mb-6 text-gradient-electric">Professional Features</h2>
            </FadeIn>
            
            <FadeIn delay={100}>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Built for photographers and event organizers who demand excellence in every moment shared.
              </p>
            </FadeIn>
          </div>
          
          <div className="gallery-3d grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <FadeIn key={index} delay={200 + index * 100}>
                <Enhanced3DCard
                  depth={2}
                  hoverIntensity="medium"
                  enableTilt={true}
                  parallax={0.05 + index * 0.01}
                  electric={false}
                  glass="subtle"
                  shadow="md"
                  className="gallery-item-3d p-6 text-center cursor-pointer"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => navigate(`/features/${feature.id}`)}
                  title={`View details for ${feature.title}`}
                >
                  <div className="flex justify-center mb-4 layer" data-depth="1">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-serif font-medium mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </Enhanced3DCard>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* About Section - Enhanced Stats Cards */}
      <section id="about" className="scene py-20 bg-gradient-to-br from-blue-50/10 to-purple-50/10 dark:bg-gray-800">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Content Column */}
              <div className="layer" data-depth="1" data-parallax="0.05">
                <FadeIn>
                  <h2 className="text-3xl md:text-4xl font-serif mb-6 text-gradient-electric">Our Vision</h2>
                </FadeIn>
                
                <FadeIn delay={100}>
                  <Enhanced3DCard
                    depth={1}
                    hoverIntensity="subtle"
                    enableTilt={true}
                    parallax={0.03}
                    glass="subtle"
                    shadow="sm"
                    className="mb-6 overflow-hidden"
                  >
                    <img 
                      src={getImagePath('/uploads/47f9a1d0-4458-400a-8fc0-79adf093cf18.png')}
                      alt="Professional Photography" 
                      className="w-full h-48 object-cover gallery-image"
                      data-pointer-parallax="0.02"
                    />
                  </Enhanced3DCard>
                  <p className="text-lg leading-relaxed mb-6 text-muted-foreground">
                    We believe in transforming how memories are captured and shared. Our platform combines 
                    cutting-edge technology with intuitive design to create seamless experiences.
                  </p>
                </FadeIn>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 layer" data-depth="2">
                {[
                  { icon: Building, value: '500+', label: 'Events Powered', delay: 300 },
                  { icon: TrendingUp, value: '99.9%', label: 'Uptime', delay: 400 },
                  { icon: Users, value: '50K+', label: 'Photos Shared', delay: 500 },
                  { icon: Target, value: '100%', label: 'Secure', delay: 600 }
                ].map((stat, index) => (
                  <FadeIn key={index} delay={stat.delay}>
                    <Enhanced3DCard
                      depth={2}
                      hoverIntensity="strong"
                      enableTilt={true}
                      parallax={0.08 + index * 0.02}
                      electric={true}
                      glass="medium"
                      shadow="lg"
                      className="stats-card p-6 text-center cursor-pointer"
                      onClick={() => navigate(`/analytics`)}
                    >
                      <stat.icon className="w-8 h-8 text-orangery-600 mx-auto mb-3" />
                      <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </Enhanced3DCard>
                  </FadeIn>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="scene py-20 bg-gradient-to-br from-purple-50/10 to-blue-50/20 dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <FadeIn>
              <h2 className="text-3xl md:text-4xl font-serif text-center mb-12 text-gradient-electric layer" data-depth="1">
                Experience Gallery
              </h2>
            </FadeIn>
            
            <div className="gallery-3d grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                '/uploads/34a58283-8b82-48f9-88f4-2c88b069921d.png',
                '/uploads/af28398b-9e23-4e2b-9de1-bda457e09fd8.png',
                '/uploads/dabbf929-5dd0-4794-a011-fe43bf4b3418.png'
              ].map((imagePath, index) => (
                <FadeIn key={index} delay={100 + index * 100}>
                  <Enhanced3DCard
                    depth={1}
                    hoverIntensity="medium"
                    enableTilt={true}
                    parallax={0.06 + index * 0.01}
                    glass="subtle"
                    shadow="md"
                    className="gallery-item-3d overflow-hidden cursor-pointer"
                  >
                    <img 
                      src={getImagePath(imagePath)}
                      alt={`Gallery Image ${index + 1}`}
                      className="w-full h-64 object-cover gallery-image"
                      data-pointer-parallax={`${0.02 + index * 0.01}`}
                    />
                  </Enhanced3DCard>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="scene py-20 bg-gradient-to-br from-white to-blue-50/10 dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-6">
          <Enhanced3DCard
            depth={2}
            hoverIntensity="medium"
            enableTilt={true}
            electric={true}
            glass="medium"
            shadow="lg"
            className="max-w-3xl mx-auto text-center p-8"
          >
            <FadeIn>
              <h2 className="text-3xl md:text-4xl font-serif mb-6 text-gradient-electric">Ready to Get Started?</h2>
            </FadeIn>
            
            <FadeIn delay={100}>
              <p className="text-lg leading-relaxed text-muted-foreground mb-8">
                Join professional photographers who trust Laurence Photo Hub for their premium event experiences.
              </p>
            </FadeIn>

            <FadeIn delay={200}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center layer" data-depth="1">
                <Button 
                  size="lg" 
                  className="btn-3d electric-bg text-white hover:electric-glow text-lg px-8 vision-pro-rounded motion-spring"
                  onClick={() => window.open('mailto:contact@laurencephotohub.com', '_blank')}
                >
                  Start Free Trial
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="btn-3d glass-button text-lg px-8"
                  onClick={() => window.open('https://calendly.com/laurencephotohub/demo', '_blank')}
                >
                  Schedule Demo
                </Button>
              </div>
            </FadeIn>
          </Enhanced3DCard>
        </div>
      </section>
      
      <SignInModal 
        isOpen={isSignInModalOpen} 
        onClose={() => setIsSignInModalOpen(false)} 
      />
    </main>
  );
};

export default Enhanced3DIndex;