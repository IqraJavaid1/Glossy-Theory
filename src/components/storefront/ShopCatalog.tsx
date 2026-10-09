import React, { useState, useMemo } from 'react';
import { Star, ShoppingBag, Eye, Search, Filter, SlidersHorizontal, Check, Heart, Sparkles } from 'lucide-react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';

export const ShopCatalog: React.FC = () => {
  const {
    products,
    categories,
    addToCart,
    setSelectedProductForModal,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    searchQuery,
    setSearchQuery,
    wishlist,
    toggleWishlist,
    setIsShadeFinderOpen,
  } = useApp();

  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('featured');
  const [addedId, setAddedId] = useState<string | null>(null);
  const [cardShades, setCardShades] = useState<Record<string, string>>({});

  const activeCategories = categories.filter((c) => c.isActive);

  const getSelectedShade = (product: Product) => {
    return cardShades[product.id] || product.shades[0]?.name || '';
  };

  const handleSelectShade = (productId: string, shadeName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCardShades((prev) => ({ ...prev, [productId]: shadeName }));
  };

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => p.isActive)
      .filter((p) => {
        if (!selectedCategoryFilter) return true;
        const cat = categories.find((c) => c.slug === selectedCategoryFilter);
        return cat ? p.categoryId === cat.id : true;
      })
      .filter((p) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q) ||
          p.shades.some((s) => s.name.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return (a.salePrice ?? a.price) - (b.salePrice ?? b.price);
        if (sortBy === 'price-desc') return (b.salePrice ?? b.price) - (a.salePrice ?? a.price);
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, categories, selectedCategoryFilter, searchQuery, sortBy]);

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
    <div className="py-12 bg-[#FAF6F0] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-[#DC143C] mb-2">
            The Complete Collection
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#242220]">
            Glossy Theory Boutique
          </h1>
          <p className="text-xs sm:text-sm text-[#6E5E58] mt-2 max-w-xl mx-auto">
            Discover bespoke foundations, luminous highlighters, and buttery velvet lipsticks curated for all skin tones.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EDE2D8] shadow-xs mb-8 flex flex-col lg:flex-row gap-4 items-center justify-between">
          
          {/* Category Tabs (Segmented control) */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedCategoryFilter(null)}
              className={`px-4 py-2 text-xs font-semibold rounded-full whitespace-nowrap transition-colors ${
                selectedCategoryFilter === null
                  ? 'bg-[#DC143C] text-white shadow-xs'
                  : 'bg-[#FAF4EC] text-[#5C4D48] hover:bg-[#F5E8DC]'
              }`}
            >
              All Products ({products.filter((p) => p.isActive).length})
            </button>
            {activeCategories.map((cat) => {
              const count = products.filter((p) => p.isActive && p.categoryId === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryFilter(cat.slug)}
                  className={`px-4 py-2 text-xs font-semibold rounded-full whitespace-nowrap transition-colors ${
                    selectedCategoryFilter === cat.slug
                      ? 'bg-[#DC143C] text-white shadow-xs'
                      : 'bg-[#FAF4EC] text-[#5C4D48] hover:bg-[#F5E8DC]'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>

          {/* Search input & Sort selector */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search shades, formulas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8D9CD] rounded-full text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#DC143C]"
              />
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <SlidersHorizontal className="w-3.5 h-3.5 text-stone-500 hidden sm:inline" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#FAF7F2] border border-[#E8D9CD] rounded-full px-3 py-2 text-xs font-medium text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#DC143C]"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>

        </div>

        {/* Results Counter / Filter status */}
        <div className="flex items-center justify-between text-xs text-[#7A6964] mb-6">
          <span>
            Showing <strong>{filteredProducts.length}</strong> luxurious formulations
          </span>
          {(selectedCategoryFilter || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategoryFilter(null);
                setSearchQuery('');
              }}
              className="text-[#DC143C] hover:underline font-medium"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-[#EDE2D8] max-w-md mx-auto my-12">
            <p className="font-serif text-xl text-stone-800 mb-2">No products found</p>
            <p className="text-xs text-stone-500 mb-6">
              We couldn't find any cosmetics matching "{searchQuery || selectedCategoryFilter}". Try adjusting your keywords or browse all products.
            </p>
            <button
              onClick={() => {
                setSelectedCategoryFilter(null);
                setSearchQuery('');
              }}
              className="px-6 py-2.5 bg-[#DC143C] text-white text-xs font-semibold rounded-full shadow-sm hover:bg-[#B01030]"
            >
              View Full Collection
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
            {filteredProducts.map((product) => {
              const isOutOfStock = product.stock <= 0;
              const isJustAdded = addedId === product.id;

              return (
                <div
                  key={product.id}
                  onClick={() => setSelectedProductForModal(product)}
                  className="group bg-white rounded-xl overflow-hidden border border-[#EDE2D8] hover:border-[#F7CAC9] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer relative"
                >
                  {/* Image Container with Hover Zoom */}
                  <div className="relative aspect-[4/3] bg-[#FDFBF7] overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />

                    {/* Stock Status Badge */}
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
                      title="Save to wishlist"
                    >
                      <Heart
                        className={`w-4 h-4 transition-colors ${
                          wishlist.includes(product.id) ? 'text-[#DC143C] fill-[#DC143C]' : ''
                        }`}
                      />
                    </button>

                    {/* Quick View Overlay */}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center p-4">
                      <span className="bg-white/95 text-[#242220] text-xs font-semibold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200">
                        <Eye className="w-3.5 h-3.5 text-[#DC143C]" />
                        View Product
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-[11px] font-medium uppercase tracking-wider text-[#8A7973]">
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

                      <h3 className="font-serif text-lg font-semibold text-[#242220] group-hover:text-[#DC143C] transition-colors line-clamp-1">
                        {product.name}
                      </h3>

                      <p className="text-xs text-[#6E5E58] mt-1 line-clamp-1">
                        {product.subtitle}
                      </p>

                      {/* Interactive In-Card Shade Swatches */}
                      {product.shades.length > 0 && (
                        <div className="mt-3 pt-2 border-t border-[#F4E9E0]">
                          <div className="text-[11px] text-stone-500 mb-1">
                            Shade: <strong className="text-[#DC143C]">{getSelectedShade(product)}</strong>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {product.shades.map((shade, idx) => {
                              const isSelected = getSelectedShade(product) === shade.name;
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
        )}

      </div>
    </div>
  );
};
