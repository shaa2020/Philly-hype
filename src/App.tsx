/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/Home';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import { CartProvider } from './context/CartContext';
import { getSettings, updateSettings } from './lib/firestore';
import { useTenant } from './context/TenantContext';
import { LanguageProvider } from './context/LanguageContext';

export default function App() {
  const { tenantId, loading, error } = useTenant();

  useEffect(() => {
    // Sync address is removed because unauthenticated users cannot update settings
  }, [tenantId]);

  if (loading) return null;
  if (error) return <div className="h-screen w-full flex items-center justify-center bg-zinc-950 text-white font-mono">{error}</div>;

  return (
    <LanguageProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Login />} />
            <Route path="/admin/login" element={<Navigate to="/admin" replace />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </LanguageProvider>
  );
}

