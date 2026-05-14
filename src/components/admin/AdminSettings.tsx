import React, { useState } from 'react';
import { RestaurantSettings, DeliveryZone } from '../../types';
import { updateSettings } from '../../lib/firestore';
import { Save, Building, Phone, Store, CreditCard, Utensils, MessageSquare, MapPin, Plus, Trash2, Star, Upload, QrCode, CheckCircle, AlertCircle } from 'lucide-react';
import QRCode from 'react-qr-code';
import { useTenant } from '../../context/TenantContext';

interface AdminSettingsProps {
  settings: RestaurantSettings | null;
}

export default function AdminSettings({ settings }: AdminSettingsProps) {
  const { tenantId } = useTenant();
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
  const [activeTab, setActiveTab] = useState<'general' | 'visuals' | 'delivery' | 'qr'>('general');

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantId) return;
    setSaving(true);
    setSaveStatus('saving');
    try {
      await updateSettings(tenantId, formData as Omit<RestaurantSettings, 'id'>);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setSaving(false);
    }
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;
          const MAX_SIZE = 1200;
          if (width > height && width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          } else if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/webp', 0.8));
          } else {
            resolve(reader.result as string);
          }
        };
        img.onerror = () => resolve(reader.result as string);
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024 * 5) { // Allow up to 5MB before compression
        alert("Image must be smaller than 5MB");
        return;
      }
      try {
        const compressed = await compressImage(file);
        setFormData({ ...formData, highlightImage: compressed });
      } catch (err) {
        alert("Failed to process image");
      }
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024 * 5) {
        alert("Image must be smaller than 5MB");
        return;
      }
      try {
        const compressed = await compressImage(file);
        setFormData({ ...formData, logoUrl: compressed });
      } catch (err) {
        alert("Failed to process image");
      }
    }
  };

  return (
    <div className="bg-[#ffffff] border border-zinc-200 rounded-3xl p-6 md:p-10 shadow-2xl">
      <div className="flex items-center gap-4 mb-10 border-b border-zinc-200 pb-6">
        <div className="bg-accent/10 p-3 rounded-2xl border border-accent/20">
          <Store className="w-6 h-6 text-accent" />
        </div>
        <div>
          <h2 className="text-2xl font-black uppercase tracking-widest leading-none">Settings Configuration</h2>
          <p className="text-zinc-500 text-xs mt-2 uppercase tracking-widest font-bold">Manage restaurant details and states</p>
        </div>
      </div>
      
      <div className="flex bg-zinc-100 p-1 rounded-xl mb-8 border border-zinc-200 overflow-x-auto hide-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('general')}
          className={`flex-1 min-w-max py-2 px-4 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${activeTab === 'general' ? 'bg-zinc-100 text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
        >
          General
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('visuals')}
          className={`flex-1 min-w-max py-2 px-4 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${activeTab === 'visuals' ? 'bg-zinc-100 text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
        >
          Appearance
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('delivery')}
          className={`flex-1 min-w-max py-2 px-4 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${activeTab === 'delivery' ? 'bg-zinc-100 text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
        >
          Delivery
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('qr')}
          className={`flex-1 min-w-max py-2 px-4 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${activeTab === 'qr' ? 'bg-zinc-100 text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
        >
          QR Code
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        
        {/* Toggle State Section (Always visible or in General?) Let's put in General */}
        <div className={activeTab === 'general' ? 'block space-y-10' : 'hidden'}>
          <div className="bg-gradient-to-r from-zinc-100 to-zinc-50 p-6 rounded-2xl border border-zinc-200 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl border ${formData.isOpen ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                <Utensils className="w-6 h-6" />
              </div>
              <div>
                <div className="font-black uppercase tracking-widest text-lg mb-1">{formData.isOpen ? 'Restaurant is Open' : 'Restaurant is Closed'}</div>
                <div className="text-zinc-500 text-xs font-medium uppercase tracking-widest">Toggle to accept or pause incoming operations</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer scale-110">
              <input 
                type="checkbox" 
                checked={formData.isOpen} 
                onChange={(e) => setFormData({...formData, isOpen: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-zinc-100 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500 shadow-inner"></div>
            </label>
          </div>

          {/* Global Details */}
          <div className="space-y-6 relative">
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
              <Building className="w-4 h-4 text-accent" /> General Brand Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 pl-1">Restaurant Name</label>
                <input 
                  type="text" 
                  value={formData.restaurantName}
                  onChange={(e) => setFormData({...formData, restaurantName: e.target.value})}
                  className="w-full bg-zinc-50 border border-zinc-200 hover:border-zinc-300 rounded-xl px-4 py-3 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all font-medium placeholder-zinc-400"
                  placeholder="e.g. PHILLY HYPE"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 pl-1">Logo URL (Optional)</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input 
                      type="text" 
                      value={formData.logoUrl?.startsWith('data:') ? 'Uploaded Image' : (formData.logoUrl || '')}
                      onChange={(e) => {
                        if (!formData.logoUrl?.startsWith('data:')) {
                          setFormData({...formData, logoUrl: e.target.value});
                        }
                      }}
                      disabled={formData.logoUrl?.startsWith('data:')}
                      className={`w-full bg-zinc-50 border border-zinc-200 hover:border-zinc-300 rounded-xl px-4 py-3 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all font-medium placeholder-zinc-400 ${formData.logoUrl?.startsWith('data:') ? 'opacity-50 text-zinc-500 cursor-not-allowed pr-10' : ''}`}
                      placeholder="https://..."
                    />
                    {formData.logoUrl?.startsWith('data:') && (
                      <button 
                        type="button" 
                        onClick={() => setFormData({...formData, logoUrl: ''})} 
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-red-500 p-1 transition-colors bg-zinc-50 rounded-full"
                        title="Clear image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="relative group flex items-center justify-center bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-xl px-4 cursor-pointer transition-colors">
                    <span className="text-[10px] font-bold text-zinc-900 uppercase tracking-widest">Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
                {formData.logoUrl && (
                  <div className="mt-2 w-16 h-16 bg-zinc-100 border border-zinc-200 rounded-lg overflow-hidden flex items-center justify-center">
                    <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                  </div>
                )}
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest pl-1 mt-2">Replaces text name if provided (Max 2MB)</p>
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 pl-1">Contact Email</label>
                <input 
                  type="email" 
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                  className="w-full bg-zinc-50 border border-zinc-200 hover:border-zinc-300 rounded-xl px-4 py-3 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all font-medium placeholder-zinc-400"
                  placeholder="e.g. contact@phillyhype.com"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 pl-1">Physical Address</label>
                <textarea 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  rows={2}
                  className="w-full bg-zinc-50 border border-zinc-200 hover:border-zinc-300 rounded-xl px-4 py-3 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all font-medium placeholder-zinc-400 resize-none"
                  placeholder="Enter the full street address..."
                />
              </div>
          </div>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

        {/* Website Content */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-accent" /> Hero Section Content
          </h3>
          <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 pl-1">Hero Image URL (Optional)</label>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <input 
                      type="text" 
                      value={formData.heroImage?.startsWith('data:') ? 'Uploaded Image' : (formData.heroImage || '')}
                      onChange={(e) => {
                        if (!formData.heroImage?.startsWith('data:')) {
                          setFormData({...formData, heroImage: e.target.value});
                        }
                      }}
                      disabled={formData.heroImage?.startsWith('data:')}
                      className={`w-full bg-zinc-50 border border-zinc-200 hover:border-zinc-300 rounded-xl px-4 py-3 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all font-medium placeholder-zinc-400 ${formData.heroImage?.startsWith('data:') ? 'opacity-50 text-zinc-500 cursor-not-allowed pr-10' : ''}`}
                      placeholder="https://images.unsplash.com/photo-..."
                    />
                    {formData.heroImage?.startsWith('data:') && (
                      <button 
                        type="button" 
                        onClick={() => setFormData({...formData, heroImage: ''})} 
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-red-500 p-1 transition-colors bg-zinc-50 rounded-full"
                        title="Clear image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="relative group flex items-center justify-center bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-xl px-4 h-12 cursor-pointer transition-colors">
                    <span className="text-[10px] font-bold text-zinc-900 uppercase tracking-widest">Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 1024 * 1024 * 5) {
                            alert("Image must be smaller than 5MB");
                            return;
                          }
                          try {
                            const compressed = await compressImage(file);
                            setFormData({ ...formData, heroImage: compressed });
                          } catch (err) {
                            alert("Failed to process image");
                          }
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  {formData.heroImage && (
                    <div className="w-12 h-12 rounded-lg bg-zinc-50 border border-zinc-200 overflow-hidden flex-shrink-0">
                      <img src={formData.heroImage} alt="Hero preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 pl-1">Hero Title (Main Headline)</label>
                <input 
                  type="text" 
                  value={formData.heroTitle}
                  onChange={(e) => setFormData({...formData, heroTitle: e.target.value})}
                  className="w-full bg-zinc-50 border border-zinc-200 hover:border-zinc-300 rounded-xl px-4 py-3 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all font-black text-xl placeholder-zinc-400"
                  placeholder="EXPERIENCE THE HYPE"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 pl-1">Hero Subtitle</label>
                <input 
                  type="text" 
                  value={formData.heroSubtitle}
                  onChange={(e) => setFormData({...formData, heroSubtitle: e.target.value})}
                  className="w-full bg-zinc-50 border border-zinc-200 hover:border-zinc-300 rounded-xl px-4 py-3 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all font-medium placeholder-zinc-400"
                  placeholder="The best Philly Cheesesteaks & Smash Burgers in town."
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center pl-1">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">Light Overlay Opacity</label>
                  <span className="text-[10px] text-zinc-400 font-mono">{formData.heroOverlayOpacity !== undefined ? formData.heroOverlayOpacity : 80}%</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-zinc-400 text-xs text-xl">☀️</span>
                  <input 
                    type="range" 
                    min="10" 
                    max="100" 
                    step="5"
                    value={formData.heroOverlayOpacity !== undefined ? formData.heroOverlayOpacity : 80}
                    onChange={(e) => setFormData({...formData, heroOverlayOpacity: parseInt(e.target.value)})}
                    className="w-full accent-accent h-2 bg-zinc-100 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-zinc-400 text-xs text-xl">🌙</span>
                </div>
              </div>
          </div>
        </div>

        {/* Contact & Payments */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
            <Phone className="w-4 h-4 text-accent" /> Contact & Delivery Methods
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 pl-1">WhatsApp Number</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={formData.whatsappNumber || ''}
                    onChange={(e) => setFormData({...formData, whatsappNumber: e.target.value})}
                    placeholder="e.g. 351912345678"
                    className="w-full bg-zinc-50 border border-zinc-200 hover:border-zinc-300 rounded-xl px-4 py-3 pl-12 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all font-medium placeholder-zinc-400"
                  />
                  <Phone className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
                </div>
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest mt-1 pl-1">Include country code</p>
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 pl-1">MB WAY Number</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={formData.mbWayNumber || ''}
                    onChange={(e) => setFormData({...formData, mbWayNumber: e.target.value})}
                    placeholder="e.g. 912345678"
                    className="w-full bg-zinc-50 border border-zinc-200 hover:border-zinc-300 rounded-xl px-4 py-3 pl-12 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all font-medium placeholder-zinc-400"
                  />
                  <CreditCard className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 pl-1">Base Delivery Fee (€)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={formData.deliveryFee || ''}
                  onChange={(e) => setFormData({...formData, deliveryFee: parseFloat(e.target.value)})}
                  placeholder="e.g. 2.50"
                  className="w-full bg-zinc-50 border border-zinc-200 hover:border-zinc-300 rounded-xl px-4 py-3 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all font-medium placeholder-zinc-400"
                />
              </div>
          </div>
        </div>
        </div>

        {/* Website Content */}
        <div className={activeTab === 'visuals' ? 'block space-y-10' : 'hidden'}>
        <div className="space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-accent" /> Hero Section Content
          </h3>
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
            <Utensils className="w-4 h-4 text-accent" /> Promotional Banner
          </h3>
          <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200">
            <div className="mb-6 pb-6 border-b border-zinc-200 flex items-center justify-between">
              <div>
                <span className="text-zinc-900 font-bold uppercase tracking-widest text-sm">Enable Banner</span>
                <p className="text-zinc-500 text-[10px] sm:text-xs uppercase tracking-widest mt-1">Show a promotional banner below the hero section</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={formData.promoBannerEnabled || false}
                  onChange={(e) => setFormData({...formData, promoBannerEnabled: e.target.checked})}
                />
                <div className="w-14 h-7 bg-zinc-100 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-accent"></div>
              </label>
            </div>
            {formData.promoBannerEnabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 pl-1">Banner Text</label>
                  <input 
                    type="text" 
                    value={formData.promoBannerText || ''}
                    onChange={(e) => setFormData({...formData, promoBannerText: e.target.value})}
                    placeholder="e.g. Free Delivery on Orders over €30!"
                    className="w-full bg-zinc-50 border border-zinc-200 hover:border-zinc-300 rounded-xl px-4 py-3 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all font-medium placeholder-zinc-400"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 pl-1">Banner Link (Optional)</label>
                  <input 
                    type="url" 
                    value={formData.promoBannerLink || ''}
                    onChange={(e) => setFormData({...formData, promoBannerLink: e.target.value})}
                    placeholder="e.g. https://instagram.com/..."
                    className="w-full bg-zinc-50 border border-zinc-200 hover:border-zinc-300 rounded-xl px-4 py-3 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all font-medium placeholder-zinc-400"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Highlight Poster Settings */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
            <Star className="w-4 h-4 text-accent" /> Highlight Poster Settings
          </h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-zinc-50 border border-zinc-200 rounded-2xl">
              <div>
                <span className="text-zinc-900 font-bold uppercase tracking-widest text-sm">Enable Highlight Poster</span>
                <p className="text-zinc-500 text-[10px] sm:text-xs uppercase tracking-widest mt-1">Show a featured section for a new item or promotion</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={formData.highlightEnabled ?? true}
                  onChange={(e) => setFormData({...formData, highlightEnabled: e.target.checked})}
                />
                <div className="w-14 h-7 bg-zinc-100 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-accent"></div>
              </label>
            </div>
            
            {(formData.highlightEnabled ?? true) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border border-zinc-200 rounded-2xl bg-zinc-50">
                <div className="space-y-4 md:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 pl-1">Image</label>
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    {/* Image Preview */}
                    <div className="w-full md:w-1/3 aspect-[3/4] rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-100 relative flex-shrink-0 group">
                      {formData.highlightImage ? (
                        <>
                          <img src={formData.highlightImage} alt="Highlight" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setFormData({...formData, highlightImage: ''})}
                            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500/80 backdrop-blur-sm text-zinc-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-400">
                          <span className="text-[10px] font-bold uppercase tracking-widest">No Image</span>
                        </div>
                      )}
                    </div>
                    {/* Upload / URL Input */}
                    <div className="flex-1 space-y-6 w-full">
                      <div className="relative group cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="w-full bg-zinc-50 border-2 border-dashed border-zinc-300 group-hover:border-accent hover:bg-zinc-100 rounded-2xl p-8 flex flex-col items-center justify-center transition-all text-center">
                          <Upload className="w-8 h-8 text-zinc-500 group-hover:text-accent mb-4 transition-colors" />
                          <span className="text-sm font-bold text-zinc-900 mb-1">Click or drag to upload image</span>
                          <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Max 2MB. Recommended ratio 3:4.</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="h-px bg-zinc-100 flex-1"></div>
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">OR PASTE URL</span>
                        <div className="h-px bg-zinc-100 flex-1"></div>
                      </div>

                      <div className="relative">
                        <input 
                          type="text" 
                          value={formData.highlightImage?.startsWith('data:') ? 'Uploaded Image' : (formData.highlightImage || '')}
                          onChange={(e) => {
                            if (!formData.highlightImage?.startsWith('data:')) {
                              setFormData({...formData, highlightImage: e.target.value});
                            }
                          }}
                          disabled={formData.highlightImage?.startsWith('data:')}
                          placeholder="https://..."
                          className={`w-full bg-zinc-50 border border-zinc-200 hover:border-zinc-300 rounded-xl px-4 py-3 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all font-medium placeholder-zinc-400 ${formData.highlightImage?.startsWith('data:') ? 'opacity-50 text-zinc-500 cursor-not-allowed pr-10' : ''}`}
                        />
                        {formData.highlightImage?.startsWith('data:') && (
                          <button 
                            type="button" 
                            onClick={() => setFormData({...formData, highlightImage: ''})} 
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-red-500 p-1 transition-colors bg-zinc-50 rounded-full"
                            title="Clear image"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 pl-1">Tag (e.g. SEASONAL DROP)</label>
                  <input 
                    type="text" 
                    value={formData.highlightTag || ''}
                    onChange={(e) => setFormData({...formData, highlightTag: e.target.value})}
                    placeholder="SEASONAL DROP"
                    className="w-full bg-zinc-50 border border-zinc-200 hover:border-zinc-300 rounded-xl px-4 py-3 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all font-medium placeholder-zinc-400"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 pl-1">Title</label>
                  <input 
                    type="text" 
                    value={formData.highlightTitle || ''}
                    onChange={(e) => setFormData({...formData, highlightTitle: e.target.value})}
                    placeholder="e.g. THE OUTLAW"
                    className="w-full bg-zinc-50 border border-zinc-200 hover:border-zinc-300 rounded-xl px-4 py-3 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all font-medium placeholder-zinc-400"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 pl-1">Subtitle (Underlined word)</label>
                  <input 
                    type="text" 
                    value={formData.highlightSubtitle || ''}
                    onChange={(e) => setFormData({...formData, highlightSubtitle: e.target.value})}
                    placeholder="e.g. SPECIAL"
                    className="w-full bg-zinc-50 border border-zinc-200 hover:border-zinc-300 rounded-xl px-4 py-3 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all font-medium placeholder-zinc-400"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 pl-1">Description</label>
                  <textarea 
                    value={formData.highlightDescription || ''}
                    onChange={(e) => setFormData({...formData, highlightDescription: e.target.value})}
                    placeholder="Describe the promotion..."
                    rows={2}
                    className="w-full bg-zinc-50 border border-zinc-200 hover:border-zinc-300 rounded-xl px-4 py-3 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all font-medium placeholder-zinc-400 resize-none"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 pl-1">Button Text</label>
                  <input 
                    type="text" 
                    value={formData.highlightButtonText || ''}
                    onChange={(e) => setFormData({...formData, highlightButtonText: e.target.value})}
                    placeholder="e.g. SNAG IT NOW"
                    className="w-full bg-zinc-50 border border-zinc-200 hover:border-zinc-300 rounded-xl px-4 py-3 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all font-medium placeholder-zinc-400"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Our Story Settings */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
            <Building className="w-4 h-4 text-accent" /> Our Story Settings
          </h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-zinc-50 border border-zinc-200 rounded-2xl">
              <div>
                <span className="text-zinc-900 font-bold uppercase tracking-widest text-sm">Enable Our Story Section</span>
                <p className="text-zinc-500 text-[10px] sm:text-xs uppercase tracking-widest mt-1">Show a section describing the restaurant's story</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={formData.storyEnabled ?? false}
                  onChange={(e) => setFormData({...formData, storyEnabled: e.target.checked})}
                />
                <div className="w-14 h-7 bg-zinc-100 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-accent"></div>
              </label>
            </div>
            
            {(formData.storyEnabled ?? false) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border border-zinc-200 rounded-2xl bg-zinc-50">
                <div className="space-y-4 md:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 pl-1">Image URL</label>
                  <input 
                    type="url" 
                    value={formData.storyImage || ''}
                    onChange={(e) => setFormData({...formData, storyImage: e.target.value})}
                    placeholder="https://..."
                    className="w-full bg-zinc-50 border border-zinc-200 hover:border-zinc-300 rounded-xl px-4 py-3 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all font-medium placeholder-zinc-400"
                  />
                  {formData.storyImage && (
                    <div className="mt-4 w-full max-w-[200px] aspect-[4/5] rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-100 mx-auto md:mx-0">
                      <img src={formData.storyImage} alt="Story Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  )}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 pl-1">Headline</label>
                  <input 
                    type="text" 
                    value={formData.storyHeadline || ''}
                    onChange={(e) => setFormData({...formData, storyHeadline: e.target.value})}
                    placeholder="e.g. The Start of an Era"
                    className="w-full bg-zinc-50 border border-zinc-200 hover:border-zinc-300 rounded-xl px-4 py-3 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all font-medium placeholder-zinc-400"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 pl-1">Description</label>
                  <textarea 
                    value={formData.storyDescription || ''}
                    onChange={(e) => setFormData({...formData, storyDescription: e.target.value})}
                    placeholder="Describe your story..."
                    rows={4}
                    className="w-full bg-zinc-50 border border-zinc-200 hover:border-zinc-300 rounded-xl px-4 py-3 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all font-medium placeholder-zinc-400 resize-none"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Social Media Links */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-accent" /> Social Media Links
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 pl-1">Instagram URL</label>
              <input 
                type="url" 
                value={formData.instagramUrl || ''}
                onChange={(e) => setFormData({...formData, instagramUrl: e.target.value})}
                placeholder="https://instagram.com/..."
                className="w-full bg-zinc-50 border border-zinc-200 hover:border-zinc-300 rounded-xl px-4 py-3 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all font-medium placeholder-zinc-400"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 pl-1">Facebook URL</label>
              <input 
                type="url" 
                value={formData.facebookUrl || ''}
                onChange={(e) => setFormData({...formData, facebookUrl: e.target.value})}
                placeholder="https://facebook.com/..."
                className="w-full bg-zinc-50 border border-zinc-200 hover:border-zinc-300 rounded-xl px-4 py-3 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all font-medium placeholder-zinc-400"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 pl-1">TikTok URL</label>
              <input 
                type="url" 
                value={formData.tiktokUrl || ''}
                onChange={(e) => setFormData({...formData, tiktokUrl: e.target.value})}
                placeholder="https://tiktok.com/@..."
                className="w-full bg-zinc-50 border border-zinc-200 hover:border-zinc-300 rounded-xl px-4 py-3 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all font-medium placeholder-zinc-400"
              />
            </div>
          </div>
        </div>
        </div>

        {/* Delivery Platforms */}
        <div className={activeTab === 'delivery' ? 'block space-y-10' : 'hidden'}>
        <div className="space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
            <Store className="w-4 h-4 text-accent" /> Delivery Platforms
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 pl-1">UberEats URL</label>
                <input 
                  type="url" 
                  value={formData.uberEatsUrl || ''}
                  onChange={(e) => setFormData({...formData, uberEatsUrl: e.target.value})}
                  placeholder="e.g. https://www.ubereats.com/..."
                  className="w-full bg-zinc-50 border border-zinc-200 hover:border-zinc-300 rounded-xl px-4 py-3 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all font-medium placeholder-zinc-400"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 pl-1">Deliveroo URL</label>
                <input 
                  type="url" 
                  value={formData.deliverooUrl || ''}
                  onChange={(e) => setFormData({...formData, deliverooUrl: e.target.value})}
                  placeholder="e.g. https://deliveroo.co.uk/..."
                  className="w-full bg-zinc-50 border border-zinc-200 hover:border-zinc-300 rounded-xl px-4 py-3 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all font-medium placeholder-zinc-400"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 pl-1">Glovo URL</label>
                <input 
                  type="url" 
                  value={formData.glovoUrl || ''}
                  onChange={(e) => setFormData({...formData, glovoUrl: e.target.value})}
                  placeholder="e.g. https://glovoapp.com/..."
                  className="w-full bg-zinc-50 border border-zinc-200 hover:border-zinc-300 rounded-xl px-4 py-3 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all font-medium placeholder-zinc-400"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 pl-1">Bolt Food URL</label>
                <input 
                  type="url" 
                  value={formData.boltFoodUrl || ''}
                  onChange={(e) => setFormData({...formData, boltFoodUrl: e.target.value})}
                  placeholder="e.g. https://food.bolt.eu/..."
                  className="w-full bg-zinc-50 border border-zinc-200 hover:border-zinc-300 rounded-xl px-4 py-3 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all font-medium placeholder-zinc-400"
                />
              </div>
          </div>
        </div>

        {/* Delivery Zones */}
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-accent" /> Custom Delivery Zones
            </h3>
            <button 
              type="button"
              onClick={() => {
                const zones = formData.deliveryZones || [];
                setFormData({...formData, deliveryZones: [...zones, { name: '', zipCodes: '', fee: 0, minOrderValue: 0 }]});
              }}
              className="text-[10px] bg-zinc-100 hover:bg-zinc-200 px-3 py-2 rounded-lg font-black uppercase tracking-widest flex items-center gap-2 transition-colors"
            >
              <Plus className="w-3 h-3" /> Add Zone
            </button>
          </div>
          
          <div className="space-y-4">
            {(!formData.deliveryZones || formData.deliveryZones.length === 0) && (
              <div className="text-center py-6 border border-dashed border-zinc-200 rounded-xl bg-zinc-50">
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest">No custom delivery zones configured</p>
              </div>
            )}
            
            {formData.deliveryZones?.map((zone, idx) => (
              <div key={idx} className="bg-zinc-100 border border-zinc-200 rounded-xl p-6 relative group">
                <button 
                  type="button"
                  onClick={() => {
                    const zones = [...(formData.deliveryZones || [])];
                    zones.splice(idx, 1);
                    setFormData({...formData, deliveryZones: zones});
                  }}
                  className="absolute top-4 right-4 text-zinc-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 pl-1">Zone Name</label>
                    <input 
                      type="text" 
                      value={zone.name}
                      onChange={(e) => {
                        const zones = [...(formData.deliveryZones || [])];
                        zones[idx].name = e.target.value;
                        setFormData({...formData, deliveryZones: zones});
                      }}
                      placeholder="e.g. Downtown"
                      className="w-full bg-zinc-50 border border-zinc-200 hover:border-zinc-300 rounded-xl px-4 py-3 text-zinc-900 text-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent font-medium placeholder-zinc-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 pl-1">Zip Codes (Comma separated)</label>
                    <input 
                      type="text" 
                      value={zone.zipCodes}
                      onChange={(e) => {
                        const zones = [...(formData.deliveryZones || [])];
                        zones[idx].zipCodes = e.target.value;
                        setFormData({...formData, deliveryZones: zones});
                      }}
                      placeholder="e.g. 19104, 19105"
                      className="w-full bg-zinc-50 border border-zinc-200 hover:border-zinc-300 rounded-xl px-4 py-3 text-zinc-900 text-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent font-medium placeholder-zinc-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 pl-1">Delivery Fee (€)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      value={zone.fee}
                      onChange={(e) => {
                        const zones = [...(formData.deliveryZones || [])];
                        zones[idx].fee = parseFloat(e.target.value);
                        setFormData({...formData, deliveryZones: zones});
                      }}
                      className="w-full bg-zinc-50 border border-zinc-200 hover:border-zinc-300 rounded-xl px-4 py-3 text-zinc-900 text-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 pl-1">Min Order Value (€)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      value={zone.minOrderValue}
                      onChange={(e) => {
                        const zones = [...(formData.deliveryZones || [])];
                        zones[idx].minOrderValue = parseFloat(e.target.value);
                        setFormData({...formData, deliveryZones: zones});
                      }}
                      className="w-full bg-zinc-50 border border-zinc-200 hover:border-zinc-300 rounded-xl px-4 py-3 text-zinc-900 text-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent font-medium"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
        
        {/* QR Code Section */}
        <div className={activeTab === 'qr' ? 'block' : 'hidden'}>
          <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-6">
            <div className="bg-white p-6 rounded-2xl" id="qr-wrapper">
              <QRCode 
                value={window.location.origin} 
                size={256}
                level="H"
                className="w-full h-auto max-w-[256px]"
              />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-display uppercase tracking-wider text-zinc-900">Menu QR Code</h3>
              <p className="text-sm text-zinc-600 max-w-sm mx-auto">
                Print this QR code and place it on your tables or storefront. Customers can scan it to view the menu and place orders directly from their phones.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const svg = document.getElementById('qr-wrapper')?.querySelector('svg');
                if (!svg) return;
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const data = (new XMLSerializer()).serializeToString(svg);
                const img = new Image();
                const svgBlob = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
                const url = URL.createObjectURL(svgBlob);
                img.onload = function () {
                  canvas.width = img.width + 40;
                  canvas.height = img.height + 40;
                  if (ctx) {
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 20, 20);
                    URL.revokeObjectURL(url);
                    const imgURI = canvas
                        .toDataURL('image/png')
                        .replace('image/png', 'image/octet-stream');
                    
                    const evt = new MouseEvent('click', {
                      view: window,
                      bubbles: false,
                      cancelable: true
                    });
                    
                    const a = document.createElement('a');
                    a.setAttribute('download', 'menu-qr-code.png');
                    a.setAttribute('href', imgURI);
                    a.setAttribute('target', '_blank');
                    a.dispatchEvent(evt);
                  }
                };
                img.src = url;
              }}
              className="bg-zinc-100 hover:bg-zinc-200 text-zinc-900 px-6 py-3 rounded-lg font-bold uppercase tracking-widest text-xs transition-colors flex items-center gap-2"
            >
              <QrCode className="w-4 h-4" /> Download QR Code PNG
            </button>
          </div>
        </div>

        {/* Form Actions */}
        <div className="pt-6 border-t border-zinc-200 flex flex-col sm:flex-row items-center gap-4">
          <button 
            type="submit" 
            disabled={saving}
            className="w-full sm:w-auto bg-accent text-black font-black uppercase tracking-widest px-8 md:px-12 py-4 rounded-xl hover:bg-accent/90 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(230,0,0,0.3)] hover:shadow-[0_0_30px_rgba(230,0,0,0.4)] disabled:opacity-50 disabled:pointer-events-none"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
            ) : (
              <Save className="w-5 h-5" />
            )}
            {saving ? 'Saving Config...' : 'Apply Global Configuration'}
          </button>
          {saveStatus === 'success' && (
            <span className="text-green-600 font-bold uppercase tracking-widest text-sm flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
              <CheckCircle className="w-5 h-5" /> Saved successfully
            </span>
          )}
          {saveStatus === 'error' && (
            <span className="text-red-500 font-bold uppercase tracking-widest text-sm flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
              <AlertCircle className="w-5 h-5" /> Error saving
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
