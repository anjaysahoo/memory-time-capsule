# Media Integration Specifications: Memory Time Capsule Landing Page

**Version:** 1.0
**Date:** 2025-11-17
**Phase:** 2 (UI Design)

---

## Overview

Complete media asset catalog for Memory Time Capsule landing page including icons, photos, videos, brand logos, and illustrations. All assets optimized for performance (<2MB total page weight) and accessibility.

**Asset Categories**:
- Icons: 40+ (Lucide React library)
- Brand Logos: 4 (GitHub, Gmail, WhatsApp, Cloudflare)
- Photos: 4 required (use cases)
- Videos: 1 optional (hero background)
- Illustrations: 2-4 (timeline, architecture)

---

## 1. Icon System

### Primary Library: Lucide React

**Installation**:
```bash
npm install lucide-react
```

**Rationale**:
- Already compatible with ShadCN UI
- Tree-shakeable (only import what you use)
- Consistent design language
- 1000+ icons available
- MIT license
- TypeScript support
- Regular updates

**Usage Pattern**:
```jsx
import { Github, Mail, Shield, FileVideo } from 'lucide-react';

<FileVideo className="w-6 h-6 text-primary" />
```

---

### Critical Emoji Replacements

**ALL 9 emojis must be replaced with Lucide icons**:

| Current Emoji | Location | Lucide Icon | Size |
|---------------|----------|-------------|------|
| 🎁 | Hero headline | `Gift` | Remove entirely |
| 1️⃣ | Timeline Step 1 | `Link` or `GitBranch` | 48px |
| 2️⃣ | Timeline Step 2 | `Upload` or `FileVideo` | 48px |
| 3️⃣ | Timeline Step 3 | `Send` or `Calendar` | 48px |
| 🎥 | Feature: Media | `FileVideo` | 24px |
| 🔒 | Feature: Security | `Shield` or `ShieldCheck` | 24px |
| ⏰ | Feature: Timing | `Clock` or `Timer` | 24px |
| 📧 | Feature: Email | `Mail` or `Send` | 24px |
| 💰 | Feature: Free | `Gift` or `Sparkles` | 24px |
| 📱 | Feature: Sharing | `Share2` or `MessageCircle` | 24px |

---

### Complete Icon Inventory

#### Hero Section
```jsx
import { Github, Mail, ChevronDown } from 'lucide-react';
```
- `Github` (20px) - Powered by GitHub badge
- `Mail` (20px) - Delivered via Gmail badge
- `ChevronDown` (32px) - Scroll indicator

#### Trust Indicators Bar
```jsx
import { Github, Mail, Shield, Gift, Clock } from 'lucide-react';
```
- `Github` (32px) - GitHub integration badge
- `Mail` (32px) - Gmail delivery badge
- `Shield` (32px) - Security badge
- `Gift` (32px) - Free forever badge
- `Clock` or `Zap` (32px) - Automated delivery badge

#### How It Works Timeline
```jsx
import {
  Link, GitBranch, Upload, FileVideo, Send, Calendar,
  Github, Mail, FileAudio, FileImage, FileText
} from 'lucide-react';
```

**Main Step Icons** (48px):
- `Link` or `GitBranch` - Step 1: Connect
- `Upload` or `FileVideo` - Step 2: Create
- `Send` or `Calendar` - Step 3: Deliver

**Supporting Icons** (20px):
- `Github`, `Mail` - Service logos
- `FileVideo`, `FileAudio`, `FileImage`, `FileText` - Content types

#### Interactive Demo
```jsx
import {
  Upload, Database, Archive, Mail, Circle,
  ChevronLeft, ChevronRight, Play, Pause
} from 'lucide-react';
```
- `Upload` (32px) - Create state
- `Database` or `Archive` (32px) - Storage state
- `Mail` (32px) - Delivery state
- `Circle` (16px) - Progress indicators
- `ChevronLeft`, `ChevronRight` (24px) - Navigation
- `Play`, `Pause` (32px) - Auto-advance controls

#### Features Grid
```jsx
import {
  FileVideo, Film, Shield, ShieldCheck,
  Clock, Timer, Mail, Send, Gift, Sparkles,
  Share2, MessageCircle
} from 'lucide-react';
```

**Feature Icons** (24px in circular backgrounds):
1. `FileVideo` or `Film` - Multiple Content Types
2. `Shield` or `ShieldCheck` - Secure & Private
3. `Clock` or `Timer` - Precise Timing
4. `Mail` or `Send` - Email Delivery
5. `Gift` or `Sparkles` - 100% Free
6. `Share2` or `MessageCircle` - Easy Sharing (WhatsApp)

