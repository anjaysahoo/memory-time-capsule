# Phase 2: UI Design - Agent Prompt

## Your Role
You are a UI designer and motion designer. Your job is to translate Phase 1's UX specifications into exact visual specifications that Phase 3 can implement directly. Think of yourself as writing a detailed blueprint.

## Context & Resources

### Required Reading (in order):
1. **Scope**: `thoughts/landing-page-polish/00-analysis-and-scope.md`
   - Hero section visual patterns (your visual reference)
   - Design patterns to apply
   - Typography scale
   - Color patterns

2. **Phase 1 Output**: `thoughts/landing-page-polish/02-phase1-ux-planning.md`
   - UX requirements from Phase 1
   - Animation triggers and patterns
   - Mobile considerations
   - Accessibility requirements

3. **Current Code**: `frontend/src/pages/Home.tsx`
   - Current Tailwind classes
   - Current component usage
   - Existing patterns

4. **ShadCN Components**: Use MCP tool `mcp__shadcn__search_items_in_registries`
   - Search for relevant components
   - Get examples with `mcp__shadcn__get_item_examples_from_registries`
   - View details with `mcp__shadcn__view_items_in_registries`

### Your Constraints
**In Scope:**
- Exact Tailwind CSS classes
- Framer Motion configurations
- ShadCN component selections and variants
- Typography and spacing values
- Color combinations (from existing palette)
- Animation keyframes and easing functions

**Out of Scope:**
- Changing UX decisions from Phase 1
- Adding new colors to palette
- Changing content/copy
- Major structural changes

---

## Your Task

For **each section (2-9)**, you must provide:

### 1. Component Specifications
- What components to use (existing or ShadCN)
- Exact props and variants
- Class names (Tailwind)

### 2. Animation Specifications
- Framer Motion syntax ready to copy-paste
- Initial state
- Animate state
- Transition config (duration, ease, delay, stagger)
- Scroll animation trigger config (if applicable)

### 3. Responsive Design
- Mobile classes (`sm:`, `md:`, `lg:`)
- Breakpoint-specific adjustments
- Touch target sizes (minimum 44x44px)

### 4. Visual Hierarchy
- Typography classes
- Spacing values
- Shadow and border treatments
- Icon sizes

---

## Output Format

Create: `thoughts/landing-page-polish/03-phase2-ui-design.md`

Use this structure:

```markdown
# Phase 2: UI Design Output

## Overview
[Summary of visual approach and design system usage]

## Design Tokens Reference

### Colors (from existing palette)
- Primary: [usage]
- Background dark: `bg-black`, `bg-black/5`, `bg-black/80`
- Background light: `bg-white`, `bg-muted`, `bg-muted/30`
- Text on dark: `text-white`, `text-white/90`, `text-white/80`
- Text on light: `text-black`, `text-black/60`, `text-muted-foreground`

### Typography Scale
- H2: `text-4xl md:text-5xl font-bold`
- H3: `text-2xl md:text-3xl font-bold`
- Body: `text-base md:text-lg`
- Small: `text-sm md:text-base`

### Spacing
- Section: `py-24 lg:py-32`
- Container: `max-w-6xl mx-auto px-4`
- Grid gap: `gap-8 lg:gap-16`

---

## Section 2: Trust Indicators Bar

### Component Specification

**Container**:
```tsx
className="max-w-7xl mx-auto px-4 py-16 bg-white"
```

**Grid**:
```tsx
className="grid grid-cols-2 md:grid-cols-4 gap-8"
```

**Card** (for each trust indicator):
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{
    duration: 0.6,
    delay: index * 0.1,
    ease: "easeOut"
  }}
  whileHover={{
    scale: 1.05,
    transition: { duration: 0.2 }
  }}
  className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-black/5 transition-colors cursor-pointer"
>
  <div className="w-12 h-12 rounded-full bg-black/10 flex items-center justify-center group-hover:scale-110 transition-transform">
    <Icon className="w-6 h-6 text-black" />
  </div>
  <h3 className="font-semibold text-sm text-center text-black">{title}</h3>
  <p className="text-xs text-black/60 text-center">{subtitle}</p>
</motion.div>
```

**Accessibility**:
```tsx
<motion.div
  role="button"
  tabIndex={0}
  aria-label={`Learn more about ${title}`}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
  ...
>
```

### Animation Details

**Entrance Animation**:
- Type: Fade-in + slide-up
- Trigger: Scroll into view (50% visible)
- Duration: 600ms
- Stagger: 100ms per card
- Easing: easeOut

**Hover Animation** (desktop only):
- Scale: 1.05
- Duration: 200ms
- Icon scale: 1.1

### Mobile Specifications
- Grid: 2x2 on mobile, 4-col on desktop
- Touch target: Entire card is tappable (p-4 ensures min 44px)
- No hover effects on touch devices (use `@media (hover: hover)` if needed)

### ShadCN Components
- Consider using: Card component from ShadCN
- Command to get: `npx shadcn@latest add card`

---

[Continue for ALL sections 3-9 with same detail level]

---

## Section 3: How It Works Timeline

### Component Specification

**Timeline Container**:
```tsx
<div className="relative grid grid-cols-1 md:grid-cols-3 gap-16">
  {/* Horizontal line */}
  <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-black/20">
    <motion.div
      className="h-full bg-black"
      initial={{ width: 0 }}
      whileInView={{ width: "100%" }}
      viewport={{ once: true }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
    />
  </div>
  {/* Steps... */}
</div>
```

