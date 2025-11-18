# Phase 3 Installation Checklist - Option A (Full Enhancement)

**Project**: Memory Time Capsule Landing Page
**Enhancement Level**: Option A - Full Enhancement (svgl + @magicui + @aceternity)
**Estimated Time**: Day 1 setup (4 hours)

---

## Pre-Installation Checklist

- [ ] Confirm Phase 2 design system approved
- [ ] Review handoff-to-dev.md
- [ ] Backup current `frontend/` directory
- [ ] Ensure Node.js v18+ installed
- [ ] Ensure npm or yarn available
- [ ] Clean install: `rm -rf node_modules package-lock.json && npm install`

---

## Step 1: Install Core Dependencies (15 minutes)

### Icon Libraries
```bash
npm install lucide-react@^0.300.0
npm install @svgl/react@^1.0.0
```

**Verify Installation**:
```bash
npm list lucide-react @svgl/react
```

**Expected Output**:
```
├── lucide-react@0.300.0
└── @svgl/react@1.0.0
```

### Animation Library (Required for @magicui and @aceternity)
```bash
npm install framer-motion@^11.0.0
```

**Verify**:
```bash
npm list framer-motion
```

### Utility Libraries (Likely already installed with ShadCN)
```bash
npm install class-variance-authority clsx tailwind-merge
```

---

## Step 2: Install ShadCN Core Components (10 minutes)

```bash
# Install all at once
npx shadcn@latest add button card badge tabs accordion

# Or one by one if batch fails
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add badge
npx shadcn@latest add tabs
npx shadcn@latest add accordion
```

**Verify Installation**:
Check that files exist:
```bash
ls frontend/src/components/ui/button.tsx
ls frontend/src/components/ui/card.tsx
ls frontend/src/components/ui/badge.tsx
ls frontend/src/components/ui/tabs.tsx
ls frontend/src/components/ui/accordion.tsx
```

---

## Step 3: Install @magicui Components (20-30 minutes)

### Method 1: Try CLI First

```bash
# Try installing via CLI
npx shadcn@latest add @magicui/animated-gradient-text
npx shadcn@latest add @magicui/shimmer-button
npx shadcn@latest add @magicui/neon-gradient-card
npx shadcn@latest add @magicui/border-beam
```

**If CLI succeeds**: ✅ Skip to Method 2 verification

**If CLI fails**: ⚠️ Proceed to Manual Installation (Method 2)

---

### Method 2: Manual Installation (Fallback)

#### 3.1 Animated Gradient Text

1. Visit: https://magicui.design/docs/components/animated-gradient-text
2. Copy component code
3. Create file: `frontend/src/components/ui/animated-gradient-text.tsx`
4. Paste code
5. Install dependencies listed on page (if any)

**Test**:
```jsx
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text';

<AnimatedGradientText className="text-6xl">
  Test Text
</AnimatedGradientText>
```

---

#### 3.2 Shimmer Button

1. Visit: https://magicui.design/docs/components/shimmer-button
2. Copy component code
3. Create file: `frontend/src/components/ui/shimmer-button.tsx`
4. Paste code
5. Install dependencies

**Test**:
```jsx
import { ShimmerButton } from '@/components/ui/shimmer-button';

<ShimmerButton>Click Me</ShimmerButton>
```

---

#### 3.3 Neon Gradient Card

1. Visit: https://magicui.design/docs/components/neon-gradient-card
2. Copy component code
3. Create file: `frontend/src/components/ui/neon-gradient-card.tsx`
4. Paste code
5. Install dependencies

**Test**:
```jsx
import { NeonGradientCard } from '@/components/ui/neon-gradient-card';

<NeonGradientCard>
  <p>Card content</p>
</NeonGradientCard>
```

---

#### 3.4 Border Beam

1. Visit: https://magicui.design/docs/components/border-beam
2. Copy component code
3. Create file: `frontend/src/components/ui/border-beam.tsx`
4. Paste code
5. Install dependencies

**Test**:
```jsx
import { BorderBeam } from '@/components/ui/border-beam';

<div className="relative">
  <BorderBeam size={200} duration={12} />
  <p>Content with animated border</p>
</div>
```

---

## Step 4: Install @aceternity Components (15-20 minutes)

### Method 1: Try CLI First

```bash
npx shadcn@latest add @aceternity/background-beams
```

**If CLI succeeds**: ✅ Skip to verification

