"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/utils";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Clock, 
  MapPin, 
  DollarSign,
  Eye,
  Copy,
  MoreVertical
} from "lucide-react";

const mockServices = [
  { 
    id: "1", 
    title: "Cardiology Consultation", 
    description: "Initial consultation for cardiovascular assessment",
    price: 15000,
    duration: 45,
    location: "New York, NY",
    isActive: true,
    bookings: 24
  },
  { 
    id: "2", 
    title: "Follow-up Visit", 
    description: "Follow-up consultation for existing patients",
    price: 8500,
    duration: 30,
    location: "New York, NY",
    isActive: true,
    bookings: 56
  },
  { 
    id: "3", 
    title: "ECG Test", 
    description: "Electrocardiogram with full analysis",
    price: 20000,
    duration: 60,
    location: "New York, NY",
    isActive: false,
    bookings: 12
  },
];

export default function ServicesPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [services] = useState(mockServices);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Services</h1>
          <p className="text-slate-500 font-medium mt-1">Manage your service offerings</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      {/* Services List */}
      <div className="grid gap-4">
        {services.map((service) => (
          <Card key={service.id} className="hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-slate-900">{service.title}</h3>
                    <Badge variant={service.isActive ? "success" : "secondary"}>
                      {service.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="text-slate-500 font-medium mb-4">{service.description}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {service.duration} min
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {service.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {formatCurrency(service.price)}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-blue-600">{service.bookings}</span>
                      bookings
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {services.length === 0 && (
        <Card className="text-center py-16">
          <CardContent>
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Plus className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">No services yet</h3>
            <p className="text-slate-500 mb-6">Create your first service to start accepting appointments</p>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Add Service Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Service"
        size="lg"
      >
        <div className="space-y-4">
          <Input label="Service Title" placeholder="e.g., Cardiology Consultation" />
          <Textarea label="Description" placeholder="Describe your service..." />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Price (cents)" type="number" placeholder="15000" />
            <Input label="Duration (minutes)" type="number" placeholder="45" />
          </div>
          <Input label="Location" placeholder="e.g., New York, NY" />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowAddModal(false)}>
              Create Service
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
