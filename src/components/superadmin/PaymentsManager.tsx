import React from 'react';
import { PaymentTransaction } from '../../types';
import { ArrowDownLeft, ArrowUpRight, Search, RefreshCw } from 'lucide-react';

export default function PaymentsManager() {
  // Mock Data
  const transactions: PaymentTransaction[] = [
    { id: 'txn_1', tenantId: '1', tenantName: 'Joe Pizza', amount: 49.00, status: 'paid', date: Date.now() - 10000000 },
    { id: 'txn_2', tenantId: '2', tenantName: 'Burger Hub', amount: 99.00, status: 'paid', date: Date.now() - 50000000 },
    { id: 'txn_3', tenantId: '3', tenantName: 'Sushi Lounge', amount: 49.00, status: 'failed', date: Date.now() - 86400000 },
    { id: 'txn_4', tenantId: '4', tenantName: 'Vegan Station', amount: 49.00, status: 'refunded', date: Date.now() - 172800000 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Payments</h2>
          <p className="text-zinc-400 text-sm mt-1">Transaction history and refunds.</p>
        </div>
        <div className="flex gap-2">
           <button className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-800 text-zinc-400 transition-colors">
             <RefreshCw size={18} />
           </button>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800 flex items-center gap-2">
          <Search size={18} className="text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search by restaurant or transaction ID..." 
            className="bg-transparent border-none outline-none text-sm text-white w-full"
          />
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="border-b border-zinc-800 text-xs uppercase tracking-wider text-zinc-500 bg-zinc-950/30">
                <th className="px-6 py-4 font-semibold">Transaction ID</th>
                <th className="px-6 py-4 font-semibold">Restaurant</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {transactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-zinc-800/20 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono text-zinc-400">{txn.id}</td>
                  <td className="px-6 py-4 font-medium text-white">{txn.tenantName}</td>
                  <td className="px-6 py-4 text-sm text-zinc-400">
                    {new Date(txn.date).toLocaleDateString()} {new Date(txn.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono font-medium text-white">€{txn.amount.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                      txn.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400' :
                      txn.status === 'failed' ? 'bg-red-500/10 text-red-400' :
                      txn.status === 'refunded' ? 'bg-zinc-500/10 text-zinc-400' :
                      'bg-amber-500/10 text-amber-400'
                    }`}>
                      {txn.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {txn.status === 'paid' && (
                      <button className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">Refund</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
