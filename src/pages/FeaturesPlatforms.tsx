import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Instagram, Facebook, Twitter, Youtube, Smartphone, Globe } from 'lucide-react';

export default function FeaturesPlatforms() {
  const platforms = [
    {
      name: 'Instagram',
      icon: <Instagram className="h-6 w-6" />,
      connected: true,
      followers: '12.5K',
      engagement: '4.2%',
      color: 'from-pink-500 to-purple-600'
    },
    {
      name: 'Facebook',
      icon: <Facebook className="h-6 w-6" />,
      connected: true,
      followers: '8.9K',
      engagement: '3.8%',
      color: 'from-blue-600 to-blue-700'
    },
    {
      name: 'Twitter',
      icon: <Twitter className="h-6 w-6" />,
      connected: false,
      followers: '5.4K',
      engagement: '2.1%',
      color: 'from-sky-400 to-sky-600'
    },
    {
      name: 'YouTube',
      icon: <Youtube className="h-6 w-6" />,
      connected: false,
      followers: '3.2K',
      engagement: '6.7%',
      color: 'from-red-500 to-red-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-rose-600 to-orange-600 rounded-lg">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
                Platform Integration
              </h1>
              <p className="text-gray-600 mt-1">
                Connect and manage your social media presence
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {platforms.map((platform) => (
            <Card key={platform.name} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 bg-gradient-to-r ${platform.color} rounded-lg text-white`}>
                      {platform.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{platform.name}</CardTitle>
                      <CardDescription>
                        {platform.followers} followers • {platform.engagement} engagement
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {platform.connected ? (
                      <Badge className="bg-green-100 text-green-800">Connected</Badge>
                    ) : (
                      <Button size="sm">Connect</Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              {platform.connected && (
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Auto-post</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Add watermark</span>
                      <Switch />
                    </div>
                    <Button className="w-full" size="sm">
                      View Analytics
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Platform Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Cross-Platform Settings
            </CardTitle>
            <CardDescription>
              Configure settings that apply to all connected platforms
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Unified Analytics</p>
                <p className="text-sm text-gray-600">Track performance across all platforms</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Smart Scheduling</p>
                <p className="text-sm text-gray-600">AI-optimized posting times</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Content Adaptation</p>
                <p className="text-sm text-gray-600">Auto-resize for each platform</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}