#### Use Cases
```jsx
import { Cake, Gift, Briefcase, Calendar, Heart, Users, Camera } from 'lucide-react';
```
- `Cake` or `Gift` (40px) - Personal Milestones
- `Briefcase` or `Calendar` (40px) - Professional Reminders
- `Heart` or `Users` (40px) - Long-Distance Connections
- `Camera` (40px) - Family Time Capsules

#### Tech Stack / Security Section
```jsx
import {
  Database, Workflow, Zap, Cloud, Server, Code, Terminal,
  Lock, Key, EyeOff, Hash, FileText, CheckCircle
} from 'lucide-react';
```

**Tech Icons** (32px):
- `Database` - GitHub Storage
- `Workflow` or `Zap` - GitHub Actions
- `Cloud` or `Server` - Cloudflare
- `Code` or `Terminal` - Open Source

**Security Icons** (32px):
- `Lock` - AES-256 Encryption
- `Key` - OAuth2
- `EyeOff` - Zero-Knowledge
- `Hash` - PIN Protection
- `FileText` - Audit Trail
- `CheckCircle` - GDPR Compliant

#### FAQ Section
```jsx
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
```
- `ChevronDown`, `ChevronUp` (20px) - Accordion triggers
- `HelpCircle` (20px) - Section icon (optional)

#### UI Elements
```jsx
import { ExternalLink, Menu, X, User, UserCircle, Settings, LogOut } from 'lucide-react';
```
- `ExternalLink` (16px) - External links
- `Menu` (24px) - Mobile menu
- `X` (24px) - Close buttons
- `User` or `UserCircle` (24px) - User menu
- `Settings` (24px) - Settings
- `LogOut` (24px) - Logout

---

### Icon Design Specifications

**Sizing Scale**:
```jsx
// Small UI elements
className="w-4 h-4"  // 16px

// Medium (badges, supporting)
className="w-5 h-5"  // 20px
className="w-6 h-6"  // 24px

// Large (feature icons)
className="w-8 h-8"  // 32px
className="w-10 h-10" // 40px

// Extra Large (timeline nodes)
className="w-12 h-12" // 48px
```

**Color Application**:
```jsx
// Primary color
className="text-primary"

// Secondary color
className="text-secondary"

// Muted/subtle
className="text-muted-foreground"

// White (on colored backgrounds)
className="text-white"

// Inherit from parent
className="text-current"
```

**Background Treatments**:
```jsx
// Circular background
<div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
  <Icon className="w-6 h-6 text-primary" />
</div>

// Square with rounded corners
<div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
  <Icon className="w-6 h-6 text-primary" />
</div>

// Gradient background
<div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
  <Icon className="w-6 h-6 text-white" />
</div>
```

**Accessibility**:
```jsx
// Decorative icons (no semantic meaning)
<Icon className="w-6 h-6" aria-hidden="true" />

// Functional icons (convey meaning)
<button aria-label="Close menu">
  <X className="w-6 h-6" />
</button>

// Icons with visible text (redundant)
<button>
  <Mail className="w-4 h-4" aria-hidden="true" />
  <span>Send Email</span>
</button>
```

---

## 2. Brand Logos via svgl (RECOMMENDED)

### What is svgl?

**SVGL** (svgl.app) is an open-source library with 300+ high-quality SVG brand logos optimized for web use.

**Benefits**:
- Official brand logos (curated & maintained)
- Optimized SVGs (~3-8KB vs 45KB manual downloads)
- Built-in light/dark mode variants
- React component package available
- TypeScript support
- **Saves ~168KB** vs manual logo downloads

### Installation

**Method 1: React Package (RECOMMENDED)**
```bash
npm install @svgl/react
```

**Usage**:
```jsx
import { GitHub, Gmail, WhatsApp, Cloudflare } from '@svgl/react';

<GitHub className="w-6 h-6" variant="dark" /> // or variant="light"
<Gmail className="w-6 h-6" />
<WhatsApp className="w-6 h-6" />
<Cloudflare className="w-8 h-8" />
```

**Method 2: Manual Download (Fallback)**
- Visit svgl.app
- Search for logo (GitHub, Gmail, etc.)
- Download optimized SVG
- Save to `/public/logos/`

---

### Logo Specifications

