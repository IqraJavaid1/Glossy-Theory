import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Sparkles, Tag, ShieldCheck, Gift, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    setIsCheckoutOpen,
    selectedSample,
    setSelectedSample,
    showToast,
  } = useApp();

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [promoApplied, setPromoApplied] = useState(false);

  const sampleOptions = [
    { name: 'Mini Rose Glow Dew Drops (Deluxe Sample)', detail: 'Infused with Damask Rose' },
    { name: 'Velvet Lip Hydration Mask (Deluxe Sample)', detail: 'Peptide Squalane Balm' },
    { name: 'Radiance Silk Primer (Deluxe Sample)', detail: 'Pore-smoothing base' },
  ];

  if (!isCartOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = promoCode.trim().toUpperCase();
    if (cleanCode === 'GLOSSY15' || cleanCode === 'VIP15') {
      setDiscountPercent(15);
      setPromoApplied(true);
      showToast('Promo code applied! 15% discount activated.');
    } else if (cleanCode === 'GLOSSY20') {
      setDiscountPercent(20);
      setPromoApplied(true);
      showToast('Promo code applied! 20% discount activated.');
    } else {
      showToast('Invalid promo code. Try "GLOSSY15".');
    }
  };

  const freeShippingThreshold = 50.0;
  const discountAmount = (cartTotal * discountPercent) / 100;
  const subtotalAfterDiscount = Math.max(0, cartTotal - discountAmount);
  const qualifiesForFreeShipping = subtotalAfterDiscount >= freeShippingThreshold || cartTotal >= freeShippingThreshold;
  const shippingFee = cart.length === 0 ? 0 : qualifiesForFreeShipping ? 0.0 : 5.0;
  const estimatedTax = subtotalAfterDiscount * 0.08;
  const finalTotal = subtotalAfterDiscount + shippingFee + estimatedTax;

  const handleProceedToCheckout = () => {
    if (cart.length === 0) return;
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-[#EDE0D4] shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-6 bg-[#FAF6F0] border-b border-[#EDE0D4] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#DC143C]" />
              <h2 className="font-serif text-xl font-semibold text-[#242220]">
                Shopping Bag ({cart.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full hover:bg-stone-200 text-stone-500 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="px-6 py-3.5 bg-[#FFFDFB] border-b border-[#F2E5DC] text-xs">
            {qualifiesForFreeShipping ? (
              <p className="text-emerald-700 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>You unlocked Complimentary Luxury Delivery!</span>
              </p>
            ) : (
              <div>
                <div className="flex justify-between items-center text-[11px] mb-1">
                  <span className="text-stone-600">
                    Add <strong className="text-[#DC143C]">${(freeShippingThreshold - cartTotal).toFixed(2)}</strong> more for Free Shipping
                  </span>
                  <span className="text-stone-400 font-mono">
                    {Math.round((cartTotal / freeShippingThreshold) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#DC143C] to-[#F75270] h-full transition-all duration-300 rounded-full"
                    style={{ width: `${Math.min(100, (cartTotal / freeShippingThreshold) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#FAF0E6] text-[#DC143C] flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-lg text-stone-800">Your bag is empty</h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  Indulge in our collection of skin-loving foundations, highlighters, and velvet lip colors.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 px-6 py-2.5 bg-[#DC143C] text-white text-xs font-semibold rounded-full hover:bg-[#B01030] shadow-xs"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              <>
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3.5 rounded-2xl border border-[#F2E6DC] bg-[#FAF8F5]/60 hover:bg-[#FAF8F5] transition-colors"
                  >
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-20 h-20 object-cover rounded-xl bg-white border border-stone-200 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-serif text-sm font-semibold text-[#242220] leading-snug">
                            {item.productName}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-stone-400 hover:text-[#DC143C] p-0.5"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {item.shade && (
                          <p className="text-[11px] text-[#8C7A72] mt-0.5">
                            Shade: {item.shade}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#EFE2D6]">
                        {/* Stepper */}
                        <div className="flex items-center border border-[#E0D0C4] rounded-full bg-white px-2 py-0.5">
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="text-stone-500 hover:text-black text-xs font-bold px-1"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold px-2 text-stone-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                            className="text-stone-500 hover:text-black text-xs font-bold px-1 disabled:opacity-30"
                          >
                            +
                          </button>
                        </div>

                        {/* Line total */}
                        <span className="text-xs font-bold font-sans text-[#242220]">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Deluxe Complimentary Sample Gift Selector */}
                <div className="p-4 rounded-2xl bg-[#FAF5EE] border border-[#EBDCD0] space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-stone-800 flex items-center gap-1.5">
                      <Gift className="w-4 h-4 text-[#DC143C]" />
                      <span>Complimentary Deluxe Sample Gift</span>
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 uppercase">FREE</span>
                  </div>

                  <div className="space-y-1.5">
                    {sampleOptions.map((opt) => {
                      const isChosen = selectedSample === opt.name;
                      return (
                        <div
                          key={opt.name}
                          onClick={() => setSelectedSample(opt.name)}
                          className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-colors ${
                            isChosen
                              ? 'bg-white border-[#DC143C] text-stone-900 shadow-2xs'
                              : 'bg-white/60 border-stone-200 text-stone-600 hover:bg-white'
                          }`}
                        >
                          <div>
                            <p className="font-semibold text-[11px] leading-tight">{opt.name}</p>
                            <p className="text-[10px] text-stone-400">{opt.detail}</p>
                          </div>
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                              isChosen ? 'border-[#DC143C] bg-[#DC143C] text-white' : 'border-stone-300'
                            }`}
                          >
                            {isChosen && <Check className="w-2.5 h-2.5" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer & Checkout Calculations */}
          {cart.length > 0 && (
            <div className="p-6 bg-[#FAF6F0] border-t border-[#EDE0D4] space-y-4">
              
              {/* Promo code form */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Promo code (e.g. GLOSSY15)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-[#E0D0C4] rounded-full text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#DC143C]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-800 hover:bg-black text-white text-xs font-semibold rounded-full transition-colors"
                >
                  Apply
                </button>
              </form>

              {/* Price summary */}
              <div className="space-y-1.5 text-xs text-stone-600 pt-2 border-t border-[#EFE2D6]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-800">${cartTotal.toFixed(2)}</span>
                </div>
                {discountPercent > 0 && (
                  <div className="flex justify-between text-[#DC143C] font-semibold">
                    <span>Discount ({discountPercent}%)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span>{shippingFee === 0 ? <strong className="text-emerald-700">Free</strong> : `$${shippingFee.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (8%)</span>
                  <span>${estimatedTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#242220] pt-2 border-t border-[#EFE2D6]">
                  <span>Total Due</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 px-6 bg-[#DC143C] hover:bg-[#B01030] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>256-Bit SSL Encrypted</span>
                </span>
                <span>Includes Free Sample</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
