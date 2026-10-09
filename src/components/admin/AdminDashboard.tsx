import React, { useState, useMemo, useEffect } from 'react';
import {
  Package,
  Layers,
  Archive,
  ShoppingBag,
  Star,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  LogOut,
  Search,
  Filter,
  BarChart3,
  Shield,
  ArrowUpRight,
  RefreshCw,
  Eye,
  Sliders,
  Clock,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Truck,
  Check,
  AlertTriangle,
  ArrowRight,
  Zap,
  Image as ImageIcon,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product, Category, Order, OrderStatus, PromoBanner } from '../../types';
import { Logo } from '../common/Logo';

export const AdminDashboard: React.FC = () => {
  const {
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
    orders,
    updateOrderStatus,
    cancelOrder,
    reviews,
    moderateReview,
    inventoryTransactions,
    adjustStock,
    promoBanners,
    updatePromoBanner,
    resetPromoBanners,
    logoutAdmin,
    adminUser,
    setActiveView,
    showToast,
  } = useApp();

  // Active navigation tab (no django-code tab!)
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'categories' | 'inventory' | 'orders' | 'reviews' | 'banners'>('overview');

  // Time display
  const [currentTime, setCurrentTime] = useState<string>('');
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // Filter States inside tables
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryFilter, setInventoryFilter] = useState<'all' | 'low' | 'out'>('all');
  const [reviewFilter, setReviewFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Chart interactivity states
  const [chartMetric, setChartMetric] = useState<'revenue' | 'orders'>('revenue');
  const [chartRange, setChartRange] = useState<'7d' | '30d'>('7d');
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  // Modals
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [stockAdjustModalProd, setStockAdjustModalProd] = useState<Product | null>(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);
  const [editingBanner, setEditingBanner] = useState<PromoBanner | null>(null);

  // Stock Adjustment Form
  const [adjustAmount, setAdjustAmount] = useState<number>(20);
  const [adjustReason, setAdjustReason] = useState<string>('New stock received');

  // Product Form State
  const [prodForm, setProdForm] = useState({
    name: '',
    sku: '',
    subtitle: '',
    description: '',
    categoryId: categories[0]?.id || '',
    price: 28.0,
    salePrice: undefined as number | undefined,
    stock: 25,
    lowStockThreshold: 8,
    isFeatured: true,
    isBestseller: false,
    isActive: true,
    image: products[0]?.image || '',
    shadesText: '01 Rose Gold, 02 Velvet Crimson, 03 Nude Petal',
  });

  // Category Form State
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');

  // Analytics & KPIs
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.isActive).length;
  const totalStock = products.reduce((s, p) => s + p.stock, 0);
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= p.lowStockThreshold).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  const validOrders = orders.filter((o) => o.fulfillmentStatus !== 'Canceled');
  const grossSales = validOrders.reduce((s, o) => s + o.total, 0);
  const unitsSold = validOrders.reduce(
    (s, o) => s + o.items.reduce((is, it) => is + it.quantity, 0),
    0
  );
  const pendingOrders = orders.filter(
    (o) => o.fulfillmentStatus === 'Order Placed' || o.fulfillmentStatus === 'Processing'
  ).length;
  const shippedOrders = orders.filter((o) => o.fulfillmentStatus === 'Shipped').length;
  const deliveredOrders = orders.filter((o) => o.fulfillmentStatus === 'Delivered').length;
  const pendingReviewsCount = reviews.filter((r) => r.status === 'pending').length;

  // Chart datasets
  const chartData7d = [
    { label: 'Mon', revenue: 420, orders: 5, date: 'Oct 02' },
    { label: 'Tue', revenue: 680, orders: 9, date: 'Oct 03' },
    { label: 'Wed', revenue: 510, orders: 6, date: 'Oct 04' },
    { label: 'Thu', revenue: 890, orders: 12, date: 'Oct 05' },
    { label: 'Fri', revenue: 1150, orders: 16, date: 'Oct 06' },
    { label: 'Sat', revenue: 1420, orders: 21, date: 'Oct 07' },
    { label: 'Sun', revenue: 980, orders: 14, date: 'Oct 08 (Today)' },
  ];

  const chartData30d = [
    { label: 'Wk 1', revenue: 3800, orders: 48, date: 'Sep 10 - Sep 17' },
    { label: 'Wk 2', revenue: 4600, orders: 59, date: 'Sep 18 - Sep 24' },
    { label: 'Wk 3', revenue: 5200, orders: 68, date: 'Sep 25 - Oct 01' },
    { label: 'Wk 4', revenue: 6050, orders: 78, date: 'Oct 02 - Oct 08' },
  ];

  const activeChartData = chartRange === '7d' ? chartData7d : chartData30d;
  const maxChartVal = Math.max(
    ...activeChartData.map((d) => (chartMetric === 'revenue' ? d.revenue : d.orders))
  );

  // Category Sales Split
  const categorySalesShare = [
    { name: 'Face & Foundation', percent: 42, color: '#DC143C', sales: '$2,480.00' },
    { name: 'Velvet Lipsticks', percent: 28, color: '#F75270', sales: '$1,650.00' },
    { name: 'Eyeshadow Palettes', percent: 18, color: '#E28F83', sales: '$1,060.00' },
    { name: 'Glow Highlighters', percent: 12, color: '#D4A373', sales: '$710.00' },
  ];

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (productCategoryFilter !== 'all' && p.categoryId !== productCategoryFilter) return false;
        if (!productSearch.trim()) return true;
        const q = productSearch.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q)
        );
      });
  }, [products, productCategoryFilter, productSearch]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders
      .filter((o) => {
        if (orderStatusFilter !== 'all' && o.fulfillmentStatus !== orderStatusFilter) return false;
        if (!orderSearch.trim()) return true;
        const q = orderSearch.toLowerCase();
        return (
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerEmail.toLowerCase().includes(q)
        );
      });
  }, [orders, orderStatusFilter, orderSearch]);

  // Filtered Inventory
  const filteredInventory = useMemo(() => {
    return products
      .filter((p) => {
        if (inventoryFilter === 'low') return p.stock > 0 && p.stock <= p.lowStockThreshold;
        if (inventoryFilter === 'out') return p.stock === 0;
        return true;
      })
      .filter((p) => {
        if (!inventorySearch.trim()) return true;
        const q = inventorySearch.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
      });
  }, [products, inventoryFilter, inventorySearch]);

  // Filtered Reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      if (reviewFilter === 'all') return true;
      return r.status === reviewFilter;
    });
  }, [reviews, reviewFilter]);

  // Handlers
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodForm.name || !prodForm.sku) {
      showToast('Name and SKU are required.');
      return;
    }

    const category = categories.find((c) => c.id === prodForm.categoryId);
    const shades = prodForm.shadesText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((name, i) => ({
        name,
        hex: ['#DC143C', '#F75270', '#E28F83', '#B8865C', '#633B22'][i % 5],
        inStock: true,
      }));

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: prodForm.name,
        sku: prodForm.sku,
        subtitle: prodForm.subtitle,
        description: prodForm.description,
        categoryId: prodForm.categoryId,
        categoryName: category?.name || 'Cosmetics',
        price: Number(prodForm.price),
        salePrice: prodForm.salePrice ? Number(prodForm.salePrice) : undefined,
        stock: Number(prodForm.stock),
        lowStockThreshold: Number(prodForm.lowStockThreshold),
        isFeatured: prodForm.isFeatured,
        isBestseller: prodForm.isBestseller,
        isActive: prodForm.isActive,
        shades: shades.length > 0 ? shades : editingProduct.shades,
      });
      setEditingProduct(null);
    } else {
      addProduct({
        name: prodForm.name,
        slug: prodForm.name.toLowerCase().replace(/\s+/g, '-'),
        sku: prodForm.sku,
        subtitle: prodForm.subtitle,
        description: prodForm.description,
        categoryId: prodForm.categoryId,
        categoryName: category?.name || 'Cosmetics',
        price: Number(prodForm.price),
        salePrice: prodForm.salePrice ? Number(prodForm.salePrice) : undefined,
        image: prodForm.image || products[0]?.image,
        shades,
        stock: Number(prodForm.stock),
        lowStockThreshold: Number(prodForm.lowStockThreshold),
        isFeatured: prodForm.isFeatured,
        isBestseller: prodForm.isBestseller,
        isActive: prodForm.isActive,
      });
      setIsAddProductOpen(false);
    }
  };

  const openEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProdForm({
      name: prod.name,
      sku: prod.sku,
      subtitle: prod.subtitle,
      description: prod.description,
      categoryId: prod.categoryId,
      price: prod.price,
      salePrice: prod.salePrice,
      stock: prod.stock,
      lowStockThreshold: prod.lowStockThreshold,
      isFeatured: prod.isFeatured,
      isBestseller: prod.isBestseller,
      isActive: prod.isActive,
      image: prod.image,
      shadesText: prod.shades.map((s) => s.name).join(', '),
    });
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName) return;
    addCategory({
      name: catName,
      slug: catName.toLowerCase().replace(/\s+/g, '-'),
      description: catDesc || 'Premium cosmetic category',
      displayOrder: categories.length + 1,
      isActive: true,
    });
    setCatName('');
    setCatDesc('');
    setIsAddCategoryOpen(false);
  };

  const handleStockAdjustmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockAdjustModalProd) return;
    adjustStock(stockAdjustModalProd.id, Number(adjustAmount), adjustReason);
    setStockAdjustModalProd(null);
  };

  // Quick next stage order advancement
  const handleAdvanceOrderStatus = (order: Order) => {
    const nextMap: Record<OrderStatus, OrderStatus> = {
      'Pending Payment': 'Payment Confirmed',
      'Payment Confirmed': 'Order Placed',
      'Order Placed': 'Processing',
      Processing: 'Packed',
      Packed: 'Shipped',
      Shipped: 'Out for Delivery',
      'Out for Delivery': 'Delivered',
      Delivered: 'Delivered',
      Canceled: 'Canceled',
    };
    const nextStatus = nextMap[order.fulfillmentStatus];
    const generatedTracking =
      nextStatus === 'Shipped' && !order.trackingNumber
        ? `GTX${Math.floor(100000000 + Math.random() * 900000000)}US`
        : order.trackingNumber;

    updateOrderStatus(order.id, nextStatus, generatedTracking, order.carrier || 'DHL Beauty Express');
  };

  return (
    <div className="min-h-screen bg-[#F5EFEB] text-[#242220] flex flex-col font-sans selection:bg-[#DC143C]/20">
      
      {/* Top Luxury Navigation Header */}
      <header className="bg-[#181615] text-white border-b border-[#2E2926] sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-4">
          <Logo size="sm" light={true} showText={true} />
          <div className="hidden md:flex items-center gap-2 pl-4 border-l border-[#332D2A]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-semibold tracking-wider uppercase text-[#EAD8CA]">
              Atelier Command Center
            </span>
            <span className="text-xs text-[#8A7973] font-mono tabular-nums">
              • {currentTime}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Storefront Link */}
          <button
            onClick={() => setActiveView('home')}
            className="px-3.5 py-1.5 rounded-full bg-[#26211F] hover:bg-[#38312D] text-xs font-semibold text-[#FDEBD0] flex items-center gap-1.5 transition-all border border-[#3E3633] hover:border-[#DC143C]/50 shadow-xs"
          >
            <Eye className="w-3.5 h-3.5 text-[#F75270]" />
            <span className="hidden sm:inline">Storefront</span>
          </button>

          {/* Admin Profile & Logout */}
          <div className="flex items-center gap-2.5 pl-3 border-l border-[#332D2A]">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#DC143C] to-[#F75270] flex items-center justify-center text-white text-xs font-bold shadow-xs">
              AD
            </div>
            <div className="hidden xl:flex flex-col text-left leading-none">
              <span className="text-xs font-bold text-stone-200">Brand Director</span>
              <span className="text-[10px] text-[#A89891]">admin@glossytheory.com</span>
            </div>
            <button
              onClick={logoutAdmin}
              className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              title="Sign Out of Atelier"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6">
        
        {/* Interactive Sidebar Navigation */}
        <aside className="lg:w-64 shrink-0 space-y-1.5 bg-white rounded-3xl p-3.5 border border-[#E8DAD0] shadow-sm self-start">
          
          <div className="px-3 pt-2 pb-3 text-[10px] font-bold uppercase tracking-wider text-[#8A7770]">
            Management Modules
          </div>

          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all ${
              activeTab === 'overview'
                ? 'bg-[#DC143C] text-white shadow-md'
                : 'text-stone-700 hover:bg-[#FAF3EB]'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <BarChart3 className="w-4 h-4" />
              <span>Overview & KPIs</span>
            </span>
            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${activeTab === 'overview' ? 'rotate-90' : 'opacity-40'}`} />
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all ${
              activeTab === 'products'
                ? 'bg-[#DC143C] text-white shadow-md'
                : 'text-stone-700 hover:bg-[#FAF3EB]'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Package className="w-4 h-4" />
              <span>Cosmetics Catalog</span>
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeTab === 'products' ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-700'}`}>
              {totalProducts}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all ${
              activeTab === 'categories'
                ? 'bg-[#DC143C] text-white shadow-md'
                : 'text-stone-700 hover:bg-[#FAF3EB]'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Layers className="w-4 h-4" />
              <span>Departments</span>
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeTab === 'categories' ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-700'}`}>
              {categories.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all ${
              activeTab === 'inventory'
                ? 'bg-[#DC143C] text-white shadow-md'
                : 'text-stone-700 hover:bg-[#FAF3EB]'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Archive className="w-4 h-4" />
              <span>Stock & Warehouse</span>
            </span>
            {lowStockCount > 0 ? (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white animate-pulse">
                {lowStockCount} alert
              </span>
            ) : (
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeTab === 'inventory' ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-700'}`}>
                {totalStock}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all ${
              activeTab === 'orders'
                ? 'bg-[#DC143C] text-white shadow-md'
                : 'text-stone-700 hover:bg-[#FAF3EB]'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <ShoppingBag className="w-4 h-4" />
              <span>Orders & Shipping</span>
            </span>
            {pendingOrders > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#DC143C] text-white">
                {pendingOrders} new
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all ${
              activeTab === 'reviews'
                ? 'bg-[#DC143C] text-white shadow-md'
                : 'text-stone-700 hover:bg-[#FAF3EB]'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Star className="w-4 h-4" />
              <span>Review Moderation</span>
            </span>
            {pendingReviewsCount > 0 ? (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-600 text-white">
                {pendingReviewsCount}
              </span>
            ) : (
              <span className="text-[10px] text-stone-400">clean</span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('banners')}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all ${
              activeTab === 'banners'
                ? 'bg-[#DC143C] text-white shadow-md'
                : 'text-stone-700 hover:bg-[#FAF3EB]'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <ImageIcon className="w-4 h-4" />
              <span>Hero Banners</span>
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeTab === 'banners' ? 'bg-white/20 text-white' : 'bg-[#FAF0E6] text-[#DC143C]'}`}>
              {promoBanners.length}
            </span>
          </button>

          {/* Live System Status Widget in Sidebar */}
          <div className="pt-4 mt-3 border-t border-[#F2E5DC] px-2 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-[#8C7A72]">
              <span>Payment Engine</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" /> Live
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#8C7A72]">
              <span>Inventory Sync</span>
              <span className="text-emerald-700 font-semibold">100% Synced</span>
            </div>
          </div>

        </aside>

        {/* Workspace Canvas */}
        <main className="flex-1 space-y-6">
          
          {/* TAB 1: OVERVIEW & INTERACTIVE KPIS */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Interactive KPI Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                
                {/* KPI 1: Gross Sales */}
                <div
                  onClick={() => setChartMetric('revenue')}
                  className="bg-white p-5 rounded-3xl border border-[#EDE0D4] hover:border-[#DC143C]/40 shadow-xs hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                      Gross Revenue
                    </span>
                    <span className="w-7 h-7 rounded-full bg-[#FAF0E6] text-[#DC143C] flex items-center justify-center group-hover:bg-[#DC143C] group-hover:text-white transition-colors">
                      <DollarSign className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-sans text-stone-900 tabular-nums">
                    ${grossSales.toFixed(2)}
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100 text-[11px]">
                    <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                      <ArrowUpRight className="w-3.5 h-3.5" /> +18.4%
                    </span>
                    <span className="text-stone-400">Past 7 days</span>
                  </div>
                </div>

                {/* KPI 2: Orders Processing */}
                <div
                  onClick={() => {
                    setActiveTab('orders');
                    setOrderStatusFilter('Processing');
                  }}
                  className="bg-white p-5 rounded-3xl border border-[#EDE0D4] hover:border-[#DC143C]/40 shadow-xs hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                      Orders Processing
                    </span>
                    <span className="w-7 h-7 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                      <Clock className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-sans text-amber-800 tabular-nums">
                    {pendingOrders}
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100 text-[11px]">
                    <span className="text-stone-600 font-medium">Awaiting dispatch</span>
                    <span className="text-[#DC143C] font-semibold group-hover:underline">
                      Manage →
                    </span>
                  </div>
                </div>

                {/* KPI 3: Units Sold */}
                <div
                  onClick={() => setChartMetric('orders')}
                  className="bg-white p-5 rounded-3xl border border-[#EDE0D4] hover:border-[#DC143C]/40 shadow-xs hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                      Units Dispatched
                    </span>
                    <span className="w-7 h-7 rounded-full bg-[#FAF0E6] text-[#DC143C] flex items-center justify-center group-hover:bg-[#DC143C] group-hover:text-white transition-colors">
                      <ShoppingBag className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-sans text-stone-900 tabular-nums">
                    {unitsSold}
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100 text-[11px]">
                    <span className="text-stone-500">{validOrders.length} complete orders</span>
                    <span className="text-emerald-700 font-semibold">+12 units today</span>
                  </div>
                </div>

                {/* KPI 4: Low Stock Warnings */}
                <div
                  onClick={() => {
                    setActiveTab('inventory');
                    setInventoryFilter('low');
                  }}
                  className="bg-white p-5 rounded-3xl border border-[#EDE0D4] hover:border-amber-400 shadow-xs hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                      Low Stock Alerts
                    </span>
                    <span className="w-7 h-7 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-colors">
                      <AlertTriangle className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-sans text-rose-700 tabular-nums">
                    {lowStockCount}
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100 text-[11px]">
                    <span className="text-stone-500">Need restocking</span>
                    <span className="text-[#DC143C] font-semibold group-hover:underline">
                      Restock →
                    </span>
                  </div>
                </div>

              </div>

              {/* Dynamic Interactive Chart & Category Split */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left: Interactive Sales Histogram */}
                <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-7 border border-[#EDE0D4] shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif text-xl font-semibold text-stone-900">
                          Commercial Velocity
                        </h3>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FAF0E6] text-[#DC143C] px-2.5 py-0.5 rounded-full">
                          Live Data
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">
                        {chartMetric === 'revenue'
                          ? 'Gross revenue generated across confirmed orders'
                          : 'Order volume transacted in this period'}
                      </p>
                    </div>

                    {/* Chart Controls */}
                    <div className="flex items-center gap-2">
                      <div className="bg-[#FAF6F0] p-1 rounded-full border border-[#E8DCD2] flex text-[11px] font-semibold">
                        <button
                          onClick={() => setChartMetric('revenue')}
                          className={`px-3 py-1 rounded-full transition-colors ${
                            chartMetric === 'revenue' ? 'bg-[#DC143C] text-white shadow-2xs' : 'text-stone-600'
                          }`}
                        >
                          Revenue ($)
                        </button>
                        <button
                          onClick={() => setChartMetric('orders')}
                          className={`px-3 py-1 rounded-full transition-colors ${
                            chartMetric === 'orders' ? 'bg-[#DC143C] text-white shadow-2xs' : 'text-stone-600'
                          }`}
                        >
                          Orders (#)
                        </button>
                      </div>

                      <div className="bg-[#FAF6F0] p-1 rounded-full border border-[#E8DCD2] flex text-[11px] font-semibold">
                        <button
                          onClick={() => setChartRange('7d')}
                          className={`px-2.5 py-1 rounded-full transition-colors ${
                            chartRange === '7d' ? 'bg-stone-800 text-white shadow-2xs' : 'text-stone-600'
                          }`}
                        >
                          7D
                        </button>
                        <button
                          onClick={() => setChartRange('30d')}
                          className={`px-2.5 py-1 rounded-full transition-colors ${
                            chartRange === '30d' ? 'bg-stone-800 text-white shadow-2xs' : 'text-stone-600'
                          }`}
                        >
                          30D
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Histogram graphic */}
                  <div className="pt-4">
                    <div className="h-56 flex items-end gap-3 sm:gap-5 px-2 border-b border-stone-200">
                      {activeChartData.map((item, idx) => {
                        const val = chartMetric === 'revenue' ? item.revenue : item.orders;
                        const heightPct = Math.max(15, (val / maxChartVal) * 100);
                        const isHovered = hoveredBarIndex === idx;

                        return (
                          <div
                            key={idx}
                            onMouseEnter={() => setHoveredBarIndex(idx)}
                            onMouseLeave={() => setHoveredBarIndex(null)}
                            className="flex-1 flex flex-col items-center gap-2 relative cursor-pointer group"
                          >
                            {/* Hover Value Badge */}
                            {isHovered && (
                              <div className="absolute -top-12 z-20 bg-[#1C1A19] text-white px-2.5 py-1.5 rounded-xl text-center shadow-lg whitespace-nowrap animate-fade-in pointer-events-none">
                                <p className="text-[10px] text-stone-400 leading-none">{item.date}</p>
                                <p className="text-xs font-bold font-mono text-[#FDEBD0] leading-none mt-1">
                                  {chartMetric === 'revenue' ? `$${item.revenue}` : `${item.orders} orders`}
                                </p>
                              </div>
                            )}

                            {/* Bar Column */}
                            <div className="w-full h-full flex items-end justify-center">
                              <div
                                style={{ height: `${heightPct}%` }}
                                className={`w-full max-w-[48px] rounded-t-xl transition-all duration-300 relative overflow-hidden ${
                                  isHovered
                                    ? 'bg-[#DC143C] shadow-md scale-y-105'
                                    : 'bg-gradient-to-t from-[#F7CAC9] to-[#F75270]/70'
                                }`}
                              >
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </div>

                            {/* Label */}
                            <span className={`text-[11px] font-medium transition-colors ${isHovered ? 'text-[#DC143C] font-bold' : 'text-stone-500'}`}>
                              {item.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-stone-400 pt-3">
                      <span>Baseline: $0.00</span>
                      <span>Peak Period Velocity: ${maxChartVal}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Category Revenue Share */}
                <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-7 border border-[#EDE0D4] shadow-xs flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-stone-900">
                      Category Revenue Share
                    </h3>
                    <p className="text-xs text-stone-500">
                      Breakdown of customer sales volume by department
                    </p>
                  </div>

                  <div className="space-y-4">
                    {categorySalesShare.map((cat, i) => (
                      <div key={i} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-stone-800">{cat.name}</span>
                          <span className="font-mono font-bold text-stone-900">{cat.sales} ({cat.percent}%)</span>
                        </div>
                        <div className="w-full bg-[#FAF3EC] h-2 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${cat.percent}%`, backgroundColor: cat.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-[#FAF6F0] rounded-2xl border border-[#EDE0D4] flex items-center justify-between text-xs">
                    <span className="text-stone-600 font-medium">Top Performing Item</span>
                    <span className="font-bold text-[#DC143C]">Radiant Foundation</span>
                  </div>
                </div>

              </div>

              {/* Quick Actions & Recent Orders Table */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EDE0D4] shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-stone-900">
                      Live Customer Orders
                    </h3>
                    <p className="text-xs text-stone-500">
                      Real-time queue of transactions requiring fulfillment attention
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-semibold text-[#DC143C] hover:underline flex items-center gap-1"
                  >
                    <span>Open Full Orders Suite ({orders.length})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#F0E4D8] text-stone-500 font-semibold">
                        <th className="py-2.5">Order</th>
                        <th className="py-2.5">Client</th>
                        <th className="py-2.5">Items</th>
                        <th className="py-2.5">Total</th>
                        <th className="py-2.5">Status</th>
                        <th className="py-2.5 text-right">Quick Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {orders.slice(0, 4).map((ord) => (
                        <tr key={ord.id} className="hover:bg-stone-50/80 transition-colors">
                          <td className="py-3 font-mono font-bold text-stone-900">
                            #{ord.orderNumber}
                          </td>
                          <td className="py-3">
                            <span className="font-semibold text-stone-800">{ord.customerName}</span>
                            <span className="text-[10px] text-stone-400 block">{ord.customerEmail}</span>
                          </td>
                          <td className="py-3 text-stone-600">
                            {ord.items.reduce((s, it) => s + it.quantity, 0)} units
                          </td>
                          <td className="py-3 font-bold font-sans tabular-nums text-stone-900">
                            ${ord.total.toFixed(2)}
                          </td>
                          <td className="py-3">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                ord.fulfillmentStatus === 'Delivered'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : ord.fulfillmentStatus === 'Shipped'
                                  ? 'bg-blue-100 text-blue-800'
                                  : ord.fulfillmentStatus === 'Canceled'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {ord.fulfillmentStatus}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => setSelectedOrderDetails(ord)}
                              className="px-3 py-1 bg-stone-100 hover:bg-[#FAF0E6] hover:text-[#DC143C] rounded-full text-xs font-semibold text-stone-700 transition-colors"
                            >
                              Inspect Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: PRODUCTS CATALOG */}
          {activeTab === 'products' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EDE0D4] shadow-xs space-y-5">
                
                {/* Header & Add Button */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="font-serif text-2xl font-semibold text-stone-900">
                      Cosmetics Catalog ({products.length})
                    </h3>
                    <p className="text-xs text-stone-500">
                      Manage formulation pricing, shade swatches, active status, and homepage spotlights.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setEditingProduct(null);
                      setProdForm({
                        name: '',
                        sku: `GT-PRD-00${products.length + 1}`,
                        subtitle: 'Luminous • Clean Formula',
                        description: 'A bespoke cosmetic formulation enriched with active botanicals.',
                        categoryId: categories[0]?.id || '',
                        price: 28.0,
                        salePrice: undefined,
                        stock: 30,
                        lowStockThreshold: 8,
                        isFeatured: true,
                        isBestseller: false,
                        isActive: true,
                        image: products[0]?.image || '',
                        shadesText: '01 Rose Gold, 02 Velvet Crimson',
                      });
                      setIsAddProductOpen(true);
                    }}
                    className="px-5 py-2.5 bg-[#DC143C] hover:bg-[#B01030] text-white text-xs font-semibold rounded-full flex items-center gap-2 shadow-sm transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Formulation</span>
                  </button>
                </div>

                {/* Search & Category Filter Toolbar */}
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pt-2">
                  <div className="relative w-full sm:w-72">
                    <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search product name or SKU..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-xs bg-[#FAF7F2] border border-[#E0D0C4] rounded-full focus:outline-none focus:ring-1 focus:ring-[#DC143C]"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <select
                      value={productCategoryFilter}
                      onChange={(e) => setProductCategoryFilter(e.target.value)}
                      className="bg-[#FAF7F2] border border-[#E0D0C4] rounded-full px-3 py-2 text-xs font-medium text-stone-800 focus:outline-none"
                    >
                      <option value="all">All Departments</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#F0E4D8] text-stone-500 font-semibold">
                        <th className="py-3">Formulation</th>
                        <th className="py-3">SKU</th>
                        <th className="py-3">Department</th>
                        <th className="py-3">Price</th>
                        <th className="py-3">Stock Units</th>
                        <th className="py-3">Spotlight</th>
                        <th className="py-3">Status</th>
                        <th className="py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-stone-50/80 transition-colors">
                          <td className="py-3.5 flex items-center gap-3">
                            <img
                              src={p.image}
                              alt=""
                              className="w-11 h-11 object-cover rounded-xl bg-stone-100 border border-stone-200 shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <p className="font-serif text-sm font-semibold text-stone-900">{p.name}</p>
                              <div className="flex items-center gap-1.5 mt-1">
                                {p.shades.slice(0, 3).map((sh, idx) => (
                                  <span
                                    key={idx}
                                    title={sh.name}
                                    className="w-2.5 h-2.5 rounded-full border border-stone-300"
                                    style={{ backgroundColor: sh.hex }}
                                  />
                                ))}
                                {p.shades.length > 3 && (
                                  <span className="text-[10px] text-stone-400 font-mono">+{p.shades.length - 3}</span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 font-mono text-[11px] text-stone-600">{p.sku}</td>
                          <td className="py-3 text-stone-700 font-medium">{p.categoryName}</td>
                          <td className="py-3 font-bold text-stone-900 tabular-nums">
                            ${p.price.toFixed(2)}
                          </td>
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  p.stock === 0
                                    ? 'bg-rose-100 text-rose-800'
                                    : p.stock <= p.lowStockThreshold
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-emerald-100 text-emerald-800'
                                }`}
                              >
                                {p.stock} units
                              </span>
                              {/* Quick in-line stepper */}
                              <div className="flex items-center border border-stone-200 rounded-md bg-white">
                                <button
                                  onClick={() => adjustStock(p.id, -1, 'Quick reduction from table')}
                                  disabled={p.stock <= 0}
                                  className="px-1.5 py-0.5 hover:bg-stone-100 text-stone-600 disabled:opacity-30"
                                  title="Reduce 1"
                                >
                                  -
                                </button>
                                <button
                                  onClick={() => adjustStock(p.id, 5, 'Quick intake from table')}
                                  className="px-1.5 py-0.5 hover:bg-stone-100 text-[#DC143C] font-bold"
                                  title="Add 5"
                                >
                                  +5
                                </button>
                              </div>
                            </div>
                          </td>
                          <td className="py-3">
                            <button
                              onClick={() => toggleProductFeatured(p.id)}
                              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full transition-colors ${
                                p.isFeatured
                                  ? 'bg-[#FDEBD0] text-[#933D2D] border border-[#F5D8B8]'
                                  : 'text-stone-400 hover:text-stone-700'
                              }`}
                            >
                              {p.isFeatured ? '★ Featured' : '☆ Standard'}
                            </button>
                          </td>
                          <td className="py-3">
                            <button
                              onClick={() => toggleProductActive(p.id)}
                              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full transition-colors ${
                                p.isActive
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-stone-100 text-stone-500'
                              }`}
                            >
                              {p.isActive ? 'Active' : 'Archived'}
                            </button>
                          </td>
                          <td className="py-3 text-right space-x-1.5">
                            <button
                              onClick={() => openEditProduct(p)}
                              className="p-1.5 rounded-lg hover:bg-[#FAF0E6] text-stone-600 hover:text-[#DC143C] transition-colors"
                              title="Edit product"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteProduct(p.id)}
                              className="p-1.5 rounded-lg hover:bg-rose-50 text-stone-400 hover:text-rose-600 transition-colors"
                              title="Delete product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: CATEGORIES */}
          {activeTab === 'categories' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EDE0D4] shadow-xs space-y-5">
                
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-serif text-2xl font-semibold text-stone-900">
                      Product Departments ({categories.length})
                    </h3>
                    <p className="text-xs text-stone-500">
                      Organize store aisles and dynamic customer navigation filters.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsAddCategoryOpen(true)}
                    className="px-5 py-2.5 bg-[#DC143C] hover:bg-[#B01030] text-white text-xs font-semibold rounded-full flex items-center gap-2 shadow-sm transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Department</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {categories.map((c) => {
                    const count = products.filter((p) => p.categoryId === c.id).length;
                    return (
                      <div
                        key={c.id}
                        className="p-6 rounded-3xl border border-[#EDE0D4] bg-[#FAF8F5] flex flex-col justify-between space-y-4 hover:border-[#DC143C]/40 transition-all group"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-serif text-lg font-semibold text-stone-900 group-hover:text-[#DC143C] transition-colors">
                              {c.name}
                            </h4>
                            <span className="text-[10px] font-bold px-2.5 py-0.5 bg-white border border-[#E8DCD2] rounded-full text-stone-700">
                              {count} Items
                            </span>
                          </div>
                          <p className="text-xs text-stone-500 leading-relaxed">
                            {c.description}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-[#EDE0D4] flex items-center justify-between text-xs">
                          <span className="font-mono text-[11px] text-[#DC143C] font-medium">
                            /{c.slug}
                          </span>
                          <button
                            onClick={() => deleteCategory(c.id)}
                            className="text-stone-400 hover:text-rose-600 p-1"
                            title="Delete category"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            </div>
          )}

          {/* TAB 4: INVENTORY & STOCK AUDITING */}
          {activeTab === 'inventory' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EDE0D4] shadow-xs space-y-5">
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h3 className="font-serif text-2xl font-semibold text-stone-900">
                      Warehouse Stock Ledger
                    </h3>
                    <p className="text-xs text-stone-500">
                      Live audit logging with inventory transaction tracking.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setInventoryFilter('all')}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                        inventoryFilter === 'all' ? 'bg-[#DC143C] text-white' : 'bg-[#FAF4EC] text-stone-700'
                      }`}
                    >
                      All Items ({products.length})
                    </button>
                    <button
                      onClick={() => setInventoryFilter('low')}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                        inventoryFilter === 'low' ? 'bg-amber-600 text-white' : 'bg-[#FAF4EC] text-stone-700'
                      }`}
                    >
                      Low Stock ({lowStockCount})
                    </button>
                    <button
                      onClick={() => setInventoryFilter('out')}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                        inventoryFilter === 'out' ? 'bg-rose-700 text-white' : 'bg-[#FAF4EC] text-stone-700'
                      }`}
                    >
                      Out of Stock ({outOfStockCount})
                    </button>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#F0E4D8] text-stone-500 font-semibold">
                        <th className="py-3">Formulation Name</th>
                        <th className="py-3">SKU</th>
                        <th className="py-3">Units in Stock</th>
                        <th className="py-3">Reorder Point</th>
                        <th className="py-3">Health Status</th>
                        <th className="py-3 text-right">Adjust Stock</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filteredInventory.map((p) => (
                        <tr key={p.id} className="hover:bg-stone-50/80 transition-colors">
                          <td className="py-3 font-semibold text-stone-900">{p.name}</td>
                          <td className="py-3 font-mono text-[11px] text-stone-500">{p.sku}</td>
                          <td className="py-3 font-bold tabular-nums text-sm text-stone-900">{p.stock}</td>
                          <td className="py-3 text-stone-500">{p.lowStockThreshold} units</td>
                          <td className="py-3">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                p.stock === 0
                                  ? 'bg-rose-100 text-rose-800'
                                  : p.stock <= p.lowStockThreshold
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {p.stock === 0 ? 'Depleted' : p.stock <= p.lowStockThreshold ? 'Low Stock Alert' : 'Healthy Buffer'}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => {
                                setStockAdjustModalProd(p);
                                setAdjustAmount(25);
                                setAdjustReason('New stock received');
                              }}
                              className="px-3 py-1 bg-[#FAF0E6] hover:bg-[#DC143C] text-[#DC143C] hover:text-white rounded-full text-xs font-semibold transition-colors"
                            >
                              Stock Intake ±
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Audit trail */}
                <div className="pt-6 border-t border-[#F0E4D8]">
                  <h4 className="font-serif text-base font-semibold text-stone-900 mb-3">
                    Recent Inventory Adjustment Ledger
                  </h4>
                  <div className="max-h-56 overflow-y-auto space-y-2">
                    {inventoryTransactions.slice(0, 8).map((tx) => (
                      <div
                        key={tx.id}
                        className="p-3 bg-[#FAF8F5] rounded-2xl border border-[#EDE0D4] flex items-center justify-between text-xs"
                      >
                        <div>
                          <p className="font-semibold text-stone-800">{tx.productName}</p>
                          <p className="text-[11px] text-stone-500">
                            {tx.reason} • {new Date(tx.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`font-mono font-bold ${
                              tx.change > 0 ? 'text-emerald-700' : 'text-rose-700'
                            }`}
                          >
                            {tx.change > 0 ? `+${tx.change}` : tx.change} units
                          </span>
                          <p className="text-[10px] text-stone-400">Balance: {tx.newStock}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 5: ORDERS & FULFILLMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EDE0D4] shadow-xs space-y-5">
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h3 className="font-serif text-2xl font-semibold text-stone-900">
                      Orders & Logistics ({orders.length})
                    </h3>
                    <p className="text-xs text-stone-500">
                      Dispatch management, tracking assignment, and workflow transitions.
                    </p>
                  </div>

                  {/* Filter tabs */}
                  <div className="flex flex-wrap gap-1.5">
                    {['all', 'Order Placed', 'Processing', 'Packed', 'Shipped', 'Delivered'].map((st) => (
                      <button
                        key={st}
                        onClick={() => setOrderStatusFilter(st)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                          orderStatusFilter === st
                            ? 'bg-[#DC143C] text-white shadow-2xs'
                            : 'bg-[#FAF4EC] text-stone-700 hover:bg-[#F2E5DC]'
                        }`}
                      >
                        {st === 'all' ? 'All Orders' : st}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#F0E4D8] text-stone-500 font-semibold">
                        <th className="py-3">Order Number</th>
                        <th className="py-3">Date</th>
                        <th className="py-3">Client</th>
                        <th className="py-3">Total</th>
                        <th className="py-3">Payment</th>
                        <th className="py-3">Fulfillment Status</th>
                        <th className="py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filteredOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-stone-50/80 transition-colors">
                          <td className="py-3.5 font-mono font-bold text-[#DC143C]">
                            #{ord.orderNumber}
                          </td>
                          <td className="py-3 text-stone-500">
                            {new Date(ord.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3">
                            <p className="font-semibold text-stone-900">{ord.customerName}</p>
                            <p className="text-[10px] text-stone-400">{ord.shippingAddress.city}</p>
                          </td>
                          <td className="py-3 font-bold font-sans tabular-nums text-stone-900">
                            ${ord.total.toFixed(2)}
                          </td>
                          <td className="py-3">
                            <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[10px]">
                              {ord.paymentStatus}
                            </span>
                          </td>
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <select
                                value={ord.fulfillmentStatus}
                                onChange={(e) =>
                                  updateOrderStatus(ord.id, e.target.value as OrderStatus)
                                }
                                className="text-xs font-semibold bg-[#FAF8F5] border border-stone-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#DC143C]"
                              >
                                <option value="Order Placed">Order Placed</option>
                                <option value="Payment Confirmed">Payment Confirmed</option>
                                <option value="Processing">Processing</option>
                                <option value="Packed">Packed</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Out for Delivery">Out for Delivery</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Canceled">Canceled</option>
                              </select>

                              {ord.fulfillmentStatus !== 'Delivered' && ord.fulfillmentStatus !== 'Canceled' && (
                                <button
                                  onClick={() => handleAdvanceOrderStatus(ord)}
                                  className="px-2 py-1 bg-stone-100 hover:bg-[#FAF0E6] hover:text-[#DC143C] text-[10px] font-bold rounded-md"
                                  title="Advance to next fulfillment stage"
                                >
                                  Advance ➔
                                </button>
                              )}
                            </div>
                          </td>
                          <td className="py-3 text-right space-x-2">
                            <button
                              onClick={() => setSelectedOrderDetails(ord)}
                              className="text-xs font-semibold text-[#DC143C] hover:underline"
                            >
                              Details
                            </button>
                            {ord.fulfillmentStatus !== 'Canceled' && (
                              <button
                                onClick={() => cancelOrder(ord.id)}
                                className="text-xs text-stone-400 hover:text-rose-600"
                                title="Cancel & Refund order"
                              >
                                Cancel
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            </div>
          )}

          {/* TAB 6: REVIEW MODERATION */}
          {activeTab === 'reviews' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EDE0D4] shadow-xs space-y-5">
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h3 className="font-serif text-2xl font-semibold text-stone-900">
                      Editorial Review Moderation
                    </h3>
                    <p className="text-xs text-stone-500">
                      Review customer feedback. Approved submissions publish immediately to public product showcases.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setReviewFilter('all')}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                        reviewFilter === 'all' ? 'bg-[#DC143C] text-white' : 'bg-[#FAF4EC] text-stone-700'
                      }`}
                    >
                      All ({reviews.length})
                    </button>
                    <button
                      onClick={() => setReviewFilter('pending')}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                        reviewFilter === 'pending' ? 'bg-amber-600 text-white' : 'bg-[#FAF4EC] text-stone-700'
                      }`}
                    >
                      Pending ({reviews.filter((r) => r.status === 'pending').length})
                    </button>
                    <button
                      onClick={() => setReviewFilter('approved')}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                        reviewFilter === 'approved' ? 'bg-emerald-700 text-white' : 'bg-[#FAF4EC] text-stone-700'
                      }`}
                    >
                      Approved ({reviews.filter((r) => r.status === 'approved').length})
                    </button>
                  </div>
                </div>

                <div className="space-y-3.5">
                  {filteredReviews.map((r) => (
                    <div
                      key={r.id}
                      className="p-5 rounded-3xl border border-[#EDE0D4] bg-[#FAF8F5] space-y-3 hover:border-[#DC143C]/40 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-stone-900">
                              {r.authorName}
                            </span>
                            <span className="text-xs text-stone-500">• Product:</span>
                            <span className="font-semibold text-xs text-[#DC143C]">
                              {r.productName}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-1">
                            <div className="flex text-[#DC143C]">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3.5 h-3.5 ${
                                    i < r.rating ? 'fill-[#DC143C]' : 'text-stone-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-[11px] text-stone-400">
                              {new Date(r.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              r.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : r.status === 'rejected'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {r.status}
                          </span>

                          <button
                            onClick={() => moderateReview(r.id, 'approved')}
                            className="p-1.5 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-200 transition-colors"
                            title="Approve Review"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => moderateReview(r.id, 'rejected')}
                            className="p-1.5 rounded-full bg-rose-50 text-rose-700 hover:bg-rose-200 transition-colors"
                            title="Reject Review"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-stone-700 italic bg-white p-3.5 rounded-2xl border border-stone-200">
                        "{r.comment}"
                      </p>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          )}

          {/* TAB 7: HERO PROMOTIONAL BANNERS */}
          {activeTab === 'banners' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EDE0D4] shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h3 className="font-serif text-2xl font-semibold text-stone-900">
                      Promotional Hero Banners & Slider Configuration
                    </h3>
                    <p className="text-xs text-stone-500">
                      Customize headlines, promotional labels, supporting descriptions, and configurable discount badges displayed in the luxury storefront hero slider.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={resetPromoBanners}
                      className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Restore Defaults</span>
                    </button>
                  </div>
                </div>

                {/* Banners Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                  {promoBanners.map((banner, index) => (
                    <div
                      key={banner.id}
                      className={`rounded-2xl border transition-all p-5 space-y-4 ${
                        banner.active
                          ? 'border-[#EDE0D4] bg-[#FAF8F5]'
                          : 'border-stone-200 bg-stone-50 opacity-60'
                      }`}
                    >
                      {/* Banner Image Preview */}
                      <div className="relative rounded-xl overflow-hidden aspect-[16/9] border border-stone-200 bg-stone-100">
                        <img
                          src={banner.image}
                          alt={banner.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold tracking-wider uppercase">
                          Banner {index + 1}
                        </div>
                        {banner.discountBadge && (
                          <div className="absolute bottom-2 left-2 right-2 px-2.5 py-1 rounded-lg bg-[#DC143C]/90 text-white text-[10px] font-semibold truncate">
                            {banner.discountBadge}
                          </div>
                        )}
                      </div>

                      {/* Banner Information */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#DC143C]">
                            {banner.label || 'PROMOTIONAL BANNER'}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${banner.active ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'}`}>
                            {banner.active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <h4 className="font-serif text-lg font-bold text-stone-900 leading-snug">
                          {banner.title}
                        </h4>
                        <p className="text-xs text-stone-600 line-clamp-2">
                          {banner.description}
                        </p>
                        <div className="pt-2 flex items-center justify-between text-xs text-stone-500 border-t border-stone-200/80">
                          <span>
                            CTA Button: <strong className="text-stone-800">{banner.ctaText}</strong> ({banner.ctaTarget})
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-2 flex items-center justify-between border-t border-stone-200">
                        <button
                          type="button"
                          onClick={() =>
                            updatePromoBanner(banner.id, { active: !banner.active })
                          }
                          className="text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
                        >
                          {banner.active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingBanner({ ...banner })}
                          className="px-3.5 py-1.5 bg-[#DC143C] hover:bg-[#B01030] text-white rounded-full text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit Banner</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* MODAL: ADD / EDIT PRODUCT */}
      {(isAddProductOpen || editingProduct) && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-[#EDE0D4] shadow-2xl relative animate-scale-in">
            <h3 className="font-serif text-2xl font-semibold text-stone-900 mb-4">
              {editingProduct ? 'Edit Formulation Details' : 'Formulate New Product'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block text-stone-700 mb-1">Product Title</label>
                  <input
                    type="text"
                    value={prodForm.name}
                    onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                    required
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#DC143C]"
                  />
                </div>
                <div>
                  <label className="font-semibold block text-stone-700 mb-1">SKU Identifier</label>
                  <input
                    type="text"
                    value={prodForm.sku}
                    onChange={(e) => setProdForm({ ...prodForm, sku: e.target.value })}
                    required
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#DC143C]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block text-stone-700 mb-1">Subtitle / Key Characteristic</label>
                <input
                  type="text"
                  value={prodForm.subtitle}
                  onChange={(e) => setProdForm({ ...prodForm, subtitle: e.target.value })}
                  placeholder="Lightweight • Long Lasting"
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#DC143C]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold block text-stone-700 mb-1">Department</label>
                  <select
                    value={prodForm.categoryId}
                    onChange={(e) => setProdForm({ ...prodForm, categoryId: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold block text-stone-700 mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={prodForm.price}
                    onChange={(e) => setProdForm({ ...prodForm, price: Number(e.target.value) })}
                    required
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold block text-stone-700 mb-1">Initial Stock</label>
                  <input
                    type="number"
                    value={prodForm.stock}
                    onChange={(e) => setProdForm({ ...prodForm, stock: Number(e.target.value) })}
                    required
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block text-stone-700 mb-1">
                  Shade Variants (Separated by comma)
                </label>
                <input
                  type="text"
                  value={prodForm.shadesText}
                  onChange={(e) => setProdForm({ ...prodForm, shadesText: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold block text-stone-700 mb-1">Formula Description</label>
                <textarea
                  value={prodForm.description}
                  onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="flex gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodForm.isFeatured}
                    onChange={(e) => setProdForm({ ...prodForm, isFeatured: e.target.checked })}
                    className="accent-[#DC143C]"
                  />
                  <span>Feature on Homepage Showcase</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodForm.isBestseller}
                    onChange={(e) => setProdForm({ ...prodForm, isBestseller: e.target.checked })}
                    className="accent-[#DC143C]"
                  />
                  <span>Bestseller Ribbon</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddProductOpen(false);
                    setEditingProduct(null);
                  }}
                  className="px-5 py-2 border rounded-full text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#DC143C] text-white font-semibold rounded-full hover:bg-[#B01030] shadow-sm"
                >
                  Save Formulation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE CATEGORY */}
      {isAddCategoryOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border border-[#EDE0D4] shadow-2xl animate-scale-in">
            <h3 className="font-serif text-xl font-semibold text-stone-900 mb-3">
              Add Store Department
            </h3>
            <form onSubmit={handleCreateCategory} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold block text-stone-700 mb-1">Department Name</label>
                <input
                  type="text"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="e.g. Primers & Setting Sprays"
                  required
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="font-semibold block text-stone-700 mb-1">Description</label>
                <textarea
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddCategoryOpen(false)}
                  className="px-4 py-1.5 border rounded-full"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-[#DC143C] text-white font-semibold rounded-full hover:bg-[#B01030]"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: STOCK ADJUSTMENT */}
      {stockAdjustModalProd && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#EDE0D4] shadow-2xl animate-scale-in">
            <h3 className="font-serif text-xl font-semibold text-stone-900 mb-2">
              Stock Intake: {stockAdjustModalProd.name}
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Current warehouse inventory: <strong>{stockAdjustModalProd.stock}</strong> units.
            </p>

            <form onSubmit={handleStockAdjustmentSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold block text-stone-700 mb-1">
                  Quantity Adjustment (positive or negative)
                </label>
                <input
                  type="number"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold block text-stone-700 mb-1">Reason for Entry</label>
                <select
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                >
                  <option value="New stock received">New laboratory batch received</option>
                  <option value="Manual correction">Inventory count manual audit</option>
                  <option value="Damaged product">Damaged or testing sample write-off</option>
                  <option value="Customer return">Customer return restock</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setStockAdjustModalProd(null)}
                  className="px-4 py-1.5 border rounded-full"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-[#DC143C] text-white font-semibold rounded-full hover:bg-[#B01030]"
                >
                  Commit Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DETAILED ORDER INSPECTION */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-[#EDE0D4] shadow-2xl space-y-4 animate-scale-in">
            <div className="flex justify-between items-center border-b border-stone-200 pb-3">
              <div>
                <h3 className="font-serif text-xl font-semibold text-stone-900">
                  Order #{selectedOrderDetails.orderNumber}
                </h3>
                <span className="text-xs text-stone-500">
                  Customer: {selectedOrderDetails.customerName} ({selectedOrderDetails.customerEmail})
                </span>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="p-1 rounded-full hover:bg-stone-100"
              >
                ✕
              </button>
            </div>

            <div className="text-xs space-y-2 bg-[#FAF8F5] p-4 rounded-2xl border border-[#EDE0D4]">
              <p>
                <strong>Delivery Destination:</strong> {selectedOrderDetails.shippingAddress.street},{' '}
                {selectedOrderDetails.shippingAddress.city} {selectedOrderDetails.shippingAddress.postalCode}
              </p>
              <p>
                <strong>Fulfillment State:</strong>{' '}
                <span className="font-bold text-[#DC143C]">
                  {selectedOrderDetails.fulfillmentStatus}
                </span>
              </p>
              <p>
                <strong>Tracking Reference:</strong>{' '}
                <span className="font-mono text-stone-700">
                  {selectedOrderDetails.trackingNumber || 'Pending Courier Assignment'}
                </span>
              </p>
              <p>
                <strong>Payment Method:</strong> {selectedOrderDetails.paymentMethod} (
                {selectedOrderDetails.paymentStatus})
              </p>
            </div>

            <div className="border-t border-stone-200 pt-3 space-y-2">
              <h4 className="font-semibold text-xs text-stone-800">Purchased Items:</h4>
              {selectedOrderDetails.items.map((it) => (
                <div key={it.id} className="flex justify-between text-xs py-1 border-b border-stone-100">
                  <span>
                    {it.productName} (x{it.quantity}) {it.shade && `• ${it.shade}`}
                  </span>
                  <span className="font-bold font-mono">${(it.price * it.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold text-sm pt-2">
                <span>Grand Total:</span>
                <span className="font-mono">${selectedOrderDetails.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-3 flex justify-between items-center border-t border-stone-100">
              <button
                onClick={() => handleAdvanceOrderStatus(selectedOrderDetails)}
                className="px-4 py-2 bg-[#DC143C] hover:bg-[#B01030] text-white rounded-full text-xs font-semibold"
              >
                Advance Fulfillment ➔
              </button>

              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="px-5 py-2 bg-stone-800 text-white rounded-full text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDIT PROMOTIONAL HERO BANNER */}
      {editingBanner && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-[#EDE0D4] shadow-2xl relative animate-scale-in space-y-4">
            <div className="flex justify-between items-center border-b border-stone-200 pb-3">
              <div>
                <h3 className="font-serif text-2xl font-semibold text-stone-900">
                  Edit Hero Promotional Banner
                </h3>
                <p className="text-xs text-stone-500">
                  Update headline, promotional label, body copy, and discount claim.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingBanner(null)}
                className="p-1 rounded-full hover:bg-stone-100"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updatePromoBanner(editingBanner.id, {
                  title: editingBanner.title,
                  subtitle: editingBanner.subtitle,
                  label: editingBanner.label,
                  description: editingBanner.description,
                  ctaText: editingBanner.ctaText,
                  ctaTarget: editingBanner.ctaTarget,
                  discountBadge: editingBanner.discountBadge,
                  active: editingBanner.active,
                });
                setEditingBanner(null);
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="font-semibold block text-stone-700 mb-1">
                  Promotional Kicker Label (e.g. YOUR BEAUTY, YOUR RITUAL)
                </label>
                <input
                  type="text"
                  value={editingBanner.label || ''}
                  onChange={(e) =>
                    setEditingBanner({ ...editingBanner, label: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-xl"
                  placeholder="e.g. YOUR BEAUTY, YOUR RITUAL"
                />
              </div>

              <div>
                <label className="font-semibold block text-stone-700 mb-1">
                  Main Headline (Luxury Display Serif)
                </label>
                <input
                  type="text"
                  value={editingBanner.title}
                  onChange={(e) =>
                    setEditingBanner({ ...editingBanner, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="font-semibold block text-stone-700 mb-1">
                  Subtitle / Collection Badge
                </label>
                <input
                  type="text"
                  value={editingBanner.subtitle}
                  onChange={(e) =>
                    setEditingBanner({ ...editingBanner, subtitle: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold block text-stone-700 mb-1">
                  Configurable Discount / Offer Badge (Admin Controlled)
                </label>
                <input
                  type="text"
                  value={editingBanner.discountBadge || ''}
                  onChange={(e) =>
                    setEditingBanner({
                      ...editingBanner,
                      discountBadge: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-xl"
                  placeholder="Leave empty if no active discount claim or coupon"
                />
                <span className="text-[10px] text-stone-400">
                  Displayed on the banner only when configured by the store administrator.
                </span>
              </div>

              <div>
                <label className="font-semibold block text-stone-700 mb-1">
                  Supporting Editorial Description
                </label>
                <textarea
                  value={editingBanner.description}
                  onChange={(e) =>
                    setEditingBanner({ ...editingBanner, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block text-stone-700 mb-1">
                    Call to Action Label
                  </label>
                  <input
                    type="text"
                    value={editingBanner.ctaText}
                    onChange={(e) =>
                      setEditingBanner({ ...editingBanner, ctaText: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold block text-stone-700 mb-1">
                    Destination Page
                  </label>
                  <select
                    value={editingBanner.ctaTarget}
                    onChange={(e) =>
                      setEditingBanner({
                        ...editingBanner,
                        ctaTarget: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    <option value="shop">Main Shop Catalog</option>
                    <option value="skincare">Skincare (Face Department)</option>
                    <option value="makeup">Makeup (Lips Department)</option>
                    <option value="offers">Exclusive Offers & Sets</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="bannerActive"
                  checked={editingBanner.active}
                  onChange={(e) =>
                    setEditingBanner({ ...editingBanner, active: e.target.checked })
                  }
                  className="rounded text-[#DC143C]"
                />
                <label htmlFor="bannerActive" className="text-stone-700 font-medium">
                  Active in Carousel Rotation
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setEditingBanner(null)}
                  className="px-4 py-2 border rounded-full text-stone-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#DC143C] hover:bg-[#B01030] text-white font-semibold rounded-full shadow-md"
                >
                  Save Banner Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
