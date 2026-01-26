# Comoi Design System Architecture

> **Staff-Level Design Systems + Frontend Architecture Proposal**  
> January 2026

---

## Section A: Repo-Aware Summary — What Exists Today

### Current State Analysis

#### Web App (`apps/web`)
| Aspect | Status | Notes |
|--------|--------|-------|
| Framework | ✅ Next.js 16 + React 19 | App Router, RSC support |
| Styling | ⚠️ Early scaffold | Tailwind directives in `globals.css`, no `tailwind.config.ts` |
| Components | ⚠️ Minimal | Only auth components using Clerk hosted UI |
| UI Library | ❌ None | Inline utility classes throughout |
| Design Tokens | ❌ None | Hardcoded colors (`green-600`, `gray-200`) |
| Dark Mode | ⚠️ Partial | CSS variables exist but not integrated |
| i18n | ✅ Installed | i18next + react-i18next present |

#### Mobile App (`apps/mobile`)
| Aspect | Status | Notes |
|--------|--------|-------|
| Framework | ✅ Expo 54 + React Native 0.81 | Expo Router navigation |
| Styling | ✅ NativeWind 4.1 | Tailwind preset configured |
| Components | ⚠️ Minimal | Basic RN primitives only |
| UI Library | ❌ None | No component library |
| Design Tokens | ⚠️ Partial | Primary color scale in `tailwind.config.ts` |
| Dark Mode | ❌ Not integrated | No theme provider |
| i18n | ❌ Not configured | Missing |

#### Shared UI Package (`packages/ui`)
| Aspect | Status | Notes |
|--------|--------|-------|
| Exports | ❌ Placeholder only | `VERSION = "0.0.0"` |
| Components | ❌ None | Empty |
| Platform support | ❌ Undefined | No strategy for web vs native |
| Testing | ❌ None | Vitest configured but no tests |

### Design Assets Analysis (Stitch Mockups)

The `design/stitch_comoi/` folder contains **21 screen mockups** with valuable design language signals:

**Design Language Extracted:**
- **Typography**: `Be Vietnam Pro` (display), `Noto Sans` (body) — both excellent for Vietnamese diacritics
- **Color System**: Primary green `#13ec13`, darker accessible green `#15803d`, background light `#f6f8f6`, background dark `#102210`
- **Spacing**: 8pt grid system evident
- **Radii**: `0.25rem` (default), `0.5rem` (lg), `0.75rem` (xl), `1rem` (2xl), `9999px` (full)
- **Shadows**: Custom `glow` and `depth` shadows for dark mode
- **Icons**: Material Symbols Outlined (consistent across all mockups)

**Key UI Patterns Identified:**
1. **Sticky headers** with backdrop blur
2. **Bottom tab bar** with floating center action
3. **Card-based product grids** (2-column on mobile)
4. **Multi-vendor cart grouping** with vendor cards
5. **Price comparison lists** with "Best Deal" badges
6. **Order queue cards** with urgency indicators
7. **Horizontal scroll carousels** for category/market discovery

### What's Missing

| Gap | Impact | Priority |
|-----|--------|----------|
| Design token system | Colors/spacing inconsistent across apps | 🔴 Critical |
| Tailwind config for web | Can't use utility-first approach properly | 🔴 Critical |
| Shared primitives (Button, Input) | Duplicate code, inconsistent UX | 🔴 Critical |
| Theme provider | No dark mode support | 🟡 High |
| Component documentation | No onboarding for contributors | 🟡 High |
| Visual regression testing | No safety net for UI changes | 🟡 High |
| Accessibility audit | WCAG compliance unknown | 🟡 High |

---

## Section B: Proposed Design System Architecture

### Key Architectural Decision

> **Decision: Platform-Optimized Components with Shared Tokens**

After researching shadcn/ui, gluestack-ui, and NativeWind patterns, I recommend a **hybrid approach**:

| Platform | Component Library | Styling | Why |
|----------|------------------|---------|-----|
| **Web** | shadcn/ui (Radix + Tailwind) | Tailwind CSS v4 | Best RSC support, richest ecosystem, Clerk appearance API compatibility |
| **Mobile** | Custom primitives + NativeWind | NativeWind (stays) | Simpler than gluestack migration, team already familiar |
| **Shared** | Design tokens only | CSS variables → Tailwind config | Consistency without forcing identical implementations |

