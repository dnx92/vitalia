"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Heart, Mail, Lock, User, AlertCircle, UserCircle, Eye, EyeOff, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useAuthStore } from "@/store";

const US_STATES = [
  { value: "", label: "Select your state" },
  { value: "AL", label: "Alabama" }, { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" }, { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" }, { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" }, { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" }, { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" }, { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" }, { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" }, { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" }, { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" }, { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" }, { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" }, { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" }, { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" }, { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" }, { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" }, { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" }, { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" }, { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" }, { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" }, { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" }, { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" }, { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" }, { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" }, { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" }, { value: "WY", label: "Wyoming" },
];

const SPECIALTIES = [
  { value: "", label: "Select your specialty" },
  { value: "cardiology", label: "Cardiology" },
  { value: "dermatology", label: "Dermatology" },
  { value: "family_medicine", label: "Family Medicine" },
  { value: "internal_medicine", label: "Internal Medicine" },
  { value: "neurology", label: "Neurology" },
  { value: "obstetrics", label: "Obstetrics & Gynecology" },
  { value: "oncology", label: "Oncology" },
  { value: "ophthalmology", label: "Ophthalmology" },
  { value: "orthopedics", label: "Orthopedics" },
  { value: "pediatrics", label: "Pediatrics" },
  { value: "psychiatry", label: "Psychiatry" },
  { value: "radiology", label: "Radiology" },
  { value: "surgery", label: "Surgery" },
  { value: "urology", label: "Urology" },
  { value: "other", label: "Other" },
];

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"patient" | "professional">(
    searchParams.get("role") === "professional" ? "professional" : "patient"
  );
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    state: "",
    specialty: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          state: formData.state,
          specialty: formData.specialty,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      setUser(data.user);
      router.push(role === "professional" ? "/professional/documents" : "/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-xl shadow-slate-200/50">
      <CardContent className="pt-6">
        {error && (
          <div className="flex items-center gap-2 p-4 mb-6 rounded-xl bg-rose-50 text-rose-700 text-sm">
            <AlertCircle className="h-5 w-5 shrink-0" />
            {error}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">How will you use Vitalia?</h3>
              <p className="text-sm text-slate-600">Choose how you want to get started</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole("patient")}
                className={`p-6 rounded-xl border-2 text-left transition-all ${
                  role === "patient"
                    ? "border-cyan-500 bg-cyan-50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <UserCircle className={`h-10 w-10 mb-3 ${role === "patient" ? "text-cyan-600" : "text-slate-400"}`} />
                <p className="font-semibold text-slate-900">Find Care</p>
                <p className="text-sm text-slate-500 mt-1">Book appointments with doctors</p>
                {role === "patient" && <CheckCircle className="h-5 w-5 text-cyan-600 mt-2" />}
              </button>
              <button
                type="button"
                onClick={() => setRole("professional")}
                className={`p-6 rounded-xl border-2 text-left transition-all ${
                  role === "professional"
                    ? "border-cyan-500 bg-cyan-50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <Heart className={`h-10 w-10 mb-3 ${role === "professional" ? "text-cyan-600" : "text-slate-400"}`} />
                <p className="font-semibold text-slate-900">Offer Services</p>
                <p className="text-sm text-slate-500 mt-1">I&apos;m a medical professional</p>
                {role === "professional" && <CheckCircle className="h-5 w-5 text-cyan-600 mt-2" />}
              </button>
            </div>

            <Button onClick={() => setStep(2)} className="w-full h-12 text-base bg-gradient-to-r from-cyan-500 to-blue-600">
              Continue as {role === "patient" ? "Patient" : "Healthcare Provider"}
            </Button>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="John Smith"
                  className="pl-11 h-12"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  className="pl-11 h-12"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-11 h-12"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    minLength={8}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Confirm
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-3 h-12"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                    minLength={8}
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              {showPassword ? "Hide passwords" : "Show passwords"}
            </button>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Phone Number
              </label>
              <Input
                type="tel"
                placeholder="(555) 123-4567"
                className="h-12"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <Select
              label="State"
              options={US_STATES}
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            />

            {role === "professional" && (
              <Select
                label="Medical Specialty"
                options={SPECIALTIES}
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
              />
            )}

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setStep(1)} className="h-12">
                Back
              </Button>
              <Button type="submit" className="flex-1 h-12 bg-gradient-to-r from-cyan-500 to-blue-600" isLoading={isLoading}>
                Create Account
              </Button>
            </div>
          </form>
        )}
      </CardContent>
      <CardFooter className="justify-center pb-6">
        <p className="text-slate-600">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-semibold text-cyan-600 hover:text-cyan-700">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 bg-gradient-to-br from-cyan-50 via-white to-blue-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-200">
              <Heart className="h-7 w-7 text-white" />
            </div>
          </Link>
          <h1 className="mt-6 text-3xl font-bold text-slate-900">Create Your Account</h1>
          <p className="mt-2 text-slate-600">Join thousands of Americans on Vitalia</p>
        </div>

        <Suspense fallback={<div className="animate-pulse text-center">Loading...</div>}>
          <RegisterForm />
        </Suspense>

        <p className="mt-6 text-center text-xs text-slate-500">
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="text-cyan-600 hover:underline">Terms of Service</Link>
          {" "}and{" "}
          <Link href="/privacy" className="text-cyan-600 hover:underline">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}
