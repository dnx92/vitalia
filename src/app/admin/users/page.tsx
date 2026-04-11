'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, UserPlus, MoreVertical, Shield, UserX, Mail } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useAuthStore } from '@/store';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
  isAdmin: boolean;
  createdAt: string;
  professional: { id: string; verificationStatus: string } | null;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user: currentUser, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    } else if (currentUser && !currentUser.isAdmin) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, currentUser, router]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: '20' });
      if (search) params.set('search', search);
      const res = await fetch(`/api/admin/users?${params}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    if (isAuthenticated && currentUser?.isAdmin) {
      fetchUsers();
    }
  }, [isAuthenticated, currentUser, fetchUsers]);

  const handleToggleAdmin = async (userId: string, makeAdmin: boolean) => {
    const action = makeAdmin ? 'toggleAdmin' : 'removeAdmin';
    try {
      const res = await fetch(`/api/admin/users?id=${userId}&action=${action}`, {
        method: 'PATCH',
      });
      if (res.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Users Management</h1>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Users ({users.length})</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[--text-secondary]" />
              <Input
                placeholder="Search users..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[--border] text-left text-sm">
                  <th className="pb-3 font-medium">User</th>
                  <th className="pb-3 font-medium">Role</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Joined</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="border-b border-[--border]">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div>
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="mt-1 h-3 w-48" />
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <Skeleton className="h-6 w-20" />
                      </td>
                      <td className="py-3">
                        <Skeleton className="h-6 w-24" />
                      </td>
                      <td className="py-3">
                        <Skeleton className="h-4 w-24" />
                      </td>
                      <td className="py-3">
                        <Skeleton className="h-8 w-8" />
                      </td>
                    </tr>
                  ))
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-[--text-secondary]">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="border-b border-[--border] last:border-0">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <Avatar src={u.image || undefined} name={u.name || 'User'} size="sm" />
                          <div>
                            <p className="font-medium">{u.name || 'Anonymous'}</p>
                            <p className="text-sm text-[--text-secondary]">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <Badge variant={u.role === 'PROFESSIONAL' ? 'secondary' : 'outline'}>
                          {u.role}
                        </Badge>
                      </td>
                      <td className="py-3">
                        {u.isAdmin ? (
                          <Badge variant="default">Admin</Badge>
                        ) : u.professional ? (
                          <Badge
                            variant={
                              u.professional.verificationStatus === 'APPROVED'
                                ? 'default'
                                : u.professional.verificationStatus === 'REJECTED'
                                  ? 'danger'
                                  : 'secondary'
                            }
                          >
                            {u.professional.verificationStatus}
                          </Badge>
                        ) : (
                          <Badge variant="outline">Active</Badge>
                        )}
                      </td>
                      <td className="py-3 text-sm text-[--text-secondary]">
                        {formatDate(u.createdAt)}
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" title="Send Email">
                            <Mail className="h-4 w-4" />
                          </Button>
                          {!u.isAdmin ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleAdmin(u.id, true)}
                              title="Make Admin"
                            >
                              <Shield className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleAdmin(u.id, false)}
                              title="Remove Admin"
                            >
                              <UserX className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-[--text-secondary]">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