**Step Node**:
```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.8 }}
  whileInView={{ opacity: 1, scale: 1 }}
  viewport={{ once: true }}
  transition={{
    duration: 0.5,
    delay: index * 0.2,
    type: "spring",
    stiffness: 200
  }}
  className="relative flex flex-col items-center gap-4"
>
  <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center relative z-10 shadow-lg">
    <Icon className="w-8 h-8 text-white" />
  </div>
  {/* Content */}
</motion.div>
```

[And so on...]

---

## Framer Motion Patterns Library

### Fade-in on Scroll
```tsx
<motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ duration: 0.6, ease: "easeOut" }}
>
```

### Staggered Children
```tsx
<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  variants={{
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }}
>
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 }
    }}
  >
```

### Card Hover
```tsx
<motion.div
  whileHover={{
    y: -8,
    scale: 1.02,
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
  }}
  transition={{ duration: 0.3, ease: "easeOut" }}
>
```

### Icon Animation on Hover
```tsx
<motion.div
  whileHover={{ rotate: 360, scale: 1.2 }}
  transition={{ duration: 0.5, type: "spring" }}
>
```

---

## ShadCN Component Recommendations

### Section 2: Trust Indicators
- **Component**: Custom (as specified)
- **Reason**: Simple enough, no ShadCN needed

### Section 3: Timeline
- **Component**: Custom (as specified)
- **Reason**: Unique layout, custom implementation better

### Section 4: Interactive Demo
- **Component**: Tabs (already using)
- **Enhancement**: Add smooth content transitions
```tsx
<TabsContent
  value="create"
  className="min-h-[400px] data-[state=active]:animate-in data-[state=inactive]:animate-out fade-in-0 fade-out-0"
>
```

### Section 5: Features Grid
- **Component**: Card (ShadCN)
- **Command**: `npx shadcn@latest add card`
- **Variant**: Default with hover enhancement

### Section 8: FAQ
- **Component**: Accordion (already using)
- **Enhancement**: Add icons and smooth animations
```tsx
<AccordionItem value={...} className="border-b border-border">
  <AccordionTrigger className="hover:text-primary transition-colors">
    <div className="flex items-center gap-3">
      <Icon className="w-5 h-5" />
      {question}
    </div>
  </AccordionTrigger>
  <AccordionContent className="text-muted-foreground animate-accordion-down">
    {answer}
  </AccordionContent>
</AccordionItem>
```

---

## HANDOFF TO PHASE 3

### Completion Checklist
- [ ] All 8 sections have complete component specs
- [ ] Framer Motion code is copy-pasteable
- [ ] Tailwind classes are exact (no placeholders)
- [ ] Responsive breakpoints defined for all sections
- [ ] ShadCN components selected and commands provided
- [ ] Animation configs match UX requirements from Phase 1
- [ ] Accessibility attributes included in specs

### Key Design Decisions
1. [Decision 1]
2. [Decision 2]
3. [etc.]

### Notes for Frontend Developer (Phase 3)
- All Framer Motion code is ready to copy-paste
- Test animations with `prefers-reduced-motion` media query
- Tailwind classes should work with existing theme
- ShadCN components may need to be added first

### Implementation Order Recommendation
1. Start with Section 2 (simplest)
2. Then Section 5 (cards pattern reusable)
3. Then Section 3 (timeline more complex)
4. [etc. in order of complexity]

### Performance Considerations
- Use `viewport={{ once: true }}` to prevent re-animations
- Consider lazy loading heavy animations
- Test on mobile devices (animations should be smooth)
```

---

## Success Criteria

Your output is successful if:
1. ✓ Phase 3 can copy-paste your Framer Motion code directly
2. ✓ All Tailwind classes are specific (no "adjust as needed")
3. ✓ Responsive behavior is clearly defined
4. ✓ ShadCN components are researched and recommended
5. ✓ Animations match UX specs from Phase 1
6. ✓ Accessibility attributes are included
7. ✓ Handoff checklist is complete

---

## Agents to Use

Use these agents in this order:

1. **First**: Use `ui-designer` agent to create visual specs for each section
   > Use the [ui-designer] to translate Phase 1 UX requirements into exact visual specifications with Tailwind classes and Framer Motion configs for sections 2-9

2. **Then**: Use `shadcn` MCP tools to find matching components
   > Search ShadCN registry for components that match the requirements using mcp__shadcn__search_items_in_registries

3. **Then**: Use `brand-guardian` agent to ensure consistency
   > Use the [brand-guardian] to verify all visual specs maintain consistency with the hero section's design language

4. **Finally**: Consolidate into single output document
   > Write all specifications to thoughts/landing-page-polish/03-phase2-ui-design.md

---

## Tips for Success

### Be Implementation-Ready
❌ "Add a nice animation to the cards"
✓ "Use motion.div with initial={{opacity:0, y:40}} animate={{opacity:1, y:0}} transition={{duration:0.6}}"

### Use Existing Patterns
- Copy animation patterns from hero (offsetPath, TextLoop timing)
- Reuse Tailwind class combinations from hero
- Match spacing and typography scales exactly

### Think Component Reusability
- If multiple sections use similar cards, make them identical
- Document pattern once, reference it multiple times
- This makes Phase 3 faster

### Test with ShadCN Tools
- Actually search for components: `mcp__shadcn__search_items_in_registries`
- View examples: `mcp__shadcn__get_item_examples_from_registries`
- Include exact add commands for Phase 3

---

## Ready to Start?

1. Read all required documents
2. Research ShadCN components
3. Create detailed specs for all 8 sections
4. Write comprehensive output to `03-phase2-ui-design.md`
5. Complete handoff checklist
6. Verify against success criteria

**Remember**: Your output is a blueprint. If Phase 3 can't implement it directly, you haven't been specific enough.
