'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Users,
  UserCheck,
  ShieldCheck,
  Wallet,
  TrendingUp,
  Clock,
  DollarSign,
  Activity,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useAuthStore } from '@/store';
import { useRouter } from 'next/navigation';

interface Stats {
  totalUsers: number;
  totalProfessionals: number;
  pendingVerifications: number;
  totalTransactions: number;
  totalVolume: number;
}

interface RecentUser {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: string;
}

interface RecentTransaction {
  id: string;
  type: string;
  amount: string;
  status: string;
  createdAt: string;
  wallet: {
    user: { name: string | null; email: string };
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<RecentTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    if (user && !user.isAdmin) {
      router.push('/dashboard');
      return;
    }

    async function fetchStats() {
      try {
        const res = await fetch('/api/admin/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats);
          setRecentUsers(data.recentUsers);
          setRecentTransactions(data.recentTransactions);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [isAuthenticated, user, router]);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Badge variant="default" className="text-sm">
          <Activity className="mr-1 h-3 w-3" />
          Live
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[--text-secondary]">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-[--primary]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-[--text-secondary]">
              {stats?.totalProfessionals || 0} professionals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[--text-secondary]">
              Pending Verifications
            </CardTitle>
            <ShieldCheck className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pendingVerifications || 0}</div>
            <a href="/admin/professionals" className="text-xs text-[--primary] hover:underline">
              Review now
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[--text-secondary]">
              Total Transactions
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalTransactions || 0}</div>
            <p className="text-xs text-[--text-secondary]">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[--text-secondary]">
              Total Volume
            </CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(Number(stats?.totalVolume || 0))}
            </div>
            <p className="text-xs text-[--text-secondary]">Completed transactions</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.length === 0 ? (
                <p className="text-sm text-[--text-secondary]">No users yet</p>
              ) : (
                recentUsers.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between border-b border-[--border] pb-3 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">{u.name || 'Anonymous'}</p>
                      <p className="text-sm text-[--text-secondary]">{u.email}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={u.role === 'PROFESSIONAL' ? 'secondary' : 'outline'}>
                        {u.role}
                      </Badge>
                      <p className="text-xs text-[--text-secondary] mt-1">
                        {formatDate(u.createdAt)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.length === 0 ? (
                <p className="text-sm text-[--text-secondary]">No transactions yet</p>
              ) : (
                recentTransactions.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between border-b border-[--border] pb-3 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">{t.wallet.user.name || t.wallet.user.email}</p>
                      <p className="text-sm text-[--text-secondary]">
                        {t.type.replace('_', ' ').toLowerCase()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {t.type.includes('WITHDRAWAL') ? '-' : '+'}
                        {formatCurrency(Number(t.amount))}
                      </p>
                      <Badge
                        variant={t.status === 'COMPLETED' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {t.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <a
              href="/admin/users"
              className="flex items-center gap-3 rounded-[--radius-md] border border-[--border] p-4 hover:bg-[--background] transition-colors"
            >
              <Users className="h-8 w-8 text-[--primary]" />
              <div>
                <p className="font-medium">Manage Users</p>
                <p className="text-sm text-[--text-secondary]">View and edit users</p>
              </div>
            </a>
            <a
              href="/admin/professionals"
              className="flex items-center gap-3 rounded-[--radius-md] border border-[--border] p-4 hover:bg-[--background] transition-colors"
            >
              <ShieldCheck className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="font-medium">Verifications</p>
                <p className="text-sm text-[--text-secondary]">
                  {stats?.pendingVerifications || 0} pending
                </p>
              </div>
            </a>
            <a
              href="/admin/transactions"
              className="flex items-center gap-3 rounded-[--radius-md] border border-[--border] p-4 hover:bg-[--background] transition-colors"
            >
              <Wallet className="h-8 w-8 text-green-500" />
              <div>
                <p className="font-medium">Transactions</p>
                <p className="text-sm text-[--text-secondary]">View all payments</p>
              </div>
            </a>
            <a
              href="/admin/reports"
              className="flex items-center gap-3 rounded-[--radius-md] border border-[--border] p-4 hover:bg-[--background] transition-colors"
            >
              <TrendingUp className="h-8 w-8 text-purple-500" />
              <div>
                <p className="font-medium">Reports</p>
                <p className="text-sm text-[--text-secondary]">Analytics & insights</p>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
