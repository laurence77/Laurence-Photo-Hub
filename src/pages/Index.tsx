import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Camera, Share2, Shield, Users, Star, ArrowRight } from "lucide-react";
import { updateSEOTags, SEO_CONFIGS } from '@/utils/seoUtils';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    updateSEOTags(SEO_CONFIGS.home);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="w-full py-6 px-6 border-b border-gray-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="text-2xl font-semibold text-gray-900">
            Laurence Photo Hub
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/events')}
              className="text-gray-600 hover:text-gray-900"
            >
              Public Events
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin')}
              className="border-gray-200 hover:bg-gray-50"
            >
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Professional Photo Sharing
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            The premier platform for event photographers and their clients. 
            Secure, elegant, and built for professional workflows.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gray-900 text-white hover:bg-gray-800 px-8 py-3 text-lg"
              onClick={() => navigate('/events')}
            >
              Explore Events
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg"
              onClick={() => window.open('mailto:contact@laurencephotohub.com', '_blank')}
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Built for Professionals
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to share and manage event photography
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium Quality</h3>
              <p className="text-gray-600">
                HEIC, ProRAW, and HDR support with intelligent compression
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Share2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Sharing</h3>
              <p className="text-gray-600">
                Multiple sharing methods with real-time synchronization
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Enterprise Security</h3>
              <p className="text-gray-600">
                End-to-end encryption with comprehensive audit logs
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Role Management</h3>
              <p className="text-gray-600">
                Granular permissions for photographers and clients
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-12">
            Trusted by Professional Photographers
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "Laurence Photo Hub transformed how we deliver photos to our wedding clients. 
                The security and ease of use is unmatched."
              </p>
              <p className="font-semibold text-gray-900">Sarah Johnson</p>
              <p className="text-gray-500">Wedding Photographer</p>
            </div>
            
            <div className="p-8">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "Perfect for corporate events. The role management and privacy controls 
                give our clients complete confidence."
              </p>
              <p className="font-semibold text-gray-900">Mark Chen</p>
              <p className="text-gray-500">Event Photographer</p>
            </div>
            
            <div className="p-8">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "The platform handles everything from upload to delivery. 
                Our workflow has never been more efficient."
              </p>
              <p className="font-semibold text-gray-900">Lisa Rodriguez</p>
              <p className="text-gray-500">Studio Owner</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to elevate your photo sharing?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join professional photographers who trust Laurence Photo Hub 
            for their premium event experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 text-lg"
              onClick={() => window.open('mailto:contact@laurencephotohub.com?subject=Demo Request', '_blank')}
            >
              Request Demo
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-gray-400 text-white hover:bg-gray-800 px-8 py-3 text-lg"
              onClick={() => navigate('/events')}
            >
              View Public Events
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Camera className="w-6 h-6 text-gray-600" />
              <span className="font-semibold text-gray-900">Laurence Photo Hub</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <button 
                onClick={() => navigate('/legal/privacy')} 
                className="hover:text-gray-900 transition-colors"
              >
                Privacy
              </button>
              <button 
                onClick={() => navigate('/legal/terms')} 
                className="hover:text-gray-900 transition-colors"
              >
                Terms
              </button>
              <button 
                onClick={() => navigate('/support')} 
                className="hover:text-gray-900 transition-colors"
              >
                Support
              </button>
            </div>
          </div>
          <div className="text-center text-sm text-gray-500 mt-8">
            © 2025 Laurence Photo Hub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;