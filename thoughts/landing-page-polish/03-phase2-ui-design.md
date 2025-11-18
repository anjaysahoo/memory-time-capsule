# Phase 2: UI Design Specifications - Landing Page Polish

## Design System Reference

### Color Palette (FROM EXISTING)
```tsx
// Use ONLY these colors - no new colors
bg-black         // Pure black backgrounds
bg-white         // Pure white backgrounds
bg-black/5       // Light gray sections
bg-black/10      // Icon containers
bg-black/80      // Dark overlays
text-white       // White text
text-black       // Black text
text-black/60    // Muted text
text-white/90    // Slightly muted white
text-muted-foreground  // System muted color
border-black/10  // Subtle borders
border-white/20  // Borders on dark
```

### Typography Scale (FROM HERO)
```tsx
// Headlines
text-5xl md:text-6xl lg:text-7xl font-bold  // H1 (Hero only)
text-4xl md:text-5xl font-bold              // H2 (Section titles)
text-2xl md:text-3xl font-bold              // H3 (Subsection titles)
text-xl font-bold                           // H4 (Card titles)

// Body text
text-xl md:text-2xl      // Hero subtitle
text-lg                  // Large body
text-base                // Standard body
text-sm                  // Small text
text-xs                  // Captions
```

### Spacing Scale (FROM HERO)
```tsx
py-24    // Section padding (medium)
py-32    // Section padding (large)
gap-8    // Card grid gaps
gap-16   // Large content gaps
px-4     // Container horizontal padding
mb-16    // Section title bottom margin
```

---

## Section 2: Trust Indicators Bar

### Container Specifications
```tsx
<section className="max-w-7xl mx-auto px-4 py-16 bg-white">
  <motion.div
    className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
  >
    {/* Badge items */}
  </motion.div>
</section>
```

### Individual Badge Component
```tsx
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.3 }}
  transition={{
    duration: 0.5,
    delay: index * 0.1,  // 0ms, 100ms, 200ms, 300ms
    ease: "easeOut"
  }}
  whileHover={{
    y: -4,
    transition: { duration: 0.2, ease: "easeOut" }
  }}
  className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-black/5 transition-colors duration-200"
>
  {/* Icon Container */}
  <motion.div
    className="w-12 h-12 rounded-full bg-black/10 flex items-center justify-center"
    whileHover={{
      scale: 1.1,
      rotate: 5,
      backgroundColor: "rgba(0, 0, 0, 0.15)",
      transition: { duration: 0.2, ease: "easeOut" }
    }}
  >
    <badge.icon className="w-6 h-6 text-black" />
  </motion.div>

  {/* Text */}
  <h3 className="font-semibold text-sm text-center text-black">
    {badge.title}
  </h3>
  <p className="text-xs text-black/60 text-center">
    {badge.subtitle}
  </p>
</motion.div>
```

### Mobile Adjustments
```tsx
// Mobile-specific classes (automatically applied via responsive prefixes)
gap-8      // Mobile gap (default)
md:gap-12  // Desktop gap (increased)

// Touch feedback (add to motion.div)
whileTap={{ scale: 0.98 }}
```

### Animation Timeline
```
0ms:    Section container fades in
0ms:    Badge 1 starts fade-in + slide-up
100ms:  Badge 2 starts fade-in + slide-up
200ms:  Badge 3 starts fade-in + slide-up
300ms:  Badge 4 starts fade-in + slide-up
500ms:  Badge 1 completes
600ms:  Badge 2 completes
700ms:  Badge 3 completes
800ms:  Badge 4 completes (Total: 800ms)
```

---

## Section 3: How It Works Timeline

### Container Specifications
```tsx
<section className="max-w-6xl mx-auto px-4 py-24 bg-black/5">
  {/* Headline */}
  <motion.h2
    className="text-4xl md:text-5xl font-bold text-center mb-16 text-black"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.4 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
  >
    How It Works
  </motion.h2>

  {/* Timeline Container */}
  <div className="relative grid grid-cols-1 md:grid-cols-3 gap-16">
    {/* Horizontal Line (Desktop Only) */}
    <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-black/20">
      <motion.div
        className="h-full bg-black"
        initial={{ width: "0%" }}
        whileInView={{ width: "100%" }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
    </div>

    {/* Step items */}
  </div>
</section>
```

