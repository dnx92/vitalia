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
  Globe,
  CheckCircle,
  Calendar,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
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
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Link 
          href="/search" 
          className="inline-flex items-center gap-2 text-gray-500 hover:text-[--primary] mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to search
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-6">
                  <Avatar src={mockProfessional.avatar} name={mockProfessional.name} size="lg" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl font-bold text-gray-900">
                        {mockProfessional.name}
                      </h1>
                      {mockProfessional.verified && (
                        <Shield className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                    <p className="text-[--primary] font-medium">{mockProfessional.specialty}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-orange-400 text-orange-400" />
                        <span className="font-medium">{mockProfessional.rating}</span>
                        <span>({mockProfessional.reviewCount} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {mockProfessional.location}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      {mockProfessional.languages.map((lang) => (
                        <Badge key={lang} variant="outline">{lang}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4 text-gray-900">About</h2>
                <p className="text-gray-600">{mockProfessional.bio}</p>
              </CardContent>
            </Card>

            <Tabs defaultValue="services">
              <TabsList>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="reviews">Reviews ({mockProfessional.reviews.length})</TabsTrigger>
              </TabsList>
              <TabsContent value="services" className="mt-4">
                <div className="space-y-4">
                  {mockProfessional.services.map((service) => (
                    <Card 
                      key={service.id} 
                      hover={selectedService.id !== service.id}
                      className={selectedService.id === service.id ? "border-[--primary] ring-2 ring-[--primary]/20" : ""}
                    >
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{service.title}</h3>
                            <p className="text-sm text-gray-500 mt-1">{service.description}</p>
                            <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {service.duration} min
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {service.location}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-[--primary]">
                              {formatCurrency(service.price)}
                            </p>
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
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="mt-4">
                <div className="space-y-4">
                  {mockProfessional.reviews.map((review) => (
                    <div key={review.id} className="p-4 rounded-xl bg-gray-50">
                      <div className="flex items-center gap-3 mb-2">
                        <Avatar name={review.userName} size="sm" />
                        <div>
                          <p className="font-medium text-gray-900">{review.userName}</p>
                          <p className="text-xs text-gray-400">{formatDate(review.date)}</p>
                        </div>
                        <div className="ml-auto flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${
                                i < review.rating 
                                  ? "fill-orange-400 text-orange-400" 
                                  : "text-gray-200"
                              }`} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card className="sticky top-24 shadow-lg border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Quick Book</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-2">
                    Select Service
                  </p>
                  <Select
                    options={mockProfessional.services.map(s => ({
                      value: s.id,
                      label: `${s.title} - ${formatCurrency(s.price)}`,
                    }))}
                    value={selectedService.id}
                    onChange={(e) => {
                      const service = mockProfessional.services.find(s => s.id === e.target.value);
                      if (service) setSelectedService(service);
                    }}
                  />
                </div>

                <div className="p-4 rounded-xl bg-gray-50">
                  <p className="text-sm font-medium text-gray-900 mb-2">
                    {selectedService.title}
                  </p>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Duration</span>
                    <span>{selectedService.duration} min</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-gray-500">Price</span>
                    <span className="font-semibold text-[--primary]">
                      {formatCurrency(selectedService.price)}
                    </span>
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => setShowBookingModal(true)}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Appointment
                </Button>

                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Shield className="h-4 w-4 text-green-500" />
                  Secure payment with escrow protection
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        title="Book Appointment"
        size="md"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-gray-50">
            <p className="font-medium text-gray-900">{selectedService.title}</p>
            <p className="text-sm text-gray-500">{selectedService.duration} min • {formatCurrency(selectedService.price)}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Select Day
            </label>
            <div className="flex flex-wrap gap-2">
              {availableDates.map((day) => (
                <button
                  key={day}
                  onClick={() => {
                    setSelectedDate(day);
                    setSelectedTime("");
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                    selectedDate === day
                      ? "bg-[--primary] text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {selectedDate && (
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Select Time
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedDayAvailability.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedTime === time
                        ? "bg-[--primary] text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {formatTime(time)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedDate && selectedTime && (
            <div className="p-4 rounded-xl border-2 border-[--primary] bg-blue-50">
              <p className="text-sm text-gray-500">Appointment Summary</p>
              <p className="font-medium text-gray-900 capitalize">
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
