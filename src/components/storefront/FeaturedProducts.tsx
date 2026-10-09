import React, { useState } from 'react';
import { Star, ShoppingBag, Eye, Check, Heart, Sparkles } from 'lucide-react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';

export const FeaturedProducts: React.FC = () => {
  const { products, addToCart, setSelectedProductForModal, wishlist, toggleWishlist, setIsShadeFinderOpen } =
    useApp();
  const [addedId, setAddedId] = useState<string | null>(null);
  
  // Track selected shade per card
  const [cardShades, setCardShades] = useState<Record<string, string>>({});

  // Take top 4 active featured products
  const featured = products.filter((p) => p.isActive).slice(0, 4);

  const getSelectedShade = (product: Product) => {
    return cardShades[product.id] || product.shades[0]?.name || '';
  };

  const handleSelectShade = (productId: string, shadeName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCardShades((prev) => ({ ...prev, [productId]: shadeName }));
  };

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.stock <= 0) return;
    const shade = getSelectedShade(product);
    addToCart(product, shade, 1);
    setAddedId(product.id);
    setTimeout(() => {
      setAddedId((curr) => (curr === product.id ? null : curr));
    }, 1500);
  };

  return (
    <section className="py-16 sm:py-20 bg-[#FAF6F0] border-b border-[#F2E1D4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF0E6] text-[#DC143C] text-[10px] font-bold tracking-widest uppercase mb-3">
            <Sparkles className="w-3 h-3" />
            <span>Trending • Luxury • You</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#242220] tracking-tight">
            Your New Beauty Obsession
          </h2>
          <p className="text-xs sm:text-sm text-[#7A6760] mt-2 max-w-md mx-auto">
            Dermatologist-tested mineral formulations loved by celebrity makeup artists worldwide.
          </p>
          <div className="w-12 h-0.5 bg-[#DC143C] mx-auto mt-4 rounded-full" />
        </div>

        {/* 4 Cards Per Row Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {featured.map((product) => {
            const isOutOfStock = product.stock <= 0;
            const isJustAdded = addedId === product.id;
            const currentShade = getSelectedShade(product);
            const isWishlisted = wishlist.includes(product.id);

            return (
              <div
                key={product.id}
                onClick={() => setSelectedProductForModal(product)}
                className="group bg-white rounded-2xl overflow-hidden border border-[#EDE2D8] hover:border-[#F7CAC9] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer relative"
              >
                {/* Image Container with Hover Zoom & Heart Wishlist */}
                <div className="relative aspect-[4/3] bg-[#FDFBF7] overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-500 ease-out"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />

                  {/* Stock / Bestseller Badge */}
                  {isOutOfStock ? (
                    <span className="absolute top-3 left-3 bg-[#242220]/90 text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-sm">
                      Sold Out
                    </span>
                  ) : product.stock <= product.lowStockThreshold ? (
                    <span className="absolute top-3 left-3 bg-[#DC143C] text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-sm">
                      Only {product.stock} Left
                    </span>
                  ) : product.isBestseller ? (
                    <span className="absolute top-3 left-3 bg-[#FDEBD0] text-[#933D2D] border border-[#F5D8B8] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm">
                      Bestseller
                    </span>
                  ) : null}

                  {/* Wishlist Heart Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/85 hover:bg-white text-stone-700 hover:text-[#DC143C] transition-all shadow-xs"
                    title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${
                        isWishlisted ? 'text-[#DC143C] fill-[#DC143C]' : ''
                      }`}
                    />
                  </button>

                  {/* Quick View Overlay Button */}
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center p-4">
                    <span className="bg-white/95 text-[#242220] text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200">
                      <Eye className="w-3.5 h-3.5 text-[#DC143C]" />
                      Quick Inspect
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    {/* Category & Rating */}
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A7973]">
                        {product.categoryName}
                      </span>
                      <div className="flex items-center gap-1 text-[#DC143C]">
                        <Star className="w-3.5 h-3.5 fill-[#DC143C]" />
                        <span className="text-xs font-semibold text-stone-800">
                          {product.rating.toFixed(1)}
                        </span>
                        <span className="text-[10px] text-stone-400">
                          ({product.reviewCount})
                        </span>
                      </div>
                    </div>

                    {/* Product Name */}
                    <h3 className="font-serif text-lg font-semibold text-[#242220] group-hover:text-[#DC143C] transition-colors line-clamp-1">
                      {product.name}
                    </h3>

                    {/* Short Description */}
                    <p className="text-xs text-[#6E5E58] mt-1 line-clamp-1">
                      {product.subtitle}
                    </p>

                    {/* Interactive In-Card Shade Swatches */}
                    {product.shades.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-[#F4E9E0]">
                        <div className="flex items-center justify-between text-[11px] mb-1.5">
                          <span className="text-stone-500 font-medium truncate max-w-[140px]">
                            Shade: <strong className="text-[#DC143C]">{currentShade}</strong>
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {product.shades.map((shade, idx) => {
                            const isSelected = currentShade === shade.name;
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={(e) => handleSelectShade(product.id, shade.name, e)}
                                className={`p-0.5 rounded-full border-2 transition-transform ${
                                  isSelected ? 'border-[#DC143C] scale-115' : 'border-transparent hover:scale-110'
                                }`}
                                title={shade.name}
                              >
                                <span
                                  className="block w-4 h-4 rounded-full border border-black/10 shadow-inner"
                                  style={{ backgroundColor: shade.hex }}
                                />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Price and Add to Bag Button */}
                  <div className="pt-2 border-t border-[#F2E5DC] flex items-center justify-between gap-3">
                    <div className="text-left">
                      <div className="text-base font-bold text-[#242220] font-sans tracking-tight">
                        ${product.price.toFixed(2)}
                      </div>
                      {product.salePrice && (
                        <div className="text-xs text-stone-400 line-through">
                          ${product.salePrice.toFixed(2)}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={(e) => handleQuickAdd(product, e)}
                      disabled={isOutOfStock}
                      className={`px-3.5 py-2 text-xs font-semibold rounded-full flex items-center gap-1.5 transition-all duration-200 ${
                        isOutOfStock
                          ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                          : isJustAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#DC143C] hover:bg-[#B01030] text-white shadow-xs hover:shadow-md'
                      }`}
                      aria-label={`Add ${product.name} to Bag`}
                    >
                      {isJustAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Bag</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Shade Finder Banner Strip */}
        <div className="mt-14 bg-gradient-to-r from-[#FAF0E6] via-[#FCEEE9] to-[#FDEBD0] rounded-3xl p-6 sm:p-8 border border-[#F2DFD4] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#DC143C] flex items-center justify-center md:justify-start gap-1">
              <Sparkles className="w-3 h-3" /> Virtual Foundation & Glow Concierge
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-semibold text-stone-900">
              Not sure which shade matches your undertone?
            </h3>
            <p className="text-xs text-stone-600 max-w-xl">
              Take our 30-second virtual shade matcher to get a custom prescription for your skin depth and undertone.
            </p>
          </div>

          <button
            onClick={() => setIsShadeFinderOpen(true)}
            className="px-6 py-3 bg-[#DC143C] hover:bg-[#B01030] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md hover:shadow-lg transition-all shrink-0 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch Shade Matcher</span>
          </button>
        </div>

      </div>
    </section>
  );
};
