import React, { useState } from 'react';
import { Sparkles, ShoppingBag, Check, Heart, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import foundationImg from '../../assets/images/product_radiant_foundation_1791520443484.jpg';
import lipstickImg from '../../assets/images/product_velvet_lipstick_1791520454181.jpg';
import highlighterImg from '../../assets/images/product_glow_highlighter_1791520464425.jpg';

interface StepOption {
  name: string;
  shade: string;
  hex: string;
  desc: string;
}

export const RoutineBuilder: React.FC = () => {
  const { products, addToCart, showToast } = useApp();

  // Step 1: Base (Foundation)
  const foundationShades: StepOption[] = [
    { name: 'Radiant Foundation', shade: '01 Fair Alabaster', hex: '#F6E5D7', desc: 'Porcelain with neutral undertone' },
    { name: 'Radiant Foundation', shade: '02 Warm Bisque', hex: '#E5C0A0', desc: 'Light-medium with peachy warm undertone' },
    { name: 'Radiant Foundation', shade: '03 Golden Sand', hex: '#DFB897', desc: 'Medium tan with warm golden undertone' },
    { name: 'Radiant Foundation', shade: '04 Deep Amber', hex: '#A86A3E', desc: 'Rich warm bronze with amber undertone' },
    { name: 'Radiant Foundation', shade: '05 Rich Espresso', hex: '#583626', desc: 'Deep espresso with rich neutral undertone' },
  ];

  // Step 2: Glow (Highlighter)
  const highlighterShades: StepOption[] = [
    { name: 'Mineral Highlighter', shade: 'Champagne Rose', hex: '#F7D6C8', desc: 'Soft luminous pearl rose shimmer' },
    { name: 'Mineral Highlighter', shade: 'Golden Sunlight', hex: '#E8C59A', desc: 'Warm 24K gilded sunlight glow' },
    { name: 'Mineral Highlighter', shade: 'Bronze Mirage', hex: '#B87B4C', desc: 'Terracotta radiant sunset sheen' },
    { name: 'Mineral Highlighter', shade: 'Diamond Opal', hex: '#F5ECE5', desc: 'Icy multidimensional glass shine' },
  ];

  // Step 3: Pout (Lipstick)
  const lipstickShades: StepOption[] = [
    { name: 'Velvet Lipstick', shade: 'Crimson Royalty', hex: '#DC143C', desc: 'Iconic vivid ruby crimson velvet' },
    { name: 'Velvet Lipstick', shade: 'Rose Petal Velvet', hex: '#D75B70', desc: 'Romantic dusty rose satin finish' },
    { name: 'Velvet Lipstick', shade: 'Spiced Praline Nude', hex: '#C58371', desc: 'Warm caramelized nude neutral' },
    { name: 'Velvet Lipstick', shade: 'Midnight Wine', hex: '#722F37', desc: 'Sultry deep burgundy berry' },
  ];

  const [selectedFoundation, setSelectedFoundation] = useState<StepOption>(foundationShades[1]);
  const [selectedHighlighter, setSelectedHighlighter] = useState<StepOption>(highlighterShades[0]);
  const [selectedLipstick, setSelectedLipstick] = useState<StepOption>(lipstickShades[0]);
  const [activeStepTab, setActiveStepTab] = useState<'base' | 'glow' | 'lip'>('base');
  const [isAdded, setIsAdded] = useState(false);

  // Pricing: Foundation $32 + Highlighter $24 + Lipstick $22 = $78. Bundle discount 15% off = $66.30 (save $11.70)
  const originalPrice = 78.0;
  const bundlePrice = 66.3;
  const savings = 11.7;

  const handleAddCustomRitual = () => {
    const fProd = products.find((p) => p.name.includes('Foundation')) || products[0];
    const hProd = products.find((p) => p.name.includes('Highlighter')) || products[2];
    const lProd = products.find((p) => p.name.includes('Lipstick')) || products[1];

    if (fProd) addToCart(fProd, selectedFoundation.shade, 1);
    if (hProd) addToCart(hProd, selectedHighlighter.shade, 1);
    if (lProd) addToCart(lProd, selectedLipstick.shade, 1);

    setIsAdded(true);
    showToast('✨ Custom 3-Piece Radiance Ritual added to your bag!');
    setTimeout(() => setIsAdded(false), 2500);
  };

  return (
    <section className="py-16 sm:py-20 bg-[#FAF6F0] border-b border-[#F2E1D4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF0E6] text-[#DC143C] text-[10px] font-bold tracking-widest uppercase mb-3 border border-[#F2DECF]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Custom Ritual</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#242220] tracking-tight">
            Build Your 3-Piece Beauty Routine
          </h2>
          <p className="text-xs sm:text-sm text-[#7A6760] mt-2 max-w-md mx-auto">
            Customize your essential complexion triad: Base, Glow, and Lip. Enjoy instant 15% savings plus a complimentary gift box.
          </p>
          <div className="w-12 h-0.5 bg-[#DC143C] mx-auto mt-4 rounded-full" />
        </div>

        {/* Builder Container */}
        <div className="bg-white rounded-3xl border border-[#EDE2D8] shadow-lg overflow-hidden">
          
          {/* Step Selector Header Tabs */}
          <div className="grid grid-cols-3 border-b border-[#EDE2D8] bg-[#FAF5EE]">
            <button
              onClick={() => setActiveStepTab('base')}
              className={`p-4 sm:p-5 text-left transition-all flex items-center justify-between border-r border-[#EDE2D8] ${
                activeStepTab === 'base'
                  ? 'bg-white border-b-2 border-b-[#DC143C]'
                  : 'hover:bg-white/60 text-stone-600'
              }`}
            >
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#DC143C] block">
                  Step 01 • The Base
                </span>
                <span className="font-serif text-xs sm:text-sm font-bold text-stone-900 block truncate">
                  {selectedFoundation.shade}
                </span>
              </div>
              <span
                className="w-5 h-5 rounded-full border border-black/15 shadow-2xs shrink-0 hidden sm:block"
                style={{ backgroundColor: selectedFoundation.hex }}
              />
            </button>

            <button
              onClick={() => setActiveStepTab('glow')}
              className={`p-4 sm:p-5 text-left transition-all flex items-center justify-between border-r border-[#EDE2D8] ${
                activeStepTab === 'glow'
                  ? 'bg-white border-b-2 border-b-[#DC143C]'
                  : 'hover:bg-white/60 text-stone-600'
              }`}
            >
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#DC143C] block">
                  Step 02 • The Glow
                </span>
                <span className="font-serif text-xs sm:text-sm font-bold text-stone-900 block truncate">
                  {selectedHighlighter.shade}
                </span>
              </div>
              <span
                className="w-5 h-5 rounded-full border border-black/15 shadow-2xs shrink-0 hidden sm:block"
                style={{ backgroundColor: selectedHighlighter.hex }}
              />
            </button>

            <button
              onClick={() => setActiveStepTab('lip')}
              className={`p-4 sm:p-5 text-left transition-all flex items-center justify-between ${
                activeStepTab === 'lip'
                  ? 'bg-white border-b-2 border-b-[#DC143C]'
                  : 'hover:bg-white/60 text-stone-600'
              }`}
            >
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#DC143C] block">
                  Step 03 • The Pout
                </span>
                <span className="font-serif text-xs sm:text-sm font-bold text-stone-900 block truncate">
                  {selectedLipstick.shade}
                </span>
              </div>
              <span
                className="w-5 h-5 rounded-full border border-black/15 shadow-2xs shrink-0 hidden sm:block"
                style={{ backgroundColor: selectedLipstick.hex }}
              />
            </button>
          </div>

          {/* Builder Active Tab Body */}
          <div className="p-6 sm:p-8 lg:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Product Visual & Swatches */}
              <div className="lg:col-span-7 space-y-6">
                {activeStepTab === 'base' && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                          Select Your Radiant Foundation Shade
                        </h3>
                        <p className="text-xs text-stone-500 mt-0.5">
                          Hydrating, buildable medium coverage with light-diffusing botanical extracts.
                        </p>
                      </div>
                      <span className="text-xs font-bold text-stone-900 bg-stone-100 px-3 py-1 rounded-full">
                        $32.00 Value
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                      {foundationShades.map((f) => {
                        const isSelected = selectedFoundation.shade === f.shade;
                        return (
                          <button
                            key={f.shade}
                            onClick={() => setSelectedFoundation(f)}
                            className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                              isSelected
                                ? 'border-[#DC143C] bg-[#FFF8F7] ring-1 ring-[#DC143C] shadow-xs'
                                : 'border-[#EDE2D8] hover:border-stone-400 bg-white'
                            }`}
                          >
                            <span
                              className="w-8 h-8 rounded-full border border-black/15 shadow-inner shrink-0"
                              style={{ backgroundColor: f.hex }}
                            />
                            <div className="min-w-0">
                              <span className="font-serif text-xs font-bold text-stone-900 block truncate">
                                {f.shade}
                              </span>
                              <span className="text-[11px] text-stone-500 block truncate">
                                {f.desc}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {activeStepTab === 'glow' && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                          Choose Your Baked Highlighter Nuance
                        </h3>
                        <p className="text-xs text-stone-500 mt-0.5">
                          Micro-milled champagne and golden pearls for a glass-skin, seamless glow.
                        </p>
                      </div>
                      <span className="text-xs font-bold text-stone-900 bg-stone-100 px-3 py-1 rounded-full">
                        $24.00 Value
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                      {highlighterShades.map((h) => {
                        const isSelected = selectedHighlighter.shade === h.shade;
                        return (
                          <button
                            key={h.shade}
                            onClick={() => setSelectedHighlighter(h)}
                            className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                              isSelected
                                ? 'border-[#DC143C] bg-[#FFF8F7] ring-1 ring-[#DC143C] shadow-xs'
                                : 'border-[#EDE2D8] hover:border-stone-400 bg-white'
                            }`}
                          >
                            <span
                              className="w-8 h-8 rounded-full border border-black/15 shadow-inner shrink-0"
                              style={{ backgroundColor: h.hex }}
                            />
                            <div className="min-w-0">
                              <span className="font-serif text-xs font-bold text-stone-900 block truncate">
                                {h.shade}
                              </span>
                              <span className="text-[11px] text-stone-500 block truncate">
                                {h.desc}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {activeStepTab === 'lip' && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                          Pick Your Velvet Matte Lip Hue
                        </h3>
                        <p className="text-xs text-stone-500 mt-0.5">
                          Ultra-pigmented cushion formula enriched with hyaluronic spheres & wild rose oil.
                        </p>
                      </div>
                      <span className="text-xs font-bold text-stone-900 bg-stone-100 px-3 py-1 rounded-full">
                        $22.00 Value
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                      {lipstickShades.map((l) => {
                        const isSelected = selectedLipstick.shade === l.shade;
                        return (
                          <button
                            key={l.shade}
                            onClick={() => setSelectedLipstick(l)}
                            className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                              isSelected
                                ? 'border-[#DC143C] bg-[#FFF8F7] ring-1 ring-[#DC143C] shadow-xs'
                                : 'border-[#EDE2D8] hover:border-stone-400 bg-white'
                            }`}
                          >
                            <span
                              className="w-8 h-8 rounded-full border border-black/15 shadow-inner shrink-0"
                              style={{ backgroundColor: l.hex }}
                            />
                            <div className="min-w-0">
                              <span className="font-serif text-xs font-bold text-stone-900 block truncate">
                                {l.shade}
                              </span>
                              <span className="text-[11px] text-stone-500 block truncate">
                                {l.desc}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Quick Next / Prev buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-[#F2E5DC]">
                  {activeStepTab === 'base' ? (
                    <span className="text-xs text-stone-400">Step 1 of 3</span>
                  ) : activeStepTab === 'glow' ? (
                    <button
                      onClick={() => setActiveStepTab('base')}
                      className="text-xs font-bold text-stone-600 hover:text-stone-900"
                    >
                      ← Back to Base
                    </button>
                  ) : (
                    <button
                      onClick={() => setActiveStepTab('glow')}
                      className="text-xs font-bold text-stone-600 hover:text-stone-900"
                    >
                      ← Back to Glow
                    </button>
                  )}

                  {activeStepTab === 'base' && (
                    <button
                      onClick={() => setActiveStepTab('glow')}
                      className="px-5 py-2 bg-stone-900 hover:bg-black text-white text-xs font-bold rounded-full flex items-center gap-1.5 transition-colors"
                    >
                      <span>Next: The Glow</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {activeStepTab === 'glow' && (
                    <button
                      onClick={() => setActiveStepTab('lip')}
                      className="px-5 py-2 bg-stone-900 hover:bg-black text-white text-xs font-bold rounded-full flex items-center gap-1.5 transition-colors"
                    >
                      <span>Next: The Pout</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Right Summary & Checkout Box */}
              <div className="lg:col-span-5 bg-[#FAF4ED] rounded-3xl p-6 sm:p-7 border border-[#EADBCE] shadow-xs space-y-5">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-lg font-bold text-stone-900">
                    Your Custom Prescription
                  </h4>
                  <span className="bg-[#DC143C] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                    -15% Bundle
                  </span>
                </div>

                {/* Summary Items list */}
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded-xl border border-[#EDE2D8] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img src={foundationImg} alt="Base" className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <span className="text-[10px] uppercase font-bold text-stone-400 block">Base</span>
                        <span className="font-serif text-xs font-bold text-stone-800">{selectedFoundation.shade}</span>
                      </div>
                    </div>
                    <span className="w-4 h-4 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: selectedFoundation.hex }} />
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-[#EDE2D8] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img src={highlighterImg} alt="Glow" className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <span className="text-[10px] uppercase font-bold text-stone-400 block">Glow</span>
                        <span className="font-serif text-xs font-bold text-stone-800">{selectedHighlighter.shade}</span>
                      </div>
                    </div>
                    <span className="w-4 h-4 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: selectedHighlighter.hex }} />
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-[#EDE2D8] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img src={lipstickImg} alt="Lip" className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <span className="text-[10px] uppercase font-bold text-stone-400 block">Lip</span>
                        <span className="font-serif text-xs font-bold text-stone-800">{selectedLipstick.shade}</span>
                      </div>
                    </div>
                    <span className="w-4 h-4 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: selectedLipstick.hex }} />
                  </div>
                </div>

                {/* Free gift guarantee */}
                <div className="p-3 rounded-xl bg-[#FAF0E6] border border-[#F2DECF] text-[11px] text-[#8C3A2B] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 shrink-0 text-[#DC143C]" />
                  <span>Free Signature Rose Velvet Travel Pouch included!</span>
                </div>

                {/* Pricing Breakdown */}
                <div className="pt-3 border-t border-[#EADBCE]">
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <span>Individual Price:</span>
                    <span className="line-through">${originalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#DC143C] font-semibold mt-0.5">
                    <span>Bundle Discount (15%):</span>
                    <span>-${savings.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-base font-bold text-stone-900 mt-2 pt-2 border-t border-[#EADBCE]">
                    <span>Total Ritual Price:</span>
                    <span className="text-xl font-serif text-[#DC143C]">${bundlePrice.toFixed(2)}</span>
                  </div>
                </div>

                {/* Add to Bag Button */}
                <button
                  type="button"
                  onClick={handleAddCustomRitual}
                  className={`w-full py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md flex items-center justify-center gap-2 ${
                    isAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#DC143C] hover:bg-[#B01030] text-white hover:shadow-lg'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Ritual Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add 3-Piece Ritual to Bag</span>
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
