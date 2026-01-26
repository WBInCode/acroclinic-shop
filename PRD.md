# Acro Clinic Shop - E-Commerce Storefront

A high-end, dark-themed e-commerce platform delivering an elite shopping experience for performance-oriented athletes seeking premium training gear and accessories.

**Experience Qualities**:
1. **Elite** - The interface should evoke exclusivity and premium quality through sophisticated dark aesthetics and luxury gold accents
2. **Performance-focused** - Every interaction must be swift and purposeful, reflecting the athletic mindset of the target audience
3. **Immersive** - Rich visual depth through glassmorphism, geometric wireframe overlays, and fluid animations that draw users into the brand world

**Complexity Level**: Light Application (multiple features with basic state)
This is an e-commerce showcase with product filtering, cart management, and interactive product browsing - core features that require state management but remain focused on a streamlined shopping experience.

## Essential Features

**Product Catalog Browsing**
- Functionality: Display grid of premium training apparel and accessories with high-quality imagery
- Purpose: Showcase the Acro Clinic product line in an aspirational, professional manner
- Trigger: Page load or category filter selection
- Progression: Landing → Browse grid → Hover product (zoom effect) → View details
- Success criteria: Products load instantly, images are crisp, hover effects are smooth at 60fps

**Category Filtering**
- Functionality: Filter products by category (All, Clothing, Training Accessories, Bestsellers)
- Purpose: Help users quickly navigate to their desired product type
- Trigger: Click on category pill button
- Progression: View all products → Click category → Grid updates with filtered results → Badge shows active filter
- Success criteria: Instant filtering without loading states, smooth grid transition

**Shopping Cart Management**
- Functionality: Add items to cart, view cart count, persist cart state
- Purpose: Enable purchase intent tracking and prepare for checkout flow
- Trigger: Click quick-add cart button on product card
- Progression: Browse product → Click cart icon → Toast confirmation → Badge updates → Cart persists
- Success criteria: Cart count updates immediately, items persist across sessions, visual feedback on add

**Hero Experience**
- Functionality: Dynamic hero section with athlete imagery and primary CTA
- Purpose: Immediately communicate brand identity and drive users to product catalog
- Trigger: Page load
- Progression: Hero animates in → User reads messaging → Clicks CTA → Smooth scroll to products
- Success criteria: Hero loads without layout shift, CTA is obvious and clickable, animation feels premium

**Trust Building Sections**
- Functionality: Display brand values, contact information, and scrolling marquee
- Purpose: Build credibility and communicate premium positioning
- Trigger: User scrolls through page
- Progression: Products section → Scroll down → Encounter marquee → View trust signals → See contact CTA
- Success criteria: Marquee scrolls smoothly, trust cards are scannable, contact info is prominent

## Edge Case Handling

- **Empty Cart State**: Show elegant empty state with "Start Shopping" CTA when cart is empty
- **No Search Results**: Display helpful message with category suggestions if filter returns no products
- **Slow Image Loading**: Use skeleton loaders with golden shimmer effect for product images
- **Mobile Navigation**: Bottom nav bar collapses on scroll down, reappears on scroll up
- **Hover on Touch**: Quick-add button always visible on mobile, zoom effect replaced with tap feedback

## Design Direction

The design should evoke the feeling of entering an exclusive athletic performance laboratory - dark, focused, and sophisticated. Users should feel they're accessing premium gear reserved for elite performers. The golden accents act as spotlights highlighting key products and actions, while the geometric wireframe overlay suggests precision, structure, and technical excellence. Every element should feel intentional, refined, and confidence-inspiring.

## Color Selection

A dramatic dark foundation with strategic luxury gold accents creates high contrast and premium appeal.