### Step Component
```tsx
<motion.div
  className="relative flex flex-col items-center gap-4"
  initial={{ opacity: 0, scale: 0.8 }}
  whileInView={{ opacity: 1, scale: 1 }}
  viewport={{ once: true, amount: 0.4 }}
  transition={{
    duration: 0.3,
    delay: 0.2 + (index * 0.15),  // 200ms, 350ms, 500ms
    ease: "easeOut"
  }}
>
  {/* Node */}
  <motion.div
    className="w-16 h-16 rounded-full bg-black flex items-center justify-center relative z-10 shadow-lg"
    whileHover={{
      scale: 1.1,
      boxShadow: "0 0 20px rgba(0, 0, 0, 0.3)",
      transition: { duration: 0.2, ease: "easeOut" }
    }}
  >
    <motion.div
      whileHover={{
        rotate: 5,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
    >
      <step.icon className="w-8 h-8 text-white" />
    </motion.div>
  </motion.div>

  {/* Content */}
  <div className="text-center">
    <h3 className="text-2xl md:text-3xl font-bold mb-2 text-black">
      {step.title}
    </h3>
    <p className="text-base md:text-lg text-black/60 mb-3">
      {step.description}
    </p>
    <div className="flex gap-2 justify-center items-center flex-wrap">
      <Badge variant="secondary" className="text-xs bg-black text-white">
        {step.badge}
      </Badge>
      {step.supporting.map((Icon, idx) => (
        <Icon key={idx} className="w-4 h-4 text-black/60" />
      ))}
    </div>
  </div>
</motion.div>
```

### Mobile Adjustments
```tsx
// Timeline line - hidden on mobile
className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-black/20"

// Reduce gap on mobile
gap-12 md:gap-16

// Reduce animation delay on mobile
const mobileDelay = isMobile ? 0.1 + (index * 0.08) : 0.2 + (index * 0.15);
```

### Animation Timeline
```
0ms:    Headline fades in + slides up
0ms:    Line starts drawing (0% → 100% width)
200ms:  Node 1 + Content scales in + fades (0.8 → 1.0)
350ms:  Node 2 + Content scales in + fades
400ms:  Line drawing complete
500ms:  Node 3 + Content scales in + fades
800ms:  Animation complete (Total: 800ms)
```

---

## Section 4: Interactive Demo

### Container Specifications
```tsx
<section className="max-w-5xl mx-auto px-4 py-32 bg-gradient-to-b from-background to-muted/30">
  {/* Headlines */}
  <motion.h2
    className="text-4xl md:text-5xl font-bold text-center mb-4"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.5 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
  >
    See It In Action
  </motion.h2>

  <motion.p
    className="text-lg md:text-xl text-center text-muted-foreground mb-8"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.5 }}
    transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
  >
    Click through a sample time capsule journey
  </motion.p>

  {/* Card */}
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true, amount: 0.5 }}
    transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
  >
    <Card className="p-8 shadow-2xl">
      {/* Tabs content */}
    </Card>
  </motion.div>
</section>
```

### Tabs Component Enhancement
```tsx
// Wrap existing Tabs component
<Tabs defaultValue="create" className="w-full" onValueChange={handleTabChange}>
  {/* TabsList - add entrance animation */}
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3, delay: 0.2 }}
  >
    <TabsList className="grid w-full grid-cols-3 mb-8">
      <TabsTrigger
        value="create"
        className="transition-all duration-150"
      >
        <Upload className="w-4 h-4 mr-2" />
        Create
      </TabsTrigger>
      {/* Other triggers */}
    </TabsList>
  </motion.div>

  {/* Tab Content with exit/enter animation */}
  <AnimatePresence mode="wait">
    <TabsContent value="create" className="min-h-[400px] md:min-h-[350px]">
      <motion.div
        key="create"
        initial={{ opacity: 0, x: 30, scale: 0.97 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: -30 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Create content */}
      </motion.div>
    </TabsContent>
  </AnimatePresence>
</Tabs>
```

