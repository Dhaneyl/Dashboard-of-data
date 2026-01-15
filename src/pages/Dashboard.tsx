import { DollarSign, ShoppingCart, Users, TrendingUp } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { Header } from '../components/layout';
import { StatCard } from '../components/dashboard';
import { Spinner, ErrorState } from '../components/common';
import { useData } from '../contexts/DataContext';
import { formatCurrency, formatNumber } from '../utils/formatters';

export const Dashboard = () => {
  const { metrics, revenueData, loading, error, refreshData } = useData();

  if (loading) {
    return (
      <div>
        <Header title="Dashboard" />
        <div className="p-6 flex items-center justify-center min-h-[60vh]">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header title="Dashboard" />
        <div className="p-6">
          <ErrorState message={error} onRetry={refreshData} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title="Dashboard" />
      <div className="p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Revenue"
            value={formatCurrency(metrics?.totalRevenue || 0)}
            change={metrics?.revenueGrowth || 0}
            icon={<DollarSign className="w-6 h-6 text-primary-600 dark:text-primary-400" />}
          />
          <StatCard
            title="Total Orders"
            value={formatNumber(metrics?.totalOrders || 0)}
            change={metrics?.ordersGrowth || 0}
            icon={<ShoppingCart className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
            iconBg="bg-blue-100 dark:bg-blue-900/30"
          />
          <StatCard
            title="Total Customers"
            value={formatNumber(metrics?.totalCustomers || 0)}
            change={metrics?.customersGrowth || 0}
            icon={<Users className="w-6 h-6 text-green-600 dark:text-green-400" />}
            iconBg="bg-green-100 dark:bg-green-900/30"
          />
          <StatCard
            title="Avg. Order Value"
            value={formatCurrency(metrics?.avgOrderValue || 0)}
            change={metrics?.avgOrderValueGrowth || 0}
            icon={<TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />}
            iconBg="bg-orange-100 dark:bg-orange-900/30"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Revenue Overview
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    axisLine={{ stroke: '#E5E7EB' }}
                  />
                  <YAxis
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    axisLine={{ stroke: '#E5E7EB' }}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#F9FAFB',
                    }}
                    formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#6366F1"
                    strokeWidth={2}
                    dot={{ fill: '#6366F1', strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Orders Chart */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Orders by Month
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    axisLine={{ stroke: '#E5E7EB' }}
                  />
                  <YAxis
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    axisLine={{ stroke: '#E5E7EB' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#F9FAFB',
                    }}
                    formatter={(value) => [value, 'Orders']}
                  />
                  <Bar
                    dataKey="orders"
                    fill="#818CF8"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
