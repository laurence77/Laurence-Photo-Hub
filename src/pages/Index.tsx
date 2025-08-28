import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Building, Users, Settings, BarChart3, Shield } from "lucide-react";
import { updateSEOTags, SEO_CONFIGS } from '@/utils/seoUtils';

const Index = () => {
  const navigate = useNavigate();
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

  useEffect(() => {
    updateSEOTags(SEO_CONFIGS.home);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Clean Header */}
      <header className="w-full py-6 px-6 border-b border-gray-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="text-2xl font-semibold text-gray-900">
            Laurence Photo Hub
          </div>
          <Button 
            variant="outline" 
            onClick={() => setIsSignInModalOpen(true)}
            className="border-gray-200 hover:bg-gray-50"
          >
            Admin Login
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Business Administration Portal
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Complete B2B and B2C management system for photo sharing and event management. 
            Ready for backend integration and administrative control.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/admin/dashboard')}
            className="bg-gray-900 text-white hover:bg-gray-800 px-8 py-3 text-lg"
          >
            Access Dashboard
          </Button>
        </div>

        {/* Admin Modules Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* B2B Management */}
          <div className="p-8 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Building className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">B2B Management</h3>
            <p className="text-gray-600 mb-4">
              Corporate client management, enterprise accounts, and business partnerships.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/admin/b2b')}
              className="w-full"
            >
              Manage B2B
            </Button>
          </div>

          {/* B2C Management */}
          <div className="p-8 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">B2C Management</h3>
            <p className="text-gray-600 mb-4">
              Individual customer accounts, subscriptions, and consumer services.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/admin/b2c')}
              className="w-full"
            >
              Manage B2C
            </Button>
          </div>

          {/* System Settings */}
          <div className="p-8 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Settings className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">System Settings</h3>
            <p className="text-gray-600 mb-4">
              Platform configuration, API settings, and system administration.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/admin/settings')}
              className="w-full"
            >
              System Config
            </Button>
          </div>

          {/* Analytics */}
          <div className="p-8 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics Hub</h3>
            <p className="text-gray-600 mb-4">
              Business intelligence, performance metrics, and reporting dashboard.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/analytics/events')}
              className="w-full"
            >
              View Analytics
            </Button>
          </div>

          {/* Security Center */}
          <div className="p-8 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Security Center</h3>
            <p className="text-gray-600 mb-4">
              Access control, security monitoring, and compliance management.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/security')}
              className="w-full"
            >
              Security Hub
            </Button>
          </div>

          {/* Support System */}
          <div className="p-8 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Support System</h3>
            <p className="text-gray-600 mb-4">
              Customer support, ticketing system, and help desk management.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/support')}
              className="w-full"
            >
              Support Center
            </Button>
          </div>
        </div>

        {/* Backend Integration Info */}
        <div className="mt-20 p-8 bg-gray-50 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Ready for Backend Integration</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">API Endpoints Ready</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• User authentication and authorization</li>
                <li>• B2B client management APIs</li>
                <li>• B2C customer service APIs</li>
                <li>• Photo upload and management</li>
                <li>• Event creation and administration</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Database Schema</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• User roles and permissions</li>
                <li>• Multi-tenant architecture</li>
                <li>• Enterprise client structures</li>
                <li>• Subscription management</li>
                <li>• Analytics and reporting data</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-gray-100 py-8 px-6 mt-20">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-gray-600 text-sm">
            © 2025 Laurence Photo Hub. Admin Portal v1.0
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;