"use client";

import React, { useState, useEffect, use } from "react";
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
  MessageSquare,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { useAuthStore } from "@/store";
import { BookingModal } from "@/components/booking";

interface ProfessionalData {
  id: string;
  name: string;
  specialty: string;
  title: string;
  bio: string;
  location: string;
  rating: number;
  reviewCount: number;
  languages: string[];
  verified: boolean;
  verificationStatus: string;
  image: string | null;
  services: {
    id: string;
    title: string;
    description: string;
    price: number;
    duration: number;
    location: string;
  }[];
  reviews: {
    id: string;
    userName: string;
    rating: number;
    comment: string;
    date: string;
  }[];
}

export default function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { addToast } = useToast();
  const { user } = useAuthStore();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [professional, setProfessional] = useState<ProfessionalData | null>(null);
  const [selectedService, setSelectedService] = useState<ProfessionalData['services'][0] | null>(null);

  useEffect(() => {
    const fetchProfessional = async () => {
      try {
        const response = await fetch(`/api/doctors/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProfessional(data.doctor);
          if (data.doctor?.services?.length > 0) {
            setSelectedService(data.doctor.services[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching professional:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProfessional();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!professional) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Professional not found</h2>
          <Link href="/search">
            <Button>Back to Search</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                <Avatar src={professional.image || undefined} name={professional.name} size="lg" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                      {professional.name}
                    </h1>
                    {professional.verified && (
                      <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <p className="font-semibold text-blue-600 mb-2">{professional.specialty}</p>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="font-semibold text-slate-900">{professional.rating.toFixed(1)}</span>
                      <span>({professional.reviewCount || 0} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {professional.location}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {professional.languages?.map((lang) => (
                      <Badge key={lang} variant="secondary">{lang}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* About Card */}
            <Card className="p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-3 tracking-tight">About</h2>
              <p className="text-slate-500 font-medium leading-relaxed">{professional.bio}</p>
            </Card>

            {/* Services & Reviews Tabs */}
            <Tabs defaultValue="services">
              <TabsList className="mb-4">
                <TabsTrigger value="services">Services ({professional.services?.length || 0})</TabsTrigger>
                <TabsTrigger value="reviews">Reviews ({professional.reviews?.length || 0})</TabsTrigger>
              </TabsList>
              <TabsContent value="services" className="space-y-4">
                {professional.services?.map((service) => (
                  <Card 
                    key={service.id} 
                    hover
                    className={`p-6 transition-all ${selectedService?.id === service.id ? "border-blue-500 ring-2 ring-blue-500/20" : ""}`}
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
                            if (!user) {
                              router.push("/auth/login");
                              return;
                            }
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
                {professional.reviews?.map((review) => (
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
                    value={selectedService?.id || ""}
                    onChange={(e) => {
                      const service = professional.services?.find(s => s.id === e.target.value);
                      if (service) setSelectedService(service);
                    }}
                  >
                    {professional.services?.map(s => (
                      <option key={s.id} value={s.id}>{s.title}</option>
                    ))}
                  </select>
                </div>

                {selectedService && (
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
                )}

                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => {
                    if (!user) {
                      router.push("/auth/login");
                      return;
                    }
                    setShowBookingModal(true);
                  }}
                  disabled={!selectedService}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  {user ? "Book Appointment" : "Login to Book"}
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
      {professional && (
        <BookingModal
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          professional={{
            id: professional.id,
            userId: professional.id,
            specialty: professional.specialty,
            bio: professional.bio,
            consultationFee: professional.services?.[0]?.price || 100,
            isVirtual: true,
            location: professional.location,
            user: {
              id: professional.id,
              name: professional.name,
              email: "",
              image: professional.image || undefined,
            },
            services: professional.services,
          }}
        />
      )}
    </div>
  );
}
