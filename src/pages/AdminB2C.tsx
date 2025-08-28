import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Users, Plus, Search, Filter, MoreHorizontal, Camera, DollarSign, Crown, TrendingUp } from "lucide-react";

const AdminB2C = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState('all');

  const stats = [
    {
      title: "Total Users",
      value: "2,456",
      change: "+8.2%",
      icon: <Users className="h-4 w-4" />,
    },
    {
      title: "Premium Subscribers",
      value: "487",
      change: "+15%",
      icon: <Crown className="h-4 w-4" />,
    },
    {
      title: "Monthly Revenue",
      value: "$12,340",
      change: "+12%",
      icon: <DollarSign className="h-4 w-4" />,
    },
    {
      title: "Photos Uploaded",
      value: "45,234",
      change: "+22%",
      icon: <Camera className="h-4 w-4" />,
    }
  ];

  const users = [
    {
      id: 1,
      name: "Emily Johnson",
      email: "emily@example.com",
      plan: "Premium",
      status: "active",
      revenue: "$19.99",
      photosUploaded: 1247,
      joined: "2023-12-15",
      lastActive: "2 hours ago"
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael@example.com",
      plan: "Free",
      status: "active",
      revenue: "$0.00",
      photosUploaded: 234,
      joined: "2024-01-20",
      lastActive: "1 day ago"
    },
    {
      id: 3,
      name: "Sarah Williams",
      email: "sarah@example.com",
      plan: "Pro",
      status: "active",
      revenue: "$9.99",
      photosUploaded: 567,
      joined: "2024-02-10",
      lastActive: "3 hours ago"
    },
    {
      id: 4,
      name: "David Rodriguez",
      email: "david@example.com",
      plan: "Premium",
      status: "trial",
      revenue: "$0.00",
      photosUploaded: 89,
      joined: "2024-03-25",
      lastActive: "5 minutes ago"
    },
    {
      id: 5,
      name: "Lisa Anderson",
      email: "lisa@example.com",
      plan: "Free",
      status: "inactive",
      revenue: "$0.00",
      photosUploaded: 45,
      joined: "2023-11-05",
      lastActive: "2 weeks ago"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case 'trial':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Trial</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/admin')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Admin
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">B2C Management</h1>
                <p className="text-gray-600">Manage individual customers and subscriptions</p>
              </div>
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add User
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-green-600">{stat.change}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterPlan} onValueChange={setFilterPlan}>
                  <SelectTrigger className="w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Plans</SelectItem>
                    <SelectItem value="Premium">Premium</SelectItem>
                    <SelectItem value="Pro">Pro</SelectItem>
                    <SelectItem value="Free">Free</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Individual Customers</CardTitle>
            <CardDescription>
              Manage your B2C users and their subscriptions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Photos</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
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
                      <span className={`font-medium ${user.revenue === '$0.00' ? 'text-gray-500' : 'text-green-600'}`}>
                        {user.revenue}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Camera className="w-4 h-4 text-gray-400" />
                        {user.photosUploaded.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-500">{user.lastActive}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-500">{user.joined}</span>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Plus className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Add New User</h3>
                  <p className="text-sm text-gray-600">Create a new customer account</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Crown className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Subscription Analytics</h3>
                  <p className="text-sm text-gray-600">View subscription metrics</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Usage Reports</h3>
                  <p className="text-sm text-gray-600">View user activity reports</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Signups */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recent Signups</CardTitle>
            <CardDescription>
              Latest user registrations this week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.slice(0, 3).map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    {getPlanBadge(user.plan)}
                    <div className="text-xs text-gray-500 mt-1">{user.joined}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminB2C;