import React from 'react';
import { Package, Check, CreditCard } from 'lucide-react';

export default function SubscriptionManager() {
  const plans = [
    {
      name: 'Basic (Trial)',
      price: 0,
      description: '14-day free trial for new restaurants',
      features: ['Up to 50 orders/mo', 'Basic menu management', 'Standard support']
    },
    {
      name: 'Pro',
      price: 49,
      description: 'For growing independent restaurants',
      features: ['Unlimited orders', 'QR Code Menus', 'Priority support', 'Basic reports'],
      popular: true
    },
    {
      name: 'Premium',
      price: 99,
      description: 'Full suite for busy establishments',
      features: ['Everything in Pro', 'Custom domain setup', 'Advanced analytics', 'WhatsApp ordering integrations', 'Multi-location support']
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Subscription Plans</h2>
          <p className="text-zinc-400 text-sm mt-1">Manage pricing tiers and billing settings.</p>
        </div>
        <button className="px-4 py-2 bg-zinc-800 text-white text-sm font-medium rounded-lg hover:bg-zinc-700 transition-colors">
          Stripe Settings
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {plans.map((plan, i) => (
          <div key={i} className={`relative bg-zinc-900 border ${plan.popular ? 'border-indigo-500' : 'border-zinc-800'} rounded-2xl p-6 flex flex-col`}>
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                Most Popular
              </span>
            )}
            <h3 className="text-xl font-bold text-white">{plan.name}</h3>
            <p className="text-zinc-400 text-sm mt-2 mb-6 h-10">{plan.description}</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold text-white">€{plan.price}</span>
              <span className="text-zinc-500">/mo</span>
            </div>
            
            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((feature, j) => (
                <li key={j} className="flex items-start gap-3 text-sm text-zinc-300">
                  <Check size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              plan.popular 
                ? 'bg-indigo-500 text-white hover:bg-indigo-600' 
                : 'bg-zinc-800 text-white hover:bg-zinc-700'
            }`}>
              Edit Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
