import React, { useState, useEffect } from 'react';
import {
  Star,
  ChevronLeft,
  ChevronRight,
  Quote,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ThumbsUp,
  PlusCircle,
  X,
  Send,
  Heart,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CustomerReviews: React.FC = () => {
  const { reviews, products, setSelectedProductForModal, addReview, showToast } =
    useApp();
  const [selectedProductFilter, setSelectedProductFilter] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [helpfulCounts, setHelpfulCounts] = useState<Record<string, number>>({});
  const [hasVotedHelpful, setHasVotedHelpful] = useState<Record<string, boolean>>({});

  // Interactive Write Review Modal
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [formRating, setFormRating] = useState(5);
  const [formName, setFormName] = useState('');
  const [formComment, setFormComment] = useState('');
  const [formProductId, setFormProductId] = useState(products[0]?.id || '');

  // Filter approved reviews by product
  const approvedReviews = reviews.filter((r) => {
    if (r.status !== 'approved') return false;
    if (selectedProductFilter === 'all') return true;
    return r.productId === selectedProductFilter;
  });

  // Reset index when filter changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedProductFilter]);

  // Auto rotate carousel every 6s unless hovered
  useEffect(() => {
    if (isPaused || approvedReviews.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % approvedReviews.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, approvedReviews.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? approvedReviews.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % approvedReviews.length);
  };

  const handleHelpfulClick = (reviewId: string) => {
    if (hasVotedHelpful[reviewId]) return;
    setHelpfulCounts((prev) => ({
      ...prev,
      [reviewId]: (prev[reviewId] || 12) + 1,
    }));
    setHasVotedHelpful((prev) => ({ ...prev, [reviewId]: true }));
    showToast('Thank you for your feedback! Marked as helpful.');
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formComment.trim()) {
      showToast('Please share your thoughts in your review.');
      return;
    }

    const targetProd = products.find((p) => p.id === formProductId) || products[0];

    addReview({
      productId: targetProd.id,
      productName: targetProd.name,
      authorName: formName.trim() || 'Verified Customer',
      rating: formRating,
      comment: formComment.trim(),
      isVerifiedPurchase: true,
    });

    setIsWriteReviewOpen(false);
    setFormComment('');
    showToast('✨ Thank you! Your verified review has been submitted for approval.');
  };

  if (approvedReviews.length === 0) return null;

  const current = approvedReviews[currentIndex] || approvedReviews[0];
  const reviewedProd = products.find((p) => p.id === current.productId);
  const currentHelpful = helpfulCounts[current.id] ?? 14;
  const isHelpfulVoted = hasVotedHelpful[current.id] || false;

  return (
    <section
      className="py-16 sm:py-24 bg-gradient-to-b from-[#FCEEE9] via-[#FAF2EE] to-[#FAF6F0] border-b border-[#F2DDD4] relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Decorative quotes background watermark */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 text-[#F7CAC9]/25 pointer-events-none select-none">
        <Quote className="w-56 h-56 rotate-180" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
        
        {/* Editorial Subtitle & Title */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 text-[#DC143C] text-[10px] font-bold tracking-widest uppercase mb-2.5 border border-[#F5DDD0]">
          <Sparkles className="w-3 h-3" />
          <span>Real Skin • Unfiltered Radiance</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl text-[#242220] tracking-tight">
          Words from Our Beauty Community
        </h2>
        <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
          Honest reviews from customers who made Glossy Theory their everyday luxury ritual.
        </p>

        {/* Action Bar: Filters + Write Review Button */}
        <div className="mt-7 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Interactive Filter Pills */}
          <div className="flex items-center justify-center gap-1.5 flex-wrap">
            <button
              onClick={() => setSelectedProductFilter('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedProductFilter === 'all'
                  ? 'bg-[#DC143C] text-white shadow-xs'
                  : 'bg-white/80 text-stone-700 hover:bg-white border border-[#E8DCD2]'
              }`}
            >
              All Reviews
            </button>
            {products.slice(0, 4).map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedProductFilter(p.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedProductFilter === p.id
                    ? 'bg-[#DC143C] text-white shadow-xs'
                    : 'bg-white/80 text-stone-700 hover:bg-white border border-[#E8DCD2]'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsWriteReviewOpen(true)}
            className="px-4 py-1.5 bg-white hover:bg-[#FAF4ED] text-[#DC143C] border border-[#DC143C]/40 hover:border-[#DC143C] rounded-full text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 shrink-0"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Write a Review</span>
          </button>
        </div>

        {/* Testimonial Presentation Card */}
        <div className="mt-8 bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-[#F3DFD5] shadow-lg transition-all duration-300 relative">
          
          {/* Star Rating */}
          <div className="flex items-center justify-center gap-1 mb-5 text-[#DC143C]">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < current.rating
                    ? 'fill-[#DC143C] text-[#DC143C]'
                    : 'text-stone-300'
                }`}
              />
            ))}
          </div>

          {/* Review Text */}
          <blockquote className="font-serif italic text-lg sm:text-2xl text-[#382E2B] leading-relaxed max-w-2xl mx-auto">
            "{current.comment}"
          </blockquote>

          {/* Author Details & Verified Indicator */}
          <div className="mt-6 flex flex-col items-center justify-center gap-1.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#FAF0E6] text-[#DC143C] font-serif font-bold text-xs flex items-center justify-center border border-[#F2D6C6]">
                {current.authorName.charAt(0)}
              </div>
              <span className="font-sans font-semibold text-sm sm:text-base text-[#242220]">
                {current.authorName}
              </span>
              {current.isVerifiedPurchase && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wider">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Verified Buyer
                </span>
              )}
            </div>

            {/* Product anchor with click to view */}
            {reviewedProd && (
              <button
                onClick={() => setSelectedProductForModal(reviewedProd)}
                className="text-xs text-stone-500 hover:text-[#DC143C] transition-colors flex items-center gap-1 pt-0.5 group"
              >
                <span>Wearing formulation:</span>
                <strong className="text-[#DC143C] underline">{reviewedProd.name}</strong>
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
              </button>
            )}

            {/* Interactive Helpful Vote Button */}
            <div className="mt-3 flex items-center gap-3">
              <button
                onClick={() => handleHelpfulClick(current.id)}
                className={`px-3 py-1 rounded-full text-xs transition-all flex items-center gap-1.5 border ${
                  isHelpfulVoted
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-semibold'
                    : 'bg-[#FAF6F0] hover:bg-white text-stone-600 border-[#E8DCD2]'
                }`}
                title="Mark this review as helpful"
              >
                <ThumbsUp className={`w-3.5 h-3.5 ${isHelpfulVoted ? 'fill-emerald-600' : ''}`} />
                <span>Helpful ({currentHelpful})</span>
              </button>
            </div>
          </div>

          {/* Carousel Navigation Buttons & Pagination Dots */}
          <div className="mt-8 pt-6 border-t border-[#F5E6DC] flex items-center justify-between">
            <button
              onClick={handlePrev}
              className="p-2.5 rounded-full border border-[#E8D4C8] hover:bg-[#FAF4EC] hover:text-[#DC143C] text-stone-700 transition-colors shadow-2xs"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {approvedReviews.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-200 ${
                    currentIndex === idx
                      ? 'w-7 bg-[#DC143C]'
                      : 'w-2 bg-[#E8D4C8] hover:bg-[#DC143C]/40'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="p-2.5 rounded-full border border-[#E8D4C8] hover:bg-[#FAF4EC] hover:text-[#DC143C] text-stone-700 transition-colors shadow-2xs"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* Interactive Write Review Modal */}
      {isWriteReviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#EEDFD5] shadow-2xl relative animate-scale-in text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#F2E3D5] pb-4 mb-5">
              <div>
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  Share Your Experience
                </h3>
                <p className="text-xs text-stone-500">
                  Help the Glossy Theory community discover their perfect match
                </p>
              </div>
              <button
                onClick={() => setIsWriteReviewOpen(false)}
                className="p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Product Formulation
                </label>
                <select
                  value={formProductId}
                  onChange={(e) => setFormProductId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF6F0] border border-[#EADBCE] rounded-xl text-stone-800 focus:outline-none focus:border-[#DC143C]"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (${p.price.toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Your Overall Rating
                </label>
                <div className="flex items-center gap-1.5 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setFormRating(star)}
                      className="p-1 text-2xl transition-transform hover:scale-115 focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= formRating
                            ? 'text-[#DC143C] fill-[#DC143C]'
                            : 'text-stone-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-[#DC143C] ml-2 font-mono">
                    {formRating}.0 / 5.0
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Your Name / Handle
                </label>
                <input
                  type="text"
                  placeholder="e.g. Elena Rostova"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF6F0] border border-[#EADBCE] rounded-xl text-stone-800 focus:outline-none focus:border-[#DC143C]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Review & Skin Feedback
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell us about the texture, finish, longevity, and how it felt on your skin..."
                  value={formComment}
                  onChange={(e) => setFormComment(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF6F0] border border-[#EADBCE] rounded-xl text-stone-800 focus:outline-none focus:border-[#DC143C]"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsWriteReviewOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#DC143C] hover:bg-[#B01030] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Verified Review</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
