# Component Specifications: Memory Time Capsule Landing Page

**Version:** 1.0
**Date:** 2025-11-17
**Phase:** 2 (UI Design)

---

## Overview

Section-by-section component breakdown with specific ShadCN components, Tailwind classes, and implementation details. All specifications ready for Phase 3 implementation.

**Design System**: Twilight Bridge (cosmic purple + warm amber)
**ShadCN Components Available**: accordion, badge, button, card, carousel, tabs, progress, separator, skeleton, scroll-area

---

## Section 1: Hero Section

### Layout
```
max-w-6xl mx-auto px-4 py-32 min-h-screen flex flex-col justify-center items-center text-center
```

### Background
**Gradient**: `bg-gradient-to-br from-primary via-purple-700 to-secondary`
**Opacity overlay**: If using background video, apply 20-30% opacity

### Content Structure

**Headline**
```jsx
<h1 className="text-6xl md:text-7xl font-bold text-white mb-6 animate-fadeInUp">
  Send Messages to the <span className="text-secondary">Future</span>
</h1>
```
- Remove 🎁 emoji
- Use `<span>` with secondary color for "Future"
- Animation: fadeInUp (0.6s delay)

**Subtitle**
```jsx
<p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl animate-fadeInUp [animation-delay:100ms]">
  Create time capsules with videos, photos, and messages. Automatically delivered to anyone, anywhere, at exactly the right moment.
</p>
```

**CTA Button**
```jsx
<Button
  size="lg"
  className="px-12 py-6 text-lg bg-white text-primary hover:bg-white/90 hover:scale-105 hover:shadow-glow-lg transition-all duration-200 animate-fadeInUp [animation-delay:200ms]"
>
  {isAuthenticated ? "Create Time Capsule" : "Get Started Free"}
</Button>
```
- Component: `@shadcn/button`
- White button on colored background for contrast
- Hover: scale(1.05) + glow shadow

**Trust Badges** (below CTA)
```jsx
<div className="mt-8 flex items-center gap-4 text-white/80 text-sm">
  <Github className="w-5 h-5" />
  <span>Powered by GitHub</span>
  <Mail className="w-5 h-5" />
  <span>Delivered via Gmail</span>
</div>
```
- Icons: Lucide `Github`, `Mail`
- Size: 20px (w-5 h-5)

**Scroll Indicator**
```jsx
<button
  onClick={scrollToNextSection}
  className="absolute bottom-8 animate-bounce"
  aria-label="Scroll to next section"
>
  <ChevronDown className="w-8 h-8 text-white/70" />
</button>
```
- Icon: Lucide `ChevronDown`
- Animation: Tailwind `animate-bounce`

### ShadCN Components
- `button` (primary CTA)

---

## Section 2: Trust Indicators Bar

### Layout
```
max-w-7xl mx-auto px-4 py-8
grid grid-cols-2 md:grid-cols-4 gap-8
```

### Badge Component (4-5 badges)
```jsx
<div className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-muted/50 transition-colors">
  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
    <Github className="w-6 h-6 text-primary" />
  </div>
  <h3 className="font-semibold text-sm">Powered by GitHub</h3>
  <p className="text-xs text-muted-foreground">Your data, your repo</p>
</div>
```

**Badges Content:**
1. **GitHub Integration**: `Github` icon, "Powered by GitHub", "Your data, your repo"
2. **Gmail Delivery**: `Mail` icon, "Sent via Gmail", "Reliable delivery"
3. **Security**: `Shield` icon, "Encrypted Storage", "Private & secure"
4. **Free Forever**: `Gift` icon, "100% Free", "No credit card"

**Icon Treatment:**
- Circular background: `w-12 h-12 rounded-full bg-primary/10`
- Icon size: 24px (`w-6 h-6`)
- Color: `text-primary`

### ShadCN Components
- `badge` (optional for "Free" highlight)

---

## Section 3: How It Works (Timeline)

### Layout
```
max-w-6xl mx-auto px-4 py-24
```

**Desktop**: Horizontal timeline (3 columns)
**Mobile**: Vertical stack with left border

### Section Header
```jsx
<h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
  How It Works
</h2>
```

### Timeline Component

**Timeline Line** (horizontal on desktop)
```jsx
<div className="relative">
  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-muted -translate-y-1/2">
    <div className="h-full bg-primary animate-drawLine" style={{animationDelay: '0.5s'}} />
  </div>
</div>
```
- Animation: `drawLine` (width 0→100%, 1.5s)

