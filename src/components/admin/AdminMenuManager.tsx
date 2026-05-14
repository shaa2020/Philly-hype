import React, { useState, useRef } from 'react';
import { MenuItem, MenuCategory, CATEGORIES, MenuOption } from '../../types';
import { addMenuItem, updateMenuItem, deleteMenuItem, uploadImage } from '../../lib/firestore';
import { Edit2, Trash2, Plus, Image as ImageIcon, CheckCircle, XCircle, X, AlignLeft, Tags, Euro, Loader2 } from 'lucide-react';
import { useTenant } from '../../context/TenantContext';

interface AdminMenuManagerProps {
  items: MenuItem[];
}

export default function AdminMenuManager({ items }: AdminMenuManagerProps) {
  const { tenantId } = useTenant();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<MenuItem>>({});
  const [uploadingImage, setUploadingImage] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ text: '', type: '' });
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showStatus = (text: string, type: 'success' | 'error') => {
    setStatusMsg({ text, type });
    setTimeout(() => setStatusMsg({ text: '', type: '' }), 4000);
  };

  const startEdit = (item?: MenuItem) => {
    if (item) {
      setIsEditing(item.id as string);
      setFormData({
        ...item,
        options: item.options || []
      });
    } else {
      setIsEditing('new');
      setFormData({
        name: '',
        price: 0,
        description: '',
        category: 'Cheesesteaks',
        imageURL: '',
        isAvailable: true,
        options: []
      });
    }
  };

  const handleAddOption = () => {
    const options = [...(formData.options || []), { name: '', price: 0 }];
    setFormData({ ...formData, options });
  };

  const handleUpdateOption = (index: number, field: keyof MenuOption, value: string | number) => {
    const options = [...(formData.options || [])];
    options[index] = { ...options[index], [field]: value as any };
    setFormData({ ...formData, options });
  };

  const handleRemoveOption = (index: number) => {
    const options = (formData.options || []).filter((_, i) => i !== index);
    setFormData({ ...formData, options });
  };

  const cancelEdit = () => {
    setIsEditing(null);
    setFormData({});
  };

  const handleSave = async () => {
    if (!tenantId) return;
    setSaving(true);
    try {
      const sanitizedData = {
        ...formData,
        price: Number(formData.price) || 0,
        options: formData.options?.map(o => ({ ...o, price: Number(o.price) || 0 })) || []
      };

      if (isEditing === 'new') {
        const newItem = {
          ...sanitizedData,
          createdAt: Date.now()
        } as Omit<MenuItem, 'id'>;
        await addMenuItem(tenantId, newItem);
        showStatus('Menu item created successfully!', 'success');
      } else if (isEditing) {
        await updateMenuItem(tenantId, isEditing, sanitizedData as Partial<Omit<MenuItem, 'id'>>);
        showStatus('Menu item updated successfully!', 'success');
      }
      setIsEditing(null);
      setFormData({});
    } catch (error) {
      showStatus("Error saving menu item", 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!tenantId) return;
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteMenuItem(tenantId, id);
        showStatus('Item deleted successfully', 'success');
      } catch (e) {
        showStatus('Failed to delete item', 'error');
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadingImage(true);
      const file = e.target.files[0];
      
      try {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 600;
            const MAX_HEIGHT = 600;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            
            // Compress using JPEG
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
            setFormData({ ...formData, imageURL: dataUrl });
            setUploadingImage(false);
          };
          img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
      } catch (error) {
        alert("Failed to process image");
        setUploadingImage(false);
      }
    }
  };

  const toggleAvailability = async (item: MenuItem) => {
    if (!tenantId) return;
    await updateMenuItem(tenantId, item.id!, { isAvailable: !item.isAvailable });
  };

  return (
    <div className="bg-[#ffffff] border border-zinc-200 rounded-3xl p-6 md:p-10 shadow-2xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 border-b border-zinc-200 pb-6">
        <div className="flex items-center gap-4">
          <div className="bg-accent/10 p-3 rounded-2xl border border-accent/20">
            <Tags className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-widest leading-none">Menu Database</h2>
            <p className="text-zinc-500 text-xs mt-2 uppercase tracking-widest font-bold">Manage categories and products</p>
          </div>
        </div>
        
        {!isEditing && (
          <button 
            onClick={() => startEdit()}
            className="bg-accent text-black hover:bg-accent/90 font-black uppercase tracking-widest px-6 py-3 rounded-xl transition-all transform hover:scale-[1.02] active:scale-95 flex items-center gap-2 text-sm shadow-[0_0_15px_rgba(230,0,0,0.3)] w-full md:w-auto justify-center"
          >
            <Plus className="w-5 h-5" /> Add Product
          </button>
        )}
      </div>

      {statusMsg.text && (
        <div className={`mb-6 p-4 rounded-xl text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 animate-in fade-in ${statusMsg.type === 'success' ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
          {statusMsg.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          {statusMsg.text}
        </div>
      )}

      {isEditing ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-gradient-to-br from-zinc-50 to-[#ffffff] border border-zinc-200 rounded-3xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-8">
              <h3 className="text-xl font-black uppercase tracking-widest text-accent">
                {isEditing === 'new' ? 'Build New Product' : 'Edit Product Configuration'}
              </h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 pl-1">Product Name</label>
                  <input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-zinc-50 border border-zinc-200 hover:border-zinc-300 rounded-xl px-4 py-3 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors font-bold text-lg placeholder-zinc-400" placeholder="e.g. Classic Philly" />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 pl-1">Base Price</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">€</span>
                      <input type="number" step="0.01" value={formData.price ?? ''} onChange={e => setFormData({...formData, price: e.target.value as any})} className="w-full bg-zinc-50 border border-zinc-200 hover:border-zinc-300 rounded-xl py-3 pl-8 pr-4 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors font-bold text-lg placeholder-zinc-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 pl-1">Category</label>
                    <select value={formData.category || 'Cheesesteaks'} onChange={e => setFormData({...formData, category: e.target.value as MenuCategory})} className="w-full bg-zinc-50 border border-zinc-200 hover:border-zinc-300 rounded-xl px-4 py-3 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors font-bold text-lg appearance-none">
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 pl-1">Description</label>
                  <textarea value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} className="w-full bg-zinc-50 border border-zinc-200 hover:border-zinc-300 rounded-xl px-4 py-3 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors resize-none placeholder-zinc-400" placeholder="Describe the ingredients and flavor profile..." />
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 hover:border-zinc-200 transition-colors">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-accent mb-4 pl-1">Media Assets</label>
                  <div className="flex flex-col xl:flex-row items-center gap-6">
                    <div className="flex-grow w-full space-y-4">
                      <input 
                        type="text" 
                        value={formData.imageURL || ''} 
                        onChange={e => setFormData({...formData, imageURL: e.target.value})} 
                        placeholder="https://images.unsplash.com/..."
                        className="w-full bg-zinc-50 border border-zinc-200 hover:border-zinc-300 rounded-xl px-4 py-3 text-zinc-900 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all text-sm" 
                      />
                      <div className="relative">
                        <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                        <button 
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadingImage}
                          className="w-full bg-zinc-50 border border-dashed border-zinc-300 hover:border-accent/50 hover:bg-accent/5 px-4 py-4 rounded-xl flex items-center justify-center gap-3 text-sm font-bold uppercase tracking-widest transition-all group"
                        >
                          {uploadingImage ? (
                            <><Loader2 className="w-5 h-5 animate-spin text-accent" /> Uploading...</>
                          ) : (
                            <><ImageIcon className="w-5 h-5 text-zinc-500 group-hover:text-accent transition-colors" /> Upload from Device</>
                          )}
                        </button>
                      </div>
                    </div>
                    {formData.imageURL ? (
                      <img src={formData.imageURL} alt="Preview" className="w-32 h-32 rounded-2xl object-cover border-2 border-zinc-200 shadow-xl" />
                    ) : (
                      <div className="w-32 h-32 rounded-2xl bg-zinc-50 border border-dashed border-zinc-200 flex items-center justify-center flex-shrink-0">
                        <ImageIcon className="w-8 h-8 text-zinc-400" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 hover:border-zinc-200 transition-colors">
                  <div className="flex justify-between items-center mb-6">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-accent pl-1">Modifiers & Add-ons</label>
                    <button 
                      onClick={handleAddOption}
                      className="text-[10px] bg-zinc-100 hover:bg-zinc-200 px-3 py-2 rounded-lg font-black uppercase tracking-widest flex items-center gap-2 transition-colors"
                    >
                      <Plus className="w-3 h-3" /> New Add-on
                    </button>
                  </div>
                  <div className="space-y-3">
                    {formData.options?.map((opt, idx) => (
                      <div key={idx} className="flex gap-2 sm:gap-3 items-center group">
                        <input 
                          type="text" 
                          placeholder="Name (e.g. Extra Cheese)"
                          value={opt.name}
                          onChange={e => handleUpdateOption(idx, 'name', e.target.value)}
                          className="min-w-0 flex-1 bg-zinc-100 border border-zinc-200 hover:border-zinc-300 rounded-xl px-3 sm:px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all"
                        />
                        <div className="flex-shrink-0 w-24 sm:w-28 flex items-center gap-1 sm:gap-2 bg-zinc-100 border border-zinc-200 hover:border-zinc-300 rounded-xl px-2 sm:px-4 py-3 focus-within:ring-1 focus-within:ring-accent focus-within:border-accent transition-all">
                          <span className="text-zinc-400 text-sm font-bold">+€</span>
                          <input 
                            type="number" 
                            step="0.01"
                            value={opt.price ?? ''}
                            onChange={e => handleUpdateOption(idx, 'price', e.target.value)}
                            className="min-w-0 w-full bg-transparent text-sm text-zinc-900 focus:outline-none font-bold placeholder-zinc-400"
                            placeholder="0.00"
                          />
                        </div>
                        <button onClick={() => handleRemoveOption(idx)} className="flex-shrink-0 p-3 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all opacity-100 sm:opacity-50 group-hover:opacity-100">
                          <X className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    ))}
                    {(!formData.options || formData.options.length === 0) && (
                      <div className="text-center py-6 border border-dashed border-zinc-200 rounded-xl bg-zinc-50">
                        <p className="text-[10px] text-zinc-400 uppercase tracking-widest">No modifiers attached to this product</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-4 mt-10 pt-6 border-t border-zinc-200">
              <button 
                onClick={cancelEdit} 
                className="px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-sm bg-zinc-50 hover:bg-zinc-100 transition-colors"
              >
                Cancel Draft
              </button>
              <button 
                onClick={handleSave} 
                disabled={saving}
                className="px-8 py-3 rounded-xl font-black uppercase tracking-widest text-sm bg-accent text-black hover:bg-accent/90 transition-transform transform hover:scale-[1.02] shadow-[0_0_15px_rgba(255,107,0,0.3)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" /> 
                ) : (
                  <CheckCircle className="w-4 h-4" /> 
                )}
                {saving ? 'Saving...' : 'Save Product Configuration'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {items.map(item => (
            <div key={item.id} className="group flex flex-col bg-[#ffffff] border border-zinc-200 rounded-3xl overflow-hidden hover:border-zinc-300 hover:shadow-2xl transition-all duration-300">
              
              <div className="relative h-48 w-full bg-zinc-100 overflow-hidden">
                {item.imageURL ? (
                  <img src={item.imageURL} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400">
                    <ImageIcon className="w-12 h-12 mb-2"/>
                    <span className="text-[10px] uppercase font-bold tracking-widest">No Image Asset</span>
                  </div>
                )}
                
                {/* Stock Badge Overlay */}
                <div className="absolute top-4 left-4">
                  <button 
                    onClick={() => toggleAvailability(item)}
                    className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full backdrop-blur-md border shadow-lg transition-transform hover:scale-105 ${item.isAvailable ? 'border-green-500/50 text-green-400 bg-green-500/20' : 'border-red-500/50 text-red-400 bg-red-500/20'}`}
                  >
                    {item.isAvailable ? <><CheckCircle className="w-3 h-3"/> Active</> : <><XCircle className="w-3 h-3"/> Depleted</>}
                  </button>
                </div>

                {/* Top Right Actions Overlay */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                  <button onClick={() => startEdit(item)} className="p-2.5 bg-zinc-200 backdrop-blur-md rounded-xl text-zinc-900 hover:text-accent border border-zinc-200 hover:border-accent/50 transition-colors shadow-lg">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(item.id!)} className="p-2.5 bg-red-500/80 backdrop-blur-md rounded-xl text-zinc-900 hover:bg-red-500 border border-zinc-200 transition-colors shadow-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-black uppercase tracking-wider text-lg line-clamp-1 group-hover:text-accent transition-colors" title={item.name}>{item.name}</h4>
                  <span className="font-bold text-accent whitespace-nowrap ml-4">€{item.price.toFixed(2)}</span>
                </div>
                
                <div className="mb-4">
                  <span className="inline-block text-[10px] uppercase tracking-widest bg-zinc-100 text-zinc-700 px-2 py-1 rounded-md font-bold">
                    {item.category}
                  </span>
                </div>
                
                <p className="text-sm text-zinc-500 line-clamp-2 mt-auto">
                  {item.description || "No description provided."}
                </p>

                {item.options && item.options.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-zinc-200 flex flex-wrap gap-2">
                    {item.options.slice(0, 3).map((opt, i) => (
                      <span key={i} className="text-[9px] uppercase tracking-widest bg-zinc-100 text-zinc-500 border border-zinc-200 px-2 py-1 rounded-md">
                        {opt.name} <span className="text-accent">+€{opt.price.toFixed(2)}</span>
                      </span>
                    ))}
                    {item.options.length > 3 && (
                      <span className="text-[9px] uppercase tracking-widest text-zinc-400 px-1 py-1">+{item.options.length - 3} more</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center border border-dashed border-zinc-200 rounded-3xl bg-zinc-50">
              <Tags className="w-16 h-16 text-white/10 mb-4" />
              <p className="text-zinc-500 uppercase tracking-widest font-bold mb-6">No products found in the database</p>
              <button 
                onClick={() => startEdit()}
                className="bg-zinc-100 hover:bg-zinc-200 px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-sm transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Initialize First Product
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
