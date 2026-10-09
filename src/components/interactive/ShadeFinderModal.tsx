import React, { useState } from 'react';
import { X, Sparkles, Check, ArrowRight, ArrowLeft, ShoppingBag, Heart, Star } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ShadeFinderModal: React.FC = () => {
  const { isShadeFinderOpen, setIsShadeFinderOpen, products, addToCart, showToast } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [skinTone, setSkinTone] = useState<'fair' | 'light-medium' | 'tan' | 'deep'>('light-medium');
  const [finish, setFinish] = useState<'dewy' | 'satin' | 'matte'>('dewy');
  const [lipVibe, setLipVibe] = useState<'crimson' | 'rose' | 'nude' | 'wine'>('crimson');

  if (!isShadeFinderOpen) return null;

  // Recommendations based on quiz
  const toneMap = {
    fair: { foundationShade: '01 Fair Alabaster', highlighter: 'Champagne Rose', toneName: 'Fair Porcelain' },
    'light-medium': { foundationShade: '02 Warm Bisque', highlighter: 'Champagne Rose', toneName: 'Light-Medium Warm' },
    tan: { foundationShade: '03 Golden Sand', highlighter: 'Golden Sunlight', toneName: 'Warm Golden Tan' },
    deep: { foundationShade: '05 Rich Espresso', highlighter: 'Bronze Mirage', toneName: 'Deep Rich Radiant' },
  };

  const lipMap = {
    crimson: { shade: 'Crimson Royalty', name: 'Bold Crimson' },
    rose: { shade: 'Rose Petal Velvet', name: 'Romantic Rose' },
    nude: { shade: 'Spiced Praline Nude', name: 'Effortless Nude' },
    wine: { shade: 'Midnight Wine', name: 'Dramatic Wine' },
  };

  const match = toneMap[skinTone];
  const lipMatch = lipMap[lipVibe];

  const foundationProd = products.find((p) => p.name.includes('Foundation')) || products[0];
  const lipstickProd = products.find((p) => p.name.includes('Lipstick')) || products[1];
  const highlighterProd = products.find((p) => p.name.includes('Highlighter')) || products[2];

  const handleAddBundleToBag = () => {
    if (foundationProd) addToCart(foundationProd, match.foundationShade, 1);
    if (lipstickProd) addToCart(lipstickProd, lipMatch.shade, 1);
    if (highlighterProd) addToCart(highlighterProd, match.highlighter, 1);
    setIsShadeFinderOpen(false);
    showToast('✨ Custom Luminous Routine added to bag with VIP discount!');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="bg-[#FCF9F5] rounded-3xl max-w-2xl w-full border border-[#EDE0D4] shadow-2xl relative overflow-hidden animate-scale-in">
        
        {/* Top ambient luxury bar */}
        <div className="bg-gradient-to-r from-[#DC143C] via-[#F75270] to-[#E28F83] h-2 w-full" />

        {/* Header */}
        <div className="p-6 bg-[#FAF5EE] border-b border-[#EDE0D4] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#FAF0E6] text-[#DC143C] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-semibold text-[#242220]">
                Virtual Shade Finder & Routine Matcher
              </h2>
              <p className="text-xs text-stone-500">
                Personalized beauty prescription formulated for your skin tone & undertone
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsShadeFinderOpen(false)}
            className="p-1.5 rounded-full hover:bg-stone-200 text-stone-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step tracker */}
        {step < 4 && (
          <div className="px-6 pt-3 pb-2 bg-white border-b border-[#F2E5DC] flex items-center justify-between text-[11px] font-semibold text-stone-500">
            <span className={step >= 1 ? 'text-[#DC143C]' : ''}>1. Complexion Tone</span>
            <span className={step >= 2 ? 'text-[#DC143C]' : ''}>2. Desired Finish</span>
            <span className={step >= 3 ? 'text-[#DC143C]' : ''}>3. Signature Lip</span>
          </div>
        )}

        <div className="p-6 sm:p-8">
          
          {/* STEP 1: SKIN TONE */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div className="text-center max-w-md mx-auto">
                <h3 className="font-serif text-2xl font-semibold text-stone-900">
                  Select your skin complexion depth
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Our mineral pigments melt seamlessly into cool, neutral, and warm undertones.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {[
                  { id: 'fair', label: 'Fair Alabaster', sub: 'Burn easily, porcelain', color: '#FBE9DC' },
                  { id: 'light-medium', label: 'Warm Bisque', sub: 'Light-Medium warm', color: '#EED3BE' },
                  { id: 'tan', label: 'Golden Sand', sub: 'Sun-kissed olive/tan', color: '#DFB897' },
                  { id: 'deep', label: 'Rich Espresso', sub: 'Deep rich chocolate', color: '#633B22' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSkinTone(item.id as any)}
                    className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      skinTone === item.id
                        ? 'border-[#DC143C] bg-white ring-2 ring-[#DC143C]/20 shadow-md scale-102'
                        : 'border-[#EDE0D4] bg-[#FAF8F5] hover:bg-white'
                    }`}
                  >
                    <span
                      className="w-10 h-10 rounded-full border border-black/10 shadow-xs mb-3"
                      style={{ backgroundColor: item.color }}
                    />
                    <div>
                      <p className="font-semibold text-xs text-stone-900">{item.label}</p>
                      <p className="text-[10px] text-stone-500 mt-0.5">{item.sub}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: FINISH */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div className="text-center max-w-md mx-auto">
                <h3 className="font-serif text-2xl font-semibold text-stone-900">
                  What is your ideal complexion finish?
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Choose how you want light to bounce off your cheekbones and cheek planes.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
                {[
                  {
                    id: 'dewy',
                    title: 'Luminous Glass Dew',
                    desc: 'Hydrated, lit-from-within glow with multidimensional pearl reflection.',
                  },
                  {
                    id: 'satin',
                    title: 'Airbrushed Satin',
                    desc: 'Natural skin-like texture with soft-focus blurring and 12-hour wear.',
                  },
                  {
                    id: 'matte',
                    title: 'Soft Velvet Matte',
                    desc: 'Zero-shine cloud skin with sebum-absorbing French clay and rose extract.',
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFinish(item.id as any)}
                    className={`p-5 rounded-2xl border text-left transition-all ${
                      finish === item.id
                        ? 'border-[#DC143C] bg-white ring-2 ring-[#DC143C]/20 shadow-md'
                        : 'border-[#EDE0D4] bg-[#FAF8F5] hover:bg-white'
                    }`}
                  >
                    <p className="font-serif text-sm font-semibold text-stone-900 mb-1">{item.title}</p>
                    <p className="text-xs text-stone-600 leading-relaxed">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: SIGNATURE LIP */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div className="text-center max-w-md mx-auto">
                <h3 className="font-serif text-2xl font-semibold text-stone-900">
                  Select your signature lip statement
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Cushion-matte velvety lipstick infused with botanical squalane.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {[
                  { id: 'crimson', name: 'Crimson Royalty', color: '#DC143C', desc: 'True iconic scarlet' },
                  { id: 'rose', name: 'Rose Petal Velvet', color: '#D75B70', desc: 'Romantic dusty rose' },
                  { id: 'nude', name: 'Spiced Praline Nude', color: '#B56E58', desc: 'Warm 90s cinnamon' },
                  { id: 'wine', name: 'Midnight Wine', color: '#681829', desc: 'Sultry deep bordeaux' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setLipVibe(item.id as any)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      lipVibe === item.id
                        ? 'border-[#DC143C] bg-white ring-2 ring-[#DC143C]/20 shadow-md scale-102'
                        : 'border-[#EDE0D4] bg-[#FAF8F5] hover:bg-white'
                    }`}
                  >
                    <span
                      className="w-10 h-10 rounded-full border border-black/10 shadow-xs mb-3 block"
                      style={{ backgroundColor: item.color }}
                    />
                    <p className="font-semibold text-xs text-stone-900">{item.name}</p>
                    <p className="text-[10px] text-stone-500 mt-0.5">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: PRESCRIPTION RESULTS */}
          {step === 4 && (
            <div className="space-y-6 text-center animate-scale-in">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FDEBD0] text-[#933D2D] rounded-full text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Your Bespoke Luminous Trio Match</span>
              </div>

              <h3 className="font-serif text-3xl font-semibold text-stone-900">
                The {match.toneName} Edit
              </h3>
              <p className="text-xs text-stone-600 max-w-md mx-auto">
                Calibrated precisely for your skin tone with a {finish} finish and {lipMatch.name} lip contrast.
              </p>

              {/* 3 Matched Products Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2 text-left">
                
                {/* 1. Foundation */}
                <div className="p-4 bg-white rounded-2xl border border-[#EDE0D4] shadow-xs flex flex-col justify-between space-y-2">
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#FAF6F0]">
                    <img src={foundationProd.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#DC143C]">Step 1: Complexion</span>
                    <h4 className="font-serif text-sm font-semibold text-stone-900">{foundationProd.name}</h4>
                    <p className="text-xs font-bold text-stone-700 mt-0.5">Matched Shade: {match.foundationShade}</p>
                  </div>
                  <span className="font-bold text-xs text-stone-900">${foundationProd.price.toFixed(2)}</span>
                </div>

                {/* 2. Highlighter */}
                <div className="p-4 bg-white rounded-2xl border border-[#EDE0D4] shadow-xs flex flex-col justify-between space-y-2">
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#FAF6F0]">
                    <img src={highlighterProd.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#DC143C]">Step 2: Radiance</span>
                    <h4 className="font-serif text-sm font-semibold text-stone-900">{highlighterProd.name}</h4>
                    <p className="text-xs font-bold text-stone-700 mt-0.5">Matched Shade: {match.highlighter}</p>
                  </div>
                  <span className="font-bold text-xs text-stone-900">${highlighterProd.price.toFixed(2)}</span>
                </div>

                {/* 3. Lipstick */}
                <div className="p-4 bg-white rounded-2xl border border-[#EDE0D4] shadow-xs flex flex-col justify-between space-y-2">
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#FAF6F0]">
                    <img src={lipstickProd.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#DC143C]">Step 3: Signature Lip</span>
                    <h4 className="font-serif text-sm font-semibold text-stone-900">{lipstickProd.name}</h4>
                    <p className="text-xs font-bold text-stone-700 mt-0.5">Matched Shade: {lipMatch.shade}</p>
                  </div>
                  <span className="font-bold text-xs text-stone-900">${lipstickProd.price.toFixed(2)}</span>
                </div>

              </div>

              {/* Bundle CTA */}
              <div className="pt-3">
                <button
                  type="button"
                  onClick={handleAddBundleToBag}
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#DC143C] hover:bg-[#B01030] text-white text-xs font-semibold uppercase tracking-wider rounded-full shadow-lg hover:shadow-xl transition-all inline-flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add Full Routine Trio to Bag (Bundle & Save 15%)</span>
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Modal Controls */}
        <div className="p-6 bg-[#FAF5EE] border-t border-[#EDE0D4] flex items-center justify-between">
          {step > 1 && step < 4 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s - 1) as any)}
              className="px-4 py-2 border rounded-full text-xs font-semibold text-stone-700 hover:bg-white flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : <div />}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s + 1) as any)}
              className="px-6 py-2.5 bg-[#DC143C] hover:bg-[#B01030] text-white text-xs font-semibold rounded-full flex items-center gap-1.5 shadow-sm"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : step === 3 ? (
            <button
              type="button"
              onClick={() => setStep(4)}
              className="px-6 py-2.5 bg-[#DC143C] hover:bg-[#B01030] text-white text-xs font-semibold rounded-full flex items-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Reveal My Match</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs text-stone-500 hover:text-stone-800 underline font-medium"
            >
              Retake Shade Quiz
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
