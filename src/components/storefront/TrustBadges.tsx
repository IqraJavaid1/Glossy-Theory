import React, { useState } from 'react';
import { ShieldCheck, Truck, HeartHandshake, RotateCcw, X, Sparkles, Check } from 'lucide-react';

export const TrustBadges: React.FC = () => {
  const [activeModalBadge, setActiveModalBadge] = useState<number | null>(null);

  const benefits = [
    {
      icon: ShieldCheck,
      title: 'Secure Checkout',
      subtitle: 'Shop with confidence.',
      detail:
        'All transactions are processed through tokenized, certified PCI-DSS Level 1 encryption. We never store raw card numbers. Apple Pay, Google Pay, and major credit cards supported.',
      perk: '256-Bit SSL Encrypted Vault',
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      subtitle: 'Get your beauty, faster.',
      detail:
        'Orders are packed in temperature-controlled luxury insulated packaging to protect delicate creams and pressed powders. Dispatched via DHL & FedEx Priority with real-time tracking.',
      perk: 'Complimentary shipping over $50',
    },
    {
      icon: HeartHandshake,
      title: 'Cruelty-Free Beauty',
      subtitle: 'Kind to animals, kind to you.',
      detail:
        'Glossy Theory is 100% cruelty-free and certified vegan. None of our mineral formulations or raw ingredients are ever tested on animals.',
      perk: 'Leaping Bunny & PETA Certified',
    },
    {
      icon: RotateCcw,
      title: 'Easy Returns',
      subtitle: 'Hassle-free shopping.',
      detail:
        'Try your cosmetics with complete peace of mind. If your shade isn’t an exact match, exchange or return it within 30 days using our prepaid return slip.',
      perk: '30-Day Shade Match Guarantee',
    },
  ];

  return (
    <>
      <section className="bg-[#FFFDFB] border-b border-[#F4E4D7] py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 lg:divide-x lg:divide-[#EEDFD2]">
            {benefits.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  onClick={() => setActiveModalBadge(index)}
                  className="flex items-center gap-3.5 sm:gap-4 lg:px-4 justify-start p-2.5 rounded-2xl hover:bg-[#FAF5EE] transition-all duration-200 cursor-pointer group"
                  title="Click to learn about our guarantee"
                >
                  <div className="w-11 h-11 shrink-0 rounded-2xl bg-[#FAF0E6] flex items-center justify-center text-[#DC143C] group-hover:bg-[#DC143C] group-hover:text-white transition-colors duration-200 shadow-2xs">
                    <Icon className="w-5 h-5 stroke-[1.75]" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs sm:text-sm font-semibold text-[#242220] tracking-tight group-hover:text-[#DC143C] transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-[#7A6964] mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Detail Modal on Click */}
      {activeModalBadge !== null && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 border border-[#EDE0D4] shadow-2xl relative animate-scale-in">
            <button
              onClick={() => setActiveModalBadge(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-stone-100 text-stone-500"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-[#FAF0E6] text-[#DC143C] flex items-center justify-center mb-4">
              {React.createElement(benefits[activeModalBadge].icon, { className: 'w-6 h-6 stroke-[1.75]' })}
            </div>

            <h3 className="font-serif text-xl font-semibold text-stone-900">
              {benefits[activeModalBadge].title}
            </h3>
            <p className="text-xs text-stone-600 mt-2 leading-relaxed">
              {benefits[activeModalBadge].detail}
            </p>

            <div className="mt-4 p-3 rounded-xl bg-[#FAF5EE] border border-[#EDE0D4] flex items-center gap-2 text-xs font-semibold text-emerald-800">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{benefits[activeModalBadge].perk}</span>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setActiveModalBadge(null)}
                className="px-5 py-2 bg-[#DC143C] text-white rounded-full text-xs font-semibold hover:bg-[#B01030]"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
