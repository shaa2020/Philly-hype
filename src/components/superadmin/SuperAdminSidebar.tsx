import React from 'react';
import { 
  LayoutDashboard, 
  Store, 
  CreditCard, 
  Receipt, 
  ShoppingCart, 
  LifeBuoy, 
  Settings,
  LogOut 
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export default function SuperAdminSidebar({ activeTab, setActiveTab, onLogout }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'restaurants', label: 'Restaurants', icon: Store },
    { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
    { id: 'payments', label: 'Payments', icon: Receipt },
    { id: 'orders', label: 'All Orders', icon: ShoppingCart },
    { id: 'support', label: 'Support', icon: LifeBuoy },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col h-screen overflow-y-auto">
      <div className="p-6">
        <h1 className="text-xl font-bold text-white tracking-tight">Super Admin</h1>
        <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest font-semibold">Master Console</p>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-indigo-500/10 text-indigo-400' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-indigo-400' : 'text-zinc-500'} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-zinc-800">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
