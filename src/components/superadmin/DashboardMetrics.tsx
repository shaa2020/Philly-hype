import React from 'react';
import { Store, CreditCard, ShoppingCart, AlertTriangle, Users, TrendingUp } from 'lucide-react';
import { TenantSettings } from '../../types';

interface DashboardMetricsProps {
  tenants: TenantSettings[];
}

export default function DashboardMetrics({ tenants }: DashboardMetricsProps) {
  const totalRestaurants = tenants.length;
  const activeRestaurants = tenants.filter(t => t.status === 'active').length;
  const monthlyRevenue = tenants.reduce((sum, t) => sum + (t.monthlyFee || 0), 0);
  const failedPayments = tenants.filter(t => t.billingStatus === 'overdue' || t.billingStatus === 'unpaid').length;

  const stats = [
    { label: 'Total Restaurants', value: totalRestaurants, icon: Store, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Active Subscriptions', value: activeRestaurants, icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Total Orders', value: '1,245', icon: ShoppingCart, color: 'text-purple-400', bg: 'bg-purple-500/10' }, // Mocked total orders
    { label: 'Monthly Revenue', value: `€${monthlyRevenue}`, icon: TrendingUp, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { label: 'Failed Payments', value: failedPayments, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
    { label: 'Active Subscriptions (Paid)', value: tenants.filter(t => t.billingStatus === 'paid').length, icon: CreditCard, color: 'text-teal-400', bg: 'bg-teal-500/10' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Overview</h2>
        <p className="text-zinc-400 text-sm mt-1">Key metrics across all your platforms.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-400 mb-2">{stat.label}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.bg} ${stat.color}`}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
