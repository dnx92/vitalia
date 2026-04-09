export type UserRole = 'PATIENT' | 'PROFESSIONAL' | 'ADMIN';

export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';

export type TransactionType = 'DEPOSIT' | 'HOLD' | 'RELEASE' | 'REFUND' | 'WITHDRAW';

export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  country?: string;
  avatar?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface Professional extends User {
  specialty?: string;
  bio?: string;
  languages: string[];
  credentials: Credential[];
  verificationStatus: VerificationStatus;
  rating?: number;
  reviewCount?: number;
  services?: Service[];
}

export interface Credential {
  id: string;
  userId: string;
  type: 'LICENSE' | 'DEGREE' | 'CERTIFICATE';
  fileUrl: string;
  status: VerificationStatus;
  rejectionReason?: string;
  uploadedAt: Date;
}

export interface Service {
  id: string;
  professionalId: string;
  professional?: Professional;
  title: string;
  description: string;
  price: number;
  currency: string;
  duration: number;
  location?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
}

export interface Transaction {
  id: string;
  walletId: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  reference?: string;
  description?: string;
  createdAt: Date;
}

export interface Appointment {
  id: string;
  userId: string;
  user?: User;
  professionalId: string;
  professional?: Professional;
  serviceId: string;
  service?: Service;
  date: Date;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  totalAmount: number;
  notes?: string;
  rating?: number;
  review?: string;
  createdAt: Date;
}

export interface HealthMetric {
  id: string;
  userId: string;
  professionalId?: string;
  name: string;
  unit: string;
  minValue?: number;
  maxValue?: number;
  isCustom: boolean;
  readings?: MetricReading[];
}

export interface MetricReading {
  id: string;
  metricId: string;
  value: number;
  notes?: string;
  recordedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  data?: Record<string, unknown>;
  createdAt: Date;
}

export interface SearchFilters {
  query?: string;
  specialty?: string;
  country?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  verified?: boolean;
  languages?: string[];
}