### Tab Content Mockup Enhancement
```tsx
// Create Tab - Upload Mockup
<div className="border-2 border-dashed border-muted rounded-lg p-12 text-center bg-muted/20 hover:border-black/20 transition-colors duration-200">
  <motion.div
    animate={{
      y: [0, -8, 0]
    }}
    transition={{
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  >
    <FileVideo className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
  </motion.div>
  <p className="text-muted-foreground font-medium mb-2">
    Upload your content here
  </p>
  <p className="text-sm text-muted-foreground">
    Videos, photos, audio, or text messages
  </p>
</div>

// Storage Tab - GitHub Mockup
<motion.div
  className="bg-muted/50 rounded-lg p-8"
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.4, ease: "easeOut" }}
>
  <Github className="w-12 h-12 mb-4 text-primary" />
  <p className="font-mono text-sm mb-2">capsules/birthday-message.mp4</p>
  <p className="text-sm text-muted-foreground">
    Stored securely in your private GitHub repository
  </p>
</motion.div>

// Delivery Tab - Gmail Mockup
<motion.div
  className="bg-white border rounded-lg p-8 shadow-sm"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.4, ease: "easeOut" }}
>
  <motion.div
    animate={{
      scale: [1, 1.05, 1]
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  >
    <Mail className="w-12 h-12 mb-4 text-primary" />
  </motion.div>
  <h4 className="font-bold mb-2">You have a Time Capsule!</h4>
  <p className="text-sm text-muted-foreground">
    A message from the past is ready to open...
  </p>
</motion.div>
```

### Progress Dots Component
```tsx
<div className="flex gap-2 justify-center mt-6">
  {[0, 1, 2].map((dot, index) => (
    <motion.div
      key={dot}
      className={`w-2 h-2 rounded-full ${
        activeTab === dot ? 'bg-primary' : 'bg-muted'
      }`}
      animate={{
        scale: activeTab === dot ? 1.4 : 1,
        backgroundColor: activeTab === dot ? 'hsl(var(--primary))' : 'hsl(var(--muted))'
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    />
  ))}
</div>
```

### Mobile Adjustments
```tsx
// Reduce min-height on mobile
className="min-h-[400px] md:min-h-[350px]"

// Smaller padding on mobile
<Card className="p-6 md:p-8 shadow-2xl">

// Reduce icon sizes on mobile
<Upload className="w-3 h-3 md:w-4 md:h-4 mr-2" />
```

### Animation Timeline
```
Initial load (section enters viewport at 50%):
0ms:    Headline fades in + slide-up
100ms:  Subtitle fades in + slide-up
150ms:  Card container fades in + scales (0.95 → 1.0)
200ms:  Tab triggers fade in
400ms:  Tab content (Create) appears with fade-in
550ms:  Progress dots fade in
700ms:  Initial load complete

Tab switch (user clicks Storage tab):
0ms:    Create content fades out + slides left (0 → -30px)
200ms:  Create content fully hidden
250ms:  Storage content starts fade-in + slide-right (30px → 0)
250ms:  Progress dot 2 scales up (1.0 → 1.4)
250ms:  Progress dot 1 scales down (1.4 → 1.0)
550ms:  Storage content fully visible (Total: 550ms)
```

---

## Section 5: Features Grid

### Container Specifications
```tsx
<section className="max-w-6xl mx-auto px-4 py-24 bg-white">
  {/* Headline */}
  <motion.h2
    className="text-4xl md:text-5xl font-bold text-center mb-16 text-black"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.4 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
  >
    Everything You Need
  </motion.h2>

  {/* Grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
    {/* Feature cards */}
  </div>
</section>
```

