import React, { useState } from 'react';
import {
  Sparkles,
  X,
  MessageCircle,
  Copy,
  Check,
  Package,
  Search,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Heart,
  Palette,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import brandLogo from '../../assets/images/logo.png';

export const FloatingConcierge: React.FC = () => {
  const {
    setIsShadeFinderOpen,
    setActiveView,
    setSearchQuery,
    showToast,
    orders,
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [quickTrackQuery, setQuickTrackQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleCopyCode = () => {
    navigator.clipboard?.writeText('GLOSSY15');
    setCopiedCode(true);
    showToast('Promo code GLOSSY15 copied to clipboard! Enjoy 15% off.');
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickTrackQuery.trim()) {
      setActiveView('tracker');
      setIsOpen(false);
    }
  };

  const faqs = [
    {
      q: 'How do I find my exact foundation shade & undertone?',
      a: 'Take our 30-second Virtual Shade Finder! It diagnoses your skin tone depth and warm, neutral, or cool undertone for a flawless, undetectable match.',
    },
    {
      q: 'Are Glossy Theory cosmetics clean, vegan, and cruelty-free?',
      a: 'Yes, 100%! All formulas are Leaping Bunny certified cruelty-free, vegan, formulated without parabens, sulfates, synthetic fragrances, or talc.',
    },
    {
      q: 'What is your 30-Day Shade Guarantee?',
      a: 'If your shade match isn’t completely perfect, we will exchange it for your true match or provide a full refund within 30 days, completely free of charge.',
    },
  ];

  return (
    <>
      {/* Floating Action Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#1C1A19] text-[#FDEBD0] shadow-2xl hover:bg-[#DC143C] transition-all duration-300 hover:scale-105 border border-[#423C38] hover:border-[#DC143C]"
            aria-label="Open Glossy Theory Beauty Concierge"
          >
            {/* Ambient pulse effect */}
            <span className="absolute -inset-1 rounded-full bg-[#DC143C]/30 blur-xs group-hover:bg-[#DC143C]/60 transition-all pointer-events-none" />
            
            <span className="relative w-7 h-7 rounded-full bg-[#FAF5EE] p-0.5 shrink-0 flex items-center justify-center">
              <img src={brandLogo} alt="Concierge" className="w-full h-full object-contain" />
            </span>

            <span className="relative text-xs font-bold tracking-wider uppercase font-sans">
              VIP Atelier Concierge
            </span>

            <Sparkles className="relative w-3.5 h-3.5 text-[#F75270] group-hover:text-white" />
          </button>
        )}
      </div>

      {/* Concierge Modal / Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[400px] max-h-[85vh] bg-[#FFFDFB] rounded-3xl border border-[#EDE0D4] shadow-2xl flex flex-col overflow-hidden animate-scale-in">
          
          {/* Header */}
          <div className="bg-[#1C1A19] text-[#FDEBD0] p-4 sm:p-5 flex items-center justify-between border-b border-[#332D2A]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#FAF5EE] p-1 flex items-center justify-center shrink-0">
                <img src={brandLogo} alt="Glossy Theory" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="font-serif text-sm font-bold text-white tracking-wide">
                  Glossy Theory Concierge
                </h3>
                <p className="text-[10px] text-[#CBB9B0] uppercase tracking-wider">
                  Always-On Beauty Atelier Assistant
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white transition-colors"
              aria-label="Close concierge"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-5 overflow-y-auto space-y-4 max-h-[70vh]">
            
            {/* Promo Code Card */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#FAF0E6] to-[#FCEEE9] border border-[#F2DECF] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#DC143C] block">
                  VIP Welcome Privilege
                </span>
                <span className="font-serif text-xs font-bold text-stone-900 block mt-0.5">
                  15% Off Your Entire Order
                </span>
              </div>
              <button
                onClick={handleCopyCode}
                className="px-3 py-1.5 rounded-full bg-white hover:bg-[#DC143C] text-stone-800 hover:text-white text-xs font-mono font-bold tracking-wider border border-[#EADBCE] hover:border-[#DC143C] transition-all flex items-center gap-1.5 shadow-2xs"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-stone-500" />
                    <span>GLOSSY15</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Interactive Actions Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => {
                  setIsShadeFinderOpen(true);
                  setIsOpen(false);
                }}
                className="p-3 rounded-2xl bg-[#FAF6F0] hover:bg-[#FDEBD0]/60 border border-[#EDE2D8] hover:border-[#DC143C]/40 text-left transition-all group"
              >
                <div className="w-7 h-7 rounded-xl bg-white text-[#DC143C] flex items-center justify-center mb-2 shadow-2xs group-hover:scale-110 transition-transform">
                  <Palette className="w-3.5 h-3.5" />
                </div>
                <span className="font-serif text-xs font-bold text-stone-900 block">
                  Shade Finder
                </span>
                <span className="text-[10px] text-stone-500 block">
                  30-sec undertone quiz
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveView('shop');
                  setIsOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="p-3 rounded-2xl bg-[#FAF6F0] hover:bg-[#FDEBD0]/60 border border-[#EDE2D8] hover:border-[#DC143C]/40 text-left transition-all group"
              >
                <div className="w-7 h-7 rounded-xl bg-white text-[#DC143C] flex items-center justify-center mb-2 shadow-2xs group-hover:scale-110 transition-transform">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span className="font-serif text-xs font-bold text-stone-900 block">
                  Shop Collection
                </span>
                <span className="text-[10px] text-stone-500 block">
                  Bestsellers & novelties
                </span>
              </button>
            </div>

            {/* Quick Track An Order Input */}
            <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EADBCE]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5 mb-2">
                <Package className="w-3 h-3 text-[#DC143C]" />
                Track Your Luxury Dispatch
              </span>
              <form onSubmit={handleTrackSubmit} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Order # (e.g. GT-88419)"
                  value={quickTrackQuery}
                  onChange={(e) => setQuickTrackQuery(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs bg-white border border-[#EADBCE] rounded-xl text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#DC143C]"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-[#1C1A19] hover:bg-[#DC143C] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

            {/* Interactive FAQs Accordion */}
            <div className="pt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-2">
                Frequently Inquired
              </span>
              <div className="space-y-2">
                {faqs.map((faq, idx) => {
                  const isExpanded = openFaq === idx;
                  return (
                    <div
                      key={idx}
                      className="border border-[#EADBCE] rounded-xl overflow-hidden bg-white text-xs"
                    >
                      <button
                        onClick={() => setOpenFaq(isExpanded ? null : idx)}
                        className="w-full p-3 text-left font-semibold text-stone-800 flex items-center justify-between gap-2 hover:bg-[#FAF6F0] transition-colors"
                      >
                        <span className="text-[11px] font-serif">{faq.q}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        )}
                      </button>
                      {isExpanded && (
                        <div className="px-3 pb-3 pt-1 text-[11px] text-stone-600 border-t border-[#F2E5DC] leading-relaxed bg-[#FCFBF9]">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Footer note */}
          <div className="p-3 bg-[#FAF5EE] border-t border-[#EDE0D4] text-center text-[10px] text-stone-500">
            Dermatologist-Formulated • 100% Cruelty-Free • 30-Day Shade Guarantee
          </div>

        </div>
      )}
    </>
  );
};
