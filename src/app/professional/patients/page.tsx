'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { formatDate } from '@/lib/utils';
import { Search, Filter, Calendar, Phone, Mail, Clock, ChevronRight, FileText } from 'lucide-react';

const mockPatients = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567',
    lastVisit: '2026-04-05',
    totalVisits: 8,
    upcomingAppointments: 2,
    status: 'active',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '+1 (555) 234-5678',
    lastVisit: '2026-03-28',
    totalVisits: 12,
    upcomingAppointments: 1,
    status: 'active',
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'm.brown@email.com',
    phone: '+1 (555) 345-6789',
    lastVisit: '2026-02-15',
    totalVisits: 3,
    upcomingAppointments: 0,
    status: 'inactive',
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily.d@email.com',
    phone: '+1 (555) 456-7890',
    lastVisit: '2026-04-08',
    totalVisits: 15,
    upcomingAppointments: 3,
    status: 'active',
  },
];

export default function PatientsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [patients] = useState(mockPatients);

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Patients</h1>
          <p className="text-slate-500 font-medium mt-1">View and manage your patient list</p>
        </div>
        <Button variant="outline">
          <FileText className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <CardContent className="p-0">
            <p className="text-sm text-slate-500">Total Patients</p>
            <p className="text-2xl font-bold text-slate-900">{patients.length}</p>
          </CardContent>
        </Card>
        <Card className="p-4">
          <CardContent className="p-0">
            <p className="text-sm text-slate-500">Active</p>
            <p className="text-2xl font-bold text-emerald-600">
              {patients.filter((p) => p.status === 'active').length}
            </p>
          </CardContent>
        </Card>
        <Card className="p-4">
          <CardContent className="p-0">
            <p className="text-sm text-slate-500">Upcoming</p>
            <p className="text-2xl font-bold text-blue-600">
              {patients.reduce((acc, p) => acc + p.upcomingAppointments, 0)}
            </p>
          </CardContent>
        </Card>
        <Card className="p-4">
          <CardContent className="p-0">
            <p className="text-sm text-slate-500">This Month</p>
            <p className="text-2xl font-bold text-slate-900">24</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search patients by name or email..."
                className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Patients List */}
      <Card>
        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
          <CardTitle className="text-slate-900">All Patients ({filteredPatients.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {filteredPatients.map((patient) => (
              <div
                key={patient.id}
                className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Avatar name={patient.name} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-900 truncate">{patient.name}</p>
                    <Badge
                      variant={patient.status === 'active' ? 'success' : 'secondary'}
                      className="text-xs"
                    >
                      {patient.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {patient.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {patient.phone}
                    </span>
                  </div>
                </div>
                <div className="hidden md:flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <p className="font-semibold text-slate-900">{patient.totalVisits}</p>
                    <p className="text-xs text-slate-400">Visits</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-slate-900">{patient.upcomingAppointments}</p>
                    <p className="text-xs text-slate-400">Upcoming</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-slate-900">{formatDate(patient.lastVisit)}</p>
                    <p className="text-xs text-slate-400">Last Visit</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      {filteredPatients.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Search className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium">No patients found</p>
            <p className="text-sm text-slate-400 mt-1">Try adjusting your search</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
