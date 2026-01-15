import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatPercentage } from '../../utils/formatters';

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  iconBg?: string;
}

export const StatCard = ({
  title,
  value,
  change,
  icon,
  iconBg = 'bg-primary-100 dark:bg-primary-900/30',
}: StatCardProps) => {
  const isPositive = change >= 0;

  return (
    <div className="card p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {value}
          </p>
        </div>
        <div className={`p-3 rounded-xl ${iconBg}`}>
          {icon}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <span
          className={`inline-flex items-center gap-1 text-sm font-medium ${
            isPositive
              ? 'text-green-600 dark:text-green-400'
              : 'text-red-600 dark:text-red-400'
          }`}
        >
          {isPositive ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          {formatPercentage(change)}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          vs last month
        </span>
      </div>
    </div>
  );
};
