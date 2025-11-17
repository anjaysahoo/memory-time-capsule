# Memory Time Capsule - UI/UX Revamp Workflow

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

### Available ShadCN Registries
- @shadcn (primary)
- @aceternity, @originui, @cult, @kibo, @reui, @magicui, @kokonutui
- @motion-primitives, @paceui, @react-bits, @eldoraui, @animate-ui
- @better-upload, @aliimam

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
Agents may add sections that enhance the landing page experience:
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
- **Photos**: Use placeholder images where beneficial (suggest sources later)
- **Videos**: Use placeholder or embed if available assets exist
- **Audio**: Include if it enhances understanding
- **Illustrations**: Custom or from open-source libraries
- **Icons**: Lucide React or custom SVGs
- **Animations**: Lottie files, CSS animations, or SVG animations

Agents should document asset requirements in their handoff documents for later implementation.

### Modern UI/UX Enhancements
- **Motion**: Smooth scroll animations, fade-ins, stagger effects
- **Micro-interactions**: Button states, card hovers, input focus
- **Visual Hierarchy**: Better typography scale, spacing rhythm
- **Color System**: Refined gradients, accent colors, semantic colors
- **Responsive**: Mobile-first, fluid typography, adaptive layouts
- **Accessibility**: Proper contrast, focus indicators, ARIA labels

### Routes to Revamp (Phase-wise)
- **Phase 1**: `/` (Home/Landing)
- **Future Phases**: `/create`, `/dashboard`, `/open/:id`, `/auth`

---

## 📁 File Structure for Agent Collaboration

### Primary Workflow Directory
```
thoughts/workflows/ui-ux-revamp/
├── 00-scope.md                    # This file - master reference
├── phase1-ux/
│   ├── input.md                   # UX requirements from this doc
│   ├── research.md                # UX researcher findings
│   ├── layout-structure.md        # Layout decisions
│   ├── interaction-patterns.md    # Micro-interaction specs
│   └── handoff-to-ui.md          # Complete handoff doc
├── phase2-ui/
│   ├── input.md                   # From phase1 handoff
│   ├── design-system.md          # Colors, typography, spacing
│   ├── component-specs.md        # Detailed component designs
│   ├── animation-specs.md        # Motion design specs
│   └── handoff-to-dev.md         # Complete handoff doc
├── phase3-frontend/
│   ├── input.md                   # From phase2 handoff
│   ├── implementation-log.md     # Dev progress tracking
│   ├── component-decisions.md    # ShadCN component choices
│   └── completion-report.md      # Final deliverables
└── assets/
    ├── wireframes/               # UX deliverables
    ├── mockups/                  # UI deliverables
    └── references/               # Inspiration, examples
```

### Key Principles
1. **Each phase reads from previous phase's handoff**
2. **Each phase creates its own handoff for next phase**
3. **No phase modifies previous phase's files**
4. **All decisions documented in respective phase folders**

---

## 🔄 3-Phase Development Workflow

### PHASE 1: UX Research & Planning

**Agent Sequence**: ux-researcher → whimsy-injector (for interaction ideas)

**Input File**: `thoughts/workflows/ui-ux-revamp/phase1-ux/input.md`

