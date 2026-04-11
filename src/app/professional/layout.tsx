"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store";
import { useState } from "react";
import { 
  LayoutDashboard, 
  FileCheck, 
  Calendar, 
  Users, 
  Wallet,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  PlusCircle,
  LayoutTemplate
} from "lucide-react";

const professionalNavItems = [
  { 
    label: "Overview", 
    href: "/professional", 
    icon: LayoutDashboard 
  },
  { 
    label: "My Services", 
    href: "/professional/services", 
    icon: FileCheck,
    children: [
      { label: "All Services", href: "/professional/services", icon: FileCheck },
      { label: "Add Service", href: "/professional/services/new", icon: PlusCircle },
    ]
  },
  { 
    label: "Calendar", 
    href: "/professional/calendar", 
    icon: Calendar 
  },
  { 
    label: "Patients", 
    href: "/professional/patients", 
    icon: Users 
  },
  { 
    label: "Earnings", 
    href: "/professional/earnings", 
    icon: Wallet 
  },
];

export default function ProfessionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>(["My Services"]);

  const toggleExpanded = (label: string) => {
    setExpandedItems(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + "/");

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-slate-500 hover:text-slate-700"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <Link href="/professional" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-500 rounded-xl flex items-center justify-center">
                  <FileCheck className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-900">Professional Portal</span>
              </Link>
            </div>
            
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-sm text-slate-500 hover:text-slate-700">
                Back to Dashboard
              </Link>
              <div className="flex items-center gap-3">
                <Avatar src={user?.avatar || undefined} name={user?.name} size="sm" />
                <span className="text-sm font-medium text-slate-700 hidden sm:block">
                  {user?.name}
                </span>
                <Badge variant="success" className="text-xs">Professional</Badge>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Sidebar */}
          <aside className={cn(
            "lg:col-span-3",
            mobileMenuOpen ? "block" : "hidden lg:block"
          )}>
            <nav className="bg-white rounded-xl border border-slate-200 p-2 sticky top-24">
              {professionalNavItems.map((item) => {
                const hasChildren = item.children && item.children.length > 0;
                const isExpanded = expandedItems.includes(item.label);
                const isItemActive = isActive(item.href);

                if (hasChildren) {
                  return (
                    <div key={item.label}>
                      <button
                        onClick={() => toggleExpanded(item.label)}
                        className={cn(
                          "w-full flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                          isItemActive
                            ? "bg-blue-50 text-blue-600"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="h-5 w-5" />
                          {item.label}
                        </div>
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                      
                      {isExpanded && (
                        <div className="ml-4 mt-1 space-y-0.5">
                          {item.children!.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                                isActive(child.href)
                                  ? "bg-blue-100 text-blue-700 font-medium"
                                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                              )}
                            >
                              <child.icon className="h-4 w-4" />
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors mb-1",
                      isActive(item.href)
                        ? "bg-blue-50 text-blue-600"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
              
              <div className="pt-4 mt-4 border-t border-slate-200">
                <Link
                  href="/professional/settings"
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors mb-1",
                    isActive("/professional/settings")
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <Settings className="h-5 w-5" />
                  Settings
                </Link>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors mb-1"
                >
                  <LayoutTemplate className="h-5 w-5" />
                  Patient Dashboard
                </Link>
                <button
                  onClick={() => useAuthStore.getState().logout()}
                  className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  Sign Out
                </button>
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9 mt-8 lg:mt-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