### Feature Card Component
```tsx
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.4 }}
  transition={{
    duration: 0.4,
    delay: index * 0.08,  // 0ms, 80ms, 160ms, 240ms, 320ms, 400ms
    ease: "easeOut"
  }}
>
  <Card
    className="p-6 group border-black/10 hover:shadow-lg transition-all duration-200"
  >
    <motion.div
      whileHover={{
        y: -4,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
    >
      {/* Icon Container */}
      <motion.div
        className="w-12 h-12 rounded-lg bg-black/10 flex items-center justify-center mb-4"
        whileHover={{
          scale: 1.1,
          rotate: 5,
          backgroundColor: "rgba(0, 0, 0, 0.15)",
          transition: { duration: 0.2, ease: "easeOut" }
        }}
      >
        <feature.icon className="w-6 h-6 text-black" />
      </motion.div>

      {/* Text */}
      <h3 className="text-xl font-bold mb-2 text-black">
        {feature.title}
      </h3>
      <p className="text-base text-black/60">
        {feature.description}
      </p>
    </motion.div>
  </Card>
</motion.div>
```

### Mobile Adjustments
```tsx
// Single column on mobile
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12"

// Reduce animation delay on mobile
const delay = isMobile ? index * 0.06 : index * 0.08;

// Touch feedback
<motion.div
  whileTap={{ scale: 0.98 }}
>
```

### Animation Timeline
```
Grid entrance (section at 40% viewport):
0ms:    Section headline fades in
100ms:  Card 1 starts fade-in (0 → 1) + slide-up (30px → 0)
180ms:  Card 2 starts fade-in + slide-up
260ms:  Card 3 starts fade-in + slide-up
340ms:  Card 4 starts fade-in + slide-up
420ms:  Card 5 starts fade-in + slide-up
500ms:  Card 6 starts fade-in + slide-up
900ms:  Card 6 completes (Total: 900ms)
```

---

## Section 6: Use Cases

### Container Specifications
```tsx
<section className="max-w-7xl mx-auto px-4 py-32 bg-white">
  {/* Headlines */}
  <motion.h2
    className="text-4xl md:text-5xl font-bold text-center mb-4 text-black"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.35 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
  >
    Real Stories, Real Connections
  </motion.h2>

  <motion.p
    className="text-xl text-center text-black/60 mb-16"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.35 }}
    transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
  >
    See how people use time capsules to create meaningful moments
  </motion.p>

  {/* Use cases */}
  <div className="space-y-16 md:space-y-24">
    {/* Use case items */}
  </div>
</section>
```

### Use Case Component
```tsx
<motion.div
  className={`grid md:grid-cols-2 gap-12 items-center ${
    i % 2 === 1 ? 'md:flex-row-reverse' : ''
  }`}
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.4 }}
  transition={{ duration: 0.5, ease: "easeOut" }}
>
  {/* Image placeholder */}
  <motion.div
    className={`relative overflow-hidden rounded-xl shadow-lg h-80 md:h-96 ${
      i % 2 === 1 ? 'md:order-2' : ''
    }`}
    whileHover={{
      scale: 1.05,
      transition: { duration: 0.3, ease: "easeOut" }
    }}
  >
    <div className={`w-full h-full bg-gradient-to-br ${useCase.gradient} relative`}>
      {/* Large faded icon overlay */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center opacity-10"
        whileHover={{
          opacity: 0.15,
          transition: { duration: 0.2, ease: "easeOut" }
        }}
      >
        <useCase.icon className="w-32 h-32 text-white" />
      </motion.div>
    </div>
  </motion.div>

  {/* Content */}
  <motion.div
    className={i % 2 === 1 ? 'md:order-1' : ''}
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true, amount: 0.4 }}
    transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
  >
    <div className="flex items-center gap-3 mb-4">
      {/* Icon */}
      <motion.div
        className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center"
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
      >
        <useCase.icon className="w-5 h-5 text-black" />
      </motion.div>

      {/* Title */}
      <h3 className="text-2xl md:text-3xl font-bold text-black">
        {useCase.title}
      </h3>
    </div>

    {/* Quote */}
    <motion.blockquote
      className="text-lg md:text-xl text-black/60 mb-4 italic"
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
    >
      "{useCase.quote}"
    </motion.blockquote>

    {/* Badge */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{
        duration: 0.3,
        delay: 0.6,
        ease: "easeOut"
      }}
    >
      <Badge variant="secondary" className="bg-black text-white">
        {useCase.badge}
      </Badge>
    </motion.div>
  </motion.div>
</motion.div>
```

