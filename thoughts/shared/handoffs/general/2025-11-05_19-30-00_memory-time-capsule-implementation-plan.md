---
date: 2025-11-05T19:30:00-08:00
researcher: Claude
git_commit: a1696823db736e6dd45d0f6f80de55a25906eefd
branch: master
repository: memory-time-capsule
topic: "Memory Time Capsule - Implementation Plan Creation"
tags: [implementation, planning, cloudflare-workers, github-lfs, gmail-api, time-capsule]
status: complete
last_updated: 2025-11-05
last_updated_by: Claude
type: implementation_strategy
---

# Handoff: Memory Time Capsule Implementation Plan (Phases 1-6)

## Task(s)

**Status: Completed**

Created a comprehensive, detailed implementation plan for the Memory Time Capsule MVP project following the `/create_plan` command pattern. The plan breaks down the original 7-phase structure into more granular phases for smaller implementation contexts.

**Completed work:**
- ✅ Analyzed original plan (`thoughts/plans/original-plan.md`) and architecture document (`thoughts/research/architecture.md`)
- ✅ Reorganized into 12 smaller, focused phases (originally 7 phases)
- ✅ Wrote detailed implementations for Phases 1-6 (backend-focused)
- ✅ Simplified deployment approach (removed local dev, production/development separation)
- ✅ Added MCP tool requirements for each phase
- ✅ Created comprehensive success criteria (automated + manual verification)
- ✅ Included complete code implementations for all backend components

**Phase Coverage:**
- **Phase 1**: Project setup, Cloudflare Workers initialization, environment management
- **Phase 2**: Encryption utilities (AES-256-GCM), KV storage helpers
- **Phase 3**: GitHub OAuth, repository initialization with LFS
- **Phase 4**: Gmail OAuth, email template system
- **Phase 5**: GitHub Actions workflow template for automated unlocking
- **Phase 6**: Capsule creation backend API with file uploads

**Remaining phases (7-12)** need to be added: Capsule retrieval/PIN verification, Frontend setup, Frontend auth/dashboard, Frontend capsule creation, Frontend capsule viewer, Final integration.

## Critical References

1. **Implementation Plan**: `thoughts/plans/2025-11-05-memory-time-capsule-implementation.md` (main artifact)
2. **Original Plan**: `thoughts/plans/original-plan.md` (source material)
3. **Architecture Document**: `thoughts/research/architecture.md` (system design reference)

## Recent Changes

**Created:**
- `thoughts/plans/2025-11-05-memory-time-capsule-implementation.md:1-3213` - Complete implementation plan with Phases 1-6

**Modified:**
- Removed local development setup (`wrangler dev`) - direct deployment only
- Removed `env.development` / `env.production` separation in `wrangler.toml`
- Removed `ENVIRONMENT` variable from all code
- Updated all test commands to use deployed Worker URLs instead of `localhost:8787`
- Simplified setup documentation to focus on direct deployment workflow

## Learnings

1. **Deployment Strategy**: For MVP, simplified approach with direct deployment is more practical than maintaining separate development/production environments. All testing happens against deployed Workers.

2. **MCP Tools per Phase**: Each phase requires specific MCP tools:
   - `cloudflare-docs` for Workers/KV documentation
   - `github` for GitHub API and Actions
   - `cloudflare-bindings` for testing KV operations

3. **Success Criteria Structure**: Each phase has two verification categories:
   - **Automated**: Commands that can be run (curl tests, TypeScript compilation, deployment)
   - **Manual**: Human verification (OAuth flows, email delivery, repository inspection)

4. **GitHub LFS Upload**: The implementation uses Git blob API + commit API for files <100MB rather than true LFS protocol, which works fine for the MVP use case.

5. **Token Security**: Three layers of encryption:
   - OAuth tokens encrypted with AES-256-GCM before KV storage
   - Magic tokens hashed with SHA-256 before storage in capsules.json
   - PIN hashes generated in GitHub Actions and stored (not plaintext)

6. **Gmail Token Refresh**: Gmail access tokens expire, so the implementation includes automatic refresh logic using refresh tokens stored in KV.

## Artifacts

