import React, { useState } from 'react';
import { Sparkles, ShoppingBag, Check, ArrowRight, Eye, Layers, Palette } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import foundationImg from '../../assets/images/product_radiant_foundation_1791520443484.jpg';
import lipstickImg from '../../assets/images/product_velvet_lipstick_1791520454181.jpg';
import highlighterImg from '../../assets/images/product_glow_highlighter_1791520464425.jpg';
import eyeshadowImg from '../../assets/images/product_eyeshadow_palette_1791520475712.jpg';

interface LookProduct {
  name: string;
  category: string;
  shade: string;
  price: number;
  image: string;
  shadeHex: string;
}

interface CuratedLook {
  id: string;
  title: string;
  tagline: string;
  description: string;
  finish: string;
  vibe: string;
  coverImage: string;
  products: LookProduct[];
}

export const AtelierLookbook: React.FC = () => {
  const { products, addToCart, showToast, setSelectedProductForModal } = useApp();

  const looks: CuratedLook[] = [
    {
      id: 'look-parisian',
      title: 'Parisian Velvet Rouge',
      tagline: 'Iconic Evening Glamour',
      description: 'A timeless silhouette pairing luminous cashmere skin with a commanding crimson velvet pout and softly smoked mauve contour.',
      finish: 'Satin Luminous & Velvet Matte',
      vibe: 'Bold • Romantic • Classic',
      coverImage: lipstickImg,
      products: [
        {
          name: 'Velvet Matte Lipstick',
          category: 'Lips',
          shade: 'Crimson Royalty',
          price: 22.0,
          image: lipstickImg,
          shadeHex: '#DC143C',
        },
        {
          name: 'Radiant Luminous Foundation',
          category: 'Face',
          shade: '02 Warm Bisque',
          price: 32.0,
          image: foundationImg,
          shadeHex: '#E5C0A0',
        },
        {
          name: '12-Pan Rose Gold Eyeshadow',
          category: 'Eyes',
          shade: 'Mauve Silk & Copper',
          price: 38.0,
          image: eyeshadowImg,
          shadeHex: '#C08081',
        },
      ],
    },
    {
      id: 'look-golden-hour',
      title: 'Golden Hour Glass Skin',
      tagline: 'Lit-From-Within Radiance',
      description: 'High-dimension champagne highlights reflecting ambient light across cheekbones, anchored by an ultra-hydrating dewy veil.',
      finish: 'Glass-Skin Dewy Glow',
      vibe: 'Radiant • Youthful • Sun-kissed',
      coverImage: highlighterImg,
      products: [
        {
          name: 'Baked Mineral Highlighter',
          category: 'Face',
          shade: 'Champagne Rose',
          price: 24.0,
          image: highlighterImg,
          shadeHex: '#F7D6C8',
        },
        {
          name: 'Radiant Luminous Foundation',
          category: 'Face',
          shade: '03 Golden Sand',
          price: 32.0,
          image: foundationImg,
          shadeHex: '#DFB897',
        },
        {
          name: 'Velvet Matte Lipstick',
          category: 'Lips',
          shade: 'Rose Petal Velvet',
          price: 22.0,
          image: lipstickImg,
          shadeHex: '#D75B70',
        },
      ],
    },
    {
      id: 'look-minimalist-chic',
      title: 'Minimalist Cashmere Chic',
      tagline: 'Subtle Everyday Luxury',
      description: 'Effortless polished beauty crafted for the modern muse. Soft warm nudes that enhance natural bone structure without heaviness.',
      finish: 'Soft Focus Velvet',
      vibe: 'Modern • Understated • Polished',
      coverImage: foundationImg,
      products: [
        {
          name: 'Radiant Luminous Foundation',
          category: 'Face',
          shade: '01 Fair Alabaster',
          price: 32.0,
          image: foundationImg,
          shadeHex: '#F6E5D7',
        },
        {
          name: 'Baked Mineral Highlighter',
          category: 'Face',
          shade: 'Golden Sunlight',
          price: 24.0,
          image: highlighterImg,
          shadeHex: '#E8C59A',
        },
        {
          name: 'Velvet Matte Lipstick',
          category: 'Lips',
          shade: 'Spiced Praline Nude',
          price: 22.0,
          image: lipstickImg,
          shadeHex: '#C58371',
        },
      ],
    },
  ];

  const [activeLookId, setActiveLookId] = useState<string>('look-parisian');
  const [addedLookBundle, setAddedLookBundle] = useState<boolean>(false);

  const activeLook = looks.find((l) => l.id === activeLookId) || looks[0];

  // Calculate pricing with bundle discount (15% off)
  const fullPrice = activeLook.products.reduce((acc, p) => acc + p.price, 0);
  const bundleDiscount = 0.15;
  const bundlePrice = (fullPrice * (1 - bundleDiscount)).toFixed(2);
  const savings = (fullPrice * bundleDiscount).toFixed(2);

  const handleAddBundle = () => {
    activeLook.products.forEach((p) => {
      const matchProd = products.find((mp) => mp.name.toLowerCase().includes(p.name.toLowerCase().slice(0, 10))) || products[0];
      if (matchProd) {
        addToCart(matchProd, p.shade, 1);
      }
    });

    setAddedLookBundle(true);
    showToast(`✨ Added the complete "${activeLook.title}" look to your bag with 15% VIP bundle discount!`);
    setTimeout(() => setAddedLookBundle(false), 2500);
  };

  const handleQuickAddSingle = (p: LookProduct) => {
    const matchProd = products.find((mp) => mp.name.toLowerCase().includes(p.name.toLowerCase().slice(0, 10))) || products[0];
    if (matchProd) {
      addToCart(matchProd, p.shade, 1);
      showToast(`Added ${p.name} (${p.shade}) to bag!`);
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-[#FAF6F0] via-[#FDF9F5] to-[#FAF6F0] border-b border-[#F2E1D4] relative overflow-hidden">
      {/* Soft Ambient decorative backdrop blurs */}
      <div className="absolute top-1/4 right-5 w-80 h-80 bg-[#F7CAC9]/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-5 w-72 h-72 bg-[#FDEBD0]/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF0E6] text-[#DC143C] text-[10px] font-bold tracking-widest uppercase mb-3 border border-[#F2DECF]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Atelier Lookbook</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#242220] tracking-tight">
            Curated Celebrity Looks
          </h2>
          <p className="text-xs sm:text-sm text-[#7A6760] mt-2 max-w-md mx-auto">
            Explore editorial masterclasses designed by world-renowned runway artists. Select a signature look to customize and shop the ensemble.
          </p>
          <div className="w-12 h-0.5 bg-[#DC143C] mx-auto mt-4 rounded-full" />
        </div>

        {/* Look Selector Tabs */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-10 flex-wrap">
          {looks.map((look) => {
            const isActive = look.id === activeLookId;
            return (
              <button
                key={look.id}
                onClick={() => setActiveLookId(look.id)}
                className={`px-4 sm:px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 shadow-2xs ${
                  isActive
                    ? 'bg-[#DC143C] text-white shadow-md scale-102 ring-2 ring-[#DC143C]/30'
                    : 'bg-white hover:bg-stone-50 text-stone-700 border border-[#EADBCE]'
                }`}
              >
                <span>{look.title}</span>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
              </button>
            );
          })}
        </div>

        {/* Main Interactive Look Display */}
        <div className="bg-white rounded-3xl border border-[#EDE2D8] shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left Visual Column */}
            <div className="lg:col-span-5 relative bg-[#FAF4ED] p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#EADBCE]">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-stone-900 shadow-md group">
                <img
                  src={activeLook.coverImage}
                  alt={activeLook.title}
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                
                {/* Visual Overlay Tag */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 flex flex-col justify-between p-5 text-white">
                  <div className="flex justify-between items-start">
                    <span className="bg-[#DC143C] text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-xs">
                      Lookbook 0{looks.findIndex((l) => l.id === activeLookId) + 1}
                    </span>
                    <span className="bg-black/50 backdrop-blur-xs text-[10px] px-2.5 py-1 rounded-full text-[#FDEBD0]">
                      {activeLook.finish}
                    </span>
                  </div>

                  <div>
                    <p className="text-[11px] uppercase tracking-widest text-[#F7CAC9] font-semibold">
                      {activeLook.tagline}
                    </p>
                    <h3 className="font-serif text-2xl font-bold tracking-tight text-white mt-0.5">
                      {activeLook.title}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Look Attributes Strip */}
              <div className="mt-5 p-3.5 rounded-2xl bg-[#FAF1E8] border border-[#ECD9CB] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">Vibe</span>
                  <span className="font-semibold text-stone-800">{activeLook.vibe}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">Special Bundle</span>
                  <span className="font-bold text-[#DC143C]">Save 15%</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Products Breakdown Column */}
            <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center gap-2 text-[#DC143C] text-xs font-bold uppercase tracking-widest mb-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  <span>The 3-Piece Makeup Breakdown</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl text-stone-900 font-bold">
                  {activeLook.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                  {activeLook.description}
                </p>

                {/* 3 Interactive Items */}
                <div className="mt-6 space-y-3.5">
                  {activeLook.products.map((item, idx) => {
                    return (
                      <div
                        key={idx}
                        className="p-3.5 sm:p-4 rounded-2xl border border-[#EDE2D8] bg-[#FAF8F5] hover:bg-[#FFFDFB] hover:border-[#DC143C]/40 transition-all flex items-center justify-between gap-3 group"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-14 h-14 rounded-xl object-cover shrink-0 border border-[#EADBCE] bg-white shadow-2xs"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0">
                            <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                              Step 0{idx + 1} • {item.category}
                            </span>
                            <h4 className="font-serif text-sm font-semibold text-stone-900 truncate group-hover:text-[#DC143C] transition-colors">
                              {item.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span
                                className="w-3.5 h-3.5 rounded-full border border-black/15 shadow-2xs shrink-0"
                                style={{ backgroundColor: item.shadeHex }}
                              />
                              <span className="text-xs font-semibold text-stone-700 truncate">
                                Shade: {item.shade}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 shrink-0">
                          <span className="text-sm font-bold text-stone-900">
                            ${item.price.toFixed(2)}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleQuickAddSingle(item)}
                            className="px-3 py-1.5 bg-white hover:bg-[#DC143C] text-stone-700 hover:text-white border border-[#EADBCE] hover:border-[#DC143C] rounded-full text-[11px] font-semibold transition-all shadow-2xs flex items-center gap-1"
                            title={`Add ${item.name} to bag`}
                          >
                            <ShoppingBag className="w-3 h-3" />
                            <span className="hidden sm:inline">Add</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Bundle Checkout Box */}
              <div className="pt-6 border-t border-[#F2E5DC] bg-gradient-to-r from-[#FAF0E6]/50 via-white to-[#FCEEE9]/50 -mx-6 sm:-mx-8 lg:-mx-10 -mb-6 sm:-mb-8 lg:-mb-10 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-500 line-through">
                      ${fullPrice.toFixed(2)}
                    </span>
                    <span className="text-2xl font-serif font-bold text-[#DC143C]">
                      ${bundlePrice}
                    </span>
                    <span className="bg-[#DC143C] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                      Save ${savings}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Includes all 3 luxury essentials + complimentary satin travel pouch.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddBundle}
                  className={`px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md flex items-center justify-center gap-2 w-full sm:w-auto ${
                    addedLookBundle
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#DC143C] hover:bg-[#B01030] text-white hover:shadow-lg hover:scale-102'
                  }`}
                >
                  {addedLookBundle ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Look Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Shop Entire Look (-15%)</span>
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