**Step Node** (3 steps)
```jsx
<div className="relative flex flex-col items-center gap-4">
  {/* Node Circle */}
  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center relative z-10 shadow-lg">
    <Link className="w-8 h-8 text-white" />
  </div>

  {/* Content */}
  <div className="text-center">
    <h3 className="text-2xl font-bold mb-2">Connect Your Accounts</h3>
    <p className="text-muted-foreground mb-3">
      Link GitHub and Gmail in under 2 minutes with OAuth
    </p>
    <div className="flex gap-2 justify-center">
      <Badge variant="secondary" className="text-xs">~2 min</Badge>
      <Github className="w-4 h-4 text-muted-foreground" />
      <Mail className="w-4 h-4 text-muted-foreground" />
    </div>
  </div>
</div>
```

**Step Icons** (replace emoji):
- Step 1: `Link` or `GitBranch` (Connect)
- Step 2: `Upload` or `FileVideo` (Create)
- Step 3: `Send` or `Calendar` (Deliver)

**Supporting Icons** (20px):
- `Github`, `Mail`, `FileVideo`, `FileAudio`, `FileImage`, `FileText`

### ShadCN Components
- `badge` (time indicators: "~2 min")
- `separator` (optional vertical lines between steps)

---

## Section 4: Interactive Demo

### Layout
```
max-w-5xl mx-auto px-4 py-32 bg-muted/30
```

### Demo Container
```jsx
<Card className="p-8 shadow-2xl">
  <Tabs defaultValue="create" className="w-full">
    <TabsList className="grid w-full grid-cols-3 mb-8">
      <TabsTrigger value="create">
        <Upload className="w-4 h-4 mr-2" />
        Create
      </TabsTrigger>
      <TabsTrigger value="storage">
        <Database className="w-4 h-4 mr-2" />
        Storage
      </TabsTrigger>
      <TabsTrigger value="delivery">
        <Mail className="w-4 h-4 mr-2" />
        Delivery
      </TabsTrigger>
    </TabsList>

    <TabsContent value="create">
      {/* Upload UI mockup */}
    </TabsContent>
    {/* ... other tabs */}
  </Tabs>
</Card>
```

**Progress Indicators**
```jsx
<div className="flex gap-2 justify-center mt-4">
  <div className="w-2 h-2 rounded-full bg-primary" />
  <div className="w-2 h-2 rounded-full bg-muted" />
  <div className="w-2 h-2 rounded-full bg-muted" />
</div>
```

### ShadCN Components
- `card` (main container)
- `tabs` (state switcher)
- `progress` (optional auto-advance indicator)

---

## Section 5: Features Grid

### Layout
```
max-w-6xl mx-auto px-4 py-24
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8
```

### Feature Card (6 cards)
```jsx
<Card className="p-6 hover:-translate-y-2 hover:shadow-xl transition-all duration-250 group">
  {/* Icon */}
  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
    <FileVideo className="w-6 h-6 text-primary group-hover:animate-float" />
  </div>

  {/* Title */}
  <h3 className="text-xl font-bold mb-2">Rich Media Support</h3>

  {/* Description */}
  <p className="text-muted-foreground">
    Videos up to 100MB, audio, photos, or text messages
  </p>
</Card>
```

**Feature Icons** (replace emoji):
1. `FileVideo` → 🎥 (Multiple Content Types)
2. `Shield` → 🔒 (Secure & Private)
3. `Clock` → ⏰ (Precise Timing)
4. `Mail` → 📧 (Email Delivery)
5. `Gift` → 💰 (100% Free)
6. `Share2` → 📱 (Easy Sharing)

**Icon Size**: 24px (`w-6 h-6`)
**Background**: `rounded-lg bg-primary/10` (square with rounded corners)

**Hover Effects**:
- Card: `hover:-translate-y-2 hover:shadow-xl`
- Icon container: `group-hover:scale-110`
- Icon: `group-hover:animate-float` (gentle up/down)

### ShadCN Components
- `card` (feature cards)
- `badge` (optional for "NEW" or "POPULAR" tags)

---

## Section 6: Use Cases / Examples

### Layout
```
max-w-7xl mx-auto px-4 py-32 bg-gradient-to-b from-background to-muted/30
```

### Use Case Card (4 cards, alternating layout)

**Layout Pattern** (desktop):
- Odd cards: Image left, text right
- Even cards: Text left, image right