- **Primary Color**: Deep Black (#000000 / oklch(0 0 0)) - Absolute black for main background, communicating sophistication and focus
- **Secondary Colors**: 
  - Slightly Lighter Black (#0a0a0a / oklch(0.04 0 0)) for card surfaces, creating subtle depth
  - Dark Gray (#1a1a1a / oklch(0.1 0 0)) for borders and dividers
- **Accent Color**: Luxury Gold (#DBA60A / oklch(0.72 0.15 85)) - Reserved for prices, CTAs, badges, and interactive elements to draw attention and communicate value
- **Foreground/Background Pairings**:
  - Deep Black (#000000): White text (#FFFFFF / oklch(1 0 0)) - Ratio 21:1 ✓
  - Luxury Gold (#DBA60A): Deep Black (#000000) - Ratio 9.8:1 ✓
  - Card Surface (#0a0a0a): White text (#FFFFFF) - Ratio 19.5:1 ✓
  - Luxury Gold (#DBA60A): White text (#FFFFFF) - Ratio 2.1:1 (used for large text/icons only)

## Font Selection

Typography must balance athletic energy with refined elegance, using distinctive fonts that elevate the brand above typical sportswear retailers.

- **Typographic Hierarchy**:
  - Logo/Brand Mark: Unbounded Bold / 24px / tight letter spacing (-0.02em) - Geometric and modern
  - H1 (Hero Headline): Unbounded Bold / 56px / -0.03em / uppercase - Commands attention
  - H2 (Section Titles): Unbounded SemiBold / 32px / -0.02em - Maintains brand voice
  - H3 (Product Names): Inter SemiBold / 18px / normal - Clean and readable
  - Body Text: Inter Regular / 16px / 1.5 line height - Maximum readability
  - Price Labels: Unbounded Medium / 20px / -0.01em - Gold color for emphasis
  - Button Text: Inter SemiBold / 14px / 0.5px letter spacing / uppercase - Action-oriented
  - Marquee: Unbounded Bold / 48px / -0.02em / uppercase - Bold brand statements

## Animations

Animations should feel like precision athletic movements - purposeful, smooth, and powerful. Use subtle motion to guide attention and create depth without distracting from products.

- **Hero Entrance**: Staggered fade-up of hero elements (image, text, CTA) with 100ms delays
- **Product Grid**: Staggered grid entrance with slight scale + fade, creating wave effect
- **Product Hover**: Smooth image scale (1.0 → 1.05) with 300ms ease-out, quick-add button fades in
- **Category Pills**: Active state slides in gold underline with spring physics
- **Cart Badge**: Scale bounce animation (1.0 → 1.2 → 1.0) when count increases
- **Marquee**: Continuous smooth scroll at 50px/second, seamless loop
- **Wireframe Background**: Subtle pulse opacity (0.1 → 0.2 → 0.1) over 8 seconds
- **Button Hovers**: Gold glow expands outward with 200ms transition, scale 1.0 → 1.02
- **Mobile Nav**: Slide up/down with 300ms ease-in-out when scrolling

## Component Selection

- **Components**:
  - **Button**: Shadcn Button with variant="default" for primary CTAs (gold fill), variant="outline" for secondary actions (gold border)
  - **Card**: Shadcn Card for product cards and trust signal cards, customized with glassmorphism (backdrop-blur-sm, bg-[#0a0a0a]/60)
  - **Badge**: Shadcn Badge for "NEW" and "LIMITED" labels, styled with gold background
  - **Input**: Shadcn Input for search bar, with gold focus ring
  - **Tabs**: Consider for category filtering if expanding beyond pills
  - **Dialog**: For future cart overlay or product quick-view
  - **Separator**: For dividing sections with subtle gold lines
  - **Custom Components Needed**:
    - ProductCard: Card + image + hover overlay + quick-add button
    - MarqueeText: Infinite scroll component with seamless loop
    - WireframeBackground: SVG pattern with geometric lines and subtle animation
    - MobileNavBar: Fixed bottom navigation with icons
    - CategoryPills: Button group with active state management

- **Customizations**:
  - All Cards: Add `backdrop-blur-md bg-[#0a0a0a]/70 border-[#1a1a1a]` for glassmorphism
  - Buttons: Primary gets `bg-brandGold hover:shadow-[0_0_20px_rgba(219,166,10,0.5)]` for glow
  - Badge: `bg-brandGold/20 text-brandGold border-brandGold` for product tags

- **States**:
  - Buttons: Default (gold bg) → Hover (gold glow + slight scale) → Active (slightly darker gold) → Disabled (opacity 50%)
  - Product Cards: Default → Hover (image zoom, quick-add visible, subtle lift) → Loading (skeleton with shimmer)
  - Category Pills: Default (transparent bg) → Active (gold underline, gold text) → Hover (gold/20 background)
  - Cart Icon: Default → Has Items (gold badge with bounce) → Max Items (badge pulses)

- **Icon Selection**:
  - Navigation: Search (lucide Search), Cart (lucide ShoppingCart), User (lucide User), Heart (lucide Heart)
  - Product Actions: Plus (lucide Plus) for quick-add, Eye (lucide Eye) for view
  - Categories: Shirt (lucide Shirt), Dumbbell (lucide Dumbbell), Star (lucide Star) for bestsellers
  - Trust Signals: Award (lucide Award), Shield (lucide Shield), Zap (lucide Zap)
  - Contact: Phone (lucide Phone), Mail (lucide Mail), MapPin (lucide MapPin)

- **Spacing**:
  - Section Padding: py-20 (80px) on desktop, py-12 (48px) on mobile
  - Card Padding: p-6 (24px) uniform
  - Grid Gaps: gap-6 (24px) for product grid, gap-4 (16px) for smaller grids
  - Button Padding: px-8 py-4 (32px/16px) for primary CTAs, px-6 py-3 for secondary
  - Consistent Margins: mb-4 for small headings, mb-8 for section headings, mb-12 for major sections

- **Mobile**:
  - Navigation: Desktop horizontal nav → Mobile bottom fixed bar (4 icons: Home, Shop, Cart, Profile)
  - Product Grid: 4 columns desktop → 2 columns tablet → 2 columns mobile (smaller cards)
  - Hero: Full-height desktop → 60vh mobile, text size scales down
  - Category Pills: Horizontal scroll on mobile with snap points
  - Typography: H1 scales from 56px → 36px, body remains 16px for readability
  - Touch Targets: Minimum 44px for all interactive elements
  - Bottom Nav: Only visible when not scrolling down (auto-hide for content focus)
