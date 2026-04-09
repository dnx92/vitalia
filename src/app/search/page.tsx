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
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";

const mockProfessionals = [
  {
    id: "1",
    name: "Dr. Elena Martínez",
    specialty: "Cardiology",
    location: "Madrid, Spain",
    rating: 4.9,
    reviewCount: 127,
    languages: ["Spanish", "English", "Portuguese"],
    price: 15000,
    verified: true,
    imageUrl: "",
    nextAvailable: "Tomorrow",
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    specialty: "Dermatology",
    location: "San Francisco, USA",
    rating: 4.8,
    reviewCount: 89,
    languages: ["English", "Mandarin"],
    price: 20000,
    verified: true,
    imageUrl: "",
    nextAvailable: "Today",
  },
  {
    id: "3",
    name: "Dra. Carolina Silva",
    specialty: "Pediatrics",
    location: "São Paulo, Brazil",
    rating: 4.7,
    reviewCount: 203,
    languages: ["Portuguese", "Spanish", "English"],
    price: 12000,
    verified: true,
    imageUrl: "",
    nextAvailable: "In 2 days",
  },
  {
    id: "4",
    name: "Dr. Andreas Mueller",
    specialty: "Orthopedics",
    location: "Berlin, Germany",
    rating: 4.9,
    reviewCount: 156,
    languages: ["German", "English", "French"],
    price: 18000,
    verified: true,
    imageUrl: "",
    nextAvailable: "This week",
  },
  {
    id: "5",
    name: "Dra. María González",
    specialty: "Neurology",
    location: "Mexico City, Mexico",
    rating: 4.6,
    reviewCount: 78,
    languages: ["Spanish", "English"],
    price: 14000,
    verified: true,
    imageUrl: "",
    nextAvailable: "Tomorrow",
  },
  {
    id: "6",
    name: "Dr. James Wilson",
    specialty: "General Medicine",
    location: "London, UK",
    rating: 4.8,
    reviewCount: 312,
    languages: ["English"],
    price: 13000,
    verified: true,
    imageUrl: "",
    nextAvailable: "Today",
  },
];

const specialties = [
  { value: "", label: "All Specialties" },
  { value: "cardiology", label: "Cardiology" },
  { value: "dermatology", label: "Dermatology" },
  { value: "orthopedics", label: "Orthopedics" },
  { value: "neurology", label: "Neurology" },
  { value: "pediatrics", label: "Pediatrics" },
  { value: "ophthalmology", label: "Ophthalmology" },
  { value: "general", label: "General Medicine" },
  { value: "dentistry", label: "Dentistry" },
];

