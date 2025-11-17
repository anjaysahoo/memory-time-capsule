# Phase 2 → Phase 3 Handoff Document

**Project**: Memory Time Capsule Landing Page Revamp
**From**: UI Design & Visual System (Phase 2)
**To**: Frontend Implementation (Phase 3)
**Date**: 2025-11-17
**Status**: Ready for Implementation

---

## Executive Summary

Complete UI design system delivered. All visual specifications, component breakdowns, animation timing, and media assets ready for implementation. Design follows "Twilight Bridge" theme (cosmic purple + warm amber) to evoke time travel and nostalgic connection.

**Visual Philosophy**: Connecting present to future through emotionally resonant design.

### Quick Start
1. Install dependencies: `npm install lucide-react @svgl/react`
2. Install ShadCN components (list below) + advanced components
3. Update `frontend/src/index.css` with new color variables (provided)
4. Update `frontend/tailwind.config.js` with animations (provided)
5. Replace all 9 emojis with Lucide icons + use svgl for brand logos
6. Implement 9 sections per component specs with enhanced components
7. Add animations per animation specs
8. Source and integrate 4 photos per media specs

**Estimated Timeline**: 6 days (phased implementation)
**Enhancement Level**: Option A - Full Enhancement (svgl + @magicui + @aceternity)

---

## Design System Summary

### Color Palette: "Twilight Bridge"

**Rationale**: Blends cosmic depth (future/time) with nostalgic warmth (memory/connection). Creates emotional resonance with "messages to the future" concept.

#### Primary Colors (HSL for CSS Variables)

```css
:root {
  /* Primary: Cosmic Indigo - Future/time/space */
  --primary: 250 70% 60%;                /* #8B7EFF */
  --primary-foreground: 0 0% 100%;

  /* Secondary: Warm Amber - Memory/nostalgia */
  --secondary: 38 92% 50%;               /* #F59E0B */
  --secondary-foreground: 0 0% 100%;

  /* Accent: Future Teal - Hope/anticipation */
  --accent: 180 70% 50%;                 /* #26C9C9 */
  --accent-foreground: 0 0% 100%;

  /* Neutrals */
  --background: 0 0% 100%;               /* White */
  --foreground: 240 10% 3.9%;            /* Near-black */
  --muted: 250 30% 96%;                  /* Soft lavender #F7F6FB */
  --muted-foreground: 240 5% 40%;
  --border: 250 20% 88%;                 /* Purple-gray */
  --input: 250 20% 88%;
  --ring: 250 70% 60%;                   /* Primary for focus */

  /* Card */
  --card: 0 0% 100%;
  --card-foreground: 240 10% 3.9%;

  /* Semantic */
  --destructive: 0 84% 60%;              /* #EF4444 */
  --destructive-foreground: 0 0% 100%;
}
```

#### Gradients

**Hero/Final CTA Background**: "Twilight Cascade"
```css
bg-gradient-to-br from-primary via-purple-700 to-secondary
```
Visual: Cosmic purple → Deep purple → Warm amber

**Subtle Section Backgrounds**:
```css
bg-gradient-to-b from-background to-muted/30
```

**CTA Hover Glow**:
```css
shadow-[0_0_40px_rgba(139,126,255,0.4)]
```

---

### Typography

**Font Family**: Inter (modern, readable, single font for performance)
```css
font-family: 'Inter', system-ui, -apple-system, sans-serif;
```

**Type Scale**:
| Size | Class | Usage |
|------|-------|-------|
| 96px | text-7xl (desktop only) | Mega headlines (rare) |
| 72px | text-6xl | Hero headlines (desktop) |
| 60px | text-5xl | Final CTA headline |
| 48px | text-4xl | Section headers |
| 36px | text-3xl | Subsection headers |
| 30px | text-2xl | Card titles, timeline headers |
| 24px | text-xl | Large body, CTAs |
| 20px | text-lg | Subtitles |
| 16px | text-base | Body text |
| 14px | text-sm | Supporting text, badges |
| 12px | text-xs | Tiny labels |

**Mobile Scale** (reduce by ~25%):
- Hero: text-6xl → text-4xl
- Sections: text-4xl → text-3xl

---

### Spacing & Layout

**Section Padding**:
- Desktop: `py-32` (128px) for emphasis sections (Hero, CTA)
- Desktop: `py-24` (96px) for standard sections
- Desktop: `py-16` (64px) for compact sections
- Mobile: `py-20` (80px) → `py-16` (64px) → `py-12` (48px)

**Container Max-Widths**:
- Narrow (focus): `max-w-3xl` (768px) - FAQ, Final CTA
- Medium: `max-w-4xl` (896px) - Standard
- Standard: `max-w-5xl` (1024px) - Interactive Demo
- Wide: `max-w-6xl` (1152px) - Features, Timeline, Use Cases
- Extra Wide: `max-w-7xl` (1280px) - Trust Bar

**Card Gaps**:
- Features grid: `gap-8`
- Use cases: `gap-12`
- Timeline steps: `gap-16` (desktop), `gap-8` (mobile)

---

### Shadows & Elevation

