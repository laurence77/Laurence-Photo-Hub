import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, UserCheck, Shield, Settings } from 'lucide-react';

export default function FeaturesRoles() {
  const roles = [
    { name: 'Admin', users: 2, permissions: ['Full Access', 'User Management', 'Settings'] },
    { name: 'Photographer', users: 5, permissions: ['Upload Photos', 'Manage Events', 'View Analytics'] },
    { name: 'Guest', users: 150, permissions: ['View Photos', 'Download', 'Comment'] }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                User Roles
              </h1>
              <p className="text-gray-600 mt-1">
                Manage user permissions and access levels
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5" />
                  {role.name}
                </CardTitle>
                <CardDescription>{role.users} active users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  {role.permissions.map((permission, i) => (
                    <Badge key={i} variant="secondary">{permission}</Badge>
                  ))}
                </div>
                <Button className="w-full" variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Manage Role
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}