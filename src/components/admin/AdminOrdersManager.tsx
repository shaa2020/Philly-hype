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
      case 'Pending': return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'Preparing': return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'Ready': return 'text-green-700 bg-green-50 border-green-200';
      case 'Delivered': return 'text-zinc-500 bg-zinc-50 border-zinc-200';
      case 'Cancelled': return 'text-red-700 bg-red-50 border-red-200';
      default: return 'text-zinc-500 bg-zinc-50 border-zinc-200';
    }
  };

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border border-dashed border-zinc-200 rounded-3xl bg-[#ffffff] relative">
        <button onClick={testSound} className="absolute top-4 right-4 text-zinc-300 hover:text-zinc-500" title="Test sound">
          <BellRing className="w-5 h-5" />
        </button>
        <FileText className="w-12 h-12 text-zinc-300 mb-4" />
        <p className="text-zinc-500 uppercase tracking-widest font-bold text-sm">No Orders Yet</p>
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
          <h2 className="text-2xl font-display uppercase tracking-wider text-zinc-900">Orders</h2>
          <div className="flex items-center p-1 bg-[#ffffff] border border-zinc-200 rounded-lg shadow-sm">
            <button 
              onClick={() => setViewFilter('active')}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-md transition-colors ${viewFilter === 'active' ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-500 hover:bg-zinc-50'}`}
            >
              Active ({activeOrders.length})
            </button>
            <button 
              onClick={() => setViewFilter('past')}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-md transition-colors ${viewFilter === 'past' ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-500 hover:bg-zinc-50'}`}
            >
              Past ({pastOrders.length})
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={testSound} className="text-zinc-400 hover:text-zinc-600 transition-colors" title="Test Notification Sound">
             <BellRing className="w-5 h-5" />
          </button>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-zinc-200 rounded-3xl bg-[#ffffff] shadow-sm">
           <FileText className="w-8 h-8 text-zinc-300 mb-3" />
           <p className="text-zinc-500 uppercase tracking-widest font-bold text-xs pl-2">No {viewFilter} orders.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredOrders.map(order => (
            <div key={order.id} className={`bg-[#ffffff] border rounded-2xl p-6 transition-all ${order.status === 'Delivered' || order.status === 'Cancelled' ? 'border-zinc-200 opacity-70' : 'border-zinc-200 shadow-sm'}`}>
              <div className="flex flex-col md:flex-row justify-between gap-6">
              
              {/* Order Info Left */}
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-zinc-400 text-xs font-mono">#{order.id?.slice(-6).toUpperCase()}</span>
                  <span className="text-xs text-zinc-500 flex items-center gap-1 font-medium bg-zinc-50 px-2 py-1 rounded">
                    <Clock className="w-3 h-3" />
                    {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                  <span className="bg-zinc-100 text-zinc-700 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest">
                    {order.orderType}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-zinc-900 uppercase tracking-wide flex items-center gap-2">
                    {order.customerName}
                  </h3>
                  <div className="flex flex-col gap-1 mt-2">
                    <a href={`tel:${order.customerPhone}`} className="text-sm text-accent hover:underline flex items-center gap-2 w-fit">
                      <Phone className="w-3 h-3" /> {order.customerPhone}
                    </a>
                    {order.orderType === 'Delivery' && (
                      <p className="text-sm text-zinc-600 flex items-start gap-2 max-w-sm mt-1">
                        <MapPin className="w-3 h-3 mt-1 flex-shrink-0" />
                        <span>{order.customerAddress} <br/> {order.customerZipCode && <span className="text-zinc-400">Zone: {order.customerZipCode}</span>}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Items Middle */}
              <div className="flex-1 bg-zinc-50/50 rounded-xl p-4 border border-zinc-100">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3 border-b border-zinc-100 pb-2">Order Items</h4>
                <ul className="space-y-3">
                  {order.items.map((item, i) => (
                    <li key={i} className="text-sm text-zinc-800">
                      <div className="flex justify-between items-start font-medium mb-1">
                        <span><span className="text-accent bg-accent/10 px-1 rounded mr-1">{item.quantity}x</span> {item.name}</span>
                        <span className="text-zinc-900">€{((item.price + (item.selectedOptions?.reduce((sum, opt) => sum + opt.price, 0) || 0)) * item.quantity).toFixed(2)}</span>
                      </div>
                      {item.selectedOptions && item.selectedOptions.length > 0 && (
                        <p className="text-[10px] text-zinc-500 pl-7 uppercase tracking-wider">
                          + {item.selectedOptions.map(o => o.name).join(', ')}
                        </p>
                      )}
                      {item.specialInstructions && (
                        <p className="text-[10px] text-orange-600 pl-7 mt-0.5 italic">
                          Note: {item.specialInstructions}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 pt-3 border-t border-zinc-200 flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Total</span>
                  <span className="font-black text-accent text-lg">€{order.totalPrice.toFixed(2)}</span>
                </div>
                {order.paymentProofUrl && (
                  <div className="mt-3 bg-[#ffffff] border border-zinc-200 rounded-lg p-3">
                    <span className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Payment Proof</span>
                    <a href={order.paymentProofUrl} target="_blank" rel="noreferrer" className="block max-w-[150px] border border-zinc-200 rounded overflow-hidden hover:opacity-80 transition-opacity">
                      <img src={order.paymentProofUrl} alt="Payment Proof" className="w-full h-auto object-cover" />
                    </a>
                  </div>
                )}
              </div>

              {/* Actions Right */}
              <div className="flex flex-col justify-start md:items-end gap-3 md:w-48">
                <div className="w-full">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Update Status</label>
                  <div className="relative shadow-sm rounded-xl">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      className={`w-full appearance-none outline-none cursor-pointer border rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-wider transition-colors ${getStatusColor(order.status)}`}
                    >
                      {STATUSES.map(s => (
                        <option key={s} value={s} className="bg-[#ffffff] text-zinc-900">{s}</option>
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