### Why NOT Gluestack-UI for Web

| Concern | Investigation Result |
|---------|---------------------|
| RSC compatibility | ⚠️ Requires `'use client'` on most components |
| Radix equivalents | ❌ Gluestack primitives less mature than Radix |
| Animation library | Uses React Native Reanimated, overkill for web |
| CSS output | Generates more verbose CSS than pure Tailwind |
| Clerk integration | Appearance API expects Tailwind classes, not gluestack tokens |
| Community/ecosystem | shadcn/ui has 10x more community components/examples |

**Verdict**: Use shadcn/ui for web. Keep web "web-native."

### Why NOT Migrate Mobile to Gluestack-UI (Yet)

| Concern | Investigation Result |
|---------|---------------------|
| Migration cost | Medium — must replace all RN `View/Text` with gluestack wrappers |
| Current state | NativeWind already configured and working |
| Added value | Marginal for MVP — NativeWind provides same Tailwind-class DX |
| When to reconsider | If we need complex accessible primitives (e.g., `Menu`, `Dialog`) |

**Verdict**: Stay with NativeWind for MVP. Revisit gluestack-ui in Q3 when we need accessible overlays.

---

### Package Structure

```
packages/
├── tokens/                      # NEW: Design tokens source of truth
│   ├── package.json
│   ├── src/
│   │   ├── colors.ts            # Color palette + semantic aliases
│   │   ├── typography.ts        # Font families, sizes, weights
│   │   ├── spacing.ts           # 8pt scale
│   │   ├── radii.ts             # Border radii
│   │   ├── shadows.ts           # Elevation system
│   │   ├── motion.ts            # Animation durations/easings
│   │   ├── z-index.ts           # Layering scale
│   │   └── index.ts             # Unified export
│   ├── dist/
│   │   ├── css-variables.css    # :root CSS variables
│   │   ├── tailwind-preset.js   # Tailwind plugin with tokens
│   │   └── native-theme.ts      # RN theme object
│   └── build.ts                 # Token generation script
│
├── ui/                          # RENAMED: Web-specific components
│   ├── package.json             # shadcn/ui dependencies
│   ├── src/
│   │   ├── primitives/          # Button, Input, Badge, etc.
│   │   ├── composites/          # SearchBar, ProductCard, etc.
│   │   ├── layouts/             # Container, Grid, Stack
│   │   └── index.ts
│   └── components.json          # shadcn CLI config
│
├── ui-native/                   # NEW: React Native components
│   ├── package.json
│   ├── src/
│   │   ├── primitives/          # Button, Input, Badge, etc.
│   │   ├── composites/          # ProductCard, VendorCard, etc.
│   │   ├── layouts/             # SafeAreaView wrappers, Stack
│   │   └── index.ts
│   └── tailwind.config.ts       # Extends @comoi/tokens preset
│
└── shared/                      # Business logic (existing)
```

### Package Dependencies

```
@comoi/tokens (no deps)
    ↑
    ├── @comoi/ui (web)
    │     └── @radix-ui/*, tailwindcss, class-variance-authority
    │
    └── @comoi/ui-native (mobile)
          └── nativewind, react-native-reanimated (for motion)
```

---

## Section C: Token Model + Theming Approach

### Token Categories

