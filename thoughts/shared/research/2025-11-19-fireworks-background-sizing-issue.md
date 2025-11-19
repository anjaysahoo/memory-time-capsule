---
date: 2025-11-19T21:50:00+05:30
researcher: anjay.sahoo
git_commit: 5b05e4e0ef2c6ebab77d6900945e0b8380db303b
branch: open-page-revamp-cursor
repository: memory-time-capsule
topic: "FireworksBackground behavior differences across Open.tsx states"
tags: [research, codebase, fireworks, canvas, open-page, sizing-bug]
status: complete
last_updated: 2025-11-19
last_updated_by: anjay.sahoo
---

# Research: FireworksBackground Behavior Differences in Open.tsx

**Date**: 2025-11-19 21:50:00+05:30
**Researcher**: anjay.sahoo
**Git Commit**: 5b05e4e0ef2c6ebab77d6900945e0b8380db303b
**Branch**: open-page-revamp-cursor
**Repository**: memory-time-capsule

## Research Question

Why is the behavior of `FireworksBackground` different across all 3 states (Countdown, Pin Entry, and Unlocked) in `Open.tsx`, specifically why are fireworks limited to the bottom part of the page and not reaching the top in the Countdown state?

## Summary

The `FireworksBackground` component exhibits different behaviors across the three states in `Open.tsx` due to a **canvas sizing mismatch**. The root cause is that the component uses `window.innerWidth` for canvas width calculation but derives height from the container's aspect ratio. This creates inconsistent canvas sizing, especially when:

1. **Content loads asynchronously** (e.g., preview photos)
2. **Container height exceeds viewport height**
3. **Canvas doesn't resize when container dimensions change** (only on window resize events)

The result is that in states with taller content (PIN Entry with preview photo), the canvas internal resolution is much smaller than its displayed size, causing severe stretching and limiting firework explosions to a small visual area.

## Detailed Findings

### Canvas Sizing Logic Issue

**Location**: `frontend/src/components/animate-ui/components/backgrounds/fireworks.tsx:236-248`

The component calculates canvas dimensions as follows:

```typescript
let maxX = window.innerWidth;
let ratio = container.offsetHeight / container.offsetWidth;
let maxY = maxX * ratio;
canvas.width = maxX;
canvas.height = maxY;
```

**Problems**:
- Uses `window.innerWidth` instead of `container.offsetWidth` for width
- Only recalculates on window resize events (line 249), not when container content changes
- No ResizeObserver to detect container dimension changes

### State-by-State Analysis

#### Countdown State (Desktop: 1496x794 viewport)

**Measurements**:
- Viewport: 1496×794px
- Parent div: 794px height (= viewport)
- Fireworks container: 794×1481px
- Canvas internal: **1496×802px**
- Canvas displayed: 1481×794px
- **Stretching**: Minimal (802→794 vertical squeeze)

**Content**:
- No preview photo
- No preview message
- SwapCountdown component: 128px height

**Firework Behavior**:
- Launch from: y=802 (canvas bottom)
- Target range: y=80.2 to y=320.8 (10-40% from top)
- **Result**: Fireworks explode in top 40% of canvas, which maps correctly to top of viewport

**Visual Evidence**: Screenshot shows fireworks working correctly with trails visible.

#### PIN Entry State (Mobile: 375x794 viewport)

**Measurements**:
- Viewport: 375×794px
- Parent div: **1181.5px height** (>> viewport!)
- Fireworks container: 1182×1481px
- Canvas internal: **375×296px** (calculated, but observed 201-296px variation)
- Canvas displayed: 1481×1182px
- **Stretching**: SEVERE (296→1182 = 4× vertical stretch)

**Content**:
- Preview photo: 384px height
- Preview message: present
- Content causes container overflow

**Firework Behavior**:
- Launch from: y=296 (canvas bottom)
- Target range: y=29.6 to y=118.4 (10-40% from top)
- **Result**: Fireworks explode in top 40% of small canvas, which only covers ~10% of stretched display

**Timing Issue Observed**: Canvas height varied between 201px and 296px across measurements, suggesting the canvas is sized before preview image fully loads.

**Visual Evidence**: Screenshot shows fireworks visible but concentrated in upper portion, confirming limited vertical range.

#### Unlocked State

**Expected Behavior**: Similar to PIN Entry state since it also displays preview content and full capsule content, likely experiencing the same canvas stretching issue.

### Root Cause Analysis

The canvas sizing calculation has a fundamental flaw:

```
canvasHeight = window.innerWidth × (container.offsetHeight / container.offsetWidth)
```

When the container height (1182px) is much larger than viewport (794px), and window.innerWidth (375px) is small:

```
canvasHeight = 375 × (1182 / 1481) = 299px
```

But the canvas must be displayed at 1182px tall, resulting in:
- **Internal resolution**: 375×299px
- **Display size**: 1481×1182px
- **Stretch factor**: ~4× vertically

### Firework Target Calculation

**Location**: `frontend/src/components/animate-ui/components/backgrounds/fireworks.tsx:258-261`

```typescript
const launchFirework = () => {
  const x = rand(maxX * 0.1, maxX * 0.9);     // 10-90% horizontal
  const y = maxY;                              // bottom
  const targetY = rand(maxY * 0.1, maxY * 0.4); // 10-40% from top
  // ...
};
```