**Prompt for Phase 1**:
```
You are working on Phase 1 (UX Research & Planning) of the Memory Time Capsule landing page revamp.

CONTEXT:
Read the scope document: thoughts/workflows/ui-ux-revamp/00-scope.md

REQUIRED READING:
- Current implementation: frontend/src/pages/Home.tsx
- App structure: frontend/src/App.tsx
- Existing components: frontend/src/components/**

YOUR TASKS:
1. Use the ux-researcher agent to:
   - Analyze the current Home.tsx implementation
   - Research modern landing page patterns for "time capsule" / "future messaging" concepts
   - Define layout structure for minimum required sections (Hero, How It Works, Features, Social Proof, CTA)
   - EVALUATE and PROPOSE additional sections that would enhance user understanding (FAQ, use cases, demo, etc.)
   - Specify positioning, spacing, and visual hierarchy for ALL sections
   - Document mobile-first responsive breakpoints
   - Identify accessibility requirements
   - Recommend media assets (photos, videos, animations) and their placement
   - Justify each section addition with user benefit

2. Use the whimsy-injector agent to:
   - Define micro-interactions for buttons, cards, inputs
   - Specify scroll-based animations
   - Design hover states and transitions
   - Create delight moments without being gimmicky
   - Suggest interactive elements (animations, demos)

CREATIVE FREEDOM:
- Add sections beyond the minimum 5 if they improve user experience
- Recommend use of photos, videos, or audio (with placeholders)
- Design innovative layouts that resonate with "time travel" / "future messaging" theme
- You must justify all additions with clear user benefit

CONSTRAINTS:
- Do NOT change routing or auth functionality
- Focus on layout, positioning, and interaction patterns
- No visual design (colors, fonts) - that's Phase 2

OUTPUT LOCATIONS:
Save to thoughts/workflows/ui-ux-revamp/phase1-ux/
- research.md: Your research findings and modern patterns
- layout-structure.md: Detailed section-by-section layout specs (including new sections)
- interaction-patterns.md: All micro-interactions and animations
- media-assets.md: Recommended photos, videos, animations with placement
- handoff-to-ui.md: Complete handoff document for UI designer

HANDOFF FORMAT (handoff-to-ui.md):
# Phase 1 → Phase 2 Handoff

## Sections Overview
[List of all sections with brief description and user benefit]

## Layout Structure
[Section-by-section specs with positioning, spacing, hierarchy]

## Media Assets Required
[Photos, videos, animations needed with placement and purpose]

## Interaction Patterns
[All defined micro-interactions, animations, transitions]

## Responsive Breakpoints
[Mobile, tablet, desktop specifications]

## Accessibility Requirements
[Focus management, ARIA labels, contrast needs]

## Next Phase Instructions
The UI designer should use this to create:
- Color palette that resonates with "time capsule" concept
- Typography system
- Component visual designs
- Animation timing/easing
- Media asset specifications

NO WEB SEARCH - Use your knowledge and codebase analysis only.
```

**Success Criteria**:
- ✅ All required sections + any beneficial additions have detailed layout specs
- ✅ Micro-interactions documented for all interactive elements
- ✅ Mobile-first responsive strategy defined
- ✅ Media assets plan created
- ✅ Handoff document ready for Phase 2

---

### PHASE 2: UI Design & Visual System

**Agent Sequence**: ui-designer → brand-guardian → visual-storyteller

**Input File**: `thoughts/workflows/ui-ux-revamp/phase2-ui/input.md`

**Prompt for Phase 2**:
```
You are working on Phase 2 (UI Design & Visual System) of the Memory Time Capsule landing page revamp.

REQUIRED READING:
- Scope: thoughts/workflows/ui-ux-revamp/00-scope.md
- Phase 1 Handoff: thoughts/workflows/ui-ux-revamp/phase1-ux/handoff-to-ui.md
- Media Assets Plan: thoughts/workflows/ui-ux-revamp/phase1-ux/media-assets.md
- Current styles: frontend/src/index.css, frontend/tailwind.config.js

YOUR TASKS:
1. Use the ui-designer agent to:
   - CHOOSE primary brand colors that resonate with "time capsule" / "messages to the future" concept
   - Create a refined design system (colors, typography, spacing)
   - Design each section (including new sections from Phase 1) with the layout specs
   - Specify ShadCN components to use (search available registries)
   - Define gradient specifications for hero and other sections
   - Create visual hierarchy with typography scale
   - Design card styles for features grid
   - Specify icon choices from Lucide React
   - Design media asset integration (photos, videos, animations)
   - Specify placeholder asset requirements

2. Use the brand-guardian agent to:
   - Ensure consistent brand voice ("time travel" / "future messaging" theme)
   - Validate color accessibility (WCAG AA minimum)
   - Create cohesive visual identity
   - Define primary/secondary/accent color usage
   - Ensure media assets align with brand

3. Use the visual-storyteller agent to:
   - Create visual flow across all sections
   - Design progressive disclosure patterns
   - Specify illustration/icon style guide
   - Define visual emphasis for key messaging
   - Design media asset storytelling (how photos/videos guide user journey)

CREATIVE FREEDOM:
- Choose colors that evoke nostalgia, anticipation, time, memory, connection
- Enhance sections with visual media
- Create unique gradient combinations
- Design beyond standard patterns

CONSTRAINTS:
- Strictly follow layout structure from Phase 1
- Do NOT change positioning or interaction patterns
- Can use existing ShadCN components or new if it is much better
- Maintain mobile responsiveness from Phase 1

AVAILABLE TOOLS:
- Use ShadCN MCP tools to search for components:
  - Search @shadcn, @magicui, @motion-primitives, @kokonutui, @eldoraui etc. registries
  - Find animated components, gradient backgrounds, hero sections, etc.
  - Get examples and implementation details

OUTPUT LOCATIONS:
Save to thoughts/workflows/ui-ux-revamp/phase2-ui/
- design-system.md: Complete design system specification (including color rationale)
- component-specs.md: Section-by-section component choices
- animation-specs.md: Animation timing, easing, sequences
- media-integration.md: Photo/video/audio integration specs
- handoff-to-dev.md: Complete implementation guide

NOTE: If visual-storyteller agent is run separately, it may create:
thoughts/workflows/ui-ux-revamp/phase2-visual-storytelling/
- visual-narrative-guide.md: Emotional journey and storytelling strategy
- visual-flow-diagram.md: Page structure visualization
- developer-quick-reference.md: Code snippets and quick lookup

Both directories are complementary: phase2-ui = tactical specs, phase2-visual-storytelling = strategic context

HANDOFF FORMAT (handoff-to-dev.md):
# Phase 2 → Phase 3 Handoff

## Design System
[Colors with rationale, typography, spacing tokens, shadows, borders]

## Color Palette Rationale
[Why these colors resonate with "time capsule" concept]

## Component Breakdown by Section
### Hero Section
- Components to use: [specific ShadCN components]
- Styles: [Tailwind classes, custom CSS]
- Gradients: [exact specifications]
- Media: [background video/image specifications]

[Repeat for each section including new ones]

## Media Assets Required
[List of photos, videos, animations with specs and placeholder sources]

## ShadCN Components to Install
[List with registry names: @shadcn/button, @magicui/animated-gradient, etc.]

## Animation Implementation
[Timing values, easing functions, trigger points, stagger delays]

## Implementation Priority
1. [First task]
2. [Second task]
...

NO WEB SEARCH - Use ShadCN MCP and existing knowledge only.
```

