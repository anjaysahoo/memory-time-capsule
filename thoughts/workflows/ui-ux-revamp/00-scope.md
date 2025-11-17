# Memory Time Capsule - UI/UX Revamp Workflow

> **Reference**: This is a copy of the main workflow document for easy access during phase execution.
> **Master Document**: `thoughts/workflows/ui-ux-revamp-workflow.md`

## 📋 Project Analysis

### App Concept
A web application that allows users to send messages, videos, photos, and audio to the future. Content is stored in users' private GitHub repos and automatically unlocked/sent via Gmail at specified dates using GitHub Actions.

### Current Tech Stack
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **UI Components**: ShadCN UI (Radix UI primitives)
- **Icons**: Lucide React
- **State**: Zustand
- **Routing**: React Router v6
- **Deployment**: Cloudflare Pages

---

## 🎯 Features & Scope Definition

### Landing Page (Home) - Core Sections (Flexible)

**Agents have creative freedom to enhance and add sections that improve user experience.**

#### Minimum Required Sections:

1. **Hero Section**
   - Gradient background (choose colors that resonate with "time capsule" / "messages to the future" concept)
   - Animated headline with emphasis on "Future" concept
   - Single strong CTA
   - Subtle scroll indicator
   - Micro-interactions on hover
   - Optional: Background video/animation, hero image

2. **How It Works Section**
   - 3-step visual timeline (not numbered emojis)
   - Icons/illustrations for each step
   - Progressive disclosure animation
   - Mobile-optimized stacking
   - Optional: Explanatory videos, animated diagrams

3. **Features Grid**
   - 6+ feature cards with:
     - Custom icons (not emojis)
     - Hover effects with subtle lift
     - Visual hierarchy improvements
     - Unified color scheme
   - Optional: Feature screenshots, demo videos

4. **Social Proof/Trust**
   - GitHub + Gmail integration badges
   - Security/privacy highlights
   - "100% Free" emphasis
   - Optional: Testimonials, use case examples

5. **Final CTA**
   - High-contrast design
   - Action-oriented copy
   - Visual distinction from hero

#### Additional Sections (Agent's Choice)
Agents may add sections that enhance user understanding:
- FAQ section
- Use cases / Examples
- Timeline visualization
- Video demo / product tour
- User testimonials
- Comparison with alternatives
- Technology stack highlights
- Privacy & security deep-dive
- Visual examples of time capsules
- Interactive demo

### Media Assets Policy
- **Photos**: Use placeholder images where beneficial
- **Videos**: Use placeholder or embed if available
- **Audio**: Include if it enhances understanding
- **Illustrations**: Custom or from open-source libraries
- **Icons**: Lucide React or custom SVGs
- **Animations**: CSS animations, SVG animations

Agents should document asset requirements in handoff documents.

### ⛔ What is OUT OF SCOPE
- Do NOT modify routing or auth logic
- Do NOT change backend APIs or core functionality
- Do NOT add new dependencies beyond ShadCN components
- Do NOT use web search

### ✅ Creative Freedom Granted
- Choose brand colors that resonate with app concept
- Add sections that improve user understanding
- Use media assets (photos, videos, audio) with placeholders
- Design beyond minimum requirements if beneficial
- Innovate on layouts and visual treatments

---

## 📁 File Structure

```
thoughts/workflows/ui-ux-revamp/
├── 00-scope.md                    # This file
├── phase1-ux/
│   ├── input.md
│   ├── research.md
│   ├── layout-structure.md
│   ├── interaction-patterns.md
│   ├── media-assets.md
│   └── handoff-to-ui.md
├── phase2-ui/
│   ├── input.md
│   ├── design-system.md
│   ├── component-specs.md
│   ├── animation-specs.md
│   ├── media-integration.md
│   └── handoff-to-dev.md
└── phase3-frontend/
    ├── input.md
    ├── implementation-log.md
    ├── component-decisions.md
    └── completion-report.md
```

---

## 🔄 3-Phase Workflow

### PHASE 1: UX Research & Planning

**Agents**: ux-researcher → whimsy-injector

**Tasks**:
1. Analyze current Home.tsx implementation
2. Research modern landing page patterns
3. Define layout structure for required sections
4. PROPOSE and JUSTIFY additional sections if beneficial
5. Specify positioning, spacing, visual hierarchy
6. Document mobile-first responsive breakpoints
7. Recommend media assets (photos, videos, animations)
8. Define micro-interactions and animations
9. Create handoff document for UI phase

**Outputs**: `phase1-ux/` folder with all specs, media plan, and handoff

---

### PHASE 2: UI Design & Visual System

**Agents**: ui-designer → brand-guardian → visual-storyteller

**Tasks**:
1. CHOOSE brand colors that resonate with "time capsule" concept
2. Create design system (colors, typography, spacing)
3. Design each section (including new ones) following Phase 1 layout
4. Search ShadCN registries for components
5. Define gradient specifications
6. Create visual hierarchy
7. Design media asset integration
8. Ensure brand consistency and accessibility
9. Create handoff document for development

**Outputs**: `phase2-ui/` folder with design specs, media integration plan, and handoff

---

### PHASE 3: Frontend Implementation

**Agents**: frontend-developer → whimsy-injector → test-writer-fixer

**Tasks**:
1. Install required ShadCN components
2. Implement new Home.tsx with all sections per Phase 2 specs
3. Integrate media assets with placeholders
4. Add all animations and micro-interactions
5. Ensure mobile responsiveness
6. Add accessibility attributes
7. Test and fix issues
8. Create completion report with media requirements

**Outputs**: `phase3-frontend/` folder + updated `frontend/src/pages/Home.tsx` + media asset list

---

## 🚀 Quick Start

See full workflow document: `thoughts/workflows/ui-ux-revamp-workflow.md`

To execute a phase, copy the corresponding phase prompt from the main workflow document and paste it into a new Claude Code session.