**If CLI fails**: ⚠️ Proceed to Manual Installation

---

### Method 2: Manual Installation (Fallback)

#### 4.1 Background Beams

1. Visit: https://ui.aceternity.com/components/background-beams
2. Click "View Code" or "Copy Code"
3. Copy component code
4. Create file: `frontend/src/components/ui/background-beams.tsx`
5. Paste code
6. Install dependencies listed (likely `framer-motion` already installed)

**Test**:
```jsx
import { BackgroundBeams } from '@/components/ui/background-beams';

<div className="relative h-screen">
  <BackgroundBeams />
  <div className="relative z-10">Content on top</div>
</div>
```

---

## Step 5: Update Configuration Files (15 minutes)

### 5.1 Update `frontend/src/index.css`

**Backup first**:
```bash
cp frontend/src/index.css frontend/src/index.css.backup
```

**Replace `:root` section** with new Twilight Bridge colors:

```css
@layer base {
  :root {
    /* Twilight Bridge Color System */
    --primary: 250 70% 60%;                /* #8B7EFF Cosmic Indigo */
    --primary-foreground: 0 0% 100%;
    --secondary: 38 92% 50%;               /* #F59E0B Warm Amber */
    --secondary-foreground: 0 0% 100%;
    --accent: 180 70% 50%;                 /* #26C9C9 Future Teal */
    --accent-foreground: 0 0% 100%;

    --background: 0 0% 100%;               /* White */
    --foreground: 240 10% 3.9%;            /* Near-black */
    --muted: 250 30% 96%;                  /* Soft lavender */
    --muted-foreground: 240 5% 40%;
    --border: 250 20% 88%;                 /* Purple-gray */
    --input: 250 20% 88%;
    --ring: 250 70% 60%;                   /* Primary for focus */

    --card: 0 0% 100%;
    --card-foreground: 240 10% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 240 10% 3.9%;

    --destructive: 0 84% 60%;              /* #EF4444 */
    --destructive-foreground: 0 0% 100%;

    --radius: 0.5rem;
  }
}
```

**Add custom animations** (after existing CSS):