### Mobile Adjustments
```tsx
// Stack vertically on mobile (remove alternating layout)
className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center"

// Reduce image height on mobile
className="h-64 md:h-80"

// Increase spacing between use cases
className="space-y-16 md:space-y-24"

// Remove hover effects on mobile (automatically handled by whileHover)
```

### Animation Timeline
```
Use Case entrance (scrolls into view at 40%):
0ms:    Image + Content start fade-in (0 → 1) + slide-up (30px → 0)
100ms:  Icon fades + scales (0.8 → 1.0)
400ms:  Quote text emphasized with subtle scale (0.98 → 1.0)
600ms:  Badge fades in + slides up
700ms:  All elements settled (Total: 700ms)
```

---

## Section 7: Tech Stack + Security

### Container Specifications
```tsx
<section className="max-w-6xl mx-auto px-4 py-24 bg-black/5">
  <div className="grid md:grid-cols-2 gap-16">
    {/* Tech Stack Column */}
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-8 text-black">
        Built on Enterprise Tech
      </h2>
      <ul className="space-y-4">
        {/* List items */}
      </ul>
    </motion.div>

    {/* Security Column */}
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-8 text-black">
        Security & Privacy
      </h2>
      <ul className="space-y-4">
        {/* List items */}
      </ul>
    </motion.div>
  </div>
</section>
```

### List Item Component
```tsx
<motion.li
  className="flex items-start gap-3 p-3 rounded-lg hover:bg-black/5 transition-colors duration-200"
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.4 }}
  transition={{
    duration: 0.3,
    delay: 0.15 + (index * 0.06),  // Tech: 150ms, 210ms, 270ms, 330ms, 390ms
    ease: "easeOut"
  }}
  whileHover={{
    x: 4,
    backgroundColor: "rgba(0, 0, 0, 0.08)",
    borderLeft: "3px solid hsl(var(--primary))",
    transition: { duration: 0.2, ease: "easeOut" }
  }}
>
  {/* Icon */}
  <motion.div
    whileHover={{
      scale: 1.1,
      rotate: 5,
      transition: { duration: 0.2, ease: "easeOut" }
    }}
  >
    <item.icon className="w-8 h-8 text-black flex-shrink-0" />
  </motion.div>

  {/* Text */}
  <div>
    <h4 className="font-semibold text-base md:text-lg text-black">
      {item.title}
    </h4>
    <p className="text-sm text-black/60">
      {item.subtitle}
    </p>
  </div>
</motion.li>
```

### Mobile Adjustments
```tsx
// Stack vertically on mobile
className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16"

// Reduce icon size on mobile
className="w-6 h-6 md:w-8 md:h-8 text-black flex-shrink-0"

// Reduce animation delay on mobile
const delay = isMobile ? 0.15 + (index * 0.05) : 0.15 + (index * 0.06);
```

### Animation Timeline
```
Section entrance (at 40% viewport):
0ms:    Tech Stack heading fades in + slides up
50ms:   Security heading fades in + slides up
150ms:  Tech item 1 fades in + slides up
210ms:  Tech item 2 fades in + slides up
270ms:  Tech item 3 fades in + slides up
330ms:  Tech item 4 fades in + slides up
390ms:  Tech item 5 fades in + slides up
450ms:  Security item 1 fades in + slides up
510ms:  Security item 2 fades in + slides up
570ms:  Security item 3 fades in + slides up
630ms:  Security item 4 fades in + slides up
690ms:  Security item 5 fades in + slides up
750ms:  Security item 6 fades in + slides up
800ms:  All animations complete (Total: 800ms)
```

