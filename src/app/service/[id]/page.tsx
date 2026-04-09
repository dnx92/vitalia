"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  Shield,
  CheckCircle,
  Calendar,
  ArrowRight,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Modal } from "@/components/ui/modal";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

const mockProfessional = {
  id: "1",
  name: "Dr. Elena Martínez",
  specialty: "Cardiology",
  bio: "Dr. Elena Martínez is a board-certified cardiologist with over 15 years of experience in treating cardiovascular diseases. She specializes in preventive cardiology and heart failure management. Dr. Martínez received her medical degree from the Universidad Complutense de Madrid and completed her residency at Hospital Clínico San Carlos. She is known for her patient-centered approach and dedication to providing personalized care.",
  location: "Madrid, Spain",
  rating: 4.9,
  reviewCount: 127,
  languages: ["Spanish", "English", "Portuguese"],
  verified: true,
  verificationStatus: "VERIFIED",
  avatar: undefined,
  services: [
    {
      id: "s1",
      title: "Cardiology Consultation",
      description: "Comprehensive cardiovascular assessment including physical examination, ECG review, and personalized treatment plan.",
      price: 15000,
      duration: 45,
      location: "Madrid Clinic, Spain",
      imageUrl: "",
    },
    {
      id: "s2",
      title: "Follow-up Visit",
      description: "Post-consultation follow-up to monitor progress and adjust treatment as needed.",
      price: 8000,
      duration: 20,
      location: "Madrid Clinic, Spain",
      imageUrl: "",
    },
  ],
  availability: {
    monday: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
    tuesday: ["09:00", "10:00", "11:00", "14:00", "15:00"],
    wednesday: ["10:00", "11:00", "14:00", "15:00", "16:00"],
    thursday: ["09:00", "10:00", "11:00", "14:00"],
    friday: ["09:00", "10:00", "11:00", "14:00", "15:00"],
  },
  reviews: [
    {
      id: "r1",
      userName: "María García",
      rating: 5,
      comment: "Dr. Martínez is an excellent cardiologist. She took the time to explain everything clearly and made me feel very comfortable.",
      date: "2024-01-15",
    },
    {
      id: "r2",
      userName: "John Smith",
      rating: 5,
      comment: "Very professional and knowledgeable. The consultation was thorough and I felt confident in her care.",
      date: "2024-01-10",
    },
    {
      id: "r3",
      userName: "Ana Rodríguez",
      rating: 4,
      comment: "Great experience overall. The clinic was clean and modern. Would definitely recommend.",
      date: "2024-01-05",
    },
  ],
};

