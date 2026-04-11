'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, MapPin, Video, Star, ChevronRight, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { formatCurrency, formatDate, formatTime } from '@/lib/utils';
import { useAuthStore } from '@/store';

type AppointmentData = {
  id: string;
  date: string;
  time: string;
  status: string;
  isVirtual: boolean;
  startTime?: string;
  service: { name: string; price: number };
  professional: { id?: string; name: string; image?: string; specialty: string };
  price?: number;
  rating?: number;
  review?: { rating: number; comment: string };
};

type ReviewableAppointment = AppointmentData & {
  professional: { id?: string; name: string; image?: string; specialty: string };
};

export default function AppointmentsPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('upcoming');
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState<string | null>(null);
  const [showReviewModal, setShowReviewModal] = useState<ReviewableAppointment | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!user?.id) return;

    const fetchAppointments = async () => {
      setIsLoading(true);
      try {
        let statusParam = '';
        if (filter === 'upcoming') {
          statusParam = 'PENDING,CONFIRMED';
        } else if (filter !== 'all') {
          statusParam = filter.toUpperCase();
        }

        const params = new URLSearchParams({ userId: user.id, limit: '50' });
        if (statusParam) {
          params.set('status', statusParam);
        }

        const response = await fetch(`/api/appointments?${params.toString()}`);
        const data = await response.json();

        if (data.success && data.data) {
          setAppointments(data.data);
        } else if (data.appointments) {
          setAppointments(data.appointments);
        } else {
          setAppointments([]);
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setAppointments([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [user?.id, filter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <Badge variant="success">Confirmed</Badge>;
      case 'PENDING':
        return <Badge variant="warning">Pending</Badge>;
      case 'COMPLETED':
        return <Badge variant="secondary">Completed</Badge>;
      case 'CANCELLED':
        return <Badge variant="danger">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleCancel = async (id: string) => {
    try {
      const response = await fetch('/api/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointmentId: id, status: 'CANCELLED', userId: user?.id }),
      });

      if (response.ok) {
        setAppointments((prev) =>
          prev.map((apt) => (apt.id === id ? { ...apt, status: 'CANCELLED' } : apt))
        );
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
    }
    setShowCancelModal(null);
  };

  const handleReview = async () => {
    if (!showReviewModal) return;

    try {
      await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointmentId: showReviewModal.id,
          rating: reviewRating,
          comment: reviewComment,
        }),
      });
    } catch (error) {
      console.error('Error submitting review:', error);
    }
    setShowReviewModal(null);
    setReviewRating(5);
    setReviewComment('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Appointments</h1>
          <p className="text-slate-500 font-medium mt-1">Manage your medical appointments</p>
        </div>
        <Link href="/search">
          <Button>
            <Calendar className="w-4 h-4 mr-2" />
            Book New
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="p-2">
        <div className="flex flex-wrap items-center gap-2 p-2">
          {[
            { value: 'upcoming' as const, label: 'Upcoming' },
            { value: 'completed' as const, label: 'Completed' },
            { value: 'cancelled' as const, label: 'Cancelled' },
            { value: 'all' as const, label: 'All' },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                filter === f.value
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Appointments List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : appointments.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">No appointments found</h3>
              <p className="text-slate-500 font-medium mb-6">
                {filter === 'upcoming'
                  ? "You don't have any upcoming appointments"
                  : `No ${filter} appointments`}
              </p>
              <Link href="/search">
                <Button>Find a Doctor</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          appointments.map((apt) => (
            <Card
              key={apt.id}
              className="overflow-hidden hover:-translate-y-1 transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  {/* Left - Professional Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <Avatar name={apt.professional?.name || 'Doctor'} size="lg" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-slate-900">{apt.professional?.name}</h3>
                        {getStatusBadge(apt.status)}
                      </div>
                      <p className="text-blue-600 font-semibold text-sm">
                        {apt.professional?.specialty}
                      </p>
                      <p className="text-slate-500 text-sm font-medium mt-1">{apt.service?.name}</p>
                    </div>
                  </div>

                  {/* Center - Date & Time */}
                  <div className="flex items-center gap-6 lg:border-l lg:border-r lg:border-slate-100 lg:px-6">
                    <div className="text-center">
                      <div className="flex items-center gap-2 text-slate-500 mb-1">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm font-medium">Date</span>
                      </div>
                      <p className="font-bold text-slate-900">{formatDate(new Date(apt.date))}</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-2 text-slate-500 mb-1">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-medium">Time</span>
                      </div>
                      <p className="font-bold text-slate-900">
                        {formatTime(apt.startTime || apt.time)}
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-2 text-slate-500 mb-1">
                        {apt.isVirtual ? (
                          <Video className="w-4 h-4" />
                        ) : (
                          <MapPin className="w-4 h-4" />
                        )}
                        <span className="text-sm font-medium">Type</span>
                      </div>
                      <p
                        className={`font-semibold text-sm ${apt.isVirtual ? 'text-purple-600' : 'text-emerald-600'}`}
                      >
                        {apt.isVirtual ? 'Virtual' : 'In-Person'}
                      </p>
                    </div>
                  </div>

                  {/* Right - Actions */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-bold text-slate-900">
                        {formatCurrency(apt.price || apt.service?.price || 0)}
                      </p>
                      {apt.rating && (
                        <div className="flex items-center gap-1 mt-1 justify-end">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < apt.rating! ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      {apt.status === 'CONFIRMED' && (
                        <>
                          {apt.isVirtual && (
                            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                              <Video className="w-4 h-4 mr-1" />
                              Join
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowCancelModal(apt.id)}
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                      {apt.status === 'COMPLETED' && !apt.rating && (
                        <Button size="sm" onClick={() => setShowReviewModal(apt)}>
                          <Star className="w-4 h-4 mr-1" />
                          Review
                        </Button>
                      )}
                      <Link href={`/service/${apt.professional?.id}`}>
                        <Button variant="ghost" size="sm">
                          Details
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Cancel Modal */}
      <Modal
        isOpen={!!showCancelModal}
        onClose={() => setShowCancelModal(null)}
        title="Cancel Appointment"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-slate-600 font-medium">
            Are you sure you want to cancel this appointment? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowCancelModal(null)} className="flex-1">
              Keep Appointment
            </Button>
            <Button
              variant="danger"
              onClick={() => handleCancel(showCancelModal!)}
              className="flex-1"
            >
              Yes, Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Review Modal */}
      <Modal
        isOpen={!!showReviewModal}
        onClose={() => setShowReviewModal(null)}
        title="Leave a Review"
        size="sm"
      >
        <div className="space-y-5">
          {showReviewModal && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50">
              <Avatar name={showReviewModal.professional.name} size="md" />
              <div>
                <p className="font-semibold text-slate-900">{showReviewModal.professional.name}</p>
                <p className="text-sm text-slate-500">{showReviewModal.professional.specialty}</p>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              How was your experience?
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setReviewRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-8 h-8 ${star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-200 hover:text-amber-200'}`}
                  />
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Write a review (optional)"
            placeholder="Share your experience..."
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
          />

          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowReviewModal(null)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleReview} className="flex-1">
              Submit Review
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
