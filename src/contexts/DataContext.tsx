import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type {
  DataContextType,
  Order,
  Product,
  Customer,
  DashboardMetrics,
  RevenueDataPoint,
  CategorySales,
  CustomerGrowth,
} from '../types';
import { generateAllData } from '../services/mockData';
import { sleep } from '../utils/helpers';
import { useAuth } from './AuthContext';

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();

  // Data state
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueDataPoint[]>([]);
  const [categorySales, setCategorySales] = useState<CategorySales[]>([]);
  const [customerGrowth, setCustomerGrowth] = useState<CustomerGrowth[]>([]);

  // Loading and error state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch data function
  const refreshData = useCallback(async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    setError(null);

    try {
      // Simulate API delay
      await sleep(800);

      // Generate mock data
      const data = generateAllData();

      setOrders(data.orders);
      setProducts(data.products);
      setCustomers(data.customers);
      setMetrics(data.metrics);
      setRevenueData(data.revenueData);
      setCategorySales(data.categorySales);
      setCustomerGrowth(data.customerGrowth);
    } catch (err) {
      setError('Failed to load data. Please try again.');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
    } else {
      // Clear data on logout
      setOrders([]);
      setProducts([]);
      setCustomers([]);
      setMetrics(null);
      setRevenueData([]);
      setCategorySales([]);
      setCustomerGrowth([]);
    }
  }, [isAuthenticated, refreshData]);

  return (
    <DataContext.Provider
      value={{
        orders,
        products,
        customers,
        metrics,
        revenueData,
        categorySales,
        customerGrowth,
        loading,
        error,
        refreshData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
