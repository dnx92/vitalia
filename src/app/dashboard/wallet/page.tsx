'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import {
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CreditCard,
  CheckCircle,
  Shield,
  Banknote,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useAuthStore } from '@/store';

interface WalletData {
  balance: number;
  pendingHold: number;
  available: number;
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  description?: string;
  createdAt: string;
}

function WalletContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isFetchingWallet, setIsFetchingWallet] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!user?.id) return;

    const fetchWallet = async () => {
      setIsFetchingWallet(true);
      try {
        const response = await fetch(`/api/wallet?userId=${user.id}`);
        const data = await response.json();

        if (data.success && data.data) {
          setWalletData(data.data.wallet);
          setTransactions(data.data.transactions || []);
        } else if (data.wallet) {
          setWalletData(data.wallet);
          setTransactions(data.transactions || []);
        }
      } catch (error) {
        console.error('Error fetching wallet:', error);
        setWalletData({ balance: 0, pendingHold: 0, available: 0 });
      } finally {
        setIsFetchingWallet(false);
      }
    };

    fetchWallet();
  }, [user?.id]);

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }
  }, [searchParams]);

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) < 1) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          amount: parseFloat(depositAmount),
          returnUrl: window.location.origin,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Deposit error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'DEPOSIT':
        return <ArrowDownLeft className="h-5 w-5 text-emerald-500" />;
      case 'ESCROW_HOLD':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'ESCROW_RELEASE':
      case 'REFUND':
        return <ArrowUpRight className="h-5 w-5 text-blue-500" />;
      case 'PAYMENT':
        return <ArrowUpRight className="h-5 w-5 text-red-500" />;
      default:
        return <CreditCard className="h-5 w-5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {showSuccess && (
        <div className="fixed top-20 right-4 z-50 animate-fade-in-up">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 shadow-xl">
            <CheckCircle className="h-6 w-6 text-emerald-600" />
            <div>
              <p className="font-semibold text-emerald-900">Deposit Successful!</p>
              <p className="text-sm text-emerald-700">Your funds have been added to your wallet.</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Wallet</h1>
          <p className="text-slate-500 font-medium mt-1">Manage your funds and transactions</p>
        </div>
        <Button onClick={() => setShowDepositModal(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Funds
        </Button>
      </div>

      {/* Balance Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <span className="text-blue-100 text-sm font-medium">Total Balance</span>
              <Wallet className="h-5 w-5 text-blue-200" />
            </div>
            {isFetchingWallet ? (
              <div className="h-8 w-32 bg-white/20 rounded animate-pulse" />
            ) : (
              <p className="text-3xl font-bold tracking-tight">
                {formatCurrency(walletData?.balance || 0)}
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="hover:-translate-y-1 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-500 text-sm font-medium">Available</span>
              <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
            {isFetchingWallet ? (
              <div className="h-7 w-24 bg-slate-200 rounded animate-pulse" />
            ) : (
              <p className="text-2xl font-bold text-emerald-600 tracking-tight">
                {formatCurrency(walletData?.available || 0)}
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="hover:-translate-y-1 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-500 text-sm font-medium">Pending Hold</span>
              <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-500" />
              </div>
            </div>
            {isFetchingWallet ? (
              <div className="h-7 w-24 bg-slate-200 rounded animate-pulse" />
            ) : (
              <p className="text-2xl font-bold text-amber-600 tracking-tight">
                {formatCurrency(walletData?.pendingHold || 0)}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
          <CardTitle className="text-slate-900 tracking-tight">Transaction History</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {isFetchingWallet ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-slate-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12">
              <Wallet className="h-12 w-12 mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500 font-medium">No transactions yet</p>
              <p className="text-sm text-slate-400 mt-1">Add funds to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-slate-50/50 hover:bg-slate-100/80 transition-colors"
                >
                  <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900">
                      {transaction.description || transaction.type.replace('_', ' ')}
                    </p>
                    <p className="text-sm text-slate-500 font-medium">
                      {formatDate(new Date(transaction.createdAt))}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold text-lg tracking-tight ${
                        transaction.amount > 0 ? 'text-emerald-600' : 'text-slate-900'
                      }`}
                    >
                      {transaction.amount > 0 ? '+' : ''}
                      {formatCurrency(Math.abs(transaction.amount))}
                    </p>
                    <Badge
                      variant={
                        transaction.status === 'COMPLETED'
                          ? 'success'
                          : transaction.status === 'PENDING'
                            ? 'warning'
                            : 'danger'
                      }
                      className="mt-1"
                    >
                      {transaction.status.toLowerCase()}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card>
        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
          <CardTitle className="text-slate-900 tracking-tight">How Wallet Works</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                num: '1',
                title: 'Add Funds',
                desc: 'Deposit money to your wallet using credit card or bank transfer',
                icon: Banknote,
                color: 'text-blue-600',
                bg: 'bg-blue-50',
              },
              {
                num: '2',
                title: 'Reserve Appointments',
                desc: 'When you book, funds are held securely until service is delivered',
                icon: Shield,
                color: 'text-emerald-600',
                bg: 'bg-emerald-50',
              },
              {
                num: '3',
                title: 'Secure Release',
                desc: 'After your appointment, the professional receives payment securely',
                icon: CheckCircle,
                color: 'text-violet-600',
                bg: 'bg-violet-50',
              },
            ].map((item) => (
              <div key={item.num} className="flex items-start gap-4">
                <div
                  className={`h-10 w-10 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}
                >
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <div>
                  <p className="font-bold text-slate-900 mb-1">{item.title}</p>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Deposit Modal */}
      <Modal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        title="Add Funds"
        description="Enter the amount you want to add to your wallet"
        size="sm"
      >
        <div className="space-y-5">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl font-medium">
              $
            </span>
            <Input
              type="number"
              placeholder="0.00"
              min="1"
              className="pl-10 text-2xl text-center font-bold h-16 bg-slate-50"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {['25', '50', '100', '250'].map((amount) => (
              <Button
                key={amount}
                variant={depositAmount === amount ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
                onClick={() => setDepositAmount(amount)}
              >
                ${amount}
              </Button>
            ))}
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-900">Credit Card</p>
                <p className="text-sm text-slate-500">Powered by Stripe</p>
              </div>
            </div>
          </div>
          <Button
            className="w-full h-12 text-base"
            onClick={handleDeposit}
            disabled={isLoading || !depositAmount || parseFloat(depositAmount) < 1}
            isLoading={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>Pay {depositAmount ? formatCurrency(parseFloat(depositAmount) * 100) : '$0.00'}</>
            )}
          </Button>
          <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
            <Shield className="w-4 h-4 text-emerald-500" />
            <span>Secured by Stripe</span>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function WalletPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div className="h-10 w-48 bg-slate-200 animate-pulse rounded-lg" />
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-slate-200 animate-pulse rounded-2xl" />
            ))}
          </div>
        </div>
      }
    >
      <WalletContent />
    </Suspense>
  );
}
