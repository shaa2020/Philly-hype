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

import { LanguageProvider } from './context/LanguageContext';

export default function App() {
  useEffect(() => {
    // One-time check and update for existing seeded data
    const syncAddress = async () => {
      try {
        const settings = await getSettings();
        if (settings && settings.address === '123 Hype Street, Foodville') {
          await updateSettings({
            ...settings,
            restaurantName: 'PHILLY HYPE',
            address: 'R. Melvin Jones 10B, 1600-867 Lisboa'
          });
        }
      } catch (err) {
        console.error('Failed to sync address', err);
      }
    };
    syncAddress();
  }, []);

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

