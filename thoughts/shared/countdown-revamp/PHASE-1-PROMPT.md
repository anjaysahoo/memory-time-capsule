# PHASE 1: UX Research & Planning

**Agent**: ux-researcher
**Goal**: Map the user journey through all capsule states and create layout specifications

---

## Context

Read these files first:
1. `thoughts/prompts/countdown-page-revamp-workflow.md` - Full specification
2. `frontend/src/pages/Home.tsx` - Lines 85-156 (hero section reference)
3. `frontend/src/pages/Open.tsx` - Current implementation
4. `frontend/src/components/Countdown.tsx` - Basic countdown component

---

## Your Task

### 1. User Journey Analysis

For each of the 5 states in Open.tsx, analyze:

**States**:
1. **Loading**: Initial page load, fetching capsule data
2. **Countdown**: Capsule locked, showing time remaining
3. **Pending**: Unlock time passed, email being sent
4. **Pin Entry**: Capsule unlocked, waiting for PIN
5. **Unlocked**: PIN verified, showing content

**For each state, document**:
- **User's emotional state**: (excited? nervous? curious? delighted?)
- **Primary goal**: What is the user trying to do?
- **Information hierarchy**: What's most important to show first?
- **Moments for delight**: Where can we add "wow" without being distracting?
- **Potential friction points**: What could confuse or frustrate?

### 2. Animation Timing Strategy

Define when animations should occur:
- **Entrance**: Page load, element reveals
- **Idle**: Subtle breathing/pulsing effects
- **Interaction**: Hover, tap, focus states
- **Exit**: Transitions between states

For each, specify:
- Duration (in ms)
- Easing curve
- Stagger delays (if multiple elements)

### 3. Mobile-First Layout Specs

Create wireframe descriptions (text is fine, no need for images) for:

**Mobile (375px)**:
- Element stacking order
- Typography sizes
- Spacing
- Touch targets (min 44px)

**Tablet (768px)**:
- Layout changes from mobile
- Multi-column opportunities

**Desktop (1440px)**:
- Maximum widths
- Centered content strategy

### 4. Delight Moments

Identify specific opportunities for micro-interactions:
- Preview photo interactions (hover, tap)
- Countdown timer behaviors
- PIN input animations
- Success/error feedback
- Loading states

### 5. Accessibility Considerations

Document requirements for:
- **Reduced motion**: Fallbacks for `prefers-reduced-motion`
- **Screen readers**: ARIA labels, live regions
- **Keyboard navigation**: Focus states, tab order
- **Color contrast**: Ensure readability on dark backgrounds

---

## Deliverables

### File 1: `01-ux-research.md`

Structure:
```markdown
# UX Research - Countdown Page

## User Journey Map

### State 1: Loading
- Emotional state: [anxious/curious]
- Primary goal: [understand what's happening]
- Info hierarchy: [spinner, brief message]
- Delight opportunities: [animated spinner with personality]
- Friction points: [slow network could cause anxiety]

[Repeat for all 5 states]

## Animation Timing Strategy

### Entrance Animations
- Page load: 300ms fade-in, easeOut
- Elements: stagger by 100ms
- Priority: title → preview → countdown → metadata

### Idle Animations
- Countdown boxes: subtle pulse every 2s
- Stars: continuous slow drift
- Gift icon: gentle breathing (1.5s cycle)

[Continue with Interaction and Exit]

## Key Insights
[Summary of most important findings]
```

### File 2: `02-ux-layout-specs.md`

Structure:
```markdown
# Layout Specifications - All States

## State 1: Loading

### Mobile (375px)
- Centered spinner (48px)
- Message below: 16px, centered
- Padding: 24px horizontal

### Tablet (768px)
- Spinner: 64px
- Message: 18px

### Desktop (1440px)
- Max-width: 600px container
- Spinner: 80px

[Repeat for all 5 states]

## Responsive Breakpoints
- Mobile: 0-767px
- Tablet: 768-1023px
- Desktop: 1024px+

## Touch Targets (Mobile)
- Buttons: min 44x44px
- PIN inputs: 56x56px each
- Interactive preview: 48px hit area

## Typography Scale
[Define based on Home.tsx hero]
```

---

## Success Criteria

- [ ] All 5 states analyzed with emotional beats
- [ ] Animation timing strategy complete
- [ ] Mobile-first layouts specified
- [ ] Delight moments identified (min 5)
- [ ] Accessibility requirements documented

---

## Save Instructions

Save to:
- `thoughts/shared/countdown-revamp/01-ux-research.md`
- `thoughts/shared/countdown-revamp/02-ux-layout-specs.md`

Then update `thoughts/shared/countdown-revamp/07-handoff.md`:
```markdown
## Phase 1: UX Research & Planning ✅ COMPLETE

**Completed**: [Date]

**Deliverables**:
- [x] 01-ux-research.md
- [x] 02-ux-layout-specs.md

**Key Findings**:
[Bullet points of 3-5 most important insights]

**Next Steps**:
Phase 2 agents should read files 01 and 02 before starting design.
```

---

## Important Constraints

- Don't add features beyond locked scope
- Reference Home.tsx hero as design north star
- Prioritize recipient delight over complexity
- Mobile experience is equally important as desktop
- Maintain all existing functionality

---

**Ready to begin? Start by thoroughly reading the context files, then dive into the user journey analysis.**
