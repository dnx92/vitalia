"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { 
  Search, 
  MapPin, 
  Star, 
  Filter,
  X,
  Clock,
  CheckCircle,
  SlidersHorizontal,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

const mockDoctors = [
  { id: "1", name: "Dr. Elena Martínez", specialty: "Cardiology", location: "Miami, FL", rating: 4.9, reviewCount: 127, languages: ["Spanish", "English"], price: 15000, verified: true, nextAvailable: "Tomorrow", bio: "Board-certified cardiologist with 15+ years of experience in preventive cardiology" },
  { id: "2", name: "Dr. Michael Chen", specialty: "Dermatology", location: "San Francisco, CA", rating: 4.8, reviewCount: 89, languages: ["English", "Mandarin"], price: 20000, verified: true, nextAvailable: "Today", bio: "Specialist in cosmetic and medical dermatology with expertise in skin cancer screening" },
  { id: "3", name: "Dr. Sarah Johnson", specialty: "Pediatrics", location: "New York, NY", rating: 4.9, reviewCount: 203, languages: ["English"], price: 12000, verified: true, nextAvailable: "Today", bio: "Compassionate care for children from newborns to adolescents" },
  { id: "4", name: "Dr. David Park", specialty: "Orthopedics", location: "Los Angeles, CA", rating: 4.8, reviewCount: 156, languages: ["English", "Korean"], price: 18000, verified: true, nextAvailable: "In 2 days", bio: "Expert in sports medicine, joint replacement, and minimally invasive surgery" },
  { id: "5", name: "Dr. Maria Garcia", specialty: "Neurology", location: "Houston, TX", rating: 4.7, reviewCount: 78, languages: ["Spanish", "English"], price: 16000, verified: true, nextAvailable: "Tomorrow", bio: "Specializing in headache disorders, epilepsy, and movement disorders" },
  { id: "6", name: "Dr. James Wilson", specialty: "Internal Medicine", location: "Chicago, IL", rating: 4.9, reviewCount: 312, languages: ["English"], price: 10000, verified: true, nextAvailable: "Today", bio: "Preventive care specialist focusing on chronic disease management and wellness" },
  { id: "7", name: "Dr. Amanda Lee", specialty: "Psychiatry", location: "Boston, MA", rating: 4.8, reviewCount: 64, languages: ["English"], price: 18000, verified: true, nextAvailable: "In 3 days", bio: "Experienced in anxiety, depression, and trauma-informed therapy approaches" },
  { id: "8", name: "Dr. Robert Brown", specialty: "Ophthalmology", location: "Seattle, WA", rating: 4.6, reviewCount: 142, languages: ["English"], price: 14000, verified: true, nextAvailable: "Tomorrow", bio: "Comprehensive eye care including cataract surgery and LASIK consultations" },
  { id: "9", name: "Dr. Jennifer Taylor", specialty: "Endocrinology", location: "Denver, CO", rating: 4.9, reviewCount: 98, languages: ["English", "French"], price: 17000, verified: true, nextAvailable: "Today", bio: "Diabetes management and thyroid disorder specialist with research background" },
];

