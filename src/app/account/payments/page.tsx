'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { CreditCard, Plus, Trash2, CheckCircle, Star, Building, Loader2 } from 'lucide-react';

export default function PaymentsPage() {
  const [showAddCard, setShowAddCard] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cards, setCards] = useState([
    {
      id: 1,
      type: 'visa',
      last4: '4242',
      expMonth: 12,
      expYear: 2027,
      isDefault: true,
      name: 'John Smith',
    },
    {
      id: 2,
      type: 'mastercard',
      last4: '5555',
      expMonth: 6,
      expYear: 2026,
      isDefault: false,
      name: 'John Smith',
    },
  ]);

  const [newCard, setNewCard] = useState({
    number: '',
    name: '',
    expMonth: '',
    expYear: '',
    cvc: '',
  });

  const handleAddCard = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const newCardObj = {
      id: Date.now(),
      type: newCard.number.startsWith('5') ? 'mastercard' : 'visa',
      last4: newCard.number.slice(-4),
      expMonth: parseInt(newCard.expMonth),
      expYear: parseInt(newCard.expYear),
      isDefault: cards.length === 0,
      name: newCard.name,
    };

    setCards([...cards, newCardObj]);
    setNewCard({ number: '', name: '', expMonth: '', expYear: '', cvc: '' });
    setShowAddCard(false);
    setIsLoading(false);
  };

  const handleRemoveCard = (id: number) => {
    setCards(cards.filter((card) => card.id !== id));
  };

  const handleSetDefault = (id: number) => {
    setCards(
      cards.map((card) => ({
        ...card,
        isDefault: card.id === id,
      }))
    );
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const billingHistory = [
    {
      id: 1,
      date: 'Mar 15, 2024',
      amount: 150.0,
      description: 'Cardiology Consultation',
      status: 'Completed',
    },
    {
      id: 2,
      date: 'Feb 28, 2024',
      amount: 75.0,
      description: 'Follow-up Visit',
      status: 'Completed',
    },
    {
      id: 3,
      date: 'Feb 10, 2024',
      amount: 200.0,
      description: 'Wallet Top-up',
      status: 'Completed',
    },
    {
      id: 4,
      date: 'Jan 20, 2024',
      amount: 120.0,
      description: 'Dermatology Consultation',
      status: 'Completed',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Methods</h1>
          <p className="text-gray-500 mt-1">Manage your payment methods and billing</p>
        </div>
        <Button onClick={() => setShowAddCard(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Card
        </Button>
      </div>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Saved Cards
          </CardTitle>
          <CardDescription>Your default payment method for bookings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {cards.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No payment methods saved</p>
              <Button variant="outline" className="mt-4" onClick={() => setShowAddCard(true)}>
                Add Your First Card
              </Button>
            </div>
          ) : (
            cards.map((card) => (
              <div
                key={card.id}
                className={`flex items-center justify-between p-4 rounded-xl border-2 transition-colors ${
                  card.isDefault ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center">
                    {card.type === 'visa' ? (
                      <span className="text-white font-bold text-sm">VISA</span>
                    ) : (
                      <span className="text-white font-bold text-sm">MC</span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">•••• •••• •••• {card.last4}</p>
                      {card.isDefault && (
                        <Badge variant="default" className="text-xs">
                          Default
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      Expires {card.expMonth}/{card.expYear} • {card.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!card.isDefault && (
                    <Button variant="ghost" size="sm" onClick={() => handleSetDefault(card.id)}>
                      Set Default
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleRemoveCard(card.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>Your recent transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Description
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">
                    Invoice
                  </th>
                </tr>
              </thead>
              <tbody>
                {billingHistory.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">{item.date}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{item.description}</td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">
                      ${item.amount.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="success">{item.status}</Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button variant="ghost" size="sm">
                        Download
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Card Modal */}
      <Modal
        isOpen={showAddCard}
        onClose={() => setShowAddCard(false)}
        title="Add New Card"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
            <Input
              placeholder="1234 5678 9012 3456"
              value={newCard.number}
              onChange={(e) => setNewCard({ ...newCard, number: formatCardNumber(e.target.value) })}
              maxLength={19}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
            <Input
              placeholder="John Smith"
              value={newCard.name}
              onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
              <Input
                placeholder="MM"
                value={newCard.expMonth}
                onChange={(e) => setNewCard({ ...newCard, expMonth: e.target.value })}
                maxLength={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <Input
                placeholder="YYYY"
                value={newCard.expYear}
                onChange={(e) => setNewCard({ ...newCard, expYear: e.target.value })}
                maxLength={4}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
              <Input
                placeholder="123"
                value={newCard.cvc}
                onChange={(e) => setNewCard({ ...newCard, cvc: e.target.value })}
                maxLength={4}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
            <p className="text-sm text-gray-600">Your card information is encrypted and secure</p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowAddCard(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCard} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Card
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
