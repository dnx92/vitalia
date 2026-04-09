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
  AlertCircle
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
        return <ArrowDownLeft className="h-5 w-5 text-[--success]" />;
      case "HOLD":
        return <Clock className="h-5 w-5 text-[--warning]" />;
      case "RELEASE":
      case "REFUND":
        return <ArrowUpRight className="h-5 w-5 text-[--primary]" />;
      default:
        return <CreditCard className="h-5 w-5 text-[--text-muted]" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[--text-primary]">Wallet</h1>
          <p className="text-[--text-secondary]">Manage your funds and transactions</p>
        </div>
        <Button onClick={() => setShowDepositModal(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Funds
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-[--primary] to-[--primary-dark] text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white/80 text-sm">Total Balance</span>
              <Wallet className="h-5 w-5 text-white/80" />
            </div>
            <p className="text-3xl font-bold">{formatCurrency(balance)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[--text-secondary] text-sm">Available</span>
              <div className="h-8 w-8 rounded-[--radius-md] bg-[--success]/10 flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-[--success]" />
              </div>
            </div>
            <p className="text-2xl font-bold text-[--success]">{formatCurrency(availableBalance)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[--text-secondary] text-sm">Pending Hold</span>
              <div className="h-8 w-8 rounded-[--radius-md] bg-[--warning]/10 flex items-center justify-center">
                <Clock className="h-4 w-4 text-[--warning]" />
              </div>
            </div>
            <p className="text-2xl font-bold text-[--warning]">{formatCurrency(pendingHold)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Your recent wallet activity</CardDescription>
        </CardHeader>
        <CardContent>
          {mockTransactions.length === 0 ? (
            <div className="text-center py-12">
              <Wallet className="h-12 w-12 mx-auto text-[--text-muted] mb-4" />
              <p className="text-[--text-secondary]">No transactions yet</p>
              <p className="text-sm text-[--text-muted]">Add funds to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {mockTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center gap-4 p-4 rounded-[--radius-md] bg-[--background]"
                >
                  <div className="h-10 w-10 rounded-full bg-[--surface] flex items-center justify-center">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[--text-primary]">
                      {transaction.description}
                    </p>
                    <p className="text-sm text-[--text-muted]">
                      {formatDate(transaction.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.amount > 0 ? "text-[--success]" : "text-[--text-primary]"
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

      <Card>
        <CardHeader>
          <CardTitle>How Wallet Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-[--primary]/10 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-[--primary]">1</span>
              </div>
              <div>
                <p className="font-medium text-[--text-primary]">Add Funds</p>
                <p className="text-sm text-[--text-secondary]">
                  Deposit money to your wallet using credit card or bank transfer
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-[--primary]/10 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-[--primary]">2</span>
              </div>
              <div>
                <p className="font-medium text-[--text-primary]">Reserve Appointments</p>
                <p className="text-sm text-[--text-secondary]">
                  When you book, funds are held securely until service is delivered
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-[--primary]/10 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-[--primary]">3</span>
              </div>
              <div>
                <p className="font-medium text-[--text-primary]">Secure Release</p>
                <p className="text-sm text-[--text-secondary]">
                  After your appointment, the professional receives payment securely
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Modal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        title="Add Funds"
        description="Enter the amount you want to add to your wallet"
        size="sm"
      >
        <div className="space-y-4">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[--text-muted]">$</span>
            <Input
              type="number"
              placeholder="0.00"
              className="pl-8 text-2xl text-center font-bold"
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
                onClick={() => setDepositAmount(amount)}
              >
                ${amount}
              </Button>
            ))}
          </div>
          <div className="p-4 rounded-[--radius-md] bg-[--background]">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-[--text-muted]" />
              <div className="flex-1">
                <p className="font-medium text-[--text-primary]">Credit Card</p>
                <p className="text-sm text-[--text-muted]">Visa ending in 4242</p>
              </div>
              <Button variant="ghost" size="sm">Change</Button>
            </div>
          </div>
          <Button className="w-full" onClick={handleDeposit} isLoading={false}>
            Add {depositAmount ? formatCurrency(parseFloat(depositAmount) * 100) : "$0.00"}
          </Button>
          <p className="text-xs text-center text-[--text-muted]">
            By adding funds, you agree to our Terms of Service
          </p>
        </div>
      </Modal>
    </div>
  );
}
