import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MenuItem, CartItem, MenuOption, OrderType } from '../types';

interface CartContextType {
  items: CartItem[];
  orderType: OrderType;
  setOrderType: (type: OrderType) => void;
  addToCart: (item: MenuItem, selectedOptions?: MenuOption[], quantity?: number, specialInstructions?: string) => void;
  removeFromCart: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cartItems');
    return saved ? JSON.parse(saved) : [];
  });

  const [orderType, setOrderType] = useState<OrderType>(() => {
    const saved = localStorage.getItem('orderType');
    return (saved as OrderType) || 'Eat-in';
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('orderType', orderType);
  }, [orderType]);

  const addToCart = (item: MenuItem, selectedOptions: MenuOption[] = [], quantity: number = 1, specialInstructions: string = '') => {
    setItems((currentItems) => {
      // Create a unique identifier for the item with its options and instructions
      const optionsIds = selectedOptions.map(o => `${o.name}:${o.price}`).sort().join('|');
      
      const existingIndex = currentItems.findIndex((i) => {
        const iOptionsIds = (i.selectedOptions || []).map(o => `${o.name}:${o.price}`).sort().join('|');
        return i.id === item.id && iOptionsIds === optionsIds && i.specialInstructions === specialInstructions;
      });

      if (existingIndex > -1) {
        return currentItems.map((i, index) =>
          index === existingIndex ? { ...i, quantity: i.quantity + quantity } : i
        );
      }

      // Calculate base price + total of options
      const optionsPrice = selectedOptions.reduce((sum, o) => sum + o.price, 0);
      
      return [...currentItems, { 
        ...item, 
        quantity, 
        selectedOptions,
        specialInstructions,
        price: item.price + optionsPrice 
      }];
    });
  };

  const removeFromCart = (cartId: string) => {
    // Note: This logic assumes we might need a unique cart ID eventually
    // For now, I'll filter based on ID and options match
    // Actually, let's just use the index or a generated ID
  };

  // Improved remove and update using index because item.id is not unique in cart anymore
  const removeItemByIndex = (index: number) => {
    setItems((current) => current.filter((_, i) => i !== index));
  };

  const updateQuantityByIndex = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeItemByIndex(index);
      return;
    }
    setItems((current) => current.map((item, i) => i === index ? { ...item, quantity } : item));
  };

  const updateSpecialInstructionsByIndex = (index: number, specialInstructions: string) => {
    setItems((current) => current.map((item, i) => i === index ? { ...item, specialInstructions } : item));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        orderType,
        setOrderType,
        addToCart,
        removeFromCart: (id) => {}, // Kept for type compatibility, but I'll optimize
        updateQuantity: (id, q) => {}, // Kept for type compatibility
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      <CartInternalContext.Provider value={{ removeItemByIndex, updateQuantityByIndex, updateSpecialInstructionsByIndex }}>
        {children}
      </CartInternalContext.Provider>
    </CartContext.Provider>
  );
}

// Internal context to avoid re-renders or breaking changes while updating the logic
const CartInternalContext = createContext<{
  removeItemByIndex: (index: number) => void;
  updateQuantityByIndex: (index: number, quantity: number) => void;
  updateSpecialInstructionsByIndex: (index: number, specialInstructions: string) => void;
} | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  const internal = useContext(CartInternalContext);
  if (context === undefined || internal === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return { ...context, ...internal };
}
