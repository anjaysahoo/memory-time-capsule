# Changelog

All notable changes to Memory Time Capsule will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Security

- **CRITICAL FIX**: Removed exposed `/api/auth/github/token/:userId` endpoint that allowed unauthenticated access to GitHub OAuth tokens ([#4](https://github.com/anjaysahoo/memory-time-capsule/issues/4))
  - Impact: Previously, anyone with a known or guessed userId could retrieve GitHub access tokens
  - Solution: Endpoint completely removed (was unused by application)
  - All GitHub token access now exclusively internal via KV storage
  - Breaking change: None (endpoint was never called by legitimate code)

## [1.0.0] - 2025-11-11

### Added

- Complete Memory Time Capsule MVP implementation
- GitHub OAuth integration for repository storage
- Gmail OAuth integration for email notifications
- Time capsule creation with text, image, audio, and video content
- Magic token-based capsule access
- PIN protection for unlocked capsules
- Rate limiting on PIN attempts
- Automated unlock workflow via GitHub Actions
- User dashboard with storage metrics
- GitHub LFS integration for media file storage
- AES-256-GCM encryption for stored OAuth tokens
