import { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { Product, CartItem, AddToBasketTargetHandle } from '../types';

interface BasketContextType {
  items: CartItem[];
  totalQuantity: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  addToBasket: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromBasket: (productId: string) => void;
  clearBasket: () => void;
  getItemQuantity: (productId: string) => number;
  headerBasketRef: React.RefObject<AddToBasketTargetHandle>;
}

const BasketContext = createContext<BasketContextType | undefined>(undefined);

const BASKET_STORAGE_KEY = 'agentcart_basket_v2';

const normalizeItem = (item: any): CartItem => {
  const prod = item.product || item;
  const prodId = item.productId || prod?.id || item.id || 'studio-tote';
  const price = typeof item.unitPrice === 'number' ? item.unitPrice : (prod?.price || 128);
  return {
    id: item.id || prodId,
    productId: prodId,
    product: {
      ...prod,
      id: prodId,
      name: prod?.name || 'Item',
      price: price,
    },
    quantity: item.quantity || 1,
    unitPrice: price,
    isUpsell: Boolean(item.isUpsell),
    approvedByUser: item.approvedByUser ?? true,
    upsellReason: item.upsellReason,
  };
};

export function BasketProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(BASKET_STORAGE_KEY) || localStorage.getItem('atelier_basket_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map(normalizeItem);
        }
      }
      return [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const headerBasketRef = useRef<AddToBasketTargetHandle>(null);

  useEffect(() => {
    try {
      localStorage.setItem(BASKET_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore storage write errors
    }
  }, [items]);

  const totalQuantity = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const subtotal = items.reduce(
    (sum, item) => sum + (item.unitPrice || item.product?.price || 0) * (item.quantity || 1),
    0
  );

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToBasket = (product: Product, quantity: number = 1) => {
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => (item.productId || item.product?.id || item.id) === product.id
      );
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: (updated[existingIndex].quantity || 1) + quantity,
        };
        return updated;
      }
      return [
        ...prevItems,
        {
          id: product.id,
          productId: product.id,
          product,
          quantity,
          unitPrice: product.price,
          isUpsell: false,
          approvedByUser: true,
        },
      ];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromBasket(productId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) => {
        const id = item.productId || item.product?.id || item.id;
        return id === productId ? { ...item, quantity } : item;
      })
    );
  };

  const removeFromBasket = (productId: string) => {
    setItems((prevItems) =>
      prevItems.filter((item) => {
        const id = item.productId || item.product?.id || item.id;
        return id !== productId;
      })
    );
  };

  const clearBasket = () => {
    setItems([]);
    try {
      localStorage.removeItem(BASKET_STORAGE_KEY);
      localStorage.removeItem('atelier_basket_v1');
    } catch {
      // ignore
    }
  };

  const getItemQuantity = (productId: string): number => {
    const item = items.find((i) => (i.productId || i.product?.id || i.id) === productId);
    return item ? item.quantity : 0;
  };

  return (
    <BasketContext.Provider
      value={{
        items,
        totalQuantity,
        subtotal,
        isCartOpen,
        setIsCartOpen,
        openCart,
        closeCart,
        addToBasket,
        updateQuantity,
        removeFromBasket,
        clearBasket,
        getItemQuantity,
        headerBasketRef,
      }}
    >
      {children}
    </BasketContext.Provider>
  );
}

export function useBasket() {
  const context = useContext(BasketContext);
  if (!context) {
    throw new Error('useBasket must be used within a BasketProvider');
  }
  return context;
}
