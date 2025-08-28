import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Crown, Shield, Users, Settings, Database, Activity, AlertTriangle, Eye, UserX, Lock, Unlock, BarChart3, DollarSign, Building } from "lucide-react";
import SuperAdminLogin from '@/components/SuperAdminLogin';

const SuperAdmin = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <SuperAdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  const systemStats = [
    {
      title: "Total System Revenue",
      value: "$89,450",
      change: "+15.2%",
      icon: <DollarSign className="h-4 w-4" />,
      color: "green"
    },
    {
      title: "All Users",
      value: "2,583",
      change: "+8.7%",
      icon: <Users className="h-4 w-4" />,
      color: "blue"
    },
    {
      title: "Admin Accounts",
      value: "12",
      change: "+2",
      icon: <Shield className="h-4 w-4" />,
      color: "purple"
    },
    {
      title: "System Health",
      value: "99.9%",
      change: "Optimal",
      icon: <Activity className="h-4 w-4" />,
      color: "green"
    }
  ];

  const adminUsers = [
    {
      id: 1,
      name: "John Smith",
      email: "john@laurence.com",
      role: "Admin",
      status: "active",
      lastLogin: "2 hours ago",
      permissions: ["B2B", "B2C", "Analytics"]
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@laurence.com", 
      role: "Admin",
      status: "active",
      lastLogin: "1 day ago",
      permissions: ["B2C", "Support"]
    },
    {
      id: 3,
      name: "Mike Wilson",
      email: "mike@laurence.com",
      role: "Admin",
      status: "inactive",
      lastLogin: "1 week ago",
      permissions: ["Analytics", "Settings"]
    }
  ];

  const recentUserAccounts = [
    {
      id: 1,
      name: "Emily Davis",
      email: "emily@example.com",
      plan: "Premium",
      status: "active",
      revenue: "$19.99",
      joined: "2024-03-25"
    },
    {
      id: 2,
      name: "David Chen",
      email: "david@example.com",
      plan: "Free",
      status: "active", 
      revenue: "$0.00",
      joined: "2024-03-24"
    },
    {
      id: 3,
      name: "Lisa Rodriguez",
      email: "lisa@example.com",
      plan: "Pro",
      status: "trial",
      revenue: "$9.99",
      joined: "2024-03-23"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'trial':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Trial</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'Premium':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Premium</Badge>;
      case 'Pro':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Pro</Badge>;
      case 'Free':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Free</Badge>;
      default:
        return <Badge variant="outline">{plan}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-purple-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Super Admin Control Panel
                </h1>
                <p className="text-gray-600">Master system control and oversight</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                Super Admin
              </Badge>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsAuthenticated(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {systemStats.map((stat, index) => (
            <Card key={index} className="border-purple-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-green-600">{stat.change}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    stat.color === 'green' ? 'bg-green-100 text-green-600' :
                    stat.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                    stat.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Master Controls */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Card className="border-purple-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-600" />
                Admin Management
              </CardTitle>
              <CardDescription>Control admin accounts and permissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => navigate('/admin')}
                className="w-full justify-start bg-purple-600 hover:bg-purple-700"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Admin Panel
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start border-purple-200 hover:bg-purple-50"
              >
                <Settings className="w-4 h-4 mr-2" />
                Manage Admin Users
              </Button>
            </CardContent>
          </Card>

          <Card className="border-blue-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                User Control
              </CardTitle>
              <CardDescription>Manage all user accounts and access</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => navigate('/account')}
                className="w-full justify-start bg-blue-600 hover:bg-blue-700"
              >
                <Eye className="w-4 h-4 mr-2" />
                View User Accounts
              </Button>
              <Button 
                variant="outline"
                className="w-full justify-start border-blue-200 hover:bg-blue-50"
              >
                <UserX className="w-4 h-4 mr-2" />
                Suspend Users
              </Button>
            </CardContent>
          </Card>

          <Card className="border-amber-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-amber-600" />
                System Control
              </CardTitle>
              <CardDescription>Master system configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline"
                className="w-full justify-start border-green-200 hover:bg-green-50"
              >
                <Unlock className="w-4 h-4 mr-2" />
                Enable Maintenance
              </Button>
              <Button 
                variant="outline"
                className="w-full justify-start border-red-200 hover:bg-red-50"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Emergency Shutdown
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Admin Users Table */}
          <Card className="border-purple-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Admin Users
              </CardTitle>
              <CardDescription>Manage administrator accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminUsers.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">{admin.name}</div>
                          <div className="text-sm text-gray-500">{admin.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(admin.status)}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-500">{admin.lastLogin}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Lock className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Recent User Accounts */}
          <Card className="border-blue-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Recent User Accounts
              </CardTitle>
              <CardDescription>Latest user registrations</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentUserAccounts.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getPlanBadge(user.plan)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(user.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <UserX className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Quick Access */}
        <Card className="mt-6 border-indigo-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              Quick Access Dashboard
            </CardTitle>
            <CardDescription>Direct access to all system areas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/admin/dashboard')}
                className="h-20 flex-col border-purple-200 hover:bg-purple-50"
              >
                <BarChart3 className="w-5 h-5 mb-1" />
                <span className="text-xs">Admin Dashboard</span>
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/admin/b2b')}
                className="h-20 flex-col border-blue-200 hover:bg-blue-50"
              >
                <Building className="w-5 h-5 mb-1" />
                <span className="text-xs">B2B Management</span>
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/admin/b2c')}
                className="h-20 flex-col border-green-200 hover:bg-green-50"
              >
                <Users className="w-5 h-5 mb-1" />
                <span className="text-xs">B2C Management</span>
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/admin/settings')}
                className="h-20 flex-col border-orange-200 hover:bg-orange-50"
              >
                <Settings className="w-5 h-5 mb-1" />
                <span className="text-xs">System Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuperAdmin;