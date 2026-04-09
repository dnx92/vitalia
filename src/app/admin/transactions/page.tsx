"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  RefreshCw,
  Lock,
  Filter
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useAuthStore } from "@/store";
import { useRouter } from "next/navigation";

interface Transaction {
  id: string;
  type: string;
  amount: string;
  status: string;
  description: string | null;
  createdAt: string;
  wallet: {
    user: { name: string | null; email: string };
  };
}

const typeIcons: Record<string, React.ReactNode> = {
  DEPOSIT: <ArrowDownLeft className="h-4 w-4 text-green-500" />,
  WITHDRAWAL: <ArrowUpRight className="h-4 w-4 text-red-500" />,
  PAYMENT: <Wallet className="h-4 w-4 text-blue-500" />,
  REFUND: <RefreshCw className="h-4 w-4 text-yellow-500" />,
  ESCROW_HOLD: <Lock className="h-4 w-4 text-purple-500" />,
  ESCROW_RELEASE: <Lock className="h-4 w-4 text-emerald-500" />,
};

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user: currentUser, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    } else if (currentUser && !currentUser.isAdmin) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, currentUser, router]);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: "50" });
      if (type !== "ALL") params.set("type", type);
      if (status !== "ALL") params.set("status", status);
      const res = await fetch(`/api/admin/transactions?${params}`);
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.transactions);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setLoading(false);
    }
  }, [type, status, page]);

  useEffect(() => {
    if (isAuthenticated && currentUser?.isAdmin) {
      fetchTransactions();
    }
  }, [isAuthenticated, currentUser, fetchTransactions]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <Badge variant="default">Completed</Badge>;
      case "PENDING":
        return <Badge variant="secondary">Pending</Badge>;
      case "FAILED":
        return <Badge variant="danger">Failed</Badge>;
      case "CANCELLED":
        return <Badge variant="outline">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-[--text-secondary]" />
          <span className="text-sm text-[--text-secondary]">Filter by type and status</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <Tabs value={type} onValueChange={(v) => { setType(v); setPage(1); }}>
          <TabsList>
            <TabsTrigger value="ALL">All Types</TabsTrigger>
            <TabsTrigger value="DEPOSIT">Deposits</TabsTrigger>
            <TabsTrigger value="WITHDRAWAL">Withdrawals</TabsTrigger>
            <TabsTrigger value="PAYMENT">Payments</TabsTrigger>
            <TabsTrigger value="ESCROW_HOLD">Escrow</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Tabs value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
          <TabsList>
            <TabsTrigger value="ALL">All Status</TabsTrigger>
            <TabsTrigger value="COMPLETED">Completed</TabsTrigger>
            <TabsTrigger value="PENDING">Pending</TabsTrigger>
            <TabsTrigger value="FAILED">Failed</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[--border] text-left text-sm">
                  <th className="p-4 font-medium">Transaction</th>
                  <th className="p-4 font-medium">User</th>
                  <th className="p-4 font-medium">Type</th>
                  <th className="p-4 font-medium">Amount</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="border-b border-[--border]">
                      <td className="p-4"><Skeleton className="h-4 w-32" /></td>
                      <td className="p-4"><Skeleton className="h-4 w-24" /></td>
                      <td className="p-4"><Skeleton className="h-6 w-20" /></td>
                      <td className="p-4"><Skeleton className="h-4 w-20" /></td>
                      <td className="p-4"><Skeleton className="h-6 w-20" /></td>
                      <td className="p-4"><Skeleton className="h-4 w-24" /></td>
                    </tr>
                  ))
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-[--text-secondary]">
                      No transactions found
                    </td>
                  </tr>
                ) : (
                  transactions.map((t) => (
                    <tr key={t.id} className="border-b border-[--border] last:border-0 hover:bg-[--background]">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {typeIcons[t.type] || <Wallet className="h-4 w-4" />}
                          <span className="text-sm font-mono">
                            {t.id.slice(0, 8)}...
                          </span>
                        </div>
                        {t.description && (
                          <p className="text-xs text-[--text-secondary] mt-1">
                            {t.description}
                          </p>
                        )}
                      </td>
                      <td className="p-4">
                        <p className="text-sm font-medium">
                          {t.wallet.user.name || "Anonymous"}
                        </p>
                        <p className="text-xs text-[--text-secondary]">
                          {t.wallet.user.email}
                        </p>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline" className="capitalize">
                          {t.type.replace("_", " ").toLowerCase()}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <span className={`font-medium ${
                          t.type.includes("WITHDRAWAL") || t.type === "ESCROW_HOLD"
                            ? "text-red-500"
                            : "text-green-500"
                        }`}>
                          {t.type.includes("WITHDRAWAL") || t.type === "ESCROW_HOLD" ? "-" : "+"}
                          {formatCurrency(Number(t.amount))}
                        </span>
                      </td>
                      <td className="p-4">{getStatusBadge(t.status)}</td>
                      <td className="p-4 text-sm text-[--text-secondary]">
                        {formatDate(t.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

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
