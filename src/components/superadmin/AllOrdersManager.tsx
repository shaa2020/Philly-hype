import React from 'react';
import { ShoppingBag, Search, Filter } from 'lucide-react';

export default function AllOrdersManager() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Global Orders Overview</h2>
          <p className="text-zinc-400 text-sm mt-1">Cross-restaurant order monitoring (Read Only).</p>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl">
        <div className="p-4 border-b border-zinc-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-zinc-950/30 rounded-t-xl">
           <div className="flex items-center gap-2 w-full sm:max-w-md bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2">
             <Search size={18} className="text-zinc-500" />
             <input type="text" placeholder="Search order ID or customer..." className="bg-transparent border-none outline-none text-sm text-white w-full" />
           </div>
           <button className="flex items-center gap-2 px-3 py-2 bg-zinc-800 text-sm font-medium rounded-lg text-zinc-300 hover:bg-zinc-700 w-full sm:w-auto justify-center">
             <Filter size={16} /> Filter
           </button>
        </div>
        
        <div className="p-12 text-center flex flex-col items-center">
          <ShoppingBag size={48} className="text-zinc-700 mb-4" />
          <h3 className="text-lg font-medium text-white">Aggregated view coming soon</h3>
          <p className="text-zinc-500 max-w-sm mt-2">Currently, to view specific orders, please visit the individual restaurant's admin panel via the Restaurants tab.</p>
        </div>
      </div>
    </div>
  );
}
