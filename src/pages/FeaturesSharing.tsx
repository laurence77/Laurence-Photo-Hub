import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Share2, 
  Link, 
  Download, 
  Mail, 
  MessageSquare, 
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Copy,
  QrCode,
  Clock,
  Users,
  Eye,
  Shield,
  Zap,
  Globe,
  Smartphone,
  Monitor,
  Settings
} from 'lucide-react';
import { getImagePath } from '@/lib/utils';

interface SocialPlatform {
  id: string;
  name: string;
  icon: React.ReactNode;
  connected: boolean;
  followers: number;
  engagement: number;
  color: string;
}

interface ShareOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  premium: boolean;
}

interface SharedLink {
  id: string;
  title: string;
  url: string;
  views: number;
  downloads: number;
  expires: string;
  protected: boolean;
  thumbnail: string;
}

export default function FeaturesSharing() {
  const [shareUrl, setShareUrl] = useState('https://laurence77.github.io/share/event-abc123');
  const [shareMessage, setShareMessage] = useState('Check out these amazing photos from our recent event!');
  const [linkExpiry, setLinkExpiry] = useState('7d');
  const [passwordProtected, setPasswordProtected] = useState(false);
  const [downloadEnabled, setDownloadEnabled] = useState(true);

  const socialPlatforms: SocialPlatform[] = [
    {
      id: 'instagram',
      name: 'Instagram',
      icon: <Instagram className="h-5 w-5" />,
      connected: true,
      followers: 12500,
      engagement: 4.2,
      color: 'from-pink-500 to-purple-600'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: <Facebook className="h-5 w-5" />,
      connected: true,
      followers: 8900,
      engagement: 3.8,
      color: 'from-blue-600 to-blue-700'
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: <Twitter className="h-5 w-5" />,
      connected: false,
      followers: 5400,
      engagement: 2.1,
      color: 'from-sky-400 to-sky-600'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: <Linkedin className="h-5 w-5" />,
      connected: false,
      followers: 3200,
      engagement: 1.9,
      color: 'from-blue-700 to-blue-800'
    }
  ];

  const shareOptions: ShareOption[] = [
    {
      id: 'public-link',
      name: 'Public Link',
      description: 'Share via a public URL that anyone can access',
      icon: <Link className="h-6 w-6" />,
      features: ['No login required', 'Custom expiry', 'View tracking', 'Social sharing'],
      premium: false
    },
    {
      id: 'private-link',
      name: 'Private Link',
      description: 'Password-protected sharing for secure access',
      icon: <Shield className="h-6 w-6" />,
      features: ['Password protection', 'Access control', 'Download limits', 'Watermarking'],
      premium: true
    },
    {
      id: 'email-share',
      name: 'Email Sharing',
      description: 'Send photos directly to email addresses',
      icon: <Mail className="h-6 w-6" />,
      features: ['Bulk email', 'Custom templates', 'Delivery tracking', 'Auto-reminders'],
      premium: false
    },
    {
      id: 'qr-code',
      name: 'QR Code',
      description: 'Generate QR codes for easy mobile access',
      icon: <QrCode className="h-6 w-6" />,
      features: ['Instant access', 'Mobile optimized', 'Print ready', 'Custom design'],
      premium: true
    }
  ];

  const recentShares: SharedLink[] = [
    {
      id: '1',
      title: 'Summer Wedding 2024',
      url: 'https://laurence77.github.io/share/wedding-2024',
      views: 245,
      downloads: 89,
      expires: '7 days',
      protected: false,
      thumbnail: getImagePath('/uploads/a0278ce1-b82d-4ed6-a186-14a9503ef65c.png')
    },
    {
      id: '2',
      title: 'Corporate Event Photos',
      url: 'https://laurence77.github.io/share/corporate-event',
      views: 123,
      downloads: 45,
      expires: '14 days',
      protected: true,
      thumbnail: getImagePath('/uploads/34a58283-8b82-48f9-88f4-2c88b069921d.png')
    },
    {
      id: '3',
      title: 'Family Portrait Session',
      url: 'https://laurence77.github.io/share/family-portraits',
      views: 67,
      downloads: 34,
      expires: '30 days',
      protected: false,
      thumbnail: getImagePath('/uploads/47f9a1d0-4458-400a-8fc0-79adf093cf18.png')
    }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
              <Share2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Smart Sharing
              </h1>
              <p className="text-gray-600 mt-1">
                Share your photos securely with advanced privacy controls
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="share" className="space-y-6">
          <TabsList className="grid w-full lg:w-[600px] grid-cols-3">
            <TabsTrigger value="share">Share Photos</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="share">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Share Configuration */}
              <div className="lg:col-span-2 space-y-6">
                {/* Quick Share */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Share</CardTitle>
                    <CardDescription>
                      Create and customize your shareable link
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Share URL</label>
                      <div className="flex gap-2">
                        <Input 
                          value={shareUrl} 
                          onChange={(e) => setShareUrl(e.target.value)}
                          className="flex-1"
                        />
                        <Button onClick={() => copyToClipboard(shareUrl)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Message (Optional)</label>
                      <Textarea 
                        value={shareMessage}
                        onChange={(e) => setShareMessage(e.target.value)}
                        placeholder="Add a personal message..."
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Link Expires</label>
                        <select 
                          value={linkExpiry}
                          onChange={(e) => setLinkExpiry(e.target.value)}
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="1d">1 day</option>
                          <option value="7d">7 days</option>
                          <option value="30d">30 days</option>
                          <option value="never">Never</option>
                        </select>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">Password Protection</label>
                          <Switch
                            checked={passwordProtected}
                            onCheckedChange={setPasswordProtected}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">Allow Downloads</label>
                          <Switch
                            checked={downloadEnabled}
                            onCheckedChange={setDownloadEnabled}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button className="flex-1">
                        <Share2 className="h-4 w-4 mr-2" />
                        Create Share Link
                      </Button>
                      <Button variant="outline">
                        <QrCode className="h-4 w-4 mr-2" />
                        Generate QR
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Share Options */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Sharing Options</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {shareOptions.map((option) => (
                      <Card key={option.id} className="cursor-pointer hover:shadow-lg transition-shadow duration-300">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                                {option.icon}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <CardTitle className="text-base">{option.name}</CardTitle>
                                  {option.premium && (
                                    <Badge variant="secondary" className="text-xs bg-gradient-to-r from-yellow-100 to-orange-100">
                                      Pro
                                    </Badge>
                                  )}
                                </div>
                                <CardDescription className="text-sm">
                                  {option.description}
                                </CardDescription>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-2">
                            {option.features.map((feature) => (
                              <div key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                                {feature}
                              </div>
                            ))}
                          </div>
                          <Button className="w-full mt-3" variant="outline">
                            {option.premium ? 'Upgrade to Use' : 'Select'}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Shares */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Recent Shares
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentShares.map((share) => (
                        <div key={share.id} className="p-3 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center gap-3 mb-2">
                            <img
                              src={share.thumbnail}
                              alt={share.title}
                              className="w-10 h-10 rounded object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = getImagePath('/placeholder.svg');
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{share.title}</p>
                              <div className="flex items-center gap-2 mt-1">
                                {share.protected && (
                                  <Shield className="h-3 w-3 text-blue-600" />
                                )}
                                <span className="text-xs text-gray-600">
                                  Expires in {share.expires}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-2">
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {share.views} views
                            </div>
                            <div className="flex items-center gap-1">
                              <Download className="h-3 w-3" />
                              {share.downloads} downloads
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline" className="text-xs flex-1">
                              <Copy className="h-3 w-3 mr-1" />
                              Copy
                            </Button>
                            <Button size="sm" variant="outline" className="text-xs">
                              <Settings className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button className="w-full mt-4" variant="outline">
                      View All Shares
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="social">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Connected Platforms */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Social Media Platforms</h3>
                <div className="space-y-4">
                  {socialPlatforms.map((platform) => (
                    <Card key={platform.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 bg-gradient-to-r ${platform.color} rounded-lg text-white`}>
                              {platform.icon}
                            </div>
                            <div>
                              <h4 className="font-medium">{platform.name}</h4>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Users className="h-3 w-3" />
                                {platform.followers.toLocaleString()} followers
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            {platform.connected ? (
                              <Badge className="bg-green-100 text-green-800">Connected</Badge>
                            ) : (
                              <Button size="sm">Connect</Button>
                            )}
                          </div>
                        </div>
                        
                        {platform.connected && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                              <span>Engagement Rate</span>
                              <span className="font-medium">{platform.engagement}%</span>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" className="flex-1">
                                <Share2 className="h-3 w-3 mr-1" />
                                Post
                              </Button>
                              <Button size="sm" variant="outline">
                                <Zap className="h-3 w-3 mr-1" />
                                Schedule
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Social Sharing Tools */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Sharing Tools</h3>
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Auto-Posting</CardTitle>
                      <CardDescription>
                        Automatically share new photos to connected platforms
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Enable Auto-Post</span>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Add Watermark</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Include Event Tags</span>
                        <Switch defaultChecked />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Content Optimization</CardTitle>
                      <CardDescription>
                        AI-powered optimization for each platform
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Instagram className="h-4 w-4 text-pink-600" />
                          <span className="text-sm font-medium">Instagram Stories</span>
                        </div>
                        <p className="text-xs text-gray-600">
                          Auto-resize and add trending hashtags
                        </p>
                      </div>
                      <div className="p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Facebook className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium">Facebook Posts</span>
                        </div>
                        <p className="text-xs text-gray-600">
                          Optimize posting times and captions
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Analytics Integration</CardTitle>
                      <CardDescription>
                        Track performance across platforms
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">2.4k</div>
                          <div className="text-xs text-gray-600">Total Reach</div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-pink-600">156</div>
                          <div className="text-xs text-gray-600">Engagements</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Views
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600 mb-2">1,247</div>
                  <p className="text-sm text-gray-600">+23% from last week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Downloads
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600 mb-2">342</div>
                  <p className="text-sm text-gray-600">+15% from last week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Share2 className="h-5 w-5" />
                    Shares
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600 mb-2">89</div>
                  <p className="text-sm text-gray-600">+8% from last week</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}