# Quick Start Guide: UI/UX Revamp Workflow

## 📖 Overview

This workflow transforms the Memory Time Capsule landing page using a structured 3-phase approach with specialized AI agents.

**Workflow**: UX Research → UI Design → Frontend Implementation

---

## 🎯 What You'll Get

### Before
- Basic landing page with emojis
- Simple card grid layout
- Minimal animations
- Standard ShadCN components

### After
- Modern, polished landing page
- Professional visual design
- Smooth animations & micro-interactions
- Mobile-optimized responsive design
- Improved accessibility
- Cohesive brand experience

---

## 📋 Prerequisites

- [x] Repository cloned
- [x] File structure created (already done!)
- [x] ShadCN configured (components.json exists)
- [x] All workflow documents ready

---

## 🚀 Execution Steps

### Step 1: Review the Scope (5 min)

Read the scope document to understand what will be built:
```
thoughts/workflows/ui-ux-revamp/00-scope.md
```

**Key points to verify**:
- Locked features (Hero, How It Works, Features, CTA)
- Technology stack (React, TypeScript, ShadCN, Tailwind)
- Constraints (no new features, no web search)

---

### Step 2: Execute Phase 1 - UX Research (30-45 min)

**Goal**: Define layout structure and interaction patterns

**How to run**:
1. Open `thoughts/workflows/ui-ux-revamp-workflow.md`
2. Find the section: **"Prompt for Phase 1"**
3. Copy the entire prompt (starts with "You are working on Phase 1...")
4. Paste into a **new Claude Code session**
5. Let the agents work

**What happens**:
- `ux-researcher` analyzes current implementation
- `whimsy-injector` defines micro-interactions
- Files created in `phase1-ux/` folder
- Handoff document created: `handoff-to-ui.md`

**Completion check**:
- [ ] `phase1-ux/research.md` exists
- [ ] `phase1-ux/layout-structure.md` exists
- [ ] `phase1-ux/interaction-patterns.md` exists
- [ ] `phase1-ux/handoff-to-ui.md` exists

---

### Step 3: Execute Phase 2 - UI Design (30-45 min)

**Goal**: Create design system and component specifications

**How to run**:
1. Verify Phase 1 handoff exists: `phase1-ux/handoff-to-ui.md`
2. Open `thoughts/workflows/ui-ux-revamp-workflow.md`
3. Find the section: **"Prompt for Phase 2"**
4. Copy the entire prompt (starts with "You are working on Phase 2...")
5. Paste into a **new Claude Code session**
6. Let the agents work

**What happens**:
- `ui-designer` creates design system and component specs
- `brand-guardian` ensures consistency and accessibility
- `visual-storyteller` creates visual flow
- ShadCN registries searched for modern components
- Files created in `phase2-ui/` folder
- Handoff document created: `handoff-to-dev.md`

**Completion check**:
- [ ] `phase2-ui/design-system.md` exists
- [ ] `phase2-ui/component-specs.md` exists
- [ ] `phase2-ui/animation-specs.md` exists
- [ ] `phase2-ui/handoff-to-dev.md` exists

---

### Step 4: Execute Phase 3 - Implementation (1-2 hours)

**Goal**: Build the new landing page

**How to run**:
1. Verify Phase 2 handoff exists: `phase2-ui/handoff-to-dev.md`
2. Open `thoughts/workflows/ui-ux-revamp-workflow.md`
3. Find the section: **"Prompt for Phase 3"**
4. Copy the entire prompt (starts with "You are working on Phase 3...")
5. Paste into a **new Claude Code session**
6. Let the agents work

**What happens**:
- Required ShadCN components installed
- `frontend-developer` implements new Home.tsx
- `whimsy-injector` adds final polish
- `test-writer-fixer` runs tests and verifies build
- Files created in `phase3-frontend/` folder
- `frontend/src/pages/Home.tsx` updated

**Completion check**:
- [ ] `phase3-frontend/implementation-log.md` exists
- [ ] `phase3-frontend/component-decisions.md` exists
- [ ] `phase3-frontend/completion-report.md` exists
- [ ] `frontend/src/pages/Home.tsx` updated
- [ ] Build passes: `npm run build`
- [ ] No TypeScript errors

---

## 🧪 Testing & QA

After Phase 3 completes:

### Automated Tests
```bash
cd frontend
npm run build
npm run dev
```

### Manual Testing Checklist
- [ ] Desktop Chrome (1920px)
- [ ] Desktop Firefox (1920px)
- [ ] Desktop Safari (1920px)
- [ ] Tablet (768px)
- [ ] Mobile (375px)
- [ ] Mobile (320px - smallest)
- [ ] Keyboard navigation works
- [ ] Screen reader accessible
- [ ] All animations smooth (60fps)
- [ ] All CTAs functional
- [ ] Routing preserved
- [ ] Auth logic intact

---

## 📊 Progress Tracking

Use this to track overall progress:

```
[ ] Phase 1 Complete - UX handoff created
[ ] Phase 2 Complete - UI handoff created
[ ] Phase 3 Complete - Implementation done
[ ] QA Complete - All tests passed
[ ] Ready to Deploy
```

---

## 🎨 What Makes This Different

### Traditional Approach
1. Designer creates mockups
2. Developer implements mockups
3. Back-and-forth on details
4. Multiple revision rounds

### This Workflow
1. **UX-first**: Layout & interactions defined before visuals
2. **Clear handoffs**: Each phase has complete specs
3. **No ambiguity**: Exact features locked in scope
4. **Systematic**: Each agent has a specific role
5. **Documented**: Every decision captured
6. **Testable**: Clear success criteria

---

## 🔧 Troubleshooting

### Phase won't start
- Verify input files exist
- Check previous phase handoff completed
- Review error messages

### Agents adding features
- Stop and remind: "Follow scope in 00-scope.md exactly"
- Point to constraint section
- Ask to remove out-of-scope additions

### Build fails
- Check TypeScript errors
- Verify ShadCN components installed
- Review implementation log
- Run `npm run build` for details

### Design doesn't match vision
- Phase 2 is the time to iterate on design
- Review `design-system.md` and `component-specs.md`
- Request refinements before Phase 3
- Can re-run Phase 2 if needed

---

## 📞 Need Help?

1. **Review workflow document**: `ui-ux-revamp-workflow.md`
2. **Check scope document**: `00-scope.md`
3. **Review phase handoffs**: Each phase creates detailed handoff
4. **Read agent descriptions**: `.claude/agents/` folder

---

## 🎯 Next Steps After Completion

Once all phases complete and QA passes:

1. **Create PR**:
   ```bash
   git checkout -b feature/landing-page-revamp
   git add .
   git commit -m "Revamp landing page UI/UX with modern design"
   git push origin feature/landing-page-revamp
   ```

2. **Deploy to staging** (if available)

3. **Get stakeholder approval**

4. **Merge to main and deploy**

5. **Apply same workflow to other routes**:
   - `/create` - Capsule creation page
   - `/dashboard` - User dashboard
   - `/open/:id` - Capsule viewing page
   - `/auth` - Authentication pages

---

**Ready to begin? Start with Phase 1!**

Open `thoughts/workflows/ui-ux-revamp-workflow.md` and find the "Prompt for Phase 1" section.
