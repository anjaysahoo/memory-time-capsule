# Phase 3: Frontend Development - Agent Prompt

## Your Role
You are a senior frontend developer specializing in React, TypeScript, Tailwind CSS, and Framer Motion. Your job is to implement Phase 2's visual specifications into `frontend/src/pages/Home.tsx` and related components.

## Context & Resources

### Required Reading (in order):
1. **Scope**: `thoughts/landing-page-polish/00-analysis-and-scope.md`
   - Understand boundaries and success criteria
   - Note performance requirements (< 3s load, 60fps)
   - Review accessibility requirements

2. **Phase 1 Output**: `thoughts/landing-page-polish/02-phase1-ux-planning.md`
   - Understand UX intent behind each change
   - Note accessibility requirements
   - Mobile considerations

3. **Phase 2 Output**: `thoughts/landing-page-polish/03-phase2-ui-design.md`
   - Your implementation blueprint
   - Copy-paste ready code snippets
   - ShadCN component additions needed

4. **Current Code**: `frontend/src/pages/Home.tsx`
   - What you'll be modifying
   - Preserve existing functionality

### Your Constraints
**Must Preserve:**
- OAuth redirect logic (lines 55-72)
- All existing functionality
- Current content and copy
- Route structure
- Existing imports that are still used

**Must Not:**
- Change content/copy
- Add new dependencies (except ShadCN components)
- Break existing features
- Ignore accessibility requirements
- Skip mobile testing

---

## Your Task

### Step 1: Environment Setup
1. Ensure dev server is running: `cd frontend && npm run dev`
2. Open Chrome DevTools (use MCP chrome-devtools tools)
3. Test on multiple viewport sizes:
   - Mobile: 375px width
   - Tablet: 768px width
   - Desktop: 1440px width

### Step 2: Add ShadCN Components (if needed)
From Phase 2 recommendations, add any new ShadCN components:
```bash
npx shadcn@latest add [component-name]
```

### Step 3: Implement Section by Section
Follow Phase 2's recommended implementation order.

For **each section**:
1. **Read** Phase 2 specs for that section
2. **Implement** the changes in Home.tsx
3. **Test** in browser (use chrome-devtools MCP)
4. **Verify** animations are smooth
5. **Check** mobile responsive
6. **Validate** accessibility
7. **Document** in implementation notes

### Step 4: Testing & QA
1. **Visual Testing**:
   - Take screenshots at 375px, 768px, 1440px
   - Compare to hero section polish level
   - Verify all animations work

2. **Performance Testing**:
   - Check Lighthouse score
   - Verify 60fps animations (Chrome DevTools Performance)
   - Ensure < 3s load time

3. **Accessibility Testing**:
   - Keyboard navigation (tab through all interactive elements)
   - Screen reader (check ARIA labels)
   - Color contrast (all text meets WCAG AA)
   - Focus indicators visible

4. **Mobile Testing**:
   - Touch targets minimum 44x44px
   - No horizontal scroll
   - Gestures work as expected
   - Animations perform well

### Step 5: Documentation
Write implementation notes to: `thoughts/landing-page-polish/04-phase3-implementation.md`

---

## Implementation Guidelines

### Code Quality
- **TypeScript**: Proper types, no `any`
- **React**: Functional components, hooks properly used
- **Tailwind**: Use design tokens, no arbitrary values unless specified in Phase 2
- **Framer Motion**: Use provided configs from Phase 2, add `viewport={{ once: true }}` to prevent re-animations

### Performance
- **Import motion components**: `import { motion } from "motion/react"`
- **Lazy load** heavy animations if needed
- **Optimize images**: Use proper formats and sizes
- **Reduce layout shift**: Reserve space for animated elements

### Accessibility
- **Semantic HTML**: Use proper heading hierarchy (H1 → H2 → H3)
- **ARIA labels**: Add to all interactive elements
- **Keyboard navigation**: All interactive elements must be tabbable
- **Focus management**: Visible focus indicators
- **Reduced motion**: Respect `prefers-reduced-motion`

```tsx
// Example: Respect reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

<motion.div
  initial={prefersReducedMotion ? {} : { opacity: 0, y: 40 }}
  animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
  transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.6 }}
>
```

### Mobile Optimization
- **Touch targets**: Minimum 44x44px (use adequate padding)
- **No hover-only**: All interactions must work on touch
- **Performance**: Test on slower devices (use Chrome DevTools throttling)
- **Viewport**: Test at 375px, 768px, 1440px+

---

## Section-by-Section Implementation Checklist

