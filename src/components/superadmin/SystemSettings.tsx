import React from 'react';
import { ToggleLeft, ShieldAlert } from 'lucide-react';

export default function SystemSettings() {
  const toggleFeatures = [
    { title: 'Global Booking System', desc: 'Allow restaurants to use the table reservation system.', enabled: true },
    { title: 'QR Menu System', desc: 'Enable digital QR code menu generation globally.', enabled: true },
    { title: 'WhatsApp Ordering', desc: 'Allow routing orders to WhatsApp numbers.', enabled: true },
    { title: 'Delivery Dispatch Network', desc: 'Beta testing third-party delivery integrations.', enabled: false },
  ];

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">System Settings</h2>
        <p className="text-zinc-400 text-sm mt-1">Manage global platform features and super admin access.</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Feature Toggles</h3>
        <div className="space-y-4">
          {toggleFeatures.map((feat, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-zinc-800/50 last:border-0 last:pb-0">
              <div>
                <p className="font-medium text-zinc-200">{feat.title}</p>
                <p className="text-sm text-zinc-500 mt-0.5">{feat.desc}</p>
              </div>
              <button className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${feat.enabled ? 'bg-indigo-500' : 'bg-zinc-700'}`}>
                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${feat.enabled ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-red-500 mb-2 flex items-center gap-2">
          <ShieldAlert size={20} />
          Danger Zone
        </h3>
        <p className="text-sm text-red-400/80 mb-4">These actions affect the entire platform and cannot be easily undone.</p>
        <div className="space-y-3">
          <button className="px-4 py-2 border border-red-500/30 text-red-400 text-sm font-medium rounded hover:bg-red-500/10 transition-colors">
            Maintenance Mode (Disable All Logins)
          </button>
        </div>
      </div>
    </div>
  );
}