```typescript
// packages/tokens/src/colors.ts

// === Primitive Colors ===
// Raw color values — NOT used directly in components
export const primitives = {
  green: {
    50:  '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',  // Tailwind green-500
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  neutral: { /* gray scale */ },
  red: { /* error/danger scale */ },
  yellow: { /* warning scale */ },
  blue: { /* info scale */ },
} as const;

// === Semantic Tokens ===
// Role-based aliases — USE THESE in components
export const semantic = {
  light: {
    // Backgrounds
    'bg.app':         primitives.neutral[50],   // Main app background
    'bg.surface':     '#ffffff',                // Card/panel background
    'bg.elevated':    '#ffffff',                // Popover/modal
    'bg.muted':       primitives.neutral[100],  // Disabled/subtle areas
    
    // Foregrounds
    'fg.default':     primitives.neutral[900],  // Primary text
    'fg.muted':       primitives.neutral[500],  // Secondary text
    'fg.subtle':      primitives.neutral[400],  // Placeholders
    'fg.inverted':    '#ffffff',                // Text on dark bg
    
    // Brand
    'brand.primary':           primitives.green[600],  // Primary actions
    'brand.primary.hover':     primitives.green[700],
    'brand.primary.active':    primitives.green[800],
    'brand.primary.subtle':    primitives.green[50],   // Light bg tint
    'brand.primary.contrast':  primitives.green[700],  // Accessible text on white
    
    // Semantic states
    'status.success':      primitives.green[600],
    'status.success.bg':   primitives.green[50],
    'status.error':        primitives.red[600],
    'status.error.bg':     primitives.red[50],
    'status.warning':      primitives.yellow[600],
    'status.warning.bg':   primitives.yellow[50],
    'status.info':         primitives.blue[600],
    'status.info.bg':      primitives.blue[50],
    
    // Borders
    'border.default':  primitives.neutral[200],
    'border.muted':    primitives.neutral[100],
    'border.focus':    primitives.green[600],
    
    // Interactive
    'interactive.hover':   'rgba(0, 0, 0, 0.04)',
    'interactive.pressed': 'rgba(0, 0, 0, 0.08)',
  },
  
  dark: {
    'bg.app':         '#102210',  // From Stitch mockups
    'bg.surface':     '#152815',
    'bg.elevated':    '#1a331a',
    'bg.muted':       '#0d1a0d',
    
    'fg.default':     '#f0fdf0',
    'fg.muted':       '#a3bca3',
    'fg.subtle':      '#6b8a6b',
    'fg.inverted':    '#102210',
    
    'brand.primary':           '#13ec13',  // Brighter for dark
    'brand.primary.hover':     '#15f515',
    'brand.primary.active':    '#0fb80f',
    'brand.primary.subtle':    'rgba(19, 236, 19, 0.15)',
    'brand.primary.contrast':  '#13ec13',
    
    // ... rest of dark tokens
  },
} as const;
```

### Typography Tokens

```typescript
// packages/tokens/src/typography.ts

export const fontFamilies = {
  display: '"Be Vietnam Pro", system-ui, sans-serif',
  body: '"Be Vietnam Pro", system-ui, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, monospace',
} as const;

export const fontSizes = {
  xs:   '0.75rem',   // 12px
  sm:   '0.875rem',  // 14px
  base: '1rem',      // 16px
  lg:   '1.125rem',  // 18px
  xl:   '1.25rem',   // 20px
  '2xl': '1.5rem',   // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem',  // 36px
} as const;

export const fontWeights = {
  normal:   '400',
  medium:   '500',
  semibold: '600',
  bold:     '700',
  extrabold: '800',
} as const;

export const lineHeights = {
  none:    '1',
  tight:   '1.25',
  snug:    '1.375',
  normal:  '1.5',
  relaxed: '1.625',
} as const;
```

### Spacing & Sizing

```typescript
// packages/tokens/src/spacing.ts

// 8pt grid system
export const spacing = {
  0:   '0',
  0.5: '0.125rem',  // 2px
  1:   '0.25rem',   // 4px
  1.5: '0.375rem',  // 6px
  2:   '0.5rem',    // 8px
  2.5: '0.625rem',  // 10px
  3:   '0.75rem',   // 12px
  3.5: '0.875rem',  // 14px
  4:   '1rem',      // 16px
  5:   '1.25rem',   // 20px
  6:   '1.5rem',    // 24px
  7:   '1.75rem',   // 28px
  8:   '2rem',      // 32px
  9:   '2.25rem',   // 36px
  10:  '2.5rem',    // 40px
  12:  '3rem',      // 48px
  14:  '3.5rem',    // 56px
  16:  '4rem',      // 64px
  20:  '5rem',      // 80px
  24:  '6rem',      // 96px
} as const;

// packages/tokens/src/radii.ts

export const radii = {
  none: '0',
  sm:   '0.125rem', // 2px
  base: '0.25rem',  // 4px
  md:   '0.375rem', // 6px
  lg:   '0.5rem',   // 8px
  xl:   '0.75rem',  // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',
} as const;
```

