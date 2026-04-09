import React from "react";
import Link from "next/link";
import { Heart, Shield, Lock, Users, FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="main-container max-w-4xl">
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-3 mb-8">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900">Vitalia</span>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-4">Terms of Service</h1>
          <p className="text-slate-500 font-medium">Last updated: January 15, 2026</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 lg:p-12 space-y-8">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              1. Acceptance of Terms
            </h2>
            <p className="text-slate-600 font-medium leading-relaxed">
              By accessing and using Vitalia, you accept and agree to be bound by the terms and provisions of this agreement. 
              If you do not agree to abide by these terms, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              2. User Accounts
            </h2>
            <p className="text-slate-600 font-medium leading-relaxed mb-4">
              To access certain features, you must create an account. You are responsible for:
            </p>
            <ul className="list-disc list-inside text-slate-600 font-medium space-y-2 ml-4">
              <li>Maintaining the confidentiality of your login credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use</li>
              <li>Providing accurate and complete information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              3. Medical Services
            </h2>
            <p className="text-slate-600 font-medium leading-relaxed mb-4">
              Vitalia provides a platform connecting patients with healthcare providers. Important information:
            </p>
            <ul className="list-disc list-inside text-slate-600 font-medium space-y-2 ml-4">
              <li>Vitalia does not provide medical advice or services directly</li>
              <li>All healthcare providers are independent professionals</li>
              <li>Users should consult qualified healthcare providers for medical decisions</li>
              <li>Appointments and services are subject to provider availability</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-600" />
              4. Payment Terms
            </h2>
            <p className="text-slate-600 font-medium leading-relaxed">
              Payments are processed securely through our platform. Funds are held in escrow until services are rendered. 
              Refund policies vary based on cancellation timing and service type. Please review specific cancellation policies 
              before booking appointments.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">5. Privacy & Data Protection</h2>
            <p className="text-slate-600 font-medium leading-relaxed">
              Your privacy is important to us. We collect and process personal information in accordance with HIPAA guidelines 
              and applicable data protection laws. By using Vitalia, you consent to our data practices described in our 
              Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">6. Limitation of Liability</h2>
            <p className="text-slate-600 font-medium leading-relaxed">
              Vitalia shall not be liable for any indirect, incidental, special, consequential, or punitive damages, 
              including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting 
              from your use of the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">7. Changes to Terms</h2>
            <p className="text-slate-600 font-medium leading-relaxed">
              We reserve the right to modify these terms at any time. We will provide notice of significant changes via 
              email or prominent notice on our platform. Continued use of Vitalia after changes constitutes acceptance 
              of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">8. Contact Information</h2>
            <p className="text-slate-600 font-medium leading-relaxed">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="mt-4 p-4 rounded-xl bg-slate-50">
              <p className="font-semibold text-slate-900">Vitalia Support Team</p>
              <p className="text-slate-600 font-medium">support@vitalia.com</p>
              <p className="text-slate-600 font-medium">1-800-VITALIA</p>
            </div>
          </section>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-semibold">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
