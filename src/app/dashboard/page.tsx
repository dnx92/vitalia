'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Wallet,
  Heart,
  Search,
  Loader2,
  Video,
  MapPin,
  Plus,
  ArrowRight,
  Clock,
  Activity,
  CreditCard,
  User,
  Bell,
  Stethoscope,
  Shield,
  ChevronRight,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { formatCurrency, formatDate, formatTime } from '@/lib/utils';
import { useAuthStore } from '@/store';

interface DashboardData {
  upcomingAppointments: Appointment[];
  recentTransactions: Transaction[];
  healthMetrics: HealthMetric[];
  stats: {
    upcomingCount: number;
    completedCount: number;
    walletBalance: number;
  };
  nextAppointment?: Appointment;
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

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!user?.id) return;
    fetchDashboardData();
  }, [user?.id]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [appointmentsRes, walletRes, healthRes] = await Promise.all([
        fetch(`/api/appointments?userId=${user?.id}&limit=20`),
        fetch(`/api/wallet?userId=${user?.id}&limit=5`),
        fetch(`/api/health?userId=${user?.id}&limit=5`),
      ]);

      const appointmentsData = await appointmentsRes.json();
      const walletData = await walletRes.json();
      const healthData = await healthRes.json();

      const appointments = appointmentsData.data || [];
      const upcomingAppointments = appointments.filter(
        (a: Appointment) => a.status === 'PENDING' || a.status === 'CONFIRMED'
      );
      const completedCount = appointments.filter(
        (a: Appointment) => a.status === 'COMPLETED'
      ).length;
      const nextAppointment = upcomingAppointments[0];

      setData({
        upcomingAppointments: upcomingAppointments.slice(0, 3),
        recentTransactions: (walletData.data?.transactions || walletData.transactions || []).slice(
          0,
          5
        ),
        healthMetrics: healthData.data || healthData.metrics || [],
        stats: {
          upcomingCount: upcomingAppointments.length,
          completedCount,
          walletBalance: walletData.data?.wallet?.available || walletData.wallet?.available || 0,
        },
        nextAppointment,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '¡Buenos días!';
    if (hour < 18) return '¡Buenas tardes!';
    return '¡Buenas noches!';
  };

  const getWelcomeMessage = () => {
    if (!data?.nextAppointment) {
      return '¿Listo para cuidar tu salud? Encuentra al mejor especialista.';
    }
    return 'Tienes una cita próximamente. ¡No olvides asistir!';
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">Cargando tu panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            {getGreeting()}, {user?.name?.split(' ')[0] || 'Usuario'}
          </h1>
          <p className="text-slate-500 font-medium mt-1">{getWelcomeMessage()}</p>
        </div>
        <Link href="/search">
          <Button className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 shadow-lg shadow-blue-600/25">
            <Search className="w-4 h-4 mr-2" />
            Buscar Especialista
          </Button>
        </Link>
      </div>

      {/* Next Appointment - Hero Card */}
      {data?.nextAppointment && (
        <Card className="bg-gradient-to-r from-blue-600 to-teal-500 text-white border-0 shadow-xl shadow-blue-600/25">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="hidden md:block">
                  <Avatar
                    src={data.nextAppointment.professional.avatar}
                    name={data.nextAppointment.professional.name}
                    size="xl"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-blue-100 text-sm font-medium">Tu próxima cita</p>
                    <Badge className="bg-white/20 text-white text-xs">Confirmada</Badge>
                  </div>
                  <h3 className="text-xl font-bold mb-1">
                    {data.nextAppointment.professional.name}
                  </h3>
                  <p className="text-blue-100 text-sm mb-2">
                    {data.nextAppointment.professional.specialty} • {data.nextAppointment.service}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(new Date(data.nextAppointment.date))}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatTime(data.nextAppointment.startTime)}
                    </div>
                    <div className="flex items-center gap-1">
                      {data.nextAppointment.isVirtual ? (
                        <>
                          <Video className="w-4 h-4" />
                          Virtual
                        </>
                      ) : (
                        <>
                          <MapPin className="w-4 h-4" />
                          Presencial
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                {data.nextAppointment.isVirtual && (
                  <Button className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg">
                    <Video className="w-4 h-4 mr-2" />
                    Unirse a Videollamada
                  </Button>
                )}
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  Ver Detalles
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:shadow-lg transition-all cursor-pointer">
          <Link href="/dashboard/appointments">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Citas Pendientes</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">
                    {data?.stats.upcomingCount || 0}
                  </p>
                </div>
                <div className="h-14 w-14 rounded-2xl bg-blue-100 flex items-center justify-center">
                  <Calendar className="h-7 w-7 text-blue-600" />
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-3 flex items-center gap-1">
                Ver todas las citas <ChevronRight className="w-3 h-3" />
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-all cursor-pointer">
          <Link href="/dashboard/wallet">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Tu Billetera</p>
                  <p className="text-3xl font-bold text-teal-600 mt-1">
                    {formatCurrency(data?.stats.walletBalance || 0)}
                  </p>
                </div>
                <div className="h-14 w-14 rounded-2xl bg-teal-100 flex items-center justify-center">
                  <Wallet className="h-7 w-7 text-teal-600" />
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-3 flex items-center gap-1">
                Gestionar fondos <ChevronRight className="w-3 h-3" />
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-all cursor-pointer">
          <Link href="/dashboard/health">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Visitas Completadas</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">
                    {data?.stats.completedCount || 0}
                  </p>
                </div>
                <div className="h-14 w-14 rounded-2xl bg-emerald-100 flex items-center justify-center">
                  <CheckCircle className="h-7 w-7 text-emerald-600" />
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-3 flex items-center gap-1">
                Ver historial <ChevronRight className="w-3 h-3" />
              </p>
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Appointments List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Próximas Citas
            </CardTitle>
            <Link href="/dashboard/appointments">
              <Button variant="ghost" size="sm" className="text-blue-600">
                Ver todas <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {!data?.upcomingAppointments || data.upcomingAppointments.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-slate-500 font-medium mb-4">No tienes citas programadas</p>
                <Link href="/search">
                  <Button variant="outline" size="sm">
                    <Search className="w-4 h-4 mr-2" />
                    Buscar Especialista
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {data.upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <Avatar
                      src={appointment.professional.avatar}
                      name={appointment.professional.name}
                      size="md"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 truncate">
                        {appointment.professional.name}
                      </p>
                      <p className="text-sm text-slate-500 truncate">{appointment.service}</p>
                    </div>
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-medium text-slate-900">
                        {formatDate(new Date(appointment.date))}
                      </p>
                      <p className="text-xs text-slate-400">{formatTime(appointment.startTime)}</p>
                    </div>
                    <Badge
                      variant={appointment.isVirtual ? 'default' : 'secondary'}
                      className="gap-1"
                    >
                      {appointment.isVirtual ? (
                        <Video className="w-3 h-3" />
                      ) : (
                        <MapPin className="w-3 h-3" />
                      )}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Health & Wallet */}
        <div className="space-y-6">
          {/* Health Metrics */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-rose-600" />
                Tu Salud
              </CardTitle>
              <Link href="/dashboard/health">
                <Button variant="ghost" size="sm" className="text-blue-600">
                  Ver más <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {!data?.healthMetrics || data.healthMetrics.length === 0 ? (
                <div className="text-center py-6">
                  <Heart className="h-10 w-10 mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-500 font-medium mb-3">Sin registros de salud</p>
                  <Link href="/dashboard/health">
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar Métrica
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {data.healthMetrics.slice(0, 4).map((metric) => (
                    <div key={metric.id} className="p-3 rounded-xl bg-slate-50 text-center">
                      <p className="text-2xl font-bold text-slate-900">{metric.value}</p>
                      <p className="text-xs text-slate-400">{metric.unit}</p>
                      <p className="text-xs text-slate-500 mt-1 capitalize">
                        {metric.type.replace('_', ' ')}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-teal-600" />
                Actividad Reciente
              </CardTitle>
              <Link href="/dashboard/wallet">
                <Button variant="ghost" size="sm" className="text-blue-600">
                  Ver wallet <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {!data?.recentTransactions || data.recentTransactions.length === 0 ? (
                <div className="text-center py-6">
                  <CreditCard className="h-10 w-10 mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-500 font-medium mb-3">Sin actividad reciente</p>
                  <Link href="/dashboard/wallet">
                    <Button variant="outline" size="sm">
                      Agregar Fondos
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {data.recentTransactions.slice(0, 4).map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                            tx.amount > 0 ? 'bg-emerald-100' : 'bg-slate-100'
                          }`}
                        >
                          {tx.amount > 0 ? (
                            <ArrowRight className="h-4 w-4 text-emerald-600 rotate-180" />
                          ) : (
                            <CreditCard className="h-4 w-4 text-slate-500" />
                          )}
                        </div>
                        <p className="text-sm font-medium text-slate-700">
                          {tx.description || tx.type.replace('_', ' ')}
                        </p>
                      </div>
                      <p
                        className={`text-sm font-bold ${
                          tx.amount > 0 ? 'text-emerald-600' : 'text-slate-900'
                        }`}
                      >
                        {tx.amount > 0 ? '+' : ''}
                        {formatCurrency(Math.abs(tx.amount))}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-slate-800 to-slate-900 text-white border-0">
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Link href="/search" className="group">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                <div className="h-12 w-12 rounded-xl bg-blue-500 flex items-center justify-center">
                  <Stethoscope className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold">Buscar Médico</p>
                  <p className="text-xs text-slate-300">Encuentra especialistas</p>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/appointments" className="group">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                <div className="h-12 w-12 rounded-xl bg-teal-500 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold">Mis Citas</p>
                  <p className="text-xs text-slate-300">Ver y gestionar</p>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/health" className="group">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                <div className="h-12 w-12 rounded-xl bg-rose-500 flex items-center justify-center">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold">Mi Salud</p>
                  <p className="text-xs text-slate-300">Seguir métricas</p>
                </div>
              </div>
            </Link>

            <Link href="/account/profile" className="group">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                <div className="h-12 w-12 rounded-xl bg-purple-500 flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold">Mi Perfil</p>
                  <p className="text-xs text-slate-300">Editar información</p>
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
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">Cargando...</p>
          </div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
