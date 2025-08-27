import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  Lock, 
  Key, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Fingerprint,
  Smartphone,
  Globe,
  UserCheck,
  History,
  Settings,
  Zap,
  Database,
  Cloud,
  FileKey
} from 'lucide-react';

interface SecurityEvent {
  id: string;
  type: 'login' | 'access' | 'download' | 'share' | 'security';
  description: string;
  timestamp: string;
  location: string;
  device: string;
  status: 'success' | 'warning' | 'error';
}

interface SecuritySetting {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  level: 'low' | 'medium' | 'high' | 'critical';
  icon: React.ReactNode;
}

export default function SecurityPage() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [encryptionEnabled, setEncryptionEnabled] = useState(true);
  const [securityScore, setSecurityScore] = useState(87);

  const recentActivity: SecurityEvent[] = [
    {
      id: '1',
      type: 'login',
      description: 'Successful login from new device',
      timestamp: '2 hours ago',
      location: 'San Francisco, CA',
      device: 'MacBook Pro',
      status: 'success'
    },
    {
      id: '2',
      type: 'access',
      description: 'Photo album accessed',
      timestamp: '4 hours ago',
      location: 'San Francisco, CA',
      device: 'iPhone 15',
      status: 'success'
    },
    {
      id: '3',
      type: 'security',
      description: 'Failed login attempt',
      timestamp: '1 day ago',
      location: 'Unknown',
      device: 'Unknown',
      status: 'warning'
    },
    {
      id: '4',
      type: 'download',
      description: 'Bulk photo download',
      timestamp: '2 days ago',
      location: 'New York, NY',
      device: 'Windows PC',
      status: 'success'
    },
    {
      id: '5',
      type: 'share',
      description: 'Private link created',
      timestamp: '3 days ago',
      location: 'San Francisco, CA',
      device: 'iPad Air',
      status: 'success'
    }
  ];

  const securitySettings: SecuritySetting[] = [
    {
      id: 'two-factor',
      name: 'Two-Factor Authentication',
      description: 'Secure your account with 2FA via SMS or authenticator app',
      enabled: true,
      level: 'critical',
      icon: <Smartphone className="h-5 w-5" />
    },
    {
      id: 'biometric',
      name: 'Biometric Authentication',
      description: 'Use fingerprint or face recognition for quick access',
      enabled: false,
      level: 'high',
      icon: <Fingerprint className="h-5 w-5" />
    },
    {
      id: 'encryption',
      name: 'End-to-End Encryption',
      description: 'Encrypt all photos and data with military-grade security',
      enabled: true,
      level: 'critical',
      icon: <FileKey className="h-5 w-5" />
    },
    {
      id: 'session-timeout',
      name: 'Session Timeout',
      description: 'Automatically log out after period of inactivity',
      enabled: true,
      level: 'medium',
      icon: <History className="h-5 w-5" />
    },
    {
      id: 'download-protection',
      name: 'Download Protection',
      description: 'Add watermarks and track downloads for shared content',
      enabled: false,
      level: 'medium',
      icon: <Shield className="h-5 w-5" />
    },
    {
      id: 'geo-restriction',
      name: 'Geographic Restrictions',
      description: 'Restrict access based on geographic location',
      enabled: false,
      level: 'high',
      icon: <Globe className="h-5 w-5" />
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'text-red-600 bg-red-100';
      case 'high':
        return 'text-orange-600 bg-orange-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-slate-600 to-blue-600 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-600 to-blue-600 bg-clip-text text-transparent">
                Security Center
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your account security and privacy settings
              </p>
            </div>
          </div>
        </div>

        {/* Security Score */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Security Score</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Your account security is {securityScore >= 80 ? 'excellent' : securityScore >= 60 ? 'good' : 'needs improvement'}
                </p>
                <Progress value={securityScore} className="w-64 mb-2" />
                <p className="text-sm text-gray-500">{securityScore}/100 points</p>
              </div>
              <div className="text-right">
                <div className={`text-4xl font-bold mb-2 ${
                  securityScore >= 80 ? 'text-green-600' : securityScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {securityScore}
                </div>
                <div className="flex items-center gap-2">
                  {securityScore >= 80 ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  )}
                  <span className="text-sm font-medium">
                    {securityScore >= 80 ? 'Secure' : 'Needs Attention'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="settings" className="space-y-6">
          <TabsList className="grid w-full lg:w-[500px] grid-cols-3">
            <TabsTrigger value="settings">Security Settings</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="privacy">Privacy Controls</TabsTrigger>
          </TabsList>

          <TabsContent value="settings">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Authentication */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    Authentication
                  </CardTitle>
                  <CardDescription>
                    Configure how you sign in to your account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-600">Add extra security layer</p>
                      </div>
                    </div>
                    <Switch
                      checked={twoFactorEnabled}
                      onCheckedChange={setTwoFactorEnabled}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Fingerprint className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="font-medium">Biometric Login</p>
                        <p className="text-sm text-gray-600">Face ID or Touch ID</p>
                      </div>
                    </div>
                    <Switch
                      checked={biometricsEnabled}
                      onCheckedChange={setBiometricsEnabled}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Cloud className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">End-to-End Encryption</p>
                        <p className="text-sm text-gray-600">Encrypt all your data</p>
                      </div>
                    </div>
                    <Switch
                      checked={encryptionEnabled}
                      onCheckedChange={setEncryptionEnabled}
                    />
                  </div>

                  <Button className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Advanced Settings
                  </Button>
                </CardContent>
              </Card>

              {/* Security Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security Features
                  </CardTitle>
                  <CardDescription>
                    Additional security and privacy options
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {securitySettings.slice(3).map((setting) => (
                      <div key={setting.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            {setting.icon}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-sm">{setting.name}</p>
                              <Badge className={`text-xs ${getLevelColor(setting.level)}`}>
                                {setting.level}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600">{setting.description}</p>
                          </div>
                        </div>
                        <Switch
                          checked={setting.enabled}
                          onCheckedChange={(checked) => {
                            // Handle setting change
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Account Security */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5" />
                    Account Security
                  </CardTitle>
                  <CardDescription>
                    Manage your account security settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Lock className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Key className="h-4 w-4 mr-2" />
                    Backup Codes
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Eye className="h-4 w-4 mr-2" />
                    Active Sessions
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Database className="h-4 w-4 mr-2" />
                    Data Export
                  </Button>
                </CardContent>
              </Card>

              {/* Emergency Access */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Emergency Access
                  </CardTitle>
                  <CardDescription>
                    Recovery options for account access
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800">
                        Recovery Email Not Set
                      </span>
                    </div>
                    <p className="text-xs text-yellow-700 mb-3">
                      Add a recovery email to regain access if you lose your primary authentication method.
                    </p>
                    <Button size="sm" className="w-full">
                      Add Recovery Email
                    </Button>
                  </div>

                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        Backup Codes Generated
                      </span>
                    </div>
                    <p className="text-xs text-green-700">
                      You have 8 unused backup codes for emergency access.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Security Activity Log
                </CardTitle>
                <CardDescription>
                  Recent security events and account activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((event) => (
                    <div key={event.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50">
                      <div className="mt-1">
                        {getStatusIcon(event.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-sm">{event.description}</p>
                          <span className="text-xs text-gray-500">{event.timestamp}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                          <div className="flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            {event.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Smartphone className="h-3 w-3" />
                            {event.device}
                          </div>
                        </div>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getStatusColor(event.status)}`}
                      >
                        {event.type}
                      </Badge>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-6" variant="outline">
                  View Full Activity Log
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <EyeOff className="h-5 w-5" />
                    Privacy Settings
                  </CardTitle>
                  <CardDescription>
                    Control who can see your content and information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Profile Visibility</p>
                      <p className="text-xs text-gray-600">Who can see your profile</p>
                    </div>
                    <select className="text-sm border rounded px-2 py-1">
                      <option>Public</option>
                      <option>Friends Only</option>
                      <option>Private</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Photo Indexing</p>
                      <p className="text-xs text-gray-600">Allow search engines to index</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Location Data</p>
                      <p className="text-xs text-gray-600">Save location with photos</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Analytics Tracking</p>
                      <p className="text-xs text-gray-600">Share usage analytics</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Data Management
                  </CardTitle>
                  <CardDescription>
                    Manage your stored data and privacy preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Database className="h-4 w-4 mr-2" />
                    Download My Data
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Eye className="h-4 w-4 mr-2" />
                    Privacy Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Cookie Preferences
                  </Button>
                  <Button variant="destructive" className="w-full justify-start">
                    <XCircle className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}