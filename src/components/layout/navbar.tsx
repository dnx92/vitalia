"use client";

import Link from "next/link";
import { 
  Search, 
  Calendar, 
  Wallet, 
  Heart,
  Menu,
  Bell,
  User,
  LogOut,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuthStore, useNotificationStore, useUIStore } from "@/store";
import { useRouter } from "next/navigation";

const navLinks = [
  { href: "/search", label: "Find Services", icon: Search },
  { href: "/dashboard/appointments", label: "Appointments", icon: Calendar },
  { href: "/dashboard/wallet", label: "Wallet", icon: Wallet },
  { href: "/dashboard/health", label: "Health", icon: Heart },
];

export function Navbar() {
  const { user, logout } = useAuthStore();
  const { unreadCount } = useNotificationStore();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[--border] bg-[--surface]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <button
              className="lg:hidden p-2 -ml-2 text-[--text-secondary] hover:text-[--text-primary]"
              onClick={toggleSidebar}
            >
              <Menu className="h-5 w-5" />
            </button>
            
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-[--primary] flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-[--text-primary] font-[family-name:var(--font-heading)]">
                Vitalia
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[--text-secondary] hover:text-[--primary] rounded-[--radius-md] hover:bg-[--primary]/5 transition-colors"
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 text-[--text-secondary] hover:text-[--text-primary] hover:bg-[--background] rounded-[--radius-md] transition-colors"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-[--danger] text-[10px] font-medium text-white flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>
                </div>

                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-1.5 hover:bg-[--background] rounded-[--radius-md] transition-colors"
                  >
                    <Avatar 
                      src={user.avatar} 
                      name={user.name} 
                      size="sm"
                    />
                    <span className="hidden sm:block text-sm font-medium text-[--text-primary]">
                      {user.name.split(" ")[0]}
                    </span>
                  </button>

                  {showUserMenu && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowUserMenu(false)} 
                      />
                      <div className="absolute right-0 mt-2 w-56 rounded-[--radius-md] border border-[--border] bg-[--surface] shadow-[--shadow-lg] py-1 z-20 animate-slide-in">
                        <div className="px-4 py-2 border-b border-[--border]">
                          <p className="text-sm font-medium text-[--text-primary]">{user.name}</p>
                          <p className="text-xs text-[--text-muted]">{user.email}</p>
                        </div>
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-[--text-secondary] hover:bg-[--background]"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User className="h-4 w-4" />
                          Dashboard
                        </Link>
                        <Link
                          href="/dashboard/settings"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-[--text-secondary] hover:bg-[--background]"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Settings className="h-4 w-4" />
                          Settings
                        </Link>
                        <div className="border-t border-[--border] mt-1 pt-1">
                          <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-[--danger] hover:bg-[--background]"
                          >
                            <LogOut className="h-4 w-4" />
                            Log out
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
                  <Button variant="ghost">Log in</Button>
                </Link>
                <Link href="/auth/register">
                  <Button>Sign up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

import React from "react";
