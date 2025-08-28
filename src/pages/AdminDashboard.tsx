import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, Users, Settings, BarChart3, Shield, TrendingUp, Camera, Share2, ArrowLeft, Activity, DollarSign, UserCheck, AlertTriangle } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const stats = [
    {
      title: "Total Revenue",
      value: "$12,345",
      change: "+12.5%",
      icon: <DollarSign className="h-4 w-4" />,
      trend: "up"
    },
    {
      title: "Active Users",
      value: "2,456",
      change: "+8.2%", 
      icon: <UserCheck className="h-4 w-4" />,
      trend: "up"
    },
    {
      title: "Total Events",
      value: "184",
      change: "+23.1%",
      icon: <Camera className="h-4 w-4" />,
      trend: "up"
    },
    {
      title: "System Health",
      value: "99.9%",
      change: "Stable",
      icon: <Activity className="h-4 w-4" />,
      trend: "stable"
    }
  ];

  const recentActivities = [
    { id: 1, action: "New B2B client registered", time: "2 minutes ago", type: "b2b" },
    { id: 2, action: "Premium subscription purchased", time: "15 minutes ago", type: "revenue" },
    { id: 3, action: "Security scan completed", time: "1 hour ago", type: "security" },
    { id: 4, action: "B2C user uploaded 25 photos", time: "2 hours ago", type: "b2c" },
    { id: 5, action: "System backup completed", time: "3 hours ago", type: "system" }
  ];

  const quickActions = [
    {
      title: "B2B Management",
      description: "Manage corporate clients and enterprise accounts",
      icon: <Building className="w-5 h-5" />,
      action: () => navigate('/admin/b2b'),
      color: "blue"
    },
    {
      title: "B2C Management", 
      description: "Handle individual customers and subscriptions",
      icon: <Users className="w-5 h-5" />,
      action: () => navigate('/admin/b2c'),
      color: "green"
    },
    {
      title: "System Settings",
      description: "Configure platform and API settings",
      icon: <Settings className="w-5 h-5" />,
      action: () => navigate('/admin/settings'),
      color: "purple"
    },
    {
      title: "Analytics Hub",
      description: "View performance metrics and reports",
      icon: <BarChart3 className="w-5 h-5" />,
      action: () => navigate('/analytics/events'),
      color: "orange"
    },
    {
      title: "Security Center",
      description: "Monitor security and compliance",
      icon: <Shield className="w-5 h-5" />,
      action: () => navigate('/security'),
      color: "red"
    },
    {
      title: "Support Center",
      description: "Manage customer support tickets",
      icon: <Users className="w-5 h-5" />,
      action: () => navigate('/support'),
      color: "teal"
    }
  ];

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
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">Welcome to the admin dashboard</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              System Online
            </Badge>
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
                    <p className={`text-sm ${stat.trend === 'up' ? 'text-green-600' : stat.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                      {stat.change}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Access key administrative functions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <div
                      key={index}
                      onClick={action.action}
                      className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 cursor-pointer transition-colors hover:bg-gray-50"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          action.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                          action.color === 'green' ? 'bg-green-100 text-green-600' :
                          action.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                          action.color === 'orange' ? 'bg-orange-100 text-orange-600' :
                          action.color === 'red' ? 'bg-red-100 text-red-600' :
                          'bg-teal-100 text-teal-600'
                        }`}>
                          {action.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{action.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest system events and user actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === 'b2b' ? 'bg-blue-500' :
                        activity.type === 'b2c' ? 'bg-green-500' :
                        activity.type === 'revenue' ? 'bg-orange-500' :
                        activity.type === 'security' ? 'bg-red-500' :
                        'bg-gray-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* System Status */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Performance</h3>
                <p className="text-sm text-gray-600 mt-1">All systems optimal</p>
                <Badge variant="outline" className="mt-2 bg-green-50 text-green-700 border-green-200">
                  Excellent
                </Badge>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Security</h3>
                <p className="text-sm text-gray-600 mt-1">All security checks passed</p>
                <Badge variant="outline" className="mt-2 bg-blue-50 text-blue-700 border-blue-200">
                  Secure
                </Badge>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <AlertTriangle className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Alerts</h3>
                <p className="text-sm text-gray-600 mt-1">2 minor issues to review</p>
                <Badge variant="outline" className="mt-2 bg-orange-50 text-orange-700 border-orange-200">
                  2 Pending
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;