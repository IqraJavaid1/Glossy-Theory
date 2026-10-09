import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  CreditCard,
  Truck,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Lock,
  Package,
  Calendar,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order, ShippingAddress } from '../../types';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartTotal,
    createOrder,
    setTrackingOrderNumber,
    setActiveView,
    showToast,
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form State
  const [formData, setFormData] = useState<ShippingAddress>({
    fullName: '',
    email: '',
    phone: '+1 (555) 349-8210',
    street: '184 Fifth Avenue, Suite 6A',
    city: 'New York',
    state: 'NY',
    postalCode: '10010',
    country: 'United States',
  });

  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');

  // Payment State
  const [cardName, setCardName] = useState('Valued Client');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('884');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  if (!isCheckoutOpen) return null;

  // Pricing calculations
  const discountAmount = 0; // if pre-applied
  const subtotal = cartTotal;
  const qualifiesForFreeShipping = subtotal >= 50.0;
  const shippingFee = shippingMethod === 'standard' ? (qualifiesForFreeShipping ? 0.0 : 5.0) : 12.0;
  const tax = subtotal * 0.08;
  const total = subtotal + shippingFee + tax - discountAmount;

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.fullName || !formData.email || !formData.street || !formData.city) {
        showToast('Please fill in all delivery details.');
        return;
      }
    }
    setStep((s) => (s + 1) as any);
  };

  const handlePrevStep = () => {
    setStep((s) => Math.max(1, s - 1) as any);
  };

  const handleCompletePayment = () => {
    setIsProcessingPayment(true);

    // Simulate secure tokenized gateway handshake
    setTimeout(() => {
      const order = createOrder({
        customerName: formData.fullName,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress: formData,
        items: [...cart],
        subtotal,
        shippingFee,
        discount: discountAmount,
        tax,
        total,
        paymentMethod: `Credit Card (Visa ending in ${cardNumber.slice(-4) || '4242'})`,
        paymentStatus: 'Paid',
        fulfillmentStatus: 'Order Placed',
        estimatedDelivery: shippingMethod === 'express' ? 'Within 2 Days' : '3-5 Business Days',
      });

      setConfirmedOrder(order);
      setIsProcessingPayment(false);
      setStep(5);
      showToast(`Payment confirmed! Order #${order.orderNumber} successfully placed.`);
    }, 1400);
  };

  const handleTrackThisOrder = () => {
    if (confirmedOrder) {
      setTrackingOrderNumber(confirmedOrder.orderNumber);
      setIsCheckoutOpen(false);
      setActiveView('tracker');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-[#EDE0D4] shadow-2xl relative">
        
        {/* Header Bar */}
        <div className="p-6 bg-[#FAF6F0] border-b border-[#EDE0D4] flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl font-semibold text-[#242220]">
              {step === 5 ? 'Order Confirmation' : 'Secure Checkout'}
            </h2>
            <p className="text-xs text-stone-500">
              {step === 1 && 'Step 1 of 4: Customer & Delivery Address'}
              {step === 2 && 'Step 2 of 4: Shipping Method'}
              {step === 3 && 'Step 3 of 4: Order Verification'}
              {step === 4 && 'Step 4 of 4: Payment Details (Encrypted)'}
              {step === 5 && 'Success: Thank you for your order!'}
            </p>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 rounded-full hover:bg-stone-200 text-stone-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Indicators */}
        {step < 5 && (
          <div className="px-6 pt-4 pb-2 border-b border-[#F2E5DC] bg-white">
            <div className="flex items-center justify-between text-[11px] font-semibold text-stone-600">
              <span className={step >= 1 ? 'text-[#DC143C]' : ''}>1. Address</span>
              <span className={step >= 2 ? 'text-[#DC143C]' : ''}>2. Delivery</span>
              <span className={step >= 3 ? 'text-[#DC143C]' : ''}>3. Review</span>
              <span className={step >= 4 ? 'text-[#DC143C]' : ''}>4. Payment</span>
            </div>
            <div className="w-full bg-stone-100 h-1 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-[#DC143C] h-full transition-all duration-300"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Step Content */}
        <div className="p-6 sm:p-8">
          
          {/* STEP 1: CUSTOMER & ADDRESS */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#E0D0C4] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#DC143C]"
                    placeholder="e.g. Elena Rostova"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#E0D0C4] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#DC143C]"
                    placeholder="elena@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E0D0C4] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#DC143C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E0D0C4] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#DC143C]"
                  placeholder="Apartment, suite, unit, building, floor"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#E0D0C4] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#DC143C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    State / Region *
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#E0D0C4] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#DC143C]"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#E0D0C4] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#DC143C]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: SHIPPING METHOD */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-xs text-stone-600 mb-2">
                Select your preferred delivery carrier service:
              </p>

              {/* Standard */}
              <label
                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                  shippingMethod === 'standard'
                    ? 'border-[#DC143C] bg-[#FAF5F2]'
                    : 'border-[#EDE0D4] hover:bg-stone-50'
                }`}
              >
                <input
                  type="radio"
                  name="shipping"
                  checked={shippingMethod === 'standard'}
                  onChange={() => setShippingMethod('standard')}
                  className="mt-1 accent-[#DC143C]"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-stone-900">
                      Standard Beauty Courier (3–5 Business Days)
                    </span>
                    <span className="font-bold text-xs text-[#242220]">
                      {qualifiesForFreeShipping ? (
                        <span className="text-emerald-700">Free</span>
                      ) : (
                        '$5.00'
                      )}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Insured temperature-controlled cosmetic shipping. Free for orders over $50.
                  </p>
                </div>
              </label>

              {/* Express */}
              <label
                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                  shippingMethod === 'express'
                    ? 'border-[#DC143C] bg-[#FAF5F2]'
                    : 'border-[#EDE0D4] hover:bg-stone-50'
                }`}
              >
                <input
                  type="radio"
                  name="shipping"
                  checked={shippingMethod === 'express'}
                  onChange={() => setShippingMethod('express')}
                  className="mt-1 accent-[#DC143C]"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-stone-900">
                      Express Courier Priority (1–2 Business Days)
                    </span>
                    <span className="font-bold text-xs text-[#242220]">$12.00</span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Guaranteed expedited delivery via FedEx Priority with signature confirmation.
                  </p>
                </div>
              </label>
            </div>
          )}

          {/* STEP 3: ORDER REVIEW */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="bg-[#FAF6F0] p-4 rounded-xl border border-[#EDE0D4] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-500">Shipping to:</span>
                  <span className="font-semibold text-stone-800 text-right">
                    {formData.fullName}, {formData.street}, {formData.city} {formData.postalCode}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Carrier method:</span>
                  <span className="font-semibold text-stone-800">
                    {shippingMethod === 'standard' ? 'Standard Courier' : 'Express Priority'}
                  </span>
                </div>
              </div>

              {/* Items summary */}
              <div className="max-h-44 overflow-y-auto space-y-2 border-y border-[#EDE0D4] py-3">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <img
                        src={item.image}
                        alt=""
                        className="w-9 h-9 object-cover rounded-md bg-stone-100"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <p className="font-semibold text-stone-900 line-clamp-1">{item.productName}</p>
                        <p className="text-[10px] text-stone-500">
                          Qty: {item.quantity} {item.shade && `• ${item.shade}`}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-stone-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price summary */}
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span>${shippingFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#242220] pt-2 border-t border-[#EDE0D4]">
                  <span>Total Amount</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: ONLINE PAYMENT */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="p-3 bg-[#FAF5EE] rounded-xl border border-[#E8D8CC] flex items-center justify-between text-xs">
                <span className="font-semibold text-stone-800">Total Due:</span>
                <span className="font-bold text-base text-[#DC143C]">${total.toFixed(2)}</span>
              </div>

              {/* Card Form */}
              <div className="space-y-3 bg-white p-4 rounded-xl border border-[#EDE0D4]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-[#DC143C]" />
                    <span>Credit or Debit Card</span>
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-sm">
                    Sandbox Verified
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-stone-600 mb-0.5">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#E0D0C4] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#DC143C]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-stone-600 mb-0.5">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#E0D0C4] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#DC143C]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-0.5">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 text-xs border border-[#E0D0C4] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#DC143C]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-0.5">
                      Security Code (CVV)
                    </label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="•••"
                      maxLength={4}
                      className="w-full px-3 py-2 text-xs border border-[#E0D0C4] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#DC143C]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-stone-500">
                <Lock className="w-3.5 h-3.5 text-stone-400" />
                <span>Your financial credentials are tokenized and processed via certified PCI-DSS payment vault.</span>
              </div>
            </div>
          )}

          {/* STEP 5: ORDER CONFIRMATION */}
          {step === 5 && confirmedOrder && (
            <div className="text-center py-4 space-y-5 animate-scale-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="font-serif text-2xl text-[#242220]">
                  Thank You, {confirmedOrder.customerName}!
                </h3>
                <p className="text-xs text-stone-600 mt-1">
                  Your luxury order has been placed and received by our atelier.
                </p>
              </div>

              {/* Order Card */}
              <div className="bg-[#FAF6F0] rounded-2xl p-5 border border-[#EDE0D4] text-left max-w-md mx-auto space-y-3 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-[#E8DACD]">
                  <span className="text-stone-500 font-medium">Order Reference</span>
                  <span className="font-mono font-bold text-sm text-[#DC143C]">
                    #{confirmedOrder.orderNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Estimated Delivery</span>
                  <span className="font-semibold text-stone-800">
                    {confirmedOrder.estimatedDelivery}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Payment Status</span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Paid (${confirmedOrder.total.toFixed(2)})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Shipping Address</span>
                  <span className="text-stone-700 text-right truncate max-w-[200px]">
                    {confirmedOrder.shippingAddress.street}, {confirmedOrder.shippingAddress.city}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <button
                  onClick={handleTrackThisOrder}
                  className="px-6 py-3 bg-[#DC143C] text-white text-xs font-semibold rounded-full hover:bg-[#B01030] shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Package className="w-4 h-4" />
                  <span>Track This Order</span>
                </button>
                <button
                  onClick={() => setIsCheckoutOpen(false)}
                  className="px-6 py-3 bg-stone-200 text-stone-800 text-xs font-semibold rounded-full hover:bg-stone-300"
                >
                  Return to Boutique
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls (Steps 1 to 4) */}
        {step < 5 && (
          <div className="p-6 bg-[#FAF6F0] border-t border-[#EDE0D4] flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-4 py-2 rounded-full border border-[#D5C2B4] text-xs font-semibold text-stone-700 hover:bg-white flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : <div />}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-2.5 rounded-full bg-[#DC143C] hover:bg-[#B01030] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCompletePayment}
                disabled={isProcessingPayment}
                className="px-7 py-3 rounded-full bg-[#DC143C] hover:bg-[#B01030] text-white text-xs font-semibold flex items-center gap-2 shadow-md disabled:opacity-50"
              >
                {isProcessingPayment ? (
                  <span>Processing Payment...</span>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Pay ${total.toFixed(2)} & Place Order</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
