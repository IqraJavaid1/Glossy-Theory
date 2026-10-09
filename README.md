# Glossy Theory — Luxury Makeup & Cosmetics E-Commerce

A luxury cosmetic & beauty e-commerce web application featuring high-end beauty essentials, four curated promotional campaign hero banners, intuitive catalog browsing, shade finder, interactive cart & checkout, and integrated administrative inventory management.

---

## ✨ Features

- **Luxury Hero Campaign Section**:
  - Four responsive, animated hero banners aligned with the signature color palette:
    - **Main Hero Campaign**: *"Reveal Your Natural Glow"* (`#DC143C` Crimson Red, Champagne & Rose gradients)
    - **Skincare Collection**: *"Your Skin Deserves the Best"* (Facial serums, cleansers, and hydrating essentials)
    - **Makeup Collection**: *"Color Your Confidence"* (Velvet lipsticks, blushes, radiant foundations)
    - **Exclusive Offers**: *"A Little Luxury, Just for You"* (Dynamic seasonal promotional banner configurable via admin)
  - Slider controls: Autoplay rotation (5.5s), pause on hover/focus, smooth slide transitions, previous/next buttons, and interactive pagination dots with `prefers-reduced-motion` compliance.
- **Storefront & Catalog**:
  - Filter by category (Skincare, Makeup, Lips, Eyes, Face, Fragrance).
  - Search and sort by price, rating, and new arrivals.
  - Interactive shade selector and beauty product detail modals.
- **Cart & Seamless Checkout**:
  - Slide-out cart drawer with free shipping thresholds, promo code redemption, and order summaries.
  - Multi-step checkout with address inputs, shipping options, and instant order confirmations.
- **Admin Management Portal**:
  - Manage product catalog, stock counts, and categories.
  - Review moderation and order fulfillment tracking.
  - Dynamic promotional banner configuration (update banner labels, titles, CTA targets, and discounts).

---

## 🎨 Brand Color Palette

- **Crimson Red (`#DC143C`)**: Primary brand accents, key CTA buttons, and promotional highlights.
- **Rose Pink (`#F75270`)**: Beauty accents, gradients, and subtle badges.
- **Soft Blush Pink (`#F7CAC9`)**: Background cards, overlays, and delicate feminine beauty aesthetics.
- **Warm Champagne Cream (`#FDEBD0`)**: Luxurious whitespace, travertine-inspired backdrops, and containers.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or bun

### Installation

```bash
# Clone the repository
git clone <your-repository-url>
cd glossy-theory

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
```

The production output will be generated in the `dist` directory.

---

## 📁 Project Structure

```
├── public/                 # Static assets and icons
├── src/
│   ├── assets/             # Generated editorial beauty imagery & photos
│   ├── components/
│   │   ├── admin/          # Admin dashboard & promotional banner editor
│   │   ├── common/         # Header, Footer, Toasts
│   │   └── storefront/     # HeroBanner, ProductGrid, ProductCard, CartDrawer, CheckoutModal
│   ├── context/            # React AppContext (Storefront state, Cart, Orders, Banners)
│   ├── data/               # Initial cosmetics data & promotional banners
│   ├── types/              # TypeScript interfaces (Product, PromoBanner, Order, etc.)
│   ├── App.tsx             # Main application layout
│   └── main.tsx            # Application entry point
├── backend_django/         # Optional Django backend reference service
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 📄 License

MIT License. Designed with care for luxury cosmetic e-commerce experiences.
