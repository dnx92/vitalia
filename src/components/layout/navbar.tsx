"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Search, 
  Calendar, 
  Wallet, 
  Heart,
  Bell,
  Menu,
  X,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Plus,
  Stethoscope,
  LayoutDashboard,
  CreditCard,
  Activity,
  Users,
  FileText,
  BarChart3,
  Shield
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";

const mainNavItems = [
  { 
    href: "/search", 
    label: "Find Doctors", 
    icon: Search,
    description: "Search specialists"
  },
  { 
    href: "/dashboard", 
    label: "Dashboard", 
    icon: LayoutDashboard,
    description: "Your overview",
    submenu: [
      { href: "/dashboard/appointments", label: "Appointments", icon: Calendar, description: "View & manage appointments" },
      { href: "/dashboard/wallet", label: "Wallet", icon: CreditCard, description: "Manage funds" },
      { href: "/dashboard/health", label: "Health", icon: Activity, description: "Track metrics" },
    ]
  },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const mockUser = {
    name: "John Smith",
    email: "john@example.com",
    avatar: undefined
  };

  const mockNotifications = [
    { id: 1, title: "Appointment Confirmed", message: "Your appointment with Dr. Martinez is confirmed", time: "2 hours ago", unread: true },
    { id: 2, title: "Health Alert", message: "Your blood pressure reading is ready", time: "5 hours ago", unread: true },
    { id: 3, title: "Payment Received", message: "Your wallet deposit was successful", time: "1 day ago", unread: false },
  ];

  const unreadCount = mockNotifications.filter(n => n.unread).length;

  return (
    <>
      <header className="navbar">
        <div className="main-container" style={{ maxWidth: '100%', padding: '0 24px' }}>
          <div className="navbar-inner">
            {/* Logo */}
            <Link href="/" className="navbar-logo" onClick={() => setMobileMenuOpen(false)}>
              <div className="navbar-logo-icon">
                <Heart className="w-5 h-5" />
              </div>
              <span>Vitalia</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="desktop-nav">
              {mainNavItems.map((item) => (
                <div key={item.href} className="nav-item-wrapper">
                  {item.submenu ? (
                    <button
                      className={`nav-link nav-dropdown ${pathname?.startsWith(item.href) ? 'active' : ''}`}
                      onClick={() => setActiveSubmenu(activeSubmenu === item.label ? null : item.label)}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${activeSubmenu === item.label ? 'rotate-180' : ''}`} />
                    </button>
                  ) : (
                    <Link 
                      href={item.href} 
                      className={`nav-link ${pathname === item.href ? 'active' : ''}`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  )}
                  
                  {item.submenu && activeSubmenu === item.label && (
                    <div className="nav-dropdown-menu">
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.href}
                          href={subitem.href}
                          className="nav-dropdown-item"
                          onClick={() => setActiveSubmenu(null)}
                        >
                          <div className="nav-dropdown-icon">
                            <subitem.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="nav-dropdown-label">{subitem.label}</div>
                            <div className="nav-dropdown-desc">{subitem.description}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="navbar-actions desktop-only">
              {/* Notifications */}
              <div className="notification-wrapper">
                <button 
                  className="icon-btn"
                  onClick={() => {
                    setNotificationsOpen(!notificationsOpen);
                    setUserMenuOpen(false);
                  }}
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount}</span>
                  )}
                </button>
                
                {notificationsOpen && (
                  <div className="notification-dropdown">
                    <div className="notification-header">
                      <h4>Notifications</h4>
                      <button className="text-sm text-blue-600">Mark all read</button>
                    </div>
                    <div className="notification-list">
                      {mockNotifications.map((notif) => (
                        <div key={notif.id} className={`notification-item ${notif.unread ? 'unread' : ''}`}>
                          <div className="notification-content">
                            <div className="notification-title">{notif.title}</div>
                            <div className="notification-message">{notif.message}</div>
                            <div className="notification-time">{notif.time}</div>
                          </div>
                          {notif.unread && <div className="unread-dot" />}
                        </div>
                      ))}
                    </div>
                    <Link href="/dashboard/notifications" className="notification-footer" onClick={() => setNotificationsOpen(false)}>
                      View all notifications
                    </Link>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="user-menu-wrapper">
                <button 
                  className="user-btn"
                  onClick={() => {
                    setUserMenuOpen(!userMenuOpen);
                    setNotificationsOpen(false);
                  }}
                >
                  <Avatar src={mockUser.avatar} name={mockUser.name} size="sm" />
                  <span className="user-name">{mockUser.name.split(' ')[0]}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {userMenuOpen && (
                  <div className="user-dropdown">
                    <div className="user-dropdown-header">
                      <Avatar src={mockUser.avatar} name={mockUser.name} size="md" />
                      <div>
                        <div className="font-semibold text-gray-900">{mockUser.name}</div>
                        <div className="text-sm text-gray-500">{mockUser.email}</div>
                      </div>
                    </div>
                    <div className="user-dropdown-menu">
                      <Link href="/dashboard" className="user-dropdown-item" onClick={() => setUserMenuOpen(false)}>
                        <User className="w-4 h-4" />
                        <span>My Dashboard</span>
                      </Link>
                      <Link href="/dashboard/settings" className="user-dropdown-item" onClick={() => setUserMenuOpen(false)}>
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </Link>
                      <Link href="/dashboard/health" className="user-dropdown-item" onClick={() => setUserMenuOpen(false)}>
                        <Activity className="w-4 h-4" />
                        <span>Health Records</span>
                      </Link>
                      <div className="border-t border-gray-100 my-1" />
                      <button className="user-dropdown-item text-red-600 hover:bg-red-50 w-full text-left" onClick={() => setUserMenuOpen(false)}>
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <Link href="/auth/register" className="btn btn-primary">
                <Plus className="w-4 h-4" />
                <span>Sign Up</span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="mobile-menu-btn mobile-only"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu">
            <div className="mobile-menu-content">
              {/* Mobile Nav Links */}
              <div className="mobile-nav-section">
                <Link href="/search" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                  <Search className="w-5 h-5" />
                  <span>Find Doctors</span>
                </Link>
                
                <div className="mobile-nav-dropdown">
                  <button 
                    className="mobile-nav-link mobile-dropdown-trigger"
                    onClick={() => setActiveSubmenu(activeSubmenu === 'Dashboard' ? null : 'Dashboard')}
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span>Dashboard</span>
                    <ChevronDown className={`w-5 h-5 ml-auto transition-transform ${activeSubmenu === 'Dashboard' ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {activeSubmenu === 'Dashboard' && (
                    <div className="mobile-dropdown-content">
                      <Link href="/dashboard" className="mobile-dropdown-link" onClick={() => setMobileMenuOpen(false)}>
                        Overview
                      </Link>
                      <Link href="/dashboard/appointments" className="mobile-dropdown-link" onClick={() => setMobileMenuOpen(false)}>
                        <Calendar className="w-4 h-4 mr-2" />
                        Appointments
                      </Link>
                      <Link href="/dashboard/wallet" className="mobile-dropdown-link" onClick={() => setMobileMenuOpen(false)}>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Wallet
                      </Link>
                      <Link href="/dashboard/health" className="mobile-dropdown-link" onClick={() => setMobileMenuOpen(false)}>
                        <Activity className="w-4 h-4 mr-2" />
                        Health
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile User Section */}
              <div className="mobile-user-section">
                <div className="mobile-user-info">
                  <Avatar src={mockUser.avatar} name={mockUser.name} size="md" />
                  <div>
                    <div className="font-semibold">{mockUser.name}</div>
                    <div className="text-sm text-gray-500">{mockUser.email}</div>
                  </div>
                </div>
                <div className="mobile-user-menu">
                  <Link href="/dashboard" className="mobile-user-link" onClick={() => setMobileMenuOpen(false)}>
                    <LayoutDashboard className="w-5 h-5" />
                    Dashboard
                  </Link>
                  <Link href="/dashboard/settings" className="mobile-user-link" onClick={() => setMobileMenuOpen(false)}>
                    <Settings className="w-5 h-5" />
                    Settings
                  </Link>
                  <Link href="/dashboard/health" className="mobile-user-link" onClick={() => setMobileMenuOpen(false)}>
                    <Activity className="w-5 h-5" />
                    Health Records
                  </Link>
                  <button className="mobile-user-link text-red-600" onClick={() => setMobileMenuOpen(false)}>
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                </div>
              </div>

              {/* Mobile Auth Buttons */}
              <div className="mobile-auth-buttons">
                <Link href="/auth/login" className="btn btn-secondary w-full justify-center" onClick={() => setMobileMenuOpen(false)}>
                  Log In
                </Link>
                <Link href="/auth/register" className="btn btn-primary w-full justify-center" onClick={() => setMobileMenuOpen(false)}>
                  <Plus className="w-4 h-4" />
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Click outside handlers */}
      {(userMenuOpen || notificationsOpen || activeSubmenu) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setUserMenuOpen(false);
            setNotificationsOpen(false);
            setActiveSubmenu(null);
          }}
        />
      )}
    </>
  );
}
