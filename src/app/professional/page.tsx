'use client';

import React from 'react';
import Link from 'next/link';
import {
  Calendar,
  Users,
  DollarSign,
  Star,
  TrendingUp,
  Clock,
  CheckCircle,
  FileText,
  Settings,
  ArrowRight,
  BarChart3,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';

const mockStats = {
  totalPatients: 156,
  upcomingAppointments: 12,
  monthlyEarnings: 485000,
  averageRating: 4.8,
};

const mockAppointments = [
  {
    id: '1',
    patient: 'John Smith',
    service: 'Cardiology Consultation',
    time: '10:00 AM',
    date: 'Today',
  },
  { id: '2', patient: 'Sarah Johnson', service: 'Follow-up', time: '11:30 AM', date: 'Today' },
  {
    id: '3',
    patient: 'Michael Brown',
    service: 'Initial Consultation',
    time: '2:00 PM',
    date: 'Tomorrow',
  },
];

const mockReviews = [
  {
    id: '1',
    patient: 'Emily Davis',
    rating: 5,
    comment: 'Excellent doctor, very thorough.',
    date: '2 days ago',
  },
  {
    id: '2',
    patient: 'Robert Wilson',
    rating: 5,
    comment: 'Great experience, highly recommend.',
    date: '1 week ago',
  },
];

export default function ProfessionalDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Professional Dashboard
          </h1>
          <p className="text-slate-500 font-medium mt-1">Manage your practice and appointments</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/professional/services">
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Manage Services
            </Button>
          </Link>
          <Link href="/search">
            <Button>
              <Calendar className="w-4 h-4 mr-2" />
              View Schedule
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:-translate-y-1 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Patients</p>
                <p className="text-3xl font-bold text-slate-900 tracking-tight mt-1">
                  {mockStats.totalPatients}
                </p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:-translate-y-1 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Upcoming</p>
                <p className="text-3xl font-bold text-slate-900 tracking-tight mt-1">
                  {mockStats.upcomingAppointments}
                </p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:-translate-y-1 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Monthly Earnings</p>
                <p className="text-3xl font-bold text-emerald-600 tracking-tight mt-1">
                  ${(mockStats.monthlyEarnings / 100).toLocaleString()}
                </p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:-translate-y-1 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Rating</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-3xl font-bold text-slate-900">{mockStats.averageRating}</p>
                  <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                </div>
              </div>
              <div className="h-12 w-12 rounded-xl bg-amber-50 flex items-center justify-center">
                <Star className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Today's Schedule */}
        <Card>
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-slate-900 tracking-tight flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Today&apos;s Schedule
              </CardTitle>
              <Link href="/professional/calendar">
                <Button variant="ghost" size="sm" className="gap-1">
                  View all <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {mockAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-slate-50/50 hover:bg-slate-100/50 transition-colors"
                >
                  <Avatar name={apt.patient} size="md" />
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">{apt.patient}</p>
                    <p className="text-sm text-slate-500 font-medium">{apt.service}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">{apt.time}</p>
                    <p className="text-sm text-slate-500 font-medium">{apt.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Reviews */}
        <Card>
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-slate-900 tracking-tight flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500" />
                Recent Reviews
              </CardTitle>
              <Link href="/professional/reviews">
                <Button variant="ghost" size="sm" className="gap-1">
                  View all <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {mockReviews.map((review) => (
                <div key={review.id} className="p-4 rounded-xl bg-slate-50/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Avatar name={review.patient} size="sm" />
                      <span className="font-semibold text-slate-900">{review.patient}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-600 font-medium text-sm">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                  <p className="text-xs text-slate-400 font-medium mt-2">{review.date}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
          <CardTitle className="text-slate-900 tracking-tight">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/professional/services">
              <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all cursor-pointer group">
                <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">My Services</p>
                  <p className="text-sm text-slate-500 font-medium">Manage listings</p>
                </div>
              </div>
            </Link>
            <Link href="/professional/calendar">
              <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all cursor-pointer group">
                <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Calendar</p>
                  <p className="text-sm text-slate-500 font-medium">Schedule</p>
                </div>
              </div>
            </Link>
            <Link href="/professional/patients">
              <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 transition-all cursor-pointer group">
                <div className="h-12 w-12 rounded-xl bg-purple-50 flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Patients</p>
                  <p className="text-sm text-slate-500 font-medium">View history</p>
                </div>
              </div>
            </Link>
            <Link href="/professional/settings">
              <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 transition-all cursor-pointer group">
                <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center">
                  <Settings className="h-6 w-6 text-slate-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Settings</p>
                  <p className="text-sm text-slate-500 font-medium">Configure</p>
                </div>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Earnings Overview */}
      <Card>
        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
          <CardTitle className="text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            Earnings Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center p-6 rounded-xl bg-slate-50/50">
              <p className="text-sm text-slate-500 font-medium mb-2">This Week</p>
              <p className="text-2xl font-bold text-slate-900">$1,250</p>
              <p className="text-sm text-emerald-600 font-medium mt-1 flex items-center justify-center gap-1">
                <TrendingUp className="w-4 h-4" /> +12%
              </p>
            </div>
            <div className="text-center p-6 rounded-xl bg-slate-50/50">
              <p className="text-sm text-slate-500 font-medium mb-2">This Month</p>
              <p className="text-2xl font-bold text-slate-900">$4,850</p>
              <p className="text-sm text-emerald-600 font-medium mt-1 flex items-center justify-center gap-1">
                <TrendingUp className="w-4 h-4" /> +8%
              </p>
            </div>
            <div className="text-center p-6 rounded-xl bg-slate-50/50">
              <p className="text-sm text-slate-500 font-medium mb-2">Pending Payout</p>
              <p className="text-2xl font-bold text-slate-900">$2,400</p>
              <Button size="sm" variant="outline" className="mt-2">
                <DollarSign className="w-4 h-4 mr-1" />
                Withdraw
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
