import { useState, useMemo } from 'react';
import { Header } from '../components/layout';
import { Spinner, ErrorState, EmptyState } from '../components/common';
import { SearchBar, Pagination } from '../components/tables';
import { useData } from '../contexts/DataContext';
import { usePagination, useDebounce } from '../hooks';
import { formatCurrency, formatDate, formatNumber } from '../utils/formatters';
import { getInitials } from '../utils/helpers';

export const Customers = () => {
  const { customers, loading, error, refreshData } = useData();
  const [search, setSearch] = useState('');

  const debouncedSearch = useDebounce(search);

  const filteredCustomers = useMemo(() => {
    if (!debouncedSearch) return customers;

    return customers.filter(
      customer =>
        customer.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        customer.email.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [customers, debouncedSearch]);

  // Sort by total spent (highest first)
  const sortedCustomers = useMemo(() => {
    return [...filteredCustomers].sort((a, b) => b.totalSpent - a.totalSpent);
  }, [filteredCustomers]);

  const {
    currentPage,
    totalPages,
    paginatedData,
    goToPage,
    startIndex,
    endIndex,
    totalItems,
  } = usePagination({ data: sortedCustomers, itemsPerPage: 10 });

  if (loading) {
    return (
      <div>
        <Header title="Customers" />
        <div className="p-6 flex items-center justify-center min-h-[60vh]">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header title="Customers" />
        <div className="p-6">
          <ErrorState message={error} onRetry={refreshData} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title="Customers" />
      <div className="p-6">
        <div className="card">
          {/* Filters */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search customers..."
            />
          </div>

          {/* Table */}
          {filteredCustomers.length === 0 ? (
            <EmptyState
              title="No customers found"
              description="Try adjusting your search criteria"
            />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Orders
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Total Spent
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Last Order
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {paginatedData.map(customer => (
                      <tr
                        key={customer.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                              <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                                {getInitials(customer.name)}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {customer.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {customer.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {formatNumber(customer.totalOrders)}
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          {formatCurrency(customer.totalSpent)}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(customer.createdAt)}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {customer.lastOrderAt
                            ? formatDate(customer.lastOrderAt)
                            : 'Never'}
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
