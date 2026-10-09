import React, { useState } from 'react';
import {
  X,
  Package,
  Truck,
  CheckCircle,
  Clock,
  Search,
  ExternalLink,
  MapPin,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OrderStatus } from '../../types';

export const OrderTrackerModal: React.FC = () => {
  const {
    isOrderTrackerOpen,
    setIsOrderTrackerOpen,
    orders,
    trackingOrderNumber,
    setTrackingOrderNumber,
    activeView,
    setActiveView,
  } = useApp();

  const [searchInput, setSearchInput] = useState(trackingOrderNumber || '');

  // Find order
  const currentOrder = orders.find(
    (o) =>
      o.orderNumber.toLowerCase() === (searchInput || trackingOrderNumber).trim().toLowerCase()
  );

  const statusSteps: OrderStatus[] = [
    'Order Placed',
    'Payment Confirmed',
    'Processing',
    'Packed',
    'Shipped',
    'Out for Delivery',
    'Delivered',
  ];

  const getStepIndex = (status: OrderStatus) => {
    if (status === 'Canceled') return -1;
    return statusSteps.indexOf(status);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setTrackingOrderNumber(searchInput.trim());
  };

  // Close helper
  const handleClose = () => {
    setIsOrderTrackerOpen(false);
    if (activeView === 'tracker') {
      setActiveView('home');
    }
  };

  const isOpen = isOrderTrackerOpen || activeView === 'tracker';
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-[#EDE0D4] shadow-2xl relative">
        
        {/* Header */}
        <div className="p-6 bg-[#FAF6F0] border-b border-[#EDE0D4] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Package className="w-5 h-5 text-[#DC143C]" />
            <h2 className="font-serif text-xl font-semibold text-[#242220]">
              Real-Time Order Tracker
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-stone-200 text-stone-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Search Box */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter Order Number (e.g. GT-2026-7841)"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#FAF7F2] border border-[#E0D0C4] rounded-full focus:outline-none focus:ring-1 focus:ring-[#DC143C] text-stone-900"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#DC143C] hover:bg-[#B01030] text-white text-xs font-semibold rounded-full shadow-xs"
            >
              Track Order
            </button>
          </form>

          {/* Quick suggestions if empty */}
          {!currentOrder && (
            <div className="bg-[#FAF6F0] p-4 rounded-xl border border-[#EDE0D4] text-xs text-stone-600">
              <p className="font-semibold text-stone-800 mb-2">Available Demo Orders to test:</p>
              <div className="flex flex-wrap gap-2">
                {orders.slice(0, 3).map((o) => (
                  <button
                    key={o.id}
                    onClick={() => {
                      setSearchInput(o.orderNumber);
                      setTrackingOrderNumber(o.orderNumber);
                    }}
                    className="px-2.5 py-1 bg-white border border-[#E0D0C4] rounded-md font-mono text-[11px] text-[#DC143C] hover:bg-[#FDEBD0]"
                  >
                    #{o.orderNumber} ({o.fulfillmentStatus})
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Order Details Display */}
          {currentOrder ? (
            <div className="space-y-6">
              
              {/* Order Meta Header */}
              <div className="p-4 bg-[#FAF6F0] rounded-2xl border border-[#EDE0D4] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-bold text-stone-900">
                      #{currentOrder.orderNumber}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        currentOrder.fulfillmentStatus === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : currentOrder.fulfillmentStatus === 'Canceled'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {currentOrder.fulfillmentStatus}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    Placed on {new Date(currentOrder.createdAt).toLocaleDateString()} by{' '}
                    {currentOrder.customerName}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <p className="text-[11px] text-stone-500 uppercase tracking-wider">
                    Expected Arrival
                  </p>
                  <p className="font-bold text-xs text-[#DC143C]">
                    {currentOrder.estimatedDelivery}
                  </p>
                </div>
              </div>

              {/* Visual Progress Timeline */}
              {currentOrder.fulfillmentStatus === 'Canceled' ? (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-xs text-rose-800">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>This order was canceled and refunded. Stock has been returned to inventory.</span>
                </div>
              ) : (
                <div className="py-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-4">
                    Fulfillment Milestones
                  </h4>

                  <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#EBDDD2]">
                    {statusSteps.map((stepName, idx) => {
                      const currentIdx = getStepIndex(currentOrder.fulfillmentStatus);
                      const isCompleted = idx <= currentIdx;
                      const isCurrent = idx === currentIdx;

                      return (
                        <div key={stepName} className="relative flex items-start gap-3">
                          <span
                            className={`absolute -left-6 top-0.5 w-4.5 h-4.5 rounded-full flex items-center justify-center text-[10px] ${
                              isCompleted
                                ? 'bg-[#DC143C] text-white shadow-xs'
                                : 'bg-stone-200 text-stone-500'
                            }`}
                          >
                            {isCompleted ? <CheckCircle className="w-3 h-3" /> : idx + 1}
                          </span>

                          <div className="flex-1">
                            <p
                              className={`text-xs font-semibold ${
                                isCurrent
                                  ? 'text-[#DC143C]'
                                  : isCompleted
                                  ? 'text-stone-900'
                                  : 'text-stone-400'
                              }`}
                            >
                              {stepName}
                            </p>
                            {isCurrent && (
                              <p className="text-[11px] text-[#7A6760] mt-0.5">
                                Active status updated in dispatch system.
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Carrier & Tracking details */}
              {currentOrder.trackingNumber && (
                <div className="p-4 bg-white rounded-xl border border-[#EDE0D4] flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-stone-800">
                      Carrier: {currentOrder.carrier || 'DHL Beauty Express'}
                    </p>
                    <p className="font-mono text-stone-500 mt-0.5">
                      Tracking #: {currentOrder.trackingNumber}
                    </p>
                  </div>
                  <span className="text-[11px] text-[#DC143C] font-semibold flex items-center gap-1 cursor-pointer">
                    <span>Live Transit</span>
                    <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              )}

              {/* Ordered Items breakdown */}
              <div className="border-t border-[#EDE0D4] pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                  Purchased Cosmetics ({currentOrder.items.length})
                </h4>
                <div className="space-y-2">
                  {currentOrder.items.map((it) => (
                    <div
                      key={it.id}
                      className="flex items-center justify-between text-xs p-2 rounded-lg bg-[#FAF8F5]"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={it.image}
                          alt=""
                          className="w-10 h-10 object-cover rounded-md bg-white border border-stone-200"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p className="font-semibold text-stone-800">{it.productName}</p>
                          <p className="text-[11px] text-stone-500">
                            Qty: {it.quantity} {it.shade && `• ${it.shade}`}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-stone-900">
                        ${(it.price * it.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-[#EDE0D4] flex justify-between items-center text-xs">
                  <span className="font-semibold text-stone-700">Total Paid</span>
                  <span className="font-bold text-sm text-[#242220]">
                    ${currentOrder.total.toFixed(2)}
                  </span>
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-8 text-stone-500 text-xs">
              No matching order found for "{searchInput}". Please verify your order number.
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
