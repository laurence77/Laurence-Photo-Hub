import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  Users, 
  Camera, 
  Download, 
  Share2, 
  TrendingUp, 
  Eye, 
  Heart,
  MessageCircle,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { getImagePath } from '@/lib/utils';

interface EventMetric {
  id: string;
  name: string;
  date: string;
  totalPhotos: number;
  totalViews: number;
  totalDownloads: number;
  totalShares: number;
  totalLikes: number;
  totalComments: number;
  attendees: number;
  status: 'active' | 'completed' | 'upcoming';
  engagement: number;
  thumbnail: string;
}

interface EngagementData {
  metric: string;
  value: number;
  change: number;
  icon: React.ReactNode;
}

export default function AnalyticsEvents() {
  const eventMetrics: EventMetric[] = [
    {
      id: '1',
      name: 'Summer Wedding 2024',
      date: '2024-07-15',
      totalPhotos: 156,
      totalViews: 2450,
      totalDownloads: 89,
      totalShares: 34,
      totalLikes: 234,
      totalComments: 45,
      attendees: 120,
      status: 'completed',
      engagement: 85,
      thumbnail: getImagePath('/uploads/a0278ce1-b82d-4ed6-a186-14a9503ef65c.png')
    },
    {
      id: '2',
      name: 'Corporate Retreat',
      date: '2024-08-20',
      totalPhotos: 89,
      totalViews: 1230,
      totalDownloads: 45,
      totalShares: 12,
      totalLikes: 145,
      totalComments: 23,
      attendees: 50,
      status: 'active',
      engagement: 72,
      thumbnail: getImagePath('/uploads/34a58283-8b82-48f9-88f4-2c88b069921d.png')
    },
    {
      id: '3',
      name: 'Family Portraits',
      date: '2024-09-05',
      totalPhotos: 34,
      totalViews: 890,
      totalDownloads: 67,
      totalShares: 23,
      totalLikes: 98,
      totalComments: 12,
      attendees: 8,
      status: 'completed',
      engagement: 94,
      thumbnail: getImagePath('/uploads/47f9a1d0-4458-400a-8fc0-79adf093cf18.png')
    },
    {
      id: '4',
      name: 'Birthday Celebration',
      date: '2024-09-12',
      totalPhotos: 78,
      totalViews: 567,
      totalDownloads: 23,
      totalShares: 8,
      totalLikes: 67,
      totalComments: 19,
      attendees: 25,
      status: 'upcoming',
      engagement: 45,
      thumbnail: getImagePath('/uploads/af28398b-9e23-4e2b-9de1-bda457e09fd8.png')
    }
  ];

  const overallMetrics: EngagementData[] = [
    {
      metric: 'Total Views',
      value: 5137,
      change: 12.5,
      icon: <Eye className="h-4 w-4" />
    },
    {
      metric: 'Total Downloads',
      value: 224,
      change: 8.3,
      icon: <Download className="h-4 w-4" />
    },
    {
      metric: 'Total Shares',
      value: 77,
      change: -2.1,
      icon: <Share2 className="h-4 w-4" />
    },
    {
      metric: 'Total Engagement',
      value: 621,
      change: 15.7,
      icon: <Heart className="h-4 w-4" />
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Event Analytics
              </h1>
              <p className="text-gray-600 mt-1">
                Track performance and engagement across all your photo events
              </p>
            </div>
          </div>
        </div>

        {/* Overall Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {overallMetrics.map((metric, index) => (
            <Card key={index} className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{metric.metric}</p>
                    <p className="text-2xl font-bold text-gray-900">{metric.value.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full">
                    {metric.icon}
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp className={`h-4 w-4 mr-1 ${metric.change >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                  <span className={`text-sm font-medium ${metric.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.change >= 0 ? '+' : ''}{metric.change}%
                  </span>
                  <span className="text-sm text-gray-600 ml-1">vs last month</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full lg:w-[400px] grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="detailed">Detailed View</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {eventMetrics.map((event) => (
                <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="relative h-48">
                    <img
                      src={event.thumbnail}
                      alt={event.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = getImagePath('/placeholder.svg');
                      }}
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className={getStatusColor(event.status)}>
                        {event.status}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{event.name}</CardTitle>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(event.date)}
                      </div>
                    </div>
                    <CardDescription>
                      {event.attendees} attendees • {event.totalPhotos} photos
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-2 text-blue-600" />
                          <span>{event.totalViews} views</span>
                        </div>
                        <div className="flex items-center">
                          <Download className="h-4 w-4 mr-2 text-green-600" />
                          <span>{event.totalDownloads} downloads</span>
                        </div>
                        <div className="flex items-center">
                          <Share2 className="h-4 w-4 mr-2 text-purple-600" />
                          <span>{event.totalShares} shares</span>
                        </div>
                        <div className="flex items-center">
                          <Heart className="h-4 w-4 mr-2 text-red-600" />
                          <span>{event.totalLikes} likes</span>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Engagement Score</span>
                          <span className="text-sm text-gray-600">{event.engagement}%</span>
                        </div>
                        <Progress value={event.engagement} className="h-2" />
                      </div>

                      <Button className="w-full" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="detailed">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Event Analytics</CardTitle>
                <CardDescription>
                  Comprehensive metrics for all your photo events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4 font-medium">Event</th>
                        <th className="text-left p-4 font-medium">Status</th>
                        <th className="text-left p-4 font-medium">Date</th>
                        <th className="text-left p-4 font-medium">Photos</th>
                        <th className="text-left p-4 font-medium">Views</th>
                        <th className="text-left p-4 font-medium">Downloads</th>
                        <th className="text-left p-4 font-medium">Engagement</th>
                        <th className="text-left p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {eventMetrics.map((event) => (
                        <tr key={event.id} className="border-b hover:bg-gray-50">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={event.thumbnail}
                                alt={event.name}
                                className="w-12 h-12 rounded-lg object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = getImagePath('/placeholder.svg');
                                }}
                              />
                              <div>
                                <p className="font-medium">{event.name}</p>
                                <p className="text-sm text-gray-600">{event.attendees} attendees</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge className={getStatusColor(event.status)}>
                              {event.status}
                            </Badge>
                          </td>
                          <td className="p-4 text-sm text-gray-600">
                            {formatDate(event.date)}
                          </td>
                          <td className="p-4 font-medium">{event.totalPhotos}</td>
                          <td className="p-4">{event.totalViews.toLocaleString()}</td>
                          <td className="p-4">{event.totalDownloads}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Progress value={event.engagement} className="h-2 w-16" />
                              <span className="text-sm">{event.engagement}%</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <Button size="sm" variant="outline">
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}