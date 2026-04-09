"use client";

import React, { useState } from "react";
import { 
  Wallet, 
  Plus, 
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CreditCard,
  CheckCircle,
  Shield,
  Banknote
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { formatCurrency, formatDate } from "@/lib/utils";

const mockTransactions = [
  {
    id: "1",
    type: "DEPOSIT",
    amount: 50000,
    status: "COMPLETED",
    description: "Added funds via credit card",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "2",
    type: "HOLD",
    amount: -15000,
    status: "PENDING",
    description: "Appointment reservation - Dr. Elena Martínez",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: "3",
    type: "RELEASE",
    amount: -15000,
    status: "COMPLETED",
    description: "Service completed - Dr. Elena Martínez",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: "4",
    type: "DEPOSIT",
    amount: 100000,
    status: "COMPLETED",
    description: "Added funds via credit card",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
];

export default function WalletPage() {
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");

  const balance = 25000;
  const pendingHold = 15000;
  const availableBalance = balance - pendingHold;

  const handleDeposit = () => {
    console.log("Depositing:", depositAmount);
    setShowDepositModal(false);
    setDepositAmount("");
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "DEPOSIT":
        return <ArrowDownLeft className="h-5 w-5 text-emerald-500" />;
      case "HOLD":
        return <Clock className="h-5 w-5 text-amber-500" />;
      case "RELEASE":
      case "REFUND":
        return <ArrowUpRight className="h-5 w-5 text-blue-500" />;
      default:
        return <CreditCard className="h-5 w-5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
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
            <p className="text-3xl font-bold tracking-tight">{formatCurrency(balance)}</p>
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
            <p className="text-2xl font-bold text-emerald-600 tracking-tight">{formatCurrency(availableBalance)}</p>
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
            <p className="text-2xl font-bold text-amber-600 tracking-tight">{formatCurrency(pendingHold)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
          <CardTitle className="text-slate-900 tracking-tight">Transaction History</CardTitle>
          <CardDescription>Your recent wallet activity</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {mockTransactions.length === 0 ? (
            <div className="text-center py-12">
              <Wallet className="h-12 w-12 mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500 font-medium">No transactions yet</p>
              <p className="text-sm text-slate-400 mt-1">Add funds to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {mockTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-slate-50/50 hover:bg-slate-100/80 transition-colors"
                >
                  <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900">
                      {transaction.description}
                    </p>
                    <p className="text-sm text-slate-500 font-medium">
                      {formatDate(transaction.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-lg tracking-tight ${
                      transaction.amount > 0 ? "text-emerald-600" : "text-slate-900"
                    }`}>
                      {transaction.amount > 0 ? "+" : ""}{formatCurrency(Math.abs(transaction.amount))}
                    </p>
                    <Badge
                      variant={
                        transaction.status === "COMPLETED" 
                          ? "success" 
                          : transaction.status === "PENDING" 
                          ? "warning" 
                          : "danger"
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
              { num: "1", title: "Add Funds", desc: "Deposit money to your wallet using credit card or bank transfer", icon: Banknote, color: "text-blue-600", bg: "bg-blue-50" },
              { num: "2", title: "Reserve Appointments", desc: "When you book, funds are held securely until service is delivered", icon: Shield, color: "text-emerald-600", bg: "bg-emerald-50" },
              { num: "3", title: "Secure Release", desc: "After your appointment, the professional receives payment securely", icon: CheckCircle, color: "text-violet-600", bg: "bg-violet-50" },
            ].map((item) => (
              <div key={item.num} className="flex items-start gap-4">
                <div className={`h-10 w-10 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}>
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <div>
                  <p className="font-bold text-slate-900 mb-1">{item.title}</p>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    {item.desc}
                  </p>
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
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl font-medium">$</span>
            <Input
              type="number"
              placeholder="0.00"
              className="pl-10 text-2xl text-center font-bold h-16 bg-slate-50"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {["50", "100", "250", "500"].map((amount) => (
              <Button
                key={amount}
                variant={depositAmount === amount ? "default" : "outline"}
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
                <p className="text-sm text-slate-500">Visa ending in 4242</p>
              </div>
              <Button variant="ghost" size="sm" className="text-blue-600">Change</Button>
            </div>
          </div>
          <Button className="w-full h-12 text-base" onClick={handleDeposit}>
            Add {depositAmount ? formatCurrency(parseFloat(depositAmount) * 100) : "$0.00"}
          </Button>
          <p className="text-xs text-center text-slate-400 font-medium">
            By adding funds, you agree to our Terms of Service
          </p>
        </div>
      </Modal>
    </div>
  );
}