### CSS Variable Output

```css
/* packages/tokens/dist/css-variables.css */
/* Auto-generated — do not edit */

:root {
  /* Colors - Light */
  --color-bg-app: #fafafa;
  --color-bg-surface: #ffffff;
  --color-bg-elevated: #ffffff;
  --color-bg-muted: #f5f5f5;
  
  --color-fg-default: #171717;
  --color-fg-muted: #737373;
  --color-fg-subtle: #a3a3a3;
  --color-fg-inverted: #ffffff;
  
  --color-brand-primary: #16a34a;
  --color-brand-primary-hover: #15803d;
  --color-brand-primary-active: #166534;
  --color-brand-primary-subtle: #f0fdf4;
  --color-brand-primary-contrast: #15803d;
  
  --color-status-success: #16a34a;
  --color-status-error: #dc2626;
  --color-status-warning: #ca8a04;
  --color-status-info: #2563eb;
  
  --color-border-default: #e5e5e5;
  --color-border-muted: #f5f5f5;
  --color-border-focus: #16a34a;
  
  /* Typography */
  --font-family-display: 'Be Vietnam Pro', system-ui, sans-serif;
  --font-family-body: 'Be Vietnam Pro', system-ui, sans-serif;
  
  /* Spacing (8pt grid) */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  
  /* Radii */
  --radius-sm: 0.125rem;
  --radius-base: 0.25rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-base: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  
  /* Motion */
  --duration-fast: 150ms;
  --duration-base: 200ms;
  --duration-slow: 300ms;
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Z-index */
  --z-dropdown: 50;
  --z-sticky: 100;
  --z-modal: 200;
  --z-toast: 300;
}

.dark {
  --color-bg-app: #102210;
  --color-bg-surface: #152815;
  --color-bg-elevated: #1a331a;
  --color-bg-muted: #0d1a0d;
  
  --color-fg-default: #f0fdf0;
  --color-fg-muted: #a3bca3;
  --color-fg-subtle: #6b8a6b;
  --color-fg-inverted: #102210;
  
  --color-brand-primary: #13ec13;
  --color-brand-primary-hover: #15f515;
  --color-brand-primary-active: #0fb80f;
  --color-brand-primary-subtle: rgba(19, 236, 19, 0.15);
  --color-brand-primary-contrast: #13ec13;
}
```

### Tailwind Preset Integration

```javascript
// packages/tokens/dist/tailwind-preset.js

module.exports = {
  theme: {
    extend: {
      colors: {
        // Map semantic tokens to Tailwind
        'bg-app': 'var(--color-bg-app)',
        'bg-surface': 'var(--color-bg-surface)',
        'bg-elevated': 'var(--color-bg-elevated)',
        'bg-muted': 'var(--color-bg-muted)',
        
        'fg-default': 'var(--color-fg-default)',
        'fg-muted': 'var(--color-fg-muted)',
        'fg-subtle': 'var(--color-fg-subtle)',
        'fg-inverted': 'var(--color-fg-inverted)',
        
        'brand-primary': 'var(--color-brand-primary)',
        'brand-primary-hover': 'var(--color-brand-primary-hover)',
        'brand-primary-active': 'var(--color-brand-primary-active)',
        'brand-primary-subtle': 'var(--color-brand-primary-subtle)',
        'brand-primary-contrast': 'var(--color-brand-primary-contrast)',
        
        'status-success': 'var(--color-status-success)',
        'status-error': 'var(--color-status-error)',
        'status-warning': 'var(--color-status-warning)',
        'status-info': 'var(--color-status-info)',
        
        'border-default': 'var(--color-border-default)',
        'border-muted': 'var(--color-border-muted)',
        'border-focus': 'var(--color-border-focus)',
      },
      fontFamily: {
        display: 'var(--font-family-display)',
        body: 'var(--font-family-body)',
      },
      borderRadius: {
        DEFAULT: 'var(--radius-base)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        DEFAULT: 'var(--shadow-base)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
      transitionDuration: {
        fast: 'var(--duration-fast)',
        DEFAULT: 'var(--duration-base)',
        slow: 'var(--duration-slow)',
      },
      zIndex: {
        dropdown: 'var(--z-dropdown)',
        sticky: 'var(--z-sticky)',
        modal: 'var(--z-modal)',
        toast: 'var(--z-toast)',
      },
    },
  },
};
```

