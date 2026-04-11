'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  Smartphone,
  Key,
  CheckCircle,
  AlertTriangle,
  Clock,
  Loader2,
} from 'lucide-react';

export default function SecurityPage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const [twoFactor, setTwoFactor] = useState({
    enabled: false,
    method: 'app',
    phone: '*******1234',
  });

  const handlePasswordChange = async () => {
    if (passwords.new !== passwords.confirm) {
      alert("Passwords don't match");
      return;
    }

    setIsChangingPassword(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsChangingPassword(false);
    setPasswordSuccess(true);
    setPasswords({ current: '', new: '', confirm: '' });
    setTimeout(() => setPasswordSuccess(false), 3000);
  };

  const sessions = [
    {
      device: 'Chrome on MacOS',
      location: 'New York, US',
      lastActive: 'Active now',
      current: true,
    },
    {
      device: 'Safari on iPhone',
      location: 'New York, US',
      lastActive: '2 hours ago',
      current: false,
    },
    {
      device: 'Firefox on Windows',
      location: 'Los Angeles, US',
      lastActive: '3 days ago',
      current: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Security</h1>
        <p className="text-gray-500 mt-1">Manage your account security settings</p>
      </div>

      {passwordSuccess && (
        <div className="bg-emerald-50 text-emerald-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          Password changed successfully!
        </div>
      )}

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Change Password
          </CardTitle>
          <CardDescription>Update your password to keep your account secure</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <div className="relative">
              <Input
                type={showCurrentPassword ? 'text' : 'password'}
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <div className="relative">
                <Input
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwords.new}
                  onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-medium">Password requirements:</p>
              <ul className="mt-1 space-y-1 text-amber-700">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  At least 8 characters long
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Contains at least one uppercase letter
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Contains at least one number
                </li>
              </ul>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handlePasswordChange} disabled={isChangingPassword}>
              {isChangingPassword ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Changing...
                </>
              ) : (
                'Change Password'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Two-Factor Authentication
          </CardTitle>
          <CardDescription>Add an extra layer of security to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {twoFactor.enabled ? '2FA is enabled' : '2FA is disabled'}
                </p>
                <p className="text-sm text-gray-500">
                  {twoFactor.enabled
                    ? `Using ${twoFactor.method === 'app' ? 'Authenticator App' : 'SMS'}`
                    : 'Protect your account with 2FA'}
                </p>
              </div>
            </div>
            <Button
              variant={twoFactor.enabled ? 'outline' : 'default'}
              onClick={() => setTwoFactor({ ...twoFactor, enabled: !twoFactor.enabled })}
            >
              {twoFactor.enabled ? 'Disable' : 'Enable'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Active Sessions
          </CardTitle>
          <CardDescription>Manage your active login sessions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sessions.map((session, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900">{session.device}</p>
                    {session.current && (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{session.location}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">{session.lastActive}</p>
                {!session.current && (
                  <button className="text-sm text-red-600 hover:text-red-700 font-medium mt-1">
                    Revoke
                  </button>
                )}
              </div>
            </div>
          ))}

          <Button variant="outline" className="w-full mt-4">
            Sign Out All Other Sessions
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