Fireworks are programmed to explode at **10-40% from the top** of the canvas. When the canvas is severely stretched:
- They explode at the correct position in the *internal* canvas coordinate space
- But this maps to a much smaller region in the *displayed* canvas

### PreviewContent Component Impact

**Location**: `frontend/src/components/PreviewContent.tsx`

This component is rendered in all three states (`Open.tsx:248-252`, `329-333`, `407-412`) but:
- **Countdown state**: No preview photo or message (not provided by capsule data)
- **PIN Entry state**: Has both preview photo (384px) and message
- **Unlocked state**: Has both preview photo and message

The presence of preview content increases container height significantly, exacerbating the canvas sizing mismatch.

## Code References

- `frontend/src/components/animate-ui/components/backgrounds/fireworks.tsx:236-248` - Canvas sizing logic
- `frontend/src/components/animate-ui/components/backgrounds/fireworks.tsx:258-261` - Firework launch and target calculation
- `frontend/src/pages/Open.tsx:209-287` - Countdown state rendering
- `frontend/src/pages/Open.tsx:289-364` - PIN Entry state rendering  
- `frontend/src/pages/Open.tsx:366-447` - Unlocked state rendering
- `frontend/src/components/PreviewContent.tsx` - Preview content component affecting container height

## Architecture Documentation

### Current Canvas Sizing Flow

1. **Component Mount** (`fireworks.tsx:229-341`):
   - Effect runs when component mounts or dependencies change
   - Reads `container.offsetHeight` and `container.offsetWidth`
   - Calculates canvas dimensions using `window.innerWidth`
   - Sets canvas internal resolution

2. **Window Resize** (`fireworks.tsx:242-249`):
   - Listener attached to window resize events only
   - Recalculates dimensions when window size changes
   - Does NOT respond to container content changes

3. **No Content Change Detection**:
   - No ResizeObserver watching container
   - No effect dependencies on content loading
   - Canvas doesn't resize when images load or content changes height

### Usage Pattern in Open.tsx

All three states use identical `FireworksBackground` props:

```tsx
<FireworksBackground
  className="absolute inset-0 z-0"
  population={0.3}
  color={["#10b981", "#06b6d4", "#6366f1", "#8b5cf6", "#ec4899"]}
  fireworkSpeed={7}
/>
```

The differences arise from:
- **Parent container structure**: `min-h-screen flex items-center justify-center`
- **Content height variations**: Preview photos, countdown vs PIN input
- **Timing of content loading**: Async image loading

## Browser Testing Data

### Test Environment
- Browser: Chrome DevTools
- Test URLs:
  - Countdown: `http://localhost:5173/open?t=-Xh9eOGhSVsgMQHe-iU_Ng`
  - PIN Entry: `http://localhost:5173/open?t=mOJluod4gJNwk2OoBEx1NQ`

### Measurements Summary

| State | Viewport | Canvas Internal | Canvas Displayed | Stretch Factor | Preview Content |
|-------|----------|----------------|------------------|----------------|-----------------|
| Countdown (Desktop) | 1496×794 | 1496×802 | 1481×794 | ~1× | None |
| PIN Entry (Mobile) | 375×794 | 375×296* | 1481×1182 | ~4× | Photo + Message |

*Observed variation: 201-296px, indicating timing issues

## Key Technical Insights

1. **Canvas Resolution vs Display Size**: HTML canvas has two concepts:
   - Internal resolution (canvas.width/height): What gets drawn
   - Display size (CSS/offsetWidth/Height): How it's shown
   - Mismatch causes stretching/squeezing

2. **Window vs Container Dimensions**: Using `window.innerWidth` assumes container fills viewport horizontally, but doesn't account for:
   - Padding, margins
   - Flex/grid layouts
   - Container constraints

3. **Async Content Loading**: Preview images load after initial render, changing container height after canvas is already sized

4. **Firework Coordinate Space**: Fireworks use canvas internal coordinates, so they don't know about display stretching

## Related Components

- `SwapCountdown`: `frontend/src/components/ui/swap-countdown.tsx` - Time display in countdown state
- `DrawLineText`: `frontend/src/components/gsap/draw-line-text.tsx` - Animated text in all states
- `PinInput`: `frontend/src/components/PinInput.tsx` - PIN entry component

## Open Questions

1. **Intended Behavior**: Should fireworks explode higher (e.g., 0-50% from top) instead of 10-40%?
2. **Performance Impact**: Would using ResizeObserver for continuous canvas resizing impact performance?
3. **Mobile Optimization**: Should mobile viewports use a different firework density or target range?
4. **Unlocked State**: Does it exhibit the same issue as PIN Entry? (Not tested but expected)

## Additional Notes

The issue is more pronounced on:
- **Mobile viewports** (narrow width = smaller canvas internal resolution)
- **States with tall content** (preview photos, lengthy messages)
- **Slow network connections** (delayed image loading = sizing happens before content ready)

The fireworks ARE working correctly within their coordinate system; the issue is purely about canvas resolution not matching display dimensions, causing visual distortion of where fireworks appear to explode.

