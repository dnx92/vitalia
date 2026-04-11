"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Download,
  CreditCard,
  Clock
} from "lucide-react";

const mockTransactions = [
  { id: "1", type: "earning", amount: 15000, description: "Cardiology Consultation - John Smith", date: "2026-04-08", status: "completed" },
  { id: "2", type: "earning", amount: 8500, description: "Follow-up Visit - Sarah Johnson", date: "2026-04-07", status: "completed" },
  { id: "3", type: "payout", amount: -25000, description: "Payout to bank account", date: "2026-04-05", status: "completed" },
  { id: "4", type: "earning", amount: 20000, description: "ECG Test - Michael Brown", date: "2026-04-05", status: "completed" },
  { id: "5", type: "earning", amount: 15000, description: "Cardiology Consultation - Emily Davis", date: "2026-04-03", status: "completed" },
  { id: "6", type: "refund", amount: -8500, description: "Refund - Cancelled appointment", date: "2026-04-01", status: "completed" },
];

const weeklyData = [
  { day: "Mon", amount: 15000 },
  { day: "Tue", amount: 8500 },
  { day: "Wed", amount: 20000 },
  { day: "Thu", amount: 0 },
  { day: "Fri", amount: 15000 },
  { day: "Sat", amount: 12000 },
  { day: "Sun", amount: 0 },
];

export default function EarningsPage() {
  const [period, setPeriod] = useState<"week" | "month" | "year">("month");
  
  const totalEarnings = mockTransactions
    .filter(t => t.type === "earning" && t.status === "completed")
    .reduce((acc, t) => acc + t.amount, 0);
  
  const pendingPayout = 42500;
  const totalPayouts = Math.abs(mockTransactions.filter(t => t.type === "payout").reduce((acc, t) => acc + t.amount, 0));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Earnings</h1>
          <p className="text-slate-500 font-medium mt-1">Track your income and payouts</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <Wallet className="w-4 h-4 mr-2" />
            Withdraw
          </Button>
        </div>
      </div>

      {/* Period Selector */}
      <div className="flex gap-2">
        {(["week", "month", "year"] as const).map((p) => (
          <Button
            key={p}
            variant={period === p ? "default" : "outline"}
            size="sm"
            onClick={() => setPeriod(p)}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </Button>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium">Total Earnings</p>
                <p className="text-3xl font-bold mt-1">{formatCurrency(totalEarnings)}</p>
                <div className="flex items-center gap-1 mt-2 text-emerald-100 text-sm">
                  <TrendingUp className="w-4 h-4" />
                  +12% from last month
                </div>
              </div>
              <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">Pending Payout</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(pendingPayout)}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-amber-50 flex items-center justify-center">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            <Button size="sm" className="w-full mt-4" variant="outline">
              Request Payout
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">Total Paid Out</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(totalPayouts)}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">This Month</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(totalEarnings)}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-purple-50 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="text-slate-900">Weekly Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-end justify-between gap-2">
            {weeklyData.map((day, i) => (
              <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all hover:from-blue-700 hover:to-blue-500"
                  style={{ height: `${Math.max(day.amount / 1000, 10)}%` }}
                />
                <span className="text-xs text-slate-500 font-medium">{day.day}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
          <CardTitle className="text-slate-900">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {mockTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  transaction.type === "earning" ? "bg-emerald-100" :
                  transaction.type === "payout" ? "bg-blue-100" : "bg-red-100"
                }`}>
                  {transaction.type === "earning" ? (
                    <ArrowDownRight className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <ArrowUpRight className="h-5 w-5 text-blue-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 truncate">{transaction.description}</p>
                  <p className="text-sm text-slate-500">{formatDate(transaction.date)}</p>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${transaction.amount > 0 ? "text-emerald-600" : "text-slate-900"}`}>
                    {transaction.amount > 0 ? "+" : ""}{formatCurrency(Math.abs(transaction.amount))}
                  </p>
                  <Badge variant={transaction.status === "completed" ? "success" : "warning"} className="text-xs">
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
