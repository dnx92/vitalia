'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store';
import { Avatar } from '@/components/ui/avatar';
import {
  User,
  Settings,
  Bell,
  Shield,
  CreditCard,
  ChevronRight,
  LogOut,
  Heart,
  Menu,
  X,
} from 'lucide-react';

const accountNavItems = [
  { href: '/account/profile', label: 'Profile', icon: User },
  { href: '/account/settings', label: 'Account Settings', icon: Settings },
  { href: '/account/notifications', label: 'Notifications', icon: Bell },
  { href: '/account/security', label: 'Security', icon: Shield },
  { href: '/account/payments', label: 'Payment Methods', icon: CreditCard },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-gray-500 hover:text-gray-700"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <Link href="/account" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-500 rounded-xl flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">My Account</span>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700">
                Back to Dashboard
              </Link>
              <div className="flex items-center gap-3">
                <Avatar src={user?.avatar} name={user?.name} size="sm" />
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {user?.name}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Sidebar */}
          <aside className={cn('lg:col-span-3', mobileMenuOpen ? 'block' : 'hidden lg:block')}>
            <nav className="space-y-1 bg-white rounded-xl border border-gray-200 p-2">
              {accountNavItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </div>
                    {isActive && <ChevronRight className="w-4 h-4" />}
                  </Link>
                );
              })}

              <div className="pt-4 mt-4 border-t border-gray-200">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  <Heart className="w-5 h-5" />
                  Back to Dashboard
                </Link>
                <button
                  onClick={() => logout()}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9 mt-8 lg:mt-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
