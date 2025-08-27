import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, XCircle, Activity } from 'lucide-react';

export default function StatusPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-gray-600 to-green-600 rounded-lg">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-600 to-green-600 bg-clip-text text-transparent">
                System Status
              </h1>
              <p className="text-gray-600 mt-1">
                Current status of all services and systems
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Photo Upload
              </CardTitle>
              <CardDescription>All systems operational</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge className="bg-green-100 text-green-800">Operational</Badge>
              <p className="text-sm text-gray-600 mt-2">99.9% uptime</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                Image Processing
              </CardTitle>
              <CardDescription>Minor delays expected</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge className="bg-yellow-100 text-yellow-800">Degraded</Badge>
              <p className="text-sm text-gray-600 mt-2">Processing may take longer</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Sharing Services
              </CardTitle>
              <CardDescription>All sharing features working</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge className="bg-green-100 text-green-800">Operational</Badge>
              <p className="text-sm text-gray-600 mt-2">100% availability</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}