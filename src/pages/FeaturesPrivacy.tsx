import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Shield, Lock, Eye, EyeOff, Users, Globe, Database } from 'lucide-react';

export default function FeaturesPrivacy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Privacy Controls
              </h1>
              <p className="text-gray-600 mt-1">
                Advanced privacy settings and data protection
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <EyeOff className="h-5 w-5" />
                Visibility Settings
              </CardTitle>
              <CardDescription>Control who can see your content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Public Profile</span>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <span>Private Albums</span>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Data Protection
              </CardTitle>
              <CardDescription>Manage your data privacy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Encryption Enabled</span>
                <Badge variant="secondary">Active</Badge>
              </div>
              <Button className="w-full">Download My Data</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}