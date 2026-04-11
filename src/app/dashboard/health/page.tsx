'use client';

import React, { useState, useEffect, lazy, Suspense } from 'react';
import {
  Heart,
  Plus,
  Activity,
  AlertTriangle,
  Calendar,
  Bell,
  Droplets,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Modal } from '@/components/ui/modal';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/store';
import { formatDate } from '@/lib/utils';

const ChartComponents = lazy(() => import('@/components/ui/chart'));

type HealthMetric = {
  id: string;
  name: string;
  value: number;
  date: string;
  type?: string;
  recordedAt?: string;
};

type HealthAlert = {
  id: string;
  message: string;
  severity: string;
};

const defaultMetrics = [
  {
    id: 'blood_pressure',
    name: 'Blood Pressure',
    unit: 'mmHg',
    icon: Activity,
    color: '#EF4444',
    minValue: 90,
    maxValue: 140,
  },
  {
    id: 'heart_rate',
    name: 'Heart Rate',
    unit: 'bpm',
    icon: Heart,
    color: '#EC4899',
    minValue: 60,
    maxValue: 100,
  },
  {
    id: 'weight',
    name: 'Weight',
    unit: 'kg',
    icon: Activity,
    color: '#6366F1',
    minValue: 50,
    maxValue: 150,
  },
  {
    id: 'blood_sugar',
    name: 'Blood Sugar',
    unit: 'mg/dL',
    icon: Droplets,
    color: '#F59E0B',
    minValue: 70,
    maxValue: 140,
  },
];

const metricOptions = [
  { value: 'blood_pressure', label: 'Blood Pressure' },
  { value: 'heart_rate', label: 'Heart Rate' },
  { value: 'weight', label: 'Weight' },
  { value: 'blood_sugar', label: 'Blood Sugar' },
];