```jsx
<div className="grid md:grid-cols-2 gap-12 items-center mb-16">
  {/* Image */}
  <div className="relative overflow-hidden rounded-xl shadow-lg group">
    <img
      src="/images/use-cases/birthday.jpg"
      alt="Family birthday celebration"
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      loading="lazy"
    />
  </div>

  {/* Content */}
  <div>
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
        <Cake className="w-5 h-5 text-secondary" />
      </div>
      <h3 className="text-2xl font-bold">Personal Milestones</h3>
    </div>
    <p className="text-lg text-muted-foreground mb-4">
      "I recorded a message to my daughter for her 18th birthday when she was 10. She'll receive it on her special day."
    </p>
    <Badge variant="secondary">Birthday Messages</Badge>
  </div>
</div>
```

**Use Case Icons**:
1. `Cake` (Personal Milestones)
2. `Briefcase` (Professional Reminders)
3. `Heart` (Long-Distance Connections)
4. `Camera` (Family Time Capsules)

**Photo Requirements** (via Unsplash/Pexels MCP):
- Dimensions: 800x600px (4:3 ratio)
- Format: WebP + JPG fallback
- Size: <100KB each
- Style: Authentic, diverse, warm

### ShadCN Components
- `badge` (use case categories)
- `card` (optional wrapper)

---

## Section 7: Social Proof / Tech Stack

### Layout
```
max-w-6xl mx-auto px-4 py-24 bg-muted/50
grid md:grid-cols-2 gap-16
```

### Column Component (2 columns)

**Left: Tech Stack**
```jsx
<div>
  <h2 className="text-3xl font-bold mb-8">Built on Enterprise Tech</h2>
  <ul className="space-y-4">
    <li className="flex items-start gap-3">
      <Database className="w-8 h-8 text-primary flex-shrink-0" />
      <div>
        <h4 className="font-semibold">GitHub Storage</h4>
        <p className="text-sm text-muted-foreground">Private repo (1GB free)</p>
      </div>
    </li>
    {/* ... more items */}
  </ul>
</div>
```

**Right: Security**
```jsx
<div>
  <h2 className="text-3xl font-bold mb-8">Security & Privacy</h2>
  <ul className="space-y-4">
    <li className="flex items-start gap-3">
      <Lock className="w-8 h-8 text-primary flex-shrink-0" />
      <div>
        <h4 className="font-semibold">AES-256 Encryption</h4>
        <p className="text-sm text-muted-foreground">All files encrypted at rest</p>
      </div>
    </li>
    {/* ... more items */}
  </ul>
</div>
```

**Icons** (32px):
- Tech: `Database`, `Workflow`, `Mail`, `Cloud`, `Code`
- Security: `Lock`, `Key`, `EyeOff`, `Hash`, `FileText`, `CheckCircle`

### ShadCN Components
- `badge` (optional for certifications like "GDPR")
- `separator` (between columns on mobile)

---

## Section 8: FAQ Accordion

### Layout
```
max-w-4xl mx-auto px-4 py-24 bg-muted/30
```

### Accordion Component
```jsx
<Accordion type="single" collapsible className="w-full">
  <AccordionItem value="item-1">
    <AccordionTrigger className="text-lg font-semibold hover:text-primary">
      Is it really free?
    </AccordionTrigger>
    <AccordionContent className="text-muted-foreground">
      Yes! We use free tiers of GitHub (1GB), Gmail API, and Cloudflare. No hidden costs.
    </AccordionContent>
  </AccordionItem>
  {/* 8-10 FAQ items */}
</Accordion>
```

**FAQ Questions** (8-10):
1. Is it really free?
2. How does scheduled delivery work?
3. Is my content secure and private?
4. What file types can I send?
5. What happens if I delete my GitHub account?
6. Can I edit or cancel a capsule?
7. Why do you need Gmail access?
8. How long can I set a capsule?

**Icons**:
- Chevron rotation automatic with ShadCN accordion
- Optional: `HelpCircle` icon in section header

### ShadCN Components
- `accordion` (FAQ list)

---

## Section 9: Final CTA

### Layout
```
max-w-3xl mx-auto px-4 py-32 mb-16 text-center
```

### Background Options

**Option A: Gradient (Recommended)**
```
bg-gradient-to-br from-primary via-purple-700 to-secondary rounded-2xl p-16
```
Visual bookend matching hero

**Option B: Elevated Card**
```
bg-white rounded-2xl shadow-2xl p-16
```

