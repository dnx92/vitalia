"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Heart, Mail, Lock, AlertCircle, User, Eye, EyeOff, CheckCircle, Phone, MapPin, Stethoscope, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
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
    agreeTerms: false,
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

    if (!formData.agreeTerms) {
      setError("Please agree to the Terms of Service");
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

      router.push(role === "professional" ? "/professional/documents" : "/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-white to-slate-50">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-5/12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-white/10" />
          <div className="absolute bottom-32 right-10 w-48 h-48 rounded-full bg-white/5" />
          <div className="absolute top-1/2 left-1/3 w-96 h-96 rounded-full bg-white/8" />
        </div>
        
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16 text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Heart className="w-7 h-7" />
            </div>
            <span className="text-3xl font-bold tracking-tight">Vitalia</span>
          </div>
          
          <h1 className="text-4xl xl:text-5xl font-bold mb-6 leading-tight tracking-tight">
            Your Health,<br />Our Priority
          </h1>
          
          <p className="text-xl mb-10 opacity-90 leading-relaxed">
            Join thousands of Americans accessing quality healthcare through our verified network of medical professionals.
          </p>
          
          <div className="space-y-4">
            {[
              "Board-certified physicians",
              "Secure video consultations",
              "Easy online booking",
              "HIPAA compliant platform"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/30 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-emerald-300" />
                </div>
                <span className="text-lg font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 xl:w-7/12 flex items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-lg">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-blue-600 tracking-tight">Vitalia</span>
          </div>

          {/* Form Card */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 sm:p-10 shadow-xl shadow-slate-200/50 border border-white/50">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">Create Your Account</h2>
              <p className="text-slate-500 font-medium">Join Vitalia for better healthcare access</p>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-4 mb-6 rounded-xl bg-red-50 text-red-700 text-sm font-medium">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <p className="font-semibold mb-4 text-slate-700">I want to:</p>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setRole("patient")}
                      className={`p-5 rounded-xl border-2 transition-all text-left ${
                        role === "patient" 
                          ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500/20" 
                          : "border-slate-200 hover:border-slate-300 bg-slate-50"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                        role === "patient" ? "bg-blue-100" : "bg-slate-200"
                      }`}>
                        <User className={`w-5 h-5 ${role === "patient" ? "text-blue-600" : "text-slate-500"}`} />
                      </div>
                      <p className={`font-semibold ${role === "patient" ? "text-blue-600" : "text-slate-700"}`}>Find Care</p>
                      <p className="text-sm text-slate-500 mt-1">Book appointments</p>
                      {role === "patient" && (
                        <div className="mt-2 flex justify-center">
                          <CheckCircle className="w-5 h-5 text-blue-600" />
                        </div>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("professional")}
                      className={`p-5 rounded-xl border-2 transition-all text-left ${
                        role === "professional" 
                          ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500/20" 
                          : "border-slate-200 hover:border-slate-300 bg-slate-50"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                        role === "professional" ? "bg-blue-100" : "bg-slate-200"
                      }`}>
                        <Stethoscope className={`w-5 h-5 ${role === "professional" ? "text-blue-600" : "text-slate-500"}`} />
                      </div>
                      <p className={`font-semibold ${role === "professional" ? "text-blue-600" : "text-slate-700"}`}>Offer Services</p>
                      <p className="text-sm text-slate-500 mt-1">I'm a doctor</p>
                      {role === "professional" && (
                        <div className="mt-2 flex justify-center">
                          <CheckCircle className="w-5 h-5 text-blue-600" />
                        </div>
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full h-12 text-base"
                >
                  Continue as {role === "patient" ? "Patient" : "Healthcare Provider"}
                </Button>
              </div>
            )}

            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="John Smith"
                      className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      placeholder="john@example.com"
                      className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="w-full h-12 pl-12 pr-12 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="w-full h-12 pl-12 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        required
                        minLength={8}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="tel"
                      placeholder="(555) 123-4567"
                      className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">State</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    <select
                      className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    >
                      {US_STATES.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {role === "professional" && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Medical Specialty</label>
                    <div className="relative">
                      <Stethoscope className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                      <select
                        className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                        value={formData.specialty}
                        onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                      >
                        {SPECIALTIES.map((s) => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={formData.agreeTerms}
                    onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                    className="mt-1 w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    required
                  />
                  <label htmlFor="terms" className="text-sm text-slate-600 font-medium cursor-pointer">
                    I agree to the{" "}
                    <Link href="/terms" className="font-semibold text-blue-600 hover:underline">Terms of Service</Link>
                    {" "}and{" "}
                    <Link href="/privacy" className="font-semibold text-blue-600 hover:underline">Privacy Policy</Link>
                  </label>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="px-6"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    isLoading={isLoading}
                    className="flex-1"
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </div>
              </form>
            )}

            <div className="mt-8 pt-6 text-center border-t border-slate-100">
              <p className="text-slate-500 font-medium">
                Already have an account?{" "}
                <Link href="/auth/login" className="font-semibold text-blue-600 hover:text-blue-700">
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span className="text-sm text-slate-400 font-medium">HIPAA Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-500" />
              <span className="text-sm text-slate-400 font-medium">256-bit SSL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 bg-slate-200" />
          <div className="h-6 w-32 rounded bg-slate-200" />
        </div>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
