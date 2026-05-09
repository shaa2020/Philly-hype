import React, { useState } from 'react';
import { RestaurantSettings, DeliveryZone } from '../../types';
import { updateSettings } from '../../lib/firestore';
import { Save, Building, Phone, Store, CreditCard, Utensils, MessageSquare, MapPin, Plus, Trash2 } from 'lucide-react';

interface AdminSettingsProps {
  settings: RestaurantSettings | null;
}

export default function AdminSettings({ settings }: AdminSettingsProps) {
  const [formData, setFormData] = useState<Partial<RestaurantSettings>>(settings || {
    restaurantName: '',
    heroTitle: '',
    heroSubtitle: '',
    contactEmail: '',
    address: '',
    isOpen: true,
    whatsappNumber: '',
    mbWayNumber: '',
    deliveryZones: []
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings(formData as Omit<RestaurantSettings, 'id'>);
    } catch (error) {
      alert("Error saving settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-bg-card border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl">
      <div className="flex items-center gap-4 mb-10 border-b border-white/10 pb-6">
        <div className="bg-accent/10 p-3 rounded-2xl border border-accent/20">
          <Store className="w-6 h-6 text-accent" />
        </div>
        <div>
          <h2 className="text-2xl font-black uppercase tracking-widest leading-none">Settings Configuration</h2>
          <p className="text-white/40 text-xs mt-2 uppercase tracking-widest font-bold">Manage restaurant details and states</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-10">
        
        {/* Toggle State Section */}
        <div className="bg-gradient-to-r from-bg-dark to-black/50 p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl border ${formData.isOpen ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
              <Utensils className="w-6 h-6" />
            </div>
            <div>
              <div className="font-black uppercase tracking-widest text-lg mb-1">{formData.isOpen ? 'Restaurant is Open' : 'Restaurant is Closed'}</div>
              <div className="text-white/50 text-xs font-medium uppercase tracking-widest">Toggle to accept or pause incoming operations</div>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer scale-110">
            <input 
              type="checkbox" 
              checked={formData.isOpen} 
              onChange={(e) => setFormData({...formData, isOpen: e.target.checked})}
              className="sr-only peer"
            />
            <div className="w-14 h-7 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500 shadow-inner"></div>
          </label>
        </div>

        {/* Global Details */}
        <div className="space-y-6 relative">
          <h3 className="text-sm font-bold uppercase tracking-widest text-white/50 mb-6 flex items-center gap-2">
            <Building className="w-4 h-4 text-accent" /> General Brand Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-white/50 pl-1">Restaurant Name</label>
                <input 
                  type="text" 
                  value={formData.restaurantName}
                  onChange={(e) => setFormData({...formData, restaurantName: e.target.value})}
                  className="w-full bg-black/20 border border-white/10 hover:border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all font-medium placeholder-white/20"
                  placeholder="e.g. PHILLY HYPE"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-white/50 pl-1">Contact Email</label>
                <input 
                  type="email" 
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                  className="w-full bg-black/20 border border-white/10 hover:border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all font-medium placeholder-white/20"
                  placeholder="e.g. contact@phillyhype.com"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-white/50 pl-1">Physical Address</label>
                <textarea 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  rows={2}
                  className="w-full bg-black/20 border border-white/10 hover:border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all font-medium placeholder-white/20 resize-none"
                  placeholder="Enter the full street address..."
                />
              </div>
          </div>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

        {/* Website Content */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-white/50 mb-6 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-accent" /> Hero Section Content
          </h3>
          <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-white/50 pl-1">Hero Title (Main Headline)</label>
                <input 
                  type="text" 
                  value={formData.heroTitle}
                  onChange={(e) => setFormData({...formData, heroTitle: e.target.value})}
                  className="w-full bg-black/20 border border-white/10 hover:border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all font-black text-xl placeholder-white/20"
                  placeholder="EXPERIENCE THE HYPE"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-white/50 pl-1">Hero Subtitle</label>
                <input 
                  type="text" 
                  value={formData.heroSubtitle}
                  onChange={(e) => setFormData({...formData, heroSubtitle: e.target.value})}
                  className="w-full bg-black/20 border border-white/10 hover:border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all font-medium placeholder-white/20"
                  placeholder="The best Philly Cheesesteaks & Smash Burgers in town."
                />
              </div>
          </div>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

        {/* Contact & Payments */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-white/50 mb-6 flex items-center gap-2">
            <Phone className="w-4 h-4 text-accent" /> Contact & Delivery Methods
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-white/50 pl-1">WhatsApp Number</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={formData.whatsappNumber || ''}
                    onChange={(e) => setFormData({...formData, whatsappNumber: e.target.value})}
                    placeholder="e.g. 351912345678"
                    className="w-full bg-black/20 border border-white/10 hover:border-white/20 rounded-xl px-4 py-3 pl-12 text-white focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all font-medium placeholder-white/20"
                  />
                  <Phone className="w-4 h-4 text-white/30 absolute left-4 top-1/2 -translate-y-1/2" />
                </div>
                <p className="text-[10px] text-white/30 uppercase tracking-widest mt-1 pl-1">Include country code</p>
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-white/50 pl-1">MB WAY Number</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={formData.mbWayNumber || ''}
                    onChange={(e) => setFormData({...formData, mbWayNumber: e.target.value})}
                    placeholder="e.g. 912345678"
                    className="w-full bg-black/20 border border-white/10 hover:border-white/20 rounded-xl px-4 py-3 pl-12 text-white focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all font-medium placeholder-white/20"
                  />
                  <CreditCard className="w-4 h-4 text-white/30 absolute left-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-white/50 pl-1">Base Delivery Fee (€)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={formData.deliveryFee || ''}
                  onChange={(e) => setFormData({...formData, deliveryFee: parseFloat(e.target.value)})}
                  placeholder="e.g. 2.50"
                  className="w-full bg-black/20 border border-white/10 hover:border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all font-medium placeholder-white/20"
                />
              </div>
          </div>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

        {/* Delivery Platforms */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-white/50 mb-6 flex items-center gap-2">
            <Store className="w-4 h-4 text-accent" /> Delivery Platforms
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-white/50 pl-1">UberEats URL</label>
                <input 
                  type="url" 
                  value={formData.uberEatsUrl || ''}
                  onChange={(e) => setFormData({...formData, uberEatsUrl: e.target.value})}
                  placeholder="e.g. https://www.ubereats.com/..."
                  className="w-full bg-black/20 border border-white/10 hover:border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all font-medium placeholder-white/20"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-white/50 pl-1">Deliveroo URL</label>
                <input 
                  type="url" 
                  value={formData.deliverooUrl || ''}
                  onChange={(e) => setFormData({...formData, deliverooUrl: e.target.value})}
                  placeholder="e.g. https://deliveroo.co.uk/..."
                  className="w-full bg-black/20 border border-white/10 hover:border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all font-medium placeholder-white/20"
                />
              </div>
          </div>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

        {/* Delivery Zones */}
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/50 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-accent" /> Custom Delivery Zones
            </h3>
            <button 
              type="button"
              onClick={() => {
                const zones = formData.deliveryZones || [];
                setFormData({...formData, deliveryZones: [...zones, { name: '', zipCodes: '', fee: 0, minOrderValue: 0 }]});
              }}
              className="text-[10px] bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg font-black uppercase tracking-widest flex items-center gap-2 transition-colors"
            >
              <Plus className="w-3 h-3" /> Add Zone
            </button>
          </div>
          
          <div className="space-y-4">
            {(!formData.deliveryZones || formData.deliveryZones.length === 0) && (
              <div className="text-center py-6 border border-dashed border-white/5 rounded-xl bg-black/20">
                <p className="text-[10px] text-white/30 uppercase tracking-widest">No custom delivery zones configured</p>
              </div>
            )}
            
            {formData.deliveryZones?.map((zone, idx) => (
              <div key={idx} className="bg-black/40 border border-white/5 rounded-xl p-6 relative group">
                <button 
                  type="button"
                  onClick={() => {
                    const zones = [...(formData.deliveryZones || [])];
                    zones.splice(idx, 1);
                    setFormData({...formData, deliveryZones: zones});
                  }}
                  className="absolute top-4 right-4 text-white/20 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-white/50 pl-1">Zone Name</label>
                    <input 
                      type="text" 
                      value={zone.name}
                      onChange={(e) => {
                        const zones = [...(formData.deliveryZones || [])];
                        zones[idx].name = e.target.value;
                        setFormData({...formData, deliveryZones: zones});
                      }}
                      placeholder="e.g. Downtown"
                      className="w-full bg-black/20 border border-white/10 hover:border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent font-medium placeholder-white/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-white/50 pl-1">Zip Codes (Comma separated)</label>
                    <input 
                      type="text" 
                      value={zone.zipCodes}
                      onChange={(e) => {
                        const zones = [...(formData.deliveryZones || [])];
                        zones[idx].zipCodes = e.target.value;
                        setFormData({...formData, deliveryZones: zones});
                      }}
                      placeholder="e.g. 19104, 19105"
                      className="w-full bg-black/20 border border-white/10 hover:border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent font-medium placeholder-white/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-white/50 pl-1">Delivery Fee (€)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      value={zone.fee}
                      onChange={(e) => {
                        const zones = [...(formData.deliveryZones || [])];
                        zones[idx].fee = parseFloat(e.target.value);
                        setFormData({...formData, deliveryZones: zones});
                      }}
                      className="w-full bg-black/20 border border-white/10 hover:border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-white/50 pl-1">Min Order Value (€)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      value={zone.minOrderValue}
                      onChange={(e) => {
                        const zones = [...(formData.deliveryZones || [])];
                        zones[idx].minOrderValue = parseFloat(e.target.value);
                        setFormData({...formData, deliveryZones: zones});
                      }}
                      className="w-full bg-black/20 border border-white/10 hover:border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent font-medium"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Actions */}
        <div className="pt-6 border-t border-white/10">
          <button 
            type="submit" 
            disabled={saving}
            className="w-full sm:w-auto bg-accent text-black font-black uppercase tracking-widest px-8 md:px-12 py-4 rounded-xl hover:bg-accent/90 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(255,107,0,0.3)] hover:shadow-[0_0_30px_rgba(255,107,0,0.4)] disabled:opacity-50 disabled:pointer-events-none"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
            ) : (
              <Save className="w-5 h-5" />
            )}
            {saving ? 'Saving Config...' : 'Apply Global Configuration'}
          </button>
        </div>
      </form>
    </div>
  );
}
