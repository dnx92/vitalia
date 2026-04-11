'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Bell,
  Calendar,
  Wallet,
  Heart,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Settings,
  Mail,
  Smartphone,
} from 'lucide-react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'appointment',
      title: 'Upcoming Appointment',
      message: 'Your appointment with Dr. Elena Martinez is tomorrow at 10:00 AM',
      time: '2 hours ago',
      read: false,
    },
    {
      id: 2,
      type: 'wallet',
      title: 'Payment Received',
      message: 'Your wallet has been topped up with $100',
      time: 'Yesterday',
      read: false,
    },
    {
      id: 3,
      type: 'health',
      title: 'Health Reminder',
      message: "Don't forget to log your daily health metrics",
      time: '2 days ago',
      read: true,
    },
    {
      id: 4,
      type: 'message',
      title: 'New Message',
      message: 'Dr. Michael Chen sent you a message',
      time: '3 days ago',
      read: true,
    },
    {
      id: 5,
      type: 'alert',
      title: 'Appointment Reminder',
      message: 'Your appointment is scheduled for next week',
      time: '1 week ago',
      read: true,
    },
  ]);

  const [emailNotifications, setEmailNotifications] = useState({
    appointments: true,
    wallet: true,
    health: false,
    promotions: false,
    newsletter: true,
  });

  const [pushNotifications, setPushNotifications] = useState({
    appointments: true,
    wallet: true,
    health: true,
    promotions: false,
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return Calendar;
      case 'wallet':
        return Wallet;
      case 'health':
        return Heart;
      case 'message':
        return MessageSquare;
      default:
        return AlertCircle;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500 mt-1">Manage how you receive notifications</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead}>
            Mark all as read ({unreadCount})
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            All Notifications
          </CardTitle>
          <CardDescription>Your recent activity and alerts</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => {
                const Icon = getIcon(notification.type);
                return (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors cursor-pointer ${!notification.read ? 'bg-blue-50/50' : ''}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        notification.type === 'appointment'
                          ? 'bg-blue-100 text-blue-600'
                          : notification.type === 'wallet'
                            ? 'bg-teal-100 text-teal-600'
                            : notification.type === 'health'
                              ? 'bg-rose-100 text-rose-600'
                              : 'bg-purple-100 text-purple-600'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">{notification.title}</p>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Email Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Email Notifications
            </CardTitle>
            <CardDescription>Receive updates via email</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                key: 'appointments',
                label: 'Appointment Updates',
                description: 'Reminders and confirmations',
              },
              { key: 'wallet', label: 'Wallet Activity', description: 'Deposits and payments' },
              { key: 'health', label: 'Health Reminders', description: 'Daily tracking reminders' },
              {
                key: 'promotions',
                label: 'Promotions',
                description: 'Special offers and discounts',
              },
              { key: 'newsletter', label: 'Newsletter', description: 'Weekly health tips' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{item.label}</p>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={emailNotifications[item.key as keyof typeof emailNotifications]}
                    onChange={(e) =>
                      setEmailNotifications({ ...emailNotifications, [item.key]: e.target.checked })
                    }
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Push Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              Push Notifications
            </CardTitle>
            <CardDescription>Receive alerts on your device</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                key: 'appointments',
                label: 'Appointment Alerts',
                description: 'Instant appointment notifications',
              },
              { key: 'wallet', label: 'Wallet Alerts', description: 'Payment and deposit alerts' },
              { key: 'health', label: 'Health Reminders', description: 'Daily health tracking' },
              {
                key: 'promotions',
                label: 'Special Offers',
                description: 'Exclusive deals and offers',
              },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{item.label}</p>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={pushNotifications[item.key as keyof typeof pushNotifications]}
                    onChange={(e) =>
                      setPushNotifications({ ...pushNotifications, [item.key]: e.target.checked })
                    }
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button>Save Preferences</Button>
      </div>
    </div>
  );
}
