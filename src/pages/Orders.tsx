import { useState, useMemo } from 'react';
import { Header } from '../components/layout';
import { Badge, Spinner, ErrorState, EmptyState } from '../components/common';
import { SearchBar, Pagination, FilterDropdown } from '../components/tables';
import { useData } from '../contexts/DataContext';
import { usePagination, useDebounce } from '../hooks';
import { formatCurrency, formatDate } from '../utils/formatters';
import { getStatusColor } from '../utils/helpers';

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

export const Orders = () => {
  const { orders, loading, error, refreshData } = useData();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const debouncedSearch = useDebounce(search);

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch =
        !debouncedSearch ||
        order.id.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        order.customerName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(debouncedSearch.toLowerCase());

      const matchesStatus = !statusFilter || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, debouncedSearch, statusFilter]);

  const {
    currentPage,
    totalPages,
    paginatedData,
    goToPage,
    startIndex,
    endIndex,
    totalItems,
  } = usePagination({ data: filteredOrders, itemsPerPage: 10 });

  if (loading) {
    return (
      <div>
        <Header title="Orders" />
        <div className="p-6 flex items-center justify-center min-h-[60vh]">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header title="Orders" />
        <div className="p-6">
          <ErrorState message={error} onRetry={refreshData} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title="Orders" />
      <div className="p-6">
        <div className="card">
          {/* Filters */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-4">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search orders..."
            />
            <FilterDropdown
              label="All Status"
              value={statusFilter}
              options={statusOptions}
              onChange={setStatusFilter}
            />
          </div>

          {/* Table */}
          {filteredOrders.length === 0 ? (
            <EmptyState
              title="No orders found"
              description="Try adjusting your search or filter criteria"
            />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Items
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {paginatedData.map(order => (
                      <tr
                        key={order.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          {order.id}
                        </td>
                        <td className="px-4 py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {order.customerName}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {order.customerEmail}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          {formatCurrency(order.total)}
                        </td>
                        <td className="px-4 py-4">
                          <Badge variant={getStatusColor(order.status) as 'success' | 'warning' | 'error' | 'info' | 'default'}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(order.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={goToPage}
                startIndex={startIndex}
                endIndex={endIndex}
                totalItems={totalItems}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
