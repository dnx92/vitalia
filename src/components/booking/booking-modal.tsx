'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Video,
  MapPin,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useAuthStore } from '@/store';
import { useRouter } from 'next/navigation';

interface Service {
  id: string;
  title: string;
  description?: string;
  price: number;
  duration: number;
}

interface Professional {
  id: string;
  userId: string;
  specialty: string;
  bio?: string;
  consultationFee: number;
  isVirtual: boolean;
  location?: string;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  services?: Service[];
}

interface Slot {
  time: string;
  available: boolean;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  professional: Professional;
}

const TIME_SLOTS = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
];

export function BookingModal({ isOpen, onClose, professional }: BookingModalProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [step, setStep] = useState<'service' | 'datetime' | 'confirm' | 'success'>('service');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<'virtual' | 'in-person'>('virtual');
  const [isLoading, setIsLoading] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);

  useEffect(() => {
    if (selectedDate) {
      generateTimeSlots();
    }
  }, [selectedDate]);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setStep('service');
    setSelectedService(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setSelectedType('virtual');
    setError(null);
  };

  const generateTimeSlots = () => {
    const slots: Slot[] = TIME_SLOTS.map((time) => ({
      time,
      available: Math.random() > 0.3,
    }));
    setAvailableSlots(slots);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days: (Date | null)[] = [];

    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dayOfWeek = date.getDay();
    return date < today || dayOfWeek === 0 || dayOfWeek === 6;
  };

  const handleNext = () => {
    if (step === 'service' && selectedService) {
      setStep('datetime');
    } else if (step === 'datetime' && selectedDate && selectedTime) {
      setStep('confirm');
    }
  };

  const handleBack = () => {
    if (step === 'datetime') setStep('service');
    else if (step === 'confirm') setStep('datetime');
  };

  const handleBooking = async () => {
    if (!user?.id || !selectedService || !selectedDate || !selectedTime) return;

    setIsBooking(true);
    setError(null);

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: user.id,
          professionalId: professional.id,
          serviceId: selectedService.id,
          date: selectedDate.toISOString(),
          startTime: selectedTime,
          isVirtual: selectedType === 'virtual',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to book appointment');
      }

      setStep('success');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
    } finally {
      setIsBooking(false);
    }
  };

  const handleViewAppointments = () => {
    onClose();
    router.push('/dashboard/appointments');
  };

  const days = getDaysInMonth(calendarMonth);
  const services = professional.services || [
    {
      id: 'default',
      title: 'Initial Consultation',
      price: professional.consultationFee,
      duration: 30,
    },
  ];

  const renderServiceStep = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900">Select a Service</h3>
      <div className="space-y-3">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => setSelectedService(service)}
            className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
              selectedService?.id === service.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900">{service.title}</p>
                <p className="text-sm text-slate-500 mt-1">{service.duration} minutes</p>
              </div>
              <p className="text-xl font-bold text-blue-600">{formatCurrency(service.price)}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderDateTimeStep = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-900">Choose Date & Time</h3>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Calendar */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() =>
                  setCalendarMonth(new Date(calendarMonth.setMonth(calendarMonth.getMonth() - 1)))
                }
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="font-semibold">
                {calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
              <button
                onClick={() =>
                  setCalendarMonth(new Date(calendarMonth.setMonth(calendarMonth.getMonth() + 1)))
                }
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-sm">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                <div key={day} className="py-2 text-slate-400 font-medium">
                  {day}
                </div>
              ))}
              {days.map((day, index) => (
                <button
                  key={index}
                  onClick={() => day && !isDateDisabled(day) && setSelectedDate(day)}
                  disabled={!day || isDateDisabled(day)}
                  className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                    !day
                      ? ''
                      : isDateDisabled(day)
                        ? 'text-slate-300 cursor-not-allowed'
                        : selectedDate?.toDateString() === day.toDateString()
                          ? 'bg-blue-600 text-white'
                          : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  {day?.getDate()}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Time Slots */}
        <div>
          <p className="font-medium text-slate-700 mb-3">Available Times</p>
          {selectedDate ? (
            <div className="grid grid-cols-3 gap-2">
              {availableSlots.map((slot) => (
                <button
                  key={slot.time}
                  onClick={() => slot.available && setSelectedTime(slot.time)}
                  disabled={!slot.available}
                  className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                    !slot.available
                      ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                      : selectedTime === slot.time
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <p className="text-sm text-slate-500">Select a date to see available times</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Appointment Type */}
      <div>
        <p className="font-medium text-slate-700 mb-3">Appointment Type</p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setSelectedType('virtual')}
            className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${
              selectedType === 'virtual'
                ? 'border-blue-500 bg-blue-50'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <Video className="w-6 h-6 text-purple-600" />
            <div className="text-left">
              <p className="font-semibold">Virtual</p>
              <p className="text-xs text-slate-500">Video call</p>
            </div>
          </button>
          <button
            onClick={() => setSelectedType('in-person')}
            className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${
              selectedType === 'in-person'
                ? 'border-blue-500 bg-blue-50'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <MapPin className="w-6 h-6 text-emerald-600" />
            <div className="text-left">
              <p className="font-semibold">In-Person</p>
              <p className="text-xs text-slate-500">{professional.location || 'Office visit'}</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderConfirmStep = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-900">Confirm Booking</h3>

      <Card className="bg-slate-50">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b border-slate-200">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center text-white font-bold text-lg">
              {professional.user?.name
                ?.split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)}
            </div>
            <div>
              <p className="font-semibold text-slate-900">{professional.user?.name}</p>
              <p className="text-sm text-blue-600">{professional.specialty}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-500">Service</span>
              <span className="font-medium">{selectedService?.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Date</span>
              <span className="font-medium">{selectedDate && formatDate(selectedDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Time</span>
              <span className="font-medium">{selectedTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Type</span>
              <Badge variant={selectedType === 'virtual' ? 'default' : 'secondary'}>
                {selectedType === 'virtual' ? 'Virtual' : 'In-Person'}
              </Badge>
            </div>
            <div className="pt-3 border-t border-slate-200">
              <div className="flex justify-between">
                <span className="font-semibold text-slate-900">Total</span>
                <span className="text-xl font-bold text-blue-600">
                  {formatCurrency(selectedService?.price || 0)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 border border-blue-200">
        <CreditCard className="w-5 h-5 text-blue-600" />
        <p className="text-sm text-blue-700">
          Payment will be held in escrow and released after your appointment
        </p>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="text-center py-8">
      <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-emerald-600" />
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-2">Booking Confirmed!</h3>
      <p className="text-slate-500 mb-6">
        Your appointment with {professional.user?.name} has been scheduled for{' '}
        {selectedDate && formatDate(selectedDate)} at {selectedTime}
      </p>
      <div className="flex flex-col gap-3">
        <Button onClick={handleViewAppointments} className="w-full">
          View My Appointments
        </Button>
        <Button variant="outline" onClick={onClose} className="w-full">
          Close
        </Button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (step) {
      case 'service':
        return renderServiceStep();
      case 'datetime':
        return renderDateTimeStep();
      case 'confirm':
        return renderConfirmStep();
      case 'success':
        return renderSuccessStep();
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 'service':
        return 'Book Appointment';
      case 'datetime':
        return 'Select Date & Time';
      case 'confirm':
        return 'Confirm Booking';
      case 'success':
        return 'Success';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getStepTitle()} size="lg">
      <div className="space-y-6">
        {/* Progress Steps */}
        {step !== 'success' && (
          <div className="flex items-center justify-center gap-2">
            {['service', 'datetime', 'confirm'].map((s, i) => (
              <React.Fragment key={s}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    step === s
                      ? 'bg-blue-600 text-white'
                      : ['service', 'datetime', 'confirm'].indexOf(step) > i
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {['service', 'datetime', 'confirm'].indexOf(step) > i ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    i + 1
                  )}
                </div>
                {i < 2 && (
                  <div
                    className={`w-12 h-1 rounded ${['service', 'datetime', 'confirm'].indexOf(step) > i ? 'bg-emerald-500' : 'bg-slate-200'}`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Content */}
        {renderContent()}

        {/* Navigation */}
        {step !== 'success' && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            {step !== 'service' ? (
              <Button variant="outline" onClick={handleBack}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            ) : (
              <div />
            )}

            {step === 'confirm' ? (
              <Button
                onClick={handleBooking}
                isLoading={isBooking}
                className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600"
              >
                Confirm & Pay {formatCurrency(selectedService?.price || 0)}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={
                  (step === 'service' && !selectedService) ||
                  (step === 'datetime' && (!selectedDate || !selectedTime))
                }
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}

export default BookingModal;
