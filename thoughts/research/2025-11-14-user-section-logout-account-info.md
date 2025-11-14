---
date: 2025-11-14T04:10:13+00:00
researcher: Claude
git_commit: 2317c93301580fca18d122a6f9f3ae14fde3cafd
branch: claude/add-logout-user-info-0169KZJi5gECc8MZLwKQzhbK
repository: memory-time-capsule
topic: "User Section: Logout, Username Display, and Connected Accounts"
tags: [research, codebase, authentication, user-interface, header, user-menu]
status: complete
last_updated: 2025-11-14
last_updated_by: Claude
---

# Research: User Section Implementation - Logout, Username, and Connected Accounts

**Date**: 2025-11-14T04:10:13+00:00
**Researcher**: Claude
**Git Commit**: 2317c93301580fca18d122a6f9f3ae14fde3cafd
**Branch**: claude/add-logout-user-info-0169KZJi5gECc8MZLwKQzhbK
**Repository**: memory-time-capsule

## Research Question

How to implement a user section that shows:
1. Logout option for authenticated users
2. Display of logged-in username
3. Display of which Gmail and GitHub accounts are connected

**MVP Scope**: Popup/dropdown on top-right user icon click showing:
- Username
- "Log out" button

**Future Scope**: Dedicated settings/profile section with full account details

## Summary

The Memory Time Capsule app has a complete dual-OAuth authentication system (GitHub + Gmail) with user session management. Currently, the top-right header displays a user avatar but has **no dropdown menu, logout functionality, or user info display**. All user data (username, email, GitHub account, Gmail connection status) is already available in the Zustand auth store and can be accessed immediately. No dropdown or modal UI patterns currently exist in the codebase, but Radix UI Dialog component is available in dependencies and can be used.

**Key Findings:**
- User avatar exists at `frontend/src/components/Header.tsx:77-86`
- User session data available via `useAuthStore()` hook
- Logout requires: `clearAuth()` from store + redirect to `/auth`
- No existing dropdown/popup patterns; need to implement from scratch
- Available libraries: `@radix-ui/react-dialog` installed but unused

## Detailed Findings

### 1. Current Header Implementation

**File**: `frontend/src/components/Header.tsx`

**Current Structure (lines 8-90):**
```typescript
const Header = () => {
  const { session, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Left: Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🎁</span>
          <span className="font-bold text-xl">Time Capsule</span>
        </Link>

        {/* Right: Navigation */}
        <div className="flex items-center gap-4">
          {isAuthenticated() ? (
            <>
              <Button variant="ghost" onClick={() => navigate("/dashboard")}>
                Dashboard
              </Button>
              <Button onClick={() => navigate("/create")}>
                Create Capsule
              </Button>
              {session?.githubAvatar && (
                <Avatar>
                  <AvatarImage
                    src={session.githubAvatar}
                    alt={session.githubName || session.githubLogin || "User"}
                  />
                  <AvatarFallback>
                    {(session.githubName || session.githubLogin || "U")
                      .charAt(0)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}
            </>
          ) : (
            <Button onClick={() => navigate("/auth")}>Get Started Free</Button>
          )}
        </div>
      </div>
    </header>
  );
};
```

**Current Behavior:**
- Avatar displays at `Header.tsx:77-86`
- Shows GitHub avatar image or fallback initial
- No click handler (avatar is purely decorative)
- No dropdown menu exists

### 2. Available User Data

**Auth Store**: `frontend/src/store/authStore.ts:14-35`

**Available State:**
```typescript
{
  userId: string | null,          // GitHub numeric ID
  session: {
    userId: string,
    githubLogin: string,          // ✅ Username for display
    githubName: string | null,    // ✅ Full name (if available)
    githubEmail: string | null,   // ✅ Email
    githubAvatar: string,         // ✅ Avatar URL
    repoName: string,             // Repository name
    repoFullName: string,         // Full path (owner/repo)
    repoUrl: string,              // GitHub repo URL
    githubConnected: boolean,     // ✅ GitHub connection status
    gmailConnected: boolean,      // ✅ Gmail connection status
    createdAt: string             // Account creation timestamp
  } | null,
  setUserId: (userId: string) => void,
  setSession: (session: UserSession) => void,
  clearAuth: () => void,          // ✅ Logout method available
  isAuthenticated: () => boolean
}
```

**Usage in Components:**
```typescript
import { useAuthStore } from '../store/authStore';

const { session, isAuthenticated, clearAuth } = useAuthStore();

// Access user info
session?.githubLogin        // Username: "anjaysahoo"
session?.githubName         // Full name: "Anjay Sahoo"
session?.githubEmail        // Email: "anjay@example.com"
session?.githubConnected    // true/false
session?.gmailConnected     // true/false
```

### 3. Logout Implementation

**Required Steps:**
1. Call `clearAuth()` from auth store
2. Navigate to `/auth` page
3. Clear occurs at `authStore.ts:24` (sets userId and session to null)
4. Persistence middleware auto-syncs to localStorage

**Example Implementation:**
```typescript
const handleLogout = () => {
  clearAuth();
  navigate('/auth');
};
```

**Session Clearing (`authStore.ts:21-24`):**
```typescript
clearAuth: () =>
  set(() => ({
    userId: null,
    session: null,
  }))
```

### 4. UI Patterns for Dropdown/Popup

**Currently Available UI Libraries:**
- `@radix-ui/react-dialog` (installed, unused)
- `@radix-ui/react-alert-dialog` (installed, unused)

**Existing State Management Patterns:**

No dropdown/popup patterns exist, but found similar interactive patterns:

