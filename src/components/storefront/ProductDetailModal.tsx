import React, { useState } from 'react';
import { X, Star, ShoppingBag, Truck, ShieldCheck, Heart, Sparkles, Check, Send } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProductForModal,
    setSelectedProductForModal,
    products,
    addToCart,
    reviews,
    addReview,
    wishlist,
    toggleWishlist,
    showToast,
  } = useApp();

  const product = selectedProductForModal;

  const [selectedShade, setSelectedShade] = useState<string>(
    product?.shades[0]?.name || ''
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'ingredients' | 'reviews'>('details');

  // Review Form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  if (!product) return null;

  const productReviews = reviews.filter(
    (r) => r.productId === product.id && r.status === 'approved'
  );

  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedShade, quantity);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    addReview({
      productId: product.id,
      productName: product.name,
      authorName: reviewerName.trim() || 'Verified Customer',
      rating: reviewRating,
      comment: reviewComment.trim(),
      isVerifiedPurchase: true,
    });

    setReviewSubmitted(true);
    setReviewComment('');
    setTimeout(() => setReviewSubmitted(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto border border-[#EEDFD5] shadow-2xl relative animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedProductForModal(null)}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          
          {/* Left Column: Product Imagery */}
          <div className="md:col-span-6 bg-[#FAF6F0] p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#EEDFD5]">
            <div className="relative rounded-2xl overflow-hidden aspect-square bg-white shadow-md border border-[#F0E4D8]">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
              {product.isBestseller && (
                <span className="absolute top-4 left-4 bg-[#DC143C] text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  Bestseller
                </span>
              )}
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-2.5 text-xs text-[#7A6964]">
                <Truck className="w-4 h-4 text-[#DC143C]" />
                <span>Estimated dispatch in 24 hours. Free standard shipping over $50.</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-[#7A6964]">
                <ShieldCheck className="w-4 h-4 text-[#DC143C]" />
                <span>Certified clean formula, hypoallergenic, and non-comedogenic.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              {/* Category & SKU */}
              <div className="flex items-center justify-between text-xs text-[#8A7973] uppercase tracking-wider mb-2">
                <span>{product.categoryName}</span>
                <span className="font-mono text-[11px] text-stone-400">SKU: {product.sku}</span>
              </div>

              {/* Title & Subtitle */}
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#242220]">
                {product.name}
              </h2>
              <p className="text-xs text-[#DC143C] font-semibold tracking-wide uppercase mt-1">
                {product.subtitle}
              </p>

              {/* Rating & Reviews anchor */}
              <div className="flex items-center gap-2 mt-3 text-sm">
                <div className="flex items-center text-[#DC143C]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating) ? 'fill-[#DC143C]' : 'text-stone-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-bold text-stone-800 text-xs">
                  {product.rating.toFixed(1)}
                </span>
                <span className="text-stone-400 text-xs">
                  ({productReviews.length} verified reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-2xl font-bold font-sans text-[#242220]">
                  ${product.price.toFixed(2)}
                </span>
                {product.salePrice && (
                  <span className="text-base text-stone-400 line-through">
                    ${product.salePrice.toFixed(2)}
                  </span>
                )}
                <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-medium">
                  {isOutOfStock
                    ? 'Out of Stock'
                    : product.stock <= product.lowStockThreshold
                    ? `Low Stock: ${product.stock} units left`
                    : 'In Stock & Ready to Ship'}
                </span>
              </div>

              {/* Shade Selector */}
              {product.shades.length > 0 && (
                <div className="mt-6 pt-5 border-t border-[#F2E5DC]">
                  <div className="flex items-center justify-between text-xs mb-2.5">
                    <span className="font-semibold text-stone-800">
                      Select Shade:{' '}
                      <span className="text-[#DC143C] font-normal">
                        {selectedShade || product.shades[0].name}
                      </span>
                    </span>
                    <span className="text-stone-400 text-[11px]">
                      {product.shades.length} nuances
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {product.shades.map((shade, idx) => {
                      const isSelected = selectedShade === shade.name;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedShade(shade.name)}
                          className={`group relative p-1 rounded-full border-2 transition-all ${
                            isSelected
                              ? 'border-[#DC143C] scale-110 shadow-xs'
                              : 'border-transparent hover:border-stone-300'
                          }`}
                          title={shade.name}
                        >
                          <span
                            className="block w-6 h-6 rounded-full border border-black/10 shadow-inner"
                            style={{ backgroundColor: shade.hex }}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Stepper & Add to Bag */}
              <div className="mt-6 flex items-center gap-4">
                <div className="flex items-center border border-[#E8D9CD] rounded-full bg-[#FAF7F2] p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-stone-600 hover:bg-white disabled:opacity-30 transition-colors text-sm font-semibold"
                  >
                    -
                  </button>
                  <span className="w-9 text-center text-xs font-bold text-stone-800">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock || isOutOfStock}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-stone-600 hover:bg-white disabled:opacity-30 transition-colors text-sm font-semibold"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 py-3.5 px-6 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 shadow-md ${
                    isOutOfStock
                      ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                      : 'bg-[#DC143C] hover:bg-[#B01030] text-white hover:shadow-lg'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    {isOutOfStock ? 'Sold Out' : `Add to Bag • $${(product.price * quantity).toFixed(2)}`}
                  </span>
                </button>
              </div>

            </div>

            {/* Information Tabs (Details, Ingredients, Reviews) */}
            <div className="pt-4 border-t border-[#F2E5DC]">
              <div className="flex items-center gap-4 border-b border-[#F2E5DC] pb-2 text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`pb-1 transition-colors ${
                    activeTab === 'details'
                      ? 'text-[#DC143C] border-b-2 border-[#DC143C]'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab('ingredients')}
                  className={`pb-1 transition-colors ${
                    activeTab === 'ingredients'
                      ? 'text-[#DC143C] border-b-2 border-[#DC143C]'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  Key Actives
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-1 transition-colors ${
                    activeTab === 'reviews'
                      ? 'text-[#DC143C] border-b-2 border-[#DC143C]'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  Reviews ({productReviews.length})
                </button>
              </div>

              {/* Tab Content */}
              <div className="py-3 text-xs text-[#5E504C] leading-relaxed max-h-40 overflow-y-auto">
                {activeTab === 'details' && (
                  <p>{product.description}</p>
                )}

                {activeTab === 'ingredients' && (
                  <div className="space-y-1.5">
                    <p><strong>Rose Damascena Distillate:</strong> Soothes redness while infusing deep antioxidant moisture.</p>
                    <p><strong>Multi-Weight Hyaluronic Acid:</strong> Binds continuous hydration into epidermal layers.</p>
                    <p><strong>Crushed Mica Pearls:</strong> Ethically sourced micro-crystals for multidimensional radiance without microplastics.</p>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-4">
                    {/* Customer Review Form */}
                    <div className="bg-[#FAF6F0] p-3.5 rounded-xl border border-[#EDE0D4]">
                      <h4 className="font-semibold text-stone-800 text-xs mb-2">
                        Write a Review
                      </h4>
                      {reviewSubmitted ? (
                        <p className="text-emerald-700 font-medium text-xs">
                          Thank you! Your review has been submitted for editorial review.
                        </p>
                      ) : (
                        <form onSubmit={handleReviewSubmit} className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-stone-600">Your Rating:</span>
                            <div className="flex items-center text-[#DC143C]">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <button
                                  type="button"
                                  key={s}
                                  onClick={() => setReviewRating(s)}
                                  className="p-0.5 focus:outline-none"
                                >
                                  <Star
                                    className={`w-4 h-4 ${
                                      s <= reviewRating ? 'fill-[#DC143C]' : 'text-stone-300'
                                    }`}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>

                          <input
                            type="text"
                            placeholder="Your Name (e.g. Elena R.)"
                            value={reviewerName}
                            onChange={(e) => setReviewerName(e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#E0D2C5] rounded-md focus:outline-none focus:ring-1 focus:ring-[#DC143C]"
                          />

                          <textarea
                            placeholder="Share your experience with this formulation..."
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            rows={2}
                            required
                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#E0D2C5] rounded-md focus:outline-none focus:ring-1 focus:ring-[#DC143C]"
                          />

                          <button
                            type="submit"
                            className="px-4 py-1.5 bg-[#DC143C] text-white text-xs font-semibold rounded-full hover:bg-[#B01030] flex items-center gap-1.5"
                          >
                            <Send className="w-3 h-3" />
                            <span>Submit Review</span>
                          </button>
                        </form>
                      )}
                    </div>

                    {/* Existing Reviews List */}
                    {productReviews.length === 0 ? (
                      <p className="text-stone-400 italic">No approved reviews yet. Be the first to review!</p>
                    ) : (
                      productReviews.map((r) => (
                        <div key={r.id} className="border-b border-[#F2E5DC] pb-2.5">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-stone-800">{r.authorName}</span>
                            <div className="flex text-[#DC143C]">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < r.rating ? 'fill-[#DC143C]' : 'text-stone-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-stone-600 text-xs italic">"{r.comment}"</p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
