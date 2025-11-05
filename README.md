# Memory Time Capsule

A digital time capsule application for sending messages to the future.

## Tech Stack

- **Backend**: Cloudflare Workers + Hono
- **Frontend**: React + TypeScript + Vite + TailwindCSS
- **Storage**: GitHub LFS
- **Scheduling**: GitHub Actions
- **Email**: Gmail API

## Prerequisites

- Node.js 20+
- npm or pnpm
- Cloudflare account (free tier)
- GitHub account
- Gmail account

## Setup

See `docs/setup.md` for detailed setup instructions.

## Development

### Cloudflare Worker (API)
```bash
cd cloudflare-worker
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Project Structure

- `/cloudflare-worker` - API backend (Cloudflare Workers)
- `/frontend` - React frontend
- `/templates` - Email and workflow templates
- `/thoughts` - Research, plans, and documentation

## Documentation

- Architecture: `thoughts/research/architecture.md`
- Implementation Plan: `thoughts/plans/2025-11-05-memory-time-capsule-implementation.md`