**Success Criteria**:
- ✅ Complete design system with color rationale documented
- ✅ All sections have specific component choices
- ✅ ShadCN components identified from registries
- ✅ Animation specs with exact timing values
- ✅ Media integration plan with placeholder specs
- ✅ Handoff document with clear implementation steps

---

### PHASE 3: Frontend Implementation

**Agent Sequence**: frontend-developer → whimsy-injector → test-writer-fixer

**Input File**: `thoughts/workflows/ui-ux-revamp/phase3-frontend/input.md`

**Prompt for Phase 3**:
```
You are working on Phase 3 (Frontend Implementation) of the Memory Time Capsule landing page revamp.

REQUIRED READING:
- Scope: thoughts/workflows/ui-ux-revamp/00-scope.md
- Phase 2 Handoff (Implementation): thoughts/workflows/ui-ux-revamp/phase2-ui/handoff-to-dev.md
- Phase 2 Installation Guide: thoughts/workflows/ui-ux-revamp/phase2-ui/INSTALLATION-CHECKLIST.md
- Visual Narrative Strategy: thoughts/workflows/ui-ux-revamp/phase2-visual-storytelling/visual-narrative-guide.md
- Developer Quick Reference: thoughts/workflows/ui-ux-revamp/phase2-visual-storytelling/developer-quick-reference.md
- Current code: frontend/src/pages/Home.tsx

UNDERSTANDING THE DUAL PHASE 2 OUTPUTS:
- phase2-ui/ = TACTICAL specs (components, code, installation, Option A enhancements)
- phase2-visual-storytelling/ = STRATEGIC context (emotional journey, storytelling principles, progressive disclosure)
- Use BOTH: Implement phase2-ui specs WITH the narrative principles from visual-storytelling

YOUR TASKS:
1. Install required ShadCN components:
   - Use the component list from Phase 2 handoff
   - Run appropriate shadcn-ui add commands
   - Verify installations

2. Use the frontend-developer agent to:
   - Implement the new Home.tsx following Phase 2 specs exactly
   - Apply design system (colors, typography, spacing)
   - Add all specified components
   - Implement responsive breakpoints
   - Add accessibility attributes (ARIA labels, focus management)
   - Preserve all existing functionality (auth checks, routing)

3. Implement media assets:
   - Add placeholder images/videos per Phase 2 specs
   - Implement lazy loading for media
   - Add fallbacks for missing assets
   - Optimize for performance

4. Implement animations and micro-interactions:
   - Follow animation specs from phase2-ui/animation-specs.md
   - Add scroll-triggered animations (intersection observer)
   - Implement hover states and transitions
   - Add stagger effects for grids
   - Create smooth page transitions
   - Reference visual-narrative-guide.md for delight moments catalog

5. Use the whimsy-injector agent to:
   - Review implementation against visual-storytelling emotional journey
   - Add delight moments from visual-narrative-guide.md (pulse, float, ripple effects)
   - Enhance micro-interactions following progressive disclosure strategy
   - Add delightful easter eggs (subtle, on-brand)
   - Ensure visual narrative flows: Wonder → Reassurance → Understanding → Engagement → etc.

6. Use the test-writer-fixer agent to:
   - Create tests for interactive elements
   - Verify responsive behavior
   - Test accessibility compliance
   - Run build and fix any issues

CONSTRAINTS:
- Do NOT modify routing or auth logic
- Do NOT change data fetching or state management
- Do NOT add features beyond Phase 2 specs
- Preserve all existing props and component interfaces
- Ensure backward compatibility with other routes

TESTING REQUIREMENTS:
- Mobile responsiveness (320px, 768px, 1024px, 1920px)
- Animation performance (60fps target)
- Accessibility (keyboard navigation, screen readers)
- Build success (npm run build)

OUTPUT LOCATIONS:
Save to thoughts/workflows/ui-ux-revamp/phase3-frontend/
- implementation-log.md: Track progress, decisions, issues
- component-decisions.md: Document component choices and rationale
- completion-report.md: Final deliverables, test results, screenshots

COMPLETION CHECKLIST:
- [ ] All ShadCN components installed
- [ ] Home.tsx fully reimplemented with all sections
- [ ] Design system applied consistently
- [ ] Media assets integrated with placeholders
- [ ] All animations implemented
- [ ] Mobile responsive (tested at all breakpoints)
- [ ] Accessibility verified
- [ ] Build passes (npm run build)
- [ ] No TypeScript errors
- [ ] Existing functionality preserved
- [ ] Tests written and passing

FINAL DELIVERABLE:
- Updated frontend/src/pages/Home.tsx (implementing phase2-ui specs with visual-storytelling narrative principles)
- Any new shared components in frontend/src/components/
- Media asset placeholders integrated per media-integration.md
- Updated styles if needed (following design-system.md + visual-narrative-guide.md)
- Test files
- Completion report with before/after comparison
- Media asset requirements list for future implementation
- Documentation of how visual narrative (emotional journey) was implemented

REFERENCE DOCUMENTATION:
Strategic Context:
- visual-narrative-guide.md: Emotional journey, progressive disclosure, delight moments
- visual-flow-diagram.md: Page structure and visual hierarchy
- developer-quick-reference.md: Copy-paste snippets and common patterns

Implementation Specs:
- handoff-to-dev.md: Complete component-by-component implementation guide (Option A enhancements)
- INSTALLATION-CHECKLIST.md: 2-hour setup process for all dependencies
- component-specs.md: Advanced components (@magicui, @aceternity, svgl)
- animation-specs.md: Timing, easing, and transition specifications
- media-integration.md: Photo/video/logo integration with svgl
```

