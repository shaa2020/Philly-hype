import React, { useEffect, useRef } from 'react';
import { Order, OrderStatus } from '../../types';
import { updateOrderStatus } from '../../lib/firestore';
import { MapPin, Phone, Clock, FileText, CheckCircle2, ChevronDown, Trash2, BellRing } from 'lucide-react';
import { useTenant } from '../../context/TenantContext';

interface AdminOrdersManagerProps {
  orders: Order[];
}

const STATUSES: OrderStatus[] = ['Pending', 'Preparing', 'Ready', 'Delivered', 'Cancelled'];

export default function AdminOrdersManager({ orders }: AdminOrdersManagerProps) {
  const { tenantId } = useTenant();
  const [viewFilter, setViewFilter] = React.useState<'active' | 'past'>('active');
  const prevOrdersCount = useRef(orders.length);

  const testSound = () => {
    try {
      const actx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = actx.createOscillator();
      const gain = actx.createGain();
      osc.connect(gain);
      gain.connect(actx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, actx.currentTime);
      gain.gain.setValueAtTime(0.3, actx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, actx.currentTime + 0.5);
      osc.start(actx.currentTime);
      osc.stop(actx.currentTime + 0.5);
    } catch (e) {
      console.error('Audio play failed:', e);
    }
  };

  useEffect(() => {
    // Only play sound if orders increased and it's not the initial load
    if (orders.length > prevOrdersCount.current && prevOrdersCount.current > 0) {
      testSound();
    }
    prevOrdersCount.current = orders.length;
  }, [orders.length]);

  const handleStatusChange = async (orderId: string | undefined, newStatus: OrderStatus) => {
    if (!orderId || !tenantId) return;
    await updateOrderStatus(tenantId, orderId, newStatus);
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'Preparing': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'Ready': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'Delivered': return 'text-white/50 bg-white/5 border-white/10';
      case 'Cancelled': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-white/50 bg-white/5 border-white/10';
    }
  };

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border border-dashed border-white/10 rounded-3xl bg-black/20 relative">
        <button onClick={testSound} className="absolute top-4 right-4 text-white/20 hover:text-white" title="Test sound">
          <BellRing className="w-5 h-5" />
        </button>
        <FileText className="w-12 h-12 text-white/20 mb-4" />
        <p className="text-white/50 uppercase tracking-widest font-bold text-sm">No Orders Yet</p>
      </div>
    );
  }

  const activeOrders = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled');
  const pastOrders = orders.filter(o => o.status === 'Delivered' || o.status === 'Cancelled');
  
  const filteredOrders = viewFilter === 'active' ? activeOrders : pastOrders;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-display uppercase tracking-wider text-white">Orders</h2>
          <div className="flex items-center p-1 bg-black/40 border border-white/10 rounded-lg">
            <button 
              onClick={() => setViewFilter('active')}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-md transition-colors ${viewFilter === 'active' ? 'bg-white/10 text-white' : 'text-white/40 hover:bg-white/5'}`}
            >
              Active ({activeOrders.length})
            </button>
            <button 
              onClick={() => setViewFilter('past')}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-md transition-colors ${viewFilter === 'past' ? 'bg-white/10 text-white' : 'text-white/40 hover:bg-white/5'}`}
            >
              Past ({pastOrders.length})
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={testSound} className="text-white/30 hover:text-white transition-colors" title="Test Notification Sound">
             <BellRing className="w-5 h-5" />
          </button>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-white/5 rounded-3xl bg-white/5">
           <FileText className="w-8 h-8 text-white/20 mb-3" />
           <p className="text-white/40 uppercase tracking-widest font-bold text-xs pl-2">No {viewFilter} orders.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredOrders.map(order => (
            <div key={order.id} className={`bg-bg-card border rounded-2xl p-6 transition-all ${order.status === 'Delivered' || order.status === 'Cancelled' ? 'border-white/5 opacity-60' : 'border-white/10 shadow-lg'}`}>
              <div className="flex flex-col md:flex-row justify-between gap-6">
              
              {/* Order Info Left */}
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-white/40 text-xs font-mono">#{order.id?.slice(-6).toUpperCase()}</span>
                  <span className="text-xs text-white/40 flex items-center gap-1 font-medium">
                    <Clock className="w-3 h-3" />
                    {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                  <span className="bg-white/10 text-white px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest">
                    {order.orderType}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white uppercase tracking-wide flex items-center gap-2">
                    {order.customerName}
                  </h3>
                  <div className="flex flex-col gap-1 mt-2">
                    <a href={`tel:${order.customerPhone}`} className="text-sm text-accent hover:underline flex items-center gap-2 w-fit">
                      <Phone className="w-3 h-3" /> {order.customerPhone}
                    </a>
                    {order.orderType === 'Delivery' && (
                      <p className="text-sm text-white/60 flex items-start gap-2 max-w-sm mt-1">
                        <MapPin className="w-3 h-3 mt-1 flex-shrink-0" />
                        <span>{order.customerAddress} <br/> {order.customerZipCode && `Zone: ${order.customerZipCode}`}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Items Middle */}
              <div className="flex-1 bg-black/40 rounded-xl p-4 border border-white/5">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-3 border-b border-white/5 pb-2">Order Items</h4>
                <ul className="space-y-3">
                  {order.items.map((item, i) => (
                    <li key={i} className="text-sm text-white">
                      <div className="flex justify-between items-start font-medium mb-1">
                        <span><span className="text-accent">{item.quantity}x</span> {item.name}</span>
                        <span>€{((item.price + (item.selectedOptions?.reduce((sum, opt) => sum + opt.price, 0) || 0)) * item.quantity).toFixed(2)}</span>
                      </div>
                      {item.selectedOptions && item.selectedOptions.length > 0 && (
                        <p className="text-[10px] text-white/50 pl-5 uppercase tracking-wider">
                          + {item.selectedOptions.map(o => o.name).join(', ')}
                        </p>
                      )}
                      {item.specialInstructions && (
                        <p className="text-[10px] text-yellow-400/80 pl-5 mt-0.5 italic">
                          Note: {item.specialInstructions}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Total</span>
                  <span className="font-bold text-accent text-lg">€{order.totalPrice.toFixed(2)}</span>
                </div>
                {order.paymentProofUrl && (
                  <div className="mt-3 bg-white/5 rounded-lg p-3">
                    <span className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Payment Proof</span>
                    <a href={order.paymentProofUrl} target="_blank" rel="noreferrer" className="block max-w-[150px] border border-white/10 rounded overflow-hidden hover:opacity-80 transition-opacity">
                      <img src={order.paymentProofUrl} alt="Payment Proof" className="w-full h-auto object-cover" />
                    </a>
                  </div>
                )}
              </div>

              {/* Actions Right */}
              <div className="flex flex-col justify-start md:items-end gap-3 md:w-48">
                <div className="w-full">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Update Status</label>
                  <div className="relative">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      className={`w-full appearance-none outline-none cursor-pointer border rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-wider transition-colors ${getStatusColor(order.status)}`}
                    >
                      {STATUSES.map(s => (
                        <option key={s} value={s} className="bg-bg-card text-white">{s}</option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                  </div>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}