```css
/* Card default */
shadow-sm              /* 0 1px 2px rgba(0,0,0,0.05) */

/* Card hover */
shadow-xl              /* 0 20px 25px rgba(0,0,0,0.1) */
shadow-2xl             /* 0 25px 50px rgba(0,0,0,0.25) */

/* CTA glow */
shadow-glow-lg         /* 0 0 40px rgba(139,126,255,0.4) */

/* Focus ring */
ring-2 ring-primary ring-offset-2
```

---

### Animations

**Tailwind Config Additions**:
```javascript
// Add to tailwind.config.js
module.exports = {
  theme: {
    extend: {
      animation: {
        'fadeInUp': 'fadeInUp 0.6s ease-out forwards',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'drawLine': 'drawLine 1.5s ease-out forwards',
        'float': 'float 2s ease-in-out infinite',
        'wiggle': 'wiggle 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      keyframes: {
        fadeInUp: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
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
      boxShadow: {
        'glow-lg': '0 0 40px rgba(139, 126, 255, 0.4)',
      },
    },
  },
};
```

**Reduced Motion** (add to `index.css`):
```css
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

## Component Breakdown by Section

### Section 1: Hero (ENHANCED)

**Layout**:
```jsx
import { GitHub, Gmail } from '@svgl/react';
import { BackgroundBeams } from '@/components/ui/background-beams'; // @aceternity
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text'; // @magicui
import { ShimmerButton } from '@/components/ui/shimmer-button'; // @magicui
import { ChevronDown } from 'lucide-react';

<section className="relative min-h-screen flex items-center justify-center overflow-hidden">
  {/* Animated background beams */}
  <BackgroundBeams className="absolute inset-0 z-0" />

  {/* Gradient overlay */}
  <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-purple-700/80 to-secondary/80 z-0" />

  {/* Content */}
  <div className="relative z-10 max-w-6xl mx-auto px-4 py-32 text-center">
    <AnimatedGradientText className="text-6xl md:text-7xl font-bold text-white mb-6">
      Send Messages to the <span className="text-secondary">Future</span>
    </AnimatedGradientText>

    <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto animate-fadeInUp [animation-delay:100ms]">
      Create time capsules with videos, photos, and messages.
      Automatically delivered to anyone, anywhere, at exactly the right moment.
    </p>

    <ShimmerButton
      size="lg"
      className="px-12 py-6 text-lg mb-8 animate-fadeInUp [animation-delay:200ms]"
    >
      {isAuthenticated ? "Create Time Capsule" : "Get Started Free"}
    </ShimmerButton>

    <div className="flex items-center justify-center gap-4 text-white/80 text-sm animate-fadeInUp [animation-delay:300ms]">
      <GitHub className="w-5 h-5" variant="light" />
      <span>Powered by GitHub</span>
      <Gmail className="w-5 h-5" />
      <span>Delivered via Gmail</span>
    </div>

    <button
      onClick={scrollToNextSection}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce [animation-delay:500ms]"
      aria-label="Scroll to next section"
    >
      <ChevronDown className="w-8 h-8 text-white/70" />
    </button>
  </div>
</section>
```

**ShadCN Components**: `button`, `@aceternity/background-beams`, `@magicui/animated-gradient-text`, `@magicui/shimmer-button`
**svgl Logos**: `GitHub`, `Gmail`
**Lucide Icons**: `ChevronDown`

---

### Section 2: Trust Indicators Bar (ENHANCED)

**Layout**:
```jsx
import { GitHub, Gmail } from '@svgl/react';
import { Shield, Gift } from 'lucide-react';

<section className="max-w-7xl mx-auto px-4 py-8">
  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
    {[
      { Logo: GitHub, title: "Powered by GitHub", subtitle: "Your data, your repo" },
      { Logo: Gmail, title: "Sent via Gmail", subtitle: "Reliable delivery" },
      { icon: Shield, title: "Encrypted Storage", subtitle: "Private & secure" },
      { icon: Gift, title: "100% Free", subtitle: "No credit card" },
    ].map((badge, i) => (
      <div
        key={i}
        className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-muted/50 transition-colors animate-fadeInUp"
        style={{animationDelay: `${i * 100}ms`}}
      >
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center hover:animate-wiggle">
          {badge.Logo ? (
            <badge.Logo className="w-6 h-6" />
          ) : (
            <badge.icon className="w-6 h-6 text-primary" />
          )}
        </div>
        <h3 className="font-semibold text-sm">{badge.title}</h3>
        <p className="text-xs text-muted-foreground">{badge.subtitle}</p>
      </div>
    ))}
  </div>