### Theme Switching Strategy

**Web (Next.js):**
```tsx
// apps/web/src/app/providers.tsx
'use client';

import { ThemeProvider } from 'next-themes';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider 
      attribute="class" 
      defaultTheme="system"
      enableSystem
    >
      <ClerkProvider>
        <ConvexProvider>
          {children}
        </ConvexProvider>
      </ClerkProvider>
    </ThemeProvider>
  );
}
```

**Mobile (React Native):**
```tsx
// apps/mobile/src/providers/ThemeProvider.tsx
import { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';
import { vars } from 'nativewind';

const lightVars = vars({
  '--color-bg-app': '#fafafa',
  '--color-brand-primary': '#16a34a',
  // ... all tokens
});

const darkVars = vars({
  '--color-bg-app': '#102210',
  '--color-brand-primary': '#13ec13',
  // ... all tokens
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState<'light' | 'dark' | 'system'>('system');
  
  const resolvedMode = mode === 'system' ? systemScheme ?? 'light' : mode;
  
  return (
    <View style={resolvedMode === 'dark' ? darkVars : lightVars}>
      <ThemeContext.Provider value={{ mode, setMode }}>
        {children}
      </ThemeContext.Provider>
    </View>
  );
}
```

---

## Section D: Component Roadmap

### Component Layering Model

```
┌─────────────────────────────────────────────────────────┐
│  FEATURE UI (Domain-specific, composed from below)      │
│  Cart, Checkout, ProductSearch, VendorOrders            │
├─────────────────────────────────────────────────────────┤
│  COMPOSITES (Multi-component patterns)                  │
│  SearchBar, ProductCard, PriceComparison, VendorCard    │
├─────────────────────────────────────────────────────────┤
│  PRIMITIVES (Atomic building blocks)                    │
│  Button, Input, Badge, Card, Text, Separator            │
├─────────────────────────────────────────────────────────┤
│  TOKENS (Design decisions as code)                      │
│  colors, typography, spacing, radii, shadows            │
└─────────────────────────────────────────────────────────┘
```

### MVP Component Inventory

**Phase 1 — Foundation (Week 1-2)**

| Component | Web | Native | Notes |
|-----------|-----|--------|-------|
| Button | ✅ | ✅ | Primary, Secondary, Ghost, Destructive variants |
| Input | ✅ | ✅ | Text, Search, Number inputs |
| Text | ✅ | ✅ | Heading, Body, Caption, Label variants |
| Badge | ✅ | ✅ | Status badges (success, error, warning, info) |
| Card | ✅ | ✅ | Base container with variants |
| Separator | ✅ | ✅ | Horizontal/vertical dividers |
| Skeleton | ✅ | ✅ | Loading placeholders |
| Icon | ✅ | ✅ | Material Symbols wrapper |

**Phase 2 — Interaction (Week 3-4)**

| Component | Web | Native | Notes |
|-----------|-----|--------|-------|
| SearchBar | ✅ | ✅ | Input + Icon + clear button |
| QuantityStepper | ✅ | ✅ | +/- buttons for cart |
| Toast | ✅ | ✅ | Transient notifications |
| BottomSheet | - | ✅ | Mobile overlays |
| Dialog | ✅ | - | Web modals |
| Dropdown | ✅ | - | Radix-based select |

**Phase 3 — Domain Components (Week 5-8)**

| Component | Web | Native | Notes |
|-----------|-----|--------|-------|
| ProductCard | ✅ | ✅ | Image, price, vendor, add button |
| VendorCard | ✅ | ✅ | Store info, rating, distance |
| PriceComparisonRow | ✅ | ✅ | Vendor offer comparison |
| CartItem | ✅ | ✅ | Product in cart with stepper |
| OrderCard | ✅ | - | Vendor order queue item |
| CategoryGrid | ✅ | ✅ | 4-column category icons |
| HorizontalScroll | ✅ | ✅ | Carousel container |

