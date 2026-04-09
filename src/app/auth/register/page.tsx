"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Heart, Mail, Lock, User, AlertCircle, UserCircle, Eye, EyeOff, CheckCircle, Phone, MapPin, Stethoscope, Shield } from "lucide-react";

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
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #F8FAFC 0%, #EBF5FF 100%)' }}>
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-5/12 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0066CC 0%, #0052A3 100%)' }}>
          {/* Decorative circles */}
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }} />
          <div className="absolute bottom-32 right-10 w-48 h-48 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }} />
          <div className="absolute top-1/2 left-1/3 w-96 h-96 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }} />
        </div>
        
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16 text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
              <Heart className="w-7 h-7" />
            </div>
            <span className="text-3xl font-bold">Vitalia</span>
          </div>
          
          <h1 className="text-4xl xl:text-5xl font-bold mb-6 leading-tight">
            Your Health,<br />Our Priority
          </h1>
          
          <p className="text-xl mb-10 opacity-90">
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
                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
                  <CheckCircle className="w-4 h-4" />
                </div>
                <span className="text-lg">{item}</span>
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
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0066CC 0%, #0052A3 100%)' }}>
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold" style={{ color: '#0066CC' }}>Vitalia</span>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl" style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)' }}>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2" style={{ color: '#0F172A' }}>Create Your Account</h2>
              <p style={{ color: '#64748B' }}>Join Vitalia for better healthcare access</p>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-4 mb-6 rounded-xl" style={{ background: '#FEF2F2', color: '#DC2626' }}>
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <p className="font-medium mb-4" style={{ color: '#374151' }}>I want to:</p>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setRole("patient")}
                      className={`p-6 rounded-2xl border-2 transition-all text-left ${role === "patient" ? "border-[#0066CC] bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}
                    >
                      <UserCircle className={`w-10 h-10 mb-3 ${role === "patient" ? "text-[#0066CC]" : "text-gray-400"}`} />
                      <p className="font-semibold" style={{ color: role === "patient" ? '#0066CC' : '#374151' }}>Find Care</p>
                      <p className="text-sm mt-1" style={{ color: '#9CA3AF' }}>Book appointments</p>
                      {role === "patient" && <CheckCircle className="w-5 h-5 text-[#0066CC] mt-2" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("professional")}
                      className={`p-6 rounded-2xl border-2 transition-all text-left ${role === "professional" ? "border-[#0066CC] bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}
                    >
                      <Stethoscope className={`w-10 h-10 mb-3 ${role === "professional" ? "text-[#0066CC]" : "text-gray-400"}`} />
                      <p className="font-semibold" style={{ color: role === "professional" ? '#0066CC' : '#374151' }}>Offer Services</p>
                      <p className="text-sm mt-1" style={{ color: '#9CA3AF' }}>I'm a doctor</p>
                      {role === "professional" && <CheckCircle className="w-5 h-5 text-[#0066CC] mt-2" />}
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full py-4 rounded-xl font-semibold text-white transition-all"
                  style={{ background: 'linear-gradient(135deg, #0066CC 0%, #0052A3 100%)', boxShadow: '0 4px 14px rgba(0, 102, 204, 0.4)' }}
                >
                  Continue as {role === "patient" ? "Patient" : "Healthcare Provider"}
                </button>
              </div>
            )}

            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#374151' }}>Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#9CA3AF' }} />
                    <input
                      type="text"
                      placeholder="John Smith"
                      className="form-input pl-12"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#374151' }}>Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#9CA3AF' }} />
                    <input
                      type="email"
                      placeholder="john@example.com"
                      className="form-input pl-12"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#374151' }}>Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#9CA3AF' }} />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="form-input pl-12 pr-12"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2"
                        style={{ color: '#9CA3AF' }}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#374151' }}>Confirm</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#9CA3AF' }} />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="form-input pl-12"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        required
                        minLength={8}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#374151' }}>Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#9CA3AF' }} />
                    <input
                      type="tel"
                      placeholder="(555) 123-4567"
                      className="form-input pl-12"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#374151' }}>State</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#9CA3AF', pointerEvents: 'none' }} />
                    <select
                      className="form-input pl-12 appearance-none"
                      style={{ backgroundImage: 'none' }}
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
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#374151' }}>Medical Specialty</label>
                    <div className="relative">
                      <Stethoscope className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#9CA3AF', pointerEvents: 'none' }} />
                      <select
                        className="form-input pl-12 appearance-none"
                        style={{ backgroundImage: 'none' }}
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
                    className="mt-1 w-5 h-5 rounded"
                    style={{ accentColor: '#0066CC' }}
                    required
                  />
                  <label htmlFor="terms" className="text-sm" style={{ color: '#64748B' }}>
                    I agree to the{" "}
                    <Link href="/terms" className="font-medium" style={{ color: '#0066CC' }}>Terms of Service</Link>
                    {" "}and{" "}
                    <Link href="/privacy" className="font-medium" style={{ color: '#0066CC' }}>Privacy Policy</Link>
                  </label>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-6 py-4 rounded-xl font-medium border-2"
                    style={{ borderColor: '#E5E7EB', color: '#4B5563' }}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-4 rounded-xl font-semibold text-white transition-all disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, #0066CC 0%, #0052A3 100%)', boxShadow: '0 4px 14px rgba(0, 102, 204, 0.4)' }}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </button>
                </div>
              </form>
            )}

            <div className="mt-8 pt-6 text-center" style={{ borderTop: '1px solid #F1F5F9' }}>
              <p style={{ color: '#64748B' }}>
                Already have an account?{" "}
                <Link href="/auth/login" className="font-semibold" style={{ color: '#0066CC' }}>
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" style={{ color: '#22C55E' }} />
              <span className="text-sm" style={{ color: '#94A3B8' }}>HIPAA Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" style={{ color: '#22C55E' }} />
              <span className="text-sm" style={{ color: '#94A3B8' }}>256-bit SSL</span>
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
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4" style={{ background: '#E2E8F0' }} />
          <div className="h-6 w-32 rounded" style={{ background: '#E2E8F0' }} />
        </div>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
