# Comoi — Design Brief for Google Stitch 🎯

**Comoi** is a consumer-facing **grocery marketplace app** for **Southeast Asia**, initially focused on **Vietnam**. The platform connects consumers with nearby **local mini-markets**, enabling price transparency and convenient ordering in markets that are traditionally offline and fragmented.

---

## Brand & tone 💡
- **Personality:** Modern, trustworthy, “fresh grocery” feel; **Vietnam-first**.
- **Voice:** Friendly but not playful; clarity and speed over decoration.
- **Color:** Primary brand family: **green** (freshness), balanced with neutral grays and ample white space.
- **Core emphasis:** Communicate **price comparison** and **nearby mini-markets** as the main value propositions.

---

## Web app design brief (Customer + Vendor) 🖥️

### Global layout
- Header, primary navigation, responsive content grid, footer.  
- Responsive breakpoints (mobile / tablet / desktop) with graceful reflow.  
- Desktop: wider content areas and optional table views for vendor workflows.

### Customer IA — key screens
- Landing / Home  
- Location selection / Address management  
- Search + Category browsing  
- Product list with filters & sorting  
- Product detail with multi-vendor offers (price comparison module)  
- Store / mini-market page (profile, delivery/pickup options)  
- Cart (multi-vendor grouping, fee breakdown per vendor)  
- Checkout (delivery vs pickup, time-slot selection, payment methods: COD + local wallets later)  
- Order status & timeline (tracking)  
- Account: Profile, Addresses, Language

### Vendor IA — key screens (low‑tech friendly)
- Vendor dashboard overview (today’s orders, pending actions)  
- Orders queue (new / in progress / ready / completed / cancelled)  
- Order detail (items, substitutions, status updates, customer notes)  
- Catalog management (add / edit product, availability, price)  
- Promotions (optional placeholder)  
- Payouts & settings (optional placeholder)

### Interaction & UI states
- Loading states & skeletons  
- Optimistic updates (show temporary success states, rollback on failure)  
- Empty states & contextual help copy  
- Error states & offline/poor-network banners  
- Accessibility: visible focus states, keyboard navigation, high-contrast readable text, large tap targets

### Visual style & patterns
- Typography scale and **8‑pt spacing system**  
- Semantic radii and elevation (shadows) tokens  
- Consistent iconography style  
- Tables vs cards: use **tables for vendor admin on desktop**, cards for product discovery on consumer flows  
- Microinteractions: hover, pressed, selected states, toasts / snackbars for transient feedback

---

## Mobile app design brief (Customer only) 📱

### Navigation model
- Bottom tab bar (primary flows) + nested stacks per tab  
- Consistent back behavior and predictable hierarchy

### Key screens
- Onboarding (location permission, language selection)  
- Home (search, categories, nearby markets highlights)  
- Search results (filters & sort)  
- Product detail + offer comparison (mobile-first layout)  
- Cart (grouped by vendor)  
- Checkout (address, delivery/pickup, payment)  
- Order tracking (timeline + status)  
- Account (profile, addresses, order history)  
- Auth screens (sign-in / sign-up / verify)

### Mobile-specific considerations
- One‑hand ergonomics and large tappable targets  
- Safe area handling for modern devices  
- Performance: image placeholders, list virtualization (FlatList/virtualized lists)  
- Offline & spotty network UX: retry affordances, cached results messaging, clear network status indicators

---

## Implementation & delivery notes ✅
- Provide clear component/atomic tokens for color, spacing, typography, radii, shadows.  
- Include accessible defaults (contrast, focus rings, accessible labels).  
- Design assets: screens for desktop/tablet/mobile for key flows (home, product, cart, checkout, vendor orders).  
- Prioritize screens for Stitch: Home (customer), Product Detail (price comparison panel), Cart (multi-vendor grouping), Checkout, Vendor Orders Queue.

---

*Ready to be copied into Google Stitch. If you want, I can also add a short printable spec or link this file from the project README.*
