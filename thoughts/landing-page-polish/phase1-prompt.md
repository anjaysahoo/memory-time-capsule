# Phase 1: UX & Planning - Agent Prompt

## Your Role
You are a UX researcher and interaction designer. Your job is to analyze the current landing page sections (2-9) and define exactly how to improve their user experience to match the polish level of section 1 (hero).

## Context & Resources

### Required Reading (in order):
1. **Scope**: `thoughts/landing-page-polish/00-analysis-and-scope.md`
   - Read the hero section analysis (your reference standard)
   - Review current state of sections 2-9
   - Understand scope boundaries

2. **Code**: `frontend/src/pages/Home.tsx`
   - Understand current implementation
   - Note existing components and patterns

3. **File Structure**: `thoughts/landing-page-polish/01-file-structure.md`
   - Understand output format expected
   - Review handoff requirements

### Your Constraints
**In Scope:**
- Animation timing and triggers
- Interaction patterns (hover, scroll, click)
- Visual hierarchy improvements
- Mobile UX considerations
- Accessibility requirements

**Out of Scope:**
- Changing content or copy
- Adding/removing sections
- Changing overall structure
- Specifying exact CSS (that's Phase 2)

---

## Your Task

For **each section (2-9)**, you must define:

### 1. Current State Analysis
- What's working?
- What's not polished compared to hero?
- Specific pain points

### 2. UX Improvements
- **Animation triggers**: When should things animate? (on scroll, on load, on hover?)
- **Interaction patterns**: What happens when user interacts?
- **Visual feedback**: How do users know something is interactive?
- **Flow**: How does this section guide user to next action?

### 3. Animation Specifications
For each animation, specify:
- **Type**: fade-in, slide-up, scale, rotate, etc.
- **Trigger**: scroll into view, hover, click, page load
- **Duration**: How long? (reference hero: 2s for text loop, 5s for border)
- **Stagger**: If multiple elements, delay between each
- **Easing**: smooth, spring, linear

### 4. Mobile Considerations
- How should this work on 375px width?
- Touch interactions vs hover
- Gesture support needed?
- Different layout or just scaled?

### 5. Accessibility Requirements
- ARIA labels needed?
- Keyboard navigation?
- Focus states?
- Screen reader considerations?

---

## Section-by-Section Checklist

You must complete this for ALL sections:

### Section 2: Trust Indicators Bar (Home.tsx:158-178)
- [ ] Animation pattern defined
- [ ] Hover interaction specified
- [ ] Mobile layout decided
- [ ] Accessibility requirements noted

### Section 3: How It Works Timeline (Home.tsx:181-237)
- [ ] Timeline animation pattern (progressive reveal?)
- [ ] Node interactions specified
- [ ] Mobile timeline layout
- [ ] Accessibility for steps

### Section 4: Interactive Demo (Home.tsx:240-300)
- [ ] Tab transition animations
- [ ] Content reveal pattern
- [ ] Progress dot interactions
- [ ] Mobile tab behavior

### Section 5: Features Grid (Home.tsx:303-351)
- [ ] Card entrance animations
- [ ] Hover states enhanced
- [ ] Icon animation patterns
- [ ] Mobile grid layout

### Section 6: Use Cases (Home.tsx:354-418)
- [ ] Alternating reveal pattern
- [ ] Image placeholder treatment
- [ ] Quote animation
- [ ] Mobile stacking behavior

### Section 7: Tech Stack + Security (Home.tsx:421-468)
- [ ] List item animations
- [ ] Icon interaction patterns
- [ ] Grouping improvements
- [ ] Mobile layout optimization

### Section 8: FAQ (Home.tsx:471-529)
- [ ] Accordion enhancement ideas
- [ ] Question hover states
- [ ] Answer reveal animation
- [ ] Mobile accordion behavior

### Section 9: Final CTA (Home.tsx:532-590)
- [ ] Background animation if any
- [ ] CTA emphasis
- [ ] Trust indicator treatment
- [ ] Mobile centering

---

## Output Format

Create: `thoughts/landing-page-polish/02-phase1-ux-planning.md`

Use this structure:

```markdown
# Phase 1: UX & Planning Output

## Overview
[Brief summary of overall approach]

## Section 2: Trust Indicators Bar

### Current State
[What exists now]

### Issues Compared to Hero
[Specific problems]

### UX Improvements

#### Animation Pattern
**Type**: [e.g., Fade-in + slide-up]
**Trigger**: [e.g., Scroll into view - when 50% visible]
**Duration**: [e.g., 600ms]
**Stagger**: [e.g., 100ms between cards]
**Easing**: [e.g., ease-out]

#### Interaction Pattern
**Hover (Desktop)**:
- [What happens]
**Touch (Mobile)**:
- [What happens]

#### Visual Hierarchy
- [How to improve emphasis]

#### User Flow
- [How this guides user to next section]

### Mobile Considerations
- **Layout**: [2x2 grid → single column?]
- **Spacing**: [Adjustments needed]
- **Interactions**: [Touch-friendly?]

### Accessibility
- **ARIA**: [Labels needed]
- **Keyboard**: [Tab order, enter behavior]
- **Focus**: [Visible focus states]
- **Screen reader**: [Announce pattern]

---

[Repeat for all sections 3-9]

---

## HANDOFF TO PHASE 2

### Completion Checklist
- [ ] All 8 sections (2-9) have complete UX specs
- [ ] Animation patterns are specific and implementable
- [ ] Mobile considerations documented for each
- [ ] Accessibility requirements clear
- [ ] No scope creep (no new features added)
- [ ] Patterns are consistent across sections

### Key Decisions Made
1. [Major decision 1]
2. [Major decision 2]
3. [etc.]

### Notes for UI Designer (Phase 2)
[Anything important to know when translating this to visual specs]

### Questions/Concerns
[Anything you're unsure about that Phase 2 should clarify]
```

---

## Success Criteria

Your output is successful if:
1. ✓ All 8 sections have complete specs (no section skipped)
2. ✓ Animation patterns are specific enough to implement
3. ✓ Mobile UX is thoughtfully considered
4. ✓ Accessibility requirements are comprehensive
5. ✓ Patterns are consistent and match hero's sophistication
6. ✓ No scope creep (stayed within defined boundaries)
7. ✓ Handoff checklist is complete

---

## Tips for Success

### Reference Hero Patterns
- Hero uses subtle animations (not flashy)
- Animations serve purpose (guide attention, provide feedback)
- Mobile is first-class (not an afterthought)
- Accessibility is built in (not bolted on)

### Be Specific
❌ "Add animation to cards"
✓ "Fade-in + slide-up 40px, 600ms ease-out, triggered at 50% scroll, staggered 100ms"

### Think Mobile First
- Touch targets (44x44px minimum)
- No hover-only interactions
- Gestures feel natural
- Performance on slower devices

### Consider Accessibility
- Every interactive element needs keyboard access
- Focus states must be visible
- Animations respect `prefers-reduced-motion`
- Screen readers get meaningful descriptions

---

## Agents to Use

Use these agents in this order:

1. **First**: Use `ux-researcher` agent to analyze each section
   > Use the [ux-researcher] to deeply understand user pain points and opportunities in sections 2-9, comparing against the hero section standard

2. **Then**: Use `ui-designer` agent to validate visual hierarchy
   > Use the [ui-designer] to ensure visual hierarchy improvements align with the hero section's design patterns

3. **Finally**: Consolidate into single output document
   > Write all findings to thoughts/landing-page-polish/02-phase1-ux-planning.md

---

## Ready to Start?

1. Read the required documents
2. Analyze each section thoroughly
3. Define UX improvements for all 8 sections
4. Write comprehensive output to `02-phase1-ux-planning.md`
5. Complete handoff checklist
6. Verify against success criteria

**Remember**: You are NOT implementing anything. You are defining WHAT should happen, not HOW (CSS/code). Phase 2 will handle the "how".