### Component API Design Principles

```tsx
// Variants via CVA (class-variance-authority)
// packages/ui/src/primitives/button.tsx

import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';

const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-brand-primary text-fg-inverted hover:bg-brand-primary-hover active:bg-brand-primary-active',
        secondary: 'bg-bg-surface border border-border-default text-fg-default hover:bg-bg-muted',
        ghost: 'hover:bg-bg-muted text-fg-default',
        destructive: 'bg-status-error text-fg-inverted hover:bg-red-700',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-12 px-6 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({ 
  className, 
  variant, 
  size, 
  asChild = false, 
  ...props 
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp 
      className={buttonVariants({ variant, size, className })} 
      {...props} 
    />
  );
}
```

---

## Section E: Migration Plan

### Current State → Target State

```
BEFORE (Today)                    AFTER (Target)
─────────────────────────────────────────────────────────
apps/web/                         apps/web/
├── src/app/page.tsx              ├── src/app/page.tsx
│   └── inline Tailwind classes   │   └── <Button>, <ProductCard>
│                                 │
└── src/components/auth/          └── src/components/
    └── Clerk hosted UI               ├── auth/ (Clerk + custom)
                                      └── features/ (Cart, etc.)

packages/ui/                      packages/tokens/
└── VERSION = "0.0.0"             ├── src/colors.ts
                                  ├── dist/css-variables.css
                                  └── dist/tailwind-preset.js
                                  
                                  packages/ui/
                                  ├── src/primitives/
                                  └── src/composites/
                                  
                                  packages/ui-native/
                                  ├── src/primitives/
                                  └── src/composites/
```

### Migration Phases

#### Phase 0: Token Foundation (Week 1)

1. Create `packages/tokens` with color, typography, spacing tokens
2. Build token compilation script (TS → CSS vars → Tailwind preset)
3. Add Tailwind config to `apps/web` using token preset
4. Update `apps/mobile` Tailwind config to use token preset
5. Verify dark mode works on both platforms

**Deliverables:**
- `packages/tokens/` fully functional
- Both apps consuming tokens via Tailwind
- CI pipeline validates token build

#### Phase 1: Web Primitives (Week 2)

1. Initialize shadcn/ui in `packages/ui`
2. Configure `components.json` pointing to token CSS vars
3. Add core primitives: Button, Input, Badge, Card
4. Refactor `apps/web/src/app/page.tsx` to use new components
5. Add Clerk appearance config using semantic tokens

**Deliverables:**
- Button, Input, Badge, Card, Text, Separator components
- Home page refactored to use design system
- Auth UI consistent with brand

#### Phase 2: Mobile Primitives (Week 3)

1. Create `packages/ui-native`
2. Build Button, Input, Badge, Card for React Native
3. Use NativeWind with token preset
4. Refactor `apps/mobile/app/index.tsx`
5. Add ThemeProvider for dark mode

**Deliverables:**
- Matching primitives for mobile
- Home screen refactored
- Dark mode toggle working

#### Phase 3: Domain Components (Week 4-6)

1. ProductCard (web + native)
2. VendorCard (web + native)
3. SearchBar (web + native)
4. CategoryGrid (web + native)
5. QuantityStepper (web + native)

**Deliverables:**
- Full home page with real components
- Product detail screen components

#### Phase 4: Complex Patterns (Week 7-8)

1. Multi-vendor cart UI
2. Price comparison module
3. Order queue cards (vendor)
4. Toast notifications
5. Loading skeletons

**Deliverables:**
- Cart and checkout screens
- Vendor dashboard components

### Incremental Migration Strategy

**Rule: No Big Bang Rewrites**

```tsx
// STRATEGY: Wrap-and-Replace

// Step 1: Create new component
// packages/ui/src/primitives/button.tsx
export function Button({ ... }) { ... }

// Step 2: Import in app, use alongside old code
// apps/web/src/app/page.tsx
import { Button } from '@comoi/ui';

<div>
  {/* Old button — will replace */}
  <a className="px-6 py-3 bg-green-600...">Browse Products</a>
  
  {/* New button — testing */}
  <Button variant="primary">Browse Products</Button>
</div>

// Step 3: Verify visually identical
// Step 4: Remove old code
// Step 5: Repeat for next component
```

