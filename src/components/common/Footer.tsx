import React, { useState } from 'react';
import { Logo } from './Logo';
import { Mail, Check, ArrowRight, Instagram, Facebook, Youtube, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { setActiveView, setSelectedCategoryFilter, setIsCartOpen, showToast } =
    useApp();

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showToast('Please enter a valid email address.');
      return;
    }
    setSubscribed(true);
    showToast('Thank you for subscribing to Glossy Theory beauty dispatches!');
    setNewsletterEmail('');
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#242220] text-[#E5D7D0] border-t border-[#3B3634] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section: Newsletter subscription bar */}
        <div className="bg-[#2F2C2A] rounded-2xl p-6 sm:p-8 border border-[#423C38] mb-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-6 space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#F75270]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The VIP Beauty Circle</span>
              </div>
              <h3 className="font-serif text-2xl text-white">
                Receive 15% off your first order & secret drops
              </h3>
              <p className="text-xs text-[#B5A49D]">
                Be the first to discover new shade formulations and editorial beauty masterclasses.
              </p>
            </div>

            <div className="lg:col-span-6">
              {subscribed ? (
                <div className="flex items-center gap-2 bg-[#DC143C]/20 border border-[#DC143C]/40 text-[#F7CAC9] px-4 py-3 rounded-full text-xs font-medium">
                  <Check className="w-4 h-4 text-[#F75270]" />
                  <span>You are subscribed! Check your inbox for code <strong>GLOSSY15</strong>.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      placeholder="Enter your email address..."
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      required
                      className="w-full pl-11 pr-4 py-3 text-xs bg-[#1C1A19] border border-[#4D4540] rounded-full text-white placeholder-stone-500 focus:outline-none focus:border-[#F75270]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#DC143C] hover:bg-[#B01030] text-white text-xs font-semibold rounded-full transition-colors flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <span>Subscribe</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Middle Section: Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="md" light={true} showText={true} />
            <p className="text-xs text-[#B5A49D] leading-relaxed max-w-sm mt-3">
              Glossy Theory creates luxury, dermatologist-formulated cosmetics celebrating modern elegance and unapologetic radiance. Cruelty-free and crafted for lasting perfection.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="w-8 h-8 rounded-full bg-[#332E2C] hover:bg-[#DC143C] flex items-center justify-center text-stone-300 hover:text-white transition-colors cursor-pointer" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </span>
              <span className="w-8 h-8 rounded-full bg-[#332E2C] hover:bg-[#DC143C] flex items-center justify-center text-stone-300 hover:text-white transition-colors cursor-pointer" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </span>
              <span className="w-8 h-8 rounded-full bg-[#332E2C] hover:bg-[#DC143C] flex items-center justify-center text-stone-300 hover:text-white transition-colors cursor-pointer" aria-label="YouTube">
                <Youtube className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Shop */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#FDEBD0]">
              Shop Collection
            </h4>
            <ul className="space-y-2 text-xs text-[#B5A49D]">
              <li>
                <button
                  onClick={() => {
                    setActiveView('shop');
                    setSelectedCategoryFilter(null);
                  }}
                  className="hover:text-white transition-colors"
                >
                  Shop All Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('shop');
                    setSelectedCategoryFilter('face');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Face & Foundation
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('shop');
                    setSelectedCategoryFilter('lips');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Velvet Lipsticks
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('shop');
                    setSelectedCategoryFilter('eyes');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Eyeshadow Palettes
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('shop');
                    setSelectedCategoryFilter('highlighter');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Glow Highlighters
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#FDEBD0]">
              Client Services
            </h4>
            <ul className="space-y-2 text-xs text-[#B5A49D]">
              <li>
                <a href="#help" onClick={(e) => { e.preventDefault(); showToast('Concierge team is available Mon-Sat 9AM-8PM EST.'); }} className="hover:text-white transition-colors">
                  Contact & Concierge
                </a>
              </li>
              <li>
                <a href="#shipping" onClick={(e) => { e.preventDefault(); showToast('Complimentary standard shipping on all orders over $50.'); }} className="hover:text-white transition-colors">
                  Shipping & Handling
                </a>
              </li>
              <li>
                <a href="#returns" onClick={(e) => { e.preventDefault(); showToast('30-day effortless return guarantee on all unopened makeup.'); }} className="hover:text-white transition-colors">
                  Returns & Exchanges
                </a>
              </li>
              <li>
                <a href="#track" onClick={(e) => { e.preventDefault(); setActiveView('tracker'); }} className="hover:text-white transition-colors">
                  Order Tracking
                </a>
              </li>
              <li>
                <a href="#shade" onClick={(e) => { e.preventDefault(); showToast('Virtual shade finder tool calibrated for all skin tones.'); }} className="hover:text-white transition-colors">
                  Shade Finder Match
                </a>
              </li>
            </ul>
          </div>

          {/* Account & Policies */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#FDEBD0]">
              Account & Legal
            </h4>
            <ul className="space-y-2 text-xs text-[#B5A49D]">
              <li>
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="hover:text-white transition-colors text-left"
                >
                  Shopping Bag
                </button>
              </li>
              <li>
                <a href="#privacy" onClick={(e) => { e.preventDefault(); showToast('Privacy Policy: Customer data is never sold or shared.'); }} className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" onClick={(e) => { e.preventDefault(); showToast('Terms of Service: Certified authentic luxury cosmetics.'); }} className="hover:text-white transition-colors">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#refund" onClick={(e) => { e.preventDefault(); showToast('Refund policy: 100% money back on eligible returns.'); }} className="hover:text-white transition-colors">
                  Refund & Cancellation
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#383330] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#8C7B74] gap-4">
          <p>© {currentYear} Glossy Theory Cosmetics Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Cruelty-Free Certified</span>
            <span>•</span>
            <span>Secure 256-Bit SSL Encrypted</span>
            <span>•</span>
            <span>Made with Clean Mineral Pigments</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