export default function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { addToast } = useToast();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState(mockProfessional.services[0]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isBooking, setIsBooking] = useState(false);

  const selectedDayAvailability = selectedDate 
    ? mockProfessional.availability[selectedDate as keyof typeof mockProfessional.availability] || []
    : [];

  const availableDates = Object.keys(mockProfessional.availability).filter(
    day => mockProfessional.availability[day as keyof typeof mockProfessional.availability].length > 0
  );

  const handleBooking = async () => {
    if (!selectedService || !selectedDate || !selectedTime) return;
    
    setIsBooking(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      addToast({
        variant: "success",
        title: "Booking Successful!",
        message: `Your appointment with ${mockProfessional.name} has been reserved.`,
      });
      setShowBookingModal(false);
      router.push("/dashboard/appointments");
    } catch (error) {
      addToast({
        variant: "error",
        title: "Booking Failed",
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="main-container py-8">
        <Link 
          href="/search" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to search
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Doctor Info Card */}
            <Card className="p-6">
              <div className="flex items-start gap-6">
                <Avatar src={mockProfessional.avatar} name={mockProfessional.name} size="lg" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                      {mockProfessional.name}
                    </h1>
                    {mockProfessional.verified && (
                      <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <p className="font-semibold text-blue-600 mb-2">{mockProfessional.specialty}</p>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="font-semibold text-slate-900">{mockProfessional.rating}</span>
                      <span>({mockProfessional.reviewCount} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {mockProfessional.location}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {mockProfessional.languages.map((lang) => (
                      <Badge key={lang} variant="secondary">{lang}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* About Card */}
            <Card className="p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-3 tracking-tight">About</h2>
              <p className="text-slate-500 font-medium leading-relaxed">{mockProfessional.bio}</p>
            </Card>

            {/* Services & Reviews Tabs */}
            <Tabs defaultValue="services">
              <TabsList className="mb-4">
                <TabsTrigger value="services">Services ({mockProfessional.services.length})</TabsTrigger>
                <TabsTrigger value="reviews">Reviews ({mockProfessional.reviews.length})</TabsTrigger>
              </TabsList>
              <TabsContent value="services" className="space-y-4">
                {mockProfessional.services.map((service) => (
                  <Card 
                    key={service.id} 
                    hover
                    className={`p-6 transition-all ${selectedService.id === service.id ? "border-blue-500 ring-2 ring-blue-500/20" : ""}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 text-lg mb-1">{service.title}</h3>
                        <p className="text-sm text-slate-500 font-medium mb-3">{service.description}</p>
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {service.duration} min
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {service.location}
                          </div>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-2xl font-bold text-slate-900">{formatCurrency(service.price)}</p>
                        <Button 
                          size="sm" 
                          className="mt-2"
                          onClick={() => {
                            setSelectedService(service);
                            setShowBookingModal(true);
                          }}
                        >
                          Book
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>
              <TabsContent value="reviews" className="space-y-4">
                {mockProfessional.reviews.map((review) => (
                  <Card key={review.id} className="p-4 bg-slate-50/50">
                    <div className="flex items-start gap-3">
                      <Avatar name={review.userName} size="sm" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div>
                            <p className="font-semibold text-slate-900">{review.userName}</p>
                            <p className="text-xs text-slate-400">{formatDate(review.date)}</p>
                          </div>
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} 
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 font-medium">{review.comment}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Quick Book */}
          <div className="space-y-6">
            <Card className="p-6 sticky top-24 shadow-xl shadow-slate-200/50">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-slate-900 tracking-tight">Quick Book</CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-2">Select Service</p>
                  <select
                    className="w-full h-12 px-4 text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                    value={selectedService.id}
                    onChange={(e) => {
                      const service = mockProfessional.services.find(s => s.id === e.target.value);
                      if (service) setSelectedService(service);
                    }}
                  >
                    {mockProfessional.services.map(s => (
                      <option key={s.id} value={s.id}>{s.title}</option>
                    ))}
                  </select>
                </div>

                <div className="p-4 rounded-xl bg-slate-50">
                  <p className="text-sm font-semibold text-slate-700 mb-2">{selectedService.title}</p>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-500">Duration</span>
                    <span className="text-slate-700">{selectedService.duration} min</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Price</span>
                    <span className="font-bold text-blue-600">{formatCurrency(selectedService.price)}</span>
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => setShowBookingModal(true)}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Appointment
                </Button>

                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Shield className="w-4 h-4 text-emerald-500" />
                  Secure payment with escrow protection
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <Modal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        title="Book Appointment"
        size="md"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-50">
            <p className="font-semibold text-slate-900">{selectedService.title}</p>
            <p className="text-sm text-slate-500">{selectedService.duration} min • {formatCurrency(selectedService.price)}</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Select Day</label>
            <div className="flex flex-wrap gap-2">
              {availableDates.map((day) => (
                <button
                  key={day}
                  onClick={() => {
                    setSelectedDate(day);
                    setSelectedTime("");
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
                    selectedDate === day
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {selectedDate && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Select Time</label>
              <div className="flex flex-wrap gap-2">
                {selectedDayAvailability.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      selectedTime === time
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {formatTime(time)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedDate && selectedTime && (
            <div className="p-4 rounded-xl border-2 border-blue-500 bg-blue-50">
              <p className="text-sm text-slate-500">Appointment Summary</p>
              <p className="font-semibold text-slate-900 capitalize">
                {selectedDate} at {formatTime(selectedTime)}
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowBookingModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleBooking} 
              className="flex-1"
              isLoading={isBooking}
              disabled={!selectedDate || !selectedTime}
            >
              Confirm Booking
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