---

## Section F: Testing + Documentation Plan

### Testing Strategy

| Layer | Tool | What to Test |
|-------|------|--------------|
| Tokens | Vitest | Token compilation, CSS output validity |
| Primitives | Vitest + Testing Library | Render, accessibility, interactions |
| Composites | Vitest + Testing Library | Component integration |
| Visual | Storybook + Chromatic | Pixel-perfect regression |
| E2E (Web) | Playwright | User flows with real components |
| E2E (Mobile) | Detox | User flows on device |

### Component Documentation

**Tool Choice: Storybook 8 (Web)**

Why Storybook over Ladle:
- Better shadcn/ui support
- Native dark mode switcher
- Chromatic integration for visual regression
- Larger ecosystem of addons

```
packages/ui/
├── .storybook/
│   ├── main.ts
│   └── preview.ts
├── src/
│   └── primitives/
│       ├── button.tsx
│       └── button.stories.tsx  ← Co-located stories
```

**Story Structure:**

```tsx
// packages/ui/src/primitives/button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';

const meta: Meta<typeof Button> = {
  title: 'Primitives/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'destructive'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'icon'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: 'Browse Products',
    variant: 'primary',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
  ),
};
```

**Mobile Documentation:**

For React Native, use **Storybook React Native** (standalone app):

```
apps/mobile/
├── .storybook/
│   ├── main.ts
│   └── preview.ts
├── storybook.tsx           ← Entry point
├── components/
│   └── button/
│       ├── button.tsx
│       └── button.stories.tsx
```

### Visual Regression Testing

**Tool: Chromatic (with Storybook)**

```yaml
# .github/workflows/ui-visual-tests.yml
name: Visual Regression

on:
  pull_request:
    paths:
      - 'packages/ui/**'
      - 'packages/tokens/**'

jobs:
  chromatic:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run --filter @comoi/ui build-storybook
      - uses: chromaui/action@v11
        with:
          projectToken: ${{ secrets.CHROMATIC_TOKEN }}
          storybookBuildDir: packages/ui/storybook-static
```

### Accessibility Testing

```tsx
// packages/ui/src/primitives/button.test.tsx
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from './button';

expect.extend(toHaveNoViolations);

describe('Button', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<Button>Click me</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  it('is keyboard focusable', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button');
    button.focus();
    expect(button).toHaveFocus();
  });
});
```

---

## Section G: ADR-Style Conclusion

### ADR-001: Design System Component Strategy

**Status:** Proposed  
**Date:** January 2026  
**Deciders:** Frontend Architecture Team

---

#### Context

Comoi is a grocery marketplace launching in Vietnam with web (Next.js 16) and mobile (Expo 54) applications. We need a design system that:

1. Scales across platforms without forcing identical implementations
2. Supports dark mode and eventual high-contrast accessibility
3. Integrates with Clerk's appearance API for auth UI
4. Handles Vietnamese typography (diacritics)
5. Enables incremental adoption without big-bang rewrites

#### Decision Drivers

- Next.js App Router + RSC compatibility is critical
- Team has Tailwind familiarity (NativeWind already in use)
- shadcn/ui has emerged as the standard for Tailwind-based React component systems
- gluestack-ui v3 is promising but introduces complexity for web

#### Options Considered

| Option | Web | Mobile | Pros | Cons |
|--------|-----|--------|------|------|
| **A. Unified gluestack-ui** | gluestack | gluestack | One codebase | RSC issues, less mature primitives |
| **B. Platform-specific** | shadcn/ui | Custom RN | Best DX per platform | Token drift risk |
| **C. Hybrid (Chosen)** | shadcn/ui | NativeWind + custom | Best of both, shared tokens | Dual maintenance |

#### Decision

**We will use Option C: Hybrid with Shared Tokens**

- **Web**: shadcn/ui (Radix + Tailwind CSS v4)
- **Mobile**: NativeWind v4 + custom primitives (mirror shadcn API)
- **Shared**: Design tokens as single source of truth (`@comoi/tokens`)

