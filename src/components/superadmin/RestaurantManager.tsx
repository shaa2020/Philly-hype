import React, { useState } from 'react';
import { TenantSettings } from '../../types';
import { Edit, Trash2, CheckCircle, XCircle, AlertTriangle, Play, CalendarHeart, Key, Plus, FileText } from 'lucide-react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import { setDoc, doc, deleteDoc } from 'firebase/firestore';

interface RestaurantManagerProps {
  tenants: TenantSettings[];
}

export default function RestaurantManager({ tenants }: RestaurantManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [viewDetails, setViewDetails] = useState<TenantSettings | null>(null);
  const [formData, setFormData] = useState<Partial<TenantSettings>>({
    status: 'active',
    billingStatus: 'paid',
  });

  const handleSaveTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const tenantId = isEditing || formData.domain?.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase() || `tenant-${Date.now()}`;
      
      const newTenant: Partial<TenantSettings> = {
        name: formData.name || 'New Restaurant',
        domain: formData.domain || 'example.com',
        ownerEmail: formData.ownerEmail || '',
        phone: formData.phone || '',
        status: formData.status as 'active' | 'inactive' | 'suspended',
        monthlyFee: formData.monthlyFee || 0,
        billingStatus: formData.billingStatus as 'paid' | 'unpaid' | 'overdue',
        lastPaymentDate: formData.lastPaymentDate || Date.now(),
        paymentDueDate: formData.paymentDueDate || (Date.now() + 30 * 24 * 60 * 60 * 1000),
        subscriptionPlan: formData.subscriptionPlan || 'basic',
        ...(isEditing ? {} : { createdAt: Date.now() }),
      };
      
      await setDoc(doc(db, 'tenants', tenantId), newTenant, { merge: true });
      setIsAdding(false);
      setIsEditing(null);
      setFormData({ status: 'active', billingStatus: 'paid' });
    } catch (err) {
      console.error(err);
      alert('Error saving tenant');
    }
  };

  const handleEdit = (tenant: TenantSettings) => {
    setFormData(tenant);
    setIsEditing(tenant.id || null);
    setIsAdding(true);
  };

  const handleDelete = async (tenantId: string) => {
    if (window.confirm('Are you sure you want to delete this restaurant? All data will be lost.')) {
      try {
        await deleteDoc(doc(db, 'tenants', tenantId));
      } catch (err) {
        console.error(err);
        alert('Error deleting tenant');
      }
    }
  };

  const handleToggleStatus = async (tenant: TenantSettings, newStatus: 'active' | 'inactive' | 'suspended') => {
    try {
      await setDoc(doc(db, 'tenants', tenant.id!), { status: newStatus }, { merge: true });
    } catch (err) {
      console.error(err);
      alert('Error updating status');
    }
  };

  const handleResetCredentials = async (email: string) => {
    if (!email) return alert('No owner email configured for this restaurant.');
    if (window.confirm(`Send a password setup/reset email to ${email}?`)) {
      try {
        await sendPasswordResetEmail(auth, email);
        alert(`Password setup link sent to ${email}`);
      } catch (err) {
        console.error(err);
        alert('Error sending password reset email.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Restaurants</h2>
          <p className="text-zinc-400 text-sm mt-1">Manage all subscribed accounts and domains.</p>
        </div>
        <button
          onClick={() => {
            setFormData({ status: 'active', billingStatus: 'paid' });
            setIsEditing(null);
            setIsAdding(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white font-medium rounded-lg hover:bg-indigo-600 transition-colors shadow-sm"
        >
          <Plus size={18} />
          Create Restaurant
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="border-b border-zinc-800 text-xs uppercase tracking-wider text-zinc-500 bg-zinc-950/50">
                <th className="px-6 py-4 font-semibold">Restaurant</th>
                <th className="px-6 py-4 font-semibold">Domain</th>
                <th className="px-6 py-4 font-semibold">Plan & Billing</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {tenants.map((tenant) => (
                <tr key={tenant.id} className="hover:bg-zinc-800/20 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-white">{tenant.name}</p>
                    <p className="text-xs text-zinc-500 mt-1">{tenant.ownerEmail}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <a href={`/?tenant=${tenant.id}`} target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                        ↗ Visit Public Site
                      </a>
                      <a href={`/admin?tenant=${tenant.id}`} target="_blank" rel="noreferrer" className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500 hover:text-zinc-300 transition-colors">
                        ↗ Admin Portal
                      </a>
                      <span className="text-xs text-zinc-600 mt-1">{tenant.domain}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 text-sm text-zinc-300">
                      <span className="capitalize text-zinc-400">{tenant.subscriptionPlan || 'Custom'}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono text-zinc-200">€{tenant.monthlyFee || 0}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${
                          tenant.billingStatus === 'paid' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                        }`}>
                          {tenant.billingStatus || 'paid'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {tenant.status === 'active' ? (
                      <span className="flex w-fit items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium">
                        <CheckCircle size={14} /> Active
                      </span>
                    ) : tenant.status === 'suspended' ? (
                      <span className="flex w-fit items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-medium">
                        <AlertTriangle size={14} /> Suspended
                      </span>
                    ) : (
                      <span className="flex w-fit items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-500/10 text-zinc-400 text-xs font-medium">
                        <XCircle size={14} /> Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 text-zinc-400">
                      <button onClick={() => setViewDetails(tenant)} className="p-2 hover:text-indigo-400 hover:bg-indigo-400/10 rounded transition-colors" title="View Details">
                        <FileText size={18} />
                      </button>
                      <button onClick={() => handleToggleStatus(tenant, tenant.status === 'active' ? 'suspended' : 'active')} className={`p-2 rounded transition-colors ${tenant.status === 'active' ? 'hover:text-amber-400 hover:bg-amber-400/10' : 'hover:text-emerald-400 hover:bg-emerald-400/10'}`} title="Toggle Status">
                        {tenant.status === 'active' ? <AlertTriangle size={18} /> : <Play size={18} />}
                      </button>
                      <button onClick={() => handleResetCredentials(tenant.ownerEmail)} className="p-2 hover:text-blue-400 hover:bg-blue-400/10 rounded transition-colors" title="Reset/Setup Password">
                        <Key size={18} />
                      </button>
                      <button onClick={() => handleEdit(tenant)} className="p-2 hover:text-white hover:bg-zinc-800 rounded transition-colors" title="Edit">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(tenant.id!)} className="p-2 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {tenants.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                    No restaurants found. Add your first client.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl my-8">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">{isEditing ? 'Edit Restaurant' : 'Create Restaurant'}</h3>
              <button onClick={() => setIsAdding(false)} className="text-zinc-500 hover:text-white transition-colors">
                <XCircle size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSaveTenant} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Business Name *</label>
                  <input required type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" placeholder="Joe's Pizza" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Domain / Subdomain *</label>
                  <input required type="text" value={formData.domain || ''} onChange={e => setFormData({...formData, domain: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" placeholder="joespizza.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Owner Email *</label>
                  <input required type="email" value={formData.ownerEmail || ''} onChange={e => setFormData({...formData, ownerEmail: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" placeholder="joe@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Contact Phone</label>
                  <input type="tel" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" placeholder="+1 234 567 8900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Subscription Plan</label>
                  <select value={formData.subscriptionPlan || 'basic'} onChange={e => setFormData({...formData, subscriptionPlan: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none">
                    <option value="basic">Basic (Free Trial)</option>
                    <option value="pro">Pro Plan</option>
                    <option value="premium">Premium Plan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Monthly Fee (€)</label>
                  <input type="number" value={formData.monthlyFee || 0} onChange={e => setFormData({...formData, monthlyFee: parseFloat(e.target.value)})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Account Status</label>
                  <select value={formData.status || 'active'} onChange={e => setFormData({...formData, status: e.target.value as any})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Billing Status</label>
                  <select value={formData.billingStatus || 'paid'} onChange={e => setFormData({...formData, billingStatus: e.target.value as any})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none">
                    <option value="paid">Paid</option>
                    <option value="unpaid">Unpaid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-4 pt-4 border-t border-zinc-800">
                <button type="button" onClick={() => setIsAdding(false)} className="px-6 py-2.5 text-sm font-medium text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors">
                  {isEditing ? 'Save Changes' : 'Create Restaurant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-white">{viewDetails.name}</h3>
                <a href={`https://${viewDetails.domain}`} target="_blank" rel="noreferrer" className="text-indigo-400 text-sm hover:underline">{viewDetails.domain}</a>
              </div>
              <button onClick={() => setViewDetails(null)} className="text-zinc-500 hover:text-white">
                <XCircle size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-zinc-800">
                <span className="text-zinc-500">Username (Owner Email)</span>
                <div className="flex items-center gap-3">
                  <span className="text-white font-medium">{viewDetails.ownerEmail}</span>
                  <button 
                    onClick={() => handleResetCredentials(viewDetails.ownerEmail)}
                    className="flex items-center gap-1 text-xs px-2 py-1 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded transition-colors"
                  >
                    <Key size={12} /> Send Password Link
                  </button>
                </div>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-800">
                <span className="text-zinc-500">Password</span>
                <span className="text-zinc-400 text-xs italic">Hidden for security. Use "Send Password Link" to reset.</span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-800">
                <span className="text-zinc-500">Contact Phone</span>
                <span className="text-white font-medium">{viewDetails.phone || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-800">
                <span className="text-zinc-500">Plan</span>
                <span className="text-white font-medium capitalize">{viewDetails.subscriptionPlan || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-800">
                <span className="text-zinc-500">Status</span>
                <span className="text-white font-medium capitalize">{viewDetails.status}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-800">
                <span className="text-zinc-500">Created At</span>
                <span className="text-white font-medium">{new Date(viewDetails.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-zinc-500">Revenue (Monthly)</span>
                <span className="text-white font-medium">€{viewDetails.monthlyFee || 0}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
