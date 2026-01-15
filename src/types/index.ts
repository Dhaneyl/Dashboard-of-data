// User types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'manager' | 'viewer';
}

// Order types
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

// Product types
export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  stockStatus: StockStatus;
  imageUrl: string;
  totalSales: number;
  createdAt: string;
}

// Customer types
export interface Customer {
  id: string;
  name: string;
  email: string;
  avatar: string;
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
  lastOrderAt: string | null;
}

// Metrics types
export interface DashboardMetrics {
  totalRevenue: number;
  revenueGrowth: number;
  totalOrders: number;
  ordersGrowth: number;
  totalCustomers: number;
  customersGrowth: number;
  avgOrderValue: number;
  avgOrderValueGrowth: number;
}

export interface RevenueDataPoint {
  month: string;
  revenue: number;
  orders: number;
}

export interface CategorySales {
  category: string;
  sales: number;
  percentage: number;
}

export interface CustomerGrowth {
  month: string;
  newCustomers: number;
  returningCustomers: number;
}

// Context types
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

export interface DataContextType {
  // Data
  orders: Order[];
  products: Product[];
  customers: Customer[];
  metrics: DashboardMetrics | null;
  revenueData: RevenueDataPoint[];
  categorySales: CategorySales[];
  customerGrowth: CustomerGrowth[];

  // State
  loading: boolean;
  error: string | null;

  // Actions
  refreshData: () => Promise<void>;
}

// Table types
export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export interface FilterConfig {
  [key: string]: string | string[] | undefined;
}

// Component prop types
export interface StatCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  trend?: number[];
}

export interface BadgeProps {
  variant: 'success' | 'warning' | 'error' | 'info' | 'default';
  children: React.ReactNode;
}