Token flow:
```
@comoi/tokens (TypeScript)
    ↓ build
├── css-variables.css  → apps/web/globals.css
├── tailwind-preset.js → apps/web/tailwind.config.ts
└── native-theme.ts    → apps/mobile/tailwind.config.ts
```

#### Consequences

**Positive:**
- Web gets full RSC support and best-in-class Radix primitives
- Mobile stays on familiar NativeWind
- Tokens ensure visual consistency across platforms
- Clerk appearance API works naturally with Tailwind classes
- Incremental migration possible (wrap-and-replace)

**Negative:**
- Must maintain two component implementations (web + native)
- Component APIs may drift without discipline
- Storybook setup needed for both platforms

**Mitigations:**
- Strict component API contracts (Props interfaces shared via `@comoi/shared`)
- Weekly design system sync reviews
- Chromatic visual regression catches drift
- Consider gluestack-ui migration for mobile in Q3 when/if complex overlays needed

#### Unknowns / What Would Change Our Mind

| Unknown | Impact | Resolution |
|---------|--------|------------|
| gluestack v3 RSC support improves | Might unify on gluestack | Monitor gluestack releases, re-evaluate Q3 2026 |
| NativeWind v5 stability | Could simplify mobile tokens | Wait for stable release |
| Tailwind v4 ecosystem | May need preset adjustments | Track Tailwind v4 beta closely |
| Team grows significantly | May want single codebase | Revisit if team > 5 FE devs |

---

### Summary Recommendation

```
┌───────────────────────────────────────────────────────────────┐
│  COMOI DESIGN SYSTEM ARCHITECTURE                             │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  TOKENS (Source of Truth)                                     │
│  @comoi/tokens                                                │
│  Colors, Typography, Spacing, Radii, Shadows, Motion          │
│  Outputs: CSS vars, Tailwind preset, RN theme                 │
│                                                               │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  WEB COMPONENTS               │  MOBILE COMPONENTS            │
│  @comoi/ui                    │  @comoi/ui-native             │
│                               │                               │
│  ┌─────────────────────────┐  │  ┌─────────────────────────┐  │
│  │ shadcn/ui (Radix)       │  │  │ NativeWind + Custom     │  │
│  │ Tailwind CSS v4         │  │  │ Matching API surface    │  │
│  │ CVA for variants        │  │  │ CVA-style variants      │  │
│  │ RSC compatible          │  │  │ Reanimated for motion   │  │
│  └─────────────────────────┘  │  └─────────────────────────┘  │
│                               │                               │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  DOCUMENTATION & TESTING                                      │
│  Storybook 8 (web) + Storybook RN (mobile)                   │
│  Chromatic visual regression                                  │
│  Vitest + Testing Library + jest-axe                         │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

---

### Appendix: File/Folder Quick Reference

```
packages/
├── tokens/                 # Design tokens (NEW)
│   ├── src/colors.ts
│   ├── src/typography.ts
│   ├── src/spacing.ts
│   ├── src/radii.ts
│   ├── src/shadows.ts
│   ├── src/motion.ts
│   ├── src/index.ts
│   ├── build.ts
│   └── dist/
│       ├── css-variables.css
│       ├── tailwind-preset.js
│       └── native-theme.ts
│
├── ui/                     # Web components (EXPAND)
│   ├── .storybook/
│   ├── src/
│   │   ├── primitives/
│   │   │   ├── button.tsx
│   │   │   ├── button.stories.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   ├── composites/
│   │   │   ├── search-bar.tsx
│   │   │   ├── product-card.tsx
│   │   │   └── ...
│   │   └── index.ts
│   └── components.json
│
├── ui-native/              # Mobile components (NEW)
│   ├── .storybook/
│   ├── src/
│   │   ├── primitives/
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   ├── composites/
│   │   │   ├── product-card.tsx
│   │   │   └── ...
│   │   └── index.ts
│   └── tailwind.config.ts
│
└── shared/                 # Shared types (EXISTING)
    └── src/
        └── types/
            └── components.ts   # Shared prop interfaces
```

---

*Document generated for Comoi Design System Planning — January 2026*
