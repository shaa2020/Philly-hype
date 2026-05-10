import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import { TenantSettings } from '../../types';

// Importing new components
import SuperAdminSidebar from '../../components/superadmin/SuperAdminSidebar';
import DashboardMetrics from '../../components/superadmin/DashboardMetrics';
import RestaurantManager from '../../components/superadmin/RestaurantManager';
import SubscriptionManager from '../../components/superadmin/SubscriptionManager';
import PaymentsManager from '../../components/superadmin/PaymentsManager';
import AllOrdersManager from '../../components/superadmin/AllOrdersManager';
import SupportTickets from '../../components/superadmin/SupportTickets';
import SystemSettings from '../../components/superadmin/SystemSettings';
import { Menu, X } from 'lucide-react';

export default function SuperAdminDashboard() {
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [tenants, setTenants] = useState<TenantSettings[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user && user.email === 'iamshanto7860@gmail.com') { 
        setLoadingAuth(false);
      } else {
        navigate('/admin');
      }
    });

    const q = query(collection(db, 'tenants'));
    const unsubTenants = onSnapshot(q, (snapshot) => {
      const data: TenantSettings[] = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as TenantSettings);
      });
      setTenants(data);
    });

    return () => {
      unsubAuth();
      unsubTenants();
    };
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/admin');
    } catch (err) {
      console.error('Logout error', err);
    }
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-zinc-500 font-medium tracking-wide">Loading platform...</p>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardMetrics tenants={tenants} />;
      case 'restaurants': return <RestaurantManager tenants={tenants} />;
      case 'subscriptions': return <SubscriptionManager />;
      case 'payments': return <PaymentsManager />;
      case 'orders': return <AllOrdersManager />;
      case 'support': return <SupportTickets />;
      case 'settings': return <SystemSettings />;
      default: return <DashboardMetrics tenants={tenants} />;
    }
  };

  return (
    <div className="flex h-screen bg-zinc-950 font-sans text-zinc-300">
      
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between px-4 z-40">
        <h1 className="font-bold text-white tracking-tight">Super Admin</h1>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-zinc-400 hover:text-white">
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/80 z-40 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition duration-200 ease-in-out z-50 lg:z-0`}>
        <SuperAdminSidebar 
          activeTab={activeTab} 
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setMobileMenuOpen(false);
          }} 
          onLogout={handleLogout} 
        />
      </div>

      <div className="flex-1 overflow-y-auto pt-16 lg:pt-0">
        <div className="p-4 sm:p-8 max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