**Pattern 1: Click Handler with State Toggle** (`pages/Create.tsx:27-90`)
```typescript
const [showMenu, setShowMenu] = useState(false);

<div className="relative">
  <button onClick={() => setShowMenu(!showMenu)}>
    <Avatar />
  </button>

  {showMenu && (
    <div className="absolute right-0 top-full mt-2 ...">
      {/* Menu content */}
    </div>
  )}
</div>
```

**Pattern 2: Conditional Rendering** (`pages/Open.tsx:12-96`)
- Used for state-based UI switching
- Can apply to show/hide dropdown menu

**Pattern 3: Outside Click Detection**
- Not currently implemented in codebase
- Will need to add for proper dropdown UX

### 5. Recommended MVP Implementation Approach

**Option A: Simple Dropdown (No Library)**

Create new component `frontend/src/components/UserMenu.tsx`:

```typescript
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';

export const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { session, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    clearAuth();
    navigate('/auth');
    setIsOpen(false);
  };

  if (!session) return null;

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="focus:outline-none focus:ring-2 focus:ring-primary rounded-full"
      >
        <Avatar>
          <AvatarImage src={session.githubAvatar} alt={session.githubName || session.githubLogin} />
          <AvatarFallback>
            {(session.githubName || session.githubLogin || 'U').charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-background border rounded-lg shadow-lg p-4 z-50">
          {/* User Info */}
          <div className="flex items-center gap-3 pb-3 border-b">
            <Avatar className="h-10 w-10">
              <AvatarImage src={session.githubAvatar} alt={session.githubName || session.githubLogin} />
              <AvatarFallback>
                {(session.githubName || session.githubLogin || 'U').charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">
                {session.githubName || session.githubLogin}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                @{session.githubLogin}
              </p>
            </div>
          </div>

          {/* Connected Accounts */}
          <div className="py-3 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">GitHub</span>
              <span className="text-green-600 font-medium">✓ Connected</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Gmail</span>
              <span className={session.gmailConnected ? "text-green-600 font-medium" : "text-muted-foreground"}>
                {session.gmailConnected ? '✓ Connected' : 'Not connected'}
              </span>
            </div>
          </div>

          {/* Logout Button */}
          <div className="pt-3 border-t">
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Log out
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
```

**Integration in Header (`Header.tsx:77-86`):**

Replace avatar section with:
```typescript
import { UserMenu } from './UserMenu';

// Inside Header component, replace avatar block:
{isAuthenticated() && <UserMenu />}
```

**Option B: Using Radix UI Dialog/Dropdown**

Install Radix Dropdown Menu:
```bash
npm install @radix-ui/react-dropdown-menu
```

Create wrapper component at `frontend/src/components/ui/dropdown-menu.tsx` following shadcn/ui pattern.

Benefits:
- Accessible keyboard navigation
- Screen reader support
- Built-in outside click handling
- Better animation support

### 6. Future: Dedicated Settings Page

**Planned Route**: `/settings` or `/profile`

**Full Feature Set:**
- Edit profile information
- Manage connected accounts (disconnect/reconnect)
- View GitHub repository details
- Email preferences
- Account deletion
- API tokens/access management

**Implementation Notes:**
- Add route in `frontend/src/router.tsx`
- Create `frontend/src/pages/Settings.tsx`
- Add "Settings" link in user dropdown menu
- Use tab navigation for sections (Profile, Connected Accounts, Security, etc.)

## Code References

- `frontend/src/components/Header.tsx:77-86` - Current avatar display location
- `frontend/src/store/authStore.ts:14-35` - Auth store with user data and clearAuth()
- `frontend/src/store/authStore.ts:21-24` - clearAuth() implementation
- `frontend/src/api/types.ts:25-37` - UserSession interface with all available user fields
- `frontend/src/pages/Auth.tsx:23-27` - Example of auth state check and redirect
- `frontend/src/components/ui/avatar.tsx` - Avatar component library

## Architecture Documentation

**Authentication State Flow:**
```
Login → OAuth Callback → Fetch Session → Store in Zustand → Persist to localStorage
                                                    ↓
                              Components access via useAuthStore() hook
                                                    ↓
                              Logout → clearAuth() → Redirect to /auth
```

**Session Storage Layers:**
1. **Backend**: Cloudflare KV (`user_session:{userId}`)
2. **Frontend**: Zustand store (in-memory)
3. **Persistence**: localStorage (`auth-storage` key)

**Current Missing Components:**
- No user dropdown/menu component
- No logout UI
- No user info display beyond avatar
- No settings/profile page

## Implementation Plan for MVP

**Phase 1: User Dropdown Component (MVP)**
1. Create `frontend/src/components/UserMenu.tsx`
2. Implement state management for open/close
3. Add outside click detection
4. Display username and logout button
5. Replace avatar in Header with UserMenu component

**Phase 2: Enhanced User Info Display**
1. Add GitHub and Gmail connection status
2. Display user email
3. Add visual indicators (checkmarks, colors)

**Phase 3: Future Settings Page**
1. Create `/settings` route
2. Build tabbed settings interface
3. Add account management features
4. Implement preferences and security settings

## Related Research

- Authentication system documented in this research (see "Detailed Findings" section)
- No prior research documents found in `thoughts/research/`

## Open Questions

1. Should logout clear all localStorage or just auth data?
2. Should there be a confirmation dialog before logout?
3. Where should users land after logout - `/auth` or `/` (home)?
4. Should the dropdown show GitHub email or GitHub username as primary identifier?
5. Should "Settings" link be added to MVP dropdown or wait for dedicated page?
