"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Calendar,
  Clock,
  MapPin,
  Video,
  Star,
  X,
  ChevronRight,
  Filter,
  Search
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";

const mockAppointments = [
  {
    id: "1",
    professional: { name: "Dr. Elena Martínez", specialty: "Cardiology", location: "Miami, FL", avatar: null },
    service: "Cardiology Consultation",
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    startTime: "10:00",
    endTime: "10:45",
    status: "CONFIRMED",
    price: 15000,
    isVirtual: false,
  },
  {
    id: "2",
    professional: { name: "Dr. Michael Chen", specialty: "Dermatology", location: "San Francisco, CA", avatar: null },
    service: "Skin Consultation",
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    startTime: "14:30",
    endTime: "15:00",
    status: "PENDING",
    price: 20000,
    isVirtual: true,
  },
  {
    id: "3",
    professional: { name: "Dr. Sarah Johnson", specialty: "Pediatrics", location: "New York, NY", avatar: null },
    service: "Follow-up Visit",
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    startTime: "09:00",
    endTime: "09:20",
    status: "COMPLETED",
    price: 12000,
    isVirtual: false,
    rating: 5,
  },
  {
    id: "4",
    professional: { name: "Dr. David Park", specialty: "Orthopedics", location: "Los Angeles, CA", avatar: null },
    service: "Initial Consultation",
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    startTime: "11:00",
    endTime: "11:30",
    status: "COMPLETED",
    price: 18000,
    isVirtual: true,
    rating: 4,
  },
  {
    id: "5",
    professional: { name: "Dr. Maria Garcia", specialty: "Neurology", location: "Houston, TX", avatar: null },
    service: "Neurology Consultation",
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    startTime: "16:00",
    endTime: "16:45",
    status: "COMPLETED",
    price: 16000,
    isVirtual: false,
    rating: 5,
  },
];

export default function AppointmentsPage() {
  const [filter, setFilter] = useState<"all" | "upcoming" | "completed" | "cancelled">("upcoming");
  const [showCancelModal, setShowCancelModal] = useState<string | null>(null);
  const [showReviewModal, setShowReviewModal] = useState<any>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return <Badge variant="success">Confirmed</Badge>;
      case "PENDING":
        return <Badge variant="warning">Pending</Badge>;
      case "COMPLETED":
        return <Badge variant="secondary">Completed</Badge>;
      case "CANCELLED":
        return <Badge variant="danger">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredAppointments = mockAppointments.filter((apt) => {
    const now = new Date();
    if (filter === "upcoming") {
      return apt.date >= now && apt.status !== "CANCELLED";
    }
    if (filter === "completed") {
      return apt.status === "COMPLETED";
    }
    if (filter === "cancelled") {
      return apt.status === "CANCELLED";
    }
    return true;
  });

  const handleCancel = (id: string) => {
    console.log("Cancelling appointment:", id);
    setShowCancelModal(null);
  };

  const handleReview = () => {
    console.log("Submitting review:", { appointment: showReviewModal?.id, rating: reviewRating, comment: reviewComment });
    setShowReviewModal(null);
    setReviewRating(5);
    setReviewComment("");
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
            { value: "upcoming", label: "Upcoming" },
            { value: "completed", label: "Completed" },
            { value: "cancelled", label: "Cancelled" },
            { value: "all", label: "All" },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value as any)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                filter === f.value
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">No appointments found</h3>
              <p className="text-slate-500 font-medium mb-6">
                {filter === "upcoming" 
                  ? "You don't have any upcoming appointments"
                  : `No ${filter} appointments`}
              </p>
              <Link href="/search">
                <Button>Find a Doctor</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          filteredAppointments.map((apt) => (
            <Card key={apt.id} className="overflow-hidden hover:-translate-y-1 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  {/* Left - Professional Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <Avatar name={apt.professional.name} size="lg" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-slate-900">{apt.professional.name}</h3>
                        {getStatusBadge(apt.status)}
                      </div>
                      <p className="text-blue-600 font-semibold text-sm">{apt.professional.specialty}</p>
                      <p className="text-slate-500 text-sm font-medium mt-1">{apt.service}</p>
                    </div>
                  </div>

                  {/* Center - Date & Time */}
                  <div className="flex items-center gap-6 lg:border-l lg:border-r lg:border-slate-100 lg:px-6">
                    <div className="text-center">
                      <div className="flex items-center gap-2 text-slate-500 mb-1">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm font-medium">Date</span>
                      </div>
                      <p className="font-bold text-slate-900">{formatDate(apt.date)}</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-2 text-slate-500 mb-1">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-medium">Time</span>
                      </div>
                      <p className="font-bold text-slate-900">{formatTime(apt.startTime)}</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-2 text-slate-500 mb-1">
                        {apt.isVirtual ? <Video className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                        <span className="text-sm font-medium">Type</span>
                      </div>
                      <p className={`font-semibold text-sm ${apt.isVirtual ? "text-purple-600" : "text-emerald-600"}`}>
                        {apt.isVirtual ? "Virtual" : "In-Person"}
                      </p>
                    </div>
                  </div>

                  {/* Right - Actions */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-bold text-slate-900">{formatCurrency(apt.price)}</p>
                      {apt.rating && (
                        <div className="flex items-center gap-1 mt-1 justify-end">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < apt.rating! ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      {apt.status === "CONFIRMED" && (
                        <>
                          {apt.isVirtual && (
                            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                              <Video className="w-4 h-4 mr-1" />
                              Join
                            </Button>
                          )}
                          <Button variant="outline" size="sm" onClick={() => setShowCancelModal(apt.id)}>
                            Cancel
                          </Button>
                        </>
                      )}
                      {apt.status === "COMPLETED" && !apt.rating && (
                        <Button size="sm" onClick={() => setShowReviewModal(apt)}>
                          <Star className="w-4 h-4 mr-1" />
                          Review
                        </Button>
                      )}
                      <Link href={`/service/${apt.id}`}>
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
            <Button variant="danger" onClick={() => handleCancel(showCancelModal!)} className="flex-1">
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
            <label className="block text-sm font-semibold text-slate-700 mb-3">How was your experience?</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setReviewRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-8 h-8 ${star <= reviewRating ? "fill-amber-400 text-amber-400" : "text-slate-200 hover:text-amber-200"}`}
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
