import Link from 'next/link';
import {
  Search,
  Shield,
  CreditCard,
  Calendar,
  Heart,
  Star,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            America&apos;s Best Doctors, <span className="text-blue-600">At Your Service</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect with top-verified medical specialists. Book appointments, pay securely, and
            track your health.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/search">
              <Button size="lg">
                <Search className="w-5 h-5 mr-2" />
                Find a Doctor
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="outline" size="lg">
                Get Started
              </Button>
            </Link>
          </div>
          <div className="flex justify-center gap-6 mt-8 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-500" /> Verified Doctors
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-500" /> Secure Payments
            </span>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">5,000+</div>
              <div className="text-sm text-gray-500">Doctors</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">50+</div>
              <div className="text-sm text-gray-500">Specialties</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">98%</div>
              <div className="text-sm text-gray-500">Satisfaction</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">24/7</div>
              <div className="text-sm text-gray-500">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Why Choose Vitalia?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Verified Doctors</h3>
              <p className="text-sm text-gray-500">
                Every physician is licensed and background checked.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <CreditCard className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Secure Payments</h3>
              <p className="text-sm text-gray-500">
                Your money is protected until services are rendered.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Instant Booking</h3>
              <p className="text-sm text-gray-500">
                Book appointments in seconds with real-time availability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-blue-100 mb-6">Join thousands of Americans who trust Vitalia.</p>
          <Link href="/auth/register">
            <Button variant="secondary" size="lg">
              Create Free Account
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
