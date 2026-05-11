import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Minus, Check, MessageSquare, ListChecks, ShoppingBag } from 'lucide-react';
import { MenuItem, MenuOption, CartItem } from '../types';
import { useCart } from '../context/CartContext';

interface ItemModalProps {
  item: MenuItem | null;
  allItems: MenuItem[];
  onClose: () => void;
}

export default function ItemModal({ item, allItems, onClose }: ItemModalProps) {
  const { addToCart, items: cartItems } = useCart();
  const [selectedOptions, setSelectedOptions] = useState<MenuOption[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');

  const recommendations = React.useMemo(() => {
    if (!item) return [];
    let recs: MenuItem[] = [];

    const availableDrinks = allItems.filter(i => i.category === 'Drinks' && i.isAvailable && i.id !== item.id);
    const availableSides = allItems.filter(i => i.category === 'Sides' && i.isAvailable && i.id !== item.id);

    if (item.category === 'Drinks') {
      if (availableSides.length > 0) recs.push(availableSides[0]);
    } else if (item.category === 'Sides') {
      if (availableDrinks.length > 0) recs.push(availableDrinks[0]);
    } else {
      if (availableDrinks.length > 0) recs.push(availableDrinks[0]);
      if (availableSides.length > 0) recs.push(availableSides[0]);
    }
    return recs;
  }, [item, allItems]);

  if (!item) return null;

  const toggleOption = (option: MenuOption) => {
    setSelectedOptions(prev => 
      prev.find(o => o.name === option.name)
        ? prev.filter(o => o.name !== option.name)
        : [...prev, option]
    );
  };

  const totalPrice = (item.price + selectedOptions.reduce((sum, o) => sum + o.price, 0)) * quantity;

  const handleAddToCart = () => {
    addToCart(item, selectedOptions, quantity, specialInstructions);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-white/95 backdrop-blur-xl"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl bg-bg-card border border-white/5 rounded-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)]"
        >
          <button 
            onClick={onClose}
            className="absolute top-3 right-3 md:top-4 md:right-4 z-20 p-1.5 text-white/30 hover:text-white hover:bg-white/5 rounded-full transition-all"
          >
            <X className="w-4 h-4 md:w-5 md:h-5" />
          </button>

          {/* Image Section */}
          <div className="w-full md:w-5/12 h-40 sm:h-52 md:h-auto relative flex-shrink-0">
            <img 
              src={item.imageURL} 
              alt={item.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-card md:bg-gradient-to-l via-transparent to-transparent" />
          </div>

          {/* Content Section */}
          <div className="w-full md:w-7/12 p-5 md:p-8 flex flex-col overflow-y-auto">
            <div className="mb-4 md:mb-6">
              <span className="text-accent text-[8px] md:text-[9px] font-black uppercase tracking-[0.4em] mb-1.5 block">
                {item.category}
              </span>
              <h2 className="text-2xl md:text-4xl font-display uppercase text-white leading-tight mb-2 md:mb-3">
                {item.name}
              </h2>
              <p className="text-white/50 text-[10px] md:text-xs leading-relaxed font-light max-w-md">
                {item.description}
              </p>
            </div>

            {/* Options Section */}
            {item.options && item.options.length > 0 && (
              <div className="mb-6 md:mb-8">
                <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-1.5">
                  <ListChecks className="w-3 h-3 text-accent" />
                  <h3 className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">
                    Customize your vibe
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {item.options.map((option) => {
                    const isSelected = selectedOptions.find(o => o.name === option.name);
                    return (
                      <button
                        key={option.name}
                        onClick={() => toggleOption(option)}
                        className={`group flex items-center justify-between p-3 border rounded-xl transition-all ${
                          isSelected 
                            ? 'bg-accent/10 border-accent text-white' 
                            : 'bg-white/5 border-white/5 text-white/40 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-4 h-4 border rounded-sm flex items-center justify-center transition-colors ${
                            isSelected ? 'bg-accent border-accent' : 'border-white/20 group-hover:border-white/40'
                          }`}>
                            {isSelected && <Check className="w-2.5 h-2.5 text-black" />}
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider">{option.name}</span>
                        </div>
                        <span className="text-[9px] font-mono opacity-60">
                          +€{option.price.toFixed(2)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Special Instructions */}
            <div className="mb-6 md:mb-8">
              <div className="flex items-center gap-2 mb-3 border-b border-white/5 pb-1.5">
                <MessageSquare className="w-3 h-3 text-white/40" />
                <h3 className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">
                  Special Instructions
                </h3>
              </div>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Ex. No onions, etc..."
                className="w-full bg-white/5 border border-white/5 rounded-xl p-3 text-[10px] md:text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-accent/40 transition-colors resize-none h-14 md:h-16"
              />
            </div>

            {/* Recommendations Section */}
            {recommendations.length > 0 && (
              <div className="mb-6 md:mb-8">
                <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-1.5">
                  <ShoppingBag className="w-3 h-3 text-accent" />
                  <h3 className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">
                    Complete your order
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                  {recommendations.map((rec) => {
                    const isAdded = cartItems.some((i: CartItem) => i.id === rec.id && !i.selectedOptions?.length && !i.specialInstructions);
                    return (
                      <div 
                        key={rec.id}
                        className={`group flex items-center gap-2 p-1.5 bg-white/5 border rounded-xl transition-all cursor-pointer ${isAdded ? 'border-green-500/50 hover:border-green-500' : 'border-white/5 hover:border-accent/40'}`}
                        onClick={() => !isAdded && addToCart(rec)}
                      >
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-black rounded-lg overflow-hidden flex-shrink-0">
                          <img src={rec.imageURL} alt={rec.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" referrerPolicy="no-referrer" />
                        </div>
                        <div className="flex-grow min-w-0">
                          <p className="text-[8px] md:text-[9px] text-white font-bold uppercase truncate">{rec.name}</p>
                          <p className="text-[7px] md:text-[8px] text-accent font-mono mb-0.5">€{rec.price.toFixed(2)}</p>
                          <span className={`text-[6px] md:text-[7px] font-black uppercase tracking-widest transition-colors ${isAdded ? 'text-green-500' : 'text-accent group-hover:text-white'}`}>
                            {isAdded ? '✔ Added' : '+ Add Now'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Footer / Add to Cart */}
            <div className="mt-auto pt-4 md:pt-6 border-t border-white/5 bg-bg-card sticky bottom-0 z-20 pb-1">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <div className="flex items-center bg-white/10 border border-white/5 rounded-full group-hover:border-white/20 transition-colors overflow-hidden">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 md:px-4 md:py-2 text-white/30 hover:text-accent transition-colors text-sm"
                  >
                    -
                  </button>
                  <span className="px-3 py-1.5 md:px-4 md:py-2 font-display text-base md:text-lg text-white min-w-[2rem] md:min-w-[2.5rem] text-center border-x border-white/5">
                    {quantity}
                  </span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 md:px-4 md:py-2 text-white/30 hover:text-accent transition-colors text-sm"
                  >
                    +
                  </button>
                </div>
                <div className="text-right">
                  <p className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-white/30 mb-0.5">Subtotal</p>
                  <span className="text-xl md:text-2xl font-display text-accent leading-none">
                    €{totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!item.isAvailable}
                className="w-full bg-accent text-black font-black uppercase tracking-[0.2em] rounded-full py-4 md:py-5 hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed text-[10px] md:text-xs active:scale-[0.98] transform"
              >
                {item.isAvailable ? 'Add to Order' : 'Out of Stock'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
