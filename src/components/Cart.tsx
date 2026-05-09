import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingCart, X, Plus, Minus, Send, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { RestaurantSettings, Order } from '../types';
import { addOrder } from '../lib/firestore';
import { useLanguage } from '../context/LanguageContext';

interface CartProps {
  settings: RestaurantSettings | null;
}

export default function Cart({ settings }: CartProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);
  const [isOrderSent, setIsOrderSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    door: '',
    zipCode: '',
    nif: ''
  });
  const { items, updateQuantityByIndex, updateSpecialInstructionsByIndex, removeItemByIndex, clearCart, totalItems, totalPrice, orderType, setOrderType } = useCart();

  // Determine delivery fee based on zip code
  let deliveryFee = settings?.deliveryFee || 0;
  let activeZone = null;
  
  if (orderType === 'Delivery' && settings?.deliveryZones && settings.deliveryZones.length > 0 && customerInfo.zipCode) {
    const matchingZone = settings.deliveryZones.find(z => 
      z.zipCodes.split(',').map(zc => zc.trim().toLowerCase()).includes(customerInfo.zipCode.trim().toLowerCase())
    );
    if (matchingZone) {
      deliveryFee = matchingZone.fee;
      activeZone = matchingZone;
    }
  }

  const finalTotal = totalPrice + (orderType === 'Delivery' ? deliveryFee : 0);
  const minOrderUnmet = activeZone && totalPrice < activeZone.minOrderValue;

  // Trigger bounce effect when cart count changes
  useEffect(() => {
    if (totalItems > 0) {
      setIsBouncing(true);
      const timer = setTimeout(() => setIsBouncing(false), 300);
      return () => clearTimeout(timer);
    }
  }, [totalItems]);

  const handleCheckout = () => {
    setError(null);

    if (!settings?.isOpen) {
      setError('Sorry, the store is currently closed.');
      return;
    }

    if (!settings?.whatsappNumber) {
      setError('Orders are currently unavailable. No WhatsApp number provided.');
      return;
    }

    if (!customerInfo.name.trim() || !customerInfo.phone.trim()) {
      setError('Please fill in your name and phone number.');
      return;
    }

    if (orderType === 'Delivery') {
      if (!customerInfo.address.trim() || !customerInfo.city.trim() || !customerInfo.zipCode.trim()) {
        setError('Please provide your full address, city and zip code for delivery.');
        return;
      }
      if (activeZone && totalPrice < activeZone.minOrderValue) {
        setError(`Minimum order for ${activeZone.name} is €${activeZone.minOrderValue.toFixed(2)}.`);
        return;
      }
    }

    let message = `━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `🍔 *NEW ORDER - PHILLY HYPE* \n`;
    message += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    // Customer Details
    message += `👤 *Customer Details*\n`;
    message += `   Name: ${customerInfo.name}\n`;
    message += `   Phone: ${customerInfo.phone}\n`;
    message += `   Type: ${orderType.toUpperCase()}\n\n`;
    
    if (orderType === 'Delivery') {
      message += `🚚 *Delivery Information*\n`;
      message += `   Address: ${customerInfo.address}\n`;
      if (customerInfo.door.trim()) message += `   Door/Apt: ${customerInfo.door}\n`;
      message += `   City: ${customerInfo.city}\n`;
      message += `   Zip Code: ${customerInfo.zipCode}\n`;
      if (activeZone) {
        message += `   Zone: ${activeZone.name}\n`;
      }
      message += `\n`;
    }

    if (customerInfo.nif.trim()) {
      message += `🧾 *Tax Info*\n`;
      message += `   NIF: ${customerInfo.nif}\n\n`;
    }
    
    // Items
    message += `🛍️ *Order Items*\n`;
    items.forEach((item, index) => {
      const itemTotal = (item.price + (item.selectedOptions?.reduce((sum, opt) => sum + opt.price, 0) || 0)) * item.quantity;
      message += `${index + 1}. *${item.quantity}x ${item.name}* — €${itemTotal.toFixed(2)}\n`;
      
      if (item.selectedOptions && item.selectedOptions.length > 0) {
        message += `   ↳ _Options: ${item.selectedOptions.map(o => o.name).join(', ')}_\n`;
      }
      if (item.specialInstructions) {
        message += `   ↳ _Note: ${item.specialInstructions}_\n`;
      }
    });

    message += `\n━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `📋 *Summary*\n`;
    message += `   Subtotal: €${totalPrice.toFixed(2)}\n`;

    if (orderType === 'Delivery' && deliveryFee > 0) {
      message += `   Delivery Fee: €${deliveryFee.toFixed(2)}\n`;
    }

    message += `\n💰 *TOTAL TO PAY: €${finalTotal.toFixed(2)}*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━\n`;

    if (settings.mbWayNumber) {
      message += `\n💳 *Payment Method: MB WAY*\n`;
      message += `   Please send to: ${settings.mbWayNumber}\n`;
      message += `   _I am sending the payment proof right now._\n`;
    }

    try {
      const dbOrder: Omit<Order, 'id'> = {
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        customerAddress: customerInfo.address,
        customerCity: customerInfo.city,
        customerDoor: customerInfo.door,
        customerZipCode: customerInfo.zipCode,
        customerNif: customerInfo.nif,
        orderType,
        items,
        totalPrice: finalTotal,
        deliveryFee,
        status: 'Pending',
        createdAt: Date.now()
      };
      // Ignore errors for saving to firestore so it doesn't block the checkout.
      addOrder(dbOrder).catch(console.error);
    } catch (e) {
      console.error('Failed to create order record:', e);
    }

    setIsOrderSent(true);
    clearCart();
    
    // Reset back to empty state after a delay or let the user close it
    setTimeout(() => {
      setIsOrderSent(false);
      setIsOpen(false);
    }, 5000);

    const encodedMessage = encodeURIComponent(message);
    // Hardcoding as requested
    const whatsappNum = '351922024690';
    const whatsappUrl = `https://wa.me/${whatsappNum}?text=${encodedMessage}`;
    
    // Use an anchor tag click to better bypass popup blockers in iframes
    const link = document.createElement('a');
    link.href = whatsappUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: isBouncing ? [1, 1.2, 1] : 1,
              rotate: isBouncing ? [0, -10, 10, 0] : 0,
              opacity: 1
            }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            transition={{ duration: 0.3 }}
            className="fixed bottom-8 right-8 z-40 bg-accent text-black w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-2xl hover:bg-white active:scale-90 transition-colors flex items-center justify-center group"
            aria-label="View Cart"
          >
            <ShoppingCart className="w-6 h-6 sm:w-7 sm:h-7" />
            <motion.span 
              initial={{ scale: 0, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0, y: 10 }}
              key="cart-badge"
              className="absolute -top-1 -right-1 bg-white text-black text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-accent shadow-lg"
            >
              {totalItems}
            </motion.span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 transition-opacity"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-[100dvh] w-full sm:w-[500px] bg-bg-card border-l border-white/5 z-[60] flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)]"
          >
            <div className="p-3 sm:p-5 flex items-center justify-between border-b border-white/5 bg-bg-dark flex-shrink-0">
              <div>
                <h2 className="text-xl sm:text-2xl font-display uppercase text-white leading-none">
                  {t('your')} <span className="text-accent underline underline-offset-4">{t('order')}</span>
                </h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-white/30 hover:text-white hover:bg-white/5 transition-all rounded-full"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-3 sm:p-5 flex flex-col gap-3 sm:gap-5 scroll-smooth overflow-x-hidden">
              {/* Order Type & Customer Details - Now inside scrollable area */}
              {!isOrderSent && items.length > 0 && (
                <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-3 sm:space-y-4 mb-1 sm:mb-2 text-[9px] sm:text-[10px]">
                  <div>
                    <p className="uppercase tracking-[0.2em] text-white/30 mb-1.5 font-bold flex items-center justify-between pointer-events-none">
                      <span>{t('servicePreference')}</span>
                      <span className="w-1 h-1 bg-accent/20" />
                    </p>
                    <div className="flex p-0.5 bg-black/40 border border-white/10 rounded-lg overflow-hidden">
                      {(['Eat-in', 'Takeaway', 'Delivery'] as const).map((type) => (
                        <button
                          key={type}
                          onClick={() => setOrderType(type)}
                          className={`flex-1 py-1.5 sm:py-2 text-[8px] sm:text-[9px] font-black uppercase tracking-widest transition-all rounded-md relative ${
                            orderType === type 
                              ? 'text-black' 
                              : 'text-white/40 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {orderType === type && (
                            <motion.div 
                              layoutId="orderTypeBg"
                              className="absolute inset-0 bg-accent"
                              style={{ borderRadius: '6px' }}
                            />
                          )}
                          <span className="relative z-10">{type}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="uppercase tracking-[0.2em] text-white/30 mb-0.5 font-bold pointer-events-none">{t('contactDetails')}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      <input 
                        type="text" 
                        placeholder={t('name')}
                        value={customerInfo.name}
                        onChange={(e) => {
                          setCustomerInfo({...customerInfo, name: e.target.value});
                          setError(null);
                        }}
                        className={`w-full bg-black/30 p-2 text-[8px] sm:text-[9px] uppercase tracking-[0.1em] text-white placeholder:text-white/20 outline-none transition-all rounded-md border ${error && !customerInfo.name.trim() ? 'border-red-500/80 bg-red-500/5 focus:border-red-500' : 'border-white/5 focus:border-accent/40'}`}
                      />
                      <input 
                        type="tel" 
                        placeholder={t('phone')}
                        value={customerInfo.phone}
                        onChange={(e) => {
                          setCustomerInfo({...customerInfo, phone: e.target.value});
                          setError(null);
                        }}
                        className={`w-full bg-black/30 p-2 text-[8px] sm:text-[9px] uppercase tracking-[0.1em] text-white placeholder:text-white/20 outline-none transition-all rounded-md border ${error && !customerInfo.phone.trim() ? 'border-red-500/80 bg-red-500/5 focus:border-red-500' : 'border-white/5 focus:border-accent/40'}`}
                      />
                    </div>
                    <input 
                      type="text" 
                      placeholder={t('nif')}
                      value={customerInfo.nif}
                      onChange={(e) => setCustomerInfo({...customerInfo, nif: e.target.value})}
                      className="w-full bg-black/30 p-2 text-[8px] sm:text-[9px] uppercase tracking-[0.1em] text-white placeholder:text-white/20 outline-none transition-all rounded-md border border-white/5 focus:border-accent/40"
                    />
                    {orderType === 'Delivery' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-1.5 overflow-hidden pt-1"
                      >
                        <div className="flex gap-1.5">
                          <input 
                            type="text" 
                            placeholder={t('address')}
                            value={customerInfo.address}
                            onChange={(e) => {
                              setCustomerInfo({...customerInfo, address: e.target.value});
                              setError(null);
                            }}
                            className={`flex-grow bg-black/30 p-2 text-[8px] sm:text-[9px] uppercase tracking-[0.1em] text-white placeholder:text-white/20 outline-none transition-all rounded-md border ${error && orderType === 'Delivery' && !customerInfo.address.trim() ? 'border-red-500/80 bg-red-500/5 focus:border-red-500' : 'border-white/5 focus:border-accent/40'}`}
                          />
                          <input 
                            type="text" 
                            placeholder={t('door')}
                            value={customerInfo.door}
                            onChange={(e) => setCustomerInfo({...customerInfo, door: e.target.value})}
                            className="w-24 sm:w-28 bg-black/30 p-2 text-[8px] sm:text-[9px] uppercase tracking-[0.1em] text-white placeholder:text-white/20 outline-none transition-all rounded-md border border-white/5 focus:border-accent/40"
                          />
                        </div>
                        <div className="flex gap-1.5">
                          <input 
                            type="text" 
                            placeholder={t('city')}
                            value={customerInfo.city}
                            onChange={(e) => {
                              setCustomerInfo({...customerInfo, city: e.target.value});
                              setError(null);
                            }}
                            className={`flex-grow bg-black/30 p-2 text-[8px] sm:text-[9px] uppercase tracking-[0.1em] text-white placeholder:text-white/20 outline-none transition-all rounded-md border ${error && orderType === 'Delivery' && !customerInfo.city.trim() ? 'border-red-500/80 bg-red-500/5 focus:border-red-500' : 'border-white/5 focus:border-accent/40'}`}
                          />
                          <input 
                            type="text" 
                            placeholder={t('zipCode')}
                            value={customerInfo.zipCode}
                            title="Required to estimate delivery fee if custom zones exist."
                            onChange={(e) => {
                              setCustomerInfo({...customerInfo, zipCode: e.target.value});
                              setError(null);
                            }}
                            className={`w-24 sm:w-28 bg-black/30 p-2 text-[8px] sm:text-[9px] uppercase tracking-[0.1em] text-white placeholder:text-white/20 outline-none transition-all rounded-md border ${error && orderType === 'Delivery' && !customerInfo.zipCode.trim() ? 'border-red-500/80 bg-red-500/5 focus:border-red-500' : 'border-white/5 focus:border-accent/40'}`}
                          />
                        </div>
                        <div className="flex items-center justify-between p-1.5 bg-accent/5 border border-accent/20 rounded-md">
                          <div className="flex items-center gap-1.5">
                            <div className="w-1 h-1 bg-accent rounded-full animate-pulse" />
                            <p className="text-[7px] sm:text-[8px] text-accent uppercase tracking-widest font-black">
                              {activeZone ? `${t('zone')}: ${activeZone.name}` : `${t('delivery')}: €${deliveryFee.toFixed(2)}`}
                            </p>
                          </div>
                          {activeZone && (
                            <p className="text-[7px] sm:text-[8px] text-accent/80 uppercase tracking-widest font-black">
                              {t('fee')}: €{deliveryFee.toFixed(2)} | {t('min')}: €{activeZone.minOrderValue.toFixed(2)}
                            </p>
                          )}
                        </div>
                        {minOrderUnmet && (
                          <p className="text-[7px] sm:text-[8px] text-red-500 uppercase tracking-widest font-bold mt-1 text-right">
                            {t('doesNotMeetMin')}
                          </p>
                        )}
                      </motion.div>
                    )}
                  </div>
                </div>
              )}

              <AnimatePresence mode="popLayout" initial={false}>
                {isOrderSent ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex-grow flex flex-col items-center justify-center text-white/80 py-20"
                    key="success-order"
                  >
                    <div className="w-24 h-24 bg-green-500/10 border-2 border-green-500/20 rounded-full flex items-center justify-center mb-6 text-green-500">
                      <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <h3 className="text-2xl font-display uppercase text-white mb-3 tracking-tight">{t('orderSent')}</h3>
                    <p className="uppercase tracking-[0.2em] font-bold text-[10px] text-center text-white/50 max-w-[250px] leading-relaxed">
                      {t('orderOnWay')}
                    </p>
                  </motion.div>
                ) : items.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex-grow flex flex-col items-center justify-center text-white/20"
                    key="empty-cart"
                  >
                    <ShoppingCart className="w-20 h-20 mb-6 opacity-10" />
                    <p className="uppercase tracking-[0.3em] font-bold text-xs text-center">{t('cartSilent')}</p>
                  </motion.div>
                ) : (
                  items.map((item, index) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      key={`${item.id}-${index}`} 
                      className="flex gap-4 group"
                      transition={{ 
                        type: 'spring', 
                        damping: 25, 
                        stiffness: 200,
                        layout: { duration: 0.2 }
                      }}
                    >
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden flex-shrink-0 bg-white/5 border border-white/5 flex items-center justify-center">
                        {item.imageURL ? (
                          <motion.img 
                            whileHover={{ scale: 1.05 }}
                            src={item.imageURL} 
                            alt={item.name} 
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/10 uppercase font-black text-[7px]">IMG</div>
                        )}
                      </div>
                      <div className="flex-grow flex flex-col justify-between py-0.5">
                        <div className="flex justify-between items-start">
                          <div className="min-w-0 flex-grow">
                            <h3 className="font-display uppercase text-[13px] sm:text-base text-white leading-none group-hover:text-accent transition-colors truncate">
                              {item.name}
                            </h3>
                            <div className="mt-1 flex flex-wrap gap-1">
                              <p className="text-[7px] text-white/40 uppercase bg-white/5 px-1 py-0.5">{item.category}</p>
                              {item.selectedOptions?.map(opt => (
                                <p key={opt.name} className="text-[7px] text-accent/60 uppercase border border-accent/20 px-1 py-0.5">
                                  + {opt.name}
                                </p>
                              ))}
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1, color: '#ef4444' }}
                            whileActive={{ scale: 0.9 }}
                            onClick={() => removeItemByIndex(index)}
                            className="text-white/20 hover:text-red-500 transition-colors p-0.5 flex-shrink-0"
                          >
                            <X className="w-3 h-3" />
                          </motion.button>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <div className="flex items-center bg-black/40 border border-white/5 rounded-full overflow-hidden scale-[0.8] sm:scale-[0.85] origin-left">
                            <motion.button
                              whileActive={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                              onClick={() => updateQuantityByIndex(index, item.quantity - 1)}
                              className="px-2.5 py-1 text-white/40 hover:text-accent transition-colors border-r border-white/5 text-sm leading-none"
                            >
                              -
                            </motion.button>
                            <motion.span 
                              key={item.quantity}
                              initial={{ y: -5, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              className="px-3 py-1 font-display text-white text-sm inline-block"
                            >
                              {item.quantity}
                            </motion.span>
                            <motion.button
                              whileActive={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                              onClick={() => updateQuantityByIndex(index, item.quantity + 1)}
                              className="px-2.5 py-1 text-white/40 hover:text-accent transition-colors border-l border-white/5 text-sm leading-none"
                            >
                              +
                            </motion.button>
                          </div>
                          <motion.span 
                            layout
                            className="font-display text-base text-white"
                          >
                            €{(item.price * item.quantity).toFixed(2)}
                          </motion.span>
                        </div>
                        <div className="mt-2">
                          <input
                            type="text"
                            placeholder={t('addInstructions')}
                            value={item.specialInstructions || ''}
                            onChange={(e) => updateSpecialInstructionsByIndex(index, e.target.value)}
                            className="w-full bg-black/30 border border-white/5 p-1.5 text-[8px] sm:text-[9px] text-white placeholder:text-white/20 focus:border-accent/40 outline-none transition-all rounded-md italic"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {!isOrderSent && items.length > 0 && (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 sm:p-5 border-t border-white/5 bg-black/40 backdrop-blur-xl z-20"
              >
                <div className="space-y-1.5 mb-3 sm:mb-5">
                   <div className="flex justify-between text-white/40 uppercase tracking-[0.1em] text-[7px] sm:text-[8px]">
                     <span>{t('subtotal')}</span>
                     <span>€{totalPrice.toFixed(2)}</span>
                   </div>
                   {orderType === 'Delivery' && (
                     <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="flex justify-between text-white/40 uppercase tracking-[0.1em] text-[7px] sm:text-[8px]"
                      >
                       <span>{t('deliveryFee')}</span>
                       <span>€{deliveryFee.toFixed(2)}</span>
                     </motion.div>
                   )}
                   <div className="flex justify-between items-end border-t border-white/5 pt-1.5 mt-0.5">
                    <div>
                      <p className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-white/40 mb-0.5">{t('total')}</p>
                      <div className="flex items-center gap-1">
                         {[1, 2].map(i => <div key={i} className="w-0.5 h-0.5 bg-accent/30" />)}
                      </div>
                    </div>
                    <motion.span 
                      key={finalTotal}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-2xl sm:text-3xl font-display text-accent leading-none inline-block origin-right"
                    >
                      €{finalTotal.toFixed(2)}
                    </motion.span>
                  </div>
                </div>
                
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mb-3 p-2 bg-red-500/10 border border-red-500/20 rounded-md text-red-500 text-[9px] sm:text-[10px] uppercase tracking-widest font-bold text-center"
                  >
                    {error}
                  </motion.div>
                )}

                <motion.button
                  whileHover={settings?.isOpen ? { scale: 1.01 } : {}}
                  whileActive={settings?.isOpen ? { scale: 0.99 } : {}}
                  onClick={handleCheckout}
                  disabled={!settings?.isOpen}
                  className={`w-full font-black uppercase tracking-[0.2em] py-3.5 sm:py-4.5 transition-all flex justify-center items-center gap-2.5 group rounded-full text-[9px] sm:text-[10px] ${settings?.isOpen ? 'bg-accent text-black hover:bg-white' : 'bg-red-500/20 text-red-500 cursor-not-allowed opacity-80'}`}
                >
                  {settings?.isOpen ? (
                    <>
                      {t('orderViaWhatsapp')}
                      <Send className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-1.5 transition-transform duration-500" />
                    </>
                  ) : (
                    t('storeClosedBtn')
                  )}
                </motion.button>
                
                <div className="flex justify-center gap-2 mt-3">
                   <div className="text-[6px] sm:text-[7px] text-white/20 uppercase tracking-[0.2em] border border-white/5 px-2 py-1 rounded-full">{t('payOnWa')}</div>
                   <div className="text-[6px] sm:text-[7px] text-white/20 uppercase tracking-[0.1em] border border-white/5 px-2 py-1 rounded-full">{t('guarantee')}</div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