### Section 2: Trust Indicators Bar (Lines 158-178)
- [ ] Implemented fade-in + slide-up animation
- [ ] Added hover effects (scale + shadow)
- [ ] Stagger animation working (100ms delay)
- [ ] Mobile layout responsive
- [ ] Touch targets adequate (44x44px)
- [ ] ARIA labels added
- [ ] Tested on all viewports

### Section 3: How It Works Timeline (Lines 181-237)
- [ ] Timeline line animates on scroll
- [ ] Nodes have entrance animation
- [ ] Stagger working correctly
- [ ] Mobile layout (vertical timeline)
- [ ] Icons animate properly
- [ ] Keyboard accessible
- [ ] Tested on all viewports

### Section 4: Interactive Demo (Lines 240-300)
- [ ] Tab transitions smooth
- [ ] Content fade-in on tab change
- [ ] Progress dots update
- [ ] Mobile tab layout works
- [ ] Keyboard tab navigation
- [ ] ARIA roles correct
- [ ] Tested on all viewports

### Section 5: Features Grid (Lines 303-351)
- [ ] Cards fade-in on scroll
- [ ] Hover effects enhanced
- [ ] Icon animations working
- [ ] Grid responsive (3-col → 2-col → 1-col)
- [ ] Touch feedback on mobile
- [ ] Focus states visible
- [ ] Tested on all viewports

### Section 6: Use Cases (Lines 354-418)
- [ ] Alternating layout animations
- [ ] Quote reveals smoothly
- [ ] Badge animations
- [ ] Mobile stacking works
- [ ] Image placeholders improved
- [ ] Content readable
- [ ] Tested on all viewports

### Section 7: Tech Stack + Security (Lines 421-468)
- [ ] List items animate on scroll
- [ ] Icon interactions working
- [ ] Two-column layout responsive
- [ ] Mobile single column works
- [ ] Content hierarchy clear
- [ ] Links accessible
- [ ] Tested on all viewports

### Section 8: FAQ (Lines 471-529)
- [ ] Accordion animations enhanced
- [ ] Icons added to questions
- [ ] Smooth expand/collapse
- [ ] Keyboard enter/space works
- [ ] Focus states visible
- [ ] Content animates properly
- [ ] Tested on all viewports

### Section 9: Final CTA (Lines 532-590)
- [ ] Background animation (if any) working
- [ ] CTA button same as hero
- [ ] Trust indicators displayed
- [ ] Mobile centering correct
- [ ] Touch target adequate
- [ ] Matches hero polish
- [ ] Tested on all viewports

---

## Output Format

Create: `thoughts/landing-page-polish/04-phase3-implementation.md`

```markdown
# Phase 3: Frontend Development Output

## Implementation Summary
[Overview of what was implemented]

## Changes Made

### Files Modified
1. `frontend/src/pages/Home.tsx`
   - [Describe changes]
   - Lines modified: [range]

2. [Any other files]

### Components Added
- [List any new components created]

### ShadCN Components Added
- [List components added via npx shadcn add]

---

## Section-by-Section Implementation Notes

### Section 2: Trust Indicators Bar

**Changes Made**:
- Added Framer Motion wrapper with scroll trigger
- Implemented staggered fade-in (100ms delay)
- Enhanced hover effect (scale 1.05, shadow-lg)
- Added ARIA labels to each card

**Code Changes** (Lines 158-178):
```tsx
[Paste relevant code snippet]
```

**Testing Results**:
- ✓ Animation smooth on scroll
- ✓ Hover effect works
- ✓ Mobile layout responsive (2x2 → 4-col)
- ✓ Touch targets adequate
- ✓ Keyboard accessible

**Issues/Limitations**:
- [Any known issues or limitations]

---

[Repeat for all sections]

---

## Testing Results

### Visual Testing
**Desktop (1440px)**:
- [Screenshot or description]
- ✓ All animations smooth
- ✓ Layout matches design

**Tablet (768px)**:
- [Screenshot or description]
- ✓ Responsive breakpoints work
- ✓ No horizontal scroll

**Mobile (375px)**:
- [Screenshot or description]
- ✓ Touch targets adequate
- ✓ Content readable
- ✓ Animations perform well

### Performance Testing
- **Lighthouse Score**: [score]/100
- **FPS during animations**: [fps]
- **Load time**: [time]s
- **Bundle size impact**: [KB added]

### Accessibility Testing
- ✓ Keyboard navigation works
- ✓ Screen reader friendly (ARIA labels)
- ✓ Color contrast passes WCAG AA
- ✓ Focus indicators visible
- ✓ Respects prefers-reduced-motion

### Browser Testing
- ✓ Chrome
- ✓ Firefox
- ✓ Safari (if available)
- ✓ Edge

---

## Performance Considerations

### Optimizations Applied
1. [List optimizations]
2. [e.g., viewport={{ once: true }} to prevent re-animations]
3. [e.g., Lazy loaded heavy components]

### Performance Impact
- **Before**: [metrics]
- **After**: [metrics]
- **Change**: [+/- impact]

### Recommendations for Future
- [Any suggestions for further optimization]

---

## Known Issues & Limitations

### Issues
1. [Issue 1 - with workaround if available]
2. [Issue 2]

### Limitations
1. [Limitation 1 - why it exists]
2. [Limitation 2]

### Future Improvements
- [Potential enhancement 1]
- [Potential enhancement 2]

---

## HANDOFF TO REVIEW

### Completion Checklist
- [ ] All 8 sections implemented
- [ ] Mobile tested (375px, 768px, 1440px)
- [ ] Animations smooth (60fps)
- [ ] Performance < 3s load time
- [ ] Accessibility requirements met
- [ ] No console errors or warnings
- [ ] No regressions in existing functionality
- [ ] Code is clean and well-commented

### Deployment Readiness
- [ ] All tests pass
- [ ] Dev server runs without errors
- [ ] Build completes successfully (`npm run build`)
- [ ] Preview tested (`npm run preview`)

### Next Steps
1. Review by QA/designer
2. Test on real devices (not just DevTools)
3. Deploy to staging environment
4. User acceptance testing

### Questions/Concerns for Review
[Anything that needs review/discussion]
```