const countries = [
  { value: "", label: "All Countries" },
  { value: "US", label: "United States" },
  { value: "ES", label: "Spain" },
  { value: "MX", label: "Mexico" },
  { value: "BR", label: "Brazil" },
  { value: "AR", label: "Argentina" },
  { value: "CO", label: "Colombia" },
  { value: "DE", label: "Germany" },
  { value: "GB", label: "United Kingdom" },
];

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[--background] flex items-center justify-center">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    query: searchParams.get("q") || "",
    specialty: searchParams.get("specialty") || "",
    country: "",
    minRating: "",
    maxPrice: "",
    verified: false,
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredProfessionals = mockProfessionals.filter((p) => {
    if (filters.specialty && !p.specialty.toLowerCase().includes(filters.specialty.toLowerCase())) {
      return false;
    }
    if (filters.country && !p.location.includes(filters.country)) {
      return false;
    }
    if (filters.query && !p.name.toLowerCase().includes(filters.query.toLowerCase())) {
      return false;
    }
    if (filters.minRating && p.rating < parseFloat(filters.minRating)) {
      return false;
    }
    if (filters.maxPrice && p.price > parseInt(filters.maxPrice) * 100) {
      return false;
    }
    return true;
  });

  const clearFilters = () => {
    setFilters({
      query: "",
      specialty: "",
      country: "",
      minRating: "",
      maxPrice: "",
      verified: false,
    });
  };

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === 'verified') return value === true;
    return typeof value === 'string' && value !== '';
  });

  return (
    <div className="min-h-screen bg-[--background]">
      <div className="bg-[--surface] border-b border-[--border]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[--text-muted]" />
              <Input
                placeholder="Search by name, specialty, or condition..."
                className="pl-12 h-12 text-base"
                value={filters.query}
                onChange={(e) => setFilters({ ...filters, query: e.target.value })}
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="gap-2 lg:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4" />
                Filters
                {hasActiveFilters && (
                  <Badge variant="default" className="ml-1 h-5 w-5 p-0 justify-center">
                    !
                  </Badge>
                )}
              </Button>
              <Button className="gap-2">
                <Search className="h-4 w-4" />
                Search
              </Button>
            </div>
          </div>

          <div className={`mt-4 flex flex-wrap gap-3 ${showFilters ? "block" : "hidden lg:flex"}`}>
            <Select
              options={specialties}
              value={filters.specialty}
              onChange={(e) => setFilters({ ...filters, specialty: e.target.value })}
              placeholder="Specialty"
              className="w-full sm:w-48"
            />
            <Select
              options={countries}
              value={filters.country}
              onChange={(e) => setFilters({ ...filters, country: e.target.value })}
              placeholder="Country"
              className="w-full sm:w-48"
            />
            <Select
              options={[
                { value: "", label: "Any Rating" },
                { value: "4.5", label: "4.5+ Stars" },
                { value: "4", label: "4+ Stars" },
                { value: "3.5", label: "3.5+ Stars" },
              ]}
              value={filters.minRating}
              onChange={(e) => setFilters({ ...filters, minRating: e.target.value })}
              placeholder="Rating"
              className="w-full sm:w-40"
            />
            <Select
              options={[
                { value: "", label: "Any Price" },
                { value: "100", label: "Under $100" },
                { value: "150", label: "Under $150" },
                { value: "200", label: "Under $200" },
                { value: "300", label: "Under $300" },
              ]}
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              placeholder="Max Price"
              className="w-full sm:w-40"
            />
            <label className="flex items-center gap-2 text-sm text-[--text-secondary]">
              <input
                type="checkbox"
                checked={filters.verified}
                onChange={(e) => setFilters({ ...filters, verified: e.target.checked })}
                className="rounded border-[--border] text-[--primary]"
              />
              Verified only
            </label>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-[--text-muted]">
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-[--text-secondary]">
            {isLoading ? "Searching..." : `${filteredProfessionals.length} professionals found`}
          </p>
          <Select
            options={[
              { value: "rating", label: "Highest Rated" },
              { value: "price_low", label: "Price: Low to High" },
              { value: "price_high", label: "Price: High to Low" },
              { value: "reviews", label: "Most Reviews" },
            ]}
            placeholder="Sort by"
            className="w-48"
          />
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Skeleton className="h-14 w-14 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-32 mb-2" />
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-[--border]">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProfessionals.length === 0 ? (
          <div className="text-center py-16">
            <Search className="h-16 w-16 mx-auto text-[--text-muted] mb-4" />
            <h3 className="text-lg font-medium text-[--text-primary] mb-2">
              No professionals found
            </h3>
            <p className="text-[--text-secondary] mb-4">
              Try adjusting your filters or search terms
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Clear all filters
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProfessionals.map((professional) => (
              <Link key={professional.id} href={`/service/${professional.id}`}>
                <Card hover className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar
                        src={professional.imageUrl}
                        name={professional.name}
                        size="lg"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-[--text-primary] truncate">
                            {professional.name}
                          </h3>
                          {professional.verified && (
                            <Shield className="h-4 w-4 text-[--success] shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-[--primary]">
                          {professional.specialty}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-3.5 w-3.5 fill-[--accent] text-[--accent]" />
                          <span className="text-sm font-medium text-[--text-primary]">
                            {professional.rating}
                          </span>
                          <span className="text-xs text-[--text-muted]">
                            ({professional.reviewCount})
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-4 text-sm text-[--text-secondary]">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {professional.location}
                      </div>
                    </div>

                    <div className="mt-2 flex items-center gap-1 text-sm text-[--text-secondary]">
                      <Clock className="h-4 w-4" />
                      <span className="text-[--success]">Available {professional.nextAvailable}</span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1">
                      {professional.languages.slice(0, 3).map((lang) => (
                        <Badge key={lang} variant="outline" className="text-xs">
                          {lang}
                        </Badge>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-[--border] flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-[--primary]">
                          {formatCurrency(professional.price)}
                        </span>
                        <span className="text-sm text-[--text-muted]"> / session</span>
                      </div>
                      <Button size="sm">Book</Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
