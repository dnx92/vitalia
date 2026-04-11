'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { useToast } from '@/components/ui/toast';
import { ArrowLeft, Plus, Loader2 } from 'lucide-react';

const specialtyOptions = [
  { value: 'cardiology', label: 'Cardiology' },
  { value: 'dermatology', label: 'Dermatology' },
  { value: 'pediatrics', label: 'Pediatrics' },
  { value: 'neurology', label: 'Neurology' },
  { value: 'orthopedics', label: 'Orthopedics' },
  { value: 'internal_medicine', label: 'Internal Medicine' },
  { value: 'psychiatry', label: 'Psychiatry' },
  { value: 'general', label: 'General Practice' },
];

const durationOptions = [
  { value: '15', label: '15 minutes' },
  { value: '30', label: '30 minutes' },
  { value: '45', label: '45 minutes' },
  { value: '60', label: '60 minutes' },
  { value: '90', label: '90 minutes' },
];

export default function NewServicePage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    specialty: '',
    price: '',
    duration: '30',
    location: '',
    isVirtual: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.price || !formData.specialty) {
      addToast({
        variant: 'error',
        title: 'Missing fields',
        message: 'Please fill in all required fields',
      });
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      addToast({
        variant: 'success',
        title: 'Service created',
        message: 'Your new service has been created successfully',
      });

      router.push('/professional/services');
    } catch (error) {
      addToast({
        variant: 'error',
        title: 'Error',
        message: 'Failed to create service. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/professional/services">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create New Service</h1>
          <p className="text-slate-500 font-medium mt-1">Add a new service to your offerings</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="text-slate-900">Service Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Input
              label="Service Title *"
              placeholder="e.g., Initial Consultation"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />

            <Textarea
              label="Description"
              placeholder="Describe what this service includes..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />

            <Select
              label="Specialty *"
              options={specialtyOptions}
              placeholder="Select a specialty"
              value={formData.specialty}
              onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Price (USD) *"
                type="number"
                placeholder="150.00"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
              <Select
                label="Duration"
                options={durationOptions}
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              />
            </div>

            <Input
              label="Location"
              placeholder="e.g., New York, NY or Online"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />

            {/* Appointment Type */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Appointment Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isVirtual: true })}
                  className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${
                    formData.isVirtual
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-purple-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-slate-900">Virtual</p>
                    <p className="text-xs text-slate-500">Video call</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isVirtual: false })}
                  className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${
                    !formData.isVirtual
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-emerald-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-slate-900">In-Person</p>
                    <p className="text-xs text-slate-500">Office visit</p>
                  </div>
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
              <Link href="/professional/services">
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Create Service
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
