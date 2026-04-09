"use client";

import React from "react";
import Link from "next/link";
import { Search, Calendar, Wallet, Heart, Bell, User, LogOut, Settings, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { useAuthStore, useNotificationStore } from "@/store";

const navLinks = [
  { href: "/search", label: "Find Doctors", icon: Search },
  { href: "/dashboard/appointments", label: "Appointments", icon: Calendar },
  { href: "/dashboard/wallet", label: "Wallet", icon: Wallet },
  { href: "/dashboard/health", label: "Health", icon: Heart },
];

export function Navbar() {
  const { user, logout } = useAuthStore();
  const { unreadCount } = useNotificationStore();
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link href="/" className="navbar-logo">
          <div className="navbar-logo-icon">
            <Heart className="w-5 h-5" />
          </div>
          <span>Vitalia</span>
        </Link>

        {/* Navigation */}
        <nav className="navbar-nav">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="nav-link">
              <link.icon className="w-4 h-4 inline mr-1" />
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="navbar-actions">
          {user ? (
            <>
              <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Avatar src={user.avatar} name={user.name} size="sm" />
                  <span className="hidden sm:block text-sm font-medium text-gray-700">
                    {user.name.split(" ")[0]}
                  </span>
                </button>

                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setShowUserMenu(false)}>
                          <User className="w-4 h-4 text-gray-400" />
                          My Dashboard
                        </Link>
                        <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setShowUserMenu(false)}>
                          <Settings className="w-4 h-4 text-gray-400" />
                          Settings
                        </Link>
                      </div>
                      <div className="border-t border-gray-100 py-1">
                        <button onClick={() => { logout(); setShowUserMenu(false); }} className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost" className="text-gray-600">Log In</Button>
              </Link>
              <Link href="/auth/register">
                <Button className="btn-primary">
                  <Plus className="w-4 h-4" />
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
