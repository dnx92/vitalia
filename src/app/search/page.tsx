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
  Shield,
  ChevronDown,
  SlidersHorizontal,
  Stethoscope,
  Calendar,
  DollarSign
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { formatCurrency } from "@/lib/utils";

const mockProfessionals = [
  { id: "1", name: "Dr. Elena Martínez", specialty: "Cardiology", location: "Miami, FL", rating: 4.9, reviewCount: 127, languages: ["Spanish", "English"], price: 15000, verified: true, nextAvailable: "Tomorrow", bio: "Board-certified cardiologist with 15+ years of experience" },
  { id: "2", name: "Dr. Michael Chen", specialty: "Dermatology", location: "San Francisco, CA", rating: 4.8, reviewCount: 89, languages: ["English", "Mandarin"], price: 20000, verified: true, nextAvailable: "Today", bio: "Specialist in cosmetic and medical dermatology" },
  { id: "3", name: "Dr. Sarah Johnson", specialty: "Pediatrics", location: "New York, NY", rating: 4.9, reviewCount: 203, languages: ["English"], price: 12000, verified: true, nextAvailable: "Today", bio: "Compassionate care for children of all ages" },
  { id: "4", name: "Dr. David Park", specialty: "Orthopedics", location: "Los Angeles, CA", rating: 4.8, reviewCount: 156, languages: ["English", "Korean"], price: 18000, verified: true, nextAvailable: "In 2 days", bio: "Expert in sports medicine and joint replacement" },
  { id: "5", name: "Dr. Maria Garcia", specialty: "Neurology", location: "Houston, TX", rating: 4.7, reviewCount: 78, languages: ["Spanish", "English"], price: 16000, verified: true, nextAvailable: "Tomorrow", bio: "Specializing in headache and movement disorders" },
  { id: "6", name: "Dr. James Wilson", specialty: "Internal Medicine", location: "Chicago, IL", rating: 4.9, reviewCount: 312, languages: ["English"], price: 10000, verified: true, nextAvailable: "Today", bio: "Preventive care and chronic disease management" },
];

const specialties = ["Cardiology", "Dermatology", "Pediatrics", "Orthopedics", "Neurology", "Internal Medicine", "Psychiatry", "Ophthalmology"];
const conditions = ["Chest Pain", "Skin Rash", "Joint Pain", "Headache", "Fatigue", "High Blood Pressure"];

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
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredDoctors = mockProfessionals.filter((doctor) => {
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
    <div className="min-h-screen" style={{ background: '#F8FAFC' }}>
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="main-container py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Find a Doctor</h1>
            <p className="text-gray-600">Search from our network of verified medical professionals</p>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, specialty, or condition..."
                  className="w-full h-14 pl-12 pr-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-gray-700"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center justify-center gap-2 h-14 px-6 rounded-xl border border-gray-200 font-medium text-gray-700 hover:bg-gray-50"
              >
                <SlidersHorizontal className="w-5 h-5" />
                Filters
              </button>
            </div>

            {/* Filter Pills */}
            <div className={`mt-4 flex flex-wrap gap-2 ${showFilters ? 'block' : 'hidden lg:flex'}`}>
              <select
                className="h-11 px-4 pr-10 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 appearance-none cursor-pointer hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
              >
                <option value="">All Specialties</option>
                {specialties.map(s => <option key={s} value={s}>{s}</option>)}
              </select>

              <select
                className="h-11 px-4 pr-10 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 appearance-none cursor-pointer hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
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
              </select>

              <select
                className="h-11 px-4 pr-10 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 appearance-none cursor-pointer hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
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
                  className="h-11 px-4 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  <X className="w-4 h-4" />
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-500 py-2">Popular:</span>
            {conditions.map((condition) => (
              <button
                key={condition}
                onClick={() => setSearchQuery(condition)}
                className="px-4 py-2 rounded-full border border-gray-200 text-sm font-medium text-gray-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                {condition}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="main-container py-8">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {isLoading ? "Searching..." : `${filteredDoctors.length} Doctors Available`}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {selectedSpecialty && `Showing ${selectedSpecialty}s`}
              {selectedLocation && ` in ${selectedLocation}`}
            </p>
          </div>
          <select className="h-10 px-4 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700">
            <option>Sort by: Recommended</option>
            <option>Highest Rated</option>
            <option>Lowest Price</option>
            <option>Highest Price</option>
            <option>Most Reviews</option>
          </select>
        </div>

        {/* Loading Skeleton */}
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gray-200" />
                  <div className="flex-1">
                    <div className="h-5 w-32 bg-gray-200 rounded mb-2" />
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-200 rounded" />
                  <div className="h-4 w-3/4 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No doctors found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
            <button onClick={clearAllFilters} className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredDoctors.map((doctor) => (
              <Link key={doctor.id} href={`/service/${doctor.id}`}>
                <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 cursor-pointer h-full">
                  {/* Doctor Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold">
                        {doctor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      {doctor.verified && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <Shield className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{doctor.name}</h3>
                      <p className="text-sm text-blue-600 font-medium">{doctor.specialty}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="text-sm font-medium text-gray-700">{doctor.rating}</span>
                        <span className="text-sm text-gray-400">({doctor.reviewCount})</span>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{doctor.bio}</p>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="truncate">{doctor.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-green-500" />
                      <span className="text-green-600 font-medium">{doctor.nextAvailable}</span>
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {doctor.languages.map((lang) => (
                      <span key={lang} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                        {lang}
                      </span>
                    ))}
                  </div>

                  {/* Price & CTA */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">{formatCurrency(doctor.price)}</span>
                      <span className="text-sm text-gray-500"> / visit</span>
                    </div>
                    <button className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                      Book Now
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        {!isLoading && filteredDoctors.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-gray-500 mb-4">Can&apos;t find what you&apos;re looking for?</p>
            <button className="px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors">
              Contact our support team
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