</section>
```

**svgl Logos**: `GitHub`, `Gmail`
**Lucide Icons**: `Shield`, `Gift`

---

### Section 3: How It Works Timeline

**Layout (Desktop - Horizontal)**:
```jsx
<section className="max-w-6xl mx-auto px-4 py-24">
  <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
    How It Works
  </h2>

  {/* Timeline */}
  <div className="relative grid grid-cols-1 md:grid-cols-3 gap-16">
    {/* Horizontal line (desktop) */}
    <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-muted">
      <div className="h-full bg-primary animate-drawLine" />
    </div>

    {/* Steps */}
    {[
      {
        icon: Link,
        title: "Connect Your Accounts",
        description: "Link GitHub and Gmail in under 2 minutes with OAuth",
        badge: "~2 min",
        supporting: [Github, Mail],
      },
      {
        icon: Upload,
        title: "Create Your Capsule",
        description: "Upload videos, photos, audio, or text. Set delivery date and recipient.",
        badge: "Any time",
        supporting: [FileVideo, FileAudio, FileImage],
      },
      {
        icon: Send,
        title: "Automatic Unlock",
        description: "GitHub Actions sends your capsule via Gmail at the exact moment.",
        badge: "Hourly precision",
        supporting: [Mail, Calendar],
      },
    ].map((step, i) => (
      <div key={i} className="relative flex flex-col items-center gap-4 animate-fadeInUp" style={{animationDelay: `${400 + i * 500}ms`}}>
        {/* Node */}
        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center relative z-10 shadow-lg">
          <step.icon className="w-8 h-8 text-white" />
        </div>

        {/* Content */}
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
          <p className="text-muted-foreground mb-3">{step.description}</p>
          <div className="flex gap-2 justify-center items-center">
            <Badge variant="secondary" className="text-xs">{step.badge}</Badge>
            {step.supporting.map((Icon, idx) => (
              <Icon key={idx} className="w-4 h-4 text-muted-foreground" />
            ))}
          </div>
        </div>
      </div>
    ))}
  </div>
</section>
```

**ShadCN Components**: `badge`
**Lucide Icons**: `Link`, `Upload`, `Send`, `Github`, `Mail`, `FileVideo`, `FileAudio`, `FileImage`, `Calendar`

---

### Section 4: Interactive Demo

**Layout**:
```jsx
<section className="max-w-5xl mx-auto px-4 py-32 bg-muted/30">
  <h2 className="text-4xl font-bold text-center mb-4">See It In Action</h2>
  <p className="text-lg text-center text-muted-foreground mb-8">
    Click through a sample time capsule journey
  </p>

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

      <TabsContent value="create" className="min-h-[400px]">
        {/* Mockup of upload UI */}
        <div className="border-2 border-dashed border-muted rounded-lg p-12 text-center">
          <FileVideo className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Upload your content here...</p>
        </div>
      </TabsContent>

      <TabsContent value="storage" className="min-h-[400px]">
        {/* Mockup of GitHub repo */}
        <div className="bg-muted/50 rounded-lg p-8">
          <Github className="w-12 h-12 mb-4 text-primary" />
          <p className="font-mono text-sm">capsules/birthday-message.mp4</p>
        </div>
      </TabsContent>

      <TabsContent value="delivery" className="min-h-[400px]">
        {/* Mockup of Gmail */}
        <div className="bg-white border rounded-lg p-8 shadow-sm">
          <Mail className="w-12 h-12 mb-4 text-primary" />
          <h4 className="font-bold mb-2">You have a Time Capsule!</h4>
          <p className="text-sm text-muted-foreground">
            A message from the past is ready to open...
          </p>
        </div>
      </TabsContent>
    </Tabs>

    {/* Progress dots */}
    <div className="flex gap-2 justify-center mt-6">
      <div className="w-2 h-2 rounded-full bg-primary" />
      <div className="w-2 h-2 rounded-full bg-muted" />
      <div className="w-2 h-2 rounded-full bg-muted" />
    </div>
  </Card>
</section>
```

**ShadCN Components**: `card`, `tabs`
**Lucide Icons**: `Upload`, `Database`, `Mail`, `FileVideo`, `Github`

---

### Section 5: Features Grid (ENHANCED)

**Layout**:
```jsx
import { NeonGradientCard } from '@/components/ui/neon-gradient-card'; // @magicui
import { BorderBeam } from '@/components/ui/border-beam'; // @magicui
import { FileVideo, Shield, Clock, Mail, Gift, Share2 } from 'lucide-react';

<section className="max-w-6xl mx-auto px-4 py-24">
  <h2 className="text-4xl font-bold text-center mb-16">Everything You Need</h2>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {[
      {
        icon: FileVideo,
        title: "Rich Media Support",
        description: "Videos up to 100MB, audio, photos, or text messages",
      },
      {
        icon: Shield,
        title: "Bank-Level Security",
        description: "AES-256 encryption, private GitHub storage",
      },
      {
        icon: Clock,
        title: "Hourly Precision",
        description: "GitHub Actions cron, deliver any future date",
      },
      {
        icon: Mail,
        title: "Reliable Notifications",
        description: "Gmail delivery with PIN access for security",
      },
      {
        icon: Gift,
        title: "Forever Free",
        description: "Free tiers of GitHub, Gmail, Cloudflare. 1GB storage",
      },
      {
        icon: Share2,
        title: "WhatsApp Integration",
        description: "Pre-filled sharing messages for easy distribution",
      },
    ].map((feature, i) => (
      <NeonGradientCard
        key={i}
        className="p-6 group opacity-0 animate-fadeInUp"
        style={{animationDelay: `${i * 80}ms`}}
        neonColors={{
          firstColor: '#8B7EFF', // primary
          secondColor: '#F59E0B', // secondary
        }}
      >
        <BorderBeam size={200} duration={12 + i * 2} delay={i * 2} />

        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <feature.icon className="w-6 h-6 text-primary group-hover:animate-float" />
        </div>
        <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
        <p className="text-muted-foreground">{feature.description}</p>
      </NeonGradientCard>
    ))}
  </div>
