import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';
import { semanticColors } from '../../styles/colors';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon: Icon, trend, subtitle }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
          <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
            <Icon className="h-6 w-6 text-blue-600 group-hover:text-blue-700 transition-colors" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-xs sm:text-sm font-medium text-gray-600 truncate group-hover:text-gray-700 transition-colors">{title}</h3>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 truncate group-hover:text-gray-800 transition-colors">{value}</p>
            {subtitle && <p className="text-xs text-gray-500 mt-1 truncate group-hover:text-gray-600 transition-colors">{subtitle}</p>}
          </div>
        </div>
        
        {trend && (
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 transition-all ${
            trend.isPositive 
              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
              : 'bg-red-100 text-red-800 hover:bg-red-200'
          }`}>
            <span>{trend.isPositive ? '↗' : '↘'}</span>
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;