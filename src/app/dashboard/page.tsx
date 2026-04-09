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
  CreditCard
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
      <div>
        <h1 className="text-2xl font-bold text-[--text-primary]">
          Welcome back, {user?.name?.split(" ")[0] || "there"}
        </h1>
        <p className="text-[--text-secondary]">
          Here&apos;s an overview of your health journey
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[--text-secondary]">Upcoming</p>
                <p className="text-2xl font-bold text-[--text-primary]">2</p>
              </div>
              <div className="h-12 w-12 rounded-[--radius-lg] bg-[--primary]/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-[--primary]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[--text-secondary]">Completed</p>
                <p className="text-2xl font-bold text-[--text-primary]">12</p>
              </div>
              <div className="h-12 w-12 rounded-[--radius-lg] bg-[--success]/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-[--success]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[--text-secondary]">Wallet</p>
                <p className="text-2xl font-bold text-[--primary]">$250.00</p>
              </div>
              <div className="h-12 w-12 rounded-[--radius-lg] bg-[--secondary]/10 flex items-center justify-center">
                <Wallet className="h-6 w-6 text-[--secondary]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[--text-secondary]">Health Score</p>
                <p className="text-2xl font-bold text-[--success]">85%</p>
              </div>
              <div className="h-12 w-12 rounded-[--radius-lg] bg-[--danger]/10 flex items-center justify-center">
                <Heart className="h-6 w-6 text-[--danger]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
            <Link href="/dashboard/appointments">
              <Button variant="ghost" size="sm" className="gap-1">
                View all <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {mockUpcomingAppointments.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto text-[--text-muted] mb-3" />
                <p className="text-[--text-secondary]">No upcoming appointments</p>
                <Link href="/search">
                  <Button className="mt-4">Find a Doctor</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {mockUpcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center gap-4 p-4 rounded-[--radius-md] bg-[--background]"
                  >
                    <Avatar name={appointment.professional.name} size="md" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[--text-primary]">
                        {appointment.professional.name}
                      </p>
                      <p className="text-sm text-[--text-secondary]">
                        {appointment.professional.specialty}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm text-[--text-secondary]">
                        <Clock className="h-4 w-4" />
                        {formatDate(appointment.date)}
                      </div>
                      <p className="text-sm text-[--text-muted]">{appointment.time}</p>
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Health Metrics</CardTitle>
            <Link href="/dashboard/health">
              <Button variant="ghost" size="sm" className="gap-1">
                View details <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockHealthMetrics.map((metric) => (
                <div
                  key={metric.name}
                  className="flex items-center justify-between p-4 rounded-[--radius-md] bg-[--background]"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-[--radius-md] bg-[--primary]/10 flex items-center justify-center">
                      <Activity className="h-5 w-5 text-[--primary]" />
                    </div>
                    <div>
                      <p className="font-medium text-[--text-primary]">{metric.name}</p>
                      <p className="text-sm text-[--text-muted]">Last updated: Today</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-[--text-primary]">
                      {metric.value}
                    </p>
                    <p className="text-sm text-[--text-muted]">{metric.unit}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/search">
              <div className="flex items-center gap-4 p-4 rounded-[--radius-md] border border-[--border] hover:border-[--primary] hover:bg-[--primary]/5 transition-all cursor-pointer">
                <div className="h-12 w-12 rounded-[--radius-lg] bg-[--primary]/10 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-[--primary]" />
                </div>
                <div>
                  <p className="font-medium text-[--text-primary]">Book Appointment</p>
                  <p className="text-sm text-[--text-muted]">Find a doctor</p>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/wallet">
              <div className="flex items-center gap-4 p-4 rounded-[--radius-md] border border-[--border] hover:border-[--secondary] hover:bg-[--secondary]/5 transition-all cursor-pointer">
                <div className="h-12 w-12 rounded-[--radius-lg] bg-[--secondary]/10 flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-[--secondary]" />
                </div>
                <div>
                  <p className="font-medium text-[--text-primary]">Add Funds</p>
                  <p className="text-sm text-[--text-muted]">To wallet</p>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/health">
              <div className="flex items-center gap-4 p-4 rounded-[--radius-md] border border-[--border] hover:border-[--danger] hover:bg-[--danger]/5 transition-all cursor-pointer">
                <div className="h-12 w-12 rounded-[--radius-lg] bg-[--danger]/10 flex items-center justify-center">
                  <Heart className="h-6 w-6 text-[--danger]" />
                </div>
                <div>
                  <p className="font-medium text-[--text-primary]">Log Metrics</p>
                  <p className="text-sm text-[--text-muted]">Track health</p>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/appointments">
              <div className="flex items-center gap-4 p-4 rounded-[--radius-md] border border-[--border] hover:border-[--success] hover:bg-[--success]/5 transition-all cursor-pointer">
                <div className="h-12 w-12 rounded-[--radius-lg] bg-[--success]/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-[--success]" />
                </div>
                <div>
                  <p className="font-medium text-[--text-primary]">View History</p>
                  <p className="text-sm text-[--text-muted]">Past visits</p>
                </div>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
