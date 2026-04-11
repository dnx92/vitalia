'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Search,
  Calendar,
  Wallet,
  Heart,
  Settings,
  Users,
  FileCheck,
  BarChart3,
  Shield,
  ChevronDown,
  ChevronRight,
  Activity,
  CreditCard,
  Clock,
  UserCheck,
  TrendingUp,
  FileText,
  LogOut,
  PlusCircle,
  type LucideIcon,
} from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuthStore, useUIStore } from '@/store';
import { useState } from 'react';

interface SidebarProps {
  type?: 'user' | 'professional' | 'admin';
}

interface NavItem {
  label: string;
  href?: string;
  icon: LucideIcon;
  badge?: string | number;
  children?: NavItem[];
}

const userNavItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    children: [
      { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
      { label: 'Appointments', href: '/dashboard/appointments', icon: Calendar },
      { label: 'Wallet', href: '/dashboard/wallet', icon: Wallet },
      { label: 'Health Tracking', href: '/dashboard/health', icon: Heart },
    ],
  },
  {
    label: 'Find Services',
    href: '/search',
    icon: Search,
  },
  {
    label: 'My Bookings',
    href: '/dashboard/appointments',
    icon: Calendar,
  },
  {
    label: 'Health',
    href: '/dashboard/health',
    icon: Activity,
  },
  {
    label: 'Wallet',
    href: '/dashboard/wallet',
    icon: CreditCard,
  },
];

const adminNavItems: NavItem[] = [
  {
    label: 'Overview',
    href: '/admin',
    icon: LayoutDashboard,
    children: [
      { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      { label: 'Quick Stats', href: '/admin', icon: TrendingUp },
    ],
  },
  {
    label: 'Users',
    href: '/admin/users',
    icon: Users,
    children: [
      { label: 'All Users', href: '/admin/users', icon: Users },
      { label: 'Pending Approval', href: '/admin/users', icon: Clock, badge: 3 },
    ],
  },
  {
    label: 'Verifications',
    href: '/admin/professionals',
    icon: Shield,
    badge: 5,
    children: [
      { label: 'All Professionals', href: '/admin/professionals', icon: UserCheck },
      { label: 'Pending Review', href: '/admin/professionals', icon: Clock, badge: 5 },
      { label: 'Rejected', href: '/admin/professionals', icon: Shield },
    ],
  },
  {
    label: 'Transactions',
    href: '/admin/transactions',
    icon: Wallet,
    children: [
      { label: 'All Transactions', href: '/admin/transactions', icon: Wallet },
      { label: 'Deposits', href: '/admin/transactions', icon: CreditCard },
      { label: 'Withdrawals', href: '/admin/transactions', icon: TrendingUp },
    ],
  },
  {
    label: 'Reports',
    href: '/admin/reports',
    icon: BarChart3,
    children: [
      { label: 'Analytics', href: '/admin/reports', icon: BarChart3 },
      { label: 'Revenue', href: '/admin/reports', icon: TrendingUp },
      { label: 'Export', href: '/admin/reports', icon: FileText },
    ],
  },
];

const professionalNavItems: NavItem[] = [
  {
    label: 'Overview',
    href: '/professional',
    icon: LayoutDashboard,
  },
  {
    label: 'My Services',
    href: '/professional/services',
    icon: FileCheck,
    children: [
      { label: 'All Services', href: '/professional/services', icon: FileCheck },
      { label: 'Add Service', href: '/professional/services/new', icon: PlusCircle },
    ],
  },
  {
    label: 'Calendar',
    href: '/professional/calendar',
    icon: Calendar,
  },
  {
    label: 'Patients',
    href: '/professional/patients',
    icon: Users,
  },
  {
    label: 'Earnings',
    href: '/professional/earnings',
    icon: Wallet,
  },
];

export function Sidebar({ type = 'user' }: SidebarProps) {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { user } = useAuthStore();
  const [expandedItems, setExpandedItems] = useState<string[]>(['Dashboard', 'Overview']);

  const navItems =
    type === 'admin'
      ? adminNavItems
      : type === 'professional'
        ? professionalNavItems
        : userNavItems;

  const toggleExpanded = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    return pathname === href || pathname?.startsWith(href + '/');
  };

  const isParentActive = (item: NavItem) => {
    if (!item.children) return isActive(item.href);
    return item.children.some((child) => isActive(child.href));
  };

  return (
    <>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={toggleSidebar} />
      )}

      <aside
        className={cn(
          'fixed left-0 top-16 z-20 h-[calc(100vh-4rem)] w-64 border-r border-gray-200 bg-white transition-transform duration-300 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex-1 overflow-y-auto py-4 px-3">
            <nav className="space-y-1">
              {navItems.map((item) => {
                const hasChildren = item.children && item.children.length > 0;
                const isItemActive = isParentActive(item);
                const isExpanded = expandedItems.includes(item.label);

                if (hasChildren) {
                  return (
                    <div key={item.label}>
                      <button
                        onClick={() => toggleExpanded(item.label)}
                        className={cn(
                          'w-full flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                          isItemActive
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="h-5 w-5" />
                          {item.label}
                        </div>
                        <div className="flex items-center gap-2">
                          {item.badge && (
                            <Badge
                              variant="default"
                              className="h-5 min-w-5 px-1.5 text-xs bg-blue-600"
                            >
                              {item.badge}
                            </Badge>
                          )}
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="ml-4 mt-1 space-y-0.5">
                          {item.children!.map((child) => (
                            <Link
                              key={child.label}
                              href={child.href || '#'}
                              onClick={() => {
                                if (window.innerWidth < 1024) toggleSidebar();
                              }}
                              className={cn(
                                'flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                                isActive(child.href)
                                  ? 'bg-blue-100 text-blue-700 font-medium'
                                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <child.icon className="h-4 w-4" />
                                {child.label}
                              </div>
                              {child.badge && (
                                <Badge
                                  variant="default"
                                  className="h-5 min-w-5 px-1.5 text-xs bg-orange-500"
                                >
                                  {child.badge}
                                </Badge>
                              )}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.label}
                    href={item.href || '#'}
                    onClick={() => {
                      if (window.innerWidth < 1024) toggleSidebar();
                    }}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive(item.href)
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                    {item.badge && (
                      <Badge
                        variant="default"
                        className="ml-auto h-5 min-w-5 px-1.5 text-xs bg-blue-600"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <Link
                href="/dashboard/settings"
                onClick={() => {
                  if (window.innerWidth < 1024) toggleSidebar();
                }}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  pathname === '/dashboard/settings'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <Settings className="h-5 w-5" />
                Settings
              </Link>

              <button
                onClick={() => {
                  useAuthStore.getState().logout();
                  if (typeof window !== 'undefined' && window.innerWidth < 1024) toggleSidebar();
                }}
                className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </div>
          </div>

          {user && (
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                <Avatar src={user.avatar || undefined} name={user.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="truncate text-xs text-gray-500">{user.email}</p>
                </div>
                <Badge variant="secondary" className="text-[10px] capitalize">
                  {user.role?.toLowerCase()}
                </Badge>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
