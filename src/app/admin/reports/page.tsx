'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp, Users, DollarSign, Calendar, Download, Filter } from 'lucide-react';
import { useAuthStore } from '@/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminReportsPage() {
  const { user: currentUser, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    } else if (currentUser && !currentUser.isAdmin) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, currentUser, router]);

  const reportCards = [
    {
      title: 'User Growth',
      description: 'Track new registrations over time',
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Revenue Report',
      description: 'Analyze platform earnings and revenue',
      icon: DollarSign,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Appointment Statistics',
      description: 'Booking trends and patterns',
      icon: Calendar,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Professional Performance',
      description: 'Top performers and ratings',
      icon: TrendingUp,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <p className="text-[--text-secondary]">Generate and download detailed reports</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export All Data
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {reportCards.map((report) => (
          <Card
            key={report.title}
            className="cursor-pointer hover:border-[--primary] transition-colors"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-[--radius-md] ${report.bgColor}`}>
                  <report.icon className={`h-6 w-6 ${report.color}`} />
                </div>
                <Badge variant="outline">Coming Soon</Badge>
              </div>
              <h3 className="mt-4 font-semibold">{report.title}</h3>
              <p className="mt-1 text-sm text-[--text-secondary]">{report.description}</p>
              <Button variant="outline" className="mt-4 w-full" disabled>
                Generate Report
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Platform Overview
            </CardTitle>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-[--text-secondary]" />
              <select className="rounded-[--radius] border border-[--border] bg-transparent px-3 py-1 text-sm">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>This year</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 items-center justify-center rounded-[--radius-md] bg-[--background]">
            <div className="text-center">
              <BarChart3 className="mx-auto h-12 w-12 text-[--text-secondary]" />
              <p className="mt-4 font-medium">Charts Coming Soon</p>
              <p className="text-sm text-[--text-secondary]">
                Connect to a real database to see live charts
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
