# Interaction Patterns Specification: Memory Time Capsule Landing Page

## Executive Summary

This document defines all micro-interactions, animations, hover states, and delightful moments for the 11-section landing page. Each specification balances professional polish with authentic warmth, ensuring trust while creating memorable moments. All animations respect accessibility (prefers-reduced-motion) and performance budgets (GPU-accelerated properties, 60fps target).

**Design Philosophy:**
- Motion guides attention, doesn't steal it
- Delight enhances understanding, doesn't distract
- Interactions feel natural, not gimmicky
- Accessibility is non-negotiable
- Performance is paramount

**Total Interactions Specified:** 80+ individual interaction patterns
**Sections Covered:** 11 (complete page)
**Animation Library:** CSS3 + React Spring (optional) + Intersection Observer

---

## Table of Contents

1. [Page Load Sequence](#1-page-load-sequence)
2. [Hero Section](#2-hero-section)
3. [Trust Indicators Bar](#3-trust-indicators-bar)
4. [How It Works Timeline](#4-how-it-works-timeline)
5. [Interactive Demo Section](#5-interactive-demo-section)
6. [Features Grid](#6-features-grid)
7. [Use Cases Section](#7-use-cases-section)
8. [Technology & Security Deep-Dive](#8-technology--security-deep-dive)
9. [Video Product Demo](#9-video-product-demo)
10. [Social Proof Section](#10-social-proof-section)
11. [FAQ Section](#11-faq-section)
12. [Final CTA](#12-final-cta)
13. [Global Interactions](#13-global-interactions)
14. [Scroll-Based Choreography](#14-scroll-based-choreography)
15. [Delight Moments Catalog](#15-delight-moments-catalog)
16. [Mobile-Specific Interactions](#16-mobile-specific-interactions)
17. [Accessibility Accommodations](#17-accessibility-accommodations)
18. [Performance Optimization](#18-performance-optimization)

---

## 1. Page Load Sequence

### Initial Load Choreography

**Strategy:** Prioritize above-fold content, cascade reveals for smooth perceived performance

**Sequence:**

#### Stage 1: Hero Content (0-400ms)
**Trigger:** Page load complete (DOMContentLoaded)
**Target:** Hero headline, subtitle, CTA
**Properties:**
  - opacity: 0→1
  - transform: translateY(30px)→translateY(0)
**Duration:** 600ms
**Easing:** cubic-bezier(0.4, 0, 0.2, 1) (ease-out-expo)
**Delay:**
  - Headline: 0ms
  - Subtitle: 100ms
  - CTA: 200ms
**Reduced Motion:** Fade only, no transform

```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-headline {
  animation: fadeInUp 600ms cubic-bezier(0.4, 0, 0.2, 1) 0ms both;
}

.hero-subtitle {
  animation: fadeInUp 600ms cubic-bezier(0.4, 0, 0.2, 1) 100ms both;
}

.hero-cta {
  animation: fadeInUp 600ms cubic-bezier(0.4, 0, 0.2, 1) 200ms both;
}

@media (prefers-reduced-motion: reduce) {
  .hero-headline, .hero-subtitle, .hero-cta {
    animation: fadeIn 300ms ease-in 0ms both;
  }
}
```

#### Stage 2: Hero Background Video (400-800ms)
**Trigger:** After hero text visible
**Target:** .hero-background-video
**Properties:**
  - opacity: 0→0.2
**Duration:** 800ms
**Easing:** ease-in-out
**Delay:** 400ms
**Reduced Motion:** Static poster image, no video playback

#### Stage 3: Scroll Indicator (800-1200ms)
**Trigger:** After hero elements settled
**Target:** .scroll-indicator
**Properties:**
  - opacity: 0→1
  - Begin bounce animation loop
**Duration:** 400ms
**Easing:** ease-out
**Delay:** 800ms
**Reduced Motion:** Fade in only, no bounce

#### Stage 4: Below-Fold Lazy Load (On Scroll)
**Trigger:** Intersection Observer (threshold: 0.1)
**Target:** All images, videos, sections below fold
**Strategy:** Load when 10% visible, animate when 20% visible
**Performance Note:** Use native loading="lazy" + Intersection Observer for animation

---

## 2. Hero Section

### 2.1 CTA Button - Primary Interaction

#### Hover State
**Trigger:** Mouse enter
**Target:** .hero-cta
**Properties:**
  - transform: scale(1.05)
  - box-shadow: 0 8px 24px rgba(0,0,0,0.15)
  - background: Slightly lighter shade (filter: brightness(1.1))
**Duration:** 200ms
**Easing:** cubic-bezier(0.4, 0, 0.2, 1)
**Delay:** 0ms
**Reduced Motion:** Only box-shadow change, no scale

```css
.hero-cta {
  transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1),
              filter 200ms ease-out;
}

.hero-cta:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  filter: brightness(1.1);
}

@media (prefers-reduced-motion: reduce) {
  .hero-cta:hover {
    transform: none;
  }
}
```

#### Active/Click State
**Trigger:** Mouse down / Touch start
**Target:** .hero-cta
**Properties:**
  - transform: scale(0.95)
**Duration:** 100ms
**Easing:** ease-out
**Delay:** 0ms
**Reduced Motion:** Scale to 0.98 instead of 0.95

#### Focus State (Keyboard Navigation)
**Trigger:** Tab focus
**Target:** .hero-cta
**Properties:**
  - outline: 2px solid primary color
  - outline-offset: 4px
  - box-shadow: 0 0 0 4px rgba(primary, 0.2)
**Duration:** 150ms
**Easing:** ease-out
**Note:** High visibility for accessibility

### 2.2 Scroll Indicator Animation

#### Bounce Loop
**Trigger:** Auto-start after hero load (800ms delay)
**Target:** .scroll-indicator (ChevronDown icon)
**Properties:**
  - transform: translateY(0) → translateY(10px) → translateY(0)
  - opacity: 1 → 0.6 → 1
**Duration:** 1500ms
**Easing:** ease-in-out
**Iteration:** Infinite
**Reduced Motion:** Static icon, no bounce

```css
@keyframes scrollBounce {
  0%, 100% {
    transform: translateY(0);
    opacity: 1;
  }
  50% {
    transform: translateY(10px);
    opacity: 0.6;
  }
}

.scroll-indicator {
  animation: scrollBounce 1500ms ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .scroll-indicator {
    animation: none;
  }
}
```

#### Click Behavior
**Trigger:** Click on scroll indicator
**Target:** Window scroll position
**Properties:**
  - Smooth scroll to Trust Indicators section
**Duration:** 800ms
**Easing:** cubic-bezier(0.4, 0, 0.2, 1)
**Behavior:** scroll-behavior: smooth

```javascript
// Smooth scroll implementation
scrollIndicator.addEventListener('click', () => {
  trustSection.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
});
```

### 2.3 Background Video Interaction

#### Playback State
**Trigger:** Page load (after hero text visible)
**Target:** video element
**Properties:**
  - autoplay: true
  - muted: true
  - loop: true
  - opacity: 0.2 (overlay transparency)
**Note:** Pause when scrolled out of view (battery optimization)

#### Pause on Scroll Away
**Trigger:** Intersection Observer (hero exits viewport)
**Action:** video.pause()
**Resume:** video.play() when re-entering viewport
**Reduced Motion:** Replace video with static background image

### 2.4 GitHub/Gmail Logo Badges

#### Hover State
**Trigger:** Mouse enter on logo badge container
**Target:** Individual logo icon
**Properties:**
  - transform: scale(1.1)
  - opacity: 1 (from 0.8 default)
**Duration:** 200ms
**Easing:** ease-out
**Reduced Motion:** Opacity change only

---

## 3. Trust Indicators Bar

### 3.1 Section Reveal Animation

#### Fade In on Scroll
**Trigger:** Intersection Observer (threshold: 0.2)
**Target:** Each trust indicator badge (staggered)
**Properties:**
  - opacity: 0→1
  - transform: translateY(20px)→translateY(0)
  - Individual scale: scale(0.9)→scale(1)
**Duration:** 400ms
**Easing:** cubic-bezier(0.4, 0, 0.2, 1)
**Delay:** Stagger by 100ms per badge (0ms, 100ms, 200ms, 300ms)
**Reduced Motion:** Fade only, no transform

```css
@keyframes fadeInUpScale {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.trust-badge:nth-child(1) { animation: fadeInUpScale 400ms cubic-bezier(0.4, 0, 0.2, 1) 0ms both; }
.trust-badge:nth-child(2) { animation: fadeInUpScale 400ms cubic-bezier(0.4, 0, 0.2, 1) 100ms both; }
.trust-badge:nth-child(3) { animation: fadeInUpScale 400ms cubic-bezier(0.4, 0, 0.2, 1) 200ms both; }
.trust-badge:nth-child(4) { animation: fadeInUpScale 400ms cubic-bezier(0.4, 0, 0.2, 1) 300ms both; }

@media (prefers-reduced-motion: reduce) {
  .trust-badge {
    animation: fadeIn 200ms ease-in 0ms both !important;
  }
}
```

### 3.2 Icon Interaction

#### Hover State (Desktop)
**Trigger:** Mouse enter on badge
**Target:** Icon within badge
**Properties:**
  - transform: rotate(5deg) scale(1.1)
  - color: Shift to primary color (if not already)
**Duration:** 250ms
**Easing:** cubic-bezier(0.68, -0.55, 0.265, 1.55) (back-ease-out, playful bounce)
**Reduced Motion:** Color change only, no rotation/scale

```css
.trust-badge {
  transition: transform 250ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.trust-badge:hover .trust-icon {
  transform: rotate(5deg) scale(1.1);
  color: var(--primary);
}

@media (prefers-reduced-motion: reduce) {
  .trust-badge:hover .trust-icon {
    transform: none;
  }
}
```

### 3.3 Badge Pulse (Delight Moment)

#### Subtle Pulse on Load
**Trigger:** After initial fade-in completes
**Target:** Badge with "100% Free" (delight emphasis)
**Properties:**
  - transform: scale(1) → scale(1.05) → scale(1)
  - box-shadow: Glow effect
**Duration:** 600ms
**Easing:** ease-in-out
**Iterations:** 2 (double pulse)
**Delay:** 600ms after fade-in
**Reduced Motion:** Skip pulse entirely

---

## 4. How It Works Timeline

### 4.1 Timeline Line Drawing Animation

#### Horizontal Line Progress (Desktop)
**Trigger:** Intersection Observer (threshold: 0.3)
**Target:** .timeline-line (connecting line between steps)
**Properties:**
  - width: 0% → 100%
  - background-position: Animated gradient shift
**Duration:** 1500ms
**Easing:** cubic-bezier(0.4, 0, 0.2, 1)
**Delay:** 200ms
**Reduced Motion:** Instant appearance (width: 100%, no animation)

```css
@keyframes drawLine {
  from {
    width: 0%;
  }
  to {
    width: 100%;
  }
}

.timeline-line {
  width: 0%;
  animation: drawLine 1500ms cubic-bezier(0.4, 0, 0.2, 1) 200ms both;
}

@media (prefers-reduced-motion: reduce) {
  .timeline-line {
    width: 100%;
    animation: none;
  }
}
```

#### Vertical Line Progress (Mobile)
**Trigger:** Intersection Observer (threshold: 0.2)
**Target:** .timeline-line-vertical
**Properties:**
  - height: 0% → 100%
**Duration:** 1200ms
**Easing:** cubic-bezier(0.4, 0, 0.2, 1)
**Delay:** 200ms
**Reduced Motion:** Instant appearance

### 4.2 Step Node Reveal

#### Sequential Node Activation
**Trigger:** After timeline line reaches each node position
**Target:** .timeline-node (circular badge icons)
**Properties:**
  - opacity: 0→1
  - transform: scale(0)→scale(1.2)→scale(1) (bounce overshoot)
**Duration:** 500ms
**Easing:** cubic-bezier(0.68, -0.55, 0.265, 1.55) (back-ease-out)
**Delay:**
  - Node 1: 400ms (after line starts)
  - Node 2: 900ms
  - Node 3: 1400ms
**Reduced Motion:** Fade only, no scale

```css
@keyframes nodeReveal {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  70% {
    transform: scale(1.2);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.timeline-node-1 { animation: nodeReveal 500ms cubic-bezier(0.68, -0.55, 0.265, 1.55) 400ms both; }
.timeline-node-2 { animation: nodeReveal 500ms cubic-bezier(0.68, -0.55, 0.265, 1.55) 900ms both; }
.timeline-node-3 { animation: nodeReveal 500ms cubic-bezier(0.68, -0.55, 0.265, 1.55) 1400ms both; }

@media (prefers-reduced-motion: reduce) {
  .timeline-node-1, .timeline-node-2, .timeline-node-3 {
    animation: fadeIn 200ms ease-in 0ms both;
  }
}
```

#### Node Pulse Effect
**Trigger:** After node reveal completes
**Target:** .timeline-node (ripple/glow effect)
**Properties:**
  - box-shadow: 0 0 0 0 rgba(primary, 0.6) → 0 0 0 20px rgba(primary, 0)
**Duration:** 800ms
**Easing:** ease-out
**Iterations:** 1 (single pulse)
**Reduced Motion:** Skip pulse

```css
@keyframes nodePulse {
  from {
    box-shadow: 0 0 0 0 rgba(var(--primary-rgb), 0.6);
  }
  to {
    box-shadow: 0 0 0 20px rgba(var(--primary-rgb), 0);
  }
}

.timeline-node.revealed {
  animation: nodePulse 800ms ease-out;
}
```

### 4.3 Step Content Reveal

#### Text Fade-In with Stagger
**Trigger:** Triggered with corresponding node reveal
**Target:** Step title, description, time badge
**Properties:**
  - opacity: 0→1
  - transform: translateX(-20px)→translateX(0) (desktop)
  - transform: translateY(10px)→translateY(0) (mobile)
**Duration:** 400ms
**Easing:** ease-out
**Delay:**
  - Title: +100ms after node
  - Description: +200ms after node
  - Badge: +300ms after node
**Reduced Motion:** Fade only

### 4.4 Icon Hover States

#### Step Icon Interaction
**Trigger:** Mouse enter on step card
**Target:** Icon within timeline node
**Properties:**
  - transform: rotate(10deg) scale(1.15)
  - color: Lighten by 10%
**Duration:** 250ms
**Easing:** cubic-bezier(0.68, -0.55, 0.265, 1.55)
**Reduced Motion:** Color change only

#### Supporting Icon Float
**Trigger:** Continuous animation after reveal
**Target:** Small supporting icons (GitHub, file types, email preview)
**Properties:**
  - transform: translateY(0px) → translateY(-5px) → translateY(0px)
**Duration:** 2000ms
**Easing:** ease-in-out
**Iterations:** Infinite
**Reduced Motion:** Static icons, no float

### 4.5 Time Estimate Badge

#### Badge Appearance
**Trigger:** With step content reveal
**Target:** "~2 min" badge on step 1
**Properties:**
  - opacity: 0→1
  - transform: scale(0.8)→scale(1)
**Duration:** 300ms
**Easing:** ease-out
**Delay:** 300ms after step text
**Reduced Motion:** Fade only

---

## 5. Interactive Demo Section

### 5.1 Demo Container Entrance

#### Section Reveal
**Trigger:** Intersection Observer (threshold: 0.25)
**Target:** Entire demo container (card/frame)
**Properties:**
  - opacity: 0→1
  - transform: translateY(40px)→translateY(0)
  - box-shadow: 0 4px 8px rgba(0,0,0,0.05) → 0 20px 40px rgba(0,0,0,0.1)
**Duration:** 600ms
**Easing:** cubic-bezier(0.4, 0, 0.2, 1)
**Delay:** 100ms
**Reduced Motion:** Fade only, shadow instant

### 5.2 Tab Navigation Interaction

#### Tab Button Hover
**Trigger:** Mouse enter on inactive tab
**Target:** .demo-tab-button
**Properties:**
  - background: rgba(primary, 0.05)→rgba(primary, 0.1)
  - transform: translateY(0)→translateY(-2px)
**Duration:** 150ms
**Easing:** ease-out
**Reduced Motion:** Background color only

#### Tab Button Active State
**Trigger:** Click tab button / Auto-advance
**Target:** .demo-tab-button.active
**Properties:**
  - background: primary color
  - color: white
  - border-bottom: 3px solid primary (thicker underline)
  - transform: scale(1.05)
**Duration:** 200ms
**Easing:** ease-out
**Reduced Motion:** Color change only, no scale

```css
.demo-tab-button {
  transition: background 150ms ease-out,
              transform 150ms ease-out,
              color 150ms ease-out;
}

.demo-tab-button:hover {
  background: rgba(var(--primary-rgb), 0.1);
  transform: translateY(-2px);
}

.demo-tab-button.active {
  background: var(--primary);
  color: white;
  border-bottom: 3px solid var(--primary);
  transform: scale(1.05);
}

@media (prefers-reduced-motion: reduce) {
  .demo-tab-button:hover,
  .demo-tab-button.active {
    transform: none;
  }
}
```

### 5.3 Content Panel Transition

#### State Change Animation
**Trigger:** Tab click / Auto-advance (3s interval)
**Target:** .demo-content-panel
**Properties:**
  - Current panel: opacity 1→0, transform translateX(0)→translateX(-30px)
  - New panel: opacity 0→1, transform translateX(30px)→translateX(0)
**Duration:** 400ms
**Easing:** cubic-bezier(0.4, 0, 0.2, 1)
**Delay:** New panel starts after 100ms overlap
**Reduced Motion:** Crossfade only (opacity), no translateX

```css
.demo-content-panel.exit {
  animation: slideOutLeft 400ms cubic-bezier(0.4, 0, 0.2, 1) both;
}

.demo-content-panel.enter {
  animation: slideInRight 400ms cubic-bezier(0.4, 0, 0.2, 1) 100ms both;
}

@keyframes slideOutLeft {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(-30px);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .demo-content-panel.exit,
  .demo-content-panel.enter {
    animation: crossfade 300ms ease-in-out;
  }
}
```

### 5.4 Progress Indicator Animation

#### Circle Fill Transition
**Trigger:** Tab change
**Target:** .progress-circle
**Properties:**
  - background: muted→primary (active state)
  - transform: scale(1)→scale(1.3)→scale(1.1) (pulse on activation)
**Duration:** 300ms
**Easing:** cubic-bezier(0.68, -0.55, 0.265, 1.55)
**Reduced Motion:** Color change only

#### Progress Bar Fill
**Trigger:** Auto-advance timer
**Target:** .progress-bar-fill
**Properties:**
  - width: 0%→100% (over 3 second cycle)
**Duration:** 3000ms
**Easing:** linear
**Behavior:** Resets to 0% on manual tab click
**Reduced Motion:** Show static filled state for active tab

### 5.5 Auto-Advance Pause/Play

#### Pause Button Hover
**Trigger:** Mouse enter on pause/play control
**Target:** .demo-pause-button
**Properties:**
  - transform: scale(1.1)
  - background: Lighten by 10%
**Duration:** 150ms
**Easing:** ease-out

#### Pause Button Click
**Trigger:** Click pause button
**Target:** Icon swap (Pause ↔ Play)
**Properties:**
  - Rotate out: transform rotate(0deg)→rotate(90deg), opacity 1→0
  - Rotate in: transform rotate(-90deg)→rotate(0deg), opacity 0→1
**Duration:** 200ms
**Easing:** ease-in-out

### 5.6 Mockup Hover Interaction

#### UI Mockup Hover (Desktop)
**Trigger:** Mouse enter on demo visual area
**Target:** Screenshot/mockup image
**Properties:**
  - transform: scale(1.02)
  - box-shadow: Increase elevation
**Duration:** 300ms
**Easing:** ease-out
**Reduced Motion:** Shadow change only

---

## 6. Features Grid

### 6.1 Card Entrance Animation

#### Staggered Grid Reveal
**Trigger:** Intersection Observer (threshold: 0.15)
**Target:** Each feature card (6 total)
**Properties:**
  - opacity: 0→1
  - transform: translateY(30px)→translateY(0)
  - scale: 0.95→1
**Duration:** 500ms
**Easing:** cubic-bezier(0.4, 0, 0.2, 1)
**Delay:** Stagger by 80ms per card
  - Card 1: 0ms
  - Card 2: 80ms
  - Card 3: 160ms
  - Card 4: 240ms
  - Card 5: 320ms
  - Card 6: 400ms
**Reduced Motion:** Fade only (opacity 0→1, 300ms)

```css
@keyframes cardReveal {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.feature-card:nth-child(1) { animation: cardReveal 500ms cubic-bezier(0.4, 0, 0.2, 1) 0ms both; }
.feature-card:nth-child(2) { animation: cardReveal 500ms cubic-bezier(0.4, 0, 0.2, 1) 80ms both; }
.feature-card:nth-child(3) { animation: cardReveal 500ms cubic-bezier(0.4, 0, 0.2, 1) 160ms both; }
.feature-card:nth-child(4) { animation: cardReveal 500ms cubic-bezier(0.4, 0, 0.2, 1) 240ms both; }
.feature-card:nth-child(5) { animation: cardReveal 500ms cubic-bezier(0.4, 0, 0.2, 1) 320ms both; }
.feature-card:nth-child(6) { animation: cardReveal 500ms cubic-bezier(0.4, 0, 0.2, 1) 400ms both; }
```

### 6.2 Card Hover State (Desktop)

#### Lift and Shadow Enhancement
**Trigger:** Mouse enter
**Target:** .feature-card
**Properties:**
  - transform: translateY(0)→translateY(-8px)
  - box-shadow: 0 4px 12px rgba(0,0,0,0.08) → 0 20px 40px rgba(0,0,0,0.15)
  - border-color: transparent → primary (subtle accent)
**Duration:** 250ms
**Easing:** cubic-bezier(0.4, 0, 0.2, 1)
**Reduced Motion:** Shadow change only

```css
.feature-card {
  transition: transform 250ms cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1),
              border-color 250ms ease-out;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
  border-color: var(--primary);
}

@media (prefers-reduced-motion: reduce) {
  .feature-card:hover {
    transform: none;
  }
}
```

### 6.3 Icon Interaction on Card Hover

#### Icon Float Animation
**Trigger:** Card hover (mouse enter on parent)
**Target:** .feature-icon within card
**Properties:**
  - transform: translateY(0)→translateY(-5px)
  - color: Shift to primary (if not already)
  - filter: drop-shadow increase
**Duration:** 300ms
**Easing:** cubic-bezier(0.68, -0.55, 0.265, 1.55) (playful bounce)
**Reduced Motion:** Color change only

#### Icon Rotation (Subtle)
**Trigger:** Card hover
**Target:** Specific icons (Shield, Clock) - not all
**Properties:**
  - transform: rotate(0deg)→rotate(-10deg)
**Duration:** 250ms
**Easing:** ease-out
**Note:** Only on icons that make sense to rotate (not FileVideo, Mail)
**Reduced Motion:** Skip rotation

### 6.4 Badge/Pill Animations

#### Supporting Badge Reveal
**Trigger:** Card hover
**Target:** Small badges within cards ("AES-256", "No credit card", etc.)
**Properties:**
  - opacity: 0.7→1
  - transform: scale(0.95)→scale(1)
**Duration:** 200ms
**Easing:** ease-out
**Reduced Motion:** Opacity change only

### 6.5 Card Focus State (Keyboard Navigation)

#### Keyboard Focus Ring
**Trigger:** Tab focus on card (if card is link/button)
**Target:** .feature-card
**Properties:**
  - outline: 3px solid primary
  - outline-offset: 4px
  - box-shadow: 0 0 0 4px rgba(primary, 0.2)
**Duration:** 150ms
**Easing:** ease-out
**Note:** Must be highly visible for accessibility

---

## 7. Use Cases Section

### 7.1 Section Reveal

#### Alternating Card Entrance
**Trigger:** Intersection Observer (threshold: 0.2)
**Target:** Use case cards (4 total)
**Properties:**
  - Odd cards (1, 3): translateX(-40px)→translateX(0), opacity 0→1
  - Even cards (2, 4): translateX(40px)→translateX(0), opacity 0→1
**Duration:** 600ms
**Easing:** cubic-bezier(0.4, 0, 0.2, 1)
**Delay:** Stagger by 150ms per card
**Reduced Motion:** Fade only (opacity 0→1)

```css
@keyframes slideInFromLeft {
  from {
    opacity: 0;
    transform: translateX(-40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInFromRight {
  from {
    opacity: 0;
    transform: translateX(40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.use-case-card:nth-child(odd) {
  animation: slideInFromLeft 600ms cubic-bezier(0.4, 0, 0.2, 1) both;
}

.use-case-card:nth-child(even) {
  animation: slideInFromRight 600ms cubic-bezier(0.4, 0, 0.2, 1) both;
}

.use-case-card:nth-child(1) { animation-delay: 0ms; }
.use-case-card:nth-child(2) { animation-delay: 150ms; }
.use-case-card:nth-child(3) { animation-delay: 300ms; }
.use-case-card:nth-child(4) { animation-delay: 450ms; }
```

### 7.2 Image Hover Zoom

#### Photo Parallax Effect
**Trigger:** Mouse move within card
**Target:** .use-case-image
**Properties:**
  - transform: scale(1.05) (slight zoom)
  - object-position: Shift based on mouse position (parallax)
**Duration:** 500ms
**Easing:** ease-out
**Reduced Motion:** No zoom or parallax

```css
.use-case-image {
  transition: transform 500ms ease-out;
  overflow: hidden;
}

.use-case-card:hover .use-case-image {
  transform: scale(1.05);
}

@media (prefers-reduced-motion: reduce) {
  .use-case-card:hover .use-case-image {
    transform: none;
  }
}
```

### 7.3 Quote Reveal Animation

#### Blockquote Slide-In
**Trigger:** Card hover OR scroll reveal (whichever first)
**Target:** .use-case-quote (italic quote within card)
**Properties:**
  - opacity: 0.8→1
  - transform: translateY(5px)→translateY(0)
  - border-left-width: 2px→4px (accent border thickens)
**Duration:** 300ms
**Easing:** ease-out
**Reduced Motion:** Opacity and border only

### 7.4 CTA Link Interaction

#### "Try this use case →" Link Hover
**Trigger:** Mouse enter on CTA link
**Target:** .use-case-cta
**Properties:**
  - color: muted→primary
  - transform: translateX(0)→translateX(5px) (arrow moves right)
  - text-decoration-thickness: 1px→2px (underline thickens)
**Duration:** 200ms
**Easing:** ease-out
**Reduced Motion:** Color change only

```css
.use-case-cta {
  transition: color 200ms ease-out,
              transform 200ms ease-out,
              text-decoration-thickness 200ms ease-out;
}

.use-case-cta:hover {
  color: var(--primary);
  transform: translateX(5px);
  text-decoration-thickness: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .use-case-cta:hover {
    transform: none;
  }
}
```

### 7.5 Icon Badge Pulse

#### Category Icon Interaction
**Trigger:** Card hover
**Target:** Small icon badge (Cake, Briefcase, Heart, Camera)
**Properties:**
  - transform: rotate(0deg)→rotate(10deg)→rotate(-5deg)→rotate(0deg) (wiggle)
  - scale: 1→1.1→1
**Duration:** 400ms
**Easing:** cubic-bezier(0.68, -0.55, 0.265, 1.55)
**Iterations:** 1 (single wiggle)
**Reduced Motion:** Skip animation

---

## 8. Technology & Security Deep-Dive

### 8.1 Two-Column Reveal

#### Split Animation Entrance
**Trigger:** Intersection Observer (threshold: 0.25)
**Target:** Left column (Technology) and Right column (Security)
**Properties:**
  - Left column: translateX(-30px)→translateX(0), opacity 0→1
  - Right column: translateX(30px)→translateX(0), opacity 0→1
**Duration:** 600ms
**Easing:** cubic-bezier(0.4, 0, 0.2, 1)
**Delay:**
  - Left: 0ms
  - Right: 200ms (slight stagger)
**Reduced Motion:** Fade only

### 8.2 Tech Stack List Animation

#### Bullet Point Cascade
**Trigger:** After column reveal
**Target:** Each tech stack item (5 items in left column)
**Properties:**
  - opacity: 0→1
  - transform: translateX(-10px)→translateX(0)
**Duration:** 300ms
**Easing:** ease-out
**Delay:** Stagger by 60ms per item
  - Item 1: 200ms
  - Item 2: 260ms
  - Item 3: 320ms
  - Item 4: 380ms
  - Item 5: 440ms
**Reduced Motion:** Instant appearance (no animation)

```css
.tech-item {
  opacity: 0;
  animation: fadeInLeft 300ms ease-out both;
}

.tech-item:nth-child(1) { animation-delay: 200ms; }
.tech-item:nth-child(2) { animation-delay: 260ms; }
.tech-item:nth-child(3) { animation-delay: 320ms; }
.tech-item:nth-child(4) { animation-delay: 380ms; }
.tech-item:nth-child(5) { animation-delay: 440ms; }

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```

### 8.3 Logo Badge Interaction

#### Brand Logo Hover
**Trigger:** Mouse enter on tech logo (GitHub, Cloudflare, etc.)
**Target:** .tech-logo
**Properties:**
  - transform: scale(1)→scale(1.15)
  - filter: grayscale(0.3)→grayscale(0) (color intensity)
**Duration:** 200ms
**Easing:** ease-out
**Reduced Motion:** Filter change only

### 8.4 Security Badge Checkmark Animation

#### Checkmark Draw Effect
**Trigger:** After security items visible
**Target:** CheckCircle icons next to security features
**Properties:**
  - SVG path stroke-dashoffset: 100→0 (draw checkmark)
  - opacity: 0→1
**Duration:** 400ms
**Easing:** ease-in-out
**Delay:** Stagger by 80ms per checkmark
**Reduced Motion:** Instant appearance

```css
@keyframes drawCheck {
  from {
    stroke-dashoffset: 100;
    opacity: 0;
  }
  to {
    stroke-dashoffset: 0;
    opacity: 1;
  }
}

.security-check-icon path {
  stroke-dasharray: 100;
  animation: drawCheck 400ms ease-in-out both;
}

.security-item:nth-child(1) .security-check-icon path { animation-delay: 0ms; }
.security-item:nth-child(2) .security-check-icon path { animation-delay: 80ms; }
.security-item:nth-child(3) .security-check-icon path { animation-delay: 160ms; }
/* etc... */
```

### 8.5 Architecture Diagram Interaction

#### Diagram Hover Highlight
**Trigger:** Mouse enter on diagram element (if interactive)
**Target:** Individual nodes in architecture diagram
**Properties:**
  - fill: original→primary color
  - stroke-width: 2px→4px
  - Connected arrows pulse
**Duration:** 250ms
**Easing:** ease-out
**Note:** Optional interactive diagram feature
**Reduced Motion:** Color change only

---

## 9. Video Product Demo

### 9.1 Section Entrance

#### Video Player Reveal
**Trigger:** Intersection Observer (threshold: 0.3)
**Target:** Video player container
**Properties:**
  - opacity: 0→1
  - transform: scale(0.95)→scale(1)
  - box-shadow: 0 10px 20px rgba(0,0,0,0.1) → 0 30px 60px rgba(0,0,0,0.2)
**Duration:** 700ms
**Easing:** cubic-bezier(0.4, 0, 0.2, 1)
**Delay:** 150ms
**Reduced Motion:** Fade only

### 9.2 Play Button Interaction

#### Poster Overlay Hover
**Trigger:** Mouse enter on video poster (before playback)
**Target:** Play button icon overlay
**Properties:**
  - transform: scale(1)→scale(1.2)
  - background: rgba(0,0,0,0.6)→rgba(0,0,0,0.8)
  - Play icon: opacity 0.8→1
**Duration:** 250ms
**Easing:** ease-out

#### Play Button Click
**Trigger:** Click play button
**Target:** Poster overlay
**Properties:**
  - opacity: 1→0 (fade out poster)
  - Begin video playback
**Duration:** 300ms
**Easing:** ease-out

### 9.3 Video Controls Hover

#### Control Bar Reveal
**Trigger:** Mouse move over video (during playback)
**Target:** .video-controls
**Properties:**
  - opacity: 0→1
  - transform: translateY(10px)→translateY(0)
**Duration:** 200ms
**Easing:** ease-out
**Auto-hide:** After 2s of no mouse movement

#### Scrubber Hover
**Trigger:** Mouse enter on progress bar
**Target:** .video-scrubber
**Properties:**
  - height: 4px→8px (thicker for easier grab)
  - background: Brighter shade
**Duration:** 150ms
**Easing:** ease-out

### 9.4 Fullscreen Button Interaction

#### Fullscreen Toggle Hover
**Trigger:** Mouse enter on fullscreen button
**Target:** .fullscreen-button
**Properties:**
  - transform: scale(1.1)
  - background: rgba(255,255,255,0.1)→rgba(255,255,255,0.2)
**Duration:** 150ms
**Easing:** ease-out

### 9.5 Loading State

#### Spinner Animation
**Trigger:** Video buffering
**Target:** .video-loading-spinner
**Properties:**
  - transform: rotate(0deg)→rotate(360deg)
**Duration:** 1000ms
**Easing:** linear
**Iterations:** Infinite
**Reduced Motion:** Pulsing circle instead of rotation

```css
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.video-loading-spinner {
  animation: spin 1000ms linear infinite;
}

@media (prefers-reduced-motion: reduce) {
  .video-loading-spinner {
    animation: pulse 1500ms ease-in-out infinite;
  }
}

@keyframes pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}
```

---

## 10. Social Proof Section

### 10.1 Testimonial Card Reveal

#### Staggered Card Entrance
**Trigger:** Intersection Observer (threshold: 0.2)
**Target:** Testimonial cards (3 cards)
**Properties:**
  - opacity: 0→1
  - transform: translateY(30px)→translateY(0)
  - Individual scale: scale(0.9)→scale(1)
**Duration:** 500ms
**Easing:** cubic-bezier(0.4, 0, 0.2, 1)
**Delay:** Stagger by 120ms per card
  - Card 1: 0ms
  - Card 2: 120ms
  - Card 3: 240ms
**Reduced Motion:** Fade only

### 10.2 Card Hover Effect

#### Testimonial Card Lift
**Trigger:** Mouse enter (desktop)
**Target:** .testimonial-card
**Properties:**
  - transform: translateY(0)→translateY(-6px)
  - box-shadow: Increase elevation
  - border-color: muted→primary (subtle accent)
**Duration:** 250ms
**Easing:** ease-out
**Reduced Motion:** Border color only

### 10.3 Avatar Interaction

#### Avatar Hover Glow
**Trigger:** Mouse enter on testimonial card
**Target:** .testimonial-avatar (circular image)
**Properties:**
  - box-shadow: 0 0 0 3px rgba(primary, 0.3) (glow ring)
  - transform: scale(1.05)
**Duration:** 250ms
**Easing:** ease-out
**Reduced Motion:** Glow only, no scale

### 10.4 Star Rating Animation

#### Star Fill Sequence
**Trigger:** Card becomes visible (Intersection Observer)
**Target:** Star icons (5 stars)
**Properties:**
  - fill: transparent→yellow/primary
  - transform: scale(0)→scale(1.2)→scale(1) (pop effect)
**Duration:** 300ms
**Easing:** cubic-bezier(0.68, -0.55, 0.265, 1.55)
**Delay:** Stagger by 50ms per star
  - Star 1: 400ms
  - Star 2: 450ms
  - Star 3: 500ms
  - Star 4: 550ms
  - Star 5: 600ms
**Reduced Motion:** Instant fill, no scale

```css
@keyframes starPop {
  0% {
    transform: scale(0);
    fill: transparent;
  }
  70% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    fill: var(--star-color);
  }
}

.star:nth-child(1) { animation: starPop 300ms cubic-bezier(0.68, -0.55, 0.265, 1.55) 400ms both; }
.star:nth-child(2) { animation: starPop 300ms cubic-bezier(0.68, -0.55, 0.265, 1.55) 450ms both; }
.star:nth-child(3) { animation: starPop 300ms cubic-bezier(0.68, -0.55, 0.265, 1.55) 500ms both; }
.star:nth-child(4) { animation: starPop 300ms cubic-bezier(0.68, -0.55, 0.265, 1.55) 550ms both; }
.star:nth-child(5) { animation: starPop 300ms cubic-bezier(0.68, -0.55, 0.265, 1.55) 600ms both; }
```

### 10.5 Carousel Controls (Mobile)

#### Swipe Gesture
**Trigger:** Touch drag (mobile)
**Target:** .testimonial-carousel
**Properties:**
  - transform: translateX based on drag distance
  - Snap to nearest card on release
**Duration:** 300ms (snap animation)
**Easing:** cubic-bezier(0.4, 0, 0.2, 1)
**Behavior:** Momentum scrolling with elastic bounds

#### Dot Indicator Interaction
**Trigger:** Carousel slide change
**Target:** .carousel-dot
**Properties:**
  - Active dot: scale(1)→scale(1.4), background muted→primary
  - Inactive dots: scale(1.4)→scale(1)
**Duration:** 250ms
**Easing:** ease-out

---

## 11. FAQ Section

### 11.1 Section Reveal

#### Accordion Container Entrance
**Trigger:** Intersection Observer (threshold: 0.2)
**Target:** .faq-container
**Properties:**
  - opacity: 0→1
  - transform: translateY(20px)→translateY(0)
**Duration:** 500ms
**Easing:** ease-out
**Delay:** 100ms
**Reduced Motion:** Fade only

### 11.2 Accordion Item Interaction

#### Question Hover State
**Trigger:** Mouse enter on FAQ question row
**Target:** .faq-question
**Properties:**
  - background: transparent→rgba(primary, 0.05)
  - Chevron icon: color muted→primary
**Duration:** 150ms
**Easing:** ease-out

```css
.faq-question {
  transition: background 150ms ease-out;
}

.faq-question:hover {
  background: rgba(var(--primary-rgb), 0.05);
}

.faq-question:hover .faq-chevron {
  color: var(--primary);
}
```

#### Question Click/Expand
**Trigger:** Click question row
**Target:** Answer panel (.faq-answer)
**Properties:**
  - max-height: 0→auto (calculated height)
  - opacity: 0→1
  - padding: 0→normal
  - Chevron icon: transform rotate(0deg)→rotate(180deg)
**Duration:** 300ms
**Easing:** cubic-bezier(0.4, 0, 0.2, 1)
**Behavior:** Close other open items OR allow multiple open (choose one)
**Reduced Motion:** Instant expand/collapse (0ms transition)

```css
.faq-answer {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  padding: 0 1rem;
  transition: max-height 300ms cubic-bezier(0.4, 0, 0.2, 1),
              opacity 300ms ease-out,
              padding 300ms ease-out;
}

.faq-answer.open {
  max-height: 500px; /* or use JS to calculate actual height */
  opacity: 1;
  padding: 1rem;
}

.faq-chevron {
  transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.faq-question.open .faq-chevron {
  transform: rotate(180deg);
}

@media (prefers-reduced-motion: reduce) {
  .faq-answer,
  .faq-chevron {
    transition-duration: 0.01ms;
  }
}
```

### 11.3 Answer Content Reveal

#### Text Fade-In
**Trigger:** After accordion opens
**Target:** Answer text content
**Properties:**
  - opacity: 0→1
  - transform: translateY(-10px)→translateY(0)
**Duration:** 250ms
**Easing:** ease-out
**Delay:** 50ms (after accordion expansion starts)
**Reduced Motion:** Opacity only

### 11.4 Focus State (Keyboard Navigation)

#### Keyboard Focus Indicator
**Trigger:** Tab focus on FAQ question
**Target:** .faq-question
**Properties:**
  - outline: 3px solid primary
  - outline-offset: 2px
  - background: rgba(primary, 0.08)
**Duration:** 150ms
**Easing:** ease-out
**Note:** High contrast for visibility

#### Enter Key Activation
**Trigger:** Enter/Space key press
**Action:** Trigger same expand/collapse as click
**Visual Feedback:** Brief scale pulse on question
**Properties:**
  - transform: scale(1)→scale(0.98)→scale(1)
**Duration:** 200ms
**Easing:** ease-out

---

## 12. Final CTA

### 12.1 Section Entrance

#### Dramatic Background Reveal
**Trigger:** Intersection Observer (threshold: 0.3)
**Target:** .final-cta-section (entire section)
**Properties:**
  - opacity: 0→1
  - transform: scale(0.95)→scale(1)
  - Background gradient: Animate gradient position shift
**Duration:** 800ms
**Easing:** cubic-bezier(0.4, 0, 0.2, 1)
**Delay:** 0ms
**Reduced Motion:** Fade only

### 12.2 Headline Animation

#### Title Cascade
**Trigger:** After section visible
**Target:** Headline, value prop text, CTA button (staggered)
**Properties:**
  - opacity: 0→1
  - transform: translateY(20px)→translateY(0)
**Duration:** 500ms
**Easing:** ease-out
**Delay:**
  - Headline: 200ms
  - Value prop: 350ms
  - CTA button: 500ms
**Reduced Motion:** Fade only

### 12.3 CTA Button Interaction

#### Magnetic Hover Effect (Advanced)
**Trigger:** Mouse move near button (within 50px radius)
**Target:** .final-cta-button
**Properties:**
  - transform: translate based on cursor position (subtle magnetic pull)
  - scale: 1→1.05
**Duration:** 150ms
**Easing:** ease-out
**Note:** Optional advanced interaction
**Reduced Motion:** Skip magnetic effect, use standard hover

#### Standard Hover State
**Trigger:** Mouse enter
**Target:** .final-cta-button
**Properties:**
  - transform: scale(1.08)
  - box-shadow: 0 10px 30px rgba(primary, 0.4) (glow)
  - background: Gradient shift or brightness increase
**Duration:** 250ms
**Easing:** cubic-bezier(0.68, -0.55, 0.265, 1.55)
**Reduced Motion:** Shadow only

```css
.final-cta-button {
  transition: transform 250ms cubic-bezier(0.68, -0.55, 0.265, 1.55),
              box-shadow 250ms ease-out,
              filter 250ms ease-out;
}

.final-cta-button:hover {
  transform: scale(1.08);
  box-shadow: 0 10px 30px rgba(var(--primary-rgb), 0.4);
  filter: brightness(1.1);
}

@media (prefers-reduced-motion: reduce) {
  .final-cta-button:hover {
    transform: none;
  }
}
```

#### Click Animation
**Trigger:** Mouse down
**Target:** .final-cta-button
**Properties:**
  - transform: scale(0.95)
  - Ripple effect radiating from click point
**Duration:** 150ms
**Easing:** ease-out

#### Ripple Effect on Click
**Trigger:** Click
**Target:** Pseudo-element ::after on button
**Properties:**
  - transform: scale(0)→scale(4)
  - opacity: 0.6→0
**Duration:** 600ms
**Easing:** ease-out
**Reduced Motion:** Skip ripple

```css
.final-cta-button {
  position: relative;
  overflow: hidden;
}

.final-cta-button::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  opacity: 0;
}

.final-cta-button:active::after {
  animation: ripple 600ms ease-out;
}

@keyframes ripple {
  from {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0.6;
  }
  to {
    transform: translate(-50%, -50%) scale(4);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .final-cta-button::after {
    display: none;
  }
}
```

### 12.4 Background Gradient Animation

#### Continuous Gradient Shift
**Trigger:** Auto-start when section visible
**Target:** .final-cta-background
**Properties:**
  - background-position: 0% 50% → 100% 50% → 0% 50%
**Duration:** 10000ms (10 seconds)
**Easing:** ease-in-out
**Iterations:** Infinite
**Reduced Motion:** Static gradient (no animation)

```css
.final-cta-background {
  background: linear-gradient(135deg, var(--primary), var(--purple), var(--primary));
  background-size: 200% 200%;
  animation: gradientShift 10000ms ease-in-out infinite;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

@media (prefers-reduced-motion: reduce) {
  .final-cta-background {
    animation: none;
    background-position: 0% 50%;
  }
}
```

### 12.5 Supporting Element Animations

#### Trust Badge Float
**Trigger:** Continuous after section visible
**Target:** "No credit card" badge below CTA
**Properties:**
  - transform: translateY(0)→translateY(-3px)→translateY(0)
**Duration:** 2000ms
**Easing:** ease-in-out
**Iterations:** Infinite
**Reduced Motion:** Static position

#### GitHub/Gmail Logo Pulse
**Trigger:** On section reveal (one-time)
**Target:** Small logo badges at bottom
**Properties:**
  - opacity: 0→1
  - transform: scale(0.8)→scale(1.1)→scale(1)
**Duration:** 500ms
**Easing:** cubic-bezier(0.68, -0.55, 0.265, 1.55)
**Delay:** 600ms
**Reduced Motion:** Fade only

---

## 13. Global Interactions

### 13.1 Smooth Scroll Behavior

#### Anchor Link Clicks
**Trigger:** Click on any anchor link (#section-id)
**Target:** Window scroll position
**Properties:**
  - Smooth scroll to target section
**Duration:** 800ms
**Easing:** cubic-bezier(0.4, 0, 0.2, 1)
**Implementation:**
```css
html {
  scroll-behavior: smooth;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}
```

### 13.2 Scroll Progress Indicator (Optional)

#### Progress Bar Fill
**Trigger:** Window scroll
**Target:** .scroll-progress-bar (thin bar at top of page)
**Properties:**
  - width: 0%→100% based on scroll position
**Duration:** Instant (no transition, follows scroll)
**Appearance:** 2-3px height, primary color, fixed at top
**Reduced Motion:** Show progress bar, update instantly (no smooth fill)

```css
.scroll-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: var(--primary);
  z-index: 9999;
  transform-origin: left;
  transition: transform 0.1s ease-out;
}

@media (prefers-reduced-motion: reduce) {
  .scroll-progress-bar {
    transition: none;
  }
}
```

### 13.3 Back to Top Button

#### Button Appearance
**Trigger:** Scroll past 50% of page
**Target:** .back-to-top-button
**Properties:**
  - opacity: 0→1
  - transform: translateY(20px)→translateY(0)
  - scale: 0.8→1
**Duration:** 300ms
**Easing:** ease-out
**Position:** Fixed bottom-right corner
**Reduced Motion:** Fade only

#### Button Hover
**Trigger:** Mouse enter
**Target:** .back-to-top-button
**Properties:**
  - transform: translateY(0)→translateY(-5px)
  - box-shadow: Increase elevation
  - background: Lighten
**Duration:** 200ms
**Easing:** ease-out
**Reduced Motion:** Shadow only

#### Button Click
**Trigger:** Click
**Target:** Window scroll position
**Action:** Smooth scroll to top
**Duration:** 1000ms
**Easing:** cubic-bezier(0.4, 0, 0.2, 1)

### 13.4 Navigation Bar (If Present)

#### Sticky Header Behavior
**Trigger:** Scroll past hero section
**Target:** .main-navigation
**Properties:**
  - position: static→fixed (or use CSS sticky)
  - background: transparent→solid with blur
  - box-shadow: none→subtle shadow
  - transform: translateY(-100%)→translateY(0)
**Duration:** 300ms
**Easing:** ease-out
**Reduced Motion:** Instant position change

#### Nav Link Hover
**Trigger:** Mouse enter on nav link
**Target:** .nav-link
**Properties:**
  - color: muted→primary
  - border-bottom: 0px→2px (underline effect)
  - transform: translateY(0)→translateY(-2px)
**Duration:** 150ms
**Easing:** ease-out
**Reduced Motion:** Color change only

### 13.5 Loading States (General)

#### Skeleton Screens
**Trigger:** Content loading (images, videos)
**Target:** .skeleton-loader
**Properties:**
  - background: Animated gradient shimmer
  - background-position: -200%→200%
**Duration:** 1500ms
**Easing:** ease-in-out
**Iterations:** Infinite until content loads
**Reduced Motion:** Static gray background, no shimmer

```css
@keyframes shimmer {
  from { background-position: -200% center; }
  to { background-position: 200% center; }
}

.skeleton-loader {
  background: linear-gradient(
    90deg,
    var(--muted) 0%,
    var(--muted-lighter) 50%,
    var(--muted) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1500ms ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .skeleton-loader {
    background: var(--muted);
    animation: none;
  }
}
```

#### Spinner Animation
**Trigger:** Loading state (form submit, data fetch)
**Target:** .loading-spinner
**Properties:**
  - transform: rotate(0deg)→rotate(360deg)
**Duration:** 1000ms
**Easing:** linear
**Iterations:** Infinite
**Reduced Motion:** Pulsing dots instead of rotation

---

## 14. Scroll-Based Choreography

### 14.1 Intersection Observer Configuration

**General Settings:**
```javascript
const observerOptions = {
  root: null, // viewport
  rootMargin: '0px 0px -20% 0px', // Trigger when 20% visible
  threshold: [0, 0.1, 0.2, 0.3, 0.5]
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      // Optional: Unobserve after first animation
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all sections
document.querySelectorAll('[data-animate]').forEach(el => {
  observer.observe(el);
});
```

### 14.2 Section-Specific Waypoints

**Section Trigger Thresholds:**
- Hero: No trigger (auto-load)
- Trust Bar: 0.2 (20% visible)
- How It Works: 0.3 (30% visible for timeline animation start)
- Interactive Demo: 0.25 (25% visible)
- Features: 0.15 (15% visible for staggered cards)
- Use Cases: 0.2 (20% visible)
- Tech/Security: 0.25 (25% visible)
- Video Demo: 0.3 (30% visible before auto-reveal)
- Social Proof: 0.2 (20% visible)
- FAQ: 0.2 (20% visible)
- Final CTA: 0.3 (30% visible for dramatic entrance)

### 14.3 Parallax Effects (Subtle Only)

#### Hero Background Parallax
**Trigger:** Scroll movement within hero section
**Target:** .hero-background-video or image
**Properties:**
  - transform: translateY(0) → translateY(scrollY * 0.3) (slower than scroll)
**Behavior:** Creates depth effect
**Performance:** Use CSS transform (GPU-accelerated)
**Reduced Motion:** No parallax (static background)

```javascript
// Parallax scroll effect (optional)
window.addEventListener('scroll', () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const scrolled = window.scrollY;
  const heroBackground = document.querySelector('.hero-background');
  if (heroBackground && scrolled < window.innerHeight) {
    heroBackground.style.transform = `translateY(${scrolled * 0.3}px)`;
  }
});
```

**Note:** Use sparingly, only on hero section. Avoid parallax on all sections (performance, motion sickness risk).

### 14.4 Progressive Content Reveal

#### Layered Animation Strategy
**Approach:** Reveal content in logical reading order
**Benefits:**
- Guides user attention
- Creates sense of discovery
- Reduces cognitive overload

**Order:**
1. Section headline (first)
2. Section description (second)
3. Primary content (third - cards/images/etc.)
4. Supporting elements (last - badges, icons, etc.)

**Timing:**
- Headline: 0ms delay
- Description: 100-150ms delay
- Primary content: 200-300ms delay (staggered if multiple items)
- Supporting: 400-500ms delay

### 14.5 Exit Animations (Optional)

**Note:** Generally avoid exit animations (can feel jarring). Only use if enhancing story or transition.

**Potential Use Case:** Section transitions with page direction indicators
**Example:** When scrolling past section, fade opacity to 0.8 (de-emphasize past content)
**Implementation:** Reverse Intersection Observer (trigger on exit)
**Reduced Motion:** Skip entirely

---

## 15. Delight Moments Catalog

### 15.1 Easter Eggs (Subtle, Discoverable)

#### Konami Code Trigger
**Trigger:** Up, Up, Down, Down, Left, Right, Left, Right, B, A, Enter
**Action:** Confetti burst + Special message "Time traveler detected! 🎉"
**Visual:** Brief confetti animation (2s)
**Sound:** None (silent delight)
**Reset:** After 5 seconds
**Note:** Hidden, not documented. For power users/developers to discover

```javascript
// Konami code listener (example)
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
                    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === konamiCode[konamiIndex].toLowerCase()) {
    konamiIndex++;
    if (konamiIndex === konamiCode.length) {
      triggerConfetti();
      showSecretMessage();
      konamiIndex = 0;
    }
  } else {
    konamiIndex = 0;
  }
});
```

#### Double-Click Logo
**Trigger:** Double-click on product logo
**Action:** Logo spins 360deg + color shift
**Visual:** transform: rotate(360deg), hue-rotate(180deg)
**Duration:** 800ms
**Easing:** cubic-bezier(0.68, -0.55, 0.265, 1.55)
**Note:** Playful, not disruptive

#### Hover Timeline Nodes Rapidly
**Trigger:** Hover over all 3 timeline nodes within 1 second
**Action:** All nodes pulse simultaneously + brief sparkle effect
**Visual:** Coordinated pulse animation
**Duration:** 600ms
**Note:** Rewards exploration

### 15.2 Micro-Celebrations

#### Form Submission Success (Future Feature)
**Trigger:** Successful capsule creation
**Action:**
  - Success checkmark draw animation
  - Confetti burst (brief, tasteful)
  - Success message with emoji
**Duration:** 2000ms total celebration
**Note:** Reward user achievement
**Reduced Motion:** Checkmark only, skip confetti

#### Scroll Milestone Achievements
**Trigger:** User scrolls past 25%, 50%, 75%, 100% of page
**Action:** Subtle badge notification (bottom-right)
  - "Explorer" at 25%
  - "Curious" at 50%
  - "Committed" at 75%
  - "Time Traveler" at 100%
**Visual:** Badge slide-in, 3s display, fade out
**Note:** Optional, gamification element. May be too gimmicky - use sparingly
**Reduced Motion:** Skip entirely

### 15.3 Contextual Surprises

#### Time-Based Greeting
**Trigger:** Page load, check user's local time
**Action:** Update hero subheading based on time
  - Morning: "Good morning, time traveler!"
  - Afternoon: "Good afternoon! Ready to send to the future?"
  - Evening: "Good evening! Create your tomorrow, today."
  - Late night: "Burning the midnight oil? Send your future self a reminder!"
**Note:** Personal touch without being creepy

#### Birthday Confetti (If User Has Account)
**Trigger:** User visits on their birthday (from account data)
**Action:** Birthday cake icon pulses, brief confetti
**Message:** "Happy Birthday! Want to send a message to next year?"
**Note:** Delightful personalization, requires auth

#### Long-Press Interactions (Mobile)
**Trigger:** Long-press on feature card icon
**Action:** Icon wiggles + reveals tooltip with extra detail
**Duration:** Hold for 500ms to trigger
**Visual:** Icon wiggle animation + tooltip fade-in
**Note:** Hidden information for curious users

### 15.4 Cursor Interactions (Desktop Only)

#### Custom Cursor on Interactive Demo
**Trigger:** Mouse enter interactive demo area
**Action:** Cursor changes to custom "time" cursor (clock icon)
**Visual:** CSS custom cursor or JavaScript-based cursor
**Reduced Motion:** Standard cursor

```css
.interactive-demo {
  cursor: url('/images/cursor-clock.png') 16 16, auto;
}

@media (prefers-reduced-motion: reduce) {
  .interactive-demo {
    cursor: pointer;
  }
}
```

#### Cursor Trail Effect (Optional, Experimental)
**Trigger:** Mouse move on hero section
**Action:** Faint particle trail follows cursor (time particles)
**Visual:** Small dots that fade after 500ms
**Performance:** Use canvas or CSS (throttled to 60fps)
**Reduced Motion:** Disable entirely
**Note:** Experimental, may be too distracting. Test with users.

### 15.5 Loading Delights

#### Humorous Loading Messages
**Trigger:** Any loading state
**Action:** Rotate through witty messages
**Examples:**
  - "Bending spacetime..."
  - "Consulting with future you..."
  - "Winding the clock..."
  - "Encrypting your secrets..."
  - "Negotiating with GitHub..."
**Visual:** Text rotates every 2s during load
**Tone:** Light, not annoying

---

## 16. Mobile-Specific Interactions

### 16.1 Touch Gestures

#### Swipe FAQ (Alternative to Click)
**Trigger:** Swipe right on FAQ question (mobile)
**Action:** Expand accordion (same as click)
**Visual:** Question slides right slightly, then expands
**Implementation:** Touch event listeners (touchstart, touchmove, touchend)
**Fallback:** Standard tap interaction

#### Pull-to-Refresh (Optional)
**Trigger:** Pull down at top of page
**Action:** Refresh page content (or fun animation)
**Visual:** Animated icon at top (clock spinning)
**Note:** Browser native behavior on mobile, custom may be redundant
**Decision:** Skip unless adding value

#### Swipe Use Case Cards
**Trigger:** Swipe left/right on use case cards (mobile)
**Action:** Navigate between cards in carousel
**Visual:** Card slides off-screen, next card slides in
**Momentum:** Momentum scrolling with snap-to-card
**Indicators:** Dot navigation at bottom

```javascript
// Swipe detection example
let touchStartX = 0;
let touchEndX = 0;

element.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
});

element.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  if (touchEndX < touchStartX - 50) {
    // Swipe left - next card
    navigateToNextCard();
  }
  if (touchEndX > touchStartX + 50) {
    // Swipe right - previous card
    navigateToPreviousCard();
  }
}
```

### 16.2 Tap Target Optimization

#### Minimum Size Enforcement
**Standard:** All interactive elements minimum 44x44px
**Implementation:**
```css
.interactive-element {
  min-width: 44px;
  min-height: 44px;
  padding: 12px; /* Ensure inner content doesn't shrink target */
}

/* For small icons, increase padding */
.icon-button {
  padding: 16px;
  /* Icon itself can be 20px, but tap area is 52px total */
}
```

#### Spacing Between Targets
**Standard:** Minimum 8px gap between adjacent tap targets
**Reason:** Prevent accidental taps
**Example:** FAQ accordion items have 8px margin

### 16.3 Touch Feedback

#### Tap Highlight Color
**Trigger:** Touch start on any tappable element
**Visual:** Brief highlight (system default or custom)
**Duration:** While finger pressed
**Color:** rgba(primary, 0.1) or system default

```css
* {
  -webkit-tap-highlight-color: rgba(var(--primary-rgb), 0.1);
}

/* Or disable and use custom feedback */
* {
  -webkit-tap-highlight-color: transparent;
}

.custom-tap-feedback:active {
  background: rgba(var(--primary-rgb), 0.1);
}
```

#### Button Press State (Mobile)
**Trigger:** Touch start
**Target:** Buttons, cards
**Properties:**
  - transform: scale(0.95) (subtle press down)
  - background: Slightly darker
**Duration:** Instant (0ms)
**Release:** Return to normal on touch end
**Reduced Motion:** Background color only

### 16.4 Scroll Momentum

#### Natural Momentum Scrolling
**Trigger:** Flick scroll gesture
**Behavior:** Native iOS/Android momentum
**Implementation:**
```css
.scrollable-container {
  -webkit-overflow-scrolling: touch; /* iOS smooth scroll */
  overscroll-behavior: contain; /* Prevent chain scrolling */
}
```

#### Scroll Snap (Carousels)
**Trigger:** Scroll in carousel container
**Behavior:** Snap to nearest card on scroll end
**Implementation:**
```css
.carousel-container {
  scroll-snap-type: x mandatory;
  overflow-x: scroll;
  -webkit-overflow-scrolling: touch;
}

.carousel-item {
  scroll-snap-align: center;
  scroll-snap-stop: always;
}
```

### 16.5 Haptic Feedback (iOS Only)

**Note:** Experimental, requires Taptic Engine API (limited browser support)

#### Button Press Haptic
**Trigger:** Tap CTA button
**Action:** Light haptic pulse (if supported)
**Implementation:**
```javascript
// Haptic feedback (iOS Safari only)
if (window.navigator && window.navigator.vibrate) {
  navigator.vibrate(10); // 10ms vibration
}

// Or use Taptic Engine API (experimental)
if (window.TapticEngine) {
  TapticEngine.impact({ style: 'light' });
}
```

**Use Cases:**
- Primary CTA button tap (light impact)
- Success actions (medium impact)
- Error states (heavy impact)

**Caution:** Don't overuse. Only on significant interactions.

### 16.6 Mobile Video Considerations

#### Autoplay Restrictions
**Behavior:** Mobile browsers block autoplay with audio
**Solution:** Hero video is muted (already specified)
**Fallback:** Poster image if autoplay fails

#### Fullscreen Trigger
**Trigger:** Tap video (not just play button)
**Action:** Enter fullscreen mode (native behavior)
**Note:** Mobile browsers force fullscreen for video, embrace it

#### Playback Controls
**Size:** Larger touch targets for mobile
**Minimum:** 48x48px for play/pause, scrubber handle
**Spacing:** 12px between controls

---

## 17. Accessibility Accommodations

### 17.1 Reduced Motion Support

**Global Disable Rule:**
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**Section-Specific Alternatives:**

**Hero:**
- Normal: Fade-in + slide up (600ms)
- Reduced: Fade-in only (100ms)
- Video: Static poster image

**Timeline:**
- Normal: Line drawing animation (1500ms)
- Reduced: Instant appearance (all nodes visible)

**Feature Cards:**
- Normal: Staggered reveal with scale (500ms)
- Reduced: Instant fade (100ms)

**FAQ Accordion:**
- Normal: Smooth height transition (300ms)
- Reduced: Instant expand/collapse

**All Hover Effects:**
- Normal: Transform + shadow + color
- Reduced: Color change only

**Continuous Animations:**
- Normal: Infinite loops (pulse, float, gradient shift)
- Reduced: Static state (no animation)

### 17.2 Keyboard Navigation

#### Focus Visible Styling
**All Interactive Elements:**
```css
*:focus-visible {
  outline: 3px solid var(--primary);
  outline-offset: 4px;
  box-shadow: 0 0 0 4px rgba(var(--primary-rgb), 0.2);
}

/* Remove default outline */
*:focus:not(:focus-visible) {
  outline: none;
}
```

#### Tab Order Optimization
**Order:**
1. Skip to main content link (first tab stop)
2. Navigation links (if nav present)
3. Hero CTA
4. Trust indicators (if clickable)
5. How It Works content
6. Interactive demo tabs
7. Feature cards (if clickable)
8. Use case CTAs
9. Video controls
10. FAQ questions
11. Final CTA
12. Footer links

**Implementation:**
```html
<a href="#main-content" class="skip-link">Skip to main content</a>
```

```css
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--primary);
  color: white;
  padding: 8px 16px;
  z-index: 10000;
  transition: top 0.2s ease-out;
}

.skip-link:focus {
  top: 0;
}
```

#### Keyboard Shortcuts
**Space:** Pause/play video demo (when focused)
**Enter/Space:** Expand/collapse FAQ (when question focused)
**Arrow Keys:** Navigate carousel (when carousel focused)
**Escape:** Close modals (if any)
**Tab:** Navigate forward
**Shift+Tab:** Navigate backward

### 17.3 Screen Reader Support

#### ARIA Labels

**Decorative Icons:**
```html
<svg aria-hidden="true" focusable="false">
  <!-- icon content -->
</svg>
```

**Functional Icons:**
```html
<button aria-label="Expand FAQ answer">
  <ChevronDownIcon aria-hidden="true" />
</button>
```

**Loading States:**
```html
<div role="status" aria-live="polite" aria-label="Loading content">
  <LoadingSpinner aria-hidden="true" />
</div>
```

**Progress Indicators:**
```html
<div role="progressbar" aria-valuenow="2" aria-valuemin="1" aria-valuemax="3" aria-label="Step 2 of 3">
  <!-- Interactive demo progress -->
</div>
```

#### Heading Hierarchy
```html
<h1>Send Messages to the Future</h1> <!-- Hero headline -->
  <h2>How It Works</h2> <!-- Section title -->
    <h3>Connect Your Accounts</h3> <!-- Step title -->
  <h2>Features</h2> <!-- Section title -->
    <h3>Rich Media Support</h3> <!-- Feature title -->
  <h2>Frequently Asked Questions</h2>
    <h3>Is it really free?</h3> <!-- Question as heading -->
```

**Rule:** Never skip heading levels (h1→h2→h3, not h1→h3)

#### Dynamic Content Announcements
```html
<!-- FAQ answer reveal -->
<div aria-live="polite">
  <!-- Answer content inserted here announces to screen reader -->
</div>

<!-- Form success message -->
<div role="alert" aria-live="assertive">
  Time capsule created successfully!
</div>
```

**aria-live values:**
- `off`: Don't announce (default)
- `polite`: Announce when user is idle
- `assertive`: Announce immediately (use sparingly, for errors/critical info)

### 17.4 Color Contrast

**Minimum Ratios (WCAG AA):**
- Normal text (under 18pt): 4.5:1
- Large text (18pt+ or 14pt+ bold): 3:1
- Interactive elements: 3:1 against adjacent colors
- Focus indicators: 3:1 against background

**Testing Tools:**
- Chrome DevTools: Inspect element → Accessibility panel
- WebAIM Contrast Checker
- Stark plugin for Figma

**Problem Areas to Watch:**
- Light text on gradient backgrounds
- Muted text on light cards
- Primary buttons (ensure white text on primary bg meets 4.5:1)
- Disabled states (must still be readable, 4.5:1)

### 17.5 Focus Management

#### Modal/Dialog Focus Trap (If Implemented)
**Behavior:**
1. When modal opens, focus moves to first interactive element
2. Tab cycles through modal elements only (trap focus)
3. Shift+Tab cycles backward within modal
4. Escape closes modal, returns focus to trigger element

```javascript
// Focus trap implementation
const modal = document.querySelector('.modal');
const focusableElements = modal.querySelectorAll(
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
);
const firstElement = focusableElements[0];
const lastElement = focusableElements[focusableElements.length - 1];

modal.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  }

  if (e.key === 'Escape') {
    closeModal();
    triggerElement.focus(); // Return focus to button that opened modal
  }
});
```

#### Scroll Position Focus
**Behavior:** When "Skip to main content" is clicked, focus moves to main content area
**Implementation:**
```javascript
skipLink.addEventListener('click', (e) => {
  e.preventDefault();
  const mainContent = document.querySelector('#main-content');
  mainContent.tabIndex = -1; // Make focusable
  mainContent.focus();
  mainContent.scrollIntoView({ behavior: 'smooth' });
});
```

### 17.6 Alternative Text Best Practices

**Images:**
```html
<!-- Good: Descriptive -->
<img src="use-case-birthday.jpg" alt="Family celebrating child's birthday with cake and candles">

<!-- Bad: Generic -->
<img src="use-case-birthday.jpg" alt="Birthday image">

<!-- Decorative: Empty alt -->
<img src="decorative-pattern.svg" alt="">
```

**Video:**
```html
<video>
  <source src="product-demo.mp4" type="video/mp4">
  <track kind="captions" src="product-demo-en.vtt" srclang="en" label="English" default>
  <p>Your browser doesn't support video. <a href="product-demo-transcript.html">Read the transcript</a></p>
</video>
```

**Icons:**
```html
<!-- Functional: Use aria-label on parent -->
<button aria-label="Close dialog">
  <XIcon aria-hidden="true" />
</button>

<!-- Decorative: Hide from screen readers -->
<div>
  <ShieldIcon aria-hidden="true" />
  <span>Secure Storage</span> <!-- Text label is read -->
</div>
```

---

## 18. Performance Optimization

### 18.1 Animation Performance

#### GPU-Accelerated Properties Only
**Allowed (performant):**
- `transform` (translateX, translateY, scale, rotate)
- `opacity`
- `filter` (use sparingly)

**Avoid (CPU-intensive, causes layout thrashing):**
- `width`, `height`
- `top`, `left`, `right`, `bottom`
- `margin`, `padding`
- `font-size`

**Example:**
```css
/* Good: GPU-accelerated */
.card {
  transform: translateY(0);
  transition: transform 250ms;
}
.card:hover {
  transform: translateY(-8px);
}

/* Bad: Triggers layout reflow */
.card {
  top: 0;
  transition: top 250ms;
}
.card:hover {
  top: -8px;
}
```

#### Will-Change Property Usage
**Use sparingly:** Only on elements that will definitely animate
**Add before animation:** Apply just before animation starts
**Remove after animation:** Clean up after animation completes

```css
/* Good: Temporary will-change */
.hero-cta:hover {
  will-change: transform;
}

.hero-cta {
  transition: transform 250ms;
}

/* Bad: Permanent will-change (wastes GPU memory) */
.feature-card {
  will-change: transform, opacity, box-shadow; /* Too many properties, always on */
}
```

**JavaScript approach:**
```javascript
element.addEventListener('mouseenter', () => {
  element.style.willChange = 'transform';
});

element.addEventListener('mouseleave', () => {
  element.style.willChange = 'auto'; // Clean up
});
```

### 18.2 Scroll Performance

#### Debouncing Scroll Listeners
**Problem:** Scroll events fire continuously (every pixel)
**Solution:** Debounce or throttle scroll handlers

```javascript
// Throttle scroll event (fire max once per 16ms = 60fps)
let ticking = false;

window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      handleScroll();
      ticking = false;
    });
    ticking = true;
  }
});

function handleScroll() {
  // Update scroll-based animations
  updateScrollProgress();
  updateParallax();
}
```

#### Passive Event Listeners
**Benefit:** Tells browser handler won't call `preventDefault()`, improves scroll performance

```javascript
// Good: Passive listener
window.addEventListener('scroll', handleScroll, { passive: true });

// Good: Touch event passive
element.addEventListener('touchstart', handleTouch, { passive: true });
```

### 18.3 Intersection Observer Optimization

#### Unobserve After Animation
**Strategy:** Once section animates in, stop observing (reduce overhead)

```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target); // Stop observing after first trigger
    }
  });
});
```

#### Lazy Load Images
**Strategy:** Don't load images until they're about to enter viewport

```html
<img
  data-src="use-case-image.jpg"
  alt="Use case description"
  loading="lazy"
  class="lazy-image"
>
```

```javascript
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.classList.add('loaded');
      imageObserver.unobserve(img);
    }
  });
});

document.querySelectorAll('.lazy-image').forEach(img => {
  imageObserver.observe(img);
});
```

### 18.4 Video Performance

#### Lazy Load Videos
**Strategy:** Don't load video until user scrolls near it

```javascript
const videoObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const video = entry.target;
    if (entry.isIntersecting) {
      if (video.dataset.src) {
        video.src = video.dataset.src;
        video.load();
      }
    } else {
      video.pause(); // Pause when scrolled away (battery optimization)
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('video[data-src]').forEach(video => {
  videoObserver.observe(video);
});
```

#### Compression Targets
- Hero background video: Under 5MB (aggressive compression, 20% opacity makes artifacts invisible)
- Product demo video: Under 10MB (balance quality and size)
- Format: MP4 (H.264) + WebM (VP9) for compatibility
- Resolution: 1920x1080 max (diminishing returns above)

### 18.5 Animation Frame Budget

**Target:** 60fps = 16.67ms per frame
**Budget per frame:**
- JavaScript execution: 3ms max
- Style calculations: 2ms max
- Layout: 2ms max
- Paint: 2ms max
- Composite: 2ms max
- Total: ~11ms (leaves 5ms buffer)

**Monitoring:**
```javascript
// Performance measurement
performance.mark('animation-start');

// ... animation code ...

performance.mark('animation-end');
performance.measure('animation-duration', 'animation-start', 'animation-end');

const measure = performance.getEntriesByName('animation-duration')[0];
console.log(`Animation took ${measure.duration}ms`);

if (measure.duration > 16.67) {
  console.warn('Animation exceeding 60fps budget');
}
```

**Chrome DevTools:**
- Performance tab → Record → Scroll/interact
- Check for layout thrashing (red bars)
- Check for long tasks (yellow bars)
- Aim for smooth green bars (compositing only)

### 18.6 CSS Containment

**Strategy:** Tell browser which elements are independent (optimization hint)

```css
/* Feature cards are independent, don't affect layout of siblings */
.feature-card {
  contain: layout style paint;
}

/* Testimonial cards contain their own layout */
.testimonial-card {
  contain: layout;
}

/* FAQ items contain their own style calculations */
.faq-item {
  contain: style;
}
```

**Benefits:**
- Faster layout calculations
- Reduced paint areas
- Better animation performance

**Caution:** Don't use `contain: size` unless absolutely certain (can break responsive layouts)

---

## Complete Interaction Choreography Timeline

### Page Load to First Interaction (0-2000ms)

**0-400ms: Hero Entrance**
- 0ms: Hero headline fade-in + slide up (600ms)
- 100ms: Hero subtitle fade-in + slide up (600ms)
- 200ms: Hero CTA fade-in + slide up (600ms)
- 400ms: Background video fade-in (800ms)

**800-1200ms: Supporting Elements**
- 800ms: Scroll indicator fade-in + begin bounce loop
- 800ms: GitHub/Gmail logos pulse in

**User scrolls (first interaction):**

**0-600ms: Trust Bar**
- Intersection trigger (20% visible)
- 0ms: Badge 1 fade-in + scale
- 100ms: Badge 2 fade-in + scale
- 200ms: Badge 3 fade-in + scale
- 300ms: Badge 4 fade-in + scale
- 600ms: "Free" badge double pulse (delight moment)

**User continues scrolling:**

**0-1900ms: How It Works Timeline**
- Intersection trigger (30% visible)
- 200ms: Timeline line drawing begins (1500ms)
- 400ms: Node 1 reveal with bounce (500ms)
- 500ms: Step 1 title fade-in
- 600ms: Step 1 description fade-in
- 700ms: Step 1 time badge fade-in
- 900ms: Node 2 reveal with bounce (500ms)
- 1000ms: Step 2 content cascade
- 1400ms: Node 3 reveal with bounce (500ms)
- 1500ms: Step 3 content cascade

**And so on through all sections...**

---

## Summary & Implementation Checklist

### Critical Interactions (Must Have - Phase 1)
- [ ] Hero CTA hover/active states
- [ ] Trust bar fade-in with stagger
- [ ] Timeline line drawing animation
- [ ] Feature card staggered reveal
- [ ] Feature card hover lift (desktop)
- [ ] FAQ accordion expand/collapse
- [ ] Final CTA button interactions
- [ ] All focus states for keyboard nav
- [ ] Reduced motion support (all animations)
- [ ] Lazy load images below fold

### Important Interactions (Should Have - Phase 2)
- [ ] Interactive demo tab transitions
- [ ] Use case card alternating entrance
- [ ] Image hover zoom effects
- [ ] Video player custom controls
- [ ] Testimonial star animation
- [ ] Scroll progress indicator
- [ ] Back to top button
- [ ] Mobile swipe gestures
- [ ] Intersection Observer for all sections

### Delightful Interactions (Nice to Have - Phase 3)
- [ ] Hero background video
- [ ] Magnetic CTA button hover
- [ ] Ripple effect on button clicks
- [ ] Confetti on milestone achievements
- [ ] Konami code easter egg
- [ ] Time-based greeting
- [ ] Parallax effects (subtle)
- [ ] Cursor trail (experimental)
- [ ] Haptic feedback (mobile)
- [ ] Loading message rotation

### Accessibility Requirements (Non-Negotiable)
- [ ] Keyboard navigation to all interactive elements
- [ ] Focus visible on all focusable elements
- [ ] ARIA labels on icons and dynamic content
- [ ] Proper heading hierarchy (h1→h2→h3)
- [ ] Alt text on all images
- [ ] Video captions (.vtt files)
- [ ] Color contrast 4.5:1 minimum
- [ ] Reduced motion alternatives for all animations
- [ ] Skip to main content link
- [ ] Screen reader testing

### Performance Requirements (Non-Negotiable)
- [ ] All animations use GPU-accelerated properties
- [ ] Scroll listeners debounced/throttled
- [ ] Intersection Observer for scroll triggers
- [ ] Videos lazy loaded
- [ ] Images lazy loaded below fold
- [ ] Will-change used sparingly and cleaned up
- [ ] 60fps target maintained
- [ ] No layout thrashing
- [ ] Total page weight under 2MB initial load

---

## File Paths for Implementation

**CSS Files:**
- C:\ai\memory-time-capsule\frontend\src\styles\animations.css (new file for @keyframes)
- C:\ai\memory-time-capsule\frontend\src\styles\interactions.css (new file for transitions/hovers)
- C:\ai\memory-time-capsule\frontend\src\App.tsx (import animations.css and interactions.css)

**JavaScript/React Files:**
- C:\ai\memory-time-capsule\frontend\src\hooks\useIntersectionObserver.ts (custom hook)
- C:\ai\memory-time-capsule\frontend\src\hooks\useScrollProgress.ts (custom hook)
- C:\ai\memory-time-capsule\frontend\src\hooks\useReducedMotion.ts (custom hook)
- C:\ai\memory-time-capsule\frontend\src\components\sections\* (individual section components)

**Media Assets:**
- C:\ai\memory-time-capsule\public\images\hero\hero-bg.mp4
- C:\ai\memory-time-capsule\public\videos\product-demo.mp4
- C:\ai\memory-time-capsule\public\images\use-cases\* (photos)

---

## Next Steps

1. **Design Agent (Phase 2):** Use these interaction specs to inform visual design decisions (colors for hover states, shadow depths, gradient directions)

2. **Development Agent (Phase 3):** Implement these interactions in order of priority (Critical → Important → Delightful)

3. **Testing:**
   - Test all interactions with keyboard only
   - Test with screen reader (NVDA or JAWS)
   - Test with prefers-reduced-motion enabled
   - Test on low-end mobile device
   - Measure performance with Chrome DevTools

4. **Iteration:** Gather user feedback, adjust timing/easing based on feel

---

**Document Status:** Complete
**Last Updated:** 2025-11-17
**Total Interactions Specified:** 80+
**Ready for:** Phase 2 (Design) and Phase 3 (Development)
