import React from "react";
import Link from "next/link";
import { Heart, Shield, Lock, Eye, FileText, Database } from "lucide-react";

export default function PrivacyPage() {
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
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-4">Privacy Policy</h1>
          <p className="text-slate-500 font-medium">Last updated: January 15, 2026</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 lg:p-12 space-y-8">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              1. Introduction
            </h2>
            <p className="text-slate-600 font-medium leading-relaxed">
              Vitalia is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, 
              and safeguard your information when you use our platform. We comply with HIPAA requirements for healthcare data 
              and applicable privacy laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-600" />
              2. Information We Collect
            </h2>
            <p className="text-slate-600 font-medium leading-relaxed mb-4">We collect the following types of information:</p>
            <ul className="list-disc list-inside text-slate-600 font-medium space-y-2 ml-4">
              <li><strong>Personal Information:</strong> Name, email, phone, address, date of birth</li>
              <li><strong>Health Information:</strong> Medical history, health metrics, appointment records</li>
              <li><strong>Payment Information:</strong> Billing details (processed securely via Stripe)</li>
              <li><strong>Usage Data:</strong> Device information, IP address, browsing history</li>
              <li><strong>Communication Data:</strong> Messages between users and healthcare providers</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-600" />
              3. How We Use Your Information
            </h2>
            <p className="text-slate-600 font-medium leading-relaxed mb-4">We use collected information to:</p>
            <ul className="list-disc list-inside text-slate-600 font-medium space-y-2 ml-4">
              <li>Provide and maintain our healthcare platform services</li>
              <li>Facilitate appointments between patients and healthcare providers</li>
              <li>Process payments and manage your wallet</li>
              <li>Send important notifications about appointments and services</li>
              <li>Improve our platform and user experience</li>
              <li>Comply with legal obligations and protect our rights</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-600" />
              4. Data Security
            </h2>
            <p className="text-slate-600 font-medium leading-relaxed">
              We implement industry-standard security measures including encryption (AES-256), secure servers, 
              regular security audits, and employee training. However, no method of transmission over the Internet 
              is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">5. HIPAA Compliance</h2>
            <p className="text-slate-600 font-medium leading-relaxed">
              As a healthcare platform, we comply with the Health Insurance Portability and Accountability Act (HIPAA). 
              Protected Health Information (PHI) is handled with strict safeguards, and we maintain Business Associate 
              Agreements (BAAs) with relevant service providers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">6. Your Rights</h2>
            <p className="text-slate-600 font-medium leading-relaxed mb-4">Under applicable privacy laws, you have the right to:</p>
            <ul className="list-disc list-inside text-slate-600 font-medium space-y-2 ml-4">
              <li>Access your personal information</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data (subject to legal requirements)</li>
              <li>Opt out of marketing communications</li>
              <li>Receive a copy of your data</li>
              <li>Lodge a complaint with supervisory authorities</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">7. Cookies & Tracking</h2>
            <p className="text-slate-600 font-medium leading-relaxed">
              We use cookies and similar technologies to enhance your experience, analyze usage patterns, and 
              deliver personalized content. You can control cookie preferences through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">8. Third-Party Services</h2>
            <p className="text-slate-600 font-medium leading-relaxed">
              We may share your information with trusted third parties including payment processors (Stripe), 
              cloud hosting providers, and analytics services. All third parties are contractually bound to 
              protect your data and use it only for specified purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">9. Data Retention</h2>
            <p className="text-slate-600 font-medium leading-relaxed">
              We retain your information for as long as your account is active or as needed to provide services. 
              Health records are retained in accordance with legal requirements. You may request deletion of 
              your account and associated data at any time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">10. Contact Us</h2>
            <p className="text-slate-600 font-medium leading-relaxed">
              For privacy-related questions or to exercise your rights, contact our Data Protection Officer:
            </p>
            <div className="mt-4 p-4 rounded-xl bg-slate-50">
              <p className="font-semibold text-slate-900">privacy@vitalia.com</p>
              <p className="text-slate-600 font-medium">1-800-VITALIA</p>
              <p className="text-slate-600 font-medium">Attn: Privacy Team</p>
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