const specialties = ["Cardiology", "Dermatology", "Pediatrics", "Orthopedics", "Neurology", "Internal Medicine", "Psychiatry", "Ophthalmology", "Endocrinology"];
const conditions = ["Chest Pain", "Skin Rash", "Joint Pain", "Headache", "Fatigue", "High Blood Pressure", "Anxiety", "Diabetes"];

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState(searchParams.get("specialty") || "");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const filteredDoctors = mockDoctors.filter((doctor) => {
    if (selectedSpecialty && !doctor.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase())) return false;
    if (selectedLocation && !doctor.location.toLowerCase().includes(selectedLocation.toLowerCase())) return false;
    if (selectedRating && doctor.rating < parseFloat(selectedRating)) return false;
    if (searchQuery && !doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) && !doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const clearAllFilters = () => {
    setSelectedSpecialty("");
    setSelectedLocation("");
    setSelectedRating("");
    setSearchQuery("");
  };

  const hasActiveFilters = selectedSpecialty || selectedLocation || selectedRating || searchQuery;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200/60">
        <div className="main-container py-10">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
              Find a Doctor
            </h1>
            <p className="text-slate-500 font-medium">
              Book appointments with verified medical professionals across the United States
            </p>
          </div>

          {/* Search Bar */}
          <Card className="p-1 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 p-4">
              <div className="flex-1 relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, specialty, or condition..."
                  className="w-full h-14 pl-14 pr-5 text-base bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-slate-200 font-medium text-slate-600"
              >
                <SlidersHorizontal className="w-5 h-5" />
                Filters
                {hasActiveFilters && (
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">
                    !
                  </span>
                )}
              </button>
            </div>

            {/* Filters */}
            <div className={`px-4 pb-4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="flex flex-wrap items-center gap-3">
                <select
                  className="h-12 px-4 text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                >
                  <option value="">All Specialties</option>
                  {specialties.map(s => <option key={s} value={s}>{s}</option>)}
                </select>

                <select
                  className="h-12 px-4 text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                >
                  <option value="">All Locations</option>
                  <option value="New York">New York, NY</option>
                  <option value="Los Angeles">Los Angeles, CA</option>
                  <option value="Chicago">Chicago, IL</option>
                  <option value="Houston">Houston, TX</option>
                  <option value="Miami">Miami, FL</option>
                  <option value="San Francisco">San Francisco, CA</option>
                  <option value="Boston">Boston, MA</option>
                  <option value="Seattle">Seattle, WA</option>
                  <option value="Denver">Denver, CO</option>
                </select>

                <select
                  className="h-12 px-4 text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                  value={selectedRating}
                  onChange={(e) => setSelectedRating(e.target.value)}
                >
                  <option value="">Any Rating</option>
                  <option value="4.5">4.5+ Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="3.5">3.5+ Stars</option>
                </select>

                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-slate-500 hover:text-slate-700"
                  >
                    <X className="w-4 h-4" />
                    Clear all
                  </button>
                )}
              </div>

              {/* Quick Links */}
              <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                <span className="text-sm font-medium text-slate-400">Popular:</span>
                {conditions.map((condition) => (
                  <button
                    key={condition}
                    onClick={() => setSearchQuery(condition)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-full text-xs font-semibold transition-colors"
                  >
                    {condition}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Results */}
      <div className="main-container py-8">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {isLoading ? "Searching..." : `${filteredDoctors.length} Doctors Available`}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {selectedSpecialty && `${selectedSpecialty}s`}
              {selectedLocation && ` in ${selectedLocation}`}
              {filteredDoctors.length > 0 && !hasActiveFilters && "sorted by recommended"}
            </p>
          </div>
          <select className="h-11 px-4 text-sm font-medium bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer">
            <option>Sort by: Recommended</option>
            <option>Highest Rated</option>
            <option>Lowest Price</option>
            <option>Most Reviews</option>
          </select>
        </div>

        {/* Loading Skeleton */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-18 h-18 rounded-full animate-pulse" style={{ width: '72px', height: '72px', background: '#E2E8F0' }} />
                  <div className="flex-1">
                    <div className="h-5 w-36 rounded animate-pulse mb-2" style={{ background: '#E2E8F0' }} />
                    <div className="h-4 w-24 rounded animate-pulse mb-2" style={{ background: '#F1F5F9' }} />
                    <div className="h-4 w-20 rounded animate-pulse" style={{ background: '#F1F5F9' }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-full rounded animate-pulse" style={{ background: '#F1F5F9' }} />
                  <div className="h-4 w-3/4 rounded animate-pulse" style={{ background: '#F1F5F9' }} />
                </div>
              </Card>
            ))}
          </div>
        ) : filteredDoctors.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">No doctors found</h3>
              <p className="text-slate-500 mb-6">Try adjusting your search or filters to find what you&apos;re looking for</p>
              <Button onClick={clearAllFilters}>Clear all filters</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <Link key={doctor.id} href={`/service/${doctor.id}`}>
                <Card hover className="h-full flex flex-col p-6 hover:border-blue-200">
                  {/* Doctor Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-18 h-18 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-lg"
                      style={{ 
                        width: '72px', 
                        height: '72px', 
                        background: 'linear-gradient(135deg, #0057ff 0%, #00b4a6 100%)',
                        boxShadow: '0 4px 14px rgba(0, 87, 255, 0.3)'
                      }}
                    >
                      {doctor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-slate-900 truncate tracking-tight">
                          {doctor.name}
                        </h3>
                        {doctor.verified && (
                          <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-3.5 h-3.5 text-white" />
                          </div>
                        )}
                      </div>
                      <p className="font-semibold text-blue-600 mb-1">{doctor.specialty}</p>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="font-semibold text-slate-900">{doctor.rating}</span>
                        <span className="text-sm text-slate-400">({doctor.reviewCount} reviews)</span>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-sm text-slate-500 font-medium leading-relaxed mb-4 flex-1">
                    {doctor.bio}
                  </p>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-600 truncate">{doctor.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm font-semibold text-emerald-600">{doctor.nextAvailable}</span>
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {doctor.languages.map((lang) => (
                      <Badge key={lang} variant="secondary" className="text-xs">{lang}</Badge>
                    ))}
                  </div>

                  {/* Price & CTA */}
                  <div className="pt-4 mt-auto border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-slate-900">{formatCurrency(doctor.price)}</span>
                      <span className="text-sm text-slate-400"> / visit</span>
                    </div>
                    <Button size="sm" className="text-sm">
                      Book
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        {!isLoading && filteredDoctors.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-slate-400 mb-4">Can&apos;t find what you&apos;re looking for?</p>
            <Button variant="outline">Contact our support team</Button>
          </div>
        )}
      </div>
    </div>
  );
}