### Content
```jsx
<div className="bg-gradient-to-br from-primary via-purple-700 to-secondary rounded-2xl p-16 text-center">
  <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
    Ready to Send a Message to the Future?
  </h2>

  <p className="text-xl text-white/90 mb-8">
    Join thousands creating meaningful time capsules. Free forever, secure by design, ready in minutes.
  </p>

  <Button
    size="lg"
    className="px-12 py-6 text-lg bg-white text-primary hover:bg-white/90 hover:scale-105 hover:shadow-glow-lg transition-all duration-200 animate-pulse-glow"
  >
    {isAuthenticated ? "Create Time Capsule" : "Get Started Free"}
  </Button>

  <p className="mt-4 text-sm text-white/70">
    No credit card required • 2 minute setup
  </p>

  <div className="mt-8 flex items-center justify-center gap-4 text-white/80 text-sm">
    <Github className="w-5 h-5" />
    <span>GitHub</span>
    <Mail className="w-5 h-5" />
    <span>Gmail</span>
  </div>
</div>
```

**CTA Button Animation**:
```css
@keyframes pulse-glow {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 20px rgba(255,255,255,0.3);
  }
  50% {
    transform: scale(1.02);
    box-shadow: 0 0 30px rgba(255,255,255,0.5);
  }
}
```

### ShadCN Components
- `button` (primary CTA)

---

## Global Component Patterns

### Button Variants

**Primary CTA**
```
className="bg-primary text-white hover:bg-primary/90 hover:scale-105 transition-all"
```

**Secondary**
```
className="bg-secondary text-white hover:bg-secondary/90"
```

**Outline**
```
variant="outline" className="border-primary text-primary hover:bg-primary/10"
```

**Ghost**
```
variant="ghost" className="text-primary hover:bg-primary/10"
```

### Card Variants

**Default**
```
className="p-6 bg-card border border-border rounded-lg shadow-sm"
```

**Hover Lift**
```
className="p-6 hover:-translate-y-2 hover:shadow-xl transition-all duration-250"
```

**Elevated**
```
className="p-8 bg-card rounded-xl shadow-2xl"
```

### Icon Backgrounds

**Circular**
```
className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center"
```

**Square**
```
className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center"
```

**Gradient Fill**
```
className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center"
```

---

## Responsive Breakpoints

### Mobile (<768px)
- Single column layouts
- Stacked sections
- Full-width buttons
- Larger touch targets (min 44x44px)
- Reduced padding: px-4, py-12-20
- Smaller text: text-4xl → text-3xl

### Tablet (768px-1024px)
- 2-column layouts for features
- Maintained spacing
- Flexible button widths

### Desktop (1024px+)
- Multi-column layouts (3-col grid)
- Generous spacing: px-8, py-24-32
- Hover states active
- Side-by-side content

---

## ShadCN Components to Install

### Core Components
```bash
npx shadcn@latest add accordion
npx shadcn@latest add badge
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add tabs
npx shadcn@latest add progress
npx shadcn@latest add separator
```

### Advanced Components (Option A - Full Enhancement)

**@magicui Components**:
```bash
npx shadcn@latest add @magicui/animated-gradient-text
npx shadcn@latest add @magicui/shimmer-button
npx shadcn@latest add @magicui/neon-gradient-card
npx shadcn@latest add @magicui/border-beam
```

**@aceternity Components**:
```bash
npx shadcn@latest add @aceternity/background-beams
```

**Manual Fallback** (if CLI fails):
- Visit magicui.design/docs/components
- Visit ui.aceternity.com/components
- Copy component code to `frontend/src/components/ui/`

### Brand Logos
```bash
npm install @svgl/react
```

---

## Implementation Checklist

- [ ] Install all ShadCN components
- [ ] Install Lucide React for icons
- [ ] Replace ALL 9 emojis with Lucide icons
- [ ] Implement Hero gradient background
- [ ] Add Trust Indicators Bar
- [ ] Create timeline with animation
- [ ] Build interactive demo with tabs
- [ ] Create feature cards grid
- [ ] Add use case photos (4 images)
- [ ] Implement FAQ accordion
- [ ] Style final CTA section
- [ ] Add all hover states
- [ ] Test responsive breakpoints
- [ ] Validate accessibility (focus states, keyboard nav)
- [ ] Test reduced motion support

---

**Next**: See animation-specs.md for timing and easing specifications