---

## Section 8: FAQ

### Container Specifications
```tsx
<section className="max-w-4xl mx-auto px-4 py-24 bg-white">
  {/* Headlines */}
  <motion.h2
    className="text-4xl md:text-5xl font-bold text-center mb-4 text-black"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.4 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
  >
    Frequently Asked Questions
  </motion.h2>

  <motion.p
    className="text-center text-base md:text-lg text-black/60 mb-12"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.4 }}
    transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
  >
    Everything you need to know about Memory Time Capsule
  </motion.p>

  {/* Accordion Container */}
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.4 }}
    transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
  >
    <Accordion type="single" collapsible className="w-full">
      {/* FAQ items */}
    </Accordion>
  </motion.div>
</section>
```

### FAQ Item Component (Enhanced AccordionItem)
```tsx
// Add icons mapping
const faqIcons = [Gift, Clock, Shield, FileVideo, Github, FileText, Mail, Calendar];

{faqs.map((faq, i) => (
  <motion.div
    key={i}
    initial={{ opacity: 0, y: 15 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.4 }}
    transition={{
      duration: 0.3,
      delay: 0.3 + (i * 0.05),  // 300ms, 350ms, 400ms, 450ms, 500ms, 550ms, 600ms, 650ms
      ease: "easeOut"
    }}
  >
    <AccordionItem value={`item-${i + 1}`}>
      <AccordionTrigger className="text-lg font-semibold hover:text-primary hover:bg-black/3 px-4 py-4 transition-all duration-200 rounded-lg group">
        <div className="flex items-center gap-3 text-left">
          {/* Icon */}
          <motion.div
            whileHover={{
              scale: 1.1,
              transition: { duration: 0.2, ease: "easeOut" }
            }}
          >
            {React.createElement(faqIcons[i], {
              className: "w-5 h-5 text-black flex-shrink-0"
            })}
          </motion.div>

          {/* Question text */}
          <span className="group-hover:translate-x-1 transition-transform duration-200">
            {faq.q}
          </span>
        </div>
      </AccordionTrigger>

      <AccordionContent className="text-muted-foreground px-4 py-2">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
        >
          {faq.a}
        </motion.div>
      </AccordionContent>
    </AccordionItem>
  </motion.div>
))}
```

### Footer Link Enhancement
```tsx
<motion.p
  className="text-center mt-8 text-sm text-muted-foreground"
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true, amount: 0.4 }}
  transition={{ duration: 0.3, delay: 0.7, ease: "easeOut" }}
>
  Still have questions?{' '}
  <motion.a
    href="/support"
    className="text-primary hover:underline inline-flex items-center gap-1"
    whileHover={{ x: 4 }}
    transition={{ duration: 0.2, ease: "easeOut" }}
  >
    Contact Support
    <motion.span
      initial={{ opacity: 0, x: -10 }}
      whileHover={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      →
    </motion.span>
  </motion.a>
</motion.p>
```

### Mobile Adjustments
```tsx
// Reduce trigger padding on mobile
className="px-3 md:px-4 py-3 md:py-4"

// Smaller icons on mobile
className="w-4 h-4 md:w-5 md:h-5 text-black flex-shrink-0"

// Reduce stagger delay on mobile
const delay = isMobile ? 0.3 + (i * 0.04) : 0.3 + (i * 0.05);
```

### Animation Timeline
```
Section entrance (at 40% viewport):
0ms:    Headline fades in + slides up
100ms:  Subtitle fades in + slides up
200ms:  Accordion container fades in + slides up
300ms:  Question 1 fades in + slides up
350ms:  Question 2 fades in + slides up
400ms:  Question 3 fades in + slides up
450ms:  Question 4 fades in + slides up
500ms:  Question 5 fades in + slides up
550ms:  Question 6 fades in + slides up
600ms:  Question 7 fades in + slides up
650ms:  Question 8 fades in + slides up
700ms:  Footer link fades in
700ms:  All questions visible (Total: 700ms)
```

---

## Section 9: Final CTA

