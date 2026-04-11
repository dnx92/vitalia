'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Settings,
  Bell,
  Shield,
  CreditCard,
  Calendar,
  Wallet,
  Heart,
  ChevronRight,
  Edit,
  CheckCircle,
  Search,
} from 'lucide-react';

type Appointment = {
  id: string;
  status: string;
};

export default function AccountPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    upcomingAppointments: 0,
    completedAppointments: 0,
    totalSpent: 0,
    healthLogs: 0,
  });

  useEffect(() => {
    // Fetch user stats
    const fetchStats = async () => {
      if (!user?.id) return;

      try {
        const [aptRes, walletRes, healthRes] = await Promise.all([
          fetch(`/api/appointments?userId=${user.id}&limit=100`),
          fetch(`/api/wallet?userId=${user.id}`),
          fetch(`/api/health?userId=${user.id}`),
        ]);

        const aptData = await aptRes.json();
        const walletData = await walletRes.json();
        const healthData = await healthRes.json();

        const appointments = (aptData.data || []) as Appointment[];
        setStats({
          upcomingAppointments: appointments.filter(
            (a) => a.status === 'PENDING' || a.status === 'CONFIRMED'
          ).length,
          completedAppointments: appointments.filter((a) => a.status === 'COMPLETED').length,
          totalSpent: walletData.data?.wallet?.balance || 0,
          healthLogs: (healthData.data || []).length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, [user?.id]);

  const accountSections = [
    {
      href: '/account/profile',
      title: 'Profile Information',
      description: 'Update your personal details and photo',
      icon: User,
      color: 'blue',
    },
    {
      href: '/account/settings',
      title: 'Account Settings',
      description: 'Manage your preferences and settings',
      icon: Settings,
      color: 'purple',
    },
    {
      href: '/account/notifications',
      title: 'Notifications',
      description: 'Configure how you receive alerts',
      icon: Bell,
      color: 'amber',
    },
    {
      href: '/account/security',
      title: 'Security',
      description: 'Password, 2FA, and login history',
      icon: Shield,
      color: 'emerald',
    },
    {
      href: '/account/payments',
      title: 'Payment Methods',
      description: 'Manage your cards and billing',
      icon: CreditCard,
      color: 'rose',
    },
  ];

  const quickActions = [
    { href: '/search', label: 'Find a Doctor', icon: Search, color: 'bg-blue-100 text-blue-600' },
    {
      href: '/dashboard/appointments',
      label: 'My Appointments',
      icon: Calendar,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      href: '/dashboard/wallet',
      label: 'Wallet',
      icon: Wallet,
      color: 'bg-teal-100 text-teal-600',
    },
    {
      href: '/dashboard/health',
      label: 'Health Log',
      icon: Heart,
      color: 'bg-rose-100 text-rose-600',
    },
  ];

  const colorClasses: Record<string, { bg: string; text: string; icon: string }> = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-600', icon: 'bg-blue-50' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600', icon: 'bg-purple-50' },
    amber: { bg: 'bg-amber-100', text: 'text-amber-600', icon: 'bg-amber-50' },
    emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600', icon: 'bg-emerald-50' },
    rose: { bg: 'bg-rose-100', text: 'text-rose-600', icon: 'bg-rose-50' },
  };

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative">
              <Avatar src={user?.avatar} name={user?.name} size="lg" />
              <Link
                href="/account/profile"
                className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
              >
                <Edit className="w-4 h-4" />
              </Link>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
              <p className="text-gray-500 mt-1">{user?.email}</p>
              <div className="flex items-center gap-4 mt-3">
                <Badge variant={user?.role === 'ADMIN' ? 'default' : 'secondary'}>
                  {user?.role}
                </Badge>
                <span className="flex items-center gap-1 text-sm text-emerald-600">
                  <CheckCircle className="w-4 h-4" />
                  Verified Account
                </span>
              </div>
            </div>
            <Link href="/account/profile">
              <Button variant="outline" className="gap-2">
                <Edit className="w-4 h-4" />
                Edit Profile
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <CardContent className="p-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.upcomingAppointments}</p>
                <p className="text-sm text-gray-500">Upcoming</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="p-4">
          <CardContent className="p-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.completedAppointments}</p>
                <p className="text-sm text-gray-500">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="p-4">
          <CardContent className="p-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">${stats.totalSpent}</p>
                <p className="text-sm text-gray-500">Spent</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="p-4">
          <CardContent className="p-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center">
                <Heart className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.healthLogs}</p>
                <p className="text-sm text-gray-500">Health Logs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link key={action.href} href={action.href}>
                <div
                  className={`flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all cursor-pointer`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center`}
                  >
                    <action.icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{action.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Account Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Account Settings</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            {accountSections.map((section) => {
              const colors = colorClasses[section.color];
              return (
                <Link
                  key={section.href}
                  href={section.href}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center`}
                    >
                      <section.icon className={`w-5 h-5 ${colors.text}`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{section.title}</p>
                      <p className="text-sm text-gray-500">{section.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Recent Activity</CardTitle>
          <Link href="/dashboard" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View All
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                icon: Calendar,
                text: 'Appointment with Dr. Elena Martinez',
                time: '2 hours ago',
                color: 'text-blue-600',
              },
              {
                icon: CreditCard,
                text: 'Wallet topped up $100',
                time: 'Yesterday',
                color: 'text-teal-600',
              },
              {
                icon: Heart,
                text: 'Health metric recorded',
                time: '3 days ago',
                color: 'text-rose-600',
              },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50">
                <activity.icon className={`w-5 h-5 ${activity.color}`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.text}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
