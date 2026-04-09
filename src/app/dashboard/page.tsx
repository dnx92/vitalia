"use client";

import React from "react";
import Link from "next/link";
import { 
  Calendar, 
  Wallet, 
  Heart,
  TrendingUp,
  ArrowRight,
  Clock,
  Activity,
  CreditCard,
  Search
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useAuthStore } from "@/store";

const mockUpcomingAppointments = [
  {
    id: "1",
    professional: { name: "Dr. Elena Martínez", specialty: "Cardiology" },
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    time: "10:00",
    status: "confirmed",
  },
  {
    id: "2",
    professional: { name: "Dr. Michael Chen", specialty: "Dermatology" },
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    time: "14:30",
    status: "pending",
  },
];

const mockHealthMetrics = [
  { name: "Blood Pressure", value: "120/80", unit: "mmHg", status: "normal" },
  { name: "Heart Rate", value: "72", unit: "bpm", status: "normal" },
  { name: "Weight", value: "70", unit: "kg", status: "normal" },
];

export default function DashboardPage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Welcome back, {user?.name?.split(" ")[0] || "there"}
        </h1>
        <p className="text-slate-500 font-medium mt-1">
          Here&apos;s an overview of your health journey
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6 hover:-translate-y-1 transition-all duration-300">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Upcoming</p>
                <p className="text-3xl font-bold text-slate-900 tracking-tight mt-1">2</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-6 hover:-translate-y-1 transition-all duration-300">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Completed</p>
                <p className="text-3xl font-bold text-slate-900 tracking-tight mt-1">12</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-6 hover:-translate-y-1 transition-all duration-300">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Wallet</p>
                <p className="text-3xl font-bold text-blue-600 tracking-tight mt-1">{formatCurrency(25000)}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-teal-50 flex items-center justify-center">
                <Wallet className="h-6 w-6 text-teal-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-6 hover:-translate-y-1 transition-all duration-300">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Health Score</p>
                <p className="text-3xl font-bold text-emerald-600 tracking-tight mt-1">85%</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-rose-50 flex items-center justify-center">
                <Heart className="h-6 w-6 text-rose-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Appointments & Health */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-slate-900 tracking-tight">Upcoming Appointments</CardTitle>
            <Link href="/dashboard/appointments">
              <Button variant="ghost" size="sm" className="gap-1 text-slate-500 hover:text-slate-700">
                View all <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-6">
            {mockUpcomingAppointments.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                <p className="text-slate-500 font-medium">No upcoming appointments</p>
                <Link href="/search">
                  <Button className="mt-4">Find a Doctor</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {mockUpcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-slate-50/80 hover:bg-slate-100 transition-colors"
                  >
                    <Avatar name={appointment.professional.name} size="md" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900">
                        {appointment.professional.name}
                      </p>
                      <p className="text-sm text-slate-500 font-medium">
                        {appointment.professional.specialty}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm text-slate-500">
                        <Clock className="h-4 w-4" />
                        {formatDate(appointment.date)}
                      </div>
                      <p className="text-sm text-slate-400 font-medium">{appointment.time}</p>
                    </div>
                    <Badge
                      variant={appointment.status === "confirmed" ? "success" : "warning"}
                    >
                      {appointment.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-slate-900 tracking-tight">Health Metrics</CardTitle>
            <Link href="/dashboard/health">
              <Button variant="ghost" size="sm" className="gap-1 text-slate-500 hover:text-slate-700">
                View details <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {mockHealthMetrics.map((metric) => (
                <div
                  key={metric.name}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-50/80 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                      <Activity className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{metric.name}</p>
                      <p className="text-sm text-slate-400 font-medium">Last updated: Today</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-slate-900 tracking-tight">
                      {metric.value}
                    </p>
                    <p className="text-sm text-slate-400 font-medium">{metric.unit}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
          <CardTitle className="text-slate-900 tracking-tight">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/search">
              <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all cursor-pointer group">
                <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
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
                <div className="h-12 w-12 rounded-xl bg-teal-50 flex items-center justify-center group-hover:bg-teal-100 transition-colors">
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
                <div className="h-12 w-12 rounded-xl bg-rose-50 flex items-center justify-center group-hover:bg-rose-100 transition-colors">
                  <Heart className="h-6 w-6 text-rose-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Log Metrics</p>
                  <p className="text-sm text-slate-500 font-medium">Track health</p>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/appointments">
              <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all cursor-pointer group">
                <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                  <TrendingUp className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">View History</p>
                  <p className="text-sm text-slate-500 font-medium">Past visits</p>
                </div>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
