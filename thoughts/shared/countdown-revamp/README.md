# Countdown Page Revamp - Project Guide

## Quick Start

### 🎯 Goal
Transform Open.tsx countdown page to match Home.tsx hero section's premium, delightful experience.

### 📋 Status
- [x] Planning Complete
- [ ] Phase 1: UX Research & Planning
- [ ] Phase 2: UI Design & Component Specification
- [ ] Phase 3: Frontend Development

---

## 📁 File Structure

```
thoughts/
  prompts/
    countdown-page-revamp-workflow.md    # Complete specification (read this first!)

  shared/
    countdown-revamp/
      README.md                           # This file
      00-overview.md                      # Quick reference
      07-handoff.md                       # Progress tracker

      PHASE-1-PROMPT.md                   # ux-researcher prompt
      PHASE-2-PROMPT.md                   # ui-designer + brand-guardian prompts
      PHASE-3-PROMPT.md                   # frontend-developer + whimsy-injector prompts

      01-ux-research.md                   # Phase 1 output (to be created)
      02-ux-layout-specs.md               # Phase 1 output (to be created)
      03-design-system.md                 # Phase 2 output (to be created)
      04-component-specs.md               # Phase 2 output (to be created)
      05-animation-library.md             # Phase 2 output (to be created)
      06-implementation-checklist.md      # Phase 3 output (to be created)
```

---

## 🚀 How to Execute

### Phase 1: UX Research & Planning

**Agent**: ux-researcher

**Prompt**:
```
First use the [ux-researcher] agent to analyze the user journey through all 5 states of the Open.tsx page (loading, countdown, pending, pin-entry, unlocked), mapping emotional beats and defining layout specs.

Read these files first:
- thoughts/prompts/countdown-page-revamp-workflow.md (full spec)
- thoughts/shared/countdown-revamp/PHASE-1-PROMPT.md (detailed tasks)
- frontend/src/pages/Home.tsx (lines 85-156 for hero reference)
- frontend/src/pages/Open.tsx (current implementation)

Save outputs to:
- thoughts/shared/countdown-revamp/01-ux-research.md
- thoughts/shared/countdown-revamp/02-ux-layout-specs.md

Then update thoughts/shared/countdown-revamp/07-handoff.md with Phase 1 completion notes.
```

**Expected Duration**: 1 session
**Outputs**: User journey map, layout specs

---

### Phase 2: UI Design & Component Specification

**Agents**: ui-designer + brand-guardian (parallel)

**Prompt**:
```
First use the [ui-designer] agent to create design system tokens and component specs.

Read these files first:
- thoughts/shared/countdown-revamp/01-ux-research.md
- thoughts/shared/countdown-revamp/02-ux-layout-specs.md
- thoughts/shared/countdown-revamp/PHASE-2-PROMPT.md (detailed tasks)
- frontend/src/pages/Home.tsx (design language reference)
- frontend/src/components/animate-ui/components/backgrounds/stars.tsx

Save outputs to:
- thoughts/shared/countdown-revamp/03-design-system.md
- thoughts/shared/countdown-revamp/04-component-specs.md
- thoughts/shared/countdown-revamp/05-animation-library.md

Then use the [brand-guardian] agent to review the design specs and ensure brand consistency with Home.tsx hero section. Update thoughts/shared/countdown-revamp/07-handoff.md with Phase 2 completion notes.
```

**Expected Duration**: 1-2 sessions
**Outputs**: Design system, component specs, animation library

---

### Phase 3: Frontend Development

**Agents**: frontend-developer → whimsy-injector (sequential)

**Prompt**:
```
First use the [frontend-developer] agent to implement all components per specs.

Read these files first:
- thoughts/shared/countdown-revamp/01-ux-research.md
- thoughts/shared/countdown-revamp/02-ux-layout-specs.md
- thoughts/shared/countdown-revamp/03-design-system.md
- thoughts/shared/countdown-revamp/04-component-specs.md
- thoughts/shared/countdown-revamp/05-animation-library.md
- thoughts/shared/countdown-revamp/PHASE-3-PROMPT.md (detailed implementation guide)
- frontend/src/pages/Open.tsx (PRESERVE ALL FUNCTIONALITY)

Create these new components in frontend/src/components/capsule/:
- CapsuleBackground.tsx
- AnimatedCountdown.tsx
- UnlockAnimation.tsx
- CelebrationEffect.tsx
- CapsuleCard.tsx

Refactor frontend/src/pages/Open.tsx to use new components while preserving all existing functionality.

Save implementation checklist to thoughts/shared/countdown-revamp/06-implementation-checklist.md.

Then use the [whimsy-injector] agent to audit the implemented components and add delightful micro-interactions. Update thoughts/shared/countdown-revamp/07-handoff.md with final completion notes.
```