```css
/* Custom Animations for Memory Time Capsule */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse-glow {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 20px rgba(139, 126, 255, 0.3);
  }
  50% {
    transform: scale(1.02);
    box-shadow: 0 0 30px rgba(139, 126, 255, 0.5);
  }
}

@keyframes drawLine {
  from { width: 0%; }
  to { width: 100%; }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

@keyframes wiggle {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(3deg) scale(1.05); }
  75% { transform: rotate(-3deg) scale(1.05); }
}

.animate-fadeInUp {
  animation: fadeInUp 0.6s ease-out forwards;
}

.animate-pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}

.animate-drawLine {
  animation: drawLine 1.5s ease-out forwards;
}

.animate-float {
  animation: float 2s ease-in-out infinite;
}

.animate-wiggle {
  animation: wiggle 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

### 5.2 Update `frontend/tailwind.config.js`

**Backup first**:
```bash
cp frontend/tailwind.config.js frontend/tailwind.config.js.backup
```

**Add to `theme.extend`**:

```javascript
module.exports = {
  // ... existing config
  theme: {
    extend: {
      // ... existing extensions

      // Add custom animations
      animation: {
        'fadeInUp': 'fadeInUp 0.6s ease-out forwards',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'drawLine': 'drawLine 1.5s ease-out forwards',
        'float': 'float 2s ease-in-out infinite',
        'wiggle': 'wiggle 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },

      // Add keyframes
      keyframes: {
        fadeInUp: {
          'from': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'pulse-glow': {
          '0%, 100%': {
            transform: 'scale(1)',
            boxShadow: '0 0 20px rgba(139, 126, 255, 0.3)',
          },
          '50%': {
            transform: 'scale(1.02)',
            boxShadow: '0 0 30px rgba(139, 126, 255, 0.5)',
          },
        },
        drawLine: {
          'from': { width: '0%' },
          'to': { width: '100%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(3deg) scale(1.05)' },
          '75%': { transform: 'rotate(-3deg) scale(1.05)' },
        },
      },

      // Add custom shadows
      boxShadow: {
        'glow-lg': '0 0 40px rgba(139, 126, 255, 0.4)',
        'glow': '0 0 20px rgba(139, 126, 255, 0.3)',
      },
    },
  },
  // ... rest of config
};
```

---

## Step 6: Verification Tests (20 minutes)

### 6.1 Test Lucide Icons

Create `frontend/src/components/test/IconTest.tsx`:

```jsx
import { Github, Mail, Shield, Gift, FileVideo } from 'lucide-react';

export function IconTest() {
  return (
    <div className="p-8 space-x-4">
      <Github className="w-8 h-8 text-primary" />
      <Mail className="w-8 h-8 text-primary" />
      <Shield className="w-8 h-8 text-primary" />
      <Gift className="w-8 h-8 text-primary" />
      <FileVideo className="w-8 h-8 text-primary" />
    </div>
  );
}
```

**Expected**: Icons render in cosmic purple (#8B7EFF)

---

### 6.2 Test svgl Logos

Create `frontend/src/components/test/LogoTest.tsx`:

```jsx
import { GitHub, Gmail, WhatsApp, Cloudflare } from '@svgl/react';

export function LogoTest() {
  return (
    <div className="p-8 space-x-4 bg-white">
      <GitHub className="w-8 h-8" />
      <Gmail className="w-8 h-8" />
      <WhatsApp className="w-8 h-8" />
      <Cloudflare className="w-8 h-8" />

      {/* Test variant on dark background */}
      <div className="bg-primary p-4 mt-4">
        <GitHub className="w-8 h-8" variant="light" />
      </div>
    </div>
  );
}
```

**Expected**: All 4 brand logos render correctly, GitHub white on purple background

---

### 6.3 Test @magicui Components

Create `frontend/src/components/test/MagicUITest.tsx`:

```jsx
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { NeonGradientCard } from '@/components/ui/neon-gradient-card';
import { BorderBeam } from '@/components/ui/border-beam';

export function MagicUITest() {
  return (
    <div className="p-8 space-y-8">
      {/* Animated Gradient Text */}
      <AnimatedGradientText className="text-4xl">
        Gradient Text Test
      </AnimatedGradientText>

      {/* Shimmer Button */}
      <ShimmerButton>Shimmer Button Test</ShimmerButton>

      {/* Neon Gradient Card */}
      <NeonGradientCard className="p-6">
        <p>Neon Card Test</p>
      </NeonGradientCard>

      {/* Border Beam */}
      <div className="relative w-64 h-32 border rounded">
        <BorderBeam size={200} duration={12} />
        <p className="p-4">Border Beam Test</p>
      </div>
    </div>
  );
}
```

**Expected**:
- Gradient text shimmers
- Button has shimmer effect on hover
- Card has animated neon border
- Border has traveling light beam

---

### 6.4 Test @aceternity Component

Create `frontend/src/components/test/AceternityTest.tsx`:

```jsx
import { BackgroundBeams } from '@/components/ui/background-beams';

export function AceternityTest() {
  return (
    <div className="relative h-screen bg-gradient-to-br from-primary via-purple-700 to-secondary overflow-hidden">
      <BackgroundBeams className="absolute inset-0" />
      <div className="relative z-10 flex items-center justify-center h-full">
        <h1 className="text-6xl text-white font-bold">
          Background Beams Test
        </h1>
      </div>
    </div>
  );
}
```

**Expected**: Animated SVG beams visible in background, text on top

---

### 6.5 Test Animations

Create `frontend/src/components/test/AnimationTest.tsx`:

```jsx
export function AnimationTest() {
  return (
    <div className="p-8 space-y-8">
      <div className="animate-fadeInUp">Fade In Up</div>
      <button className="animate-pulse-glow bg-primary text-white px-6 py-3 rounded">
        Pulse Glow
      </button>
      <div className="relative w-full h-1 bg-muted">
        <div className="h-full bg-primary animate-drawLine" />
      </div>
      <div className="w-12 h-12 bg-primary rounded-full animate-float" />
      <div className="w-12 h-12 bg-secondary rounded-full hover:animate-wiggle" />
    </div>
  );
}
```

**Expected**: All 5 animations work smoothly

---

## Step 7: Build & Run Verification (10 minutes)

### 7.1 Development Server

```bash
cd frontend
npm run dev
```

**Visit**: `http://localhost:5173` (or your configured port)

**Check**:
- [ ] No console errors
- [ ] Colors match Twilight Bridge palette
- [ ] Icons render
- [ ] Test components work (create temporary test page)

---

### 7.2 Build Test

```bash
npm run build
```

**Expected**: No TypeScript errors, no build failures

**Check Bundle Size**:
```bash
npm run build
# Check output for bundle sizes
# Total should be < 2.2MB
```

---

## Step 8: Clean Up Test Files (5 minutes)

After verification:

```bash
rm -rf frontend/src/components/test/
```

---

## Installation Verification Checklist

### Dependencies
- [ ] `lucide-react` installed and working
- [ ] `@svgl/react` installed and logos render
- [ ] `framer-motion` installed
- [ ] `class-variance-authority`, `clsx`, `tailwind-merge` installed

### ShadCN Components
- [ ] `button` component exists
- [ ] `card` component exists
- [ ] `badge` component exists
- [ ] `tabs` component exists
- [ ] `accordion` component exists

### @magicui Components
- [ ] `animated-gradient-text` working
- [ ] `shimmer-button` working
- [ ] `neon-gradient-card` working
- [ ] `border-beam` working

### @aceternity Components
- [ ] `background-beams` working

### Configuration
- [ ] `index.css` updated with new colors
- [ ] `index.css` has custom animations
- [ ] `tailwind.config.js` has animation extensions
- [ ] `tailwind.config.js` has custom shadows

### Verification
- [ ] Lucide icons render in primary color
- [ ] svgl logos render correctly
- [ ] GitHub logo `variant="light"` works on dark background
- [ ] All 4 @magicui components tested
- [ ] BackgroundBeams tested
- [ ] All 5 custom animations tested
- [ ] Dev server runs without errors
- [ ] Build completes without errors
- [ ] Bundle size < 2.2MB

---

## Troubleshooting

### Issue: CLI commands for @magicui/@aceternity fail

**Solution**: Use manual installation method
1. Visit component website
2. Copy code
3. Create file in `frontend/src/components/ui/`
4. Install peer dependencies

---

### Issue: Framer Motion errors

**Error**: `Module not found: Can't resolve 'framer-motion'`

**Solution**:
```bash
npm install framer-motion@^11.0.0
```

---

### Issue: TypeScript errors on svgl imports

**Error**: `Cannot find module '@svgl/react'`

**Solution**:
```bash
# Reinstall
npm install @svgl/react

# Or add type declaration
# Create: frontend/src/@types/svgl-react.d.ts
declare module '@svgl/react' {
  export const GitHub: React.FC<any>;
  export const Gmail: React.FC<any>;
  export const WhatsApp: React.FC<any>;
  export const Cloudflare: React.FC<any>;
}
```

---

### Issue: Animations not working

**Solution**:
1. Check `tailwind.config.js` has animations in `theme.extend`
2. Check `index.css` has keyframes defined
3. Restart dev server: `npm run dev`
4. Clear cache: `rm -rf .next` or `rm -rf dist`

---

### Issue: BackgroundBeams causes performance issues

**Solution**:
1. Reduce beam count in component
2. Increase animation duration
3. Disable on mobile: `<BackgroundBeams className="hidden md:block" />`
4. Add to reduced-motion check

---

## Next Steps

After successful installation:

1. ✅ **Verify all checkboxes above**
2. ✅ **Commit changes**: `git add . && git commit -m "Setup: Install Option A dependencies and config"`
3. ✅ **Start Phase 3 implementation**: Begin with Hero section
4. 📖 **Reference**: `handoff-to-dev.md` for implementation details

---

## Estimated Time Breakdown

| Step | Task | Time |
|------|------|------|
| 1 | Install core dependencies | 15 min |
| 2 | Install ShadCN components | 10 min |
| 3 | Install @magicui (manual) | 30 min |
| 4 | Install @aceternity (manual) | 20 min |
| 5 | Update config files | 15 min |
| 6 | Verification tests | 20 min |
| 7 | Build & run verification | 10 min |
| 8 | Clean up | 5 min |
| **Total** | | **~2 hours** |

**Note**: Time assumes manual installation. CLI installation (if it works) could reduce to 1 hour.

---

## Support Resources

- **@magicui Docs**: https://magicui.design/docs
- **@aceternity Docs**: https://ui.aceternity.com
- **svgl**: https://svgl.app
- **Framer Motion**: https://www.framer.com/motion
- **Lucide Icons**: https://lucide.dev

---

🚀 **Installation Complete!** Ready for Phase 3 implementation.