export default function HealthPage() {
  const { user } = useAuthStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('');
  const [logValue, setLogValue] = useState('');
  const [logNotes, setLogNotes] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([]);
  const [alerts, setAlerts] = useState<HealthAlert[]>([]);
  const [newMetric, setNewMetric] = useState({
    name: '',
    unit: '',
    minValue: '',
    maxValue: '',
  });

  useEffect(() => {
    if (!user?.id) return;

    const fetchHealthData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/health?userId=${user.id}`);
        const data = await response.json();

        if (data.metrics) {
          setHealthMetrics(data.metrics);
        }
      } catch (error) {
        console.error('Error fetching health data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHealthData();
  }, [user?.id]);

  const handleLogValue = async () => {
    if (!selectedMetric || !logValue || !user?.id) return;

    const metricDef = defaultMetrics.find((m) => m.id === selectedMetric);
    if (!metricDef) return;

    try {
      const response = await fetch('/api/health', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          type: selectedMetric,
          value: parseFloat(logValue),
          unit: metricDef.unit,
          notes: logNotes,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setHealthMetrics((prev) => [data.metric, ...prev]);
      }
    } catch (error) {
      console.error('Error logging metric:', error);
    }

    setShowLogModal(false);
    setLogValue('');
    setLogNotes('');
    setSelectedMetric('');
  };

  const getLatestValue = (type: string) => {
    const metric = healthMetrics.find((m) => m.type === type);
    return metric ? metric.value : null;
  };

  const handleAddMetric = () => {
    console.log('Adding metric:', newMetric);
    setShowAddModal(false);
    setNewMetric({ name: '', unit: '', minValue: '', maxValue: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Health Tracking</h1>
          <p className="text-slate-500 font-medium mt-1">Monitor your health metrics over time</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Metric
        </Button>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                <Bell className="h-5 w-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-900">Health Alert</p>
                <p className="text-sm text-slate-600 font-medium">{alerts[0].message}</p>
              </div>
              <Button variant="outline" size="sm" className="shrink-0">
                Dismiss
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metrics Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {defaultMetrics.map((metricDef) => {
          const latestValue = getLatestValue(metricDef.id);
          const readings = healthMetrics
            .filter((m) => m.type === metricDef.id)
            .slice(0, 7)
            .reverse()
            .map((m) => ({
              date: formatDate(new Date(m.recordedAt || m.date)).slice(0, 3),
              value: m.value,
            }));

          return (
            <Card
              key={metricDef.id}
              className="overflow-hidden hover:-translate-y-1 transition-all duration-300"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2 bg-slate-50/50 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div
                    className="h-12 w-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${metricDef.color}15` }}
                  >
                    <metricDef.icon className="h-6 w-6" style={{ color: metricDef.color }} />
                  </div>
                  <div>
                    <CardTitle className="text-base text-slate-900">{metricDef.name}</CardTitle>
                    <p className="text-sm text-slate-500 font-medium">
                      Normal: {metricDef.minValue}-{metricDef.maxValue}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  onClick={() => {
                    setSelectedMetric(metricDef.id);
                    setShowLogModal(true);
                  }}
                >
                  Log
                </Button>
              </CardHeader>
              <CardContent className="p-6">
                {isLoading ? (
                  <div className="space-y-4">
                    <div className="h-10 w-24 bg-slate-200 rounded animate-pulse" />
                    <div className="h-36 bg-slate-100 rounded-xl animate-pulse" />
                  </div>
                ) : latestValue ? (
                  <>
                    <div className="flex items-end justify-between mb-4">
                      <div>
                        <p className="text-3xl font-bold text-slate-900 tracking-tight">
                          {latestValue}
                        </p>
                        <p className="text-sm text-slate-500 font-medium">{metricDef.unit}</p>
                      </div>
                      <div className="text-sm font-semibold text-slate-500">
                        {readings.length > 1 ? 'Tracking' : 'Last recorded'}
                      </div>
                    </div>
                    {readings.length > 1 && (
                      <div className="h-36 min-h-[144px]">
                        <Suspense fallback={<Skeleton className="h-full w-full" />}>
                          <ChartComponents data={readings} color={metricDef.color} />
                        </Suspense>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <metricDef.icon className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                    <p className="text-slate-500 font-medium">No data recorded</p>
                    <Button
                      size="sm"
                      className="mt-3"
                      onClick={() => {
                        setSelectedMetric(metricDef.id);
                        setShowLogModal(true);
                      }}
                    >
                      Log your first reading
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Reminders */}
      <Card>
        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
          <CardTitle className="text-slate-900 tracking-tight">Reminders & Schedules</CardTitle>
          <CardDescription>Set up alerts and medication reminders</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                icon: Calendar,
                color: 'text-blue-600',
                bg: 'bg-blue-50',
                title: 'Weekly Check-in',
                desc: 'Get reminded to log your vitals every Monday morning',
                status: 'Active',
              },
              {
                icon: AlertTriangle,
                color: 'text-amber-600',
                bg: 'bg-amber-50',
                title: 'Abnormal Value Alert',
                desc: 'Get notified if any metric goes outside normal range',
                status: 'Active',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100/50 transition-colors"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className={`h-10 w-10 rounded-lg ${item.bg} flex items-center justify-center`}
                  >
                    <item.icon className={`h-5 w-5 ${item.color}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed mt-1">
                      {item.desc}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="success">{item.status}</Badge>
                  <Button variant="ghost" size="sm" className="text-slate-600">
                    Configure
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Log Modal */}
      <Modal
        isOpen={showLogModal}
        onClose={() => setShowLogModal(false)}
        title="Log Reading"
        size="sm"
      >
        <div className="space-y-5">
          <Select
            label="Metric"
            options={metricOptions}
            placeholder="Select a metric"
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
          />
          <Input
            label="Value"
            type="number"
            placeholder="Enter value"
            value={logValue}
            onChange={(e) => setLogValue(e.target.value)}
          />
          <Input
            label="Notes (optional)"
            placeholder="Any additional notes..."
            value={logNotes}
            onChange={(e) => setLogNotes(e.target.value)}
          />
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowLogModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleLogValue}
              className="flex-1"
              disabled={!selectedMetric || !logValue}
            >
              Save
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Metric Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Custom Metric"
        size="sm"
      >
        <div className="space-y-5">
          <Input
            label="Metric Name"
            placeholder="e.g., Cholesterol"
            value={newMetric.name}
            onChange={(e) => setNewMetric({ ...newMetric, name: e.target.value })}
          />
          <Input
            label="Unit"
            placeholder="e.g., mg/dL"
            value={newMetric.unit}
            onChange={(e) => setNewMetric({ ...newMetric, unit: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Min Normal"
              type="number"
              placeholder="Min"
              value={newMetric.minValue}
              onChange={(e) => setNewMetric({ ...newMetric, minValue: e.target.value })}
            />
            <Input
              label="Max Normal"
              type="number"
              placeholder="Max"
              value={newMetric.maxValue}
              onChange={(e) => setNewMetric({ ...newMetric, maxValue: e.target.value })}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowAddModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleAddMetric}
              className="flex-1"
              disabled={!newMetric.name || !newMetric.unit}
            >
              Add Metric
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
