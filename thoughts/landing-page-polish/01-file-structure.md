# Agent Collaboration File Structure

## Overview
This file structure enables clear handoffs between agents working on the landing page polish project. Each phase reads from previous outputs and writes to specific locations.

---

## Directory Structure

```
thoughts/landing-page-polish/
├── 00-analysis-and-scope.md          [✓ DONE - Reference doc]
├── 01-file-structure.md              [✓ DONE - This file]
├── 02-phase1-ux-planning.md          [Phase 1 produces this]
├── 03-phase2-ui-design.md            [Phase 2 produces this]
├── 04-phase3-implementation.md       [Phase 3 produces this]
├── 05-handoff.md                     [Final handoff doc]
└── assets/                           [Optional: screenshots, diagrams]
```

---

## File Purposes & Agent Responsibilities

### 00-analysis-and-scope.md ✓ COMPLETE
**Created by**: Initial analysis (complete)
**Used by**: All phases as reference
**Contains**:
- Hero section analysis (the standard)
- Current state of all 9 sections
- Exact scope definition
- Design patterns from hero
- Success criteria

### 02-phase1-ux-planning.md
**Created by**: Phase 1 - UX & Planning agents
**Used by**: Phase 2 UI Design
**Contains**:
- Section-by-section UX improvements
- Animation timing and triggers
- Interaction patterns
- Mobile vs desktop considerations
- User flow analysis
- Accessibility considerations

### 03-phase2-ui-design.md
**Created by**: Phase 2 - UI Design agents
**Used by**: Phase 3 Frontend Development
**Contains**:
- Detailed component specifications
- Animation keyframes and easing
- Color palette extensions
- Typography refinements
- Spacing and layout grids
- ShadCN component selections
- CSS/Tailwind class patterns
- Framer Motion configuration specs

### 04-phase3-implementation.md
**Created by**: Phase 3 - Frontend Development agents
**Used by**: Review and QA
**Contains**:
- Implementation notes
- Component modifications made
- New components created
- Performance considerations
- Known issues/limitations
- Testing checklist

### 05-handoff.md
**Created by**: Phase 3 completion
**Used by**: Next session or production deploy
**Contains**:
- Summary of all changes
- Before/after comparison
- Deployment checklist
- Browser testing results
- Performance metrics

---

## Agent Communication Protocol

### Phase 1 → Phase 2 Handoff
Phase 1 must output:
```markdown
## HANDOFF TO PHASE 2
- [ ] All sections have UX specs defined
- [ ] Animation patterns documented
- [ ] Mobile considerations noted
- [ ] Accessibility requirements listed

READ NEXT: thoughts/landing-page-polish/00-analysis-and-scope.md (scope)
WRITE TO: thoughts/landing-page-polish/03-phase2-ui-design.md
```

### Phase 2 → Phase 3 Handoff
Phase 2 must output:
```markdown
## HANDOFF TO PHASE 3
- [ ] All components specified with exact props
- [ ] Animation configs written (Framer Motion syntax)
- [ ] Tailwind classes defined
- [ ] ShadCN components selected

READ FROM:
- thoughts/landing-page-polish/00-analysis-and-scope.md
- thoughts/landing-page-polish/02-phase1-ux-planning.md
WRITE TO: thoughts/landing-page-polish/04-phase3-implementation.md
MODIFY: frontend/src/pages/Home.tsx (and related components)
```

### Phase 3 Completion
Phase 3 must output:
```markdown
## HANDOFF TO REVIEW
- [ ] All sections implemented
- [ ] Mobile tested (375px, 768px, 1440px)
- [ ] Animations smooth (60fps)
- [ ] No console errors
- [ ] Performance < 3s load time

READ FROM:
- thoughts/landing-page-polish/00-analysis-and-scope.md
- thoughts/landing-page-polish/02-phase1-ux-planning.md
- thoughts/landing-page-polish/03-phase2-ui-design.md
WRITE TO: thoughts/landing-page-polish/05-handoff.md
```

---

## File Update Rules

### Agents MUST:
1. ✓ Read all previous phase outputs before starting
2. ✓ Reference `00-analysis-and-scope.md` for constraints
3. ✓ Write outputs to designated files BEFORE moving to next task
4. ✓ Update handoff checklist when complete
5. ✓ Note any deviations from scope with justification

### Agents MUST NOT:
1. ✗ Skip reading previous phase outputs
2. ✗ Modify files from previous phases (read-only)
3. ✗ Add features outside defined scope
4. ✗ Work without documenting decisions
5. ✗ Proceed to next phase without completing handoff checklist

---

## Example Phase 1 Output Structure

```markdown
# Phase 1: UX & Planning

## Section 2: Trust Indicators Bar

### Current Issues
- Static, no movement
- Lacks visual hierarchy

### UX Improvements
1. **Animation**: Fade-in on scroll, stagger by 100ms per card
2. **Hover**: Icon scale up 1.1x, card lifts slightly
3. **Mobile**: Stack 2x2 grid, maintain spacing

### User Flow
- User scrolls from hero → sees trust indicators fade in
- On hover: visual feedback (for desktop)
- Mobile: Tap-friendly card areas

### Accessibility
- ARIA labels on icons
- Sufficient color contrast (black on white)
...
```

---

## Integration Points

### With Existing Codebase
**No changes to**:
- `frontend/src/store/` (state management)
- `frontend/src/lib/` (utilities)
- Backend/API (not in scope)

**May modify**:
- `frontend/src/pages/Home.tsx` (main target)
- `frontend/src/components/ui/*` (if variants needed)
- Add new animation components if required

**Must preserve**:
- All existing functionality (auth redirect, scroll behavior)
- Current content and copy
- Route structure

---

## Quality Gates

### Phase 1 Gate
- [ ] All 8 sections (2-9) have UX specs
- [ ] Animation patterns are reasonable (no jank)
- [ ] Mobile considerations for each section
- [ ] Accessibility requirements clear

### Phase 2 Gate
- [ ] Component specs are implementable
- [ ] Framer Motion configs are valid syntax
- [ ] Tailwind classes match hero patterns
- [ ] No new dependencies required

### Phase 3 Gate
- [ ] All sections implemented
- [ ] Mobile responsive (tested 3 sizes)
- [ ] Animations smooth (60fps target)
- [ ] No regressions in existing functionality
- [ ] Performance acceptable (< 3s load)
