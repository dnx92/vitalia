'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Settings,
  Globe,
  Moon,
  Sun,
  Bell,
  Shield,
  Users,
  Eye,
  EyeOff,
  CheckCircle,
  Loader2,
} from 'lucide-react';

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [preferences, setPreferences] = useState({
    language: 'en',
    timezone: 'America/New_York',
    currency: 'USD',
    theme: 'light',
    profileVisibility: 'public',
    showOnlineStatus: true,
    allowMessages: true,
    marketingEmails: false,
  });

  const handleSave = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-500 mt-1">Manage your preferences and settings</p>
      </div>

      {success && (
        <div className="bg-emerald-50 text-emerald-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          Settings saved successfully!
        </div>
      )}

      {/* Language & Region */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Language & Region
          </CardTitle>
          <CardDescription>Customize your experience based on your location</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
              <select
                value={preferences.language}
                onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="en">English (US)</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
              <select
                value={preferences.timezone}
                onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select
                value={preferences.currency}
                onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {preferences.theme === 'dark' ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
            Appearance
          </CardTitle>
          <CardDescription>Customize how Vitalia looks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <button
              onClick={() => setPreferences({ ...preferences, theme: 'light' })}
              className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                preferences.theme === 'light'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Sun className="w-8 h-8 mx-auto mb-2 text-amber-500" />
              <p className="font-medium text-gray-900">Light</p>
              <p className="text-sm text-gray-500">Always light mode</p>
            </button>
            <button
              onClick={() => setPreferences({ ...preferences, theme: 'dark' })}
              className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                preferences.theme === 'dark'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Moon className="w-8 h-8 mx-auto mb-2 text-indigo-500" />
              <p className="font-medium text-gray-900">Dark</p>
              <p className="text-sm text-gray-500">Always dark mode</p>
            </button>
            <button
              onClick={() => setPreferences({ ...preferences, theme: 'system' })}
              className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                preferences.theme === 'system'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Settings className="w-8 h-8 mx-auto mb-2 text-gray-500" />
              <p className="font-medium text-gray-900">System</p>
              <p className="text-sm text-gray-500">Match device settings</p>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Privacy & Visibility
          </CardTitle>
          <CardDescription>Control who can see your information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profile Visibility
            </label>
            <select
              value={preferences.profileVisibility}
              onChange={(e) =>
                setPreferences({ ...preferences, profileVisibility: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="public">Public - Visible to everyone</option>
              <option value="private">Private - Only visible to booked professionals</option>
              <option value="hidden">Hidden - Not visible in searches</option>
            </select>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">Show Online Status</p>
                  <p className="text-sm text-gray-500">Let others see when you&apos;re online</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={preferences.showOnlineStatus}
                  onChange={(e) =>
                    setPreferences({ ...preferences, showOnlineStatus: e.target.checked })
                  }
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">Allow Messages</p>
                  <p className="text-sm text-gray-500">Let professionals send you messages</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={preferences.allowMessages}
                  onChange={(e) =>
                    setPreferences({ ...preferences, allowMessages: e.target.checked })
                  }
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data & Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Data & Analytics
          </CardTitle>
          <CardDescription>Manage how we use your data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Marketing Communications</p>
              <p className="text-sm text-gray-500">
                Receive updates about new features and promotions
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={preferences.marketingEmails}
                onChange={(e) =>
                  setPreferences({ ...preferences, marketingEmails: e.target.checked })
                }
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Settings'
          )}
        </Button>
      </div>
    </div>
  );
}