**Success Criteria**:
- ✅ New Home.tsx matches Phase 2 design specs exactly
- ✅ All animations and micro-interactions working
- ✅ Fully responsive on mobile and desktop
- ✅ Accessibility standards met
- ✅ Build successful with no errors
- ✅ Existing functionality preserved

---

## 🚀 Setup Instructions

### Step 1: Initialize File Structure

Run this command to create the workflow directory structure:

```bash
mkdir -p thoughts/workflows/ui-ux-revamp/phase1-ux
mkdir -p thoughts/workflows/ui-ux-revamp/phase2-ui
mkdir -p thoughts/workflows/ui-ux-revamp/phase3-frontend
mkdir -p thoughts/workflows/ui-ux-revamp/assets/wireframes
mkdir -p thoughts/workflows/ui-ux-revamp/assets/mockups
mkdir -p thoughts/workflows/ui-ux-revamp/assets/references
```

### Step 2: Create Input Files

Create initial input files for each phase:

**phase1-ux/input.md**:
```markdown
# Phase 1 Input: UX Research & Planning

This phase starts the UI/UX revamp workflow.

## Reference Documents
- Main scope: ../00-scope.md
- Current implementation: ../../../frontend/src/pages/Home.tsx

## Your Mission
Follow the Phase 1 prompt in the 00-scope.md file.
```

**phase2-ui/input.md**:
```markdown
# Phase 2 Input: UI Design & Visual System

This phase receives handoff from Phase 1.

## Reference Documents
- Main scope: ../00-scope.md
- Phase 1 Handoff: ../phase1-ux/handoff-to-ui.md

## Your Mission
Follow the Phase 2 prompt in the 00-scope.md file.
```

