'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { ShieldCheck, XCircle, CheckCircle, Eye, FileText } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useAuthStore } from '@/store';
import { useRouter } from 'next/navigation';

interface Professional {
  id: string;
  title: string;
  specialty: string;
  verificationStatus: string;
  rating: string | null;
  reviewCount: number;
  documentUrls: string[];
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
}

export default function AdminProfessionalsPage() {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('PENDING');
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

  const fetchProfessionals = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ status, page: page.toString(), limit: '20' });
      const res = await fetch(`/api/admin/professionals?${params}`);
      if (res.ok) {
        const data = await res.json();
        setProfessionals(data.professionals);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Failed to fetch professionals:', error);
    } finally {
      setLoading(false);
    }
  }, [status, page]);

  useEffect(() => {
    if (isAuthenticated && currentUser?.isAdmin) {
      fetchProfessionals();
    }
  }, [isAuthenticated, currentUser, fetchProfessionals]);

  const handleVerification = async (professionalId: string, action: 'approve' | 'reject') => {
    try {
      const res = await fetch('/api/admin/professionals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ professionalId, action }),
      });
      if (res.ok) {
        fetchProfessionals();
      }
    } catch (error) {
      console.error('Failed to update professional:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <Badge variant="default" className="gap-1">
            <CheckCircle className="h-3 w-3" /> Approved
          </Badge>
        );
      case 'REJECTED':
        return (
          <Badge variant="danger" className="gap-1">
            <XCircle className="h-3 w-3" /> Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="gap-1">
            <ShieldCheck className="h-3 w-3" /> Pending
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Professional Verifications</h1>
      </div>

      <Tabs
        value={status}
        onValueChange={(v) => {
          setStatus(v);
          setPage(1);
        }}
      >
        <TabsList>
          <TabsTrigger value="PENDING">
            Pending ({status === 'PENDING' ? professionals.length : '...'})
          </TabsTrigger>
          <TabsTrigger value="APPROVED">Approved</TabsTrigger>
          <TabsTrigger value="REJECTED">Rejected</TabsTrigger>
          <TabsTrigger value="ALL">All</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-4">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="mt-2 h-4 w-32" />
                    <Skeleton className="mt-2 h-4 w-full" />
                  </div>
                  <Skeleton className="h-10 w-24" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : professionals.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <ShieldCheck className="mx-auto h-12 w-12 text-[--text-secondary]" />
              <p className="mt-4 text-lg font-medium">No professionals found</p>
              <p className="text-sm text-[--text-secondary]">
                {status === 'PENDING'
                  ? 'All verifications have been processed'
                  : `No ${status.toLowerCase()} professionals`}
              </p>
            </CardContent>
          </Card>
        ) : (
          professionals.map((p) => (
            <Card key={p.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar src={p.user.image || undefined} name={p.user.name || 'User'} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{p.user.name || 'Unnamed'}</h3>
                      {getStatusBadge(p.verificationStatus)}
                    </div>
                    <p className="text-sm text-[--text-secondary]">{p.user.email}</p>
                    <div className="mt-2 flex items-center gap-4 text-sm">
                      <span className="font-medium">{p.title}</span>
                      <span className="text-[--text-secondary]">{p.specialty}</span>
                      {p.rating && (
                        <span className="text-yellow-500">
                          {'★'.repeat(Math.round(Number(p.rating)))} {p.rating}
                        </span>
                      )}
                      <span className="text-[--text-secondary]">{p.reviewCount} reviews</span>
                    </div>
                    {p.documentUrls.length > 0 && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-[--text-secondary]">
                        <FileText className="h-4 w-4" />
                        {p.documentUrls.length} document(s) attached
                      </div>
                    )}
                    <p className="mt-2 text-xs text-[--text-secondary]">
                      Applied: {formatDate(p.createdAt)}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {p.verificationStatus === 'PENDING' && (
                      <>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleVerification(p.id, 'approve')}
                        >
                          <CheckCircle className="mr-1 h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleVerification(p.id, 'reject')}
                        >
                          <XCircle className="mr-1 h-4 w-4" />
                          Reject
                        </Button>
                      </>
                    )}
                    <Button size="sm" variant="outline">
                      <Eye className="mr-1 h-4 w-4" />
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="flex items-center px-4 text-sm">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
