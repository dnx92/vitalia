"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Calendar, 
  Wallet, 
  Heart,
  TrendingUp,
  ArrowRight,
  Clock,
  Activity,
  CreditCard,
  Search,
  Loader2,
  Video,
  MapPin,
  Star,
  CheckCircle,
  Plus,
  ChevronRight,
  User,
  Bell,
  RefreshCw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";
import { useAuthStore } from "@/store";

interface DashboardData {
  upcomingAppointments: Appointment[];
  recentTransactions: Transaction[];
  healthMetrics: HealthMetric[];
  stats: {
    upcomingCount: number;
    completedCount: number;
    walletBalance: number;
    healthScore: number;
  };
}

interface Appointment {
  id: string;
  professional: { id: string; name: string; specialty: string; avatar?: string };
  service: string;
  date: string;
  startTime: string;
  status: string;
  price: number;
  isVirtual: boolean;
  rating?: number;
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  description?: string;
  createdAt: string;
}

interface HealthMetric {
  id: string;
  type: string;
  value: number;
  unit: string;
  recordedAt: string;
}

function DashboardContent() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth/login");
      return;
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!user?.id) return;
    fetchDashboardData();
  }, [user?.id]);

  const fetchDashboardData = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setIsLoading(true);
    
    try {
      const [appointmentsRes, walletRes, healthRes] = await Promise.all([
        fetch(`/api/appointments?userId=${user?.id}&status=PENDING,CONFIRMED&limit=5`),
        fetch(`/api/wallet?userId=${user?.id}&limit=10`),
        fetch(`/api/health?userId=${user?.id}&limit=5`),
      ]);

      const appointmentsData = await appointmentsRes.json();
      const walletData = await walletRes.json();
      const healthData = await healthRes.json();

      const appointments = appointmentsData.data || appointmentsData.appointments || [];
      const transactions = walletData.data?.transactions || walletData.transactions || [];
      const metrics = healthData.data || healthData.metrics || [];

      const completedCount = appointmentsData.meta?.total || 0;

      setData({
        upcomingAppointments: appointments.slice(0, 3),
        recentTransactions: transactions.slice(0, 5),
        healthMetrics: metrics.slice(0, 3),
        stats: {
          upcomingCount: appointments.length,
          completedCount,
          walletBalance: walletData.data?.wallet?.available || walletData.wallet?.available || 0,
          healthScore: metrics.length > 0 ? 85 : 0,
        },
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => fetchDashboardData(true);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            {getGreeting()}, {user?.name?.split(" ")[0] || "there"}
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Here&apos;s what&apos;s happening with your health today
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Link href="/search">
            <Button className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600">
              <Plus className="w-4 h-4 mr-2" />
              Book Appointment
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Upcoming</p>
                <p className="text-3xl font-bold text-slate-900 tracking-tight mt-1">{data?.stats.upcomingCount || 0}</p>
                <p className="text-xs text-slate-400 mt-1">appointments</p>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar className="h-7 w-7 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Completed</p>
                <p className="text-3xl font-bold text-slate-900 tracking-tight mt-1">{data?.stats.completedCount || 0}</p>
                <p className="text-xs text-slate-400 mt-1">total visits</p>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="h-7 w-7 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Wallet Balance</p>
                <p className="text-3xl font-bold text-blue-600 tracking-tight mt-1">{formatCurrency(data?.stats.walletBalance || 0)}</p>
                <p className="text-xs text-slate-400 mt-1">available funds</p>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-teal-100 to-teal-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Wallet className="h-7 w-7 text-teal-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Health Score</p>
                <p className="text-3xl font-bold text-emerald-600 tracking-tight mt-1">{data?.stats.healthScore || 0}%</p>
                <p className="text-xs text-slate-400 mt-1">based on metrics</p>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-rose-100 to-rose-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Heart className="h-7 w-7 text-rose-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Appointments Section - 2 columns */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between bg-slate-50/50 border-b border-slate-100 pb-4">
              <CardTitle className="text-lg text-slate-900 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Upcoming Appointments
              </CardTitle>
              <Link href="/dashboard/appointments">
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                  View all <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-6">
              {!data?.upcomingAppointments || data.upcomingAppointments.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                    <Calendar className="h-10 w-10 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">No upcoming appointments</h3>
                  <p className="text-slate-500 font-medium mb-6">Book your first appointment with a healthcare professional</p>
                  <Link href="/search">
                    <Button className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600">
                      <Search className="w-4 h-4 mr-2" />
                      Find a Doctor
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {data.upcomingAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl bg-slate-50/80 hover:bg-slate-100 transition-colors border border-slate-100"
                    >
                      <Avatar 
                        src={appointment.professional.avatar} 
                        name={appointment.professional.name} 
                        size="lg" 
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-slate-900 truncate">{appointment.professional.name}</h4>
                          <Badge 
                            variant={appointment.status === "CONFIRMED" ? "success" : "warning"}
                            className="text-xs"
                          >
                            {appointment.status === "CONFIRMED" ? "Confirmed" : "Pending"}
                          </Badge>
                        </div>
                        <p className="text-blue-600 text-sm font-medium">{appointment.professional.specialty}</p>
                        <p className="text-slate-500 text-sm mt-1">{appointment.service}</p>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-center">
                          <div className="flex items-center gap-1 text-slate-500 mb-1">
                            <Calendar className="h-4 w-4" />
                          </div>
                          <p className="font-semibold text-slate-900">{formatDate(new Date(appointment.date))}</p>
                          <p className="text-slate-400 text-xs">{formatTime(appointment.startTime)}</p>
                        </div>
                        <div className="text-center">
                          {appointment.isVirtual ? (
                            <Video className="h-4 w-4 mx-auto mb-1 text-purple-500" />
                          ) : (
                            <MapPin className="h-4 w-4 mx-auto mb-1 text-emerald-500" />
                          )}
                          <p className={`text-xs font-medium ${appointment.isVirtual ? "text-purple-600" : "text-emerald-600"}`}>
                            {appointment.isVirtual ? "Virtual" : "In-Person"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {appointment.status === "CONFIRMED" && appointment.isVirtual && (
                          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                            <Video className="w-4 h-4 mr-1" />
                            Join
                          </Button>
                        )}
                        <Link href={`/service/${appointment.professional.id}`}>
                          <Button variant="outline" size="sm">
                            Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Health Metrics */}
          <Card>
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
              <CardTitle className="text-lg text-slate-900 flex items-center gap-2">
                <Activity className="h-5 w-5 text-rose-600" />
                Health Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {!data?.healthMetrics || data.healthMetrics.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-500 font-medium">No metrics recorded</p>
                  <Link href="/dashboard/health">
                    <Button variant="outline" className="mt-3 w-full">
                      Track Health
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {data.healthMetrics.map((metric) => (
                    <div
                      key={metric.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                    >
                      <div>
                        <p className="font-semibold text-slate-900 capitalize">
                          {metric.type.replace('_', ' ')}
                        </p>
                        <p className="text-xs text-slate-400">
                          {formatDate(new Date(metric.recordedAt))}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-slate-900">{metric.value}</p>
                        <p className="text-xs text-slate-400">{metric.unit}</p>
                      </div>
                    </div>
                  ))}
                  <Link href="/dashboard/health" className="block">
                    <Button variant="ghost" className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                      View all metrics <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
              <CardTitle className="text-lg text-slate-900 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-teal-600" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {!data?.recentTransactions || data.recentTransactions.length === 0 ? (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-500 font-medium">No transactions yet</p>
                  <Link href="/dashboard/wallet">
                    <Button variant="outline" className="mt-3 w-full">
                      Add Funds
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.recentTransactions.slice(0, 4).map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                          tx.amount > 0 ? "bg-emerald-100" : "bg-slate-200"
                        }`}>
                          {tx.amount > 0 ? (
                            <ArrowRight className="h-4 w-4 text-emerald-600 rotate-180" />
                          ) : (
                            <ArrowRight className="h-4 w-4 text-slate-500" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {tx.description || tx.type.replace('_', ' ')}
                          </p>
                          <p className="text-xs text-slate-400">{formatDate(new Date(tx.createdAt))}</p>
                        </div>
                      </div>
                      <p className={`text-sm font-bold ${tx.amount > 0 ? "text-emerald-600" : "text-slate-900"}`}>
                        {tx.amount > 0 ? "+" : ""}{formatCurrency(Math.abs(tx.amount))}
                      </p>
                    </div>
                  ))}
                  <Link href="/dashboard/wallet" className="block">
                    <Button variant="ghost" className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                      View wallet <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
          <CardTitle className="text-lg text-slate-900">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/search">
              <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all cursor-pointer group">
                <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <Search className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Book Appointment</p>
                  <p className="text-sm text-slate-500 font-medium">Find a doctor</p>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/wallet">
              <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-teal-300 hover:bg-teal-50/50 transition-all cursor-pointer group">
                <div className="h-12 w-12 rounded-xl bg-teal-100 flex items-center justify-center group-hover:bg-teal-200 transition-colors">
                  <CreditCard className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Add Funds</p>
                  <p className="text-sm text-slate-500 font-medium">To wallet</p>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/health">
              <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-rose-300 hover:bg-rose-50/50 transition-all cursor-pointer group">
                <div className="h-12 w-12 rounded-xl bg-rose-100 flex items-center justify-center group-hover:bg-rose-200 transition-colors">
                  <Heart className="h-6 w-6 text-rose-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Track Health</p>
                  <p className="text-sm text-slate-500 font-medium">Log metrics</p>
                </div>
              </div>
            </Link>

            <Link href="/account/profile">
              <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 transition-all cursor-pointer group">
                <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <User className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">My Profile</p>
                  <p className="text-sm text-slate-500 font-medium">Edit account</p>
                </div>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">Loading dashboard...</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