**Primary Artifact:**
- `thoughts/plans/2025-11-05-memory-time-capsule-implementation.md` - Complete implementation plan (Phases 1-6)

**Code Structure Defined** (not yet implemented):
- `cloudflare-worker/src/index.ts` - Main Worker with Hono framework
- `cloudflare-worker/src/utils/encryption.ts` - AES-256-GCM utilities
- `cloudflare-worker/src/utils/kv.ts` - KV storage helpers
- `cloudflare-worker/src/lib/github.ts` - GitHub API client
- `cloudflare-worker/src/lib/github-lfs.ts` - LFS upload helpers
- `cloudflare-worker/src/lib/gmail.ts` - Gmail API client
- `cloudflare-worker/src/lib/email-templates.ts` - Email template generators
- `cloudflare-worker/src/lib/workflow-generator.ts` - GitHub Actions workflow template
- `cloudflare-worker/src/lib/repo-init.ts` - Repository initialization
- `cloudflare-worker/src/routes/auth.ts` - OAuth endpoints
- `cloudflare-worker/src/routes/capsule.ts` - Capsule CRUD endpoints
- `cloudflare-worker/src/types/capsule.ts` - Type definitions
- `cloudflare-worker/wrangler.toml` - Worker configuration
- `docs/setup.md` - Setup and deployment guide

**Reference Documents:**
- `thoughts/plans/original-plan.md` - Original 7-phase plan
- `thoughts/research/architecture.md` - System architecture

## Action Items & Next Steps

**Immediate Next Steps:**

1. **Complete Implementation Plan (Phases 7-12)**:
   - Phase 7: Capsule Retrieval & PIN Verification (backend API)
   - Phase 8: Frontend Foundation (React + Vite + TailwindCSS setup)
   - Phase 9: Frontend Auth & Dashboard
   - Phase 10: Frontend Capsule Creation UI
   - Phase 11: Frontend Capsule Viewer (magic link + PIN entry)
   - Phase 12: Email Templates & Final Integration

2. **Begin Implementation**:
   - Start with Phase 1 once plan is complete
   - Each phase should be implemented sequentially
   - Deploy and test after each phase before proceeding

3. **Frontend Technology Decisions**:
   - Confirm React 18 + TypeScript + Vite stack
   - Decide on state management (Zustand proposed)
   - Determine deployment platform (Cloudflare Pages suggested)

**Long-term Tasks:**
- Post-MVP: Add comprehensive testing strategy (unit, integration, E2E)
- Post-MVP: Add CI/CD pipelines
- Post-MVP: Add monitoring and observability

## Other Notes

**Project Context:**
- This is a greenfield project (no existing code)
- Zero-cost MVP using free tiers: Cloudflare Workers, GitHub LFS, Gmail API, GitHub Actions
- Storage limit: 1GB per user (GitHub LFS free tier)
- Unlock precision: Hourly (GitHub Actions cron free tier)

**Key Design Decisions:**
- **Backend-first approach**: Phases 1-7 complete all backend APIs before frontend work
- **No custom frontend domain yet**: Magic links will use `FRONTEND_URL` environment variable
- **WhatsApp integration**: Click-to-chat only (wa.me links), no API integration
- **PIN generation**: Happens in GitHub Actions workflow at unlock time (not at creation)

**File Structure:**
- Implementation plan follows strict `/create_plan` pattern
- All code blocks include complete implementations (not pseudocode)
- Success criteria separated into automated vs manual verification
- Each phase includes MCP tool requirements for implementation assistance

**Important URLs to Configure:**
- `WORKER_URL`: Cloudflare Worker URL (e.g., `https://memory-time-capsule-worker.your-subdomain.workers.dev`)
- `FRONTEND_URL`: Frontend URL (will be set after frontend deployment)

**Security Notes:**
- Encryption key: 64-character hex (32 bytes) generated via `crypto.randomBytes(32).toString('hex')`
- All secrets managed via `wrangler secret put` command
- GitHub repository secrets used as backup for OAuth tokens

**Next Session Recommendation:**
Continue with writing Phases 7-12, or if plan is considered complete, begin Phase 1 implementation by setting up the Cloudflare Worker project structure.