**phase3-frontend/input.md**:
```markdown
# Phase 3 Input: Frontend Implementation

This phase receives handoff from Phase 2.

## Reference Documents
- Main scope: ../00-scope.md
- Phase 2 Handoff: ../phase2-ui/handoff-to-dev.md

## Your Mission
Follow the Phase 3 prompt in the 00-scope.md file.
```

---

## 📝 Execution Guide

### How to Run Each Phase

1. **Start Phase 1**:
   ```
   Copy the "Prompt for Phase 1" section above and paste it into a new Claude Code session.
   The agents will read all required files and create the handoff document.
   ```

2. **Start Phase 2**:
   ```
   After Phase 1 is complete and handoff-to-ui.md exists, copy the "Prompt for Phase 2" section and paste it into a new Claude Code session.
   The agents will read the Phase 1 handoff and create the Phase 2 handoff.
   ```

3. **Start Phase 3**:
   ```
   After Phase 2 is complete and handoff-to-dev.md exists, copy the "Prompt for Phase 3" section and paste it into a new Claude Code session.
   The agents will implement the final code.
   ```

### Progress Tracking

Use this checklist to track overall progress:

- [ ] **Setup**: File structure created, input files ready
- [ ] **Phase 1**: UX research complete, handoff created
- [ ] **Phase 2**: UI design complete, handoff created
- [ ] **Phase 3**: Implementation complete, tests passing
- [ ] **QA**: Manual testing on devices
- [ ] **Deploy**: Push to production branch

---

## 🎨 Modern UI/UX Strategy

### Visual Theme: "Messages Through Time"
- **Core metaphor**: Time travel, nostalgia, anticipation, connection
- **Color psychology**: Gradients suggesting progression, warm accents for emotion
- **Motion philosophy**: Smooth, intentional, delightful (not distracting)

### Component Strategy
- **Hero**: Large gradient background, animated headline, single focused CTA
- **Timeline**: Visual connector between steps (not just numbered cards)
- **Feature Cards**: Hover-lift effect, icon+heading+description hierarchy
- **CTA**: High contrast, clear value proposition, urgency without pressure

### Mobile-First Approach
- Stack sections vertically on mobile
- Larger touch targets (minimum 44x44px)
- Simplified animations for performance
- Progressive enhancement for desktop

### Accessibility Checklist
- Color contrast ratio ≥ 4.5:1 for normal text, ≥ 3:1 for large text
- Keyboard navigation for all interactive elements
- Focus indicators visible and clear
- ARIA labels for icon buttons and decorative elements
- Semantic HTML structure

---

## 🔒 Constraints & Guardrails

### What Agents CANNOT Do
- ❌ Modify backend/API logic
- ❌ Change routing structure
- ❌ Alter authentication flow
- ❌ Use web search for research
- ❌ Change core app functionality (GitHub storage, Gmail sending, etc.)

### What Agents MUST Do
- ✅ Start with required sections, enhance as needed
- ✅ Read previous phase handoffs
- ✅ Document all decisions in their phase folder
- ✅ Create clear handoffs for next phase
- ✅ Test responsiveness and accessibility
- ✅ Preserve existing functionality
- ✅ Justify any additional sections added

### Creative Freedom Granted
- ✅ Choose brand colors that resonate with app concept
- ✅ Add sections that improve user understanding
- ✅ Use media assets (photos, videos, audio) with placeholders
- ✅ Design beyond minimum requirements if beneficial
- ✅ Innovate on layouts and visual treatments

---

## 📊 Success Metrics

### Phase Completion Criteria
Each phase is complete when:
1. All tasks in the phase prompt are done
2. Handoff document is created
3. Next phase can start without questions

### Final Launch Criteria
Ready to deploy when:
1. All 3 phases complete
2. Build successful (`npm run build`)
3. No TypeScript errors
4. Responsive at all breakpoints (320px - 1920px)
5. Accessibility audit passed
6. Manual QA on Chrome, Firefox, Safari
7. Mobile testing on real devices

---

## 🎯 Next Steps

1. **Review this scope document** - Ensure all stakeholders agree
2. **Run setup instructions** - Create file structure
3. **Execute Phase 1** - Start with UX research
4. **Iterate as needed** - Each phase can be refined before moving forward
5. **Launch** - Deploy the revamped landing page

---

**Document Version**: 1.0
**Created**: 2025-01-16
**Status**: Ready for Phase 1 kickoff
