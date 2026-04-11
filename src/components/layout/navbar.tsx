"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Heart, Menu, X, Search, User, LogOut, LayoutDashboard, Calendar, Wallet, Heart as HeartIcon, Bell, ChevronDown, Settings, Shield, BarChart3 } from "lucide-react";
import { useAuthStore } from "@/store";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface NavDropdown {
  label: string;
  items: { label: string; href: string; icon: any; badge?: string | number }[];
}

const dashboardDropdown: NavDropdown = {
  label: "Dashboard",
  items: [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Account", href: "/account", icon: User },
    { label: "Appointments", href: "/dashboard/appointments", icon: Calendar },
    { label: "Wallet", href: "/dashboard/wallet", icon: Wallet },
    { label: "Health", href: "/dashboard/health", icon: HeartIcon },
  ],
};

const adminDropdown: NavDropdown = {
  label: "Admin",
  items: [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Users", href: "/admin/users", icon: User },
    { label: "Verifications", href: "/admin/professionals", icon: Shield, badge: "5" },
    { label: "Transactions", href: "/admin/transactions", icon: BarChart3 },
    { label: "Reports", href: "/admin/reports", icon: BarChart3 },
  ],
};

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    logout();
    router.push("/");
    setMobileOpen(false);
  };

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + "/");

  const getDropdowns = () => {
    if (user?.role === "ADMIN") return [dashboardDropdown, adminDropdown];
    if (user?.role === "PROFESSIONAL") return [dashboardDropdown];
    return [dashboardDropdown];
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-teal-500 rounded-xl flex items-center justify-center shadow-md">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
              Vitalia
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {/* Find Doctors - Always visible */}
            <Link href="/search">
              <Button variant="ghost" size="sm" className={cn(
                "gap-2",
                isActive("/search") && "text-blue-600"
              )}>
                <Search className="w-4 h-4" />
                Find Doctors
              </Button>
            </Link>

            {/* Dropdowns for logged in users */}
            {user && getDropdowns().map((dropdown) => (
              <div key={dropdown.label} className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setOpenDropdown(openDropdown === dropdown.label ? null : dropdown.label)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    openDropdown === dropdown.label || isActive(dropdown.items[0].href)
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )}
                >
                  {dropdown.label}
                  <ChevronDown className={cn(
                    "w-4 h-4 transition-transform",
                    openDropdown === dropdown.label && "rotate-180"
                  )} />
                </button>

                {openDropdown === dropdown.label && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-in fade-in-0 zoom-in-95">
                    {dropdown.items.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => {
                          setOpenDropdown(null);
                        }}
                        className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="w-4 h-4" />
                          {item.label}
                        </div>
                        {item.badge && (
                          <Badge variant="default" className="h-5 min-w-5 px-1.5 text-xs bg-orange-500">
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </Button>

                {/* User Menu */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setOpenDropdown(openDropdown === "user" ? null : "user")}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Avatar src={user.avatar || undefined} name={user.name} size="sm" />
                    <span className="text-sm font-medium text-gray-700 hidden lg:block">
                      {user.name?.split(" ")[0]}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>

                  {openDropdown === "user" && (
                    <div className="absolute top-full right-0 mt-1 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-in fade-in-0 zoom-in-95">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <Link
                        href="/account"
                        onClick={() => setOpenDropdown(null)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        My Account
                      </Link>
                      <Link
                        href="/account/profile"
                        onClick={() => setOpenDropdown(null)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        Profile
                      </Link>
                      <Link
                        href="/dashboard"
                        onClick={() => setOpenDropdown(null)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>
                      <div className="border-t border-gray-100 my-1" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-1">
              {/* Find Doctors */}
              <Link
                href="/search"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg",
                  isActive("/search")
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                <Search className="w-5 h-5" />
                Find Doctors
              </Link>

              {/* Dashboard Section */}
              {user && (
                <>
                  <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Dashboard
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg ml-2",
                      isActive("/dashboard") && !isActive("/dashboard/")
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-50"
                    )}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Overview
                  </Link>
                  <Link
                    href="/dashboard/appointments"
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg ml-2",
                      isActive("/dashboard/appointments")
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-50"
                    )}
                  >
                    <Calendar className="w-4 h-4" />
                    Appointments
                  </Link>
                  <Link
                    href="/dashboard/wallet"
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg ml-2",
                      isActive("/dashboard/wallet")
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-50"
                    )}
                  >
                    <Wallet className="w-4 h-4" />
                    Wallet
                  </Link>
                  <Link
                    href="/dashboard/health"
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg ml-2",
                      isActive("/dashboard/health")
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-50"
                    )}
                  >
                    <HeartIcon className="w-4 h-4" />
                    Health
                  </Link>
                </>
              )}

              {user?.role === "ADMIN" && (
                <>
                  <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mt-2">
                    Admin
                  </div>
                  <Link
                    href="/admin/users"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg ml-2"
                  >
                    <User className="w-4 h-4" />
                    Users
                  </Link>
                  <Link
                    href="/admin/professionals"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg ml-2"
                  >
                    <Shield className="w-4 h-4" />
                    Verifications
                  </Link>
                  <Link
                    href="/admin/transactions"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg ml-2"
                  >
                    <BarChart3 className="w-4 h-4" />
                    Transactions
                  </Link>
                </>
              )}

              <div className="border-t border-gray-100 mt-2 pt-2">
                {user ? (
                  <>
                    <Link
                      href="/dashboard/settings"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                      <Button variant="outline" className="w-full mb-2">Login</Button>
                    </Link>
                    <Link href="/auth/register" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-teal-500">
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
