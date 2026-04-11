import { z } from 'zod';

export const walletDepositSchema = z.object({
  amount: z.number().min(10, 'Minimum deposit is $10').max(10000, 'Maximum deposit is $10,000'),
  paymentMethodId: z.string().min(1, 'Payment method is required'),
});

export const walletWithdrawSchema = z.object({
  amount: z.number().min(10, 'Minimum withdrawal is $10'),
  bankAccountId: z.string().min(1, 'Bank account is required'),
});

export const walletTransferSchema = z.object({
  toUserId: z.string().min(1, 'Recipient is required'),
  amount: z.number().min(1, 'Amount must be at least $1'),
  description: z.string().max(200).optional(),
});

export const transactionFilterSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  type: z
    .enum(['DEPOSIT', 'WITHDRAWAL', 'PAYMENT', 'REFUND', 'ESCROW_HOLD', 'ESCROW_RELEASE'])
    .optional(),
  status: z.enum(['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type WalletDepositInput = z.infer<typeof walletDepositSchema>;
export type WalletWithdrawInput = z.infer<typeof walletWithdrawSchema>;
export type WalletTransferInput = z.infer<typeof walletTransferSchema>;
export type TransactionFilterInput = z.infer<typeof transactionFilterSchema>;
