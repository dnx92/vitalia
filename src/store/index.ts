import { create } from 'zustand';
import type { User, Notification } from '@/types';

type UserRole = 'PATIENT' | 'PROFESSIONAL' | 'ADMIN';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  login: (user: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    role?: UserRole;
    isAdmin?: boolean;
  }) => void;
  updateProfile: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: () => set({ user: null, isAuthenticated: false }),
  login: (user) =>
    set({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role || 'PATIENT',
        isAdmin: user.isAdmin || false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      isAuthenticated: true,
    }),
  updateProfile: (data) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...data } : null,
    })),
}));

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  fetchNotifications: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  setNotifications: (notifications) =>
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.isRead).length,
    }),
  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + (notification.isRead ? 0 : 1),
    })),
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    })),
  clearNotifications: () => set({ notifications: [], unreadCount: 0 }),
  fetchNotifications: async () => {
    const { user } = useAuthStore.getState();
    if (!user?.id) return;

    set({ isLoading: true });
    try {
      const res = await fetch(`/api/notifications?userId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        get().setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));

interface UIState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebarCollapse: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  toggleSidebarCollapse: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
}));

interface WalletState {
  balance: number;
  available: number;
  pendingHold: number;
  isLoading: boolean;
  transactions: Transaction[];
  setWallet: (data: { balance: number; available: number; pendingHold: number }) => void;
  addTransaction: (transaction: Transaction) => void;
  fetchWallet: (userId: string) => Promise<void>;
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  description?: string;
  createdAt: string;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  balance: 0,
  available: 0,
  pendingHold: 0,
  isLoading: false,
  transactions: [],
  setWallet: (data) => set({ ...data }),
  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [transaction, ...state.transactions],
    })),
  fetchWallet: async (userId) => {
    set({ isLoading: true });
    try {
      const res = await fetch(`/api/wallet?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        set({
          balance: data.wallet?.balance || 0,
          available: data.wallet?.available || 0,
          pendingHold: data.wallet?.pendingHold || 0,
          transactions: data.transactions || [],
        });
      }
    } catch (error) {
      console.error('Failed to fetch wallet:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

interface ToastState {
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(7);
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));

    const duration = toast.duration || 5000;
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
  clearToasts: () => set({ toasts: [] }),
}));

interface SearchState {
  query: string;
  specialty: string;
  location: string;
  minRating: number;
  maxPrice: number;
  results: DoctorResult[];
  isLoading: boolean;
  totalResults: number;
  setSearchParams: (params: Partial<SearchState>) => void;
  clearSearch: () => void;
  search: () => Promise<void>;
}

interface DoctorResult {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  price: number;
  image?: string;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  query: '',
  specialty: '',
  location: '',
  minRating: 0,
  maxPrice: 0,
  results: [],
  isLoading: false,
  totalResults: 0,
  setSearchParams: (params) => set((state) => ({ ...state, ...params })),
  clearSearch: () =>
    set({
      query: '',
      specialty: '',
      location: '',
      minRating: 0,
      maxPrice: 0,
      results: [],
      totalResults: 0,
    }),
  search: async () => {
    const { query, specialty, location, minRating, maxPrice } = get();

    set({ isLoading: true });
    try {
      const params = new URLSearchParams();
      if (query) params.set('search', query);
      if (specialty) params.set('specialty', specialty);
      if (location) params.set('location', location);
      if (minRating) params.set('minRating', minRating.toString());
      if (maxPrice) params.set('maxPrice', maxPrice.toString());

      const res = await fetch(`/api/doctors?${params}`);
      if (res.ok) {
        const data = await res.json();
        set({
          results: data.data || [],
          totalResults: data.meta?.total || 0,
        });
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
