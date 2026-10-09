import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Sparkles,
  ShoppingBag,
  Gift,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PromoBanner } from '../../types';

export const HeroBanner: React.FC = () => {
  const {
    promoBanners,
    setActiveView,
    setSelectedCategoryFilter,
    setIsShadeFinderOpen,
    products,
    addToCart,
    showToast,
  } = useApp();

  // Active banners filtered
  const activeBanners = promoBanners.filter((b) => b.active);
  const banners = activeBanners.length > 0 ? activeBanners : promoBanners;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Quick shade preview states for interactivity
  const [activeQuickShade, setActiveQuickShade] = useState('Crimson Royalty');

  const heroShades = [
    { name: 'Crimson Royalty', hex: '#DC143C', desc: 'Satin Velvet Matte' },
    { name: 'Rose Petal Nude', hex: '#F75270', desc: 'Cashmere Nude' },
    { name: 'Soft Blush', hex: '#F7CAC9', desc: 'Silky Glow' },
    { name: 'Champagne Cream', hex: '#FDEBD0', desc: 'Warm Radiant Shimmer' },
  ];

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', listener);
    } else {
      mediaQuery.addListener(listener);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', listener);
      } else {
        mediaQuery.removeListener(listener);
      }
    };
  }, []);

  // Safe navigation helpers
  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  }, [banners.length]);

  const goToSlide = (idx: number) => {
    setCurrentIndex(idx);
  };

  // Autoplay rotation every 5.5 seconds (5500ms)
  useEffect(() => {
    if (!isPlaying || isHovered || isFocused || prefersReducedMotion || banners.length <= 1) {
      return;
    }

    const timer = setInterval(() => {
      goToNext();
    }, 5500);

    return () => clearInterval(timer);
  }, [isPlaying, isHovered, isFocused, prefersReducedMotion, banners.length, goToNext]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
    setTouchStartX(null);
  };

  // CTA Action Router
  const handleCtaClick = (banner: PromoBanner) => {
    if (banner.ctaTarget === 'skincare') {
      setActiveView('shop');
      setSelectedCategoryFilter('face');
      window.scrollTo({ top: 500, behavior: 'smooth' });
    } else if (banner.ctaTarget === 'makeup') {
      setActiveView('shop');
      setSelectedCategoryFilter('lips');
      window.scrollTo({ top: 500, behavior: 'smooth' });
    } else if (banner.ctaTarget === 'offers') {
      setActiveView('shop');
      setSelectedCategoryFilter(null);
      window.scrollTo({ top: 500, behavior: 'smooth' });
      showToast('Exclusive luxury gift sets & complimentary offers unlocked!');
    } else {
      setActiveView('shop');
      setSelectedCategoryFilter(null);
      window.scrollTo({ top: 500, behavior: 'smooth' });
    }
  };

  const handleQuickAddBestseller = (e: React.MouseEvent) => {
    e.stopPropagation();
    const prod =
      products.find((p) => p.isBestseller) ||
      products.find((p) => p.name.toLowerCase().includes('lipstick')) ||
      products[0];
    if (prod) {
      addToCart(prod, activeQuickShade, 1);
      showToast(`Added ${prod.name} (${activeQuickShade}) to your shopping bag!`);
    }
  };

  // Keyboard navigation on slider container
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goToPrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goToNext();
    }
  };

  const currentBanner = banners[currentIndex] || banners[0];

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-[#FAF5EE] via-[#FDF8F3] to-[#FCEEE9] border-b border-[#F2E1D4] select-none"
      aria-roledescription="carousel"
      aria-label="Promotional Beauty Campaigns"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      tabIndex={0}
    >
      {/* Soft Brand Ambient Glow Elements using Brand Palette (#F7CAC9, #FDEBD0, #F75270) */}
      <div
        className="absolute -top-24 right-1/4 w-[480px] h-[480px] bg-[#F7CAC9]/35 rounded-full blur-3xl pointer-events-none transition-transform duration-1000 ease-out"
        style={{
          transform: `translate(${currentIndex * 15}px, ${currentIndex * -10}px)`,
        }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-24 -left-20 w-[420px] h-[420px] bg-[#FDEBD0]/60 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 right-10 w-72 h-72 bg-[#F75270]/10 rounded-full blur-2xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 md:py-16 lg:py-20 relative z-10">
        <div className="relative min-h-[520px] sm:min-h-[500px] lg:min-h-[520px] flex items-center">
          {banners.map((banner, index) => {
            const isActive = index === currentIndex;
            return (
              <div
                key={banner.id}
                role="tabpanel"
                id={`hero-slide-${index}`}
                aria-label={`Slide ${index + 1} of ${banners.length}: ${banner.title}`}
                aria-hidden={!isActive}
                className={`w-full transition-all duration-700 ease-in-out ${
                  isActive
                    ? 'opacity-100 translate-x-0 relative z-10 pointer-events-auto'
                    : 'opacity-0 absolute inset-0 z-0 pointer-events-none' +
                      (index < currentIndex ? ' -translate-x-8' : ' translate-x-8')
                }`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
                  
                  {/* Left Column: Headline, Kicker, Description, and CTAs */}
                  <div className="lg:col-span-6 space-y-5 sm:space-y-6 text-center lg:text-left order-2 lg:order-1">
                    
                    {/* Promotional Kicker & Badge Cluster */}
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
                      <div className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.22em] uppercase text-[#DC143C]">
                        <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{banner.label || 'YOUR BEAUTY, YOUR RITUAL'}</span>
                      </div>

                      {banner.badge && (
                        <>
                          <span className="text-[#D1C2BB]" aria-hidden="true">
                            •
                          </span>
                          <span className="text-[11px] font-medium tracking-wider text-[#8A7973] uppercase">
                            {banner.badge}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Headline with Luxury Serif Typography */}
                    <h1 className="font-serif text-3.5xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#242220] leading-[1.12] text-balance">
                      {banner.title.split(' ').slice(0, -2).join(' ')}{' '}
                      <span className="block lg:inline font-serif italic text-[#DC143C]">
                        {banner.title.split(' ').slice(-2).join(' ')}
                      </span>
                    </h1>

                    {/* Configurable Promotion or Discount Label */}
                    {banner.discountBadge && (
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FDEBD0] border border-[#F5D4B2] text-xs font-semibold text-[#8C3A2B] shadow-2xs">
                        <Gift className="w-3.5 h-3.5 text-[#DC143C]" aria-hidden="true" />
                        <span>{banner.discountBadge}</span>
                      </div>
                    )}

                    {/* Supporting Body Prose */}
                    <p className="text-sm sm:text-base lg:text-lg text-[#61524F] font-normal max-w-xl mx-auto lg:mx-0 leading-relaxed text-balance">
                      {banner.description}
                    </p>

                    {/* CTAs with Crimson Red (#DC143C) Brand Anchor */}
                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                      <button
                        type="button"
                        onClick={() => handleCtaClick(banner)}
                        className="w-full sm:w-auto px-8 py-3.5 bg-[#DC143C] text-white text-xs font-bold tracking-wider uppercase rounded-full hover:bg-[#B01030] transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2.5 group cursor-pointer focus-visible:ring-2 focus-visible:ring-[#DC143C] focus-visible:ring-offset-2"
                      >
                        <span>{banner.ctaText}</span>
                        <ArrowRight
                          className="w-4 h-4 transition-transform group-hover:translate-x-1"
                          aria-hidden="true"
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveView('shop');
                          setSelectedCategoryFilter(null);
                          window.scrollTo({ top: 500, behavior: 'smooth' });
                        }}
                        className="w-full sm:w-auto px-7 py-3.5 bg-white/90 hover:bg-white text-[#242220] text-xs font-bold tracking-wider uppercase rounded-full border border-[#E8D4C5] hover:border-[#DC143C]/40 transition-all duration-200 shadow-2xs hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                      >
                        View Catalog
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsShadeFinderOpen(true)}
                        className="w-full sm:w-auto px-5 py-3.5 bg-[#FDEBD0]/80 hover:bg-[#FDEBD0] text-[#8C3A2B] text-xs font-bold tracking-wider uppercase rounded-full border border-[#F5D4B2] transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
                        title="Interactive Virtual Shade Concierge"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#DC143C]" aria-hidden="true" />
                        <span>Shade Quiz</span>
                      </button>
                    </div>

                    {/* Interactive Nuance Swatch Selector */}
                    <div className="pt-3 border-t border-[#F2E0D2] flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 text-xs">
                      <span className="font-semibold text-stone-700 text-[11px] uppercase tracking-wider">
                        Signature Nuance:
                      </span>
                      <div className="flex items-center gap-2">
                        {heroShades.map((shade) => (
                          <button
                            key={shade.name}
                            type="button"
                            onClick={() => setActiveQuickShade(shade.name)}
                            className={`group relative p-1 rounded-full border-2 transition-all cursor-pointer ${
                              activeQuickShade === shade.name
                                ? 'border-[#DC143C] scale-110 shadow-xs'
                                : 'border-transparent hover:border-stone-300'
                            }`}
                            aria-label={`Select nuance ${shade.name}`}
                            title={`${shade.name} — ${shade.desc}`}
                          >
                            <span
                              className="block w-5 h-5 rounded-full border border-black/10 shadow-inner"
                              style={{ backgroundColor: shade.hex }}
                            />
                          </button>
                        ))}
                        <span className="text-xs text-[#DC143C] font-semibold pl-1">
                          {activeQuickShade}
                        </span>
                      </div>
                    </div>

                    {/* Editorial Brand Values Footer */}
                    <div className="pt-1 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-[#7A6964]">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#DC143C]" aria-hidden="true" />
                        <span>100% Vegan & Cruelty-Free</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#DC143C]" aria-hidden="true" />
                        <span>Dermatologist Approved</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#DC143C]" aria-hidden="true" />
                        <span>Recyclable Luxury Glass</span>
                      </div>
                    </div>

                  </div>

                  {/* Right Column: High-Resolution Beauty Campaign Visual */}
                  <div className="lg:col-span-6 relative order-1 lg:order-2">
                    <div className="relative mx-auto max-w-md lg:max-w-none">
                      
                      {/* Brand Palette Glow Frame */}
                      <div
                        className="absolute -inset-3 rounded-3xl blur-md opacity-70 transition-opacity duration-700 pointer-events-none"
                        style={{
                          background:
                            index % 2 === 0
                              ? 'linear-gradient(135deg, rgba(247,202,201,0.5), rgba(253,235,208,0.7), rgba(247,82,112,0.3))'
                              : 'linear-gradient(135deg, rgba(253,235,208,0.6), rgba(247,202,201,0.5), rgba(220,20,60,0.25))',
                        }}
                        aria-hidden="true"
                      />

                      {/* Image Showcase Card */}
                      <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/80 bg-white group aspect-[16/10] sm:aspect-[16/10] lg:aspect-[16/10]">
                        <img
                          src={banner.image}
                          alt={banner.title}
                          className="w-full h-full object-cover object-center transform group-hover:scale-103 transition-transform duration-700 ease-out"
                          referrerPolicy="no-referrer"
                          loading={index === 0 ? 'eager' : 'lazy'}
                        />

                        {/* Soft Ambient Scrim for Visual Balance */}
                        <div
                          className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none"
                          aria-hidden="true"
                        />

                        {/* Interactive Floating Quick-Action Pill */}
                        <div className="absolute bottom-4 left-4 right-4 sm:right-auto bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-[#F5E2D5] flex items-center justify-between sm:justify-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#FAF4EC] flex items-center justify-center p-1.5 border border-[#F0E2D8] shrink-0 text-[#DC143C]">
                            <ShoppingBag className="w-5 h-5" aria-hidden="true" />
                          </div>
                          <div className="text-left pr-1">
                            <p className="text-[10px] uppercase tracking-wider text-[#917B74] font-bold">
                              {banner.subtitle}
                            </p>
                            <p className="text-xs font-serif font-bold text-[#242220]">
                              {activeQuickShade}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={handleQuickAddBestseller}
                            className="ml-auto px-3 py-1.5 bg-[#DC143C] hover:bg-[#B01030] text-white rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors shadow-2xs cursor-pointer"
                            title="Quick Add to Bag"
                          >
                            Quick Add
                          </button>
                        </div>

                      </div>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Carousel Slider Navigation Controls: Prev, Next, Dots, and Pause/Play */}
        <div className="mt-8 pt-4 border-t border-[#F2E0D2]/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Left: Thumbnail & Banner Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 sm:pb-0 scrollbar-none">
            {banners.map((banner, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={banner.id}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    isActive
                      ? 'bg-[#DC143C] text-white shadow-xs font-semibold'
                      : 'bg-white/80 hover:bg-white text-[#524441] border border-[#EADBCE]'
                  }`}
                  aria-label={`Switch to banner ${idx + 1}: ${banner.title}`}
                  aria-pressed={isActive}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden="true" />
                  <span className="truncate max-w-[120px] sm:max-w-[140px]">
                    {banner.title.split(' ')[0]} {banner.title.split(' ')[1] || ''}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right: Slider Controls (Previous, Next, Dots, Autoplay Toggle) */}
          <div className="flex items-center gap-3">
            
            {/* Pagination Dots */}
            <div className="flex items-center gap-1.5 px-2" role="tablist" aria-label="Banner slides">
              {banners.map((_, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={idx}
                    type="button"
                    role="tab"
                    id={`dot-${idx}`}
                    aria-selected={isActive}
                    aria-controls={`hero-slide-${idx}`}
                    aria-label={`Go to slide ${idx + 1}`}
                    onClick={() => goToSlide(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                      isActive
                        ? 'w-7 bg-[#DC143C]'
                        : 'w-2.5 bg-[#DBC4B8] hover:bg-[#C2A89C]'
                    }`}
                  />
                );
              })}
            </div>

            {/* Prev & Next Arrows */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={goToPrev}
                className="w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#242220] hover:text-[#DC143C] border border-[#EADBCE] shadow-2xs hover:shadow-xs flex items-center justify-center transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#DC143C]"
                aria-label="Previous promotional banner"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={goToNext}
                className="w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#242220] hover:text-[#DC143C] border border-[#EADBCE] shadow-2xs hover:shadow-xs flex items-center justify-center transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#DC143C]"
                aria-label="Next promotional banner"
              >
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {/* Autoplay Play/Pause Toggle */}
            <button
              type="button"
              onClick={() => setIsPlaying((prev) => !prev)}
              className="w-9 h-9 rounded-full bg-[#FAF0E6] hover:bg-[#FCE5D8] text-[#8C3A2B] border border-[#F2D1C2] shadow-2xs flex items-center justify-center transition-all cursor-pointer"
              aria-label={isPlaying ? 'Pause banner slideshow' : 'Start banner slideshow'}
              title={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
            >
              {isPlaying ? (
                <Pause className="w-3.5 h-3.5" aria-hidden="true" />
              ) : (
                <Play className="w-3.5 h-3.5 ml-0.5" aria-hidden="true" />
              )}
            </button>

          </div>

        </div>

      </div>
    </section>
  );
};
