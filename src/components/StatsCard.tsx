import React from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color: 'blue' | 'purple' | 'green' | 'orange' | 'red';
  delay?: number;
}

const colorMap = {
  blue: {
    bg: 'bg-blue-50',
    icon: 'bg-blue-100 text-blue-600',
    value: 'text-blue-700',
    border: 'border-blue-100'
  },
  purple: {
    bg: 'bg-purple-50',
    icon: 'bg-purple-100 text-purple-600',
    value: 'text-purple-700',
    border: 'border-purple-100'
  },
  green: {
    bg: 'bg-green-50',
    icon: 'bg-green-100 text-green-600',
    value: 'text-green-700',
    border: 'border-green-100'
  },
  orange: {
    bg: 'bg-orange-50',
    icon: 'bg-orange-100 text-orange-600',
    value: 'text-orange-700',
    border: 'border-orange-100'
  },
  red: {
    bg: 'bg-red-50',
    icon: 'bg-red-100 text-red-600',
    value: 'text-red-700',
    border: 'border-red-100'
  }
};

const StatsCard: React.FC<StatsCardProps> = ({ title, value, subtitle, icon: Icon, color, delay = 0 }) => {
  const colors = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`p-6 rounded-2xl border ${colors.border} ${colors.bg} hover:shadow-md transition-all duration-300`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors.icon}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className={`text-3xl font-heading font-bold mb-1 ${colors.value}`}>{value}</div>
      <div className="text-sm font-medium text-foreground">{title}</div>
      {subtitle && <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>}
    </motion.div>
  );
};

export default StatsCard;