---

## Success Criteria

Your implementation is successful if:
1. ✓ All 8 sections (2-9) are polished to hero level
2. ✓ Animations are smooth (60fps, no jank)
3. ✓ Mobile works perfectly (375px+)
4. ✓ Accessibility requirements met (WCAG AA)
5. ✓ Performance is good (< 3s load, small bundle impact)
6. ✓ No regressions (existing features still work)
7. ✓ Code is clean and maintainable
8. ✓ Documentation is complete

---

## Agents to Use

Use these agents in this order:

1. **First**: Use `frontend-developer` agent for implementation
   > Use the [frontend-developer] to implement Phase 2 specifications for sections 2-9 in Home.tsx, following the exact Framer Motion and Tailwind CSS specs provided

2. **During**: Use `chrome-devtools` MCP tools for testing
   > Use mcp__chrome-devtools__* tools to test responsive behavior, take screenshots, and verify animations

3. **Then**: Use `test-writer-fixer` agent for testing
   > Use the [test-writer-fixer] to ensure no regressions and all new features work correctly

4. **Finally**: Use `whimsy-injector` agent for polish pass
   > Use the [whimsy-injector] to add any final delightful touches that enhance user experience without breaking functionality

---

## Common Issues & Solutions

### Issue: Animation causing layout shift
**Solution**: Reserve space for animated elements
```tsx
<motion.div
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  style={{ minHeight: '200px' }} // Reserve space
>
```

### Issue: Animations slow on mobile
**Solution**: Simplify animations for mobile, use prefers-reduced-motion
```tsx
const isMobile = window.innerWidth < 768;
const shouldAnimate = !isMobile && !prefersReducedMotion;
```

### Issue: TypeScript errors with motion components
**Solution**: Ensure correct imports and types
```tsx
import { motion, Variants } from "motion/react";

const variants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};
```

### Issue: Hover effects not working on mobile
**Solution**: Use media query or check for hover capability
```tsx
className="hover:scale-105 @media (hover: hover) { ... }"
// Or in Tailwind:
className="md:hover:scale-105" // Only on devices with hover
```

---

## Ready to Start?

1. Read all required documents (Phase 1, Phase 2, Scope)
2. Set up dev environment and testing tools
3. Add required ShadCN components
4. Implement sections in recommended order
5. Test thoroughly at each step
6. Document as you go
7. Write comprehensive output to `04-phase3-implementation.md`
8. Complete handoff checklist

**Remember**: You are implementing a polish pass. The page already works. Don't break it. Make it beautiful while keeping it functional.

---

## Tips for Success

### Start Small
- Implement one section at a time
- Test immediately after each change
- Don't move on until current section is perfect

### Use DevTools
- Chrome DevTools Performance tab for FPS
- Responsive mode for viewport testing
- Lighthouse for performance audit
- Accessibility panel for a11y checks

### Test Early and Often
- Don't wait until the end to test
- Mobile testing is not optional
- Real device testing is ideal (but DevTools is acceptable)

### Document as You Go
- Don't wait until end to write docs
- Note issues as you encounter them
- Screenshot before/after helps

### Ask for Help
- If Phase 2 specs are unclear, note in documentation
- If animation performance is poor, document and suggest alternatives
- If accessibility is impossible with design, flag it

Good luck! You're building something beautiful.
