import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BarChart3, TrendingUp, Eye, Download, Heart, Camera } from 'lucide-react';
import { getImagePath } from '@/lib/utils';

export default function AnalyticsPhotos() {
  const topPhotos = [
    {
      id: '1',
      title: 'Wedding Ceremony Shot',
      views: 1247,
      downloads: 89,
      likes: 234,
      thumbnail: getImagePath('/uploads/a0278ce1-b82d-4ed6-a186-14a9503ef65c.png')
    },
    {
      id: '2',
      title: 'Corporate Event',
      views: 892,
      downloads: 56,
      likes: 167,
      thumbnail: getImagePath('/uploads/34a58283-8b82-48f9-88f4-2c88b069921d.png')
    },
    {
      id: '3',
      title: 'Family Portrait',
      views: 654,
      downloads: 34,
      likes: 123,
      thumbnail: getImagePath('/uploads/47f9a1d0-4458-400a-8fc0-79adf093cf18.png')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Photo Analytics
              </h1>
              <p className="text-gray-600 mt-1">
                Detailed insights into your photo performance
              </p>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Views</p>
                  <p className="text-2xl font-bold text-gray-900">12,847</p>
                </div>
                <Eye className="h-8 w-8 text-blue-600" />
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600 font-medium">+23.1%</span>
                <span className="text-sm text-gray-600 ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Downloads</p>
                  <p className="text-2xl font-bold text-gray-900">1,456</p>
                </div>
                <Download className="h-8 w-8 text-green-600" />
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600 font-medium">+8.2%</span>
                <span className="text-sm text-gray-600 ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Likes</p>
                  <p className="text-2xl font-bold text-gray-900">3,421</p>
                </div>
                <Heart className="h-8 w-8 text-red-600" />
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600 font-medium">+15.7%</span>
                <span className="text-sm text-gray-600 ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Photos</p>
                  <p className="text-2xl font-bold text-gray-900">847</p>
                </div>
                <Camera className="h-8 w-8 text-purple-600" />
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600 font-medium">+12.3%</span>
                <span className="text-sm text-gray-600 ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Performing Photos */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Photos</CardTitle>
            <CardDescription>Your most popular photos this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPhotos.map((photo, index) => (
                <div key={photo.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-gray-400 w-8">
                    #{index + 1}
                  </div>
                  <img
                    src={photo.thumbnail}
                    alt={photo.title}
                    className="w-16 h-16 rounded-lg object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = getImagePath('/placeholder.svg');
                    }}
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{photo.title}</h4>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {photo.views.toLocaleString()} views
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="h-4 w-4" />
                        {photo.downloads} downloads
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {photo.likes} likes
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600 mb-2">Engagement</div>
                    <Progress value={(photo.views / 1500) * 100} className="w-24" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}