**Expected Duration**: 2-3 sessions
**Outputs**: 5 new components, refactored Open.tsx, implementation checklist

---

## 🎨 Design Principles

From Home.tsx hero section:

### Visual
- **Dark background** with animated starfield (StarsBackground)
- **White text** with high contrast
- **LineShadowText** effect for emphasis (italic "Future")
- **Glass morphism** cards (subtle, elegant)

### Animations
- **Framer Motion** throughout
- **Entrance**: Staggered fade + slide (500ms, easeOut)
- **Idle**: Breathing/pulsing (2-4s cycles)
- **Interaction**: Scale, glow, shadow (150-300ms)
- **Transitions**: Smooth, graceful (1s between states)

### Typography
- **Large, bold** headings (h1: 3rem desktop, 2rem mobile)
- **Clear hierarchy** (title → content → metadata)
- **Readable** on dark backgrounds

---

## 🔒 Locked Scope

### In Scope ✅
- Visual/animation enhancements matching hero
- StarsBackground for all dark states
- LineShadowText on titles
- Animated countdown timer
- Celebration effects (confetti, sparkles)
- Micro-interactions (hover, tap, focus)
- Mobile optimization
- Accessibility (reduced motion, screen readers)

### Out of Scope ❌
- No new functionality
- No backend changes
- No new routes
- No new dependencies
- No changes to API calls
- No changes to data structure

**Rule**: If it changes behavior (not just appearance), it's out of scope.

---

## 🧪 Testing

Test capsule:
- **URL**: http://localhost:5178/open?t=mOJluod4gJNwk2OoBEx1NQ
- **PIN**: 9234

**States to test**:
1. Loading (refresh page)
2. Countdown (if capsule not yet unlocked)
3. Pending (if unlock time passed but email pending)
4. Pin Entry (enter wrong PIN, then correct: 9234)
5. Unlocked (view content)

**Browsers**:
- Chrome (desktop + mobile devtools)
- Firefox
- Safari

**Accessibility**:
- Keyboard navigation
- Screen reader
- Reduced motion preference

---

## 📊 Success Criteria

### Visual
- [ ] StarsBackground on all dark states
- [ ] LineShadowText on titles
- [ ] Typography matches hero scale
- [ ] 60fps animations

### Functional
- [ ] All 5 states work identically
- [ ] PIN verification unchanged
- [ ] Content display unchanged
- [ ] Error handling unchanged

### Delight
- [ ] Recipients say "wow"
- [ ] Animations feel premium
- [ ] Cohesive with hero
- [ ] Mobile equally delightful

### Performance
- [ ] Page loads <2s
- [ ] 60fps on mid-range mobile
- [ ] No layout shift
- [ ] Reduced motion respected

---

## 🎯 Key Components to Leverage

Already exist in codebase:

**Backgrounds**:
- `StarsBackground` - `frontend/src/components/animate-ui/components/backgrounds/stars.tsx`

**Typography**:
- `LineShadowText` - `frontend/src/components/ui/line-shadow-text.tsx`

**Animation**:
- `motion` from `motion/react` (Framer Motion)

**UI**:
- ShadCN components (`Card`, `Button`, `Alert`, etc.)

---

## 📞 Support

If stuck or need clarification:
1. Re-read the full spec: `thoughts/prompts/countdown-page-revamp-workflow.md`
2. Check phase-specific prompt for detailed guidance
3. Reference Home.tsx hero section (lines 85-156) as design north star
4. Ask user for clarification

---

## 🎉 Project Complete Checklist

- [ ] All phases complete
- [ ] All components built
- [ ] Open.tsx refactored
- [ ] All states tested
- [ ] Browser compatibility verified
- [ ] Accessibility audit passed
- [ ] Demo'd with test capsule
- [ ] Handoff document updated
- [ ] Code review requested

---

**Ready to begin? Start with Phase 1!**