#### GitHub Logo (via @svgl/react)
**Import**: `import { GitHub } from '@svgl/react';`

**Variants**:
- `variant="dark"` - Black mark (#181717)
- `variant="light"` - White mark
- Default - Inherits from logo

**Sizes**:
- Hero/Footer: `className="w-6 h-6"` (24px)
- Trust Bar: `className="w-8 h-8"` (32px)
- Timeline: `className="w-5 h-5"` (20px)

**Usage**:
```jsx
import { GitHub } from '@svgl/react';

// Hero (on colored background)
<GitHub className="w-5 h-5" variant="light" />

// Trust Bar
<GitHub className="w-8 h-8" />

// Tech Stack
<GitHub className="w-8 h-8" />
```

**Placement**:
- Hero: "Powered by GitHub" badge
- Trust Bar: GitHub integration badge
- Tech Stack: GitHub Storage item

---

#### Gmail Logo
**File**: `gmail-logo.svg` (full color) or use Lucide `Mail` icon
**Variants**:
- Full color (red/blue/yellow/green envelope)
- Monochrome alternative: Lucide `Mail` icon

**Sizes**:
- Hero/Footer: 24px
- Trust Bar: 32px
- Features: 24px

**Usage**:
```jsx
// Option 1: Custom Gmail SVG (full color)
<img src="/logos/gmail.svg" alt="Gmail" className="w-6 h-6" />

// Option 2: Lucide Mail icon (monochrome, simpler)
<Mail className="w-6 h-6 text-primary" />
```

**Recommendation**: Use Lucide `Mail` icon for consistency unless brand recognition is critical.

**Placement**:
- Hero: "Delivered via Gmail" badge
- Trust Bar: Gmail delivery badge
- Timeline: Step 3 delivery icon
- Features: Email delivery card

---

#### WhatsApp Logo (via @svgl/react)
**Import**: `import { WhatsApp } from '@svgl/react';`

**Color**: WhatsApp green (#25D366) - automatic
**Size**: `className="w-5 h-5"` (20px)

**Usage**:
```jsx
import { WhatsApp } from '@svgl/react';

// Features Grid (in description or icon)
<WhatsApp className="w-5 h-5" />
```

**Placement**:
- Features Grid: "Easy Sharing" card
- Can be shown alongside Share2 Lucide icon

---

#### Cloudflare Logo (via @svgl/react)
**Import**: `import { Cloudflare } from '@svgl/react';`

**Color**: Cloudflare orange (#F38020) - automatic
**Size**: `className="w-8 h-8"` (32px)
**Status**: Used in Tech Stack section

**Usage**:
```jsx
import { Cloudflare } from '@svgl/react';

// Tech Stack
<Cloudflare className="w-8 h-8" />
```

**Placement**:
- Tech Stack: Cloudflare Workers item

---

### Logo File Structure

**With @svgl/react (RECOMMENDED)**:
No files needed! All logos imported as React components:
```jsx
import { GitHub, Gmail, WhatsApp, Cloudflare } from '@svgl/react';
```

**Manual Fallback** (if not using @svgl/react):
```
/public
  /logos
    github.svg          # Downloaded from svgl.app
    gmail.svg           # Downloaded from svgl.app
    whatsapp.svg        # Downloaded from svgl.app
    cloudflare.svg      # Downloaded from svgl.app
```

---

## 3. Photography

### Required Photos (4 Use Case Images)

**Source**: Unsplash/Pexels MCP servers
**Access**:
```javascript
// Unsplash MCP
mcp__unsplash__search_photos({
  query: "birthday celebration family",
  per_page: 10,
  orientation: "landscape"
})

// Pexels MCP
mcp__pexels__photos_search({
  query: "family birthday",
  per_page: 10,
  orientation: "landscape"
})
```

---

### Photo 1: Personal Milestone

**Subject**: Birthday celebration, family gathering
**Search Keywords**: "birthday celebration family", "family party candid", "birthday cake candles"
**Style**: Candid, warm, authentic (not overly posed)
**Composition**: People celebrating, cake/gifts visible
**Dimensions**: 800x600px (4:3 ratio)
**Format**: WebP primary + JPG fallback
**Target Size**: <100KB (after optimization)

**Example Searches**:
```javascript
mcp__unsplash__search_photos({
  query: "family birthday celebration",
  per_page: 10
})
```

**Selection Criteria**:
- ✅ Diverse people (age, ethnicity)
- ✅ Natural candid moment
- ✅ Warm lighting
- ✅ Emotional connection visible
- ❌ Stock-looking staged photos
- ❌ Single ethnicity only
- ❌ Overly professional/posed

**Alt Text**: "Family celebrating birthday with cake and candles"

**Implementation**:
```jsx
<picture>
  <source srcSet="/images/use-cases/birthday.webp" type="image/webp" />
  <img
    src="/images/use-cases/birthday.jpg"
    alt="Family celebrating birthday with cake and candles"
    className="w-full h-full object-cover rounded-xl"
    loading="lazy"
  />
</picture>
```

---

### Photo 2: Professional Reminder

**Subject**: Calendar, workspace, planner, desk organization
**Search Keywords**: "calendar planning workspace", "desk planner professional", "business calendar reminder"
**Style**: Clean, professional, modern
**Composition**: Calendar/planner in focus, neutral background
**Dimensions**: 800x600px (4:3)
**Format**: WebP + JPG

**Example Searches**:
```javascript
mcp__unsplash__search_photos({
  query: "desk calendar planner workspace",
  per_page: 10
})
```

**Selection Criteria**:
- ✅ Organized, clean aesthetic
- ✅ Calendar prominently featured
- ✅ Professional but not corporate
- ✅ Natural lighting
- ❌ Cluttered desk
- ❌ Generic stock workspace
- ❌ Overly dark/moody

**Alt Text**: "Professional workspace with calendar and planning materials"

---

### Photo 3: Long-Distance Connection

**Subject**: People connecting (embrace, video call, hands holding)
**Search Keywords**: "people embracing relationship", "video call connection", "hands holding emotional"
**Style**: Emotional, warm, human connection
**Composition**: Focus on connection (faces, hands, interaction)
**Dimensions**: 800x600px (4:3)
**Format**: WebP + JPG

**Example Searches**:
```javascript
mcp__unsplash__search_photos({
  query: "people embracing emotional connection",
  per_page: 10
})
```

**Selection Criteria**:
- ✅ Genuine emotion visible
- ✅ Diverse representation
- ✅ Clear human connection
- ✅ Warm tones
- ❌ Forced/staged poses
- ❌ Corporate stock photos
- ❌ Unclear emotional content

**Alt Text**: "Two people embracing, showing connection and relationship"

---

### Photo 4: Family Time Capsule

**Subject**: Multi-generational family, children with grandparents, treasure box
**Search Keywords**: "family memories time capsule", "multi-generational family", "grandparents with children"
**Style**: Nostalgic, warm, diverse
**Composition**: Multiple generations or symbolic time capsule
**Dimensions**: 800x600px (4:3)
**Format**: WebP + JPG

**Example Searches**:
```javascript
mcp__unsplash__search_photos({
  query: "multi-generational family memories",
  per_page: 10
})
```

**Selection Criteria**:
- ✅ Multiple generations visible
- ✅ Nostalgic/warm feeling
- ✅ Diverse family representation
- ✅ Natural interaction
- ❌ Single generation only
- ❌ Cliché time imagery (clocks, hourglasses)
- ❌ Overly sentimental/staged

**Alt Text**: "Multi-generational family creating memories together"

---

### Photo Optimization Workflow

**Step 1: Download**
- Source from Unsplash/Pexels at highest quality
- Prefer 1200x900px or larger originals

**Step 2: Resize**
```bash
# Using ImageMagick
convert original.jpg -resize 800x600 -quality 85 output.jpg
```

**Step 3: Convert to WebP**
```bash
# Using cwebp
cwebp -q 80 output.jpg -o output.webp
```

**Step 4: Optimize**
```bash
# JPG optimization
jpegoptim --max=85 output.jpg

# WebP is already optimized with -q flag
```

**Target Sizes**:
- WebP: 60-80KB each
- JPG: 80-100KB each

**Total Photos**: 4 × 100KB = 400KB maximum

---

### Responsive Image Markup

```jsx
<picture>
  <source
    srcSet="
      /images/use-cases/birthday-800w.webp 800w,
      /images/use-cases/birthday-1200w.webp 1200w
    "
    type="image/webp"
  />
  <source
    srcSet="
      /images/use-cases/birthday-800w.jpg 800w,
      /images/use-cases/birthday-1200w.jpg 1200w
    "
    type="image/jpeg"
  />
  <img
    src="/images/use-cases/birthday-800w.jpg"
    alt="Family celebrating birthday with cake and candles"
    className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
    loading="lazy"
    decoding="async"
    width="800"
    height="600"
  />
</picture>
```

---

## 4. Video Assets

### Hero Background Video (Optional)

**Purpose**: Dynamic, engaging first impression
**Status**: Optional (can use static gradient instead)
**Priority**: Nice-to-have (Phase 3)

**Video Options**:

**Option A: Time Progression** (Recommended)
- Content: Clock time-lapse, calendar pages flipping
- Duration: 10-15s seamless loop
- Source: Pexels Videos, Coverr.co
- Search: "clock time lapse", "calendar flip"

**Option B: Particle/Light Trails**
- Content: Floating particles, light streaks, bokeh
- Duration: 10-15s loop
- Source: Pexels, Mixkit
- Search: "particles background", "light trails abstract"

**Option C: Code/Data Animation**
- Content: GitHub commits animating, data flow
- Duration: 10-15s loop
- Source: Custom creation or Pexels
- Search: "data visualization", "code animation"

**Technical Specs**:
```
Resolution: 1920x1080 (16:9)
Format: MP4 (H.264) + WebM (VP9) for compatibility
Codec: H.264 High Profile
Bitrate: 1-2 Mbps (balance quality and size)
File Size: <5MB (critical for page load)
Frame Rate: 24-30fps
Audio: None (muted, no audio track)
Loop: Seamless (first and last frames match)
Poster Image: First frame (JPG, <100KB)
```

**Implementation**:
```jsx
<video
  autoPlay
  muted
  loop
  playsInline
  poster="/images/hero-bg-poster.jpg"
  className="absolute inset-0 w-full h-full object-cover opacity-20"
>
  <source src="/videos/hero-bg.webm" type="video/webm" />
  <source src="/videos/hero-bg.mp4" type="video/mp4" />
</video>
```

**Mobile Consideration**:
```jsx
{/* Desktop: Video */}
<video className="hidden md:block ..." />

{/* Mobile: Static poster */}
<img
  src="/images/hero-bg-poster.jpg"
  className="md:hidden absolute inset-0 w-full h-full object-cover opacity-20"
/>
```

**Reduced Motion**:
```jsx
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

{!prefersReducedMotion && <video ... />}
{prefersReducedMotion && <img src="/images/hero-bg-poster.jpg" ... />}
```

---

## 5. Illustrations

### Timeline Visualization

**Type**: SVG illustration
**Purpose**: Visual representation of 3-step process
**Style**: Line art, minimal color (primary + muted)

**Components**:
- 3 circular nodes (64px diameter)
- Connecting line (horizontal on desktop, vertical on mobile)
- Icons inside nodes
- Small supporting graphics

**Dimensions**:
- Desktop: 1200x300px (wide)
- Mobile: 400x800px (tall)

**Format**: Inline SVG or external .svg file

**Creation Tool**: Figma, Illustrator, or hand-coded SVG

**Alternative**: Pure CSS implementation with divs + icons

---

### Architecture Diagram

**Type**: SVG flowchart
**Purpose**: Show data flow: User → GitHub → Actions → Gmail
**Style**: Simple flowchart with icons and arrows

**Components**:
- User icon
- Directional arrows
- GitHub, GitHub Actions, Gmail logos
- Data/file icons

**Dimensions**: 1000x400px (horizontal)

**Format**: SVG

**Creation Tool**: Excalidraw, Figma, Mermaid

---

## 6. Asset Organization

### File Structure
```
/public
  /images
    /hero
      hero-bg-poster.jpg          # Hero video fallback (100KB)
    /use-cases
      birthday.webp               # Personal milestone (60KB)
      birthday.jpg                # Fallback (80KB)
      professional.webp           # Professional reminder (60KB)
      professional.jpg            # Fallback (80KB)
      connection.webp             # Long-distance (60KB)
      connection.jpg              # Fallback (80KB)
      family.webp                 # Family capsule (60KB)
      family.jpg                  # Fallback (80KB)
  /videos
    hero-bg.mp4                   # Hero background (5MB) [optional]
    hero-bg.webm                  # WebM format (4MB) [optional]
  /logos
    github.svg                    # GitHub mark
    github-white.svg              # GitHub white variant
    gmail.svg                     # Gmail logo
    whatsapp.svg                  # WhatsApp logo
```

---

## 7. Performance Budget

**Total Page Weight Target**: <2MB initial load (excluding videos)

**Asset Breakdown**:
- **HTML/CSS/JS**: 300KB (gzipped)
- **Inline SVG Icons**: 50KB
- **Photos (above fold)**: 200KB (2 images lazy loaded)
- **Photos (below fold)**: 200KB (lazy loaded)
- **Hero background video**: 0KB (lazy load OR defer to user interaction)
- **Brand logos (SVG)**: 20KB
- **Illustrations**: 100KB
- **Fonts**: 150KB (Inter font family)
- **Other**: 200KB buffer

**Total**: ~1.22MB (excluding video)

**Optimization Strategies**:
1. **Lazy loading**: All images below fold
2. **WebP format**: Primary format with JPG fallback
3. **Aggressive compression**: 80-85% quality
4. **Inline critical logos**: GitHub, Gmail SVGs inline in HTML
5. **Defer video**: Load on user scroll or reduced motion check
6. **Responsive images**: Serve appropriate sizes via srcset

---

## 8. Accessibility Requirements

### Images
**Alt Text** (all images):
```jsx
// Meaningful images
<img alt="Family celebrating birthday with cake and candles" />

// Decorative images
<img alt="" aria-hidden="true" />

// Complex images (charts/diagrams)
<img alt="Architecture diagram" aria-describedby="diagram-description" />
<div id="diagram-description" className="sr-only">
  Detailed description of diagram...
</div>
```

### Videos
**Requirements**:
- All videos autoplay muted (no disruption)
- Pause on scroll away (performance + accessibility)
- Respect `prefers-reduced-motion` (show static poster instead)
- No critical content in video (decorative only)

### Icons
**ARIA Labels**:
```jsx
// Decorative
<Icon aria-hidden="true" />

// Functional
<button aria-label="Open menu">
  <Menu className="w-6 h-6" />
</button>

// With visible text (redundant)
<button>
  <Mail className="w-4 h-4" aria-hidden="true" />
  Send Email
</button>
```

---

## 9. Implementation Checklist

### Icons
- [ ] Install Lucide React: `npm install lucide-react`
- [ ] Replace all 9 emojis with Lucide icons
- [ ] Add proper aria-hidden to decorative icons
- [ ] Add aria-label to functional icons
- [ ] Test icon contrast ratios (3:1 minimum)

### Brand Logos (svgl)
- [ ] Install @svgl/react: `npm install @svgl/react`
- [ ] Import brand logos: `import { GitHub, Gmail, WhatsApp, Cloudflare } from '@svgl/react'`
- [ ] Replace Lucide `Github` / `Mail` with svgl `GitHub` / `Gmail` in all sections
- [ ] Test logo rendering on light and dark backgrounds
- [ ] Verify variants work (GitHub: variant="light" on hero gradient)
- [ ] Confirm all 4 logos display correctly (GitHub, Gmail, WhatsApp, Cloudflare)

### Photos
- [ ] Search Unsplash/Pexels MCP for 4 use case images
- [ ] Download at highest quality (1200x900px minimum)
- [ ] Resize to 800x600px
- [ ] Convert to WebP + JPG
- [ ] Optimize (target <100KB each)
- [ ] Create responsive srcset variants (800w, 1200w)
- [ ] Write descriptive alt text for each
- [ ] Test lazy loading functionality

### Video (Optional)
- [ ] Source hero background video (Pexels/Coverr)
- [ ] Compress to <5MB (H.264, 1-2 Mbps)
- [ ] Create WebM version
- [ ] Extract poster frame (JPG, <100KB)
- [ ] Implement prefers-reduced-motion fallback
- [ ] Test mobile static image fallback
- [ ] Verify seamless loop

### Illustrations
- [ ] Create or source timeline visualization SVG
- [ ] Create or source architecture diagram SVG
- [ ] Optimize SVGs (SVGO tool)
- [ ] Implement as inline SVG or external file
- [ ] Add appropriate alt text

### Performance
- [ ] Verify total page weight <2MB (excluding video)
- [ ] Test lazy loading (images below fold load on scroll)
- [ ] Confirm WebP fallback to JPG works
- [ ] Check responsive images load correct sizes
- [ ] Validate all images have width/height attributes

### Accessibility
- [ ] All images have descriptive alt text
- [ ] Decorative images have alt=""
- [ ] Icons have proper ARIA attributes
- [ ] Video respects prefers-reduced-motion
- [ ] Test with screen reader (NVDA/JAWS/VoiceOver)
- [ ] Verify contrast ratios for icon colors

---

**Next**: See handoff-to-dev.md for complete Phase 3 implementation guide
