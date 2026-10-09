import React, { useState, useEffect } from 'react';
import {
  Search,
  ShoppingBag,
  Shield,
  Menu,
  X,
  Heart,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { Logo } from './Logo';
import { useApp } from '../../context/AppContext';

export const Header: React.FC = () => {
  const {
    cartCount,
    setIsCartOpen,
    setIsAdminLoginOpen,
    adminUser,
    activeView,
    setActiveView,
    setSelectedCategoryFilter,
    searchQuery,
    setSearchQuery,
    wishlist,
    setIsWishlistOpen,
    setIsShadeFinderOpen,
    products,
    setSelectedProductForModal,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Rotating Announcement ticker
  const announcements = [
    '✨ Complimentary Luxury Velvet Pouch & Free Delivery on All Orders Over $50',
    '💄 100% Vegan, Cruelty-Free & Dermatologist Formulated Clean Minerals',
    '🎨 Find Your Perfect Shade in 30 Seconds with Our Virtual Concierge',
  ];
  const [announcementIdx, setAnnouncementIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIdx((prev) => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handleNav = (view: 'home' | 'shop', catSlug?: string) => {
    setActiveView(view);
    if (catSlug) {
      setSelectedCategoryFilter(catSlug);
    } else {
      setSelectedCategoryFilter(null);
    }
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveView('shop');
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  // Live instant search results
  const searchResults = searchQuery.trim()
    ? products
        .filter((p) => p.isActive)
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 3)
    : [];

  return (
    <>
      {/* Top micro-announcement banner with smooth rotation */}
      <div className="bg-[#1C1A19] text-[#FDEBD0] text-[11px] font-medium tracking-widest uppercase text-center py-2 px-4 flex items-center justify-between border-b border-[#332D2A]">
        <button
          onClick={() => setAnnouncementIdx((prev) => (prev === 0 ? announcements.length - 1 : prev - 1))}
          className="text-stone-400 hover:text-white p-0.5"
          aria-label="Previous announcement"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        <span className="truncate max-w-xl text-[10px] sm:text-[11px] font-sans transition-all duration-300">
          {announcements[announcementIdx]}
        </span>

        <button
          onClick={() => setAnnouncementIdx((prev) => (prev + 1) % announcements.length)}
          className="text-stone-400 hover:text-white p-0.5"
          aria-label="Next announcement"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Premium Header */}
      <header className="sticky top-0 z-40 bg-[#FAF5EE]/95 border-b border-[#F2E3D5] backdrop-blur-md transition-shadow duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            
            {/* Left: Brand Logo */}
            <div className="flex items-center shrink-0">
              <button
                onClick={() => handleNav('home')}
                className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DC143C] rounded-sm text-left transition-transform duration-200 hover:opacity-90"
                aria-label="Glossy Theory Home"
              >
                <Logo size="md" showText={true} />
              </button>
            </div>

            {/* Center: Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-7 text-xs font-semibold tracking-wider uppercase">
              <button
                onClick={() => handleNav('home')}
                className={`transition-colors duration-200 hover:text-[#DC143C] ${
                  activeView === 'home'
                    ? 'text-[#DC143C] border-b-2 border-[#DC143C] pb-0.5'
                    : 'text-[#4A3E3D]'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => handleNav('shop')}
                className={`transition-colors duration-200 hover:text-[#DC143C] ${
                  activeView === 'shop'
                    ? 'text-[#DC143C] border-b-2 border-[#DC143C] pb-0.5'
                    : 'text-[#4A3E3D]'
                }`}
              >
                Shop All
              </button>
              <button
                onClick={() => handleNav('shop', 'face')}
                className="text-[#4A3E3D] hover:text-[#DC143C] transition-colors duration-200"
              >
                Face
              </button>
              <button
                onClick={() => handleNav('shop', 'lips')}
                className="text-[#4A3E3D] hover:text-[#DC143C] transition-colors duration-200"
              >
                Lips
              </button>
              <button
                onClick={() => handleNav('shop', 'eyes')}
                className="text-[#4A3E3D] hover:text-[#DC143C] transition-colors duration-200"
              >
                Eyes
              </button>
              <button
                onClick={() => handleNav('shop')}
                className="text-[#DC143C] hover:text-[#B01030] transition-colors duration-200 flex items-center gap-1 font-bold"
              >
                New Arrivals
              </button>

              {/* Interactive Virtual Shade Matcher Link */}
              <button
                onClick={() => setIsShadeFinderOpen(true)}
                className="px-3 py-1 rounded-full bg-[#FAF0E6] hover:bg-[#FCE5D8] text-[#DC143C] border border-[#F2D1C2] text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 shadow-2xs transition-all hover:scale-105"
              >
                <Sparkles className="w-3 h-3" />
                <span>Shade Matcher</span>
              </button>
            </nav>

            {/* Right: Actions */}
            <div className="flex items-center space-x-2 sm:space-x-3.5">
              
              {/* Search Toggle & Live Drawer */}
              <div className="relative">
                {searchOpen ? (
                  <div className="relative">
                    <form onSubmit={handleSearchSubmit} className="flex items-center">
                      <input
                        type="text"
                        placeholder="Search lipstick, shade, foundation..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                        className="w-48 sm:w-64 pl-3 pr-8 py-1.5 text-xs bg-white border border-[#F7CAC9] rounded-full focus:outline-none focus:ring-1 focus:ring-[#DC143C] text-[#242220] shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="absolute right-2 text-stone-400 hover:text-stone-700 p-0.5"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </form>

                    {/* Instant Search Dropdown Suggestions */}
                    {searchResults.length > 0 && (
                      <div className="absolute top-10 right-0 w-72 bg-white rounded-2xl p-2 border border-[#EDE0D4] shadow-xl z-50 animate-scale-in">
                        <p className="text-[10px] uppercase font-bold text-stone-400 px-2 py-1">
                          Suggested Formulations
                        </p>
                        <div className="space-y-1">
                          {searchResults.map((p) => (
                            <div
                              key={p.id}
                              onClick={() => {
                                setSelectedProductForModal(p);
                                setSearchOpen(false);
                              }}
                              className="p-2 rounded-xl hover:bg-[#FAF5EE] flex items-center gap-2.5 cursor-pointer transition-colors"
                            >
                              <img
                                src={p.image}
                                alt=""
                                className="w-9 h-9 object-cover rounded-lg bg-stone-100"
                              />
                              <div className="flex-1">
                                <p className="font-serif text-xs font-semibold text-stone-900 line-clamp-1">
                                  {p.name}
                                </p>
                                <p className="text-[10px] text-stone-500 font-bold">${p.price.toFixed(2)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="p-2 text-[#4A3E3D] hover:text-[#DC143C] transition-colors rounded-full hover:bg-[#FDEBD0]/40"
                    aria-label="Search products"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Customer Wishlist Button */}
              <button
                onClick={() => setIsWishlistOpen(true)}
                className="p-2 text-[#4A3E3D] hover:text-[#DC143C] transition-colors rounded-full hover:bg-[#FDEBD0]/40 relative"
                aria-label="Saved Wishlist"
                title="View Saved Favorites"
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-0 min-w-4 h-4 px-1 bg-[#F75270] text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-xs">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Shopping Bag Button with animated count */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="p-2 text-[#4A3E3D] hover:text-[#DC143C] transition-colors rounded-full hover:bg-[#FDEBD0]/40 relative"
                aria-label="Shopping Bag"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-0 min-w-4.5 h-4.5 px-1 bg-[#DC143C] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm animate-scale-in">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Separated Administrator Login Button */}
              <div className="hidden sm:block pl-2 border-l border-[#EAD8CA]">
                {adminUser ? (
                  <button
                    onClick={() => setActiveView('admin-dashboard')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#242220] text-[#FDEBD0] hover:bg-black transition-all shadow-sm"
                  >
                    <Shield className="w-3.5 h-3.5 text-[#DC143C]" />
                    <span>Admin Panel</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsAdminLoginOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#DC143C] border border-[#DC143C]/40 bg-[#DC143C]/5 hover:bg-[#DC143C] hover:text-white transition-all shadow-xs"
                    title="Staff & Administrator Portal"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Admin Login</span>
                  </button>
                )}
              </div>

              {/* Mobile Menu Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-[#4A3E3D] hover:text-[#DC143C] rounded-md"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FAF4EC] border-b border-[#EBD9CC] px-4 pt-3 pb-6 space-y-3 transition-all animate-fade-in">
            <div className="flex flex-col space-y-2 text-sm font-medium">
              <button
                onClick={() => handleNav('home')}
                className="text-left py-2 px-3 rounded-md hover:bg-[#FDEBD0] text-[#242220]"
              >
                Home
              </button>
              <button
                onClick={() => handleNav('shop')}
                className="text-left py-2 px-3 rounded-md hover:bg-[#FDEBD0] text-[#242220]"
              >
                Shop All
              </button>
              <button
                onClick={() => handleNav('shop', 'face')}
                className="text-left py-2 px-3 rounded-md hover:bg-[#FDEBD0] text-stone-700"
              >
                Face Makeup
              </button>
              <button
                onClick={() => handleNav('shop', 'lips')}
                className="text-left py-2 px-3 rounded-md hover:bg-[#FDEBD0] text-stone-700"
              >
                Lip Products
              </button>
              <button
                onClick={() => handleNav('shop', 'eyes')}
                className="text-left py-2 px-3 rounded-md hover:bg-[#FDEBD0] text-stone-700"
              >
                Eyes & Palettes
              </button>
              <button
                onClick={() => {
                  setIsShadeFinderOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2 px-3 rounded-md bg-[#FCE5D8] text-[#DC143C] font-semibold flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Virtual Shade Finder</span>
              </button>
            </div>

            <div className="pt-3 border-t border-[#EBD9CC] flex flex-col gap-2">
              <button
                onClick={() => {
                  if (adminUser) {
                    setActiveView('admin-dashboard');
                  } else {
                    setIsAdminLoginOpen(true);
                  }
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-4 text-xs font-semibold rounded-md bg-[#242220] text-[#FDEBD0] hover:bg-black text-center flex items-center justify-center gap-2"
              >
                <Shield className="w-3.5 h-3.5 text-[#DC143C]" />
                {adminUser ? 'Access Admin Dashboard' : 'Staff Admin Login'}
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