### Container Specifications
```tsx
<section className="max-w-3xl mx-auto px-4 py-32 mb-16">
  <motion.div
    className="bg-black rounded-2xl p-12 md:p-16 text-center relative overflow-hidden border border-white/10"
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true, amount: 0.5 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    style={{
      boxShadow: "0 0 20px rgba(255, 255, 255, 0.1)"
    }}
    animate={{
      boxShadow: [
        "0 0 20px rgba(255, 255, 255, 0.1)",
        "0 0 30px rgba(255, 255, 255, 0.15)",
        "0 0 20px rgba(255, 255, 255, 0.1)"
      ]
    }}
    transition={{
      boxShadow: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }}
  >
    <div className="relative z-10">
      {/* Content */}
    </div>
  </motion.div>
</section>
```

### Content Components
```tsx
{/* Headline */}
<motion.h2
  className="text-4xl md:text-5xl font-bold text-white mb-6"
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.5 }}
  transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
>
  Ready to Send a Message to the Future?
</motion.h2>

{/* Subtitle */}
<motion.p
  className="text-lg md:text-xl text-white/90 mb-8"
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.5 }}
  transition={{ duration: 0.4, delay: 0.25, ease: "easeOut" }}
>
  Join thousands creating meaningful time capsules. Free forever, secure by design, ready in minutes.
</motion.p>

{/* CTA Button */}
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  whileInView={{ opacity: 1, scale: 1 }}
  viewport={{ once: true, amount: 0.5 }}
  transition={{ duration: 0.4, delay: 0.35, ease: "easeOut" }}
>
  <Button
    asChild
    size="lg"
    variant="outline"
    className="relative px-12 py-6 text-lg mb-4 bg-black text-white border-white/20 hover:bg-white/10"
  >
    <motion.div
      whileHover={{
        scale: 1.05,
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      whileTap={{ scale: 0.97 }}
    >
      <Link to={isAuthenticated() ? "/create" : "/auth"}>
        {/* Animated border (same as hero) */}
        <div className={cn(/* same as hero */)}>
          <motion.div className={cn(/* same as hero */)} />
        </div>
        {isAuthenticated() ? "Create Time Capsule" : "Get Started Free"}
      </Link>
    </motion.div>
  </Button>
</motion.div>

{/* Fine Print */}
<motion.p
  className="text-sm text-white/70 mb-8"
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true, amount: 0.5 }}
  transition={{ duration: 0.3, delay: 0.5, ease: "easeOut" }}
>
  No credit card required • 2 minute setup
</motion.p>

{/* Trust Indicators */}
<motion.div
  className="flex items-center justify-center gap-4 text-white/80 text-sm"
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true, amount: 0.5 }}
  transition={{ duration: 0.3, delay: 0.6, ease: "easeOut" }}
>
  <motion.div
    className="flex items-center gap-2"
    whileHover={{
      scale: 1.1,
      transition: { duration: 0.2, ease: "easeOut" }
    }}
  >
    <Github className="w-5 h-5" />
    <span>GitHub</span>
  </motion.div>

  <motion.div
    className="flex items-center gap-2"
    whileHover={{
      scale: 1.1,
      transition: { duration: 0.2, ease: "easeOut" }
    }}
  >
    <Mail className="w-5 h-5" />
    <span>Gmail</span>
  </motion.div>
</motion.div>
```

### Mobile Adjustments
```tsx
// Reduce padding on mobile
className="p-8 md:p-12 lg:p-16"

// Reduce font sizes on mobile
className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6"
className="text-base md:text-lg lg:text-xl text-white/90 mb-8"

// Maintain button size (strong CTA)
className="px-10 md:px-12 py-5 md:py-6 text-base md:text-lg"
```