</section>
```

**ShadCN Components**: `@magicui/neon-gradient-card`, `@magicui/border-beam`
**Lucide Icons**: `FileVideo`, `Shield`, `Clock`, `Mail`, `Gift`, `Share2`

---

### Section 6: Use Cases

**Layout**:
```jsx
<section className="max-w-7xl mx-auto px-4 py-32 bg-gradient-to-b from-background to-muted/30">
  <h2 className="text-4xl font-bold text-center mb-4">Real Stories, Real Connections</h2>
  <p className="text-xl text-center text-muted-foreground mb-16">
    See how people use time capsules to create meaningful moments
  </p>

  <div className="space-y-16">
    {[
      {
        icon: Cake,
        title: "Personal Milestones",
        quote: "I recorded a message to my daughter for her 18th birthday when she was 10. She'll receive it on her special day.",
        badge: "Birthday Messages",
        image: "/images/use-cases/birthday.jpg",
        imageAlt: "Family celebrating birthday with cake and candles",
      },
      {
        icon: Briefcase,
        title: "Professional Reminders",
        quote: "I use it for quarterly business reviews 90 days apart. Keeps me accountable to my goals.",
        badge: "Business Planning",
        image: "/images/use-cases/professional.jpg",
        imageAlt: "Professional workspace with calendar and planning materials",
      },
      {
        icon: Heart,
        title: "Long-Distance Connections",
        quote: "My partner's deployment is 6 months. I scheduled weekly messages to arrive every Sunday.",
        badge: "Relationship Building",
        image: "/images/use-cases/connection.jpg",
        imageAlt: "Two people embracing, showing connection and relationship",
      },
      {
        icon: Camera,
        title: "Family Time Capsules",
        quote: "Every New Year's Eve, we record a family video for the next year. It's become our tradition.",
        badge: "Family Traditions",
        image: "/images/use-cases/family.jpg",
        imageAlt: "Multi-generational family creating memories together",
      },
    ].map((useCase, i) => (
      <div
        key={i}
        className={`grid md:grid-cols-2 gap-12 items-center ${
          i % 2 === 1 ? 'md:flex-row-reverse' : ''
        }`}
      >
        {/* Image */}
        <div className={`relative overflow-hidden rounded-xl shadow-lg group ${i % 2 === 1 ? 'md:order-2' : ''}`}>
          <picture>
            <source srcSet={`${useCase.image.replace('.jpg', '.webp')}`} type="image/webp" />
            <img
              src={useCase.image}
              alt={useCase.imageAlt}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              width="800"
              height="600"
            />
          </picture>
        </div>

        {/* Content */}
        <div className={i % 2 === 1 ? 'md:order-1' : ''}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
              <useCase.icon className="w-5 h-5 text-secondary" />
            </div>
            <h3 className="text-2xl font-bold">{useCase.title}</h3>
          </div>
          <blockquote className="text-lg text-muted-foreground mb-4 italic">
            "{useCase.quote}"
          </blockquote>
          <Badge variant="secondary">{useCase.badge}</Badge>
        </div>
      </div>
    ))}
  </div>
</section>
```

**ShadCN Components**: `badge`
**Lucide Icons**: `Cake`, `Briefcase`, `Heart`, `Camera`
**Media**: 4 photos (source from Unsplash/Pexels MCP)

---

### Section 7: Social Proof / Tech Stack (ENHANCED)

**Layout**:
```jsx
import { GitHub, Gmail, Cloudflare } from '@svgl/react';
import { Database, Workflow, Cloud, Code, Lock, EyeOff, Key, Hash, FileText, CheckCircle } from 'lucide-react';

