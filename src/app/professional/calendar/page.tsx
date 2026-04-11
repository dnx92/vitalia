"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { formatCurrency, formatDate } from "@/lib/utils";
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock,
  Video,
  MapPin,
  CheckCircle,
  XCircle,
  User
} from "lucide-react";

const mockAppointments = [
  { id: "1", patient: "John Smith", service: "Cardiology Consultation", time: "09:00", date: "2026-04-10", status: "confirmed", type: "virtual" },
  { id: "2", patient: "Sarah Johnson", service: "Follow-up Visit", time: "10:30", date: "2026-04-10", status: "pending", type: "in-person" },
  { id: "3", patient: "Michael Brown", service: "ECG Test", time: "14:00", date: "2026-04-10", status: "confirmed", type: "in-person" },
  { id: "4", patient: "Emily Davis", service: "Cardiology Consultation", time: "09:00", date: "2026-04-11", status: "confirmed", type: "virtual" },
  { id: "5", patient: "Robert Wilson", service: "Follow-up Visit", time: "11:00", date: "2026-04-11", status: "pending", type: "virtual" },
];

const hours = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const days = [];
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
  for (let i = 0; i < firstDay.getDay(); i++) {
    days.push(null);
  }
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
  }

  const getAppointmentsForDate = (date: Date) => {
    return mockAppointments.filter(apt => apt.date === date.toISOString().split("T")[0]);
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const selectedAppointments = getAppointmentsForDate(selectedDate);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Calendar</h1>
          <p className="text-slate-500 font-medium mt-1">Manage your appointments</p>
        </div>
        <Button>Create Availability</Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </CardTitle>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={prevMonth}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={nextMonth}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 text-center">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <div key={day} className="text-xs font-medium text-slate-400 py-2">{day}</div>
              ))}
              {days.map((day, index) => {
                if (!day) return <div key={`empty-${index}`} />;
                const isToday = day.toDateString() === new Date().toDateString();
                const isSelected = day.toDateString() === selectedDate.toDateString();
                const hasAppointments = getAppointmentsForDate(day).length > 0;
                
                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                      isSelected 
                        ? "bg-blue-600 text-white" 
                        : isToday 
                          ? "bg-blue-100 text-blue-600" 
                          : "hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    {day.getDate()}
                    {hasAppointments && !isSelected && (
                      <div className="w-1 h-1 bg-blue-600 rounded-full mx-auto mt-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Day Schedule */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">
              {selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedAppointments.length > 0 ? (
              <div className="space-y-3">
                {hours.map((hour) => {
                  const appointment = selectedAppointments.find(apt => apt.time === hour);
                  if (!appointment) return null;
                  
                  return (
                    <div
                      key={appointment.id}
                      className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                    >
                      <div className="text-center min-w-[60px]">
                        <p className="text-sm font-semibold text-slate-700">{appointment.time}</p>
                      </div>
                      <Avatar name={appointment.patient} size="md" />
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900">{appointment.patient}</p>
                        <p className="text-sm text-slate-500">{appointment.service}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {appointment.type === "virtual" ? (
                          <Badge variant="default" className="gap-1">
                            <Video className="w-3 h-3" />
                            Virtual
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="gap-1">
                            <MapPin className="w-3 h-3" />
                            In-Person
                          </Badge>
                        )}
                        <Badge variant={appointment.status === "confirmed" ? "success" : "warning"}>
                          {appointment.status}
                        </Badge>
                      </div>
                      <div className="flex gap-1">
                        {appointment.status === "pending" && (
                          <>
                            <Button size="sm" variant="outline" className="text-emerald-600 border-emerald-200 hover:bg-emerald-50">
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Clock className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                <p className="text-slate-500 font-medium">No appointments scheduled</p>
                <p className="text-sm text-slate-400 mt-1">for this day</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
