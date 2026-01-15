import { useState, useMemo } from 'react';
import { Header } from '../components/layout';
import { Badge, Spinner, ErrorState, EmptyState } from '../components/common';
import { SearchBar, Pagination, FilterDropdown } from '../components/tables';
import { useData } from '../contexts/DataContext';
import { usePagination, useDebounce } from '../hooks';
import { formatCurrency, formatNumber } from '../utils/formatters';
import { getStatusColor } from '../utils/helpers';

const categoryOptions = [
  { value: 'Electronics', label: 'Electronics' },
  { value: 'Clothing', label: 'Clothing' },
  { value: 'Home & Garden', label: 'Home & Garden' },
  { value: 'Sports', label: 'Sports' },
  { value: 'Books', label: 'Books' },
  { value: 'Beauty', label: 'Beauty' },
];

const stockOptions = [
  { value: 'in_stock', label: 'In Stock' },
  { value: 'low_stock', label: 'Low Stock' },
  { value: 'out_of_stock', label: 'Out of Stock' },
];

export const Products = () => {
  const { products, loading, error, refreshData } = useData();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');

  const debouncedSearch = useDebounce(search);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch =
        !debouncedSearch ||
        product.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        product.category.toLowerCase().includes(debouncedSearch.toLowerCase());

      const matchesCategory = !categoryFilter || product.category === categoryFilter;
      const matchesStock = !stockFilter || product.stockStatus === stockFilter;

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, debouncedSearch, categoryFilter, stockFilter]);

  const {
    currentPage,
    totalPages,
    paginatedData,
    goToPage,
    startIndex,
    endIndex,
    totalItems,
  } = usePagination({ data: filteredProducts, itemsPerPage: 10 });

  if (loading) {
    return (
      <div>
        <Header title="Products" />
        <div className="p-6 flex items-center justify-center min-h-[60vh]">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header title="Products" />
        <div className="p-6">
          <ErrorState message={error} onRetry={refreshData} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title="Products" />
      <div className="p-6">
        <div className="card">
          {/* Filters */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-4">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search products..."
            />
            <FilterDropdown
              label="All Categories"
              value={categoryFilter}
              options={categoryOptions}
              onChange={setCategoryFilter}
            />
            <FilterDropdown
              label="All Stock"
              value={stockFilter}
              options={stockOptions}
              onChange={setStockFilter}
            />
          </div>

          {/* Table */}
          {filteredProducts.length === 0 ? (
            <EmptyState
              title="No products found"
              description="Try adjusting your search or filter criteria"
            />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Sales
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {paginatedData.map(product => (
                      <tr
                        key={product.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex-shrink-0 overflow-hidden">
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {product.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {product.category}
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-white">
                          {formatCurrency(product.price)}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {formatNumber(product.stock)}
                        </td>
                        <td className="px-4 py-4">
                          <Badge variant={getStatusColor(product.stockStatus) as 'success' | 'warning' | 'error'}>
                            {product.stockStatus.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                          </Badge>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {formatNumber(product.totalSales)}
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
