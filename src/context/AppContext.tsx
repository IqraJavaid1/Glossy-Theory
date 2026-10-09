import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Category,
  Review,
  CartItem,
  Order,
  InventoryTransaction,
  User,
  OrderStatus,
  PromoBanner,
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_REVIEWS,
  INITIAL_ORDERS,
  INITIAL_TRANSACTIONS,
  INITIAL_PROMO_BANNERS,
} from '../data/initialData';

interface AppContextType {
  // Banners & Promotions
  promoBanners: PromoBanner[];
  updatePromoBanner: (id: string, updates: Partial<PromoBanner>) => void;
  resetPromoBanners: () => void;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewCount'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductActive: (id: string) => void;
  toggleProductFeatured: (id: string) => void;

  // Categories
  categories: Category[];
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, shade?: string, quantity?: number) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;

  // Auth
  adminUser: User | null;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;

  // Orders
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, trackingNumber?: string, carrier?: string) => void;
  cancelOrder: (orderId: string) => void;

  // Reviews
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'createdAt' | 'status'>) => void;
  moderateReview: (id: string, status: 'approved' | 'rejected') => void;

  // Inventory
  inventoryTransactions: InventoryTransaction[];
  adjustStock: (productId: string, adjustment: number, reason: string) => void;

  // Navigation & UI state
  activeView: 'home' | 'shop' | 'admin-dashboard' | 'account' | 'tracker';
  setActiveView: (view: 'home' | 'shop' | 'admin-dashboard' | 'account' | 'tracker') => void;
  selectedCategoryFilter: string | null;
  setSelectedCategoryFilter: (category: string | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedProductForModal: Product | null;
  setSelectedProductForModal: (prod: Product | null) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isAdminLoginOpen: boolean;
  setIsAdminLoginOpen: (open: boolean) => void;
  isOrderTrackerOpen: boolean;
  setIsOrderTrackerOpen: (open: boolean) => void;
  trackingOrderNumber: string;
  setTrackingOrderNumber: (num: string) => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;

  // Interactive Shade Matcher & Routine Builder
  isShadeFinderOpen: boolean;
  setIsShadeFinderOpen: (open: boolean) => void;

  // Deluxe Complimentary Sample Gift
  selectedSample: string | null;
  setSelectedSample: (sample: string | null) => void;

  // Feedback Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // LocalStorage initialization with safety
  const loadState = <T,>(key: string, fallback: T): T => {
    try {
      const saved = localStorage.getItem(`glossy_${key}`);
      return saved ? JSON.parse(saved) : fallback;
    } catch {
      return fallback;
    }
  };

  const [products, setProducts] = useState<Product[]>(() => loadState('products', INITIAL_PRODUCTS));
  const [categories, setCategories] = useState<Category[]>(() => loadState('categories', INITIAL_CATEGORIES));
  const [promoBanners, setPromoBanners] = useState<PromoBanner[]>(() =>
    loadState('promo_banners', INITIAL_PROMO_BANNERS)
  );
  const [cart, setCart] = useState<CartItem[]>(() => loadState('cart', []));
  const [orders, setOrders] = useState<Order[]>(() => loadState('orders', INITIAL_ORDERS));
  const [reviews, setReviews] = useState<Review[]>(() => loadState('reviews', INITIAL_REVIEWS));
  const [inventoryTransactions, setInventoryTransactions] = useState<InventoryTransaction[]>(
    () => loadState('tx', INITIAL_TRANSACTIONS)
  );

  const [adminUser, setAdminUser] = useState<User | null>(() => loadState('admin', null));

  // View & UI states
  const [activeView, setActiveView] = useState<'home' | 'shop' | 'admin-dashboard' | 'account' | 'tracker'>('home');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState(false);
  const [trackingOrderNumber, setTrackingOrderNumber] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New interactive states
  const [wishlist, setWishlist] = useState<string[]>(() => loadState('wishlist', ['prod-lipstick-1']));
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isShadeFinderOpen, setIsShadeFinderOpen] = useState(false);
  const [selectedSample, setSelectedSample] = useState<string | null>('Mini Rose Glow Dew Drops (Deluxe Sample)');

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('glossy_promo_banners', JSON.stringify(promoBanners));
  }, [promoBanners]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('glossy_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);
  useEffect(() => {
    localStorage.setItem('glossy_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('glossy_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('glossy_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('glossy_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('glossy_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('glossy_tx', JSON.stringify(inventoryTransactions));
  }, [inventoryTransactions]);

  useEffect(() => {
    localStorage.setItem('glossy_admin', JSON.stringify(adminUser));
  }, [adminUser]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  // Product Actions
  const addProduct = (newProd: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewCount'>) => {
    const id = `prod-${Date.now()}`;
    const product: Product = {
      ...newProd,
      id,
      createdAt: new Date().toISOString(),
      rating: 5.0,
      reviewCount: 0,
    };
    setProducts((prev) => [product, ...prev]);

    // Record initial inventory transaction
    if (product.stock > 0) {
      const tx: InventoryTransaction = {
        id: `tx-${Date.now()}`,
        productId: id,
        productName: product.name,
        change: product.stock,
        previousStock: 0,
        newStock: product.stock,
        reason: 'Initial stock intake on product creation',
        timestamp: new Date().toISOString(),
      };
      setInventoryTransactions((prev) => [tx, ...prev]);
    }
    showToast(`Product "${product.name}" added successfully.`);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          // If stock changed directly via edit, record transaction
          if (updates.stock !== undefined && updates.stock !== p.stock) {
            const diff = updates.stock - p.stock;
            const tx: InventoryTransaction = {
              id: `tx-${Date.now()}`,
              productId: p.id,
              productName: p.name,
              change: diff,
              previousStock: p.stock,
              newStock: updates.stock,
              reason: 'Manual adjustment in product editor',
              timestamp: new Date().toISOString(),
            };
            setInventoryTransactions((prevTx) => [tx, ...prevTx]);
          }
          return { ...p, ...updates };
        }
        return p;
      })
    );
    showToast('Product updated successfully.');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Product deleted.');
  };

  const toggleProductActive = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
  };

  const toggleProductFeatured = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFeatured: !p.isFeatured } : p))
    );
  };

  // Category Actions
  const addCategory = (catData: Omit<Category, 'id'>) => {
    const id = `cat-${Date.now()}`;
    const newCat: Category = { ...catData, id };
    setCategories((prev) => [...prev, newCat]);
    showToast(`Category "${newCat.name}" created.`);
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    showToast('Category updated.');
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    showToast('Category deleted.');
  };

  // Promo Banner Actions
  const updatePromoBanner = (id: string, updates: Partial<PromoBanner>) => {
    setPromoBanners((prev) =>
      prev.map((banner) => (banner.id === id ? { ...banner, ...updates } : banner))
    );
    showToast('Promotional banner updated successfully.');
  };

  const resetPromoBanners = () => {
    setPromoBanners(INITIAL_PROMO_BANNERS);
    showToast('Hero promotional banners restored to defaults.');
  };

  // Cart Actions
  const addToCart = (product: Product, shade?: string, quantity = 1) => {
    if (product.stock <= 0) {
      showToast(`${product.name} is currently out of stock.`);
      return;
    }

    const cartItemId = `${product.id}-${shade ? shade.replace(/\s+/g, '-') : 'default'}`;

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === cartItemId);
      if (existing) {
        const nextQty = Math.min(existing.quantity + quantity, product.stock);
        return prevCart.map((item) =>
          item.id === cartItemId ? { ...item, quantity: nextQty } : item
        );
      } else {
        const newItem: CartItem = {
          id: cartItemId,
          productId: product.id,
          productName: product.name,
          price: product.salePrice ?? product.price,
          image: product.image,
          shade: shade || (product.shades.length > 0 ? product.shades[0].name : undefined),
          quantity: Math.min(quantity, product.stock),
          stock: product.stock,
        };
        return [...prevCart, newItem];
      }
    });

    showToast(`Added ${product.name} to shopping bag.`);
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          const validQty = Math.min(quantity, item.stock);
          return { ...item, quantity: validQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Admin Authentication
  const loginAdmin = (password: string): boolean => {
    // Verified admin staff authentication
    // Default staff password: admin123 or glossy2026
    if (password === 'admin123' || password === 'glossy2026' || password === 'admin') {
      const admin: User = {
        id: 'adm-001',
        name: 'Brand Director',
        email: 'admin@glossytheory.com',
        role: 'admin',
      };
      setAdminUser(admin);
      setIsAdminLoginOpen(false);
      setActiveView('admin-dashboard');
      showToast('Admin session authenticated. Welcome to Glossy Theory Dashboard.');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setAdminUser(null);
    setActiveView('home');
    showToast('Admin session terminated.');
  };

  // Orders
  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>): Order => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: `GT-2026-${randomSuffix}`,
      createdAt: new Date().toISOString(),
    };

    // Deduct stock and log inventory transactions
    newOrder.items.forEach((item) => {
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id === item.productId) {
            const nextStock = Math.max(0, p.stock - item.quantity);
            return { ...p, stock: nextStock };
          }
          return p;
        })
      );

      const prod = products.find((p) => p.id === item.productId);
      const prevStock = prod ? prod.stock : item.stock;
      const tx: InventoryTransaction = {
        id: `tx-${Date.now()}-${Math.random()}`,
        productId: item.productId,
        productName: item.productName,
        change: -item.quantity,
        previousStock: prevStock,
        newStock: Math.max(0, prevStock - item.quantity),
        reason: `Order fulfillment #${newOrder.orderNumber}`,
        timestamp: new Date().toISOString(),
      };
      setInventoryTransactions((prev) => [tx, ...prev]);
    });

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (
    orderId: string,
    status: OrderStatus,
    trackingNumber?: string,
    carrier?: string
  ) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            fulfillmentStatus: status,
            ...(trackingNumber ? { trackingNumber } : {}),
            ...(carrier ? { carrier } : {}),
          };
        }
        return ord;
      })
    );
    showToast(`Order status updated to ${status}.`);
  };

  const cancelOrder = (orderId: string) => {
    const ord = orders.find((o) => o.id === orderId);
    if (!ord) return;

    // Release stock back
    ord.items.forEach((item) => {
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id === item.productId) {
            return { ...p, stock: p.stock + item.quantity };
          }
          return p;
        })
      );
      const prod = products.find((p) => p.id === item.productId);
      const prevStock = prod ? prod.stock : 0;
      const tx: InventoryTransaction = {
        id: `tx-${Date.now()}-${Math.random()}`,
        productId: item.productId,
        productName: item.productName,
        change: item.quantity,
        previousStock: prevStock,
        newStock: prevStock + item.quantity,
        reason: `Order cancellation #${ord.orderNumber} (Restocked)`,
        timestamp: new Date().toISOString(),
      };
      setInventoryTransactions((prevTx) => [tx, ...prevTx]);
    });

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, fulfillmentStatus: 'Canceled', paymentStatus: 'Refunded' }
          : o
      )
    );
    showToast(`Order #${ord.orderNumber} canceled and refunded.`);
  };

  // Reviews
  const addReview = (newReview: Omit<Review, 'id' | 'createdAt' | 'status'>) => {
    const rev: Review = {
      ...newReview,
      id: `rev-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setReviews((prev) => [rev, ...prev]);
    showToast('Review submitted! It will appear publicly after editorial approval.');
  };

  const moderateReview = (id: string, status: 'approved' | 'rejected') => {
    const rev = reviews.find((r) => r.id === id);
    if (!rev) return;

    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );

    // Recalculate average rating for that product
    setTimeout(() => {
      setProducts((prevProds) =>
        prevProds.map((prod) => {
          if (prod.id === rev.productId) {
            const approvedForProd = reviews
              .map((r) => (r.id === id ? { ...r, status } : r))
              .filter((r) => r.productId === prod.id && r.status === 'approved');

            const newCount = approvedForProd.length;
            const newAvg =
              newCount > 0
                ? Number(
                    (
                      approvedForProd.reduce((sum, r) => sum + r.rating, 0) /
                      newCount
                    ).toFixed(1)
                  )
                : 5.0;

            return {
              ...prod,
              rating: newAvg,
              reviewCount: newCount,
            };
          }
          return prod;
        })
      );
    }, 50);

    showToast(`Review ${status}.`);
  };

  // Inventory manual adjustment
  const adjustStock = (productId: string, adjustment: number, reason: string) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;

    const previousStock = prod.stock;
    const newStock = Math.max(0, previousStock + adjustment);

    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: newStock } : p))
    );

    const tx: InventoryTransaction = {
      id: `tx-${Date.now()}`,
      productId,
      productName: prod.name,
      change: adjustment,
      previousStock,
      newStock,
      reason,
      timestamp: new Date().toISOString(),
    };
    setInventoryTransactions((prev) => [tx, ...prev]);
    showToast(`Stock for ${prod.name} updated to ${newStock} units.`);
  };

  const toggleWishlist = (productId: string) => {
    const prod = products.find((p) => p.id === productId);
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast(`Removed from your wishlist.`);
        return prev.filter((id) => id !== productId);
      } else {
        showToast(`Saved ${prod?.name || 'product'} to your wishlist!`);
        return [...prev, productId];
      }
    });
  };

  return (
    <AppContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductActive,
        toggleProductFeatured,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        cartCount,
        adminUser,
        loginAdmin,
        logoutAdmin,
        orders,
        createOrder,
        updateOrderStatus,
        cancelOrder,
        reviews,
        addReview,
        moderateReview,
        inventoryTransactions,
        adjustStock,
        promoBanners,
        updatePromoBanner,
        resetPromoBanners,
        activeView,
        setActiveView,
        selectedCategoryFilter,
        setSelectedCategoryFilter,
        searchQuery,
        setSearchQuery,
        selectedProductForModal,
        setSelectedProductForModal,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isAdminLoginOpen,
        setIsAdminLoginOpen,
        isOrderTrackerOpen,
        setIsOrderTrackerOpen,
        trackingOrderNumber,
        setTrackingOrderNumber,
        wishlist,
        toggleWishlist,
        isWishlistOpen,
        setIsWishlistOpen,
        isShadeFinderOpen,
        setIsShadeFinderOpen,
        selectedSample,
        setSelectedSample,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