<section className="max-w-6xl mx-auto px-4 py-24 bg-muted/50">
  <div className="grid md:grid-cols-2 gap-16">
    {/* Tech Stack */}
    <div>
      <h2 className="text-3xl font-bold mb-8">Built on Enterprise Tech</h2>
      <ul className="space-y-4">
        {[
          { Logo: GitHub, icon: Database, title: "GitHub Storage", subtitle: "Private repo (1GB free)", useLogo: true },
          { icon: Workflow, title: "GitHub Actions", subtitle: "Cron-based (99.9% uptime)" },
          { Logo: Gmail, title: "Gmail API", subtitle: "OAuth2 token-based auth", useLogo: true },
          { Logo: Cloudflare, icon: Cloud, title: "Cloudflare Workers", subtitle: "Edge computing (<100ms)", useLogo: true },
          { icon: Code, title: "React + TypeScript", subtitle: "Open source, auditable" },
        ].map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            {item.useLogo && item.Logo ? (
              <item.Logo className="w-8 h-8 flex-shrink-0" />
            ) : (
              <item.icon className="w-8 h-8 text-primary flex-shrink-0" />
            )}
            <div>
              <h4 className="font-semibold">{item.title}</h4>
              <p className="text-sm text-muted-foreground">{item.subtitle}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>

    {/* Security */}
    <div>
      <h2 className="text-3xl font-bold mb-8">Security & Privacy</h2>
      <ul className="space-y-4">
        {[
          { icon: Lock, title: "AES-256 Encryption", subtitle: "All files encrypted at rest" },
          { icon: EyeOff, title: "Zero-Knowledge", subtitle: "We can't access your content" },
          { icon: Key, title: "OAuth2", subtitle: "Revocable permissions" },
          { icon: Hash, title: "PIN Protection", subtitle: "6-digit recipient PIN" },
          { icon: FileText, title: "Audit Trail", subtitle: "GitHub activity logs" },
          { icon: CheckCircle, title: "GDPR Compliant", subtitle: "EU data protection" },
        ].map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <item.icon className="w-8 h-8 text-primary flex-shrink-0" />
            <div>
              <h4 className="font-semibold">{item.title}</h4>
              <p className="text-sm text-muted-foreground">{item.subtitle}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </div>
</section>
```

**svgl Logos**: `GitHub`, `Gmail`, `Cloudflare`
**Lucide Icons**: `Database`, `Workflow`, `Cloud`, `Code`, `Lock`, `EyeOff`, `Key`, `Hash`, `FileText`, `CheckCircle`

---

### Section 8: FAQ

**Layout**:
```jsx
<section className="max-w-4xl mx-auto px-4 py-24 bg-muted/30">
  <h2 className="text-4xl font-bold text-center mb-4">Frequently Asked Questions</h2>
  <p className="text-center text-muted-foreground mb-12">
    Everything you need to know about Memory Time Capsule
  </p>

  <Accordion type="single" collapsible className="w-full">
    {[
      {
        q: "Is it really free?",
        a: "Yes! We use free tiers of GitHub (1GB storage), Gmail API, and Cloudflare. No hidden costs, no credit card required.",
      },
      {
        q: "How does scheduled delivery work?",
        a: "GitHub Actions runs hourly checks. When your delivery date arrives, it automatically sends your capsule via Gmail with a PIN-protected link.",
      },
      {
        q: "Is my content secure and private?",
        a: "Absolutely. All files are encrypted with AES-256 and stored in your private GitHub repo. We use OAuth2 for access, which you can revoke anytime.",
      },
      {
        q: "What file types can I send?",
        a: "Videos (up to 100MB), audio files, photos, and text messages. Most common formats supported: MP4, MP3, JPG, PNG, PDF.",
      },
      {
        q: "What happens if I delete my GitHub account?",
        a: "Your time capsules are stored in your repo. If you delete your account, the capsules are lost. We recommend keeping your account active or exporting data first.",
      },
      {
        q: "Can I edit or cancel a capsule after creating it?",
        a: "Yes! You can edit or delete capsules anytime before their delivery date through your dashboard.",
      },
      {
        q: "Why do you need Gmail access?",
        a: "We use Gmail API to send delivery emails on your behalf. We only request send permissions, not read access to your existing emails.",
      },
      {
        q: "How long can I set a capsule?",
        a: "Any future date! Create capsules for tomorrow, next year, or decades from now. GitHub Actions supports far-future scheduling.",
      },
    ].map((faq, i) => (
      <AccordionItem key={i} value={`item-${i + 1}`}>
        <AccordionTrigger className="text-lg font-semibold hover:text-primary">
          {faq.q}
        </AccordionTrigger>
        <AccordionContent className="text-muted-foreground">
          {faq.a}
        </AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>

  <p className="text-center mt-8 text-sm text-muted-foreground">
    Still have questions?{' '}
    <a href="/support" className="text-primary hover:underline">
      Contact Support
    </a>
  </p>
</section>
```

**ShadCN Components**: `accordion`

---

### Section 9: Final CTA (ENHANCED)

**Layout**:
```jsx
import { GitHub, Gmail } from '@svgl/react';
import { ShimmerButton } from '@/components/ui/shimmer-button'; // @magicui

<section className="max-w-3xl mx-auto px-4 py-32 mb-16">
  <div className="bg-gradient-to-br from-primary via-purple-700 to-secondary rounded-2xl p-16 text-center relative overflow-hidden">
    {/* Optional: Add subtle animated background */}
    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

    <div className="relative z-10">
      <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
        Ready to Send a Message to the Future?
      </h2>

      <p className="text-xl text-white/90 mb-8">
        Join thousands creating meaningful time capsules. Free forever, secure by design, ready in minutes.
      </p>

      <ShimmerButton
        size="lg"
        className="px-12 py-6 text-lg mb-4"
        shimmerColor="#ffffff"
        shimmerSize="0.1em"
        background="white"
      >
        {isAuthenticated ? "Create Time Capsule" : "Get Started Free"}
      </ShimmerButton>

      <p className="text-sm text-white/70">
        No credit card required • 2 minute setup
      </p>

      <div className="mt-8 flex items-center justify-center gap-4 text-white/80 text-sm">
        <GitHub className="w-5 h-5" variant="light" />
        <span>GitHub</span>
        <Gmail className="w-5 h-5" />
        <span>Gmail</span>
      </div>
    </div>
  </div>
</section>
```

**ShadCN Components**: `@magicui/shimmer-button`
**svgl Logos**: `GitHub`, `Gmail`

---

## Dependencies & Components to Install

### NPM Packages
```bash
# Icon libraries
npm install lucide-react @svgl/react

# Or with version pinning
npm install lucide-react@^0.300.0 @svgl/react@^1.0.0
```

### ShadCN Core Components
```bash
# Core components
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add badge
npx shadcn@latest add tabs
npx shadcn@latest add accordion
```

### Advanced Components (Option A - Full Enhancement)

**@magicui Components**:
```bash
# Option 1: Install via CLI (if registry is configured)
npx shadcn@latest add @magicui/animated-gradient-text
npx shadcn@latest add @magicui/shimmer-button
npx shadcn@latest add @magicui/neon-gradient-card
npx shadcn@latest add @magicui/border-beam

# Option 2: Manual installation (if CLI fails)
# Visit magicui.design/docs/components and copy/paste code
# Save to: frontend/src/components/ui/
```

**@aceternity Components**:
```bash
# Option 1: Install via CLI (if registry is configured)
npx shadcn@latest add @aceternity/background-beams

# Option 2: Manual installation (if CLI fails)
# Visit ui.aceternity.com/components/background-beams
# Copy component code to: frontend/src/components/ui/background-beams.tsx
```

### Optional (for future features)
```bash
npx shadcn@latest add dialog
npx shadcn@latest add progress
npx shadcn@latest add separator
npx shadcn@latest add skeleton
```

### Installation Notes

**If registry commands fail**:
1. Visit component websites directly
2. Copy component code
3. Paste into `frontend/src/components/ui/[component-name].tsx`
4. Install peer dependencies as needed (usually `framer-motion`)

**Peer Dependencies** (may be required):
```bash
npm install framer-motion@^11.0.0
npm install class-variance-authority clsx tailwind-merge
```

---

## Media Assets Required

### Brand Logos (svgl React)
```bash
npm install @svgl/react
```

**Import List**:
```jsx
import { GitHub, Gmail, WhatsApp, Cloudflare } from '@svgl/react';

// Usage
<GitHub className="w-6 h-6" variant="dark" /> // or variant="light"
<Gmail className="w-6 h-6" />
<WhatsApp className="w-6 h-6" />
<Cloudflare className="w-6 h-6" />
```

**Benefits**:
- Official brand logos (always up-to-date)
- Optimized SVGs (~3-8KB vs 45KB manual downloads)
- Built-in light/dark variants
- TypeScript support
- Saves ~168KB vs manual logo downloads

### Icons (Lucide React)
```bash
npm install lucide-react
```

**Complete Import List**:
```jsx
import {
  // Hero & CTA (ChevronDown only - GitHub/Gmail from svgl)
  ChevronDown,

  // Trust Bar (Shield/Gift only - GitHub/Gmail from svgl)
  Shield, Gift, Clock, Zap,

  // Timeline
  Link, GitBranch, Upload, FileVideo, Send, Calendar,
  FileAudio, FileImage, FileText,

  // Interactive Demo
  Database, Archive, Circle, ChevronLeft, ChevronRight, Play, Pause,

  // Features
  Film, ShieldCheck, Timer, Sparkles, Share2, MessageCircle,

  // Use Cases
  Cake, Briefcase, Heart, Users, Camera,

  // Tech/Security (some replaced by svgl)
  Workflow, Cloud, Server, Code, Terminal,
  Lock, Key, EyeOff, Hash, CheckCircle,

  // UI
  ExternalLink, Menu, X, User, UserCircle, Settings, LogOut,
} from 'lucide-react';
```

**Note**: GitHub, Gmail, WhatsApp, Cloudflare now use svgl instead of Lucide

### Photos (4 Required)

**Source via MCP**:
```javascript
// Use Unsplash MCP tool
mcp__unsplash__search_photos({
  query: "birthday celebration family",
  per_page: 10,
  orientation: "landscape"
})

// Or Pexels MCP tool
mcp__pexels__photos_search({
  query: "family birthday",
  per_page: 10,
  orientation: "landscape"
})
```

**Required Images**:
1. `birthday.jpg` / `birthday.webp` - Personal milestone
2. `professional.jpg` / `professional.webp` - Professional reminder
3. `connection.jpg` / `connection.webp` - Long-distance connection
4. `family.jpg` / `family.webp` - Family time capsule

**Optimization**:
- Dimensions: 800x600px (4:3)
- Format: WebP primary + JPG fallback
- Size: <100KB each
- Total: ~400KB for all 4

### Brand Logos

**Manual Download**:
- GitHub: https://github.com/logos
- Gmail: Google Brand Resources (or use Lucide `Mail` icon)
- WhatsApp: WhatsApp Brand Guidelines

**File Structure**:
```
/public
  /images
    /use-cases
      birthday.webp
      birthday.jpg
      professional.webp
      professional.jpg
      connection.webp
      connection.jpg
      family.webp
      family.jpg
  /logos
    github.svg
    gmail.svg (optional)
    whatsapp.svg
```

---

## Implementation Priority

### Phase 1 (Days 1-2): Foundation + Advanced Setup
1. **Install all dependencies**:
   ```bash
   npm install lucide-react @svgl/react framer-motion
   ```
2. **Install ShadCN core components**:
   ```bash
   npx shadcn@latest add button card badge tabs accordion
   ```
3. **Install advanced components** (Option A):
   ```bash
   # @magicui (try CLI first, manual fallback)
   npx shadcn@latest add @magicui/animated-gradient-text
   npx shadcn@latest add @magicui/shimmer-button
   npx shadcn@latest add @magicui/neon-gradient-card
   npx shadcn@latest add @magicui/border-beam

   # @aceternity (try CLI first, manual fallback)
   npx shadcn@latest add @aceternity/background-beams
   ```
   **Fallback**: If CLI fails, manually copy from websites
4. Update `index.css` with new CSS variables
5. Update `tailwind.config.js` with animations
6. Replace all 9 emojis with Lucide icons
7. Replace logo icons with svgl (GitHub, Gmail, WhatsApp, Cloudflare)
8. Implement Hero section with BackgroundBeams + AnimatedGradientText + ShimmerButton
9. Add Trust Indicators Bar with svgl logos
10. Update Timeline with Lucide icons
11. Test responsive breakpoints

**Deliverable**: Core sections with advanced components, svgl logos, no emojis, responsive

**Time Estimate**: Days 1-2 (+4 hours for advanced component setup)

---

### Phase 2 (Days 3-4): Content Sections with Enhanced Components
12. Implement Interactive Demo with tabs
13. Update Features Grid with NeonGradientCard + BorderBeam
14. Add Use Cases section (use placeholder images initially)
15. Add Tech/Security section with svgl brand logos
16. Implement FAQ accordion
17. Style Final CTA section with ShimmerButton
18. Source and optimize 4 photos via Unsplash/Pexels MCP
19. Test all @magicui animations (gradient text, shimmer, neon borders)
20. Verify svgl logos render correctly in all sections

**Deliverable**: All 9 sections functional with enhanced components, placeholder photos

**Time Estimate**: Days 3-4 (no additional time - components already installed)

---

### Phase 3 (Days 5-6): Polish & Optimization
21. Replace placeholder photos with optimized WebP/JPG
22. Implement all scroll-based animations (Intersection Observer)
23. Add remaining hover states and micro-interactions
24. Implement `prefers-reduced-motion` support (disable BackgroundBeams, etc.)
25. Add keyboard focus states and ARIA labels
26. Optimize image loading (lazy load, srcset)
27. **Test advanced components**:
    - BackgroundBeams performance on mobile
    - AnimatedGradientText visibility/readability
    - NeonGradientCard + BorderBeam performance
    - ShimmerButton accessibility
28. Performance audit (Lighthouse) - target 85+ (animations may reduce score slightly)
29. Cross-browser testing (Chrome, Firefox, Safari, Edge)
30. Accessibility audit (WCAG AA compliance)
31. Mobile testing on real devices
32. Bundle size check (should be <2.2MB with advanced components)

**Deliverable**: Production-ready landing page with premium components, 85+ Lighthouse score

**Time Estimate**: Days 5-6 (same timeline - polish integrated throughout)

---

## Success Criteria

### Visual Design
- [ ] "Twilight Bridge" color palette fully implemented
- [ ] All 9 emojis replaced with Lucide icons
- [ ] Gradients applied to Hero and Final CTA
- [ ] Typography scale consistent across all sections
- [ ] Shadows and elevation create clear hierarchy

### Functionality
- [ ] All 9 sections implemented and responsive
- [ ] Interactive Demo tabs functional
- [ ] FAQ accordion expands/collapses smoothly
- [ ] CTAs link to appropriate auth/dashboard routes
- [ ] Scroll indicator navigates to next section

### Animations
- [ ] Hero cascade animation (headline → CTA)
- [ ] Timeline line drawing animation
- [ ] Feature cards staggered reveal
- [ ] Card hover lift effects
- [ ] CTA button pulse glow
- [ ] Reduced motion mode disables animations

### Media Assets
- [ ] 4 use case photos optimized (<100KB each)
- [ ] All images have WebP + JPG fallback
- [ ] Lazy loading works for below-fold images
- [ ] All images have descriptive alt text
- [ ] Brand logos (GitHub, Gmail) properly sized

### Accessibility
- [ ] WCAG AA color contrast (4.5:1 text, 3:1 large text)
- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible (2px outline + 4px ring)
- [ ] ARIA labels on all functional icons
- [ ] Heading hierarchy correct (h1 → h2 → h3, no skips)
- [ ] Screen reader tested (no critical errors)
- [ ] Reduced motion fully supported

### Performance
- [ ] Total page weight <2MB (excluding optional video)
- [ ] Lighthouse Performance score 90+
- [ ] First Contentful Paint <1.8s
- [ ] Largest Contentful Paint <2.5s
- [ ] Cumulative Layout Shift <0.1
- [ ] All animations maintain 60fps

### Cross-Browser
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

---

## Testing Checklist

### Visual Testing
```bash
# Desktop
- [ ] 1920x1080 (Full HD)
- [ ] 1440x900 (MacBook)
- [ ] 1366x768 (Laptop)

# Tablet
- [ ] 1024x768 (iPad)
- [ ] 768x1024 (iPad portrait)

# Mobile
- [ ] 414x896 (iPhone XR/11)
- [ ] 390x844 (iPhone 12/13)
- [ ] 360x800 (Android)
```

### Functional Testing
- [ ] Hero CTA button navigates correctly
- [ ] Scroll indicator scrolls to Trust Bar
- [ ] Interactive Demo tabs switch smoothly
- [ ] FAQ items expand/collapse
- [ ] All hover states work (desktop only)
- [ ] Touch targets minimum 44x44px (mobile)

### Accessibility Testing
```bash
# Browser DevTools
- [ ] Chrome Lighthouse audit (Accessibility 100)
- [ ] Firefox Accessibility Inspector (no errors)
- [ ] Safari Web Inspector (no violations)

# Screen Readers
- [ ] NVDA (Windows) - All content readable
- [ ] JAWS (Windows) - Landmarks navigable
- [ ] VoiceOver (Mac) - No critical errors

# Keyboard Navigation
- [ ] Tab order logical (top to bottom)
- [ ] All interactive elements focusable
- [ ] Focus indicators visible
- [ ] Enter/Space activate buttons
- [ ] Escape closes modals (if any)

# Reduced Motion
- [ ] System setting respected
- [ ] Animations disabled/simplified
- [ ] Content still accessible
```

### Performance Testing
```bash
# Chrome DevTools
- [ ] Lighthouse Performance 90+
- [ ] Network tab: Total load <2MB
- [ ] Performance tab: No layout thrashing
- [ ] Coverage tab: Minimal unused CSS/JS

# Real Devices
- [ ] iPhone 12 (iOS Safari)
- [ ] Pixel 5 (Chrome Android)
- [ ] Mid-range device smooth scrolling
```

---

## Files to Update

### Frontend Files
```
frontend/
  src/
    index.css                   # Update CSS variables, add animations
    pages/
      Home.tsx                  # Complete rewrite (9 sections)
    components/                 # New components for sections
      TrustBar.tsx
      Timeline.tsx
      InteractiveDemo.tsx
      FeatureCard.tsx
      UseCase.tsx
      FAQ.tsx
  tailwind.config.js            # Add custom animations, shadows
  public/
    images/
      use-cases/                # Add 4 optimized photos
    logos/                      # Add brand logos
```

### Configuration Files
```
package.json                    # Add lucide-react dependency
```

---

## Code Examples

### CSS Variables Update (index.css)

Replace current `:root` block with:
```css
@layer base {
  :root {
    /* Twilight Bridge Color System */
    --primary: 250 70% 60%;
    --primary-foreground: 0 0% 100%;
    --secondary: 38 92% 50%;
    --secondary-foreground: 0 0% 100%;
    --accent: 180 70% 50%;
    --accent-foreground: 0 0% 100%;

    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    --muted: 250 30% 96%;
    --muted-foreground: 240 5% 40%;
    --border: 250 20% 88%;
    --input: 250 20% 88%;
    --ring: 250 70% 60%;

    --card: 0 0% 100%;
    --card-foreground: 240 10% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 240 10% 3.9%;

    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 100%;

    --radius: 0.5rem;
  }
}

/* Custom Animations */
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

## Contact & Support

### For Questions
**Reference Documents**:
- `design-system.md` - Complete design system
- `component-specs.md` - Section-by-section implementation
- `animation-specs.md` - Animation timing and easing
- `media-integration.md` - Photo/video/icon specifications

### For Issues
- Color contrast validation: Use browser DevTools contrast checker
- Animation performance: Chrome DevTools Performance tab
- Accessibility: Lighthouse Accessibility audit
- Cross-browser: BrowserStack or manual testing

---

## Summary

**Phase 2 Complete**: Full UI design system delivered.

**Key Achievements**:
1. ✅ "Twilight Bridge" color palette (cosmic purple + warm amber)
2. ✅ Complete component specifications (9 sections)
3. ✅ Animation system (fadeInUp, pulse-glow, drawLine, float, wiggle)
4. ✅ Media asset catalog (icons, photos, logos)
5. ✅ Accessibility requirements (WCAG AA compliant)
6. ✅ Performance budget (<2MB)

**Next Steps (Phase 3)**:
1. Install dependencies (Lucide React, ShadCN components)
2. Update CSS variables and Tailwind config
3. Implement all 9 sections
4. Replace emojis with icons
5. Add animations
6. Source and optimize photos
7. Test accessibility and performance
8. Launch!

**Timeline**: 6 days (phased implementation)

**Expected Outcome**: Professional, accessible, performant landing page that converts visitors through emotional storytelling and trust-building.

---

🚀 **Ready for Phase 3 Implementation!**
