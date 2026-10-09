import React from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const WishlistDrawer: React.FC = () => {
  const { isWishlistOpen, setIsWishlistOpen, wishlist, toggleWishlist, products, addToCart, showToast } =
    useApp();

  if (!isWishlistOpen) return null;

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="absolute inset-0" onClick={() => setIsWishlistOpen(false)} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-[#EDE0D4] shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-6 bg-[#FAF6F0] border-b border-[#EDE0D4] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Heart className="w-5 h-5 text-[#DC143C] fill-[#DC143C]" />
              <h2 className="font-serif text-xl font-semibold text-[#242220]">
                Saved Favorites ({wishlistProducts.length})
              </h2>
            </div>
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="p-1.5 rounded-full hover:bg-stone-200 text-stone-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {wishlistProducts.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#FAF0E6] text-[#DC143C] flex items-center justify-center mx-auto">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-lg text-stone-800">Your wishlist is empty</h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  Heart items across the store to curate your personal beauty wishlist.
                </p>
              </div>
            ) : (
              wishlistProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex gap-4 p-3.5 rounded-2xl border border-[#F2E6DC] bg-[#FAF8F5]/50 hover:bg-[#FAF8F5] transition-colors"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-xl bg-white border border-stone-200 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h4 className="font-serif text-sm font-semibold text-[#242220]">
                          {product.name}
                        </h4>
                        <button
                          onClick={() => toggleWishlist(product.id)}
                          className="text-stone-400 hover:text-[#DC143C] p-0.5"
                          title="Remove from favorites"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-[#8C7A72]">{product.subtitle}</p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#EFE2D6]">
                      <span className="text-xs font-bold font-sans text-stone-900">
                        ${product.price.toFixed(2)}
                      </span>
                      <button
                        onClick={() => {
                          addToCart(product, product.shades[0]?.name, 1);
                          showToast(`Added ${product.name} to shopping bag!`);
                        }}
                        className="px-3 py-1 bg-[#DC143C] hover:bg-[#B01030] text-white text-[11px] font-semibold rounded-full flex items-center gap-1 shadow-2xs"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Move to Bag</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {wishlistProducts.length > 0 && (
            <div className="p-6 bg-[#FAF6F0] border-t border-[#EDE0D4]">
              <button
                onClick={() => {
                  wishlistProducts.forEach((p) => addToCart(p, p.shades[0]?.name, 1));
                  setIsWishlistOpen(false);
                  showToast('All favorites moved to your shopping bag!');
                }}
                className="w-full py-3.5 px-6 bg-[#DC143C] hover:bg-[#B01030] text-white text-xs font-semibold uppercase tracking-wider rounded-full shadow-md flex items-center justify-center gap-2"
              >
                <span>Add All to Shopping Bag</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
