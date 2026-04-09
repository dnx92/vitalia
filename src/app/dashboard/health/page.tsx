"use client";

import React, { useState } from "react";
import { 
  Heart,
  Plus,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertTriangle,
  Calendar,
  Bell,
  Settings
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const mockMetrics = [
  {
    id: "1",
    name: "Blood Pressure",
    unit: "mmHg",
    icon: Activity,
    color: "#EF4444",
    currentValue: "120/80",
    minValue: 90,
    maxValue: 140,
    trend: "stable",
    readings: [
      { date: "Mon", value: 118 },
      { date: "Tue", value: 122 },
      { date: "Wed", value: 120 },
      { date: "Thu", value: 125 },
      { date: "Fri", value: 120 },
      { date: "Sat", value: 118 },
      { date: "Sun", value: 120 },
    ],
  },
  {
    id: "2",
    name: "Heart Rate",
    unit: "bpm",
    icon: Heart,
    color: "#EF4444",
    currentValue: "72",
    minValue: 60,
    maxValue: 100,
    trend: "up",
    readings: [
      { date: "Mon", value: 70 },
      { date: "Tue", value: 72 },
      { date: "Wed", value: 68 },
      { date: "Thu", value: 74 },
      { date: "Fri", value: 72 },
      { date: "Sat", value: 70 },
      { date: "Sun", value: 72 },
    ],
  },
  {
    id: "3",
    name: "Weight",
    unit: "kg",
    icon: Activity,
    color: "#6366F1",
    currentValue: "70",
    minValue: 60,
    maxValue: 80,
    trend: "down",
    readings: [
      { date: "Mon", value: 71 },
      { date: "Tue", value: 70.5 },
      { date: "Wed", value: 70.2 },
      { date: "Thu", value: 70 },
      { date: "Fri", value: 70 },
      { date: "Sat", value: 70.1 },
      { date: "Sun", value: 70 },
    ],
  },
  {
    id: "4",
    name: "Blood Sugar",
    unit: "mg/dL",
    icon: AlertTriangle,
    color: "#F59E0B",
    currentValue: "105",
    minValue: 70,
    maxValue: 140,
    trend: "stable",
    readings: [
      { date: "Mon", value: 100 },
      { date: "Tue", value: 108 },
      { date: "Wed", value: 105 },
      { date: "Thu", value: 110 },
      { date: "Fri", value: 105 },
      { date: "Sat", value: 102 },
      { date: "Sun", value: 105 },
    ],
  },
];

const mockAlerts = [
  {
    id: "1",
    type: "warning",
    message: "Your blood sugar has been slightly elevated this week",
    metric: "Blood Sugar",
    createdAt: new Date(),
  },
];

export default function HealthPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<string>("");
  const [logValue, setLogValue] = useState("");
  const [newMetric, setNewMetric] = useState({
    name: "",
    unit: "",
    minValue: "",
    maxValue: "",
  });

  const handleLogValue = () => {
    console.log("Logging:", { metric: selectedMetric, value: logValue });
    setShowLogModal(false);
    setLogValue("");
  };

  const handleAddMetric = () => {
    console.log("Adding metric:", newMetric);
    setShowAddModal(false);
    setNewMetric({ name: "", unit: "", minValue: "", maxValue: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[--text-primary]">Health Tracking</h1>
          <p className="text-[--text-secondary]">Monitor your health metrics over time</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Metric
        </Button>
      </div>

      {mockAlerts.length > 0 && (
        <Card className="border-[--warning] bg-[--warning]/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-[--warning]/20 flex items-center justify-center shrink-0">
                <Bell className="h-4 w-4 text-[--warning]" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-[--text-primary]">Health Alert</p>
                <p className="text-sm text-[--text-secondary]">{mockAlerts[0].message}</p>
              </div>
              <Button variant="outline" size="sm">Dismiss</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {mockMetrics.map((metric) => (
          <Card key={metric.id}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-3">
                <div 
                  className="h-10 w-10 rounded-[--radius-md] flex items-center justify-center"
                  style={{ backgroundColor: `${metric.color}20` }}
                >
                  <metric.icon className="h-5 w-5" style={{ color: metric.color }} />
                </div>
                <div>
                  <CardTitle className="text-base">{metric.name}</CardTitle>
                  <p className="text-sm text-[--text-muted]">Normal: {metric.minValue}-{metric.maxValue}</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setSelectedMetric(metric.id);
                  setShowLogModal(true);
                }}
              >
                Log
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between mb-4">
                <div>
                  <p className="text-3xl font-bold text-[--text-primary]">
                    {metric.currentValue}
                  </p>
                  <p className="text-sm text-[--text-muted]">{metric.unit}</p>
                </div>
                <div className={`flex items-center gap-1 text-sm ${
                  metric.trend === "up" 
                    ? "text-[--success]" 
                    : metric.trend === "down" 
                    ? "text-[--danger]" 
                    : "text-[--text-muted]"
                }`}>
                  {metric.trend === "up" && <TrendingUp className="h-4 w-4" />}
                  {metric.trend === "down" && <TrendingDown className="h-4 w-4" />}
                  {metric.trend === "stable" ? "Stable" : metric.trend === "up" ? "Up" : "Down"}
                </div>
              </div>
              <div className="h-32 min-h-[128px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={metric.readings}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                    <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke={metric.color} 
                      strokeWidth={2}
                      dot={{ fill: metric.color, strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reminders & Schedules</CardTitle>
          <CardDescription>Set up alerts and medication reminders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 rounded-[--radius-md] border border-[--border]">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="h-5 w-5 text-[--primary]" />
                <p className="font-medium text-[--text-primary]">Weekly Check-in</p>
              </div>
              <p className="text-sm text-[--text-secondary] mb-3">
                Get reminded to log your vitals every Monday morning
              </p>
              <div className="flex items-center justify-between">
                <Badge variant="success">Active</Badge>
                <Button variant="ghost" size="sm">Configure</Button>
              </div>
            </div>
            <div className="p-4 rounded-[--radius-md] border border-[--border]">
              <div className="flex items-center gap-3 mb-3">
                <Bell className="h-5 w-5 text-[--warning]" />
                <p className="font-medium text-[--text-primary]">Abnormal Value Alert</p>
              </div>
              <p className="text-sm text-[--text-secondary] mb-3">
                Get notified if any metric goes outside normal range
              </p>
              <div className="flex items-center justify-between">
                <Badge variant="success">Active</Badge>
                <Button variant="ghost" size="sm">Configure</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Modal
        isOpen={showLogModal}
        onClose={() => setShowLogModal(false)}
        title="Log Reading"
        size="sm"
      >
        <div className="space-y-4">
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
          />
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowLogModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleLogValue} className="flex-1">
              Save
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Custom Metric"
        size="sm"
      >
        <div className="space-y-4">
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
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowAddModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleAddMetric} className="flex-1">
              Add Metric
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
