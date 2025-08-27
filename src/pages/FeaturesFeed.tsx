import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, Eye, Rss } from 'lucide-react';
import { getImagePath } from '@/lib/utils';

export default function FeaturesFeed() {
  const feedItems = [
    {
      id: '1',
      type: 'photo',
      title: 'Beautiful sunset shot',
      author: 'John Photographer',
      time: '2 hours ago',
      likes: 45,
      comments: 12,
      shares: 8,
      image: getImagePath('/uploads/a0278ce1-b82d-4ed6-a186-14a9503ef65c.png')
    },
    {
      id: '2',
      type: 'event',
      title: 'Wedding ceremony completed',
      author: 'Sarah Events',
      time: '4 hours ago',
      likes: 23,
      comments: 6,
      shares: 3,
      image: getImagePath('/uploads/34a58283-8b82-48f9-88f4-2c88b069921d.png')
    },
    {
      id: '3',
      type: 'photo',
      title: 'Portrait session highlights',
      author: 'Mike Studio',
      time: '1 day ago',
      likes: 67,
      comments: 18,
      shares: 12,
      image: getImagePath('/uploads/47f9a1d0-4458-400a-8fc0-79adf093cf18.png')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg">
              <Rss className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                Activity Feed
              </h1>
              <p className="text-gray-600 mt-1">
                Stay updated with the latest photos and events
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {feedItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = getImagePath('/placeholder.svg');
                  }}
                />
                <Badge className="absolute top-4 left-4 bg-white/90 text-gray-800">
                  {item.type}
                </Badge>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="text-sm text-gray-600">by {item.author} • {item.time}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      {item.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      {item.comments}
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <Share2 className="h-4 w-4" />
                      {item.shares}
                    </Button>
                  </div>
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}