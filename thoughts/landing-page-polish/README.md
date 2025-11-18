# Landing Page Polish Project

## Overview
This directory contains a structured 3-phase workflow for polishing the Memory Time Capsule landing page to match the quality level of the hero section.

## Quick Start

### For Executing the Full Workflow
Run the phases in order, using the prompts as agent instructions:

```
1. Execute: thoughts/landing-page-polish/phase1-prompt.md
2. Execute: thoughts/landing-page-polish/phase2-prompt.md
3. Execute: thoughts/landing-page-polish/phase3-prompt.md
```

## Project Structure

```
thoughts/landing-page-polish/
├── README.md                    ← You are here
├── 00-analysis-and-scope.md     ← REFERENCE: Hero analysis, scope, success criteria
├── 01-file-structure.md         ← Agent collaboration protocol
├── phase1-prompt.md             ← Phase 1 execution instructions
├── phase2-prompt.md             ← Phase 2 execution instructions
├── phase3-prompt.md             ← Phase 3 execution instructions
├── 02-phase1-ux-planning.md     ← OUTPUT: Phase 1 creates this
├── 03-phase2-ui-design.md       ← OUTPUT: Phase 2 creates this
├── 04-phase3-implementation.md  ← OUTPUT: Phase 3 creates this
└── 05-handoff.md                ← OUTPUT: Final handoff document
```

## Phase Overview

### Phase 1: UX & Planning
**Input**: `00-analysis-and-scope.md`, `Home.tsx`, `01-file-structure.md`
**Agents**: `ux-researcher`, `ui-designer`
**Output**: `02-phase1-ux-planning.md`
**Purpose**: Define UX improvements, animation patterns, mobile considerations

**Execute**:
```
Read and execute: thoughts/landing-page-polish/phase1-prompt.md
```

**Key Deliverables**:
- Animation specifications for each section
- Interaction patterns (hover, scroll, click)
- Mobile UX considerations
- Accessibility requirements

---

### Phase 2: UI Design
**Input**: All Phase 1 outputs + `00-analysis-and-scope.md`
**Agents**: `ui-designer`, `brand-guardian`, ShadCN MCP tools
**Output**: `03-phase2-ui-design.md`
**Purpose**: Translate UX specs to exact visual specifications

**Execute**:
```
Read and execute: thoughts/landing-page-polish/phase2-prompt.md
```

**Key Deliverables**:
- Exact Tailwind CSS classes
- Framer Motion configurations (copy-pasteable)
- ShadCN component selections
- Responsive breakpoint definitions
- Animation keyframes and easing

---

### Phase 3: Frontend Development
**Input**: All Phase 1 & 2 outputs + `00-analysis-and-scope.md`
**Agents**: `frontend-developer`, `test-writer-fixer`, `whimsy-injector`, Chrome DevTools MCP
**Output**: `04-phase3-implementation.md` + modified `Home.tsx`
**Purpose**: Implement specifications and test thoroughly

**Execute**:
```
Read and execute: thoughts/landing-page-polish/phase3-prompt.md
```

**Key Deliverables**:
- Polished `frontend/src/pages/Home.tsx`
- All 8 sections (2-9) matching hero quality
- Mobile responsive (375px, 768px, 1440px+)
- Performance verified (< 3s load, 60fps)
- Accessibility validated (WCAG AA)

---

## Success Criteria

### Overall Project Success
- ✓ All 8 sections (2-9) polished to hero level
- ✓ Animations smooth and purposeful
- ✓ Mobile experience excellent (375px+)
- ✓ Accessibility compliant (WCAG AA)
- ✓ Performance maintained (< 3s load, 60fps)
- ✓ No regressions in existing functionality
- ✓ Content unchanged (same copy, same structure)

### Phase-Specific Success

**Phase 1**:
- All sections have UX specs
- Animation patterns are specific
- Mobile considerations documented
- Accessibility requirements clear

**Phase 2**:
- Component specs are implementable
- Code is copy-pasteable
- Responsive behavior defined
- ShadCN components selected

**Phase 3**:
- Implementation complete
- Testing thorough (visual, performance, a11y)
- Documentation comprehensive
- Quality matches hero section

---

## Key Constraints

### In Scope ✓
- Visual polish (animations, hover effects, micro-interactions)
- Mobile optimization
- Accessibility improvements
- Component enhancements
- Performance optimization

### Out of Scope ✗
- Changing content/copy
- Adding/removing sections
- Changing structure/flow
- Backend functionality
- New dependencies (except ShadCN)

---

## Tech Stack

**Current Stack** (no changes):
- React 18 + TypeScript
- Tailwind CSS
- Framer Motion (`motion/react`)
- Lucide Icons
- ShadCN UI components

**Target File**:
- `frontend/src/pages/Home.tsx` (main file to polish)

---

## Design Reference

**Hero Section** (Section 1 - Lines 84-155):
- Black background with animated stars
- Bold white typography with `LineShadowText`
- `TextLoop` animation (2s interval)
- Animated border button (motion.div with offsetPath)
- Generous spacing, centered layout
- Mobile responsive (text scales down)

**Apply These Patterns**:
1. Black/white contrast
2. Subtle animations (not overwhelming)
3. Generous white space
4. Clear hierarchy
5. Mobile-first responsive design

---

## How to Execute

### Option 1: Sequential Execution
Execute each phase completely before moving to next:

```bash
# Phase 1
# Read: thoughts/landing-page-polish/phase1-prompt.md
# Use agents: ux-researcher, ui-designer
# Output: 02-phase1-ux-planning.md

# Phase 2
# Read: thoughts/landing-page-polish/phase2-prompt.md
# Use agents: ui-designer, brand-guardian
# Output: 03-phase2-ui-design.md

# Phase 3
# Read: thoughts/landing-page-polish/phase3-prompt.md
# Use agents: frontend-developer, test-writer-fixer, whimsy-injector
# Output: 04-phase3-implementation.md + modified Home.tsx
```

### Option 2: Single Session
Provide all three prompts to a single agent session with instructions to execute sequentially.

---

## Agent Instructions

### Phase 1 Agents
```
> First use the [ux-researcher] to analyze sections 2-9 and define UX improvements
> Then use the [ui-designer] to validate visual hierarchy against hero section
> Write all findings to thoughts/landing-page-polish/02-phase1-ux-planning.md
```

### Phase 2 Agents
```
> First use the [ui-designer] to create exact visual specifications with Tailwind and Framer Motion
> Then use ShadCN MCP tools to find matching components
> Then use the [brand-guardian] to ensure consistency with hero section
> Write all specs to thoughts/landing-page-polish/03-phase2-ui-design.md
```

### Phase 3 Agents
```
> First use the [frontend-developer] to implement Phase 2 specifications in Home.tsx
> During implementation, use chrome-devtools MCP tools for testing
> Then use the [test-writer-fixer] to verify no regressions
> Finally use the [whimsy-injector] for polish pass
> Write all notes to thoughts/landing-page-polish/04-phase3-implementation.md
```

---

## Quality Gates

### After Phase 1
- [ ] All 8 sections have complete UX specs
- [ ] Animation patterns are implementable
- [ ] Mobile UX is defined
- [ ] Accessibility requirements are clear
- [ ] Handoff checklist complete

### After Phase 2
- [ ] All component specs are exact
- [ ] Framer Motion code is copy-pasteable
- [ ] Tailwind classes are specific
- [ ] Responsive behavior defined
- [ ] ShadCN components selected
- [ ] Handoff checklist complete

### After Phase 3
- [ ] All sections implemented
- [ ] Visual testing complete (3 viewports)
- [ ] Performance acceptable (< 3s, 60fps)
- [ ] Accessibility validated (keyboard, screen reader, contrast)
- [ ] Mobile tested thoroughly
- [ ] No regressions
- [ ] Documentation complete

---

## Testing Requirements

### Visual Testing
- Desktop: 1440px+ width
- Tablet: 768px width
- Mobile: 375px width
- Take screenshots at each breakpoint

### Performance Testing
- Lighthouse score > 90
- Animations maintain 60fps
- Page load < 3 seconds
- Bundle size impact minimal

### Accessibility Testing
- Keyboard navigation works
- Screen reader friendly
- Color contrast meets WCAG AA
- Focus indicators visible
- Respects prefers-reduced-motion

### Browser Testing
- Chrome (primary)
- Firefox
- Safari (if available)
- Edge

---

## Troubleshooting

### Phase 1 Issues
**Problem**: UX specs too vague
**Solution**: Reference hero section, be specific about triggers and timings

**Problem**: Mobile considerations missing
**Solution**: Think touch-first, test at 375px

### Phase 2 Issues
**Problem**: Framer Motion syntax errors
**Solution**: Test snippets in isolation, reference Phase 2 patterns library

**Problem**: Can't find right ShadCN component
**Solution**: Use mcp__shadcn__search_items_in_registries and get_item_examples

### Phase 3 Issues
**Problem**: Animations causing jank
**Solution**: Use viewport={{ once: true }}, simplify on mobile

**Problem**: TypeScript errors
**Solution**: Ensure correct motion imports, proper typing on variants

**Problem**: Mobile layout broken
**Solution**: Test at 375px, ensure responsive classes applied

---

## Next Steps After Completion

1. **Review**: Designer reviews implementation
2. **QA**: Test on real devices (not just DevTools)
3. **Deploy**: Push to staging for testing
4. **UAT**: User acceptance testing
5. **Production**: Deploy to production
6. **Monitor**: Watch analytics and user feedback

---

## Support

If you encounter issues or need clarification:
1. Review the relevant prompt file
2. Check `00-analysis-and-scope.md` for constraints
3. Review previous phase outputs for context
4. Document questions in phase output files

---

## Project Timeline

**Estimated Effort**:
- Phase 1 (UX Planning): 2-3 hours
- Phase 2 (UI Design): 3-4 hours
- Phase 3 (Implementation): 4-6 hours
- Testing & QA: 2-3 hours

**Total**: 11-16 hours of focused work

---

## Success Metrics

**Before Polish**:
- Hero section: Excellent ✓
- Other sections: Good but inconsistent

**After Polish**:
- All sections: Excellent ✓
- Consistent visual language throughout
- Smooth, purposeful animations
- Mobile-first responsive
- Accessible to all users
- Fast and performant

---

## Files Generated

Upon completion, you will have:
- `02-phase1-ux-planning.md` (UX specifications)
- `03-phase2-ui-design.md` (Visual specifications)
- `04-phase3-implementation.md` (Implementation notes)
- `05-handoff.md` (Final handoff document)
- Modified `frontend/src/pages/Home.tsx` (polished landing page)

---

**Ready to start? Begin with Phase 1:**
```
Execute: thoughts/landing-page-polish/phase1-prompt.md
```