### Animation Timeline
```
Section entrance (at 50% viewport):
0ms:    Card container fades in (0 → 1) + scales (0.95 → 1.0)
0ms:    Border glow starts pulsing (continuous 6s loop)
150ms:  Headline fades in + slides up (30px → 0)
250ms:  Subtitle fades in + slides up (20px → 0)
350ms:  CTA button fades in + scales (0.95 → 1.0)
500ms:  Fine print fades in
600ms:  Trust indicators fade in
800ms:  All elements visible (Total: 800ms)

Background animation (continuous):
Border glow:
  0-3000ms:   Shadow 20px/0.1 → 30px/0.15
  3000-6000ms: Shadow 30px/0.15 → 20px/0.1
  Infinite loop
```

---

## Implementation Checklist

### Dependencies Required
```bash
# Already installed (verify)
npm install framer-motion lucide-react
```

### Import Statements
```tsx
import { motion, AnimatePresence } from "motion/react";
import { useInView } from "motion/react";  // If needed for custom viewport detection
```

### Viewport Settings (Standard)
```tsx
viewport={{
  once: true,      // Animate only once
  amount: 0.3-0.5  // 30-50% visibility trigger
}}
```

### Easing Functions (Standard)
```tsx
// Use these consistently
transition={{
  duration: 0.3-0.5,  // Fast animations
  ease: "easeOut",    // Standard easing
  delay: 0-0.7        // Stagger delays
}}
```

### Reduced Motion Support
```tsx
// Add to each animated section
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Conditional animations
{!prefersReducedMotion && (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    // ...
  />
)}

// OR simpler: just fade
initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 30 }}
```

---

## Testing Checklist

### Animation Testing
- [ ] All sections animate on scroll into viewport
- [ ] Stagger delays feel natural (50-80ms intervals)
- [ ] No jank or layout shift during animations
- [ ] Hover states work on desktop
- [ ] Touch feedback works on mobile
- [ ] Reduced motion preference respected

### Responsive Testing
- [ ] Mobile (375px): All text readable, touch targets 44px+
- [ ] Tablet (768px): Layout transitions smoothly
- [ ] Desktop (1440px+): Proper spacing, hover effects active
- [ ] All breakpoints: No horizontal scroll

### Performance Testing
- [ ] Page loads in < 3 seconds
- [ ] Animations run at 60fps
- [ ] No memory leaks from continuous animations
- [ ] Scroll performance smooth with all animations

### Accessibility Testing
- [ ] Keyboard navigation works
- [ ] Screen reader announces sections correctly
- [ ] Focus indicators visible
- [ ] Color contrast passes WCAG AA
- [ ] All interactive elements accessible

---

## Phase 3 Implementation Order

### Day 1: Foundation (Sections 2-3)
1. Section 2: Trust Indicators Bar (simple stagger)
2. Section 3: Timeline (line draw + node animations)

### Day 2: Interactivity (Sections 4-5)
3. Section 4: Interactive Demo (tab transitions)
4. Section 5: Features Grid (card entrance + hover)

### Day 3: Content (Sections 6-7)
5. Section 6: Use Cases (image hover + content reveal)
6. Section 7: Tech Stack (list item stagger)

### Day 4: Polish (Sections 8-9)
7. Section 8: FAQ (accordion with icons)
8. Section 9: Final CTA (border glow + entrance)

### Day 5: Testing & Refinement
- Mobile responsive testing
- Animation timing adjustments
- Performance optimization
- Accessibility audit

### Day 6: Final Polish & Deployment
- Browser compatibility testing
- Final visual tweaks
- Deployment preparation

---

## Key Success Metrics

### Animation Quality
- Section entrances: 650-900ms (fast, confident)
- Hover responses: <200ms (instant feedback)
- No sluggish animations (no >1s durations)
- Smooth 60fps performance

### Visual Consistency
- All sections use black/white palette
- Typography scale consistent
- Spacing follows 8px grid
- Hover patterns standardized (scale 1.1, rotate 5deg, lift -4px)

### User Experience
- Scroll feels progressive (not jumpy)
- Animations enhance, not distract
- Mobile feels native (no hover-only features)
- Reduced motion works seamlessly

---

*End of Phase 2 UI Design Specifications*
*Ready for Phase 3 Implementation*
*All code is copy-paste ready*
