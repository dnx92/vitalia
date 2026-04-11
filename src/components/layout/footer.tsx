import Link from 'next/link';
import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-teal-500 rounded-lg flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold">Vitalia</span>
            </Link>
            <p className="text-gray-400 text-sm">
              Connecting patients with America&apos;s best doctors.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-3">Patients</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/search" className="hover:text-white">
                  Find Doctors
                </Link>
              </li>
              <li>
                <Link href="/dashboard/health" className="hover:text-white">
                  Health Tracking
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Doctors</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/auth/register?role=professional" className="hover:text-white">
                  Join Us
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="hover:text-white">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/privacy" className="hover:text-white">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Vitalia Health, Inc.
        </div>
      </div>
    </footer>
  );